export interface SteamAchievement {
  id: string;
  name: { ar: string; en: string };
  desc: { ar: string; en: string };
  icon: string;
  rarity: 'Common' | 'Rare' | 'Ultra Rare';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface SteamTradingCard {
  id: string;
  title: { ar: string; en: string };
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Foil';
  lore: { ar: string; en: string };
  badgeLevel: number;
}

export const STEAM_ACHIEVEMENTS_LIST: SteamAchievement[] = [
  {
    id: 'ACH_FIRST_INK',
    name: { ar: 'أول قطرة حبر', en: 'First Drop of Ink' },
    desc: { ar: 'اكتب اسمك الأول في دفتر الظل.', en: 'Write your very first name in the Shadow Ledger.' },
    icon: '🖋️',
    rarity: 'Common',
    unlocked: false,
  },
  {
    id: 'ACH_GHOST',
    name: { ar: 'الشبح الخفي', en: 'The Ghost Mastermind' },
    desc: { ar: 'أنهِ يوماً كاملاً بنسبة شبهة 0%.', en: 'Complete a full day with exactly 0% suspicion.' },
    icon: '👻',
    rarity: 'Rare',
    unlocked: false,
  },
  {
    id: 'ACH_ACCIDENT_ARTIST',
    name: { ar: 'مهندس الحوادث', en: 'Staged Calamity' },
    desc: { ar: 'نفّذ حادثاً مدبراً ناجحاً بعد رصد روتين الهدف.', en: 'Execute a successful staged accident using routine intel.' },
    icon: '⚡',
    rarity: 'Common',
    unlocked: false,
  },
  {
    id: 'ACH_FALSE_TRAIL',
    name: { ar: 'تضليل العدالة', en: 'False Trail' },
    desc: { ar: 'ألصق التهمة بفصيل آخر وخفّض نسبة الشبهة.', en: 'Frame another faction and reduce suspicion.' },
    icon: '🎭',
    rarity: 'Common',
    unlocked: false,
  },
  {
    id: 'ACH_OUTSMART_L',
    name: { ar: 'تفوقتَ على المحقق L', en: 'Outsmarting L' },
    desc: { ar: 'اكتشف فخاً إعلامياً كاذباً للمحقق وتجنبه.', en: 'Detect and bypass a deceptive decoy trap set by L.' },
    icon: '🧠',
    rarity: 'Rare',
    unlocked: false,
  },
  {
    id: 'ACH_CHECKMATE',
    name: { ar: 'كش ملك، يا L', en: 'Checkmate, L' },
    desc: { ar: 'اقضِ على المحقق L بحادث مدبّر قبل أن يقبض عليك.', en: 'Eliminate Detective L via staged accident.' },
    icon: '👑',
    rarity: 'Ultra Rare',
    unlocked: false,
  },
  {
    id: 'ACH_CLEAN_HANDS',
    name: { ar: 'العدالة المطلقة', en: 'Absolute Justice' },
    desc: { ar: 'حقق النصر النهائي دون أن تتجاوز نسبة الشبهة 35%.', en: 'Achieve total victory with under 35% suspicion.' },
    icon: '⚖️',
    rarity: 'Ultra Rare',
    unlocked: false,
  },
];

export const STEAM_TRADING_CARDS: SteamTradingCard[] = [
  {
    id: 'CARD_1_LEDGER',
    title: { ar: 'دفتر الظل الأسود', en: 'The Black Ledger' },
    rarity: 'Common',
    lore: { ar: 'سجل غامض ذو قواعد لا ترحم، يربط الاسم والوجه بالمصير.', en: 'A mystic tome with unforgiving rules tying name and face to demise.' },
    badgeLevel: 1,
  },
  {
    id: 'CARD_2_L',
    title: { ar: 'المحقق العبقري L', en: 'Master Detective L' },
    rarity: 'Uncommon',
    lore: { ar: 'عقل استقرائي بارد يراقب أنماط التوقيت والجغرافيا بلا انفعال.', en: 'A calculated deductive mastermind analyzing timing and geography.' },
    badgeLevel: 2,
  },
  {
    id: 'CARD_3_PEN',
    title: { ar: 'قلم الريشة القرمزي', en: 'The Crimson Nib' },
    rarity: 'Rare',
    lore: { ar: 'كل خدش يتركه على الورق يتردد صداه كحكم نهائي.', en: 'Every violent scratch upon parchment echoes as an irrevocable sentence.' },
    badgeLevel: 3,
  },
  {
    id: 'CARD_4_ROOM',
    title: { ar: 'ملاذ العقل المدبّر', en: "The Mastermind's Sanctum" },
    rarity: 'Uncommon',
    lore: { ar: 'غرفة مظلمة تحت المطر، وشاشات ترصد نبض المدينة.', en: 'A rain-streaked dark haven of monitors monitoring the city pulse.' },
    badgeLevel: 4,
  },
  {
    id: 'CARD_5_JUDGEMENT',
    title: { ar: 'اليوم الأخير للفساد', en: 'Day of Reckoning' },
    rarity: 'Rare',
    lore: { ar: 'عندما يسقط النظام القديم ويولد عهد جديد.', en: 'When the old oligarchy crumbles and a new era rises.' },
    badgeLevel: 5,
  },
  {
    id: 'CARD_6_FOIL',
    title: { ar: 'إله العالم الجديد [Foil]', en: 'God of the New World [Foil]' },
    rarity: 'Foil',
    lore: { ar: 'البطاقة الفضية اللامعة النادرة للمحترف الذي انتصر على الجميع.', en: 'Ultra rare shimmering foil card for the absolute victor.' },
    badgeLevel: 6,
  },
];

const STORAGE_KEY = 'shadow_ledger_steam_achievements';

type Listener = (ach: SteamAchievement) => void;
const listeners: Set<Listener> = new Set();

export function getUnlockedAchievements(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function subscribeSteamAchievements(fn: Listener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function unlockSteamAchievement(id: string): SteamAchievement | null {
  const current = getUnlockedAchievements();
  if (current.has(id)) return null;

  const ach = STEAM_ACHIEVEMENTS_LIST.find((a) => a.id === id);
  if (!ach) return null;

  current.add(id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // Ignore storage errors
  }

  // Forward to Electron desktop IPC if running in desktop build
  if (typeof window !== 'undefined' && (window as unknown as { steamAPI?: { unlockAchievement: (id: string) => void } }).steamAPI) {
    (window as unknown as { steamAPI: { unlockAchievement: (id: string) => void } }).steamAPI.unlockAchievement(id);
  }

  const result: SteamAchievement = { ...ach, unlocked: true, unlockedAt: new Date().toLocaleTimeString() };
  listeners.forEach((fn) => fn(result));
  return result;
}
