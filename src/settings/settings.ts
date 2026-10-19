import { Band, BANDS, Lang, LANGS, Tier, TIERS } from "../i18n/types";
import { readJson, writeJson } from "../save/storage";

/** Settings a teacher controls for everyone playing on this device or link. */
export interface ClassSettings {
  band: Band;
  tier: Tier;
  lang: Lang;
  /** Read text aloud by default. Always on for K-2. */
  audio: boolean;
  /** Students may switch between English and Spanish themselves. */
  allowLangSwitch: boolean;
  /** Story chapter numbers (0-7) that are enabled. The tutorial is always enabled. */
  chapters: number[];
}

export const ALL_CHAPTERS = [0, 1, 2, 3, 4, 5, 6, 7];

export const DEFAULT_SETTINGS: ClassSettings = {
  band: "3-5",
  tier: "T2",
  lang: "en",
  audio: true,
  allowLangSwitch: true,
  chapters: ALL_CHAPTERS,
};

const SETTINGS_KEY = "classSettings";
const PIN_KEY = "teacherPin";

function sanitize(raw: Partial<ClassSettings>): ClassSettings {
  const s = { ...DEFAULT_SETTINGS, ...raw };
  return {
    band: BANDS.includes(s.band) ? s.band : DEFAULT_SETTINGS.band,
    tier: TIERS.includes(s.tier) ? s.tier : DEFAULT_SETTINGS.tier,
    lang: LANGS.includes(s.lang) ? s.lang : DEFAULT_SETTINGS.lang,
    audio: typeof s.audio === "boolean" ? s.audio : DEFAULT_SETTINGS.audio,
    allowLangSwitch:
      typeof s.allowLangSwitch === "boolean" ? s.allowLangSwitch : DEFAULT_SETTINGS.allowLangSwitch,
    chapters: Array.isArray(s.chapters)
      ? s.chapters.filter((n) => ALL_CHAPTERS.includes(n))
      : DEFAULT_SETTINGS.chapters,
  };
}

/**
 * Parse a group link such as ?band=6-8&tier=T2&lang=es&audio=on&chapters=2,3,4
 * Only the parameters present override saved settings.
 */
export function parseSettingsFromUrl(search: string): Partial<ClassSettings> {
  const params = new URLSearchParams(search);
  const out: Partial<ClassSettings> = {};
  const band = params.get("band");
  if (band && BANDS.includes(band as Band)) out.band = band as Band;
  const tier = params.get("tier")?.toUpperCase();
  if (tier && TIERS.includes(tier as Tier)) out.tier = tier as Tier;
  const lang = params.get("lang");
  if (lang && LANGS.includes(lang as Lang)) out.lang = lang as Lang;
  const audio = params.get("audio");
  if (audio === "on" || audio === "off") out.audio = audio === "on";
  const switching = params.get("switch");
  if (switching === "on" || switching === "off") out.allowLangSwitch = switching === "on";
  const chapters = params.get("chapters");
  if (chapters !== null) {
    out.chapters = chapters
      .split(",")
      .map((c) => parseInt(c, 10))
      .filter((n) => ALL_CHAPTERS.includes(n));
  }
  return out;
}

export function loadSettings(): ClassSettings {
  const saved = readJson<Partial<ClassSettings>>(SETTINGS_KEY, {});
  const fromUrl = parseSettingsFromUrl(window.location.search);
  const merged = sanitize({ ...saved, ...fromUrl });
  // A group link is remembered so a refresh or relaunch keeps the same setup.
  if (Object.keys(fromUrl).length > 0) writeJson(SETTINGS_KEY, merged);
  return merged;
}

export function saveSettings(settings: ClassSettings): void {
  writeJson(SETTINGS_KEY, sanitize(settings));
}

export function buildGroupLink(settings: ClassSettings): string {
  const params = new URLSearchParams({
    band: settings.band,
    tier: settings.tier,
    lang: settings.lang,
    audio: settings.audio ? "on" : "off",
    switch: settings.allowLangSwitch ? "on" : "off",
    chapters: settings.chapters.join(","),
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

// The PIN only keeps students out of the teacher panel on a shared device.
// It is stored on the device and is not a security boundary.
export function getTeacherPin(): string | null {
  return readJson<string | null>(PIN_KEY, null);
}

export function setTeacherPin(pin: string): void {
  writeJson(PIN_KEY, pin);
}
