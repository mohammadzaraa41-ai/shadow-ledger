import { useEffect, useMemo, useState } from 'react';
import { hostLine, speak } from '../game/host';
import { sound } from '../game/sound';
import type { Outcome, Player, Round, Settings } from '../game/types';
import { useLang } from '../i18n';
import { PunishmentWheel } from './PunishmentWheel';

interface ResultProps {
  round: Round;
  players: Player[];
  accused: number | null;
  outcome: Outcome;
  deltas: Record<number, number>;
  roundNo: number;
  settings: Settings;
  onNext: () => void;
}

const GROUP_FAILED: Outcome[] = ['ESCAPED', 'CAUGHT_GUESS_RIGHT', 'NO_LIAR_WRONG', 'JESTER_WIN'];

export function Result({ round, players, accused, outcome, deltas, roundNo, settings, onNext }: ResultProps) {
  const { t, lang } = useLang();
  const [stage, setStage] = useState(0);
  const [showWheel, setShowWheel] = useState(false);
  const isLast = roundNo >= settings.rounds;

  const names = (ids: number[]) => ids.map((id) => players.find((p) => p.id === id)?.name ?? '').join(' + ');
  const accusedName = players.find((p) => p.id === accused)?.name ?? '';
  const jesterName = round.jesterId != null ? players.find((p) => p.id === round.jesterId)?.name ?? '' : '';

  const loserName = useMemo(() => {
    if (outcome === 'CAUGHT_GUESS_WRONG') {
      return names(round.liars.filter((id) => id === accused)) || names(round.liars);
    }
    if (outcome === 'NO_LIAR_WRONG' && accusedName) {
      return accusedName;
    }
    const innocents = players.filter((p) => !round.liars.includes(p.id) && p.id !== round.jesterId);
    return innocents.map((p) => p.name).join(' + ') || players[0]?.name || '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, accused]);

  const line = useMemo(() => {
    switch (outcome) {
      case 'CAUGHT_GUESS_WRONG':
        return hostLine('caught', lang, names(round.liars.filter((id) => id === accused)));
      case 'CAUGHT_GUESS_RIGHT':
        return hostLine('guessRight', lang);
      case 'ESCAPED':
      case 'JESTER_WIN':
        return hostLine('escaped', lang);
      case 'NO_LIAR_OK':
        return hostLine('noLiarOk', lang);
      case 'NO_LIAR_WRONG':
        return hostLine('noLiarWrong', lang, accusedName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sound.drumroll();
    const a = setTimeout(() => {
      setStage(1);
      if (GROUP_FAILED.includes(outcome)) sound.lose();
      else sound.win();
    }, 1500);
    const b = setTimeout(() => {
      setStage(2);
      speak(line, lang, settings.voice);
    }, 2600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="screen center">
      <p className="muted">{t('hand.round', { n: roundNo, total: settings.rounds })}</p>

      <p className="kicker">
        {round.liars.length === 0 ? '' : round.liars.length > 1 ? t('res.liarsWere') : t('res.liarWas')}
      </p>

      <div className={`reveal-box ${stage >= 1 ? 'show' : ''}`}>
        {stage < 1 ? (
          <span className="dots">• • •</span>
        ) : round.liars.length === 0 ? (
          <h2 className="big-name">{t('res.nobody')}</h2>
        ) : (
          <h2 className="big-name">🤥 {names(round.liars)}</h2>
        )}
      </div>

      {stage >= 2 && (
        <div className="result-details">
          <div className="word-reveal">
            {t('res.word')}: <b>{round.word[lang]}</b>
            {round.chaos === 'DECOY' && round.decoyWord && (
              <small>
                {' '}
                · {t('res.decoy')}: <b>{round.decoyWord[lang]}</b>
              </small>
            )}
          </div>

          {jesterName && <p className="muted small">{t('res.jesterWas', { name: jesterName })}</p>}

          <div className="host-bubble">🎙️ {line}</div>
          <p className="outcome">{t(`out.${outcome}`)}</p>

          <button
            type="button"
            className="btn btn-accent"
            onClick={() => {
              sound.tap();
              setShowWheel(true);
            }}
          >
            {t('res.wheelBtn')}
          </button>

          <div className="score-list">
            {sorted.map((p) => (
              <div className="score-row" key={p.id}>
                <span className="avatar">{p.avatar ?? p.name.slice(0, 1).toUpperCase()}</span>
                <span className="grow">{p.name}</span>
                {deltas[p.id] !== 0 && (
                  <span className={`delta ${deltas[p.id] > 0 ? 'pos' : 'neg'}`}>
                    {deltas[p.id] > 0 ? '+' : ''}
                    {deltas[p.id]}
                  </span>
                )}
                <b>{p.score}</b>
              </div>
            ))}
          </div>

          <button
            id="btn-next-round"
            className="btn btn-primary btn-xl"
            onClick={() => {
              sound.flip();
              onNext();
            }}
          >
            {isLast ? t('res.final') : t('res.next')}
          </button>
        </div>
      )}

      {showWheel && <PunishmentWheel loserName={loserName} onClose={() => setShowWheel(false)} />}
    </div>
  );
}

export function Final({
  players,
  settings,
  onAgain,
  onHome,
}: {
  players: Player[];
  settings: Settings;
  onAgain: () => void;
  onHome: () => void;
}) {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const top = sorted[0].score;
  const winners = sorted.filter((p) => p.score === top);
  const winnerNames = winners.map((w) => w.name).join(' + ');
  const [roast] = useState(() => hostLine('winner', lang, winnerNames));

  useEffect(() => {
    sound.win();
    speak(roast, lang, settings.voice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const share = async () => {
    const text = t('final.shareText', { winner: winnerNames, pts: top });
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share cancelled */
    }
  };

  return (
    <div className="screen center">
      <h2 className="screen-title">{t('final.title')}</h2>
      <div className="crown">👑</div>
      <p className="kicker">{t('final.winner')}</p>
      <h2 className="big-name">{winnerNames}</h2>
      <div className="host-bubble">🎙️ {roast}</div>

      <div className="score-list">
        {sorted.map((p, i) => (
          <div className="score-row" key={p.id}>
            <span className="rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
            <span className="avatar">{p.avatar ?? p.name.slice(0, 1).toUpperCase()}</span>
            <span className="grow">{p.name}</span>
            <b>{p.score}</b>
          </div>
        ))}
      </div>

      <div className="stack">
        <button
          className="btn btn-primary btn-xl"
          onClick={() => {
            sound.flip();
            onAgain();
          }}
        >
          {t('final.again')}
        </button>
        <button className="btn btn-accent" onClick={share}>
          {copied ? t('final.copied') : `📤 ${t('final.share')}`}
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => {
            sound.tap();
            onHome();
          }}
        >
          {t('final.home')}
        </button>
      </div>
    </div>
  );
}
