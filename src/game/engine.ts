import { CATEGORIES } from './words';
import type { Category, ChaosId, Dare, DareKind, Outcome, Player, Round, Settings, Word } from './types';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
export const CHAOS_CHANCE = 0.45;

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

export const DEFAULT_UNLOCKED_CATS = CATEGORIES.filter((c) => !c.lockedByDefault).map((c) => c.id);

export const DEFAULT_SETTINGS: Settings = {
  cat: 'food',
  unlockedCats: DEFAULT_UNLOCKED_CATS,
  chaos: true,
  voice: false,
  discussSec: 90,
  roles: true,
  customWords: DEFAULT_CUSTOM_WORDS,
  roomCode: '',
};

/** 42 diverse, family-friendly party punishments across 3 flavors: funny, acting, spicy. */
export const PUNISHMENTS: Dare[] = [
  // 😂 Funny (أحكام خفيفة ومضحكة)
  { kind: 'funny', ar: 'احكِ نكتة بايخة جداً، وإذا ما ضحك أحد صفّق لنفسك بحماس لمدة 10 ثوانٍ! 👏', en: 'Tell a terrible dad joke; if nobody laughs, applaud yourself for 10 seconds! 👏' },
  { kind: 'funny', ar: 'ممنوع تقول كلمة «لا» أو «أبداً» أو تحرك رأسك بالنفي لمدة 3 دقائق! 🚫', en: 'You cannot say “No” or shake your head for the next 3 minutes! 🚫' },
  { kind: 'funny', ar: 'امدح الشخص اللي على يمينك بـ 4 جمل شاعرية مبالغ فيها جداً! 🌹', en: 'Give the player on your right 4 overly dramatic, poetic compliments! 🌹' },
  { kind: 'funny', ar: 'جاوب على أي سؤال يوجهه لك اللاعبون بسؤال آخر لمدة دقيقتين! ❓', en: 'Answer every question asked to you with another question for 2 minutes! ❓' },
  { kind: 'funny', ar: 'حاول تضحك كل الموجودين في 20 ثانية بدون ما تلمس أحداً! 😂', en: 'Make everyone laugh within 20 seconds without touching anyone! 😂' },
  { kind: 'funny', ar: 'تكلم بدون ما تفتح أسنانك (وشفاهك شبه مطبقة) لمدة دقيقة كاملة! 🤐', en: 'Speak without separating your teeth for a full minute! 🤐' },
  { kind: 'funny', ar: 'اختر شيئاً جماداً في الغرفة (كرسي، كوب، جوال) واعتذر منه بحرارة وكأنك زعلته! ☕', en: 'Pick an inanimate object in the room and apologize to it dramatically! ☕' },
  { kind: 'funny', ar: 'عدّ من 20 إلى 1 بالعكس بأقصى سرعة، وإذا غلطت تعيد من الأول! 🔢', en: 'Count backwards from 20 to 1 at top speed; restart if you mess up! 🔢' },
  { kind: 'funny', ar: 'اضحك ضحكة شريرة متواصلة مثل أشرار الكرتون لمدة 15 ثانية! 😈', en: 'Do a continuous cartoon supervillain laugh for 15 seconds! 😈' },
  { kind: 'funny', ar: 'تكلّم مع نفسك في مراية أو كاميرا الجوال الأمامية وواسي نفسك على الخسارة! 🤳', en: 'Look into the front camera and pep-talk yourself about losing this round! 🤳' },
  { kind: 'funny', ar: 'اختر لقباً فخماً للاعب الذي كشفك ونادِه به طوال الجلسة (مثل: يا سعادة المحقق)! 🕵️', en: 'Call the player who exposed you “Supreme Detective” for the rest of the session! 🕵️' },
  { kind: 'funny', ar: 'اشرح للموجودين بكل جدية «كيف تصب كاسة موية» وكأنها عملية جراحية معقدة! 🫗', en: 'Explain how to pour a glass of water as if it were a complex surgical procedure! 🫗' },
  { kind: 'funny', ar: 'لازم تختم كل جملة تقولها بكلمة «يا طويل العمر» لمدة 3 دقائق! 🎩', en: 'End every sentence you say with “Your Excellency” for the next 3 minutes! 🎩' },
  { kind: 'funny', ar: 'غمّض عيونك وسمِّ الملابس وألوانها لثلاثة من الجالسين معك! 👀', en: 'Close your eyes and guess the outfit colors of three players in the room! 👀' },

  // 🎭 Acting & Voice (تمثيل وتحديات صوتية)
  { kind: 'acting', ar: 'تكلّم باللغة العربية الفصحى التاريخية («ويحك يا غلام!») لمدة 3 دقائق! 📜', en: 'Speak in dramatic medieval Shakespearean English for the next 3 minutes! 📜' },
  { kind: 'acting', ar: 'قف وقدّم نشرة أخبار عاجلة ومثيرة عن خسارتك المخزية في هذه الجولة لمدة 30 ثانية! 📺', en: 'Stand up and deliver a 30-second breaking news broadcast about your loss! 📺' },
  { kind: 'acting', ar: 'تكلّم وكأنك معلق مباريات كرة قدم في الدقيقة 90 على أي حركة يفعلها الجالسون! ⚽', en: 'Commentate on whatever people in the room are doing like a live football final! ⚽' },
  { kind: 'acting', ar: 'قلّد صوت ومشية حيوان يختاره بقية اللاعبين لمدة 20 ثانية! 🐒', en: 'Imitate the sound and walk of an animal chosen by the group for 20 seconds! 🐒' },
  { kind: 'acting', ar: 'غنِّ مطلع أنشودة أو أغنية أطفال مشهورة بصوت أوبرالي درامي حزين! 🎭', en: 'Sing a famous nursery rhyme in a tragic, dramatic opera voice! 🎭' },
  { kind: 'acting', ar: 'مثّل مشهد إعلان تجاري تلفزيوني لبيع «فردة شبشب قديمة» وأقنع الجالسين بشرائها! 🩴', en: 'Act out a TV commercial selling an old slipper and convince the group to buy it! 🩴' },
  { kind: 'acting', ar: 'تكلّم بصوت رجل آلي (روبوت) مع حركات يد متقطعة لمدة دقيقتين! 🤖', en: 'Talk and move like a glitching robot for the next 2 minutes! 🤖' },
  { kind: 'acting', ar: 'مثّل بدون كلام (بانتومايم) مهنة يختارها لك الشخص الذي على يسارك حتى يحزرها البقية! 🎬', en: 'Silently charade a job whispered to you by the player on your left! 🎬' },
  { kind: 'acting', ar: 'تكلّم بلهجة غير لهجتك يختارها لك اللاعبون لمدة دقيقتين كاملتين! 🗣️', en: 'Speak in a different accent chosen by the group for 2 full minutes! 🗣️' },
  { kind: 'acting', ar: 'تظاهر أنك في برنامج طبخ مباشر واشرح وصفة خيالية عجيبة بحماس شديد! 👨‍🍳', en: 'Pretend you are hosting a live cooking show making a bizarre imaginary dish! 👨‍🍳' },
  { kind: 'acting', ar: 'تكلّم بالهمس الشديد مع تعابير وجه درامية مبالغ فيها لمدة دقيقتين! 🤫', en: 'Speak only in dramatic whispers with exaggerated facial expressions for 2 minutes! 🤫' },
  { kind: 'acting', ar: 'قف وألقِ خطاب تخرّج مؤثر تشكر فيه اللاعبين لأنهم علموك درساً في الكذب! 🎓', en: 'Stand up and give an emotional graduation speech thanking the group! 🎓' },
  { kind: 'acting', ar: 'قلّد طريقة كلام وضحكة أحد الجالسين في الغرفة حتى يعرف الجميع من تقلّد! 🪞', en: 'Imitate the laugh and catchphrase of someone in the room until others guess who! 🪞' },
  { kind: 'acting', ar: 'تكلّم بالحركة البطيئة (Slow Motion) صوتاً وحركة لمدة دقيقة كاملة! 🐢', en: 'Talk and move in extreme slow motion for a full minute! 🐢' },

  // 🌶️ Spicy Party Dares (أحكام قوية للجمعات)
  { kind: 'spicy', ar: 'قم الآن واجلب كاسات موية (أو ضيافة) لكل اللاعبين الجالسين معك! 💧', en: 'Go fetch glasses of water or snacks for everyone in the group right now! 💧' },
  { kind: 'spicy', ar: 'اعترف بآخر كذبة بيضاء أو ترقيعة قلتها هذا الأسبوع بالتفصيل! 🤥', en: 'Confess the last harmless white lie or excuse you used this week in detail! 🤥' },
  { kind: 'spicy', ar: 'صوّر سيلفي بملامح مصدومة ومضحكة، وخلي المجموعة تختار تعليقاً تكتبه عليها! 📸', en: 'Take a funny shocked-face selfie and let the group caption it! 📸' },
  { kind: 'spicy', ar: 'اقرأ آخر 3 عمليات بحث كتبتها في يوتيوب أو جوجل بصوت عالٍ! 🔍', en: 'Read aloud your last 3 YouTube or Google search queries! 🔍' },
  { kind: 'spicy', ar: 'اتصل على صديق خارج الجلسة واسأله بكل جدية: «عندكم بطريق للبيع؟» ثم أقفل! 📞', en: 'Call a friend not in the room and seriously ask: “Do you sell penguins?”! 📞' },
  { kind: 'spicy', ar: 'أخبرنا بأكثر موقف محرج صار لك في مدرسة أو جامعة أو دوام! 😳', en: 'Share the most embarrassing moment that happened to you at school or work! 😳' },
  { kind: 'spicy', ar: 'ارسل إيموجي 🤡 بدون أي سبب لثالث شخص في محادثات الواتساب عندك! 📱', en: 'Send a single 🤡 emoji with no context to the 3rd chat in your messaging app! 📱' },
  { kind: 'spicy', ar: 'افتح تطبيق الصور وأرِ المجموعة أقدم صورة أو أطرف صورة لقطة شاشة في جوالك! 🖼️', en: 'Show the group the funniest screenshot or oldest photo on your phone! 🖼️' },
  { kind: 'spicy', ar: 'ابقَ واقفاً على قدم واحدة أثناء كلامك في بداية الجولة القادمة لمدة 30 ثانية! 🦩', en: 'Stand on one leg like a flamingo for 30 seconds! 🦩' },
  { kind: 'spicy', ar: 'سوِّ 10 تمارين ضغط أو قرفصاء (Squats) أمام الجميع وأنت تعد بصوت عالٍ! 💪', en: 'Do 10 squats right now while counting out loud! 💪' },
  { kind: 'spicy', ar: 'سلّم جوالك للاعب الذي على يمينك ليغير خلفية الشاشة لصورة مضحكة لمدة ساعة! 🎨', en: 'Let the player on your right pick a funny lock-screen wallpaper for the next hour! 🎨' },
  { kind: 'spicy', ar: 'قل لكل شخص في الجلسة أول انطباع خطر ببالك عنه أول مرة عرفته فيها! 🤝', en: 'Tell each player in the room your honest first impression when you first met them! 🤝' },
  { kind: 'spicy', ar: 'اعزم الشخص الذي كشفك في الجولة على قهوة أو حلى في أقرب طلعة! ☕', en: 'Treat the player who exposed you to coffee or dessert on your next outing! ☕' },
  { kind: 'spicy', ar: 'غنِّ بصوت عالٍ أغنية يختارها لك الموجودون لمدة 20 ثانية بدون توقف! 🎤', en: 'Sing a song chosen by the group out loud for 20 seconds nonstop! 🎤' },
];

