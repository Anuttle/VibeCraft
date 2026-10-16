import { Band, Lang, UiText } from "../i18n/types";
import type { PressConfig, TypesetConfig } from "../content/press";

// Activities are the minigames opened at stations. Each is defined once and
// configured per grade band (and per language when it contains text), so a
// chapter is mostly data. Strings inside configs are already in the target
// language, written for that band; they are not reading-tiered because the
// band already sets the reader's age.

export type PerBand<T> = Record<Band, T>;
export type PerBandLang<T> = Record<Band, Record<Lang, T>>;

// ---- Mix: choose ingredients, or set their proportions -----------------------

export interface Ingredient {
  id: string;
  label: string;
  emoji: string;
}

export interface MixConfig {
  instruction: string;
  ingredients: Ingredient[];
  /** Pick mode: the ids that belong in the mix (others are distractors). */
  correct?: string[];
  /** Ratio mode: acceptable percentage range for each ingredient id (sliders move in steps of 5 and must total 100). */
  targets?: Record<string, [number, number]>;
  /** Feedback when an ingredient is outside its range (ratio mode), or chosen wrongly (pick mode uses `low` for missing, `high` for extra). */
  hints: Record<string, { low: string; high: string }>;
  success: string;
}

// ---- Sequence: put steps or events in order ----------------------------------

export interface SequenceConfig {
  instruction: string;
  /** In the correct order. Shown shuffled. */
  items: Array<{ text: string; emoji: string }>;
  success: string;
}

// ---- Hold: hold a button and let go in the target zone ------------------------

export interface HoldConfig {
  instruction: string;
  meterLabel: string;
  buttonLabel: string;
  emoji: string;
  /** Target range on a 0-100 meter; null means any full hold succeeds (no failure). */
  zone: [number, number] | null;
  /** Meter units per second while held. */
  rate: number;
  /** Successful rounds needed. */
  rounds: number;
  good: string;
  low: string;
  high: string;
}

// ---- Carve: choose the block carved as a mirror image -------------------------

export interface CarveConfig {
  instruction: string;
  /** Characters or letters to carve, one per round. */
  glyphs: string[];
  /** Number of carved blocks to choose from (2-4): the mirror image plus look-alikes. */
  options: 2 | 3 | 4;
  success: string;
}

// ---- Copy: copy text by hand, against the clock --------------------------------

export interface CopyConfig {
  instruction: string;
  lines: string[];
  /** Extra letters on the keyboard. */
  distractors: string;
  /** Shown at the end; may use {letters} and {seconds}. */
  report: string;
}

// ---- Map: cities that printing reached -----------------------------------------

export interface MapCity {
  id: string;
  name: string;
  /** Year printing is usually dated there (approximate; shown with "c."). */
  year: number;
  lat: number;
  lon: number;
  /** Shown when the city is reached. */
  note?: string;
}

export interface MapConfig {
  instruction: string;
  cities: MapCity[];
  /** "tap": tap every city (any order). "order": tap cities in the order printing arrived. */
  mode: "tap" | "order";
  success: string;
}

// ---- Quiz: journal checks, ledgers, arguments ----------------------------------

export type QuizItem =
  | {
      kind: "choice";
      prompt: string;
      options: Array<{ text: string; emoji?: string }>;
      answer: number;
      /** Shown after answering (right or wrong). */
      explain: string;
    }
  | { kind: "number"; prompt: string; answer: number; explain: string }
  | { kind: "order"; prompt: string; items: string[]; explain: string }
  | { kind: "write"; prompt: string; /** Sentence starters offered to help. */ starters?: string[] }
  | {
      kind: "evidence";
      prompt: string;
      claims: string[];
      /** Each piece of evidence lists the claim indexes it supports. */
      evidence: Array<{ text: string; supports: number[] }>;
      /** How many pieces of evidence to choose. */
      pick: number;
      /** Ask for written reasoning after choosing. */
      reasoning: boolean;
    };

export interface QuizConfig {
  intro: string;
  items: QuizItem[];
}

// ---- Activity definitions --------------------------------------------------------

interface ActivityBase {
  title: UiText;
  icon: string;
}

export type ActivityDef = ActivityBase &
  (
    | { kind: "typeset"; config: PerBandLang<TypesetConfig> }
    | { kind: "press"; config: PerBand<PressConfig>; lines?: PerBandLang<string[]> }
    | { kind: "mix"; config: PerBandLang<MixConfig> }
    | { kind: "sequence"; config: PerBandLang<SequenceConfig> }
    | { kind: "hold"; config: PerBandLang<HoldConfig> }
    | { kind: "carve"; config: PerBandLang<CarveConfig> }
    | { kind: "copy"; config: PerBandLang<CopyConfig> }
    | { kind: "map"; config: PerBandLang<MapConfig> }
    | { kind: "quiz"; config: PerBandLang<QuizConfig> }
  );

/** What an activity reports when finished. */
export interface ActivityResult {
  /** Typesetting output, passed on to a later press activity. */
  lines?: string[];
  /** Quiz results, saved to the journal. */
  quiz?: QuizResult;
}

export interface QuizResult {
  correct: number;
  /** Questions that have a right answer. */
  scored: number;
  /** One entry per item: what the student answered, in words. */
  responses: Array<{ prompt: string; answer: string; correct: boolean | null }>;
}
