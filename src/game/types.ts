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
}

export interface Settings {
  cats: string[];
  rounds: number;
  chaos: boolean;
  voice: boolean;
  discussSec: number;
}

export interface Round {
  category: Category;
  word: Word;
  /** Similar word shown to the liar when the DECOY twist is active. */
  decoyWord?: Word;
  liars: number[];
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
  | 'NO_LIAR_WRONG';

