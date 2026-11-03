import { useEffect, useRef, useState } from 'react';
import { Discuss } from './components/Discuss';
import { Handoff } from './components/Handoff';
import { Home, HowTo } from './components/Home';
import { Final, Result } from './components/Result';
import { Setup } from './components/Setup';
import { Guess, Vote } from './components/VoteGuess';
import { createRound, DEFAULT_SETTINGS, loadJSON, saveJSON, scoreRound } from './game/engine';
import { hostLine, speak } from './game/host';
import type { Outcome, Player, Round, Settings } from './game/types';
import { CATEGORIES } from './game/words';
import { useLang } from './i18n';

type Screen = 'home' | 'setup' | 'handoff' | 'discuss' | 'vote' | 'guess' | 'result' | 'final';

const defaultPlayers = (): Player[] => [0, 1, 2, 3].map((id) => ({ id, name: '', score: 0 }));

export default function App() {
  const { t, lang } = useLang();
  const [screen, setScreen] = useState<Screen>('home');
  const [showHow, setShowHow] = useState(false);

  const [players, setPlayers] = useState<Player[]>(() => loadJSON<Player[]>('lq_players', defaultPlayers()));
  const [settings, setSettings] = useState<Settings>(() => loadJSON<Settings>('lq_settings', DEFAULT_SETTINGS));

  const [roundNo, setRoundNo] = useState(1);
  const [round, setRound] = useState<Round | null>(null);
  const [handIdx, setHandIdx] = useState(0);
  const [accused, setAccused] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<Outcome>('ESCAPED');
  const [deltas, setDeltas] = useState<Record<number, number>>({});
  const used = useRef<Set<string>>(new Set());

  useEffect(() => saveJSON('lq_settings', settings), [settings]);
  useEffect(() => saveJSON('lq_players', players.map((p) => ({ ...p, score: 0 }))), [players]);

  const activeCategories = () => {
    const picked = CATEGORIES.filter((c) => settings.cats.includes(c.id));
    return picked.length ? picked : CATEGORIES;
  };

  const beginRound = (ps: Player[], no: number) => {
    setRound(createRound(ps, activeCategories(), settings.chaos, used.current));
    setRoundNo(no);
    setHandIdx(0);
    setAccused(null);
    setScreen('handoff');
  };

  const startGame = () => {
    const fresh = players.map((p, i) => ({
      ...p,
      name: p.name.trim() || t('setup.player', { n: i + 1 }),
      score: 0,
    }));
    setPlayers(fresh);
    used.current = new Set();
    speak(hostLine('intro', lang), lang, settings.voice);
    beginRound(fresh, 1);
  };

  const finishRound = (acc: number | null, guessedRight: boolean) => {
    if (!round) return;
    const res = scoreRound(round, players, acc, guessedRight);
    setPlayers((ps) => ps.map((p) => ({ ...p, score: p.score + (res.deltas[p.id] ?? 0) })));
    setAccused(acc);
    setDeltas(res.deltas);
    setOutcome(res.outcome);
    setScreen('result');
  };

  const onVote = (acc: number | null) => {
    if (!round) return;
    const caught = acc !== null && round.liars.includes(acc);
    if (caught) {
      setAccused(acc);
      setScreen('guess');
    } else {
      finishRound(acc, false);
    }
  };

  const nextRound = () => {
    if (roundNo >= settings.rounds) setScreen('final');
    else beginRound(players, roundNo + 1);
  };

  const playAgain = () => {
    const reset = players.map((p) => ({ ...p, score: 0 }));
    setPlayers(reset);
    used.current = new Set();
    beginRound(reset, 1);
  };

  return (
    <div className="app">
      {screen === 'home' && <Home onPlay={() => setScreen('setup')} onHow={() => setShowHow(true)} />}

      {screen === 'setup' && (
        <Setup
          players={players}
          setPlayers={setPlayers}
          settings={settings}
          setSettings={setSettings}
          onStart={startGame}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'handoff' && round && (
        <Handoff
          key={`${roundNo}-${handIdx}`}
          player={players[handIdx]}
          round={round}
          roundNo={roundNo}
          totalRounds={settings.rounds}
          isLast={handIdx === players.length - 1}
          onNext={() => (handIdx < players.length - 1 ? setHandIdx(handIdx + 1) : setScreen('discuss'))}
        />
      )}

      {screen === 'discuss' && round && (
        <Discuss key={roundNo} round={round} players={players} settings={settings} onVote={() => setScreen('vote')} />
      )}

      {screen === 'vote' && <Vote key={roundNo} players={players} onConfirm={onVote} />}

      {screen === 'guess' && round && accused !== null && (
        <Guess
          key={roundNo}
          accused={players.find((p) => p.id === accused)!}
          round={round}
          onGuess={(ok) => finishRound(accused, ok)}
        />
      )}

      {screen === 'result' && round && (
        <Result
          key={roundNo}
          round={round}
          players={players}
          accused={accused}
          outcome={outcome}
          deltas={deltas}
          roundNo={roundNo}
          settings={settings}
          onNext={nextRound}
        />
      )}

      {screen === 'final' && (
        <Final players={players} settings={settings} onAgain={playAgain} onHome={() => setScreen('home')} />
      )}

      {showHow && <HowTo onClose={() => setShowHow(false)} />}
    </div>
  );
}

