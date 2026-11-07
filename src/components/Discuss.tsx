import { useEffect, useRef, useState } from 'react';
import { isPublicChaos } from '../game/engine';
import { hostLine, randomPrompt, speak } from '../game/host';
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
  const [prompt, setPrompt] = useState(() => randomPrompt(lang, round.category.id));
  const [pairIdx, setPairIdx] = useState(0);
  const [host] = useState(() => hostLine('discuss', lang));

  const starterIdx = Math.max(0, players.findIndex((p) => p.id === round.starter));
  const asker = players[(starterIdx + pairIdx) % players.length] ?? players[0];
  const target = players[(starterIdx + pairIdx + 1) % players.length] ?? players[0];
  const pub = isPublicChaos(round.chaos);

  useEffect(() => {
    if (pub) sound.chaos();
    speak(host, lang, settings.voice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deadline-based countdown immune to timer drift
  const remainingMs = useRef(total * 1000);
  const lastTick = useRef(total);
  useEffect(() => {
    if (paused) return;
    const deadline = Date.now() + remainingMs.current;
    const id = setInterval(() => {
      const ms = Math.max(0, deadline - Date.now());
      remainingMs.current = ms;
      const s = Math.ceil(ms / 1000);
      if (s !== lastTick.current) {
        lastTick.current = s;
        if (s <= 10 && s >= 1) sound.tick();
        setLeft(s);
      }
      if (ms === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (left > 0) return;
    sound.lose();
    speak(hostLine('timeUp', lang), lang, settings.voice);
    const id = setTimeout(onVote, 1400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const nextPrompt = () => {
    sound.tap();
    setPrompt((prev) => randomPrompt(lang, round.category.id, prev));
    setPairIdx((v) => v + 1);
  };

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

      <div className="prompt-box prompt-box-lg">
        <span className="prompt-badge">{t('disc.prompt')}</span>
        <p className="prompt-pair">
          {t('disc.askPair', {
            asker: `${asker.avatar ?? ''} ${asker.name}`,
            target: `${target.avatar ?? ''} ${target.name}`,
          })}
        </p>
        <p className="prompt-text-lg">«{prompt}»</p>
        <button type="button" className="btn btn-accent" onClick={nextPrompt}>
          {t('disc.newPrompt')}
        </button>
      </div>

      <div className="host-bubble">🎙️ {host}</div>

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
