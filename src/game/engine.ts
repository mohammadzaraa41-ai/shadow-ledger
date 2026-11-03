import { CATEGORIES } from './words';
import type { Category, ChaosId, L10n, Outcome, Player, Round, Settings, Word } from './types';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
export const CHAOS_CHANCE = 0.4;

export const AVATARS = ['😎', '🦊', '🦁', '🐼', '🦄', '🐸', '🐙', '🦉', '🐯', '🤠', '👽', '🤖', '🥷', '👑', '🎭', '🦖'];

export const DEFAULT_CUSTOM_WORDS = [
  'شاورما زيادة ثوم',
  'سهرة الخميس',
  'طلعة البر',
  'قهوة مختصة',
  'امتحان مفاجئ',
  'نومة العصر',
  'كشتة شتوية',
  'عزيمة مفاجئة',
];

export const DEFAULT_SETTINGS: Settings = {
  cats: CATEGORIES.map((c) => c.id),
  rounds: 5,
  chaos: true,
  voice: false,
  discussSec: 90,
  roles: true,
  customWords: DEFAULT_CUSTOM_WORDS,
  roomCode: '',
};

export const PUNISHMENTS: L10n[] = [
  { ar: 'تكلّم باللغة العربية الفصحى طوال الجولة القادمة! 📜', en: 'Speak in formal Shakespearean English all next round! 📜' },
  { ar: 'احكِ نكتة بايخة وإذا ما ضحك أحد صفق لنفسك بحماس! 👏', en: 'Tell a terrible dad joke; if nobody laughs, applaud yourself! 👏' },
  { ar: 'قلّد صوت ومشية حيوان يختاره الفائز لمدة 15 ثانية! 🐒', en: 'Imitate an animal chosen by the winner for 15 seconds! 🐒' },
  { ar: 'امدح كل لاعب في الجلسة بجملة شاعرية مبالغ فيها! 🌹', en: 'Give every player in the room an overly poetic compliment! 🌹' },
  { ar: 'ممنوع تقول كلمة «لا» أو «أبداً» في الجولة القادمة! 🚫', en: 'You are forbidden from saying “No” during the next round! 🚫' },
  { ar: 'صوّر سيلفي بملامح مصدومة مع الفائز بالمركز الأول! 📸', en: 'Take a shocked-face selfie with the current top player! 📸' },
  { ar: 'اعترف بآخر كذبة بيضاء قلتها هذا الأسبوع! 🤥', en: 'Confess the last harmless white lie you told this week! 🤥' },
  { ar: 'قف وقدّم نشرة أخبار عاجلة عن خسارتك المخزية لمدة 20 ثانية! 📺', en: 'Stand up and deliver a 20-second breaking news report about your loss! 📺' },
  { ar: 'جاوب على كل سؤال في الجولة القادمة بسؤال آخر! ❓', en: 'Answer every question in the next round with another question! ❓' },
  { ar: 'غنِّ مطلع أغنية أطفال بصوت أوبرالي درامي! 🎭', en: 'Sing a nursery rhyme in a dramatic opera voice! 🎭' },
  { ar: 'اجلب كاسات ماء لكل اللاعبين في الجلسة الآن! 💧', en: 'Go fetch glasses of water for everyone in the group right now! 💧' },
  { ar: 'تكلّم وكأنك معلق مباريات كرة قدم متحمس لمدة دقيقة! ⚽', en: 'Speak like an overly hyped football commentator for 1 minute! ⚽' },
];

/** Creates a deterministic PRNG from a string seed (or falls back to Math.random). */
export function makeRng(seedStr?: string): () => number {
  if (!seedStr) return () => Math.random();
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: T[], rng: () => number = Math.random): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildCustomCategory(customWords: string[] = []): Category {
  const valid = customWords.map((w) => w.trim()).filter(Boolean);
  const list = valid.length >= 4 ? valid : DEFAULT_CUSTOM_WORDS;
  return {
    id: 'custom',
    emoji: '✨',
    name: { ar: 'كلماتنا الخاصة', en: 'Custom Words' },
    words: list.map((w) => ({ ar: w, en: w })),
  };
}

