import { DECOY_NAMES, FACTION_NAME, REGION_NAME } from './data';
import type {
  CommandOutcome, DeathRecord, DeductionResult, DetectiveDeductionState, ExecutionCommand,
  L10n, NewsItem, Region, SuspicionFactor, TargetProfile, Text, TurnHistory,
} from './types';

/** Tunable balance constants. */
export const SUSPICION = {
  CARDIAC: 12,
  ACCIDENT: 0,
  COERCED_LEAK: 3,
  CRYPTIC_MSG: 2,
  GANG_WAR: -6,
  FALSE_LEAD: -3,
  DETECTIVE_ATTEMPT: 25,
  MASS_KILL_PER_EXTRA: 4,
  NATIONAL_DECOY: 4,
  REGIONAL_DECOY: 8,
  MAX: 100,
} as const;

const REGIONS: Region[] = ['NORTH', 'WEST', 'EAST', 'SOUTH', 'CENTRAL'];
const REGION_POS: Record<Region, [number, number]> = {
  NORTH: [0, -1], WEST: [-1, 0], EAST: [1, 0], SOUTH: [0, 1], CENTRAL: [0, 0],
};
const OCCUPATION_TEMPLATES: { label: L10n; from: number; to: number }[] = [
  { label: { ar: 'طالب (نشاط مسائي)', en: 'a student (evening activity)' }, from: 15, to: 22 },
  { label: { ar: 'موظف دوام نهاري', en: 'a day-shift employee' }, from: 19, to: 24 },
  { label: { ar: 'عامل ليلي', en: 'a night worker' }, from: 0, to: 6 },
  { label: { ar: 'متفرغ / عمل حر', en: 'a freelancer / unemployed' }, from: 9, to: 15 },
];
const UNKNOWN: L10n = { ar: 'غير معروف', en: 'Unknown' };
const WINDOW_WIDTH = 4;

/* ------------------------------ helpers ------------------------------ */

/** Deterministic PRNG so a turn is reproducible/testable. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dist = (a: Region, b: Region) =>
  Math.hypot(REGION_POS[a][0] - REGION_POS[b][0], REGION_POS[a][1] - REGION_POS[b][1]);

function normalize(b: Record<Region, number>): Record<Region, number> {
  const sum = REGIONS.reduce((s, r) => s + b[r], 0) || 1;
  const out = {} as Record<Region, number>;
  REGIONS.forEach((r) => (out[r] = b[r] / sum));
  return out;
}

export function emptyDeduction(): DetectiveDeductionState {
  const geoBelief = {} as Record<Region, number>;
  REGIONS.forEach((r) => (geoBelief[r] = 1 / REGIONS.length));
  return {
    geoBelief, geoSharpness: 1 / REGIONS.length, narrowedRegion: null,
    hourHistogram: new Array(24).fill(0),
    profile: { label: UNKNOWN, window: null, confidence: 0 },
    timeScore: 0, decoyHits: 0, notes: [{ k: 'note.initial' }],
  };
}

/** Bayesian-style update: killers are assumed to live near the cluster. */
function updateGeo(prior: Record<Region, number>, rec: DeathRecord): Record<Region, number> {
  // Accidents need physical presence => strong locality; gang wars / false leads blur the picture.
  const k = rec.method === 'ACCIDENT' ? 1.4 : (rec.method === 'GANG_WAR' || rec.method === 'FALSE_LEAD') ? 0.3 : 0.7;
  const post = {} as Record<Region, number>;
  REGIONS.forEach((r) => (post[r] = prior[r] * Math.exp(-k * dist(r, rec.region))));
  return normalize(post);
}

/** Sliding circular window with the most deaths. */
function bestWindow(hist: number[]) {
  let best = { start: 0, count: -1 };
  for (let s = 0; s < 24; s++) {
    let c = 0;
    for (let i = 0; i < WINDOW_WIDTH; i++) c += hist[(s + i) % 24];
    if (c > best.count) best = { start: s, count: c };
  }
  return best;
}

