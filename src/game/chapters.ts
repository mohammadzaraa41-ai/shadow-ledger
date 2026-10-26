import type { GameState } from './store';
import type { L10n } from './types';

export interface ChapterObjective {
  id: string;
  title: L10n;
  check: (state: GameState) => boolean;
}

export interface StoryChapter {
  id: number;
  title: L10n;
  subtitle: L10n;
  dangerLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  dangerColor: string;
  badge: L10n;
  dayRange: string;
  intro: L10n;
  clearNarrative: L10n;
  objectives: ChapterObjective[];
}

export interface ChapterClearRecord {
  cleared: boolean;
  rank: 'S' | 'A' | 'B';
  clearedAtDay: number;
  suspicion: number;
  timestamp: string;
}

export interface ChapterProgressState {
  unlockedChapter: number;
  activeChapter: number;
  completed: Record<number, ChapterClearRecord>;
}

const STORAGE_KEY = 'shadow_ledger_chapters_v1';

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: { ar: 'الفصل الأول: ولادة الظل', en: 'Chapter 1: Awakening of The Shadow' },
    subtitle: { ar: 'بداية الصحوة وتجربة أحكام الإعدام', en: 'The initial awakening and testing death verdicts' },
    dangerLevel: 'LOW',
    dangerColor: '#2ecc71',
    badge: { ar: '🟢 خطورة منخفضة', en: '🟢 Low Danger' },
    dayRange: 'الأيام 1 — 4',
    intro: {
      ar: 'وقعت قوة الدفتر بين يديك. المحقق سايفر لا يزال يجهل وجودك والشرطة تعتقد أن الوفيات صدفة عابرة. اثبت حضورك بتصفية أهدافك الأولى بحذر.',
      en: 'The ledger has fallen into your hands. Detective Cipher is unaware of your existence, and police assume the deaths are coincidence. Prove your presence discreetly.',
    },
    clearNarrative: {
      ar: 'عاجل: وكالات الأنباء العالمية تعلن رسمياً اجتماعاً طارئاً للإنتربول! أدرك العالم أن هناك يداً خفية تنزل القصاص بالمجرمين. أسطورة قاضي الظل بدأت!',
      en: 'BREAKING: International agencies declare an emergency Interpol summit! The world now realizes a hidden hand executes retribution. The legend has begun!',
    },
    objectives: [
      {
        id: 'c1_obj_kills',
        title: { ar: 'تصفية 3 مجرمين وفاسدين على الأقل', en: 'Eliminate at least 3 corrupt or criminal targets' },
        check: (s) => s.player.kills.length >= 3,
      },
      {
        id: 'c1_obj_susp',
        title: { ar: 'الحفاظ على مؤشر الشبهة دون 35%', en: 'Maintain suspicion index below 35%' },
        check: (s) => s.player.suspicion <= 35,
      },
    ],
  },
  {
    id: 2,
    title: { ar: 'الفصل الثاني: فخ البث والطعوم', en: 'Chapter 2: The Media Sting & Decoys' },
    subtitle: { ar: 'تدخل المحقق سايفر وبث ليند إل. تايلور الحي', en: 'Detective Cipher intervenes with Lind L. Tailor live sting' },
    dangerLevel: 'MEDIUM',
    dangerColor: '#f1c40f',
    badge: { ar: '🟡 خطورة متوسطة', en: '🟡 Medium Danger' },
    dayRange: 'الأيام 5 — 9',
    intro: {
      ar: 'المحقق سايفر يتدخل شخصياً! يبدأ بنصب شراك إعلامية وبثوث تلفزيونية حية لاستفزازك وحصر مدينتك. يجب أن تقاوم الاستفزاز وتضلل راداره الجنائي.',
      en: 'Detective Cipher takes personal charge! Live broadcast traps and sting operations are launched to bait you. Resist the temptation and mislead his radar.',
    },
    clearNarrative: {
      ar: 'المحقق سايفر في مذكرة داخلية: "الفاعل أذكى مما توقعت.. لقد تفادى فخاخنا التلفزيونية واستخدم تضليلاً حرك رادارنا. سننتقل لمرحلة المراقبة اللصيقة!"',
      en: 'Detective Cipher confidential memo: "The killer is shrewder than anticipated. They bypassed our sting traps and deflected our radar. Covert surveillance begins!"',
    },
    objectives: [
      {
        id: 'c2_obj_corrupt',
        title: { ar: 'تصفية اثنين من كبار الفاسدين (الوزير أو القاضي أو المدير)', en: 'Eliminate at least 2 major corrupt officials' },
        check: (s) => s.targets.filter((t) => t.priority === 'CORRUPT' && !t.alive).length >= 2,
      },
      {
        id: 'c2_obj_decoy',
        title: { ar: 'عدم السقوط في فخ الطُعم الإقليمي لسايفر', en: 'Do not trigger Cipher regional decoy trap' },
        check: (s) => s.deduction.decoyHits === 0,
      },
      {
        id: 'c2_obj_deception',
        title: { ar: 'استخدام أسلوب تضليلي (رسالة دم أو اقتتال عصابات)', en: 'Deploy a deceptive method (Blood Riddle or Gang War)' },
        check: (s) => s.records.some((r) => r.method === 'CRYPTIC_MSG' || r.method === 'GANG_WAR'),
      },
    ],
  },
  {
    id: 3,
    title: { ar: 'الفصل الثالث: عيون في غرفتك', en: 'Chapter 3: The Surveillance War' },
    subtitle: { ar: 'كاميرات المراقبة، التمويه، وحجة الغياب القاطعة', en: 'Night-vision wiretaps, camouflage, and airtight alibis' },
    dangerLevel: 'HIGH',
    dangerColor: '#e67e22',
    badge: { ar: '🟠 خطورة عالية', en: '🟠 High Danger' },
    dayRange: 'الأيام 10 — 15',
    intro: {
      ar: 'المحقق سايفر ضيّق دائرة الشبهة حول قطاعك ونصب كاميرات وتنصت سري. الكتابة بدون حيلة التمويه تعني الاعتقال الفوري! استخدم حجة الغياب لكسر تحليله الزمني.',
      en: 'Detective Cipher tightens the perimeter around your sector with night-vision cameras and wiretaps. Writing without camouflage triggers instant SWAT raid! Use alibi timing to shatter his time profile.',
    },
    clearNarrative: {
      ar: 'الشرطة تداهم موقعاً وهمياً مشتبهاً به وتجده خالياً! حجج غيابك المتقنة وتوقيت الحوادث أثناء دوامك الرسمي أصابت تحليلات سايفر بالشلل المؤقت!',
      en: 'SWAT teams breach a suspected apartment and find nothing! Your alibi timestamps during busy hours paralyzed Cipher’s behavioral hypothesis!',
    },
    objectives: [
      {
        id: 'c3_obj_all_corrupt',
        title: { ar: 'تطهير جميع الفاسدين الثلاثة (الوزير، القاضي، مدير الشرطة)', en: 'Purge all 3 corrupt officials (Minister, Judge, Chief)' },
        check: (s) => s.targets.filter((t) => t.priority === 'CORRUPT').every((t) => !t.alive),
      },
      {
        id: 'c3_obj_alibi',
        title: { ar: 'تنفيذ حادث مدبر واحد على الأقل مع حجة غياب قاطعة', en: 'Execute at least 1 Staged Accident with an Airtight Alibi' },
        check: (s) => s.records.some((r) => r.method === 'ACCIDENT' && r.alibiCreated),
      },
      {
        id: 'c3_obj_susp_limit',
        title: { ar: 'إنهاء الفصل بنسبة شبهة أقل من 70%', en: 'Conclude chapter with suspicion below 70%' },
        check: (s) => s.player.suspicion < 70,
      },
    ],
  },
  {
    id: 4,
    title: { ar: 'الفصل الرابع: كش ملك والمواجهة الحاسمة', en: 'Chapter 4: The Checkmate Duel' },
    subtitle: { ar: 'اختراق الإنتربول، إسقاط قناع L، وعد التنازلي للـ 40 ثانية', en: 'Interpol breach, unmasking L, and the fatal 40-second duel' },
    dangerLevel: 'EXTREME',
    dangerColor: '#e74c3c',
    badge: { ar: '🔴 أقصى درجات الخطورة', en: '🔴 Extreme Danger' },
    dayRange: 'الأيام 16+',
    intro: {
      ar: 'وصل الصراع إلى ذروته التاريخية. المحقق سايفر على وشك إصدار مذكرة المداهمة النهائية. يجب عليك كشف هويته الحقيقية كاملة وتسطير اسمه قبل أن يسبقك!',
      en: 'The clash reaches its historic climax. Detective Cipher is primed to execute a final raid. You must fully uncover his true identity and inscribe his fate before he strikes!',
    },
    clearNarrative: {
      ar: 'سقط المحقق الأسطوري صريعاً! العالم الجديد ينحني لسيد الظل. لا فاسد يعلو فوق العدالة ولا محقق يوقف مسيرتك. كش ملك مطلق!',
      en: 'The legendary detective collapses! The new world kneels before The Shadow. No corrupt escapes and no detective halts your reign. Absolute Checkmate!',
    },
    objectives: [
      {
        id: 'c4_obj_intel_l',
        title: { ar: 'استخراج شظايا هوية المحقق L بنسبة 100% (الاسم والوجه)', en: 'Extract 100% of Detective L dossier (True Name & Face)' },
        check: (s) => {
          const lIntel = s.player.intelProgress?.['L'];
          return Boolean(lIntel?.hasSurname && lIntel?.hasFace);
        },
      },
      {
        id: 'c4_obj_criminals',
        title: { ar: 'تصفية 5 مجرمين كبار على الأقل', en: 'Eliminate at least 5 major criminal targets' },
        check: (s) => s.targets.filter((t) => t.priority === 'CRIMINAL' && !t.alive).length >= 5,
      },
      {
        id: 'c4_obj_kill_l',
        title: { ar: 'إسقاط وتصفية المحقق سايفر (L)', en: 'Eliminate Detective Cipher (L)' },
        check: (s) => !s.targets.find((t) => t.priority === 'DETECTIVE')?.alive,
      },
    ],
  },
];

export function getChapterProgress(): ChapterProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.unlockedChapter === 'number') {
        return parsed;
      }
    }
  } catch {}

  return {
    unlockedChapter: 1,
    activeChapter: 1,
    completed: {},
  };
}

export function saveChapterProgress(progress: ChapterProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export function calculateChapterRank(suspicion: number, spellingErrors: number): 'S' | 'A' | 'B' {
  if (suspicion <= 20 && spellingErrors === 0) return 'S';
  if (suspicion <= 48) return 'A';
  return 'B';
}

export function checkChapterCompletion(
  chapterId: number,
  state: GameState,
): { isComplete: boolean; incompleteObjectives: string[] } {
  const chapter = STORY_CHAPTERS.find((c) => c.id === chapterId);
  if (!chapter) return { isComplete: false, incompleteObjectives: [] };

  const incomplete: string[] = [];
  for (const obj of chapter.objectives) {
    if (!obj.check(state)) {
      incomplete.push(obj.id);
    }
  }

  return {
    isComplete: incomplete.length === 0,
    incompleteObjectives: incomplete,
  };
}