const PUBLIC_CHAOS: ChaosId[] = ['DOUBLE', 'SPEED', 'WHISPER'];
export const isPublicChaos = (c: ChaosId | null): boolean => c !== null && PUBLIC_CHAOS.includes(c);

function pickChaos(playerCount: number, rng: () => number): ChaosId {
  const pool: ChaosId[] = ['DECOY', 'SPEED', 'WHISPER', 'NO_LIAR'];
  if (playerCount >= 5) pool.push('DOUBLE');
  return pick(pool, rng);
}

/** Builds a new round. `used` holds `${category}:${wordAr}` keys so words do not repeat in a session. */
export function createRound(
  players: Player[],
  categories: Category[],
  chaosOn: boolean,
  used: Set<string>,
  rolesOn = false,
  seedStr?: string,
): Round {
  const rng = makeRng(seedStr);
  const category = pick(categories, rng);
  let candidates = seedStr ? category.words : category.words.filter((x) => !used.has(`${category.id}:${x.ar}`));
  if (candidates.length < 6) candidates = category.words;
  const word = pick(candidates, rng);
  if (!seedStr) used.add(`${category.id}:${word.ar}`);

  const chaos: ChaosId | null = chaosOn && rng() < CHAOS_CHANCE ? pickChaos(players.length, rng) : null;

  const ids = players.map((p) => p.id);
  let liars: number[];
  if (chaos === 'NO_LIAR') liars = [];
  else if (chaos === 'DOUBLE') liars = shuffle(ids, rng).slice(0, 2);
  else liars = [pick(ids, rng)];

  // Optional Special Roles (Jester 🤡 & Witness 🔮) when 4+ players and at least 1 liar
  let jesterId: number | null = null;
  let witnessId: number | null = null;
  let witnessPair: number[] | undefined;

  if (rolesOn && players.length >= 4 && liars.length >= 1) {
    const honestIds = shuffle(
      ids.filter((id) => !liars.includes(id)),
      rng,
    );
    if (honestIds.length >= 1 && rng() < 0.65) {
      jesterId = honestIds[0];
    }
    if (players.length >= 5 && honestIds.length >= 2 && rng() < 0.65) {
      witnessId = honestIds[1];
      const otherInnocents = honestIds.filter((id) => id !== witnessId);
      const innocentSuspect = otherInnocents[0] ?? honestIds[0];
      witnessPair = shuffle([liars[0], innocentSuspect], rng);
    }
  }

  const others = category.words.filter((x) => x.ar !== word.ar);
  const decoyWord = chaos === 'DECOY' && others.length > 0 ? pick(others, rng) : undefined;
  const options = shuffle([word, ...shuffle(others, rng).slice(0, 5)], rng);

  return {
    category,
    word,
    decoyWord,
    liars,
    jesterId,
    witnessId,
    witnessPair,
    chaos,
    starter: pick(ids, rng),
    options,
  };
}

export interface RoundScore {
  deltas: Record<number, number>;
  outcome: Outcome;
}

/**
 * Scoring:
 * - Jester voted out: Jester steals the win (+3)!
 * - Liar escapes: +3 (or +2 each when there are two liars).
 * - Liar caught but guesses the word: liar +2.
 * - Liar caught and fails: every honest player +1.
 * - Nobody accused in a no-liar round: everyone +2. Accusing someone there costs them -1.
 */
export function scoreRound(round: Round, players: Player[], accused: number | null, guessedRight: boolean): RoundScore {
  const deltas: Record<number, number> = {};
  players.forEach((p) => (deltas[p.id] = 0));
  const isLiar = (id: number) => round.liars.includes(id);

  if (accused !== null && round.jesterId === accused) {
    deltas[accused] = 3;
    return { deltas, outcome: 'JESTER_WIN' };
  }

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
