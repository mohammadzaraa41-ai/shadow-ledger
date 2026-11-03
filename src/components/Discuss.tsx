import { useEffect, useState } from 'react';
import { hostLine, randomPrompt, speak } from '../game/host';
import { isPublicChaos } from '../game/engine';
import { sound } from '../game/sound';
import type { Player, Round, Settings } from '../game/types';
import { useLang } from '../i18n';

interface Props {
  round: Round;
  players: Player[];
  settings: Settings;
  onVote: () => void;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export function Discuss({ round, players, settings, onVote }: Props) {
  const { t, lang } = useLang();
  const total = round.chaos === 'SPEED' ? Math.round(settings.discussSec / 2) : settings.discussSec;
  const [left, setLeft] = useState(total);
  const [paused, setPaused] = useState(false);
  const [prompt, setPrompt] = useState(() => randomPrompt(lang));
  const [host] = useState(() => hostLine('discuss', lang));

  const starter = players.find((p) => p.id === round.starter);
  const pub = isPublicChaos(round.chaos);

  useEffect(() => {
    if (pub) sound.chaos();
    speak(host, lang, settings.voice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paused || left <= 0) return;
    const id = setInterval(() => {
      setLeft((v) => {
        if (v <= 11 && v > 1) sound.tick();
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused, left]);

  useEffect(() => {
    if (left > 0) return;
    sound.lose();
    speak(hostLine('timeUp', lang), lang, settings.voice);
    const id = setTimeout(onVote, 1400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const pct = Math.max(0, left / total);
  const urgent = left <= 10;

  return (
    <div className="screen center">
      {pub && round.chaos && (
        <div className="chaos-banner">
          <b>{t(`chaos.${round.chaos}`)}</b>
          <span>{t(`chaos.${round.chaos}d`)}</span>
        </div>
      )}

      <p className="kicker">{t('disc.starter', { name: starter?.name ?? '' })}</p>

      <button
        className={`timer ${urgent ? 'urgent' : ''}`}
        style={{ ['--pct' as string]: `${pct * 360}deg` }}
        onClick={() => setPaused((p) => !p)}
        aria-label="Pause"
      >
        <span className="timer-inner">
          <b>{fmt(Math.max(0, left))}</b>
          <small>{paused ? '⏸' : '⏱'}</small>
        </span>
      </button>

      <p className="muted">{round.liars.length === 2 ? t('disc.liars2') : t('disc.liars1')}</p>

      <div className="host-bubble">🎙️ {host}</div>

      <div className="prompt-box">
        <small>{t('disc.prompt')}</small>
        <p>{prompt}</p>
        <button className="btn btn-ghost btn-sm" onClick={() => { sound.tap(); setPrompt(randomPrompt(lang)); }}>
          🔄 {t('disc.newPrompt')}
        </button>
      </div>

      <button
        id="btn-go-vote"
        className="btn btn-primary btn-xl"
        onClick={() => {
          sound.drumroll();
          onVote();
        }}
      >
        {t('disc.vote')}
      </button>
    </div>
  );
}

