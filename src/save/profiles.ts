import { Lang } from "../i18n/types";
import { readJson, removeKey, writeJson } from "./storage";
import { QuestState } from "../game/quest";
import type { QuizResult } from "../game/activities";

export interface ChapterProgress {
  quest: QuestState;
  completed: boolean;
}

/** A finished end-of-chapter check, kept in the student's Printer's Journal. */
export interface JournalEntry extends QuizResult {
  date: number;
}

export interface Profile {
  id: string;
  name: string;
  createdAt: number;
  /** Student's own language choice, used only when the teacher allows switching. */
  lang?: Lang;
  /** Student's own read-aloud choice. Ignored for K-2, where audio is always on. */
  audio?: boolean;
  progress: Record<string, ChapterProgress>;
  /** Latest journal check per chapter id. */
  journal?: Record<string, JournalEntry>;
}

const PROFILES_KEY = "profiles";
const ACTIVE_KEY = "activeProfile";

export function loadProfiles(): Profile[] {
  const list = readJson<Profile[]>(PROFILES_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function saveProfiles(profiles: Profile[]): void {
  writeJson(PROFILES_KEY, profiles);
}

export function createProfile(name: string, lang?: Lang): Profile {
  return {
    id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim().slice(0, 30),
    createdAt: Date.now(),
    lang,
    progress: {},
  };
}

export function loadActiveProfileId(): string | null {
  return readJson<string | null>(ACTIVE_KEY, null);
}

export function saveActiveProfileId(id: string | null): void {
  if (id) writeJson(ACTIVE_KEY, id);
  else removeKey(ACTIVE_KEY);
}

export function clearAllProfiles(): void {
  removeKey(PROFILES_KEY);
  removeKey(ACTIVE_KEY);
}
