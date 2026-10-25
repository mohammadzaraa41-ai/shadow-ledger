import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Camera,
  CheckCircle,
  Crosshair,
  Eye,
  FileText,
  Radio,
  ShieldAlert,
  Video,
  Volume2,
  X,
} from 'lucide-react';
import { sensoryAudio } from '../../game/audioEngine';
import { buildBaseFeed } from '../../game/data';
import { getTargetIntel } from '../../game/store';
import type { Action, GameState } from '../../game/store';
import type { Channel, FeedSegment, NewsItem } from '../../game/types';
import { useLang } from '../../i18n';
import { CH_ICON, FaceCard, useScopeTag } from '../shared';

const CHANNELS: Channel[] = ['NEWS', 'POLICE', 'CAMERA', 'WIRETAP'];

const LEDGER_RULES = [
  {
    num: 'I',
    ar: 'الشخص الذي يُكتب اسمه في هذا الدفتر سيموت حتماً.',
    en: 'The human whose name is written in this note shall die.',
  },
  {
    num: 'II',
    ar: 'لن يُجدي هذا الدفتر نفعاً ما لم يكن الكاتب يمتلك صورة وجه الشخص في ذاكرته أثناء الكتابة، وبذلك لن يتأثر من يحملون نفس الاسم.',
    en: 'This note will not take effect unless the writer has the person’s face in mind when writing their name.',
  },
  {
    num: 'III',
    ar: 'إذا كُتب سبب الوفاة كسكتة قلبية، سيتحقق الموت فوراً وتزداد شبهة المحقق (+15%).',
    en: 'If cause of death is cardiac arrest, death is instant, but suspicion rises (+15%).',
  },
  {
    num: 'IV',
    ar: 'إذا كُتب سبب الوفاة كحادث مدبّر مع روتين ومكان الهدف، يموت في اليوم التالي بلا أي شبهة (0%).',
    en: 'If cause of death is a staged accident matching routine time and location, zero suspicion is generated (0%).',
  },
  {
    num: 'V',
    ar: 'احذر الأخبار غير الموثقة في ملفات الشرطة؛ فالمحقق L يبث طعوماً إقليمية لتحديد موقع حيك السكني.',
    en: 'Beware unverified news; Detective L broadcasts regional decoys to pinpoint your location.',
  },
  {
    num: 'VI',
    ar: 'المحقق L محصّن ضد السكتات القلبية. لا يمكن إسقاطه إلا بحادث مدبّر حتمي.',
    en: 'Master Detective L is immune to cardiac arrest; only a staged accident can seal his fate.',
  },
];

function getShadowWhisper(state: GameState, lang: 'ar' | 'en'): string {
  const { player } = state;
  const isRtl = lang === 'ar';

  if (player.suspicion >= 70) {
    return isRtl
      ? '«أنفاس المحقق L تلفح عنقك.. توقف عن إزهاق الأرواح ليوم واحد، أو لفّق انتحاراً في منطقة بعيدة لإنقاذ رقبتك!»'
      : '«L’s breath is on your neck.. Pause your executions for a day, or frame a suicide in a distant precinct to divert attention!»';
  }

  if (player.suspicion >= 40) {
    return isRtl
      ? '«المحقق يرصد نمط ساعاتك المسائية.. غيّر توقيت الحوادث لساعات أخرى لتكسر ثقته في جدولك!»'
      : '«The detective is correlating your evening activity pattern.. Change execution hours to break his timetable profile!»';
  }

  const isLActive = state.targets.some((t) => t.id === 'L' && !player.kills.includes('L')) && player.kills.length >= 3;
  if (isLActive) {
    return isRtl
      ? '«المحقق L ظهر شخصياً في مقهى الجسر! احذر: قلبه محصّن ضد السكتة، السبيل الوحيد لإسقاطه هو حادث في موعده!»'
      : '«Detective L has appeared at Bridge Cafe! Beware: his heart is shielded; only a staged accident can eliminate him!»';
  }

  const hasDecoy = state.news.some((n) => n.isDecoy && !player.kills.includes(n.id.replace('news-', '')));
  if (hasDecoy) {
    return isRtl
      ? '«أشم رائحة طُعم فاسد.. انظر إلى علامة التحذير الصفراء؛ البثوث الإقليمية غير الموثقة فخاخ منصوبة لك، لا تعض الطعم!»'
      : '«I sense a foul trap.. Look for the yellow warning stamp; unverified regional broadcasts are decoys to trace you!»';
  }

  return isRtl
    ? '«العدالة تناديك.. تصفح كاميرات المراقبة لتكتشف روتين الأهداف، فالحادث المدبّر يبقيك شبحاً بلا أثر.»'
    : '«Justice awaits.. Browse the surveillance feeds to discover target routines; a staged accident leaves no trace.»';
}

