export type Lang = 'ar' | 'en';

export interface L10n {
  ar: string;
  en: string;
}

export interface Word {
  ar: string;
  en: string;
}

export interface Category {
  id: string;
  emoji: string;
  name: L10n;
  words: Word[];
  /** Whether this category starts locked until the player unlocks it. */
  lockedByDefault?: boolean;
}

/** Round twists. Every round is guaranteed to have at least one liar. */
export type ChaosId = 'DOUBLE' | 'DECOY' | 'SPEED' | 'WHISPER';

export type DareKind = 'funny' | 'acting' | 'spicy';

export interface Dare {
  kind: DareKind;
  ar: string;
  en: string;
}

export interface Player {
  id: number;
  name: string;
  avatar?: string;
}

export interface Settings {
  /** Single selected category ID (only one category active per round). */
  cat: string;
  /** IDs of categories unlocked by the user. */
  unlockedCats: string[];
  chaos: boolean;
  voice: boolean;
  discussSec: number;
  /** Enables Jester (🤡) and Witness (🔮) roles when 4+ players play. */
  roles?: boolean;
  /** User-created custom words for the 'custom' category. */
  customWords?: string[];
  /** Optional 4-char shared room code for multi-phone synced play. */
  roomCode?: string;
}

export interface Round {
  category: Category;
  word: Word;
  /** Similar word shown to the liar when the DECOY twist is active. */
  decoyWord?: Word;
  /** Always contains at least 1 liar ID (or 2 when DOUBLE chaos is active). */
  liars: number[];
  /** Jester (🤡): Knows the word; if voted out, everyone else gets punished! */
  jesterId?: number | null;
  /** Witness (🔮): Knows the word + sees 2 suspects (one is a real liar, one is innocent). */
  witnessId?: number | null;
  witnessPair?: number[];
  chaos: ChaosId | null;
  starter: number;
  /** Options shown to a caught liar when guessing the real word. */
  options: Word[];
}

export type Outcome =
  | 'LIAR_LOST'
  | 'GROUP_LOST_ESCAPED'
  | 'GROUP_LOST_GUESSED'
  | 'GROUP_LOST_JESTER';
