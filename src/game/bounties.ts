import type { L10n, Region, TimeWindow } from './types';

export interface DailyBounty {
  id: string;
  name: L10n;
  faceId: string;
  alias: L10n;
  crime: L10n;
  region: Region;
  precinct: L10n;
  routine: { place: L10n; window: TimeWindow };
  bountyXP: number;
  clue: L10n;
  dateKey: string;
}

export interface BountyProgressState {
  completedBounties: Record<string, { clearedAt: string; xpAwarded: number }>;
  totalHunterXP: number;
  hunterRank: 'NOVICE' | 'VIGILANTE' | 'SHADOW_REAPER' | 'GOD_OF_DEATH';
}

const STORAGE_KEY = 'shadow_ledger_bounties_v1';

const BOUNTY_ROSTER: Omit<DailyBounty, 'dateKey'>[] = [
  {
    id: 'bounty-1',
    name: { ar: 'كازويا شيندو', en: 'Kazuya Shindo' },
    faceId: 'f-k1',
    alias: { ar: 'شبح الميناء المظلم', en: 'Dark Harbor Ghost' },
    crime: { ar: 'تهريب أسلحة دولية واغتيال شاهدين في المحكمة', en: 'International arms trafficking and witness elimination' },
    region: 'SOUTH',
    precinct: { ar: 'قسم الجنوب 3', en: 'South Precinct 3' },
    routine: { place: { ar: 'مستودع الحاويات رقم 4', en: 'Container Warehouse 4' }, window: { from: 21, to: 23 } },
    bountyXP: 500,
    clue: { ar: 'تنصت سري: يشاهد بانتظام سفن الشحن القادمة بين 21:00 و 23:00.', en: 'Wiretap: observed inspecting cargo ships between 21:00 and 23:00.' },
  },
  {
    id: 'bounty-2',
    name: { ar: 'ماكوتو أوكي', en: 'Makoto Aoki' },
    faceId: 'f-k2',
    alias: { ar: 'مهندس غسيل الأموال', en: 'The Black Laundromat' },
    crime: { ar: 'اختلاس 120 مليون دولار من صناديق المتقاعدين', en: 'Embezzling $120M in pension funds' },
    region: 'WEST',
    precinct: { ar: 'قسم الغرب 1', en: 'West Precinct 1' },
    routine: { place: { ar: 'صالة البلياردو السرية بالغرب', en: 'West Underground Billiard Hall' }, window: { from: 18, to: 20 } },
    bountyXP: 450,
    clue: { ar: 'كاميرا المراقبة: يدخل النادي بسيارة سوداء معتمة قبل الغروب.', en: 'CCTV: enters the club in a tinted black sedan before sunset.' },
  },
  {
    id: 'bounty-3',
    name: { ar: 'شينيتشي كورودا', en: 'Shinichi Kuroda' },
    faceId: 'f-c2',
    alias: { ar: 'المفوض المرتشي', en: 'The Shield for Hire' },
    crime: { ar: 'تغطية شبكات الاتجار وتصفية ضابط شرطة شريف', en: 'Protecting human trafficking rings and framing honest cops' },
    region: 'CENTRAL',
    precinct: { ar: 'قسم الوسط 2', en: 'Central Precinct 2' },
    routine: { place: { ar: 'مطعم السوشي الراقي بالوسط', en: 'Central Luxury Sushi Bar' }, window: { from: 13, to: 15 } },
    bountyXP: 600,
    clue: { ar: 'تقرير استخباراتي: يتناول غداءه في الجناح الخاص مع تجار محليين.', en: 'Intel report: takes lunch in the VIP booth with local kingpins.' },
  },
  {
    id: 'bounty-4',
    name: { ar: 'رين أوكادا', en: 'Ren Okada' },
    faceId: 'f-k1',
    alias: { ar: 'القرصان الأسود', en: 'Blackout Hacker' },
    crime: { ar: 'ابتزاز المستشفيات وشل محطات توليد الطاقة الكهربائية', en: 'Blackmailing hospitals and crippling regional power grids' },
    region: 'EAST',
    precinct: { ar: 'قسم الشرق 4', en: 'East Precinct 4' },
    routine: { place: { ar: 'مقهى الإنترنت المهجور بالشرق', en: 'East Abandoned Cybercafe' }, window: { from: 23, to: 24 } },
    bountyXP: 750,
    clue: { ar: 'رصد شبكات: يبدأ بروتوكول البث الرقمي المشفر بعد منتصف الليل.', en: 'Network trace: initializes encrypted data dump right at midnight.' },
  },
];

export function getTodayBounty(): DailyBounty {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % BOUNTY_ROSTER.length;
  const template = BOUNTY_ROSTER[index];

  return {
    ...template,
    id: `${template.id}-${today}`,
    dateKey: today,
  };
}

export function getBountyProgress(): BountyProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.totalHunterXP === 'number') {
        return parsed;
      }
    }
  } catch {}

  return {
    completedBounties: {},
    totalHunterXP: 0,
    hunterRank: 'NOVICE',
  };
}

export function saveBountyProgress(progress: BountyProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export function claimBountyReward(
  bountyId: string,
  xp: number,
  prev: BountyProgressState,
): BountyProgressState {
  const newXP = prev.totalHunterXP + xp;
  let newRank: BountyProgressState['hunterRank'] = 'NOVICE';
  if (newXP >= 2500) newRank = 'GOD_OF_DEATH';
  else if (newXP >= 1200) newRank = 'SHADOW_REAPER';
  else if (newXP >= 500) newRank = 'VIGILANTE';

  const updated: BountyProgressState = {
    ...prev,
    completedBounties: {
      ...prev.completedBounties,
      [bountyId]: {
        clearedAt: new Date().toISOString(),
        xpAwarded: xp,
      },
    },
    totalHunterXP: newXP,
    hunterRank: newRank,
  };

  saveBountyProgress(updated);
  return updated;
}
