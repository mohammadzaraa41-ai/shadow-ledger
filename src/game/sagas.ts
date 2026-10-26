import type { L10n } from './types';

export interface MajorSaga {
  id: string;
  number: number;
  title: L10n;
  subtitle: L10n;
  adversary: L10n;
  playtimeEst: string;
  difficulty: 'BALANCED' | 'HARD' | 'MASTERMIND';
  difficultyColor: string;
  badge: L10n;
  lore: L10n;
  targetCount: number;
  features: L10n[];
  unlockedByDefault: boolean;
}

export interface SagaProgressState {
  unlockedSagaId: string;
  activeSagaId: string;
  completedSagas: Record<string, { cleared: boolean; rank: 'S' | 'A' | 'B'; clearedAt: string }>;
}

const STORAGE_KEY = 'shadow_ledger_sagas_v1';

export const MAJOR_SAGAS: MajorSaga[] = [
  {
    id: 'saga-1-cipher',
    number: 1,
    title: { ar: 'القضية الأولى: صراع العاصمة ضد المحقق سايفر', en: 'Case 1: The Capital Duel vs Detective Cipher' },
    subtitle: { ar: 'البداية الكلاسيكية والمواجهة المباشرة ضد عبقري التحقيق الأول', en: 'The classic awakening and direct duel against the legendary chief detective' },
    adversary: { ar: 'المحقق سايفر (L)', en: 'Detective Cipher (L)' },
    playtimeEst: '25 دقيقة',
    difficulty: 'BALANCED',
    difficultyColor: '#3b82f6',
    badge: { ar: '⚔️ مواجهة متوازنة', en: '⚔️ Balanced Mind-Game' },
    lore: {
      ar: 'تسقط قوة الدفتر في العاصمة. يتدخل المحقق الأسطوري سايفر لقيادة فرقة التحقيق الدولية. حرب استدلالية ذكية تعتمد على التوقيت وكشف فخاخ التلفاز والطعوم الإقليمية.',
      en: 'The ledger descends upon the capital. The enigmatic Chief Detective Cipher intervenes to lead the Interpol Task Force. A pure deductive battle of timing, alibis, and TV sting traps.',
    },
    targetCount: 9,
    features: [
      { ar: 'فخ البث التلفزيوني الحي لـ Lind L. Tailor', en: 'Live TV Sting Broadcast of Lind L. Tailor' },
      { ar: 'تتبع الساعات واستدلال جدول الحياة اليومية', en: 'Timetable profiling & schedule correlation' },
      { ar: 'ذروة الـ 40 ثانية الحاسمة لإسقاط المحقق', en: 'Fatal 40-second Climax Duel' },
    ],
    unlockedByDefault: true,
  },
  {
    id: 'saga-2-syndicate',
    number: 2,
    title: { ar: 'القضية الثانية: كارتل الشركات وحرب الأقمار الصناعية', en: 'Case 2: The Corporate Syndicate & Satellite War' },
    subtitle: { ar: 'تغلغل الفساد في 8 كبرى شركات التكنولوجيا والبنوك الدولية', en: 'Corruption entrenched in 8 multinational tech and banking conglomerates' },
    adversary: { ar: 'كارتل المدراء الثمانية + الأمن السيبراني الدولي', en: 'The Board of Eight & Cyber Command' },
    playtimeEst: '35 دقيقة',
    difficulty: 'HARD',
    difficultyColor: '#f59e0b',
    badge: { ar: '🔥 تعقيد استخباراتي عالي', en: '🔥 High Strategic Complexity' },
    lore: {
      ar: 'بعد زلزال العاصمة، تتحالف كبرى الشركات لتشكيل كارتل سري يملك حراسات خاصة وحصانات قضائية دولية. يراقبون الاتصالات بالأقمار الصناعية ويحاولون شراء الدفتر أو احتكاره.',
      en: 'In the aftermath of the capital duel, global mega-corporations unite into a secret conglomerate with private paramilitaries and satellite wiretaps, hunting the Shadow to exploit the Ledger.',
    },
    targetCount: 11,
    features: [
      { ar: '8 مدراء شركات فاسدين بحصانات دولية', en: '8 corrupt corporate directors with private security' },
      { ar: 'مراقبة الأقمار الصناعية والتنصت المشفر', en: 'Satellite surveillance & encrypted offshore records' },
      { ar: 'تصفية مجالس الإدارة عبر حوادث متسلسلة', en: 'Chain-reaction staged executive accidents' },
    ],
    unlockedByDefault: true,
  },
  {
    id: 'saga-3-successors',
    number: 3,
    title: { ar: 'القضية الثالثة: صراع الورثة المزدوج (Neo & Viper)', en: 'Case 3: The Twin Successors (Neo & Viper)' },
    subtitle: { ar: 'مواجهة جبهتين في آن واحد: المباحث الفيدرالية ضد المافيا المسلحة', en: 'A two-front war: Federal Task Force prodigy vs Rogue Mafia warlord' },
    adversary: { ar: 'العبقري الفيدرالي Neo & زعيم المافيا Viper', en: 'Federal Prodigy Neo & Underworld Kingpin Viper' },
    playtimeEst: '45 دقيقة',
    difficulty: 'MASTERMIND',
    difficultyColor: '#ef4444',
    badge: { ar: '⚡ أقصى درجات الدهاء والتحدي', en: '⚡ Ultimate Mastermind Challenge' },
    lore: {
      ar: 'يظهر وريثان لأسطورة التحقيق: الأول (Neo) عبقري متجرد من العواطف يقود المباحث الدولية بالأدلة الرياضية، والآخر (Viper) مجرم عبقري لا يتردد في خطف المسؤولين. يجب أن تجعلهما يتصادمان معاً دون أن يدركا أنك تحرك خيوطهما!',
      en: 'Two brilliant successors rise: Neo commands global intelligence with cold logic, while Viper leads armed syndicates with ruthless brutality. You must manipulate them into destroying each other.',
    },
    targetCount: 14,
    features: [
      { ar: 'مواجهة خصمين ذكيين في نفس الوقت', en: 'Simultaneous duel against two rival masterminds' },
      { ar: 'التلاعب بالصراع المسلح بين المافيا والشرطة', en: 'Instigating proxy crossfire between FBI and Mob' },
      { ar: 'المواجهة الكبرى النهائية لتقرير مصير العالم', en: 'Grand Finale determining the fate of the new world' },
    ],
    unlockedByDefault: false,
  },
];

export function getSagaProgress(): SagaProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.activeSagaId) {
        return parsed;
      }
    }
  } catch {}

  return {
    unlockedSagaId: 'saga-2-syndicate',
    activeSagaId: 'saga-1-cipher',
    completedSagas: {},
  };
}

export function saveSagaProgress(progress: SagaProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}
