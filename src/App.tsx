import { useEffect, useRef, useState } from 'react';
import { Discuss } from './components/Discuss';
import { Handoff } from './components/Handoff';
import { Home, HowTo } from './components/Home';
import { Result } from './components/Result';
import { Setup } from './components/Setup';
import { Guess, Vote } from './components/VoteGuess';
import { DramaticVoteReveal } from './components/DramaticVoteReveal';
import { initAds } from './game/ads';
import {
  AVATARS,
  buildCustomCategory,
  createRound,
  DEFAULT_SETTINGS,
  loadJSON,
  resolveRound,
  saveJSON,
  tallyVotes,
} from './game/engine';
import { hostLine, speak } from './game/host';
import type { Category, Outcome, Player, Round, Settings } from './game/types';
import { CATEGORIES } from './game/words';
import { useLang } from './i18n';

type Screen = 'home' | 'setup' | 'handoff' | 'discuss' | 'vote' | 'tally' | 'guess' | 'result';

const defaultPlayers = (): Player[] =>
  [0, 1, 2, 3].map((id, i) => ({ id, name: '', avatar: AVATARS[i % AVATARS.length] }));

export default function App() {
  const { t, lang } = useLang();
  const [screen, setScreen] = useState<Screen>('home');
  const [showHow, setShowHow] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('lq_onboarded');
    } catch {
      return false;
    }
  });

  const [players, setPlayers] = useState<Player[]>(() => loadJSON<Player[]>('lq_players', defaultPlayers()));
  const [settings, setSettings] = useState<Settings>(() => ({
    ...loadJSON<Settings>('lq_settings', DEFAULT_SETTINGS),
    roomCode: '',
  }));
  const gameNo = useRef(0);

  const [round, setRound] = useState<Round | null>(null);
  const [handIdx, setHandIdx] = useState(0);
  const [accused, setAccused] = useState<number | null>(null);
  const [votesMap, setVotesMap] = useState<Record<number, number>>({});
  const [outcome, setOutcome] = useState<Outcome>('GROUP_LOST_ESCAPED');
  const [losers, setLosers] = useState<Player[]>([]);
  const [smartSurvivors, setSmartSurvivors] = useState<Player[]>([]);
  const used = useRef<Set<string>>(new Set());

  useEffect(() => {
    void initAds();
  }, []);
  useEffect(() => saveJSON('lq_settings', { ...settings, roomCode: '' }), [settings]);
  useEffect(() => saveJSON('lq_players', players), [players]);

  const closeHow = () => {
    try {
      localStorage.setItem('lq_onboarded', '1');
    } catch {
      /* ignore */
    }
    setShowHow(false);
  };

  const activeCategory = (): Category => {
    const all = [...CATEGORIES, buildCustomCategory(settings.customWords)];
    return all.find((c) => c.id === settings.cat) ?? CATEGORIES[0];
  };

  const beginRound = (ps: Player[]) => {
    const code = settings.roomCode?.trim().toUpperCase();
    const cat = activeCategory();
    const seed = code ? `${code}-${cat.id}-G${gameNo.current}-P${ps.length}` : undefined;
    setRound(createRound(ps, cat, settings.chaos, used.current, settings.roles ?? true, seed));
    setHandIdx(0);
    setAccused(null);
    setVotesMap({});
    setSmartSurvivors([]);
    setScreen('handoff');
  };

  const startGame = () => {
    const fresh = players.map((p, i) => ({
      ...p,
      avatar: p.avatar ?? AVATARS[i % AVATARS.length],
      name: p.name.trim() || t('setup.player', { n: i + 1 }),
    }));
    setPlayers(fresh);
    gameNo.current += 1;
    speak(hostLine('intro', lang), lang, settings.voice);
    beginRound(fresh);
  };

  const finishRound = (acc: number, guessedRight: boolean, vMap: Record<number, number> = votesMap) => {
    if (!round) return;
    const res = resolveRound(round, players, acc, guessedRight, vMap);
    setAccused(acc);
    setOutcome(res.outcome);
    setLosers(res.losers);
    setSmartSurvivors(res.smartSurvivors);
    setScreen('result');
  };

  const onVote = (vMap: Record<number, number>) => {
    if (!round) return;
    setVotesMap(vMap);
    const acc = tallyVotes(round, players, vMap);
    setAccused(acc);
    setScreen('tally');
  };

  const onTallyDone = () => {
    if (!round || accused === null) return;
    const caught = round.liars.includes(accused);
    if (caught) {
      setScreen('guess');
    } else {
      finishRound(accused, false, votesMap);
    }
  };

  const playAgainSame = () => {
    gameNo.current += 1;
    beginRound(players);
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
          key={`${gameNo.current}-${handIdx}`}
          player={players[handIdx]}
          players={players}
          round={round}
          roomCode={settings.roomCode?.trim().toUpperCase() || undefined}
          isLast={handIdx === players.length - 1}
          onSelectPlayer={(idx) => setHandIdx(idx)}
          onSkipToDiscuss={() => setScreen('discuss')}
          onNext={() => (handIdx < players.length - 1 ? setHandIdx(handIdx + 1) : setScreen('discuss'))}
        />
      )}

      {screen === 'discuss' && round && (
        <Discuss
          key={gameNo.current}
          round={round}
          players={players}
          settings={settings}
          onVote={() => setScreen('vote')}
        />
      )}

      {screen === 'vote' && <Vote key={gameNo.current} players={players} onConfirm={onVote} />}

      {screen === 'tally' && round && accused !== null && (
        <DramaticVoteReveal
          key={gameNo.current}
          round={round}
          players={players}
          votesMap={votesMap}
          accusedId={accused}
          onDone={onTallyDone}
        />
      )}

      {screen === 'guess' && round && accused !== null && (
        <Guess
          key={gameNo.current}
          accused={players.find((p) => p.id === accused)!}
          round={round}
          onGuess={(ok) => finishRound(accused, ok)}
        />
      )}

      {screen === 'result' && round && (
        <Result
          key={gameNo.current}
          round={round}
          players={players}
          losers={losers}
          smartSurvivors={smartSurvivors}
          votesMap={votesMap}
          outcome={outcome}
          settings={settings}
          onAgainSame={playAgainSame}
          onChangeSetup={() => setScreen('setup')}
          onHome={() => setScreen('home')}
        />
      )}

      {showHow && <HowTo onClose={closeHow} />}
    </div>
  );
}
