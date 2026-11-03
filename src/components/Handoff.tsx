import { useState } from 'react';
import { sound } from '../game/sound';
import type { Player, Round } from '../game/types';
import { useLang } from '../i18n';

interface Props {
  player: Player;
  round: Round;
  roundNo: number;
  totalRounds: number;
  isLast: boolean;
  onNext: () => void;
}

/** Pass-the-phone role reveal. The role is only visible while the player keeps pressing. */
export function Handoff({ player, round, roundNo, totalRounds, isLast, onNext }: Props) {
  const { t, lang } = useLang();
  const [phase, setPhase] = useState<'pass' | 'view'>('pass');
  const [holding, setHolding] = useState(false);
  const [seen, setSeen] = useState(false);

  const isLiar = round.liars.includes(player.id);
  // With DECOY the liar gets a similar word and does not know they are the liar.
  const decoyed = isLiar && round.chaos === 'DECOY' && round.decoyWord;
  const shownWord = decoyed ? round.decoyWord! : round.word;
  const showAsLiar = isLiar && !decoyed;

  const press = () => {
    if (!holding) sound.flip();
    setHolding(true);
    setSeen(true);
  };
  const release = () => setHolding(false);

  if (phase === 'pass') {
    return (
      <div className="screen center">
        <p className="muted">{t('hand.round', { n: roundNo, total: totalRounds })}</p>
        <p className="kicker">{t('hand.pass')}</p>
        <h2 className="big-name">{player.name}</h2>
        <button
          className="btn btn-primary btn-xl"
          onClick={() => {
            sound.tap();
            setPhase('view');
          }}
        >
          {t('hand.ready', { name: player.name })}
        </button>
      </div>
    );
  }

  return (
    <div className="screen center">
      <p className="muted">{player.name}</p>
      <div
        className={`role-card ${holding ? 'open' : ''} ${holding && showAsLiar ? 'liar' : ''}`}
        onPointerDown={press}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onContextMenu={(e) => e.preventDefault()}
      >
        {holding ? (
          showAsLiar ? (
            <>
              <div className="role-emoji">🤥</div>
              <h2 className="role-main">{t('hand.liar')}</h2>
              <p className="role-sub">{t('hand.cat')}: <b>{round.category.emoji} {round.category.name[lang]}</b></p>
              <p className="role-hint">{t('hand.liarHint')}</p>
            </>
          ) : (
            <>
              <p className="role-sub">{t('hand.cat')}: <b>{round.category.emoji} {round.category.name[lang]}</b></p>
              <p className="role-label">{t('hand.word')}</p>
              <h2 className="role-main word">{shownWord[lang]}</h2>
              <p className="role-hint">{decoyed ? t('hand.liarDecoyHint') : t('hand.wordHint')}</p>
            </>
          )
        ) : (
          <>
            <div className="role-emoji">❓</div>
            <p className="role-hint">{t('hand.hold')}</p>
          </>
        )}
      </div>
      <p className="muted small">{holding ? t('hand.release') : '\u00A0'}</p>
      <button
        className="btn btn-primary btn-xl"
        disabled={!seen || holding}
        onClick={() => {
          sound.tap();
          onNext();
        }}
      >
        {isLast ? t('hand.start') : t('hand.done')}
      </button>
    </div>
  );
}

