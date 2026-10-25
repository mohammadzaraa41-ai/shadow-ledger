import { useEffect, useReducer } from 'react';
import { matchesName } from '../i18n';
import { BASE_TARGETS, MAX_DAYS, buildBaseFeed } from './data';
import { emptyDeduction, evaluateTurn } from './detectiveAI';
import type {
  ClimaxState, DeathMethod, DeathRecord, DetectiveDeductionState, ExecutionCommand, Faction, GameStatus, L10n,
  NewsItem, PlayerState, Region, SuspicionFactor, TargetProfile, Text,
} from './types';

export interface ReportLine { ok: boolean; name: L10n; reason?: Text }

export interface DayReport {
  day: number;
  delta: number;
  breakdown: SuspicionFactor[];
  lines: ReportLine[];
  notes: Text[];
}

export interface GameState {
  player: PlayerState;
  targets: TargetProfile[];
  news: NewsItem[];
  records: DeathRecord[];
  deduction: DetectiveDeductionState;
  status: GameStatus;
  report: DayReport | null;
  surveillanceRegions: Region[];
  mediaBlackoutRegions: Region[];
  climax: ClimaxState | null;
}

export interface LedgerInput {
  name: string;
  faceTargetId: string | null;
  method: DeathMethod;
  hour?: number;
  faction?: Faction;
}

export type Action =
  | { type: 'CAPTURE_NAME'; targetId: string }
  | { type: 'CAPTURE_FACE'; targetId: string }
  | { type: 'CAPTURE_ROUTINE'; targetId: string }
  | { type: 'UNLOCK_INTEL'; targetId: string; piece: 'surname' | 'face' | 'firstName' }
  | { type: 'SUBMIT'; input: LedgerInput }
  | { type: 'ADVANCE_HOUR' }
  | { type: 'END_DAY' }
  | { type: 'DISMISS_REPORT' }
  | { type: 'SHINIGAMI_EYE_DEAL' }
  | { type: 'REGISTER_SPELLING_ERROR'; targetId?: string }
  | { type: 'DETECTIVE_ADVANCE_DAY'; kiraCommands: ExecutionCommand[] }
  | { type: 'SET_GAME_STATUS'; status: GameStatus }
  | { type: 'PLANT_DECOY_TARGET'; region: Region; fakeName: L10n }
  | { type: 'DEPLOY_CAMERAS'; region: Region }
  | { type: 'MEDIA_BLACKOUT'; region: Region }
  | { type: 'ACTIVATE_CAMOUFLAGE' }
  | { type: 'HACK_POLICE_DATABASE' }
  | { type: 'AMBUSH_FBI_TAIL' }
  | { type: 'START_CLIMAX'; initiatedBy: 'KILLER' | 'DETECTIVE'; targetId?: string; reason: L10n }
  | { type: 'TICK_CLIMAX' }
  | { type: 'CANCEL_CLIMAX' }
  | { type: 'RESET' };

export function getTargetIntel(p: PlayerState, targetId: string) {
  if (p.hasShinigamiEyes) {
    return { hasSurname: true, hasFace: true, hasFirstName: true, percent: 100, isComplete: true };
  }
  const intel = p.intelProgress?.[targetId] || {};
  let count = 0;
  if (intel.hasSurname) count += 33;
  if (intel.hasFace) count += 33;
  if (intel.hasFirstName) count += 34;
  const percent = Math.min(100, count);
  return {
    hasSurname: Boolean(intel.hasSurname),
    hasFace: Boolean(intel.hasFace),
    hasFirstName: Boolean(intel.hasFirstName),
    percent,
    isComplete: percent >= 100,
  };
}

const STORAGE_KEY = 'shadow_ledger_game_state_v1';

