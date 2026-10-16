import { UiText } from "../i18n/types";

export interface GlossaryEntry {
  /** Stable id, e.g. "movable-type". */
  id: string;
  emoji: string;
  /** The term as students will see it (lowercase unless a proper noun). */
  term: UiText;
  /** Other forms that should link here when bolded in dialogue (plurals, verb forms). */
  aliases?: { en?: string[]; es?: string[] };
  /** One short sentence for T1-T2 readers. */
  simple: UiText;
  /** One or two sentences for T3-T4 readers. */
  full: UiText;
}
