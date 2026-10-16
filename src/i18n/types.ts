export type Lang = "en" | "es";
export type Tier = "T1" | "T2" | "T3" | "T4";
export type Band = "K-2" | "3-5" | "6-8" | "9-12";

export const LANGS: Lang[] = ["en", "es"];
export const TIERS: Tier[] = ["T1", "T2", "T3", "T4"];
export const BANDS: Band[] = ["K-2", "3-5", "6-8", "9-12"];

/** Target Lexile range each tier is written toward. */
export const TIER_LEXILE: Record<Tier, string> = {
  T1: "BR–400L",
  T2: "400L–700L",
  T3: "700L–1000L",
  T4: "1000L–1300L+",
};

/** Default reading tier suggested for a grade band (teachers can override). */
export const BAND_DEFAULT_TIER: Record<Band, Tier> = {
  "K-2": "T1",
  "3-5": "T2",
  "6-8": "T3",
  "9-12": "T4",
};

/**
 * Text that can vary by reading tier. A plain string is used for every tier;
 * an object may leave tiers out, and the nearest written tier is used instead.
 */
export type Tiered = string | Partial<Record<Tier, string>>;

/** A piece of student-facing text written in both languages. */
export interface Line {
  en: Tiered;
  es: Tiered;
}

/** Non-tiered UI text. */
export interface UiText {
  en: string;
  es: string;
}

/**
 * Pick the text for a tier. Missing tiers fall back to the nearest lower tier,
 * then the nearest higher one, so authors can write T1 and T3 and have T2/T4 filled.
 * Returns the tier actually used so audio files can be shared between tiers.
 */
export function resolveTiered(value: Tiered, tier: Tier): { text: string; tier: Tier } {
  if (typeof value === "string") return { text: value, tier: "T1" };
  const idx = TIERS.indexOf(tier);
  for (let i = idx; i >= 0; i--) {
    const t = TIERS[i];
    if (value[t]) return { text: value[t]!, tier: t };
  }
  for (let i = idx + 1; i < TIERS.length; i++) {
    const t = TIERS[i];
    if (value[t]) return { text: value[t]!, tier: t };
  }
  return { text: "", tier };
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "es" : "en";
}

/** Replace {name} placeholders. */
export function format(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, key) => (key in vars ? String(vars[key]) : m));
}

/** Remove emphasis markers (*word*) so text can be spoken or measured. */
export function stripMarkup(text: string): string {
  return text.replace(/\*/g, "");
}
