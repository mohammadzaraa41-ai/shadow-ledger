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
}

/** Round twists. `public` ones are announced to everybody; secret ones are not. */
export type ChaosId = 'DOUBLE' | 'DECOY' | 'SPEED' | 'WHISPER' | 'NO_LIAR';

export interface Player {
  id: number;
  name: string;
  score: number;
  avatar?: string;
}

export interface Settings {
  cats: string[];
  rounds: number;
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
  liars: number[];
  /** Jester (🤡): Knows the word, wins +3 if the group votes them out! */
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
  | 'CAUGHT_GUESS_WRONG'
  | 'CAUGHT_GUESS_RIGHT'
  | 'ESCAPED'
  | 'NO_LIAR_OK'
  | 'NO_LIAR_WRONG'
  | 'JESTER_WIN';
