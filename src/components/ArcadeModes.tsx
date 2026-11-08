import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CHARADE_CATS,
  HEADSUP_CATS,
  buildHeadsUpDeck,
  pickCharadeCard,
  type ArcadeCard,
  type CharadeCatId,
  type HeadsUpCatId,
} from '../game/arcadeData';
import { sound } from '../game/sound';
import { fireConfetti } from '../game/confetti';
import { useLang } from '../i18n';
import { CardIllustration } from './CardIllustration';

export type ArcadeModeType = 'charades' | 'headsup';

interface Props {
  initialMode: ArcadeModeType;
  playerName?: string;
  /** When true, winning grants immunity from the round's punishment; failing sends to the wheel. */
  isRedemption?: boolean;
  onRedeemSuccess?: () => void;
  onRedeemFail?: () => void;
  onOpenWheel?: () => void;
  onClose: () => void;
}

const HEADSUP_TARGET_REDEEM = 3;
const HEADSUP_TARGET_STANDALONE = 5;

export function ArcadeModal({
  initialMode,
  playerName,
  isRedemption = false,
  onRedeemSuccess,
  onRedeemFail,
  onOpenWheel,
  onClose,
}: Props) {
  const { t, lang } = useLang();
  const [mode, setMode] = useState<ArcadeModeType>(initialMode);
  const [phase, setPhase] = useState<'intro' | 'play' | 'won' | 'lost'>('intro');

  // Category selection state for both modes
  const [charadeCat, setCharadeCat] = useState<CharadeCatId>('all');
  const [headsupCat, setHeadsupCat] = useState<HeadsUpCatId>('all');

  const duration = isRedemption ? 45 : 60;
  const targetScore = isRedemption ? HEADSUP_TARGET_REDEEM : HEADSUP_TARGET_STANDALONE;
  const [left, setLeft] = useState(duration);

  // Charades state
  const [charade, setCharade] = useState<ArcadeCard>(() => pickCharadeCard('all'));
  const [skipsLeft, setSkipsLeft] = useState(2);

  // Heads-Up state
  const [deck, setDeck] = useState<ArcadeCard[]>(() => buildHeadsUpDeck('all', 24));
  const [cardIdx, setCardIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [flash, setFlash] = useState<'ok' | 'pass' | null>(null);
  const [tiltState, setTiltState] = useState<'ready' | 'down' | 'up'>('ready');

  const deadlineRef = useRef<number>(0);
  const lastSecRef = useRef<number>(duration);
  const tiltNeutralRef = useRef<boolean>(false);
  const tiltCooldownRef = useRef<number>(0);

  // Drift-free deadline timer during active play
  useEffect(() => {
    if (phase !== 'play') return;
    deadlineRef.current = performance.now() + duration * 1000;
    lastSecRef.current = duration;

    const id = setInterval(() => {
      const remMs = deadlineRef.current - performance.now();
      const remSec = Math.max(0, Math.ceil(remMs / 1000));
      if (remSec !== lastSecRef.current) {
        lastSecRef.current = remSec;
        setLeft(remSec);
        if (remSec > 0 && remSec <= 10) sound.tick();
        if (remSec === 0) {
          clearInterval(id);
          sound.lose();
          setPhase('lost');
        }
      }
    }, 150);

    return () => clearInterval(id);
  }, [phase, duration]);

  const startChallenge = async () => {
    sound.flip();
    // Request iOS 13+ Motion & Orientation permissions directly inside the user click gesture
    if (mode === 'headsup') {
      try {
        const DME = window.DeviceMotionEvent as unknown as {
          requestPermission?: () => Promise<'granted' | 'denied'>;
        };
        if (DME && typeof DME.requestPermission === 'function') {
          await DME.requestPermission();
        }
      } catch {
        // ignore if unsupported
      }
      try {
        const DOE = window.DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<'granted' | 'denied'>;
        };
        if (DOE && typeof DOE.requestPermission === 'function') {
          await DOE.requestPermission();
        }
      } catch {
        // ignore if unsupported
      }
    }

    tiltNeutralRef.current = false;
    tiltCooldownRef.current = performance.now() + 700;
    setTiltState('ready');
    setLeft(duration);
    if (mode === 'charades') {
      setCharade(pickCharadeCard(charadeCat));
      setSkipsLeft(2);
    } else {
      setDeck(buildHeadsUpDeck(headsupCat, 24));
      setCardIdx(0);
      setCorrectCount(0);
    }
    setPhase('play');
  };

  const handleCharadeSuccess = () => {
    sound.win();
    fireConfetti(2500);
    setPhase('won');
  };

  const handleCharadeSkip = () => {
    if (skipsLeft <= 0) return;
    sound.tap();
    setSkipsLeft((s) => s - 1);
    setCharade(pickCharadeCard(charadeCat));
  };

  const handleHeadsUpCorrect = useCallback(() => {
    sound.flip();
    setFlash('ok');
    setTiltState('down');
    setTimeout(() => {
      setFlash(null);
      setTiltState('ready');
    }, 320);

    setCorrectCount((prev) => {
      const next = prev + 1;
      if (next >= targetScore) {
        sound.win();
        fireConfetti(2500);
        setPhase('won');
      }
      return next;
    });
    setCardIdx((i) => (i + 1) % deck.length);
  }, [deck.length, targetScore]);

  const handleHeadsUpPass = useCallback(() => {
    sound.tap();
    setFlash('pass');
    setTiltState('up');
    setTimeout(() => {
      setFlash(null);
      setTiltState('ready');
    }, 320);
    setCardIdx((i) => (i + 1) % deck.length);
  }, [deck.length]);

  /**
   * Orientation-Independent 3D Forehead Tilt Engine
   * Works seamlessly in Portrait, Landscape-Left, and Landscape-Right!
   * Uses the screen's Z-axis normal component:
   * - Neutral (phone held upright on forehead): screen normal Z is near 0 (-0.38 to +0.38)
   * - Nod Forward / Tilt Screen Down toward floor: normal Z <= -0.52 -> Correct (✅)
   * - Tilt Backward / Tilt Screen Up toward ceiling: normal Z >= +0.52 -> Pass (⏭️)
   */
  useEffect(() => {
    if (phase !== 'play' || mode !== 'headsup') return;

    const processScreenNormalZ = (normZ: number) => {
      const now = performance.now();
      if (now < tiltCooldownRef.current) return;

      // Return to upright forehead neutral zone before allowing next tilt trigger
      if (Math.abs(normZ) < 0.38) {
        tiltNeutralRef.current = true;
        return;
      }

      if (!tiltNeutralRef.current) return;

      // Screen tilted face-down toward the floor (Nodding forward = GOT IT ✅)
      if (normZ <= -0.52) {
        tiltNeutralRef.current = false;
        tiltCooldownRef.current = now + 950;
        handleHeadsUpCorrect();
      }
      // Screen tilted face-up toward the ceiling (Tilting backward = PASS ⏭️)
      else if (normZ >= 0.52) {
        tiltNeutralRef.current = false;
        tiltCooldownRef.current = now + 950;
        handleHeadsUpPass();
      }
    };

    const onDeviceMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.z === null || acc.z === undefined) return;
      // Normalize z by standard gravity (9.81 m/s^2)
      const normZ = Math.max(-1, Math.min(1, acc.z / 9.81));
      processScreenNormalZ(normZ);
    };

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      const betaRad = (e.beta * Math.PI) / 180;
      const gammaRad = (e.gamma * Math.PI) / 180;
      // 3D projection of gravity onto the screen-perpendicular Z axis
      const normZ = Math.cos(betaRad) * Math.cos(gammaRad);
      processScreenNormalZ(normZ);
    };

    window.addEventListener('devicemotion', onDeviceMotion, true);
    window.addEventListener('deviceorientation', onDeviceOrientation, true);
    return () => {
      window.removeEventListener('devicemotion', onDeviceMotion, true);
      window.removeEventListener('deviceorientation', onDeviceOrientation, true);
    };
  }, [phase, mode, handleHeadsUpCorrect, handleHeadsUpPass]);

  const activeHeadsUpCard = deck[cardIdx] ?? deck[0];
  const activeCatList = mode === 'charades' ? CHARADE_CATS : HEADSUP_CATS;
  const activeCatId = mode === 'charades' ? charadeCat : headsupCat;
  const isFullScreen = phase !== 'intro';

  return (
    <div
      className={`overlay ${isFullScreen ? 'overlay-fullscreen' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={isFullScreen ? undefined : onClose}
    >
      <div
        className={`sheet arcade-sheet center-text ${isFullScreen ? 'arcade-fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header in Intro Phase */}
        {phase === 'intro' && (
          <h2 className="sheet-title">
            {isRedemption
              ? t('arc.redeemTitle', { name: playerName ?? '' })
              : mode === 'charades'
                ? t('arc.charadesTitle')
                : t('arc.headsupTitle')}
          </h2>
        )}

        {/* Mode switcher tabs in intro phase */}
        {phase === 'intro' && (
          <div className="seg">
            <button
              type="button"
              className={mode === 'charades' ? 'on' : ''}
              onClick={() => {
                sound.tap();
                setMode('charades');
              }}
            >
              {t('arc.tabCharades')}
            </button>
            <button
              type="button"
              className={mode === 'headsup' ? 'on' : ''}
              onClick={() => {
                sound.tap();
                setMode('headsup');
              }}
            >
              {t('arc.tabHeadsup')}
            </button>
          </div>
        )}

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div className="arcade-intro">
            <div className="arcade-cat-section">
              <small className="arcade-cat-label">{t('arc.pickCat')}</small>
              <div className="arcade-cat-grid">
                {activeCatList.map((c) => {
                  const isOn = activeCatId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`arcade-cat-chip ${isOn ? 'on' : ''}`}
                      onClick={() => {
                        sound.tap();
                        if (mode === 'charades') setCharadeCat(c.id as CharadeCatId);
                        else setHeadsupCat(c.id as HeadsUpCatId);
                      }}
                    >
                      <span>{c.emoji}</span>
                      <span>{c[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="info-card">
              <div className="arcade-hero-icon">{mode === 'charades' ? '🎬🤐' : '📱🤯'}</div>
              <p>
                {mode === 'charades'
                  ? t('arc.charadesRules', { sec: duration })
                  : t('arc.headsupRules', { sec: duration, target: targetScore })}
              </p>
              {mode === 'headsup' && <small className="tilt-hint-badge">{t('arc.tiltHint')}</small>}
            </div>

            <div className="stack">
              <button type="button" className="btn btn-primary btn-xl" onClick={startChallenge}>
                {t('arc.startBtn')}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  sound.tap();
                  onClose();
                }}
              >
                {t('setup.unlockCancel')}
              </button>
            </div>
          </div>
        )}

        {/* PLAY PHASE: CHARADES (بدون كلام — شاشة كاملة متجاوبة مع الصورة التوضيحية) */}
        {phase === 'play' && mode === 'charades' && (
          <div className="arcade-play-full">
            <div className="arcade-hud-full">
              <button
                type="button"
                className="chip-btn"
                onClick={() => {
                  sound.tap();
                  setPhase('intro');
                }}
              >
                ✕
              </button>
              <span className={`arcade-timer ${left <= 10 ? 'hot' : ''}`}>⏱️ {left}s</span>
              <span className="prompt-badge">{charade.tag[lang]}</span>
            </div>

            <div className="arcade-stage-card">
              <CardIllustration card={charade} size="lg" />
              <div className="arcade-stage-info">
                <h3 className="arcade-word">{charade[lang]}</h3>
                <p className="arcade-hint">💡 {charade.hint[lang]}</p>
              </div>
            </div>

            <div className="arcade-bottom-bar">
              <button type="button" className="btn btn-success btn-xl grow" onClick={handleCharadeSuccess}>
                {t('arc.audienceGuessed')}
              </button>

              <div className="row">
                {skipsLeft > 0 && (
                  <button type="button" className="btn btn-ghost grow" onClick={handleCharadeSkip}>
                    {t('arc.skipCharade')} ({skipsLeft})
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-ghost grow"
                  onClick={() => {
                    sound.lose();
                    setPhase('lost');
                  }}
                >
                  {t('arc.giveUp')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PLAY PHASE: HEADS-UP (على جبينك — ملء الشاشة الكامل 100% عمودياً وأفقياً عند قلب الجوال) */}
        {phase === 'play' && mode === 'headsup' && activeHeadsUpCard && (
          <div className={`arcade-play-full headsup-full ${flash ? `flash-${flash}` : ''}`}>
            <div className="arcade-hud-full">
              <button
                type="button"
                className="chip-btn"
                onClick={() => {
                  sound.tap();
                  setPhase('intro');
                }}
              >
                ✕
              </button>
              <span className={`arcade-timer ${left <= 10 ? 'hot' : ''}`}>⏱️ {left}s</span>
              <span className="prompt-badge">
                {t('arc.headsupProgress', { cur: correctCount, total: targetScore })}
              </span>
            </div>

            <div className="headsup-stage">
              <CardIllustration card={activeHeadsUpCard} size="lg" />
              <div className="headsup-stage-text">
                <span className="headsup-cat-pill">{activeHeadsUpCard.tag[lang]}</span>
                <h3 className="headsup-giant-word">{activeHeadsUpCard[lang]}</h3>
                <small className="tilt-live-pill">
                  {tiltState === 'down'
                    ? '✅ عرفتها!'
                    : tiltState === 'up'
                      ? '⏭️ تخطّي!'
                      : t('arc.tiltLive')}
                </small>
              </div>
            </div>

            <div className="headsup-actions-full">
              <button type="button" className="btn btn-success btn-xl grow" onClick={handleHeadsUpCorrect}>
                {t('arc.gotIt')}
              </button>
              <button type="button" className="btn btn-accent btn-xl grow" onClick={handleHeadsUpPass}>
                {t('arc.passCard')}
              </button>
            </div>
          </div>
        )}

        {/* WON PHASE */}
        {phase === 'won' && (
          <div className="arcade-outcome-full">
            <div className="arcade-result-card won">
              <div className="arcade-emoji">🏆🎉</div>
              <h3>
                {isRedemption ? t('arc.redeemWonTitle', { name: playerName ?? '' }) : t('arc.standaloneWonTitle')}
              </h3>
              <p>{isRedemption ? t('arc.redeemWonSub') : t('arc.standaloneWonSub')}</p>
            </div>

            <div className="stack" style={{ width: '100%', maxWidth: 460 }}>
              {isRedemption ? (
                <button
                  type="button"
                  className="btn btn-success btn-xl"
                  onClick={() => {
                    sound.tap();
                    onRedeemSuccess?.();
                  }}
                >
                  {t('arc.claimImmunity')}
                </button>
              ) : (
                <>
                  <button type="button" className="btn btn-primary btn-xl" onClick={() => setPhase('intro')}>
                    {t('arc.playAgain')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      sound.tap();
                      onClose();
                    }}
                  >
                    {t('wheel.done')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* LOST PHASE */}
        {phase === 'lost' && (
          <div className="arcade-outcome-full">
            <div className="arcade-result-card lost">
              <div className="arcade-emoji">😱🎡</div>
              <h3>{t('arc.lostTitle')}</h3>
              <p>{isRedemption ? t('arc.redeemLostSub') : t('arc.standaloneLostSub')}</p>
            </div>

            <div className="stack" style={{ width: '100%', maxWidth: 460 }}>
              {isRedemption ? (
                <button
                  type="button"
                  className="btn btn-accent btn-xl"
                  onClick={() => {
                    sound.tap();
                    onRedeemFail?.();
                  }}
                >
                  {t('arc.goToWheel')}
                </button>
              ) : (
                <>
                  {onOpenWheel && (
                    <button
                      type="button"
                      className="btn btn-accent btn-xl"
                      onClick={() => {
                        sound.tap();
                        onOpenWheel();
                      }}
                    >
                      {t('arc.goToWheel')}
                    </button>
                  )}
                  <button type="button" className="btn btn-primary btn-xl" onClick={() => setPhase('intro')}>
                    {t('arc.playAgain')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      sound.tap();
                      onClose();
                    }}
                  >
                    {t('wheel.done')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
