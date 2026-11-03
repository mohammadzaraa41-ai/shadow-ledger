import { useState } from 'react';
import { sound } from '../game/sound';
import type { Player, Round } from '../game/types';
import { useLang } from '../i18n';

export function Vote({ players, onConfirm }: { players: Player[]; onConfirm: (accused: number | null) => void }) {
  const { t } = useLang();
  const [sel, setSel] = useState<number | 'none' | null>(null);

  return (
    <div className="screen">
      <h2 className="screen-title">{t('vote.title')}</h2>
      <p className="muted center-text">{t('vote.sub')}</p>

      <div className="vote-grid">
        {players.map((p) => (
          <button
            key={p.id}
            className={`vote-card ${sel === p.id ? 'on' : ''}`}
            onClick={() => {
              sound.tap();
              setSel(p.id);
            }}
          >
            <span className="avatar big">{p.name.slice(0, 1).toUpperCase()}</span>
            <span>{p.name}</span>
          </button>
        ))}
        <button
          className={`vote-card none ${sel === 'none' ? 'on' : ''}`}
          onClick={() => {
            sound.tap();
            setSel('none');
          }}
        >
          {t('vote.none')}
        </button>
      </div>

      <div className="stack sticky-actions">
        <button
          id="btn-confirm-vote"
          className="btn btn-danger btn-xl"
          disabled={sel === null}
          onClick={() => {
            sound.drumroll();
            onConfirm(sel === 'none' || sel === null ? null : sel);
          }}
        >
          {sel === null ? t('vote.pick') : sel === 'none' ? t('vote.confirmNone') : t('vote.confirm')}
        </button>
      </div>
    </div>
  );
}

export function Guess({
  accused,
  round,
  onGuess,
}: {
  accused: Player;
  round: Round;
  onGuess: (correct: boolean) => void;
}) {
  const { t, lang } = useLang();
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <div className="screen center">
        <p className="kicker">{t('guess.pass', { name: accused.name })}</p>
        <h2 className="big-name">{accused.name}</h2>
        <button className="btn btn-primary btn-xl" onClick={() => { sound.tap(); setReady(true); }}>
          {t('guess.ready', { name: accused.name })}
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <h2 className="screen-title">{t('guess.title')}</h2>
      <p className="muted center-text">
        {round.category.emoji} {round.category.name[lang]} · {t('guess.sub')}
      </p>
      <div className="options-grid">
        {round.options.map((o) => (
          <button
            key={o.ar}
            className="option-card"
            onClick={() => {
              sound.drumroll();
              onGuess(o.ar === round.word.ar);
            }}
          >
            {o[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}

