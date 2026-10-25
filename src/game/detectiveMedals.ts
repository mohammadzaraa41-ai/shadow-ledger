export interface DetectiveMedal {
  id: string;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const STORAGE_KEY = 'shadow_ledger_detective_medals';

export const INITIAL_MEDALS: DetectiveMedal[] = [
  {
    id: 'MEDAL_LIND_TRAP',
    title: { ar: 'وسام فخ التحدي التلفزيوني', en: 'Master Baiter Commendation' },
    desc: {
      ar: 'نجاح استدراج الفاعل لتصفية السجين البديل على الهواء وحصر موقعه الجغرافي.',
      en: 'Successfully baited the culprit to eliminate the decoy on live TV and pinpoint the sector.',
    },
    icon: '📺',
    unlocked: false,
  },
  {
    id: 'MEDAL_SCHEDULE_CRACK',
    title: { ar: 'محلل النمط الزمني', en: 'Circadian Pattern Cracker' },
    desc: {
      ar: 'استنتاج وتحديد ساعات نشاط القاتل بدقة تفوق 80% بناءً على توقيت الوفيات.',
      en: 'Accurately profiled the culprit’s daily activity timetable from casualty timestamps.',
    },
    icon: '⏱️',
    unlocked: false,
  },
  {
    id: 'MEDAL_SECTOR_ENCIRCLE',
    title: { ar: 'تطويق القطاع السكني', en: 'Sector Encirclement Award' },
    desc: {
      ar: 'حصر الشبهة في قطاع سكني واحد بنسبة احتمال تفوق 75% عبر التحليل الجنائي.',
      en: 'Narrowed suspect residency belief above 75% in a single sector through forensics.',
    },
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'MEDAL_DECOY_HOOK',
    title: { ar: 'فخ الطُعم الإقليمي', en: 'Decoy Trap Specialist' },
    desc: {
      ar: 'استدراج القاتل لكتابة اسم سجين وهمي بثته الشرطة محلياً لإثبات قدرته على القتل.',
      en: 'Tricked the killer into targeting a regional police decoy identity.',
    },
    icon: '🪤',
    unlocked: false,
  },
  {
    id: 'MEDAL_CHECKMATE',
    title: { ar: 'كش ملك: القيود في معصم القاتل', en: 'Supreme Checkmate: Handcuffs' },
    desc: {
      ar: 'إصدار أمر مداهمة حاسم وصحيح أدى إلى تطويق منزل القاتل واعتقاله متلبساً!',
      en: 'Executed a flawless raid warrant arresting the mastermind red-handed!',
    },
    icon: '🚨',
    unlocked: false,
  },
];

export function getDetectiveMedals(): DetectiveMedal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_MEDALS;
    const parsed = JSON.parse(raw);
    return INITIAL_MEDALS.map((base) => {
      const found = parsed.find((p: DetectiveMedal) => p.id === base.id);
      return found ? { ...base, unlocked: found.unlocked, unlockedAt: found.unlockedAt } : base;
    });
  } catch {
    return INITIAL_MEDALS;
  }
}

export function unlockDetectiveMedal(id: string): boolean {
  try {
    const medals = getDetectiveMedals();
    const target = medals.find((m) => m.id === id);
    if (!target || target.unlocked) return false;

    target.unlocked = true;
    target.unlockedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medals));

    // Dispatch custom event for UI toast
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('detective-medal-unlocked', { detail: target }));
    }
    return true;
  } catch {
    return false;
  }
}