function Segment({ seg, state, dispatch }: { seg: FeedSegment; state: GameState; dispatch: (a: Action) => void }) {
  const { tx, lang } = useLang();
  const clip = state.player.clipboard;
  const target = state.targets.find((x) => x.id === ('targetId' in seg ? seg.targetId : ''));

  switch (seg.kind) {
    case 'text':
      return <span>{tx(seg.text)}</span>;
    case 'name':
      return (
        <button
          className={`tok tok-name ${clip.name?.targetId === seg.targetId ? 'on' : ''}`}
          onClick={() => {
            sensoryAudio.playKeystroke();
            dispatch({ type: 'CAPTURE_NAME', targetId: seg.targetId });
            dispatch({ type: 'UNLOCK_INTEL', targetId: seg.targetId, piece: 'surname' });
          }}
          title={lang === 'ar' ? 'اضغط لنسخ الاسم للدفتر' : 'Click to copy name to ledger'}
        >
          {target?.name[lang]}
        </button>
      );
    case 'face':
      return (
        <span
          className={`tok tok-face ${clip.face?.targetId === seg.targetId ? 'on' : ''}`}
          onClick={() => {
            sensoryAudio.playKeystroke();
            dispatch({ type: 'CAPTURE_FACE', targetId: seg.targetId });
            dispatch({ type: 'UNLOCK_INTEL', targetId: seg.targetId, piece: 'face' });
          }}
          title={lang === 'ar' ? 'اضغط لحفظ صورة الوجه بذاكرتك' : 'Click to memorize face'}
        >
          <FaceCard faceId={target?.faceId || `f-${seg.targetId}`} caption={seg.caption} active={clip.face?.targetId === seg.targetId} />
        </span>
      );
    case 'routine': {
      const routine = target?.routine;
      return (
        <button
          className="tok tok-routine"
          onClick={() => {
            sensoryAudio.playKeystroke();
            dispatch({ type: 'CAPTURE_ROUTINE', targetId: seg.targetId });
            dispatch({ type: 'UNLOCK_INTEL', targetId: seg.targetId, piece: 'firstName' });
          }}
          title={lang === 'ar' ? 'اضغط لتدوين الروتين والاسم في الدفتر' : 'Click to copy routine and name'}
        >
          {routine ? `${tx(routine.place)} (${routine.window.from}:00–${routine.window.to}:00)` : ''}
        </button>
      );
    }
  }
}

