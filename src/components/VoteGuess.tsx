import { useState } from 'react';
import { sound } from '../game/sound';
import type { Player, Round } from '../game/types';
import { useLang } from '../i18n';

export function Vote({
  players,
  onConfirm,
}: {
  players: Player[];
  onConfirm: (votesMap: Record<number, number>) => void;
}) {
  const { t } = useLang();
  const [voterIdx, setVoterIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [votesMap, setVotesMap] = useState<Record<number, number>>({});

  const currentVoter = players[voterIdx] ?? players[0];
  const isLastVoter = voterIdx >= players.length - 1;
  const nextVoter = !isLastVoter ? players[voterIdx + 1] : null;
  const suspects = players.filter((p) => p.id !== currentVoter?.id);

  const submitCurrentVote = () => {
    if (sel === null || !currentVoter) return;
    const updated = { ...votesMap, [currentVoter.id]: sel };
    setVotesMap(updated);
    setSel(null);

    if (isLastVoter) {
      sound.drumroll();
      onConfirm(updated);
    } else {
      sound.flip();
      setVoterIdx((i) => i + 1);
    }
  };

  return (
    <div className="screen">
      {/* Voter Progress Strip */}
      <div className="voter-strip">
        {players.map((p, idx) => {
          const done = idx < voterIdx;
          const active = idx === voterIdx;
          return (
            <span
              key={p.id}
              className={`voter-pill ${done ? 'done' : ''} ${active ? 'active' : ''}`}
            >
              <span>{done ? '✅' : p.avatar ?? '👤'}</span>
              <span>{p.name}</span>
            </span>
          );
        })}
      </div>

      {/* Current Voter Banner */}
      <div className="voter-turn-card">
        <span className="voter-step-badge">
          {t('vote.stepBadge', { cur: voterIdx + 1, total: players.length })}
        </span>
        <div className="voter-turn-header">
          <span className="avatar big">{currentVoter?.avatar ?? '🕵️'}</span>
          <div>
            <h2 className="screen-title" style={{ margin: 0 }}>
              {t('vote.playerTurnTitle', { name: currentVoter?.name ?? '' })}
            </h2>
            <p className="muted" style={{ margin: '4px 0 0' }}>
              {t('vote.sub')}
            </p>
          </div>
        </div>
      </div>

      <div className="vote-grid">
        {suspects.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`vote-card ${sel === p.id ? 'on' : ''}`}
            onClick={() => {
              sound.tap();
              setSel(p.id);
            }}
          >
            <span className="avatar big">{p.avatar ?? p.name.slice(0, 1).toUpperCase()}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      <div className="stack sticky-actions">
        <button
          id="btn-confirm-vote"
          type="button"
          className="btn btn-danger btn-xl"
          disabled={sel === null}
          onClick={submitCurrentVote}
        >
          {sel === null
            ? t('vote.pickFor', { name: currentVoter?.name ?? '' })
            : isLastVoter
              ? t('vote.confirmFinal', { name: currentVoter?.name ?? '' })
              : t('vote.confirmNext', {
                  name: currentVoter?.name ?? '',
                  next: nextVoter?.name ?? '',
                })}
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
        <div className="logo-emoji" style={{ fontSize: 64 }}>{accused.avatar ?? '🤥'}</div>
        <p className="kicker">{t('guess.pass', { name: accused.name })}</p>
        <h2 className="big-name">{accused.name}</h2>
        <button
          className="btn btn-primary btn-xl"
          onClick={() => {
            sound.tap();
            setReady(true);
          }}
        >
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