export function initialState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.player && parsed.targets && parsed.status === 'PLAYING') {
        return {
          ...parsed,
          surveillanceRegions: parsed.surveillanceRegions || [],
          mediaBlackoutRegions: parsed.mediaBlackoutRegions || [],
          climax: parsed.climax || null,
          player: {
            ...parsed.player,
            immuneTargets: parsed.player.immuneTargets || [],
            intelProgress: parsed.player.intelProgress || {},
          },
        };
      }
    }
  } catch {}

  return {
    player: {
      day: 1, hour: 18, homeRegion: 'WEST',
      schedule: { freeHours: [6, 7, 16, 17, 18, 19, 20, 21, 22, 23] },
      clipboard: {}, knownRoutines: {}, kills: [], pending: [], suspicion: 0,
      hasShinigamiEyes: false,
      immuneTargets: [],
      spellingErrors: 0,
      intelProgress: {
        'c1': { hasSurname: true, hasFace: true, hasFirstName: true },
        'c2': { hasSurname: true, hasFace: true },
        'c3': { hasSurname: true },
      },
    },
    targets: BASE_TARGETS.map((t) => ({ ...t })),
    news: buildBaseFeed(), records: [], deduction: emptyDeduction(), status: 'PLAYING', report: null,
    surveillanceRegions: [],
    mediaBlackoutRegions: [],
    climax: null,
  };
}

/** Validates a ledger entry; returns a command or an error message key. */
export function buildCommand(s: GameState, input: LedgerInput): ExecutionCommand | Text {
  const p = s.player;
  if (!input.name.trim()) return { k: 'err.empty' };
  const target = s.targets.find((t) => matchesName(t, input.name));
  if (target && p.immuneTargets?.includes(target.id)) {
    return { ar: '⚠️ هذا الشخص أصبح محصناً ضد الدفتر نهائياً بسبب خطأ كتابة اسمه 4 مرات!', en: '⚠️ This person has become permanently immune due to 4 spelling errors!' };
  }
  if (!target) return { k: 'err.nomatch' };
  if (!input.faceTargetId) return { k: 'err.noface' };
  if (input.faceTargetId !== target.id) return { k: 'err.mismatch' };
  if (!target.alive || p.pending.some((c) => c.targetId === target.id)) return { k: 'err.written' };

  const base = { id: `cmd-${p.day}-${p.pending.length}-${target.id}`, targetId: target.id, method: input.method, issuedDay: p.day };
  if (input.method === 'CARDIAC') return { ...base, scheduledDay: p.day, scheduledHour: p.hour };
  if (input.method === 'FALSE_LEAD') {
    if (!input.faction) return { k: 'err.faction' };
    return { ...base, scheduledDay: p.day, scheduledHour: p.hour, faction: input.faction };
  }
  const routine = p.knownRoutines[target.id];
  if (!routine) return { k: 'err.routine' };
  if (input.hour === undefined || input.hour < routine.window.from || input.hour >= routine.window.to)
    return { k: 'err.hour' };
  return { ...base, scheduledDay: p.day + 1, scheduledHour: input.hour };
}

export const isCommand = (x: ExecutionCommand | Text): x is ExecutionCommand => 'targetId' in x;

const clampSusp = (n: number) => Math.max(0, Math.min(100, n));

function endDay(s: GameState): GameState {
  const p = s.player;
  const due = p.pending.filter((c) => c.scheduledDay <= p.day);
  const remaining = p.pending.filter((c) => c.scheduledDay > p.day);

  const res = evaluateTurn(due, {
    day: p.day, suspicion: p.suspicion, records: s.records, deduction: s.deduction,
    targets: s.targets, schedule: p.schedule,
  });

  const deadIds = new Set(res.outcomes.filter((o) => o.success).map((o) => due.find((c) => c.id === o.commandId)!.targetId));
  const targets = [...s.targets.map((t) => (deadIds.has(t.id) ? { ...t, alive: false } : t)), ...res.newTargets];
  const kills = [...p.kills, ...deadIds];

  const lines: ReportLine[] = res.outcomes.map((o) => {
    const c = due.find((x) => x.id === o.commandId)!;
    const t = s.targets.find((x) => x.id === c.targetId)!;
    return { ok: o.success, name: t.name, reason: o.reason };
  });

  const allCorruptDead = targets.filter((t) => t.priority === 'CORRUPT').every((t) => !t.alive);
  const majorCriminalsPurged = targets.filter((t) => t.priority === 'CRIMINAL' && !t.alive).length >= 5;
  const detectiveDead = !targets.find((t) => t.priority === 'DETECTIVE')?.alive;
  let status: GameStatus = 'PLAYING';
  if (res.verdict === 'TRAPPED') status = 'TRAPPED';
  else if (res.verdict === 'ARRESTED') status = 'ARRESTED';
  else if (allCorruptDead && majorCriminalsPurged && detectiveDead) status = 'WON';
  else if (p.day >= MAX_DAYS) status = 'TIMEOUT';

  return {
    ...s, targets, status,
    news: [...res.news, ...s.news],
    records: [...s.records, ...res.newRecords],
    deduction: res.deduction,
    player: { ...p, day: p.day + 1, hour: 7, kills, pending: remaining, suspicion: clampSusp(res.newSuspicion) },
    report: { day: p.day, delta: res.suspicionDelta, breakdown: res.breakdown, lines, notes: res.deduction.notes.slice(0, 2) },
  };
}