export function TerminalFeeds({ state, dispatch }: { state: GameState; dispatch: (a: Action) => void }) {
  const { t, tx, lang } = useLang();
  const scopeTag = useScopeTag();
  const [ch, setCh] = useState<Channel>('NEWS');
  const [showWhisper, setShowWhisper] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [playingWiretapId, setPlayingWiretapId] = useState<string | null>(null);

  const handlePlayWiretap = (id: string) => {
    setPlayingWiretapId(id);
    sensoryAudio.playRadioStatic(2.8);
    window.setTimeout(() => {
      setPlayingWiretapId((curr) => (curr === id ? null : curr));
    }, 2800);
  };

  const allNews = useMemo(() => {
    const existingIds = new Set(state.news.map((n) => n.id));
    const missingBase = buildBaseFeed().filter((n) => !existingIds.has(n.id));
    return [...state.news, ...missingBase];
  }, [state.news]);

  const items = allNews.filter(
    (n: NewsItem) => n.channel === ch && (!n.unlockKills || state.player.kills.length >= n.unlockKills),
  );

  const handleQuickTarget = (targetId: string) => {
    sensoryAudio.playKeystroke();
    dispatch({ type: 'CAPTURE_NAME', targetId });
    dispatch({ type: 'CAPTURE_FACE', targetId });
    window.dispatchEvent(new CustomEvent('open-ledger-with-target', { detail: targetId }));
  };

  return (
    <>
      {/* Atmosphere Action Bar */}
      <div className="terminal-actions-bar">
        <button
          id="btn-shadow-whisper"
          className="btn-action-whisper"
          onClick={() => {
            sensoryAudio.playKeystroke();
            setShowWhisper(true);
          }}
          title={t('whisper.title')}
        >
          <Eye size={15} />
          <span>{t('whisper.btn')}</span>
        </button>

        <button
          id="btn-ledger-rules"
          className="btn-action-rules"
          onClick={() => {
            sensoryAudio.playKeystroke();
            setShowRules(true);
          }}
          title={t('rules.title')}
        >
          <BookOpen size={15} />
          <span>{t('rules.btn')}</span>
        </button>
      </div>

      {/* Guide Steps */}
      <div className="guide-steps-banner" role="region" aria-label="Quick instructions">
        <div className="guide-step">
          <span className="step-num">1</span>
          <span>{lang === 'ar' ? 'اختر مجرماً' : 'Select target'}</span>
        </div>
        <span className="step-arrow">➔</span>
        <div className="guide-step">
          <span className="step-num">2</span>
          <span>{lang === 'ar' ? 'تجنب فخاخ L' : "Check for L's traps"}</span>
        </div>
        <span className="step-arrow">➔</span>
        <div className="guide-step">
          <span className="step-num">3</span>
          <span>{lang === 'ar' ? 'نفّذ الحكم بالدفتر' : 'Execute judgment'}</span>
        </div>
      </div>

      {/* Channels Chips */}
      <div className="chips">
        {CHANNELS.map((c) => (
          <button
            key={c}
            id={`chan-${c}`}
            className={`chip ${ch === c ? 'on' : ''}`}
            onClick={() => {
              if (c === 'WIRETAP') {
                sensoryAudio.playRadioStatic(2.0);
              } else if (c === 'CAMERA') {
                sensoryAudio.playCctvSwitch();
              } else {
                sensoryAudio.playKeystroke();
              }
              setCh(c);
            }}
          >
            {CH_ICON[c]} {t(`chan.${c}`)}
          </button>
        ))}
      </div>

      <p className="hint">
        {ch === 'WIRETAP'
          ? (lang === 'ar' ? 'اتصالات لا سلكية مشفرة بين ضباط الشرطة والمحقق L.' : 'Encrypted radio telemetry between task force officers and L.')
          : ch === 'CAMERA'
          ? (lang === 'ar' ? 'بث كاميرات المراقبة الحضرية بالرؤية الليلية لرصد روتين الأهداف.' : 'Urban night-vision CCTV surveillance feeds tracking target movements.')
          : t('hint')}
      </p>

      {items.length === 0 && (
        <div className="empty-feed-card">
          <Volume2 size={24} style={{ opacity: 0.5, margin: '0 auto 8px' }} />
          <p>{lang === 'ar' ? 'لا توجد إشارات أو تسجيلات في هذا الوقت.' : 'No active transmissions at this moment.'}</p>
        </div>
      )}

      {items.map((n, idx) => {
        const targetSeg = n.segments.find((s): s is Extract<FeedSegment, { targetId: string }> => s.kind !== 'text');
        const primaryTargetId = targetSeg?.targetId;
        const targetObj = primaryTargetId ? state.targets.find((x) => x.id === primaryTargetId) : undefined;
        const isDead = targetObj ? state.player.kills.includes(targetObj.id) : false;
        const intel = primaryTargetId ? getTargetIntel(state.player, primaryTargetId) : null;

        return (
          <article
            key={n.id}
            className={`clip ${n.channel === 'WIRETAP' ? 'wiretap-clip' : ''} ${n.channel === 'CAMERA' ? 'cctv-clip' : ''} ${n.verified ? '' : 'unverified'} ${isDead ? 'target-eliminated' : ''}`}
            style={{ ['--tilt' as string]: `${((idx % 3) - 1) * 0.5}deg` }}
          >
            {n.channel === 'CAMERA' && <div className="cctv-scanlines" />}

            {n.channel === 'CAMERA' && (
              <div className="cctv-monitor-header">
                <div className="cctv-rec-badge">
                  <span className="rec-dot" />
                  <b>REC</b>
                  <span className="cctv-timestamp">{`21:${(idx * 7 + 14) % 60 < 10 ? '0' : ''}${(idx * 7 + 14) % 60}:${(idx * 19 + 28) % 60 < 10 ? '0' : ''}${(idx * 19 + 28) % 60}`}</span>
                </div>
                <div className="cctv-cam-id">
                  <Video size={13} />
                  <span>{`CAM-0${idx + 1} // ${n.region ?? 'METRO'} // IR-NIGHT`}</span>
                </div>
                <span className={`cctv-status-pill ${isDead ? 'offline' : 'live'}`}>
                  {isDead ? (lang === 'ar' ? 'انقطعت الإشارة' : 'SIGNAL LOST') : (lang === 'ar' ? 'بث مباشر' : 'LIVE')}
                </span>
              </div>
            )}

            <div className="clip-meta">
              <span>{tx(n.source)}</span>
              <em>{scopeTag(n)}</em>
              {!n.verified && (
                <strong className="stamp-unv">
                  <AlertTriangle size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> {t('unverified')}
                </strong>
              )}
            </div>

            {n.channel === 'WIRETAP' && (
              <div className={`wiretap-audio-banner ${playingWiretapId === n.id ? 'active-audio' : ''}`}>
                <Radio size={14} className="pulse-icon" />
                <span>{lang === 'ar' ? 'تسجيل لاسلكي مسرّب' : 'Intercepted Radio Dispatch'}</span>

                <button
                  type="button"
                  id={`btn-play-wiretap-${n.id}`}
                  className={`btn-play-wiretap ${playingWiretapId === n.id ? 'is-playing' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayWiretap(n.id);
                  }}
                  title={lang === 'ar' ? 'تشغيل البث اللاسلكي وفك التشفير' : 'Play decrypted radio transmission'}
                >
                  <Volume2 size={13} className={playingWiretapId === n.id ? 'pulse-icon' : ''} />
                  <span>
                    {playingWiretapId === n.id
                      ? (lang === 'ar' ? 'جارٍ البث...' : 'Transmitting...')
                      : (lang === 'ar' ? 'استمع للبث 🔊' : 'Play Audio 🔊')}
                  </span>
                </button>

                <div className={`wiretap-equalizer ${playingWiretapId === n.id ? 'active' : ''}`}>
                  <span className="bar b1" />
                  <span className="bar b2" />
                  <span className="bar b3" />
                  <span className="bar b4" />
                  <span className="bar b5" />
                </div>
              </div>
            )}

            {state.player.hasShinigamiEyes && targetObj && !isDead && (
              <div
                className="shinigami-eye-vision-banner"
                onClick={() => handleQuickTarget(targetObj.id)}
                title={lang === 'ar' ? 'كشف عين الظل: اضغط لاستهدافه بالدفتر فوراً' : 'Shadow Sight: click to target'}
              >
                <Eye size={16} className="shinigami-eye-pulse" />
                <div className="shinigami-info">
                  <span className="shinigami-tag">{lang === 'ar' ? 'رؤية عين الظل الكاشفة' : 'Shadow Sight Vision'}</span>
                  <b className="shinigami-true-name">{targetObj.name[lang]}</b>
                </div>
                <span className="shinigami-prompt">{lang === 'ar' ? '«تنفيذ الحكم 🩸»' : '«Target 🩸»'}</span>
              </div>
            )}

            <h3>{tx(n.headline)}</h3>

            <div className="clip-body">
              {n.segments.map((seg, i) => (
                <Segment key={i} seg={seg} state={state} dispatch={dispatch} />
              ))}
            </div>

            {n.channel === 'CAMERA' && primaryTargetId && !isDead && (
              <div className="cctv-action-bar">
                <button
                  type="button"
                  className="btn-cctv-lock-routine"
                  onClick={() => {
                    sensoryAudio.playCctvSwitch();
                    dispatch({ type: 'CAPTURE_ROUTINE', targetId: primaryTargetId });
                    dispatch({ type: 'CAPTURE_NAME', targetId: primaryTargetId });
                    dispatch({ type: 'CAPTURE_FACE', targetId: primaryTargetId });
                    window.dispatchEvent(new CustomEvent('open-ledger-with-target', { detail: primaryTargetId }));
                  }}
                  title={lang === 'ar' ? 'تثبيت روتين ومكان الهدف وفتح الدفتر لحادث مدبّر' : 'Lock routine & location for staged accident'}
                >
                  <Camera size={14} />
                  <b>{lang === 'ar' ? '📹 تثبيت الروتين والمكان بالدفتر' : '📹 Lock Routine & Location'}</b>
                </button>
              </div>
            )}

            {primaryTargetId && !isDead && (
              <div className="intel-progress-bar-card">
                <div className="intel-card-header">
                  <div className="intel-card-title">
                    <FileText size={13} />
                    <span>{lang === 'ar' ? 'ملف التحري الاستخباري:' : 'Investigation Dossier:'}</span>
                    <b className="intel-percent-tag">{intel?.percent ?? 0}%</b>
                  </div>
                  <span className={`intel-status-pill ${intel?.isComplete ? 'complete' : 'gathering'}`}>
                    {intel?.isComplete
                      ? (lang === 'ar' ? '✨ اكتمل كشف الهوية!' : '✨ Fully Unmasked!')
                      : (lang === 'ar' ? '🔍 جارٍ جمع الأدلة' : '🔍 Gathering Clues')}
                  </span>
                </div>

                <div className="intel-meter-track">
                  <div
                    className={`intel-meter-fill ${intel?.isComplete ? 'pulse-gold' : ''}`}
                    style={{ width: `${intel?.percent ?? 0}%` }}
                  />
                </div>

                <div className="intel-shards-row">
                  <span
                    className={`intel-shard-badge ${intel?.hasSurname ? 'unlocked' : 'locked'}`}
                    onClick={() => {
                      sensoryAudio.playKeystroke();
                      dispatch({ type: 'CAPTURE_NAME', targetId: primaryTargetId });
                      dispatch({ type: 'UNLOCK_INTEL', targetId: primaryTargetId, piece: 'surname' });
                    }}
                    title={lang === 'ar' ? 'اللقب من شريط الأخبار (انقر للجمع)' : 'Surname clue'}
                  >
                    {intel?.hasSurname ? '✓' : '○'} {lang === 'ar' ? '📰 اللقب والشهرة' : '📰 Surname'}
                  </span>
                  <span
                    className={`intel-shard-badge ${intel?.hasFace ? 'unlocked' : 'locked'}`}
                    onClick={() => {
                      sensoryAudio.playKeystroke();
                      dispatch({ type: 'CAPTURE_FACE', targetId: primaryTargetId });
                      dispatch({ type: 'UNLOCK_INTEL', targetId: primaryTargetId, piece: 'face' });
                    }}
                    title={lang === 'ar' ? 'صورة الوجه من ملفات الشرطة (انقر للجمع)' : 'Face photo clue'}
                  >
                    {intel?.hasFace ? '✓' : '○'} {lang === 'ar' ? '📷 صورة الوجه' : '📷 Face Photo'}
                  </span>
                  <span
                    className={`intel-shard-badge ${intel?.hasFirstName ? 'unlocked' : 'locked'}`}
                    onClick={() => {
                      sensoryAudio.playKeystroke();
                      dispatch({ type: 'CAPTURE_ROUTINE', targetId: primaryTargetId });
                      dispatch({ type: 'UNLOCK_INTEL', targetId: primaryTargetId, piece: 'firstName' });
                    }}
                    title={lang === 'ar' ? 'الاسم والروتين من كاميرات المراقبة (انقر للجمع)' : 'Routine clue'}
                  >
                    {intel?.hasFirstName ? '✓' : '○'} {lang === 'ar' ? '📡 الروتين والاسم' : '📡 Routine / Name'}
                  </span>
                </div>
              </div>
            )}

            {primaryTargetId && !isDead && n.channel !== 'CAMERA' && (
              <div className="quick-target-bar">
                <button
                  className={`btn-quick-target ${intel?.isComplete ? 'btn-dossier-ready' : 'btn-dossier-gathering'}`}
                  onClick={() => {
                    if (intel?.isComplete) {
                      handleQuickTarget(primaryTargetId);
                    } else {
                      sensoryAudio.playKeystroke();
                      if (n.channel === 'NEWS') {
                        dispatch({ type: 'CAPTURE_NAME', targetId: primaryTargetId });
                        dispatch({ type: 'UNLOCK_INTEL', targetId: primaryTargetId, piece: 'surname' });
                      } else if (n.channel === 'POLICE') {
                        dispatch({ type: 'CAPTURE_FACE', targetId: primaryTargetId });
                        dispatch({ type: 'UNLOCK_INTEL', targetId: primaryTargetId, piece: 'face' });
                      } else {
                        dispatch({ type: 'CAPTURE_ROUTINE', targetId: primaryTargetId });
                        dispatch({ type: 'UNLOCK_INTEL', targetId: primaryTargetId, piece: 'firstName' });
                      }
                      window.dispatchEvent(new CustomEvent('open-ledger-with-target', { detail: primaryTargetId }));
                    }
                  }}
                  title={
                    intel?.isComplete
                      ? (lang === 'ar' ? 'اكتمل الملف 100%! افتح الدفتر لتدوين الاسم' : 'Dossier complete! Inscribe in ledger')
                      : (lang === 'ar' ? 'جمع الأدلة وإدراجها في ملف الهدف' : 'Collect clue into target dossier')
                  }
                >
                  {intel?.isComplete ? <Crosshair size={15} /> : <FileText size={15} />}
                  <b>
                    {intel?.isComplete
                      ? (lang === 'ar' ? '⚡ اكتمل الملف! افتح الدفتر لتدوين الاسم' : '⚡ Dossier 100%! Inscribe Name')
                      : (lang === 'ar' ? '📂 جمع الدليل وفتح سجل التحقيق' : '📂 Collect Clue & Open Dossier')}
                  </b>
                </button>

                {n.verified ? (
                  <span className="badge-safe" title={lang === 'ar' ? 'ملف مؤكد لدى الشرطة' : 'Verified police record'}>
                    <CheckCircle size={12} /> {lang === 'ar' ? 'موثق وآمن' : 'Safe target'}
                  </span>
                ) : (
                  <span className="badge-trap" title={lang === 'ar' ? 'قد يكون فخاً نصبه L' : 'Possible decoy by L'}>
                    <ShieldAlert size={12} /> {lang === 'ar' ? '⚠️ تحذير: فخ محتمل!' : '⚠️ Trap Warning!'}
                  </span>
                )}
              </div>
            )}

            {isDead && (
              <div className="eliminated-badge">
                <span>✕ {lang === 'ar' ? 'تم القضاء عليه' : 'ELIMINATED'}</span>
              </div>
            )}
          </article>
        );
      })}

      {showWhisper && (
        <div className="modal-overlay" onClick={() => setShowWhisper(false)}>
          <div className="shadow-whisper-card" onClick={(e) => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="whisper-header">
              <div className="whisper-title-group">
                <span className="shadow-eye-glyph">👁️</span>
                <h3>{t('whisper.title')}</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setShowWhisper(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="whisper-body">
              <p className="whisper-quote">{getShadowWhisper(state, lang)}</p>
            </div>
            <div className="whisper-footer">
              <button className="btn-dismiss-whisper" onClick={() => setShowWhisper(false)}>
                {lang === 'ar' ? 'فهمتُ الإشارة' : 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRules && (
        <div className="modal-overlay" onClick={() => setShowRules(false)}>
          <div className="dn-rules-card" onClick={(e) => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="dn-rules-header">
              <span className="dn-rule-crest">DEATH LEDGER</span>
              <h2>{t('rules.title')}</h2>
              <button className="btn-close-modal" onClick={() => setShowRules(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="dn-rules-list">
              {LEDGER_RULES.map((r) => (
                <div key={r.num} className="dn-rule-row">
                  <span className="dn-rule-num">{r.num}</span>
                  <p className="dn-rule-text">{lang === 'ar' ? r.ar : r.en}</p>
                </div>
              ))}
            </div>
            <div className="dn-rules-footer">
              <button className="btn-dismiss-rules" onClick={() => setShowRules(false)}>
                {lang === 'ar' ? 'إغلاق القواعد' : 'Close Rules'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
