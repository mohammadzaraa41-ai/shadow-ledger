import type { GameState } from './store';
import type { DeathMethod, ExecutionCommand, Region, TargetProfile } from './types';

export interface KiraMastermindState {
  homeRegion: Region;
  freeHours: number[];
  caution: number;
  killsCount: number;
  personality: 'ARROGANT' | 'CALCULATING' | 'RECKLESS';
}

const REGIONS: Region[] = ['NORTH', 'WEST', 'EAST', 'SOUTH', 'CENTRAL'];

export const KIRA_SOLO_TAUNTS = {
  ar: [
    'هل تسمع أصوات السقوط أيها المحقق؟ المدينة تتطهر من دنس الفاسدين.',
    'تبحث عني في الظلام بينما العدالة أكتبها أنا في وضح النهار.',
    'بثوثك التلفزيونية وألاعيبك التكتيكية لن تشتت بوصلتي الحتمية.',
    'راقب السجلات اليوم.. سقط رأس كبير آخر من رؤوس الفساد.',
    'العدالة ليست كتباً وقوانين عاجزة، العدالة هي القصاص الحتمي.',
    'تقترب خطوة فأسبقك بعشر.. لن تكشف هويتي الحقيقية أبداً.',
  ],
  en: [
    'Can you hear the wicked falling, detective? The city is being cleansed.',
    'You search in shadows while I write absolute justice in plain sight.',
    'Your tactical television broadcasts will never derail my sacred judgment.',
    'Check today’s obituaries.. another corrupt titan has fallen.',
    'Justice is not stagnant bureaucracy; justice is the inevitable sentence.',
    'For every step you take, I am ten steps ahead. You will never know my name.',
  ],
};

export function createKiraAI(preferredRegion?: Region): KiraMastermindState {
  const homeRegion = preferredRegion || REGIONS[Math.floor(Math.random() * REGIONS.length)];
  const freeHours = [16, 17, 18, 19, 20, 21, 22]; // Evening student schedule
  return {
    homeRegion,
    freeHours,
    caution: 20,
    killsCount: 0,
    personality: 'ARROGANT',
  };
}

export interface KiraTurnResult {
  commands: ExecutionCommand[];
  taunt?: string;
  lindKilled: boolean;
  fellIntoDecoy: boolean;
  executedTargets: TargetProfile[];
}

/**
 * Simulates an autonomous turn by Kira against player Detective L.
 */
export function executeKiraAITurn(
  state: GameState,
  kira: KiraMastermindState,
  activeLindRegion?: Region | null,
): KiraTurnResult {
  const commands: ExecutionCommand[] = [];
  const executedTargets: TargetProfile[] = [];
  let lindKilled = false;
  let fellIntoDecoy = false;

  const currentDay = state.player.day;
  const aliveTargets = state.targets.filter((t: TargetProfile) => t.alive);

  // 1. Ego trap check: Lind L. Tailor broadcast
  // If L launched the broadcast in Kira's home region, Kira executes Lind out of pride!
  if (activeLindRegion && activeLindRegion === kira.homeRegion) {
    const lindTarget = state.targets.find((t: TargetProfile) => t.id === 'lind-l-tailor');
    if (lindTarget && lindTarget.alive) {
      lindKilled = true;
      executedTargets.push(lindTarget);
      commands.push({
        id: `cmd-kira-lind-${Date.now()}`,
        targetId: lindTarget.id,
        method: 'CARDIAC',
        issuedDay: currentDay,
        scheduledDay: currentDay,
        scheduledHour: state.player.hour,
      });
    }
  }

  // 2. Regular target selection (Prioritize CORRUPT officials, then major CRIMINALS)
  // Don't kill Detective L via cardiac (AI knows or targets regular suspects)
  const candidatePool = aliveTargets.filter(
    (t: TargetProfile) => t.priority !== 'DETECTIVE' && t.id !== 'lind-l-tailor' && !commands.some((c) => c.targetId === t.id),
  );

  // Select 1 to 2 victims this turn
  const quota = Math.min(candidatePool.length, Math.floor(Math.random() * 2) + 1);

  // Check if there is an active DECOY planted by L
  const liveDecoys = candidatePool.filter((t: TargetProfile) => t.priority === 'DECOY');
  if (liveDecoys.length > 0 && Math.random() > 0.45 && kira.caution < 70) {
    const bait = liveDecoys[0];
    // If the decoy was planted in Kira's home region or national feed
    if (bait.region === kira.homeRegion || bait.decoyScope === 'NATIONAL') {
      fellIntoDecoy = true;
      executedTargets.push(bait);
      const executionHour = kira.freeHours[Math.floor(Math.random() * kira.freeHours.length)];
      commands.push({
        id: `cmd-kira-decoy-${Date.now()}`,
        targetId: bait.id,
        method: 'CARDIAC',
        issuedDay: currentDay,
        scheduledDay: currentDay,
        scheduledHour: executionHour,
      });
    }
  }

  // Pick remaining genuine targets
  const genuineCandidates = candidatePool.filter((t: TargetProfile) => t.priority !== 'DECOY');
  // Sort by priority: CORRUPT first, then CRIMINAL
  genuineCandidates.sort((a: TargetProfile, b: TargetProfile) => {
    if (a.priority === 'CORRUPT' && b.priority !== 'CORRUPT') return -1;
    if (b.priority === 'CORRUPT' && a.priority !== 'CORRUPT') return 1;
    return 0;
  });

  for (let i = 0; i < quota && i < genuineCandidates.length; i++) {
    const target = genuineCandidates[i];
    executedTargets.push(target);

    // Kira chooses execution method:
    // Mostly CARDIAC for shock value; occasionally ACCIDENT if routine is known
    let method: DeathMethod = 'CARDIAC';
    let schedHour = kira.freeHours[Math.floor(Math.random() * kira.freeHours.length)];

    if (Math.random() < 0.25 && target.routine.window.to > target.routine.window.from) {
      method = 'ACCIDENT';
      schedHour = target.routine.window.from;
    }

    commands.push({
      id: `cmd-kira-${currentDay}-${i}-${target.id}`,
      targetId: target.id,
      method,
      issuedDay: currentDay,
      scheduledDay: method === 'ACCIDENT' ? currentDay + 1 : currentDay,
      scheduledHour: schedHour,
    });
  }

  // 3. Choose a psychological taunt
  const taunts = KIRA_SOLO_TAUNTS.ar;
  const taunt = taunts[Math.floor(Math.random() * taunts.length)];

  return {
    commands,
    taunt,
    lindKilled,
    fellIntoDecoy,
    executedTargets,
  };
}