export function reducer(s: GameState, a: Action): GameState {
  if (s.status !== 'PLAYING' && a.type !== 'RESET') return s;
  const p = s.player;
  switch (a.type) {
    case 'CAPTURE_NAME': {
      const prevIntel = p.intelProgress?.[a.targetId] || {};
      const newIntel = {
        ...p.intelProgress,
        [a.targetId]: { ...prevIntel, hasSurname: true, hasFirstName: true },
      };
      return {
        ...s,
        player: {
          ...p,
          clipboard: { ...p.clipboard, name: { targetId: a.targetId } },
          intelProgress: newIntel,
        },
      };
    }
    case 'CAPTURE_FACE': {
      const prevIntel = p.intelProgress?.[a.targetId] || {};
      const newIntel = {
        ...p.intelProgress,
        [a.targetId]: { ...prevIntel, hasFace: true },
      };
      return {
        ...s,
        player: {
          ...p,
          clipboard: { ...p.clipboard, face: { targetId: a.targetId } },
          intelProgress: newIntel,
        },
      };
    }
    case 'CAPTURE_ROUTINE': {
      const t = s.targets.find((x) => x.id === a.targetId);
      if (!t) return s;
      const prevIntel = p.intelProgress?.[a.targetId] || {};
      const newIntel = {
        ...p.intelProgress,
        [a.targetId]: { ...prevIntel, hasFirstName: true },
      };
      return {
        ...s,
        player: {
          ...p,
          knownRoutines: { ...p.knownRoutines, [t.id]: t.routine },
          intelProgress: newIntel,
        },
      };
    }
    case 'UNLOCK_INTEL': {
      const prevIntel = p.intelProgress?.[a.targetId] || {};
      const newIntel = {
        ...p.intelProgress,
        [a.targetId]: {
          ...prevIntel,
          ...(a.piece === 'surname' ? { hasSurname: true } : {}),
          ...(a.piece === 'face' ? { hasFace: true } : {}),
          ...(a.piece === 'firstName' ? { hasFirstName: true } : {}),
        },
      };
      return {
        ...s,
        player: {
          ...p,
          intelProgress: newIntel,
        },
      };
    }
    case 'SUBMIT': {
      // 1. Surveillance check: Caught on camera writing without camouflage!
      if ((s.surveillanceRegions || []).includes(p.homeRegion) && !p.isCamouflaged) {
        return {
          ...s,
          status: 'ARRESTED',
          report: {
            day: p.day,
            delta: 100,
            breakdown: [{ label: { ar: '📷 رصد متلبساً بالجرم المشهود عبر كاميرات المراقبة السرية لغرفة النوم!', en: '📷 Caught red-handed on hidden bedroom surveillance cameras!' }, value: 100 }],
            lines: [],
            notes: [{ ar: 'SWAT داهمت المقر وصادرت الدفتر والقلم فور كتابة أول حرف.', en: 'SWAT raided during ledger inscription and seized evidence.' }],
          },
        };
      }

      const cmd = buildCommand(s, a.input);
      if (!isCommand(cmd)) return s; // UI pre-validates via buildCommand

      // 2. Check if Detective L is the written target
      if (a.input.faceTargetId === 'target-detective-l') {
        return {
          ...s,
          player: { ...p, pending: [...p.pending, cmd] },
          climax: {
            active: true,
            secondsLeft: 40,
            initiatedBy: 'KILLER',
            targetId: 'target-detective-l',
            reason: {
              ar: '🚨 تم كتابة اسم المحقق L في الدفتر! 40 ثانية متبقية حتى النوبة القلبية الحتمية!',
              en: '🚨 Detective L written in the Ledger! 40 seconds remain until inevitable cardiac arrest!',
            },
          },
        };
      }

      return { ...s, player: { ...p, pending: [...p.pending, cmd] } };
    }
    case 'ADVANCE_HOUR': {
      const nextHour = p.hour + 1;
      const isStillCamouflaged = p.isCamouflaged && p.camouflagedUntilHour !== undefined && nextHour < p.camouflagedUntilHour;
      return p.hour >= 23
        ? s
        : {
            ...s,
            player: {
              ...p,
              hour: nextHour,
              isCamouflaged: isStillCamouflaged,
            },
          };
    }
    case 'END_DAY':
      return endDay(s);
    case 'DISMISS_REPORT':
      return { ...s, report: null };
    case 'SHINIGAMI_EYE_DEAL': {
      if (p.hasShinigamiEyes) return s;
      const newDay = p.day + 3;
      let status: GameStatus = s.status;
      if (newDay >= MAX_DAYS) status = 'TIMEOUT';
      return {
        ...s,
        status,
        player: {
          ...p,
          day: newDay,
          hasShinigamiEyes: true,
          suspicion: clampSusp(p.suspicion + 10),
        },
      };
    }
    case 'REGISTER_SPELLING_ERROR': {
      const errCount = (p.spellingErrors || 0) + 1;
      let newImmune = p.immuneTargets || [];
      let newSusp = p.suspicion + 4;
      if (errCount >= 4) {
        if (a.targetId && !newImmune.includes(a.targetId)) {
          newImmune = [...newImmune, a.targetId];
        }
        newSusp = p.suspicion + 20;
      }
      return {
        ...s,
        player: {
          ...p,
          spellingErrors: errCount >= 4 ? 0 : errCount,
          immuneTargets: newImmune,
          suspicion: clampSusp(newSusp),
        },
      };
    }
    case 'DETECTIVE_ADVANCE_DAY': {
      const due = a.kiraCommands.filter((c) => c.scheduledDay <= p.day);
      const remaining = a.kiraCommands.filter((c) => c.scheduledDay > p.day);

      const res = evaluateTurn(due, {
        day: p.day, suspicion: p.suspicion, records: s.records, deduction: s.deduction,
        targets: s.targets, schedule: p.schedule,
      });

      const deadIds = new Set(res.outcomes.filter((o) => o.success).map((o) => due.find((c) => c.id === o.commandId)!.targetId));
      const targets = [...s.targets.map((t) => (deadIds.has(t.id) ? { ...t, alive: false } : t)), ...res.newTargets];
      const kills = [...p.kills, ...deadIds];

      const lines: ReportLine[] = res.outcomes.map((o) => {
        const c = due.find((x) => x.id === o.commandId)!;
        const t = s.targets.find((x) => x.id === c.targetId)!;
        return { ok: o.success, name: t.name, reason: o.reason };
      });

      const allCorruptDead = targets.filter((t) => t.priority === 'CORRUPT').every((t) => !t.alive);
      const majorCriminalsPurged = targets.filter((t) => t.priority === 'CRIMINAL' && !t.alive).length >= 5;
      const detectiveDead = !targets.find((t) => t.priority === 'DETECTIVE')?.alive;
      let status: GameStatus = s.status;
      if (res.verdict === 'TRAPPED') status = 'TRAPPED';
      else if (res.verdict === 'ARRESTED') status = 'ARRESTED';
      else if (allCorruptDead && majorCriminalsPurged && detectiveDead) status = 'WON';
      else if (p.day >= MAX_DAYS) status = 'TIMEOUT';

      return {
        ...s, targets, status,
        news: [...res.news, ...s.news],
        records: [...s.records, ...res.newRecords],
        deduction: res.deduction,
        player: { ...p, day: p.day + 1, hour: 7, kills, pending: remaining, suspicion: clampSusp(res.newSuspicion) },
        report: { day: p.day, delta: res.suspicionDelta, breakdown: res.breakdown, lines, notes: res.deduction.notes.slice(0, 2) },
      };
    }
    case 'SET_GAME_STATUS':
      return { ...s, status: a.status };
    case 'PLANT_DECOY_TARGET': {
      const day = p.day;
      const targetId = `decoy-det-${day}-${Date.now()}`;
      const newDecoyTarget: TargetProfile = {
        id: targetId,
        name: a.fakeName,
        faceId: `f-decoy-${day}`,
        title: { ar: 'مشتبه به مطلوب للعدالة', en: 'Wanted Suspect' },
        region: a.region,
        precinct: { ar: `قسم ${a.region}`, en: `${a.region} Precinct` },
        priority: 'DECOY',
        alive: true,
        decoyScope: 'REGIONAL',
        routine: { place: { ar: 'غير معروف', en: 'Unknown' }, window: { from: 18, to: 22 } },
      };
      const newDecoyNews: NewsItem = {
        id: `news-decoy-${Date.now()}`,
        day: p.day,
        channel: 'NEWS',
        scope: 'REGIONAL',
        region: a.region,
        source: { k: 'src.tv' },
        headline: { ar: `إعلان عاجل: رصد المشتبه به ${a.fakeName.ar} في قطاع ${a.region}`, en: `Urgent: Suspect ${a.fakeName.en} spotted in ${a.region}` },
        verified: false,
        isDecoy: true,
        segments: [
          { kind: 'text', text: { ar: 'بث محلي استثنائي لتعقب المشتبه به.', en: 'Local broadcast tracking wanted suspect.' } },
          { kind: 'name', targetId },
          { kind: 'face', targetId },
        ],
      };
      return {
        ...s,
        targets: [newDecoyTarget, ...s.targets],
        news: [newDecoyNews, ...s.news],
      };
    }
    case 'DEPLOY_CAMERAS': {
      const survList = s.surveillanceRegions || [];
      const nextSurv = survList.includes(a.region)
        ? survList
        : [...survList, a.region];
      return { ...s, surveillanceRegions: nextSurv };
    }
    case 'MEDIA_BLACKOUT': {
      const blackoutList = s.mediaBlackoutRegions || [];
      const nextBlackout = blackoutList.includes(a.region)
        ? blackoutList.filter((r) => r !== a.region)
        : [...blackoutList, a.region];
      return { ...s, mediaBlackoutRegions: nextBlackout };
    }
    case 'ACTIVATE_CAMOUFLAGE': {
      return {
        ...s,
        player: {
          ...p,
          isCamouflaged: true,
          camouflagedUntilHour: (p.hour + 4) % 24,
        },
      };
    }
    case 'HACK_POLICE_DATABASE': {
      const prevIntel = p.intelProgress?.['target-detective-l'] || {};
      return {
        ...s,
        player: {
          ...p,
          suspicion: clampSusp(p.suspicion + 15),
          intelProgress: {
            ...p.intelProgress,
            'target-detective-l': { ...prevIntel, hasSurname: true },
          },
        },
      };
    }
    case 'AMBUSH_FBI_TAIL': {
      const prevIntel = p.intelProgress?.['target-detective-l'] || {};
      return {
        ...s,
        player: {
          ...p,
          suspicion: clampSusp(p.suspicion + 10),
          intelProgress: {
            ...p.intelProgress,
            'target-detective-l': { ...prevIntel, hasFace: true, hasFirstName: true },
          },
        },
      };
    }
    case 'START_CLIMAX': {
      return {
        ...s,
        climax: {
          active: true,
          secondsLeft: 40,
          initiatedBy: a.initiatedBy,
          targetId: a.targetId,
          reason: a.reason,
        },
      };
    }
    case 'TICK_CLIMAX': {
      if (!s.climax || !s.climax.active) return s;
      const nextSec = s.climax.secondsLeft - 1;
      if (nextSec <= 0) {
        if (s.climax.initiatedBy === 'KILLER') {
          const targets = s.targets.map((t) =>
            t.id === 'target-detective-l' ? { ...t, alive: false } : t
          );
          return { ...s, targets, status: 'WON', climax: null };
        } else {
          return { ...s, status: 'ARRESTED', climax: null };
        }
      }
      return { ...s, climax: { ...s.climax, secondsLeft: nextSec } };
    }
    case 'CANCEL_CLIMAX': {
      return { ...s, climax: null };
    }
    case 'RESET':
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      return initialState();
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  return [state, dispatch] as const;
}
