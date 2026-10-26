/**
 * Domain model for "Shadow Ledger".
 * Pure data types only – no UI or side effects – so the same model can be
 * reused in React Native, web, or a headless simulation/test harness.
 */

export type Region = 'NORTH' | 'WEST' | 'EAST' | 'SOUTH' | 'CENTRAL';
export type DeathMethod = 'CARDIAC' | 'ACCIDENT' | 'COERCED_LEAK' | 'CRYPTIC_MSG' | 'GANG_WAR' | 'FALSE_LEAD';
export type TargetPriority = 'CORRUPT' | 'CRIMINAL' | 'DETECTIVE' | 'DECOY';
export type Channel = 'NEWS' | 'POLICE' | 'CAMERA' | 'WIRETAP';
export type Scope = 'NATIONAL' | 'REGIONAL';
export type Faction = 'SYNDICATE' | 'RADICALS' | 'CORPORATE';
export type GameStatus = 'PLAYING' | 'WON' | 'ARRESTED' | 'TRAPPED' | 'TIMEOUT';

/** Bilingual literal. */
export interface L10n {
  ar: string;
  en: string;
}
/** Dictionary message with params; resolved at render time so language can switch mid-game. */
export interface Msg {
  k: string;
  p?: Record<string, string | number | L10n>;
}
export type Text = L10n | Msg;

/** Half-open hour range [from, to) on a 0-24 clock. */
export interface TimeWindow {
  from: number;
  to: number;
}

export interface TargetProfile {
  id: string;
  /** The "Full Legal Name" validation component (Arabic + romanized forms both accepted). */
  name: L10n;
  /** The "Face Photo ID" validation component. */
  faceId: string;
  title: L10n;
  region: Region;
  precinct: L10n;
  priority: TargetPriority;
  routine: { place: L10n; window: TimeWindow };
  alive: boolean;
  /** Only for DECOY targets planted by the detective. */
  decoyScope?: Scope;
}

/** A piece of feed content; some pieces are "copyable" tokens. */
export type FeedSegment =
  | { kind: 'text'; text: Text }
  | { kind: 'name'; targetId: string }
  | { kind: 'face'; targetId: string; caption?: Text }
  | { kind: 'routine'; targetId: string };

export interface NewsItem {
  id: string;
  day: number;
  channel: Channel;
  scope: Scope;
  region?: Region;
  source: Text;
  headline: Text;
  segments: FeedSegment[];
  /** Cross-confirmed by a police record. Decoys are never verified. */
  verified: boolean;
  /** Internal flag – never rendered, used only by the engine. */
  isDecoy: boolean;
  /** Item only appears once the player has this many kills. */
  unlockKills?: number;
}

export interface ExecutionCommand {
  id: string;
  targetId: string;
  method: DeathMethod;
  issuedDay: number;
  scheduledDay: number;
  scheduledHour: number;
  faction?: Faction;
  targetRegion?: Region;
  crypticNote?: string;
  coercedAction?: 'LEAK_CIPHER_INTEL';
  alibiCreated?: boolean;
}

export interface PlayerState {
  day: number;
  hour: number;
  /** Secret – the detective must infer it. */
  homeRegion: Region;
  /** Secret simulated real-life schedule (hours the player is free). */
  schedule: { freeHours: number[] };
  clipboard: { name?: { targetId: string }; face?: { targetId: string } };
  knownRoutines: Record<string, { place: L10n; window: TimeWindow }>;
  kills: string[];
  pending: ExecutionCommand[];
  suspicion: number;
  hasShinigamiEyes?: boolean;
  immuneTargets?: string[];
  spellingErrors?: number;
  intelProgress?: Record<string, { hasSurname?: boolean; hasFace?: boolean; hasFirstName?: boolean }>;
  isCamouflaged?: boolean;
  camouflagedUntilHour?: number;
}

export interface ClimaxState {
  active: boolean;
  secondsLeft: number;
  initiatedBy: 'KILLER' | 'DETECTIVE';
  targetId?: string;
  reason: L10n;
}

export interface DeathRecord {
  day: number;
  hour: number;
  targetId: string;
  region: Region;
  precinct: L10n;
  method: DeathMethod;
  decoy: boolean;
  targetRegion?: Region;
  crypticNote?: string;
  coercedAction?: 'LEAK_CIPHER_INTEL';
  alibiCreated?: boolean;
}

export interface DetectiveDeductionState {
  /** Probability distribution over where the killer lives. */
  geoBelief: Record<Region, number>;
  geoSharpness: number;
  narrowedRegion: Region | null;
  hourHistogram: number[]; // 24 buckets
  profile: { label: L10n; window: TimeWindow | null; confidence: number };
  timeScore: number;
  decoyHits: number;
  notes: Text[];
}

export interface TurnHistory {
  day: number;
  suspicion: number;
  records: DeathRecord[];
  deduction: DetectiveDeductionState;
  targets: TargetProfile[];
  /** Used only to score habit correlation (simulated "real" schedule). */
  schedule: { freeHours: number[] };
}

export interface SuspicionFactor {
  label: Text;
  value: number;
}

export interface CommandOutcome {
  commandId: string;
  success: boolean;
  reason?: Text;
}

export type Verdict = 'CONTINUE' | 'ARRESTED' | 'TRAPPED';

export interface DeductionResult {
  outcomes: CommandOutcome[];
  newRecords: DeathRecord[];
  suspicionDelta: number;
  newSuspicion: number;
  breakdown: SuspicionFactor[];
  deduction: DetectiveDeductionState;
  news: NewsItem[];
  newTargets: TargetProfile[];
  verdict: Verdict;
}