function inferProfile(hist: number[], total: number): DetectiveDeductionState['profile'] {
  if (total === 0) return { label: UNKNOWN, window: null, confidence: 0 };
  const w = bestWindow(hist);
  const hours = Array.from({ length: WINDOW_WIDTH }, (_, i) => (w.start + i) % 24);
  let bestT = OCCUPATION_TEMPLATES[0];
  let bestOverlap = -1;
  for (const t of OCCUPATION_TEMPLATES) {
    const o = hours.filter((h) => h >= t.from && h < t.to).length;
    if (o > bestOverlap) { bestOverlap = o; bestT = t; }
  }
  const confidence = (w.count / total) * Math.min(1, total / 4);
  return { label: bestT.label, window: { from: w.start, to: w.start + WINDOW_WIDTH }, confidence };
}

/* ------------------------------ news generators ------------------------------ */

function deathNews(
  rec: DeathRecord,
  t: TargetProfile,
  id: string,
  faction?: ExecutionCommand['faction'],
  targetRegion?: Region,
  crypticNote?: string,
): NewsItem {
  const national = t.priority === 'CORRUPT' || t.priority === 'DETECTIVE';
  let headline: Text;
  if (rec.method === 'CARDIAC') {
    headline = { k: 'news.CARDIAC', p: { name: t.name } };
  } else if (rec.method === 'ACCIDENT') {
    headline = { k: 'news.ACCIDENT', p: { name: t.name, place: t.routine.place } };
  } else if (rec.method === 'COERCED_LEAK') {
    headline = { k: 'news.COERCED_LEAK', p: { name: t.name } };
  } else if (rec.method === 'CRYPTIC_MSG') {
    const rName = targetRegion ? REGION_NAME[targetRegion] : REGION_NAME.WEST;
    headline = { k: 'news.CRYPTIC_MSG', p: { name: t.name, r: rName } };
  } else if (rec.method === 'GANG_WAR' || rec.method === 'FALSE_LEAD') {
    const fName = faction ? FACTION_NAME[faction] : FACTION_NAME.SYNDICATE;
    headline = { k: 'news.GANG_WAR', p: { name: t.name, faction: fName } };
  } else {
    headline = { k: 'news.CARDIAC', p: { name: t.name } };
  }

  const segments: NewsItem['segments'] = [
    { kind: 'text', text: { k: 'news.body', p: { precinct: t.precinct } } },
  ];

  if (rec.method === 'CRYPTIC_MSG' && crypticNote) {
    segments.push({
      kind: 'text',
      text: {
        ar: `الشرطة: وُجدت عبارة غامضة بدم الضحية: "${crypticNote}"`,
        en: `Police: A cryptic note written in blood: "${crypticNote}"`,
      },
    });
  }

  return {
    id, day: rec.day + 1, channel: 'NEWS', scope: national ? 'NATIONAL' : 'REGIONAL',
    region: national ? undefined : t.region, source: { k: 'src.agency' },
    headline, verified: true, isDecoy: false,
    segments,
  };
}

function buildDecoy(day: number, region: Region, scope: 'NATIONAL' | 'REGIONAL', rng: () => number, id: string) {
  const name = DECOY_NAMES[Math.floor(rng() * DECOY_NAMES.length)];
  const target: TargetProfile = {
    id: `decoy-${day}`, name, faceId: `f-decoy-${day}`,
    title: { ar: 'مجرم مُدان طليق', en: 'Convicted criminal at large' }, region,
    precinct: { ar: `قسم ${REGION_NAME[region].ar} 1`, en: `${REGION_NAME[region].en} Precinct 1` },
    priority: 'DECOY', alive: true, decoyScope: scope,
    routine: { place: { ar: 'غير معروف', en: 'Unknown' }, window: { from: 0, to: 0 } },
  };
  const item: NewsItem = {
    id, day, channel: 'NEWS', scope, region: scope === 'REGIONAL' ? region : undefined,
    source: scope === 'NATIONAL' ? { k: 'src.tv' } : { k: 'src.radio', p: { r: REGION_NAME[region] } },
    headline: scope === 'NATIONAL'
      ? { k: 'news.decoy.n', p: { name } }
      : { k: 'news.decoy.r', p: { r: REGION_NAME[region], name } },
    verified: false, isDecoy: true,
    segments: [
      { kind: 'text', text: { k: 'news.unconfirmed' } },
      { kind: 'name', targetId: target.id },
      { kind: 'face', targetId: target.id, caption: { k: 'face.tv' } },
    ],
  };
  return { target, item };
}

/* ------------------------------ the core algorithm ------------------------------ */

/**
 * Evaluates one detective turn.
 * @param actions commands that resolve this turn
 * @param history snapshot of everything the detective can observe
 */
