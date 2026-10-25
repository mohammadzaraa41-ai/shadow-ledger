import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCheck, Eye } from 'lucide-react';
import { hapticEngine, sensoryAudio } from '../game/audioEngine';
import { multiplayer } from '../game/multiplayer';
import { unlockSteamAchievement } from '../game/steam';
import { buildCommand, getTargetIntel, isCommand } from '../game/store';
import type { Action, GameState, LedgerInput } from '../game/store';
import type { DeathMethod, Faction, TargetProfile, Text } from '../game/types';
import { useLang } from '../i18n';
import { InteractiveDeathNotePen } from './InteractiveDeathNotePen';
import { DeathMethodSelector, type ScheduledKillItem } from './ledger/DeathMethodSelector';
import { DossierReel, type TargetCategory } from './ledger/DossierReel';
import { PinnedTargetBoard } from './ledger/PinnedTargetBoard';
import { ShinigamiDealModal } from './ledger/ShinigamiDealModal';

function splitTargetName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { surname: fullName, firstName: fullName, full: fullName };
  }
  return {
    surname: parts[0],
    firstName: parts.slice(1).join(' '),
    full: fullName,
  };
}

export function Ledger({
  state,
  dispatch,
  onPenWrite,
}: {
  state: GameState;
  dispatch: (a: Action) => void;
  onPenWrite?: (name: string) => void;
}) {
  const { t, tx, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [faceId, setFaceId] = useState<string | null>(null);
  const [method, setMethod] = useState<DeathMethod>('CARDIAC');
  const [hour, setHour] = useState<number | undefined>();
  const [faction, setFaction] = useState<Faction | undefined>();
  const [delayMode, setDelayMode] = useState<'INSTANT' | 'DELAY_60S'>('INSTANT');
  const [targetCategory, setTargetCategory] = useState<TargetCategory>('ALL');
  const [scheduledKills, setScheduledKills] = useState<
    Array<ScheduledKillItem & { targetId: string; input: LedgerInput }>
  >([]);
  const [msg, setMsg] = useState<Text | null>(null);
  const [showEyeDealModal, setShowEyeDealModal] = useState(false);

  // Pen tracking & animation states
  const [penPos, setPenPos] = useState({ x: 20, y: 0 });
  const [isPenWriting, setIsPenWriting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const measureSpanRef = useRef<HTMLSpanElement>(null);
  const writingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopWritingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef<number | null>(null);

  // Smooth typewriter pen animation gliding character-by-character
  const animatePenWriting = (targetText: string) => {
    if (writingTimerRef.current) clearInterval(writingTimerRef.current);
    if (stopWritingTimerRef.current) clearTimeout(stopWritingTimerRef.current);

    setName('');
    setIsPenWriting(true);
    let index = 0;

    writingTimerRef.current = setInterval(() => {
      index++;
      setName(targetText.slice(0, index));
      sensoryAudio.playLetterScratch();

      if (index >= targetText.length) {
        if (writingTimerRef.current) clearInterval(writingTimerRef.current);
        stopWritingTimerRef.current = setTimeout(() => {
          setIsPenWriting(false);
        }, 320);
      }
    }, 55);
  };

  // Select target from Dossier Cards
  const selectTarget = (tgt: TargetProfile, autoWrite: boolean = false) => {
    if (!tgt.alive) return;
    sensoryAudio.playLetterScratch();
    hapticEngine.trigger('tap');

    setSelectedTargetId(tgt.id);
    setFaceId(tgt.id);
    setMsg(null);

    const intel = getTargetIntel(state.player, tgt.id);
    if (intel.isComplete) {
      sensoryAudio.startHeartbeat(76);
    } else {
      sensoryAudio.stopHeartbeat();
    }

    if (autoWrite) {
      animatePenWriting(tgt.name[lang]);
    } else {
      setName('');
    }

    const routine = state.player.knownRoutines[tgt.id];
    setHour(routine ? routine.window.from : undefined);
  };

  // Append or write individual name shard
  const appendShard = (shard: string) => {
    sensoryAudio.playLetterScratch();
    hapticEngine.trigger('tap');
    const newName = name.trim() ? `${name.trim()} ${shard}` : shard;
    animatePenWriting(newName);
  };

  // Clear current target selection
  const clearTarget = () => {
    sensoryAudio.playKeystroke();
    sensoryAudio.stopHeartbeat();
    setSelectedTargetId(null);
    setFaceId(null);
    setName('');
    setHour(undefined);
    setMsg(null);
  };

  // Precise Anime Hand nib baseline tracking
  const updatePenPosition = () => {
    if (!containerRef.current || !measureSpanRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const textWidth = measureSpanRef.current.offsetWidth;
    const isRtl = lang === 'ar';

    if (isRtl) {
      const calculatedX = Math.max(-20, containerWidth - 14 - textWidth);
      setPenPos({ x: calculatedX, y: 0 });
    } else {
      const calculatedX = Math.min(containerWidth - 60, 10 + textWidth);
      setPenPos({ x: calculatedX, y: 0 });
    }
  };

  useEffect(() => {
    updatePenPosition();
  }, [name, lang, open]);

  useEffect(() => {
    const handleResize = () => updatePenPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [name, lang]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (writingTimerRef.current) clearInterval(writingTimerRef.current);
      if (stopWritingTimerRef.current) clearTimeout(stopWritingTimerRef.current);
      sensoryAudio.stopHeartbeat();
    };
  }, []);

  // Listen to Target Selection triggered from OSINT Terminal (news/camera click)
  useEffect(() => {
    const handleQuick = (e: Event) => {
      const custom = e as CustomEvent<string>;
      const targetId = custom.detail;
      const target = state.targets.find((x) => x.id === targetId);
      if (target && target.alive) {
        setOpen(true);
        const intel = getTargetIntel(state.player, target.id);
        selectTarget(target, intel.isComplete);
      }
    };
    window.addEventListener('open-ledger-with-target', handleQuick);
    return () => window.removeEventListener('open-ledger-with-target', handleQuick);
  }, [state.targets, lang]);

  // Handle Heartbeat sound when ledger is closed or unmounted
  useEffect(() => {
    if (!open) {
      sensoryAudio.stopHeartbeat();
    } else if (selectedTargetId) {
      const intel = getTargetIntel(state.player, selectedTargetId);
      if (intel.isComplete) {
        sensoryAudio.startHeartbeat(76);
      }
    }
  }, [open, selectedTargetId, state.player.intelProgress]);

  // Scheduled Executions Countdown Ticker
  useEffect(() => {
    if (scheduledKills.length === 0) return;
    const timer = setInterval(() => {
      setScheduledKills((prev) => {
        const next: typeof prev = [];
        for (const item of prev) {
          if (item.secondsLeft <= 1) {
            sensoryAudio.playThunder();
            hapticEngine.trigger('fatal');
            dispatch({ type: 'SUBMIT', input: item.input });
            multiplayer.send({
              type: 'SCHEDULED_KILL',
              targetName: item.name,
              delaySec: 60,
            });
            if (onPenWrite) onPenWrite(item.name);
          } else {
            if (item.secondsLeft % 5 === 0) sensoryAudio.playClockTick();
            next.push({ ...item, secondsLeft: item.secondsLeft - 1 });
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [scheduledKills, dispatch, onPenWrite]);

  const selectedTarget = state.targets.find((x) => x.id === selectedTargetId) || null;
  const targetIntel = selectedTarget ? getTargetIntel(state.player, selectedTarget.id) : null;
  const routine = selectedTarget ? state.player.knownRoutines[selectedTarget.id] : undefined;
  const splitInfo = selectedTarget ? splitTargetName(selectedTarget.name[lang]) : null;

  const isNameMatched = Boolean(
    selectedTarget &&
      name.trim() &&
      (name.trim().toLowerCase() === selectedTarget.name[lang].trim().toLowerCase() ||
        name.trim().toLowerCase() === selectedTarget.name.ar.trim().toLowerCase() ||
        name.trim().toLowerCase() === selectedTarget.name.en.trim().toLowerCase())
  );

  // Accelerate heartbeat when name matches target identity
  useEffect(() => {
    if (open && isNameMatched) {
      sensoryAudio.stopHeartbeat();
      sensoryAudio.startHeartbeat(105);
    }
  }, [isNameMatched, open]);

  const submit = () => {
    if (!selectedTarget) {
      sensoryAudio.playKeystroke();
      return setMsg({
        ar: 'اختر ملف هدف من السجل أعلاه أولاً قبل تنفيذ الحكم.',
        en: 'Select a target dossier from the list above before writing.',
      });
    }

    const intel = getTargetIntel(state.player, selectedTarget.id);
    if (!intel.isComplete && !state.player.hasShinigamiEyes) {
      sensoryAudio.playLetterScratch();
      hapticEngine.trigger('tension');
      sensoryAudio.playThunder();
      return setMsg({
        ar: `⚠️ ملف التحقيق غير مكتمل (${intel.percent}%)! يجب جمع بقية الأدلة (اللقب، صورة الوجه، والروتين) من محطة التحري قبل كتابة الاسم في الدفتر.`,
        en: `⚠️ Investigation dossier incomplete (${intel.percent}%)! Uncover all clues (surname, face photo, routine) in the terminal before execution.`,
      });
    }

    if (!isNameMatched) {
      sensoryAudio.playLetterScratch();
      hapticEngine.trigger('tension');
      dispatch({ type: 'REGISTER_SPELLING_ERROR', targetId: selectedTarget.id });
      return setMsg({
        ar: '⚠️ الاسم المكتوب لا يطابق هوية الهدف بدقة! احذر: 4 أخطاء في تهجئة الاسم تجعل الشخص محصناً ضد الدفتر للأبد!',
        en: '⚠️ The written name does not exactly match this target! Warning: 4 spelling errors grant permanent immunity!',
      });
    }

    const input: LedgerInput = {
      name: selectedTarget.name[lang],
      faceTargetId: selectedTarget.id,
      method,
      hour,
      faction,
    };

    const res = buildCommand(state, input);
    if (!isCommand(res)) {
      sensoryAudio.playLetterScratch();
      hapticEngine.trigger('tension');
      sensoryAudio.playThunder();
      return setMsg(res);
    }

    sensoryAudio.stopHeartbeat();

    if (delayMode === 'DELAY_60S') {
      setIsExecuting(true);
      setIsPenWriting(true);
      sensoryAudio.playLetterScratch();
      sensoryAudio.playClockTick();
      hapticEngine.trigger('tension');

      setTimeout(() => {
        setScheduledKills((prev) => [
          ...prev,
          {
            id: `sched-${Date.now()}`,
            name: selectedTarget.name[lang],
            targetId: selectedTarget.id,
            secondsLeft: 60,
            input,
          },
        ]);
        setMsg(null);
        setIsExecuting(false);
        setIsPenWriting(false);
        clearTarget();
      }, 550);
      return;
    }

    // Dramatic Death Note execution flourish
    setIsExecuting(true);
    setIsPenWriting(true);
    sensoryAudio.playLetterScratch();
    sensoryAudio.playThunder();
    hapticEngine.trigger('fatal');

    setTimeout(() => {
      dispatch({ type: 'SUBMIT', input });
      setMsg(null);
      setIsExecuting(false);
      setIsPenWriting(false);

      if (onPenWrite) {
        onPenWrite(selectedTarget.name[lang]);
      }

      // Trigger Steam Achievements
      unlockSteamAchievement('ACH_FIRST_INK');
      if (method === 'ACCIDENT') {
        unlockSteamAchievement('ACH_ACCIDENT_ARTIST');
      }
      if (method === 'FALSE_LEAD') {
        unlockSteamAchievement('ACH_FALSE_TRAIL');
      }
      if (selectedTarget.id === 'L' && method === 'ACCIDENT') {
        unlockSteamAchievement('ACH_CHECKMATE');
      }

      clearTarget();
    }, 650);
  };

  const onDown = (e: React.PointerEvent) => {
    drag.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onUp = (e: React.PointerEvent) => {
    if (drag.current === null) return;
    const dy = e.clientY - drag.current;
    drag.current = null;
    if (dy < -25) setOpen(true);
    else if (dy > 25) setOpen(false);
    else setOpen((o) => !o);
  };

  return (
    <aside className={`ledger ${open ? 'open' : ''}`} aria-label="Death Ledger">
      <div className="cover" id="ledger-handle" onPointerDown={onDown} onPointerUp={onUp}>
        <span className="cover-title">DEATH LEDGER</span>
        <span className="cover-sub">
          {state.player.pending.length > 0 ? t('cover.pending', { n: state.player.pending.length }) : t('cover.swipe')}
        </span>
      </div>

      <div className="page">
        {/* Shadow Eye Deal Banner */}
        <div className="shinigami-deal-bar">
          {state.player.hasShinigamiEyes ? (
            <div className="shinigami-active-badge">
              <Eye size={14} className="pulse-icon" />
              <span>{lang === 'ar' ? '👁️ عيون الظل نشطة (الهويات مكشوفة)' : '👁️ Shadow Sight Active'}</span>
            </div>
          ) : (
            <button
              type="button"
              id="btn-trigger-eye-deal"
              className="btn-trigger-eye-deal"
              onClick={() => {
                sensoryAudio.playKeystroke();
                setShowEyeDealModal(true);
              }}
              title={lang === 'ar' ? 'صفقة عيون الظل: كشف الهويات فوراً' : 'Shadow Eye Pact: Instant identity reveal'}
            >
              <Eye size={13} />
              <span>{lang === 'ar' ? '👁️ عقد صفقة عين الظل' : '👁️ Shadow Eye Deal'}</span>
              <span className="deal-cost-pill">{lang === 'ar' ? '-3 أيام' : '-3 Days'}</span>
            </button>
          )}
        </div>

        {/* Tactical Surveillance & Camouflage Bar */}
        {state.surveillanceRegions.includes(state.player.homeRegion) && (
          <div className={`surveillance-warning-bar ${state.player.isCamouflaged ? 'camouflaged' : 'danger'}`}>
            <div className="surv-alert-content">
              <Camera size={15} className="pulse-icon text-red" />
              <div className="surv-text-stack">
                <b>
                  {lang === 'ar'
                    ? '⚠️ رُصدت كاميرات مراقبة وتنصت سري في حيك السكني!'
                    : '⚠️ Hidden Surveillance Cameras active in your sector!'}
                </b>
                <small>
                  {state.player.isCamouflaged
                    ? (lang === 'ar' ? '🛡️ التمويه نشط (الكتابة آمنة ومحمية)' : '🛡️ Camouflage Active (Safe to write)')
                    : (lang === 'ar' ? 'الكتابة بدون تمويه تؤدي للمداهمة فوراً!' : 'Writing without camouflage triggers instant SWAT raid!')}
                </small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-toggle-camouflage ${state.player.isCamouflaged ? 'active' : ''}`}
              onClick={() => {
                sensoryAudio.playLetterScratch();
                dispatch({ type: 'ACTIVATE_CAMOUFLAGE' });
              }}
            >
              {state.player.isCamouflaged
                ? (lang === 'ar' ? '✓ التمويه مفعل (4 ساعات)' : '✓ Camouflaged (4h)')
                : (lang === 'ar' ? '🍿 حيلة التمويه (Potato Chip Trick)' : '🍿 Camouflage Trick')}
            </button>
          </div>
        )}

        {/* 1. Target Dossiers Reel */}
        <DossierReel
          state={state}
          selectedTargetId={selectedTargetId}
          targetCategory={targetCategory}
          onSelectCategory={setTargetCategory}
          onSelectTarget={(tgt) => selectTarget(tgt)}
        />

        {/* 2. Pinned Evidence Board & Name Writing Area */}
        <section className="active-target-pinned-zone">
          <PinnedTargetBoard
            selectedTarget={selectedTarget}
            targetIntel={targetIntel}
            routine={routine}
            hasShinigamiEyes={state.player.hasShinigamiEyes}
            splitInfo={splitInfo}
            onClearTarget={clearTarget}
            onAppendShard={appendShard}
            onInscribeFull={(full) => animatePenWriting(full)}
          />

          {/* Interactive Ruled Notebook Line */}
          <div className="notebook-line-wrapper">
            <div className="notebook-line-header">
              <span className="ruled">{t('led.name')}</span>
              {isNameMatched && (
                <span className="name-matched-badge">
                  <CheckCheck size={13} /> {lang === 'ar' ? 'الاسم مطابق تماماً للهوية في ذهنك!' : 'Name matches target memory!'}
                </span>
              )}
            </div>

            <div className={`dn-writing-line-container ${isNameMatched ? 'name-ready' : ''}`} ref={containerRef}>
              <input
                type="text"
                id="input-victim-name"
                className="dn-manual-input"
                value={name}
                onChange={(e) => {
                  sensoryAudio.playLetterScratch();
                  hapticEngine.trigger('tap');
                  setName(e.target.value);
                }}
                placeholder={lang === 'ar' ? 'اكتب اسم الضحية هنا بيدك، أو انقر شظايا الاسم أعلاه…' : 'Type victim name here, or tap shards above…'}
                autoComplete="off"
                spellCheck={false}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />

              <span ref={measureSpanRef} className="dn-measure-span" aria-hidden="true">
                {name || ''}
              </span>

              {isExecuting && <div className="execution-ink-slash" />}

              <InteractiveDeathNotePen
                x={penPos.x}
                y={penPos.y}
                isWriting={isPenWriting}
                isExecuting={isExecuting}
                isRtl={lang === 'ar'}
              />
            </div>
          </div>
        </section>

        {/* 3. Method of Death & Timing Controls */}
        <DeathMethodSelector
          method={method}
          onSelectMethod={(m) => {
            sensoryAudio.playKeystroke();
            hapticEngine.trigger('tap');
            setMethod(m);
          }}
          routine={routine}
          hour={hour}
          onSelectHour={setHour}
          faction={faction}
          onSelectFaction={setFaction}
          delayMode={delayMode}
          onSelectDelayMode={setDelayMode}
          scheduledKills={scheduledKills}
        />

        {msg && <p className="msg">{tx(msg)}</p>}

        <button
          id="btn-confirm"
          className={`seal ${!selectedTarget || (!targetIntel?.isComplete && !state.player.hasShinigamiEyes) ? 'disabled' : ''} ${isNameMatched ? 'ready-to-kill pulse-execute' : ''}`}
          onClick={submit}
        >
          {isNameMatched
            ? (lang === 'ar' ? '🩸 تنفيذ الحكم وإزهاق الروح' : '🩸 Execute Verdict')
            : t('led.write')}
        </button>
      </div>

      {/* 4. Shinigami Eye Deal Modal */}
      {showEyeDealModal && (
        <ShinigamiDealModal
          lang={lang}
          dispatch={dispatch}
          onClose={() => setShowEyeDealModal(false)}
        />
      )}
    </aside>
  );
}
