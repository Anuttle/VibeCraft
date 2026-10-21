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
  /**
   * Free build: "earned" unlocks it once a student finishes every enabled
   * chapter, "open" makes it available to everyone, "off" hides it.
   */
  freeMode: FreeMode;
}

export type FreeMode = "earned" | "open" | "off";
export const FREE_MODES: FreeMode[] = ["earned", "open", "off"];

export const ALL_CHAPTERS = [0, 1, 2, 3, 4, 5, 6, 7];

export const DEFAULT_SETTINGS: ClassSettings = {
  band: "3-5",
  tier: "T2",
  lang: "en",
  audio: true,
  allowLangSwitch: true,
  chapters: ALL_CHAPTERS,
  freeMode: "earned",
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
    freeMode: FREE_MODES.includes(s.freeMode) ? s.freeMode : DEFAULT_SETTINGS.freeMode,
  };
}

/**
 * Parse a group link such as ?band=6-8&tier=T2&lang=es&audio=on&chapters=2,3,4&free=earned
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
  const free = params.get("free");
  if (free && FREE_MODES.includes(free as FreeMode)) out.freeMode = free as FreeMode;
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
    free: settings.freeMode,
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

/**
 * PINs students would guess first: one digit repeated (1111), a run up or down
 * (1234, 9876) or a repeated pair (1212).
 */
export function isEasyPin(pin: string): boolean {
  if (!/^\d{4}$/.test(pin)) return false;
  const d = [...pin].map(Number);
  const steps = d.slice(1).map((x, i) => x - d[i]);
  if (steps.every((s) => s === steps[0]) && Math.abs(steps[0]) <= 1) return true;
  return pin.slice(0, 2) === pin.slice(2);
}

// After too many wrong tries the PIN box pauses, so it can't be guessed by
// trying every number. Saved, so reloading the page doesn't reset it.
const PIN_LOCK_KEY = "teacherPinLock";
const MAX_PIN_TRIES = 5;
const PIN_LOCK_MS = 60_000;

/** Milliseconds until the PIN can be tried again; 0 when it can be tried now. */
export function pinLockRemaining(now = Date.now()): number {
  const lock = readJson<{ fails: number; until: number }>(PIN_LOCK_KEY, { fails: 0, until: 0 });
  return Math.max(0, lock.until - now);
}

/** Record a PIN attempt; a right one clears the count. */
export function recordPinAttempt(ok: boolean, now = Date.now()): void {
  if (ok) return writeJson(PIN_LOCK_KEY, { fails: 0, until: 0 });
  const lock = readJson<{ fails: number; until: number }>(PIN_LOCK_KEY, { fails: 0, until: 0 });
  const fails = lock.fails + 1;
  writeJson(PIN_LOCK_KEY, fails >= MAX_PIN_TRIES ? { fails: 0, until: now + PIN_LOCK_MS } : { fails, until: lock.until });
}