export function evaluateTurn(actions: ExecutionCommand[], history: TurnHistory): DeductionResult {
  const targets = new Map(history.targets.map((t) => [t.id, t]));
  const rng = mulberry32(history.day * 7919 + history.records.length * 31);
  const d: DetectiveDeductionState = {
    ...history.deduction,
    geoBelief: { ...history.deduction.geoBelief },
    hourHistogram: [...history.deduction.hourHistogram],
    notes: [...history.deduction.notes],
  };
  const breakdown: SuspicionFactor[] = [];
  const add = (label: Text, value: number) => { if (value !== 0) breakdown.push({ label, value }); };

  const outcomes: CommandOutcome[] = [];
  const newRecords: DeathRecord[] = [];
  const news: NewsItem[] = [];
  const newTargets: TargetProfile[] = [];
  let seq = 0;
  const nid = () => `n-d${history.day}-${seq++}`;
  let trapped = false;
  let successes = 0;

  // 1) Resolve each command and apply method-specific suspicion.
  for (const cmd of actions) {
    const t = targets.get(cmd.targetId);
    if (!t) continue;

    // The detective is protected: sudden cardiac arrest on him fails and exposes the player.
    if (cmd.method === 'CARDIAC' && t.priority === 'DETECTIVE') {
      outcomes.push({ commandId: cmd.id, success: false, reason: { k: 'r.immune' } });
      add({ k: 'f.detAttempt' }, SUSPICION.DETECTIVE_ATTEMPT);
      d.notes.unshift({ k: 'note.attempt' });
      continue;
    }

    outcomes.push({ commandId: cmd.id, success: true });
    successes++;
    const decoy = t.priority === 'DECOY';
    const rec: DeathRecord = {
      day: cmd.scheduledDay, hour: cmd.scheduledHour, targetId: t.id, region: t.region,
      precinct: t.precinct, method: cmd.method, decoy,
      targetRegion: cmd.targetRegion, crypticNote: cmd.crypticNote,
      coercedAction: cmd.coercedAction, alibiCreated: cmd.alibiCreated,
    };
    newRecords.push(rec);
    news.push(deathNews(rec, t, nid(), cmd.faction, cmd.targetRegion, cmd.crypticNote));
    add({ k: `f.${cmd.method}` }, SUSPICION[cmd.method] ?? 0);

    if (cmd.alibiCreated) {
      add({ k: 'f.alibi' }, -4);
      d.notes.unshift({
        ar: `مفارقة محيّرة: وفاة ${t.name.ar} وقعت أثناء تواجد المشتبه به في قاعة العمل/الدراسة، ما يشوش نموذج التوقيت!`,
        en: `Puzzling paradox: death of ${t.name.en} happened while prime suspect was occupied, confusing the time profile!`,
      });
    }

    if (cmd.method === 'COERCED_LEAK') {
      d.notes.unshift({
        ar: `تسريب أمني إلكتروني: حاسوب الضحية ${t.name.ar} قام بنسخ وثيقة سرية للمحقق سايفر قبل موته بدقائق!`,
        en: `Security breach: victim ${t.name.en}'s computer mirrored classified intelligence on Detective Cipher minutes before death!`,
      });
    }

    // 2) Decoy trap handling.
    if (decoy) {
      if (t.decoyScope === 'REGIONAL') {
        // Only visible on regional feeds: whoever acts on it lives/reads there.
        if (d.decoyHits >= 1) trapped = true; // second bite of the same bait = fatal
        d.decoyHits++;
        d.narrowedRegion = t.region;
        REGIONS.forEach((r) => (d.geoBelief[r] = r === t.region ? 0.85 : 0.0375));
        add({ k: 'f.regional' }, SUSPICION.REGIONAL_DECOY);
        d.notes.unshift({ k: 'note.regional', p: { r: REGION_NAME[t.region] } });
      } else {
        add({ k: 'f.national' }, SUSPICION.NATIONAL_DECOY);
        d.notes.unshift({ k: 'note.national' });
      }
    }
  }

  // 3) Mass-kill penalty.
  if (successes > 2) add({ k: 'f.mass' }, (successes - 2) * SUSPICION.MASS_KILL_PER_EXTRA);

  // 4) Update geo + time models from genuine (non-decoy) kills.
  const prevSharp = d.geoSharpness;
  for (const rec of newRecords) {
    if (rec.decoy) continue;
    if (!d.narrowedRegion) d.geoBelief = updateGeo(d.geoBelief, rec);
    d.hourHistogram[Math.floor(rec.hour) % 24]++;
    if (rec.method === 'CRYPTIC_MSG') {
      const decoyReg = rec.targetRegion || 'WEST';
      REGIONS.forEach((r) => {
        if (r !== decoyReg) {
          const stolen = d.geoBelief[r] * 0.40;
          d.geoBelief[r] -= stolen;
          d.geoBelief[decoyReg] += stolen;
        }
      });
      d.notes.unshift({
        ar: `رسالة دم غامضة في مسرح الجريمة تشير إلى ${REGION_NAME[decoyReg].ar}، فريق التحقيق يعيد تمشيط المنطقة!`,
        en: `Cryptic blood note at crime scene points to ${REGION_NAME[decoyReg].en}, task force re-sweeps the sector!`,
      });
    } else if (rec.method === 'GANG_WAR' || rec.method === 'FALSE_LEAD') {
      // Staged suicides / gang wars divert police attention: blend toward uniform.
      REGIONS.forEach((r) => (d.geoBelief[r] = d.geoBelief[r] * 0.70 + 0.30 / REGIONS.length));
      d.notes.unshift({
        ar: `اقتتال داخلي عنيف يُغرق الشرطة والإنتربول في تحقيقات حرب عصابات!`,
        en: `Violent gang warfare mires police and Interpol in syndicate investigations!`,
      });
    }
  }
  const genuine = [...history.records, ...newRecords].filter((r) => !r.decoy);
  d.geoSharpness = Math.max(...REGIONS.map((r) => d.geoBelief[r]));
  if (genuine.length >= 3 && !d.narrowedRegion) {
    add({ k: 'f.geo' }, Math.round(Math.max(0, d.geoSharpness - prevSharp) * 30));
  }

  // 5) Habit correlation: peaked hours that overlap the player's real free time.
  const total = d.hourHistogram.reduce((a, b) => a + b, 0);
  d.profile = inferProfile(d.hourHistogram, total);
  const prevTime = d.timeScore;
  if (total >= 3) {
    const inFree = genuine.filter((r) => history.schedule.freeHours.includes(Math.floor(r.hour))).length;
    d.timeScore = d.profile.confidence * (inFree / genuine.length);
    add({ k: 'f.time' }, Math.round(Math.max(0, d.timeScore - prevTime) * 25));
  }

  // 6) Totals and verdict.
  const suspicionDelta = breakdown.reduce((s, f) => s + f.value, 0);
  const newSuspicion = Math.min(SUSPICION.MAX, Math.max(0, history.suspicion + suspicionDelta));

  if (d.profile.confidence >= 0.4 && d.profile.window) {
    const top = REGIONS.reduce((a, b) => (d.geoBelief[b] > d.geoBelief[a] ? b : a));
    const line: Text = {
      k: 'note.estimate', p: { occ: d.profile.label, r: REGION_NAME[top], h: d.profile.window.from % 24 },
    };
    d.notes.unshift(line);
    news.push({
      id: nid(), day: history.day + 1, channel: 'POLICE', scope: 'NATIONAL', source: { k: 'src.presser' },
      headline: { k: 'news.presser' }, verified: true, isDecoy: false,
      segments: [{ kind: 'text', text: line }],
    });
  }

  // 7) Plant new bait every other day (max two live decoys).
  const nextDay = history.day + 1;
  const liveDecoys = history.targets.filter((t) => t.priority === 'DECOY' && t.alive).length;
  if (nextDay >= 2 && nextDay % 2 === 0 && liveDecoys < 2) {
    const topRegion = REGIONS.reduce((a, b) => (d.geoBelief[b] > d.geoBelief[a] ? b : a));
    const scope = rng() < 0.5 ? 'NATIONAL' : 'REGIONAL';
    const { target, item } = buildDecoy(nextDay, topRegion, scope, rng, nid());
    newTargets.push(target);
    news.push(item);
  }

  d.notes = d.notes.slice(0, 6);
  const verdict = trapped ? 'TRAPPED' : newSuspicion >= SUSPICION.MAX ? 'ARRESTED' : 'CONTINUE';
  return { outcomes, newRecords, suspicionDelta, newSuspicion, breakdown, deduction: d, news, newTargets, verdict };
}