export function filterDares(kind: DareKind | 'all'): Dare[] {
  if (kind === 'all') return PUNISHMENTS;
  return PUNISHMENTS.filter((d) => d.kind === kind);
}

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
    lockedByDefault: true,
    words: list.map((w) => ({ ar: w, en: w })),
  };
}

const PUBLIC_CHAOS: ChaosId[] = ['DOUBLE', 'SPEED', 'WHISPER'];
export const isPublicChaos = (c: ChaosId | null): boolean => c !== null && PUBLIC_CHAOS.includes(c);

function pickChaos(playerCount: number, rng: () => number): ChaosId {
  const pool: ChaosId[] = ['DECOY', 'SPEED', 'WHISPER'];
  if (playerCount >= 5) pool.push('DOUBLE');
  return pick(pool, rng);
}

/**
 * Builds a single-round match using the ONE chosen category.
 * Guaranteed: at least 1 liar (`liars.length >= 1`) in every round.
 */
export function createRound(
  players: Player[],
  category: Category,
  chaosOn: boolean,
  used: Set<string>,
  rolesOn = false,
  seedStr?: string,
): Round {
  const rng = makeRng(seedStr);
  let candidates = seedStr ? category.words : category.words.filter((x) => !used.has(`${category.id}:${x.ar}`));
  if (candidates.length < 6) candidates = category.words;
  const word = pick(candidates, rng);
  if (!seedStr) used.add(`${category.id}:${word.ar}`);

  const chaos: ChaosId | null = chaosOn && rng() < CHAOS_CHANCE ? pickChaos(players.length, rng) : null;

  const ids = players.map((p) => p.id);
  const liars: number[] = chaos === 'DOUBLE' && ids.length >= 4 ? shuffle(ids, rng).slice(0, 2) : [pick(ids, rng)];

  // Optional Special Roles (Jester 🤡 & Witness 🔮) when 4+ players
  let jesterId: number | null = null;
  let witnessId: number | null = null;
  let witnessPair: number[] | undefined;

  if (rolesOn && players.length >= 4) {
    const honestIds = shuffle(
      ids.filter((id) => !liars.includes(id)),
      rng,
    );
    if (honestIds.length >= 1 && rng() < 0.6) {
      jesterId = honestIds[0];
    }
    if (players.length >= 5 && honestIds.length >= 2 && rng() < 0.6) {
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

export interface RoundResolution {
  outcome: Outcome;
  /** Players who lost this round and must execute a punishment. */
  losers: Player[];
  /** Honest players who voted correctly for a Liar and earned smart immunity. */
  smartSurvivors: Player[];
}

/**
 * Tallies individual player votes (voterId -> suspectId) and returns the top-voted suspect ID.
 * Rule: A tie at the top saves the Liar! The Liar is only caught if they hold a strict majority
 * (or only Liars are tied at the top).
 */
export function tallyVotes(round: Round, players: Player[], votesMap: Record<number, number>): number {
  const counts = new Map<number, number>();
  for (const suspectId of Object.values(votesMap)) {
    counts.set(suspectId, (counts.get(suspectId) ?? 0) + 1);
  }
  let maxVotes = 0;
  for (const c of counts.values()) {
    if (c > maxVotes) maxVotes = c;
  }
  const topIds = players.map((p) => p.id).filter((id) => (counts.get(id) ?? 0) === maxVotes);
  if (topIds.length === 0) return players[0].id;
  if (round.jesterId != null && topIds.includes(round.jesterId)) return round.jesterId;
  // If tied at the top between an innocent and a Liar, the tie saves the Liar!
  const tiedInnocent = topIds.find((id) => !round.liars.includes(id));
  if (tiedInnocent !== undefined) return tiedInnocent;
  return topIds[0];
}

/**
 * Individual-Vote Punishment Resolution:
 * - Honest players who voted correctly for a Liar (`isLiar(votesMap[p.id])`) are exempted as `smartSurvivors`!
 * - If a Liar is caught by majority and guesses WRONG -> The caught Liar(s) are the losers!
 * - If a Liar escapes -> Only the honest players who voted WRONG are the losers!
 * - If a Liar is caught but guesses the secret word RIGHT -> Table flipped! Honest players face punishment!
 * - If Jester is voted out -> Players who didn't vote for the real Liar (except Jester) are the losers!
 */
export function resolveRound(
  round: Round,
  players: Player[],
  accused: number,
  guessedRight: boolean,
  votesMap: Record<number, number> = {},
): RoundResolution {
  const isLiar = (id: number) => round.liars.includes(id);
  const honestPlayers = players.filter((p) => !isLiar(p.id));
  const votedRight = (p: Player) => !isLiar(p.id) && votesMap[p.id] !== undefined && isLiar(votesMap[p.id]);
  const smartSurvivors = honestPlayers.filter(votedRight);
  const wrongHonestPlayers = honestPlayers.filter((p) => !votedRight(p));

  if (round.jesterId != null && accused === round.jesterId) {
    const jesterLosers = wrongHonestPlayers.filter((p) => p.id !== round.jesterId);
    return {
      outcome: 'GROUP_LOST_JESTER',
      losers: jesterLosers.length > 0 ? jesterLosers : players.filter((p) => p.id !== round.jesterId),
      smartSurvivors,
    };
  }

  const caught = isLiar(accused);
  if (caught && !guessedRight) {
    // Caught liar(s) must execute the punishment
    const caughtLiars = players.filter((p) => p.id === accused || isLiar(p.id));
    return {
      outcome: 'LIAR_LOST',
      losers: caughtLiars,
      smartSurvivors,
    };
  }

  if (caught && guessedRight) {
    // Liar guessed the secret word right -> table flipped!
    return {
      outcome: 'GROUP_LOST_GUESSED',
      losers: wrongHonestPlayers.length > 0 ? wrongHonestPlayers : honestPlayers,
      smartSurvivors,
    };
  }

  // Liar escaped majority vote -> anyone who voted RIGHT for the Liar is exempted; ONLY those who voted WRONG are punished!
  return {
    outcome: 'GROUP_LOST_ESCAPED',
    losers: wrongHonestPlayers.length > 0 ? wrongHonestPlayers : honestPlayers,
    smartSurvivors,
  };
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
