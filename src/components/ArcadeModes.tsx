import { useEffect, useRef, useState } from 'react';
import { buildHeadsUpDeck, pickCharadeCard, type ArcadeCard } from '../game/arcadeData';
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

const HEADSUP_TARGET = 3;

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

  const duration = isRedemption ? 45 : 60;
  const [left, setLeft] = useState(duration);

  // Charades state
  const [charade, setCharade] = useState<ArcadeCard>(() => pickCharadeCard());
  const [skipsLeft, setSkipsLeft] = useState(1);

  // Heads-Up state
  const [deck, setDeck] = useState<ArcadeCard[]>(() => buildHeadsUpDeck(24));
  const [cardIdx, setCardIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [flash, setFlash] = useState<'ok' | 'pass' | null>(null);

  const deadlineRef = useRef(0);
  const lastTickRef = useRef(duration);

  const startPlay = (chosenMode: ArcadeModeType) => {
    sound.flip();
    setMode(chosenMode);
    setLeft(duration);
    lastTickRef.current = duration;
    deadlineRef.current = Date.now() + duration * 1000;
    if (chosenMode === 'charades') {
      setCharade(pickCharadeCard());
      setSkipsLeft(1);
    } else {
      setDeck(buildHeadsUpDeck(24));
      setCardIdx(0);
      setCorrectCount(0);
    }
    setPhase('play');
  };

  useEffect(() => {
    if (phase !== 'play') return;
    const id = setInterval(() => {
      const ms = Math.max(0, deadlineRef.current - Date.now());
      const s = Math.ceil(ms / 1000);
      if (s !== lastTickRef.current) {
        lastTickRef.current = s;
        if (s <= 10 && s >= 1) sound.tick();
        setLeft(s);
      }
      if (ms === 0) {
        clearInterval(id);
        sound.lose();
        setPhase('lost');
      }
    }, 200);
    return () => clearInterval(id);
  }, [phase]);

  const handleHeadsUpAnswer = (isCorrect: boolean) => {
    if (phase !== 'play') return;
    if (isCorrect) {
      sound.win();
      setFlash('ok');
      const nextScore = correctCount + 1;
      setCorrectCount(nextScore);
      if (isRedemption && nextScore >= HEADSUP_TARGET) {
        setTimeout(() => setPhase('won'), 250);
        return;
      }
    } else {
      sound.tap();
      setFlash('pass');
    }
    setTimeout(() => setFlash(null), 220);
    setCardIdx((i) => (i + 1) % deck.length);
  };

  const currentHeadsUp = deck[cardIdx] ?? deck[0];

  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sheet arcade-sheet center-text" onClick={(e) => e.stopPropagation()}>
        {phase === 'intro' && (
          <>
            <h2 className="sheet-title">
              {isRedemption
                ? t('arc.redeemTitle', { name: playerName ?? '' })
                : mode === 'charades'
                  ? t('arc.charadesTitle')
                  : t('arc.headsupTitle')}
            </h2>

            {isRedemption && (
              <div className="seg">
                <button
                  type="button"
                  className={mode === 'charades' ? 'on' : ''}
                  onClick={() => {
                    sound.tap();
                    setMode('charades');
                  }}
                >
                  🎬 {t('arc.tabCharades')}
                </button>
                <button
                  type="button"
                  className={mode === 'headsup' ? 'on' : ''}
                  onClick={() => {
                    sound.tap();
                    setMode('headsup');
                  }}
                >
                  📱 {t('arc.tabHeadsup')}
                </button>
              </div>
            )}

            <div className="info-card">
              <div className="logo-emoji" style={{ fontSize: 58 }}>
                {mode === 'charades' ? '🎬' : '📱'}
              </div>
              <h3>{mode === 'charades' ? t('arc.charadesTitle') : t('arc.headsupTitle')}</h3>
              <p>
                {mode === 'charades'
                  ? t('arc.charadesRules', { sec: duration })
                  : t('arc.headsupRules', { n: HEADSUP_TARGET, sec: duration })}
              </p>
            </div>

            <div className="stack">
              <button type="button" className="btn btn-primary btn-xl" onClick={() => startPlay(mode)}>
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
                {t('setup.back')}
              </button>
            </div>
          </>
        )}

        {phase === 'play' && mode === 'charades' && (
          <>
            <div className="arcade-hud">
              <span className={`arcade-timer ${left <= 10 ? 'urgent' : ''}`}>⏱ {left}s</span>
              <span className="prompt-badge">{charade.tag[lang]}</span>
            </div>

            <div className="arcade-card">
              <div className="arcade-emoji">{charade.emoji}</div>
              <h2 className="arcade-word">{charade.title[lang]}</h2>
              <p className="muted">{charade.hint[lang]}</p>
            </div>

            {skipsLeft > 0 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ alignSelf: 'center' }}
                onClick={() => {
                  sound.tap();
                  setSkipsLeft((s) => s - 1);
                  setCharade((prev) => pickCharadeCard(prev.title.ar));
                }}
              >
                🔄 {t('arc.skipCharade')}
              </button>
            )}

            <div className="stack">
              <button
                type="button"
                className="btn btn-success btn-xl"
                onClick={() => {
                  sound.win();
                  setPhase('won');
                }}
              >
                ✅ {t('arc.audienceGuessed')}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  sound.lose();
                  setPhase('lost');
                }}
              >
                ❌ {t('arc.giveUp')}
              </button>
            </div>
          </>
        )}

        {phase === 'play' && mode === 'headsup' && (
          <>
            <div className="arcade-hud">
              <span className={`arcade-timer ${left <= 10 ? 'urgent' : ''}`}>⏱ {left}s</span>
              <span className="prompt-badge">
                {isRedemption
                  ? t('arc.headsupProgress', { cur: correctCount, total: HEADSUP_TARGET })
                  : `✅ ${correctCount}`}
              </span>
            </div>

            <p className="muted small">{t('arc.foreheadBanner')}</p>

            <div className={`arcade-card headsup-card ${flash ?? ''}`}>
              <span className="prompt-badge">{currentHeadsUp.tag[lang]}</span>
              <div className="arcade-emoji">{currentHeadsUp.emoji}</div>
              <h2 className="arcade-word">{currentHeadsUp.title[lang]}</h2>
              <p className="muted">{currentHeadsUp.hint[lang]}</p>
            </div>

            <div className="headsup-actions">
              <button
                type="button"
                className="btn btn-success btn-xl"
                onClick={() => handleHeadsUpAnswer(true)}
              >
                ✅ {t('arc.gotIt')}
              </button>
              <button
                type="button"
                className="btn btn-danger btn-xl"
                onClick={() => handleHeadsUpAnswer(false)}
              >
                ⏭️ {t('arc.passCard')}
              </button>
            </div>
          </>
        )}

        {phase === 'won' && (
          <>
            <div className="logo-emoji" style={{ fontSize: 72 }}>🎉</div>
            <h2 className="sheet-title">{isRedemption ? t('arc.redeemWonTitle') : t('arc.standaloneWonTitle')}</h2>
            <p className="kicker">
              {isRedemption
                ? t('arc.redeemWonSub', { name: playerName ?? '' })
                : t('arc.standaloneWonSub', { n: mode === 'headsup' ? correctCount : 1 })}
            </p>
            <div className="stack">
              {isRedemption ? (
                <button
                  type="button"
                  className="btn btn-primary btn-xl"
                  onClick={() => {
                    sound.win();
                    onRedeemSuccess?.();
                  }}
                >
                  🛡️ {t('arc.claimImmunity')}
                </button>
              ) : (
                <>
                  <button type="button" className="btn btn-primary btn-xl" onClick={() => startPlay(mode)}>
                    🔄 {t('arc.playAgain')}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={onClose}>
                    {t('res.home')}
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {phase === 'lost' && (
          <>
            <div className="logo-emoji" style={{ fontSize: 72 }}>😈</div>
            <h2 className="sheet-title">{t('arc.lostTitle')}</h2>
            <p className="kicker">{isRedemption ? t('arc.redeemLostSub') : t('arc.standaloneLostSub')}</p>
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
                  🎡 {t('arc.goToWheel')}
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
                      🎡 {t('arc.goToWheel')}
                    </button>
                  )}
                  <button type="button" className="btn btn-primary" onClick={() => startPlay(mode)}>
                    🔄 {t('arc.playAgain')}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={onClose}>
                    {t('res.home')}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
