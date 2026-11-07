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
import { useLang } from '../i18n';

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
  const [tiltSupported, setTiltSupported] = useState(false);

  const deadlineRef = useRef<number>(0);
  const lastSecRef = useRef<number>(duration);
  const tiltNeutralRef = useRef<boolean>(true);
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

  const requestTiltPermissionIfNeeded = async () => {
    try {
      const DOE = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (DOE && typeof DOE.requestPermission === 'function') {
        const res = await DOE.requestPermission();
        if (res === 'granted') setTiltSupported(true);
      } else if ('DeviceOrientationEvent' in window) {
        setTiltSupported(true);
      }
    } catch {
      // ignore if denied or unsupported
    }
  };

  const startChallenge = () => {
    sound.flip();
    if (mode === 'headsup') {
      void requestTiltPermissionIfNeeded();
    }
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
    setTimeout(() => setFlash(null), 220);

    setCorrectCount((prev) => {
      const next = prev + 1;
      if (next >= targetScore) {
        sound.win();
        setPhase('won');
      }
      return next;
    });
    setCardIdx((i) => (i + 1) % deck.length);
  }, [deck.length, targetScore]);

  const handleHeadsUpPass = useCallback(() => {
    sound.tap();
    setFlash('pass');
    setTimeout(() => setFlash(null), 220);
    setCardIdx((i) => (i + 1) % deck.length);
  }, [deck.length]);

  // Forehead Tilt Detection (Nod Down = Correct ✅, Tilt Up = Pass ⏭️)
  useEffect(() => {
    if (phase !== 'play' || mode !== 'headsup') return;

    const onOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta; // front-to-back tilt in degrees (-180 to 180)
      if (beta === null) return;
      setTiltSupported(true);

      const now = performance.now();
      if (now < tiltCooldownRef.current) return;

      // Upright forehead neutral zone: roughly 60° to 115°
      if (beta >= 60 && beta <= 115) {
        tiltNeutralRef.current = true;
        return;
      }

      if (!tiltNeutralRef.current) return;

      // Tilted forward/down strongly (nodding YES)
      if (beta > 15 && beta < 48) {
        tiltNeutralRef.current = false;
        tiltCooldownRef.current = now + 900;
        handleHeadsUpCorrect();
      }
      // Tilted backward/up strongly (PASS)
      else if (beta > 130 && beta < 170) {
        tiltNeutralRef.current = false;
        tiltCooldownRef.current = now + 900;
        handleHeadsUpPass();
      }
    };

    window.addEventListener('deviceorientation', onOrientation, true);
    return () => window.removeEventListener('deviceorientation', onOrientation, true);
  }, [phase, mode, handleHeadsUpCorrect, handleHeadsUpPass]);

  const activeHeadsUpCard = deck[cardIdx] ?? deck[0];
  const activeCatList = mode === 'charades' ? CHARADE_CATS : HEADSUP_CATS;
  const activeCatId = mode === 'charades' ? charadeCat : headsupCat;

  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sheet arcade-sheet center-text" onClick={(e) => e.stopPropagation()}>
        <h2 className="sheet-title">
          {isRedemption
            ? t('arc.redeemTitle', { name: playerName ?? '' })
            : mode === 'charades'
              ? t('arc.charadesTitle')
              : t('arc.headsupTitle')}
        </h2>

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

        {/* PLAY PHASE: CHARADES (بدون كلام) */}
        {phase === 'play' && mode === 'charades' && (
          <div className="arcade-play">
            <div className="arcade-hud">
              <span className={`arcade-timer ${left <= 10 ? 'hot' : ''}`}>⏱️ {left}s</span>
              <span className="prompt-badge">{charade.tag[lang]}</span>
            </div>

            <div className="arcade-card">
              <div className="arcade-emoji">{charade.emoji}</div>
              <h3 className="arcade-word">{charade[lang]}</h3>
              <p className="arcade-hint">💡 {charade.hint[lang]}</p>
            </div>

            <div className="stack">
              <button type="button" className="btn btn-success btn-xl" onClick={handleCharadeSuccess}>
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

        {/* PLAY PHASE: HEADS-UP (على جبينك) */}
        {phase === 'play' && mode === 'headsup' && activeHeadsUpCard && (
          <div className="arcade-play">
            <div className="arcade-hud">
              <span className={`arcade-timer ${left <= 10 ? 'hot' : ''}`}>⏱️ {left}s</span>
              <span className="prompt-badge">
                {t('arc.headsupProgress', { cur: correctCount, total: targetScore })}
              </span>
            </div>

            <div className={`arcade-card headsup-card ${flash ? `flash-${flash}` : ''}`}>
              <small className="headsup-banner">{t('arc.foreheadBanner')}</small>
              <div className="arcade-emoji headsup-emoji">{activeHeadsUpCard.emoji}</div>
              <h3 className="arcade-word headsup-word">{activeHeadsUpCard[lang]}</h3>
              <p className="arcade-hint">{activeHeadsUpCard.tag[lang]}</p>
              {tiltSupported && <small className="tilt-live-pill">{t('arc.tiltLive')}</small>}
            </div>

            <div className="headsup-actions">
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
          <div className="arcade-outcome">
            <div className="arcade-result-card won">
              <div className="arcade-emoji">🏆🎉</div>
              <h3>
                {isRedemption ? t('arc.redeemWonTitle', { name: playerName ?? '' }) : t('arc.standaloneWonTitle')}
              </h3>
              <p>{isRedemption ? t('arc.redeemWonSub') : t('arc.standaloneWonSub')}</p>
            </div>

            <div className="stack">
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
          <div className="arcade-outcome">
            <div className="arcade-result-card lost">
              <div className="arcade-emoji">😱🎡</div>
              <h3>{t('arc.lostTitle')}</h3>
              <p>{isRedemption ? t('arc.redeemLostSub') : t('arc.standaloneLostSub')}</p>
            </div>

            <div className="stack">
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
