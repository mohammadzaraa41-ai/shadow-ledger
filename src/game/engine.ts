import { CATEGORIES } from './words';
import type { Category, ChaosId, Outcome, Player, Round, Settings, Word } from './types';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
export const CHAOS_CHANCE = 0.4;

export const DEFAULT_SETTINGS: Settings = {
  cats: CATEGORIES.map((c) => c.id),
  rounds: 5,
  chaos: true,
  voice: false,
  discussSec: 90,
};

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PUBLIC_CHAOS: ChaosId[] = ['DOUBLE', 'SPEED', 'WHISPER'];
export const isPublicChaos = (c: ChaosId | null): boolean => c !== null && PUBLIC_CHAOS.includes(c);

function pickChaos(playerCount: number): ChaosId {
  const pool: ChaosId[] = ['DECOY', 'SPEED', 'WHISPER', 'NO_LIAR'];
  if (playerCount >= 5) pool.push('DOUBLE');
  return pick(pool);
}

/** Builds a new round. `used` holds `${category}:${wordAr}` keys so words do not repeat in a session. */
export function createRound(
  players: Player[],
  categories: Category[],
  chaosOn: boolean,
  used: Set<string>,
): Round {
  const category = pick(categories);
  let candidates = category.words.filter((x) => !used.has(`${category.id}:${x.ar}`));
  if (candidates.length < 6) candidates = category.words;
  const word = pick(candidates);
  used.add(`${category.id}:${word.ar}`);

  const chaos: ChaosId | null = chaosOn && Math.random() < CHAOS_CHANCE ? pickChaos(players.length) : null;

  const ids = players.map((p) => p.id);
  let liars: number[];
  if (chaos === 'NO_LIAR') liars = [];
  else if (chaos === 'DOUBLE') liars = shuffle(ids).slice(0, 2);
  else liars = [pick(ids)];

  const others = category.words.filter((x) => x.ar !== word.ar);
  const decoyWord = chaos === 'DECOY' ? pick(others) : undefined;
  const options = shuffle([word, ...shuffle(others).slice(0, 5)]);

  return { category, word, decoyWord, liars, chaos, starter: pick(ids), options };
}

export interface RoundScore {
  deltas: Record<number, number>;
  outcome: Outcome;
}

/**
 * Scoring:
 * - Liar escapes: +3 (or +2 each when there are two liars).
 * - Liar caught but guesses the word: liar +2.
 * - Liar caught and fails: every honest player +1.
 * - Nobody accused in a no-liar round: everyone +2. Accusing someone there costs them -1.
 */
export function scoreRound(round: Round, players: Player[], accused: number | null, guessedRight: boolean): RoundScore {
  const deltas: Record<number, number> = {};
  players.forEach((p) => (deltas[p.id] = 0));
  const isLiar = (id: number) => round.liars.includes(id);

  if (round.liars.length === 0) {
    if (accused === null) {
      players.forEach((p) => (deltas[p.id] = 2));
      return { deltas, outcome: 'NO_LIAR_OK' };
    }
    deltas[accused] = -1;
    return { deltas, outcome: 'NO_LIAR_WRONG' };
  }

  const survive = round.liars.length > 1 ? 2 : 3;
  const caught = accused !== null && isLiar(accused);

  if (!caught) {
    round.liars.forEach((id) => (deltas[id] = survive));
    return { deltas, outcome: 'ESCAPED' };
  }

  // Other liar (double chaos) survives either way.
  round.liars.filter((id) => id !== accused).forEach((id) => (deltas[id] = survive));

  if (guessedRight) {
    deltas[accused!] = 2;
    return { deltas, outcome: 'CAUGHT_GUESS_RIGHT' };
  }
  players.filter((p) => !isLiar(p.id)).forEach((p) => (deltas[p.id] = 1));
  return { deltas, outcome: 'CAUGHT_GUESS_WRONG' };
}

export const wordOf = (w: Word, lang: 'ar' | 'en'): string => w[lang];

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(fallback) ? (parsed as T) : ({ ...fallback, ...parsed } as T);
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: ignore */
  }
}
