import { Lang, Tier, speakable } from "../i18n/types";

/**
 * Reads game text aloud.
 *
 * 1. If a recorded or pre-generated file is listed in /audio/manifest.json
 *    (path: audio/<lang>/<tier>/<contentId>.<mp3|m4a|wav|ogg>), it is played.
 *    `npm run audio:manifest` rebuilds the list from the files present.
 * 2. Otherwise the browser's speech synthesis is used, preferring
 *    Latin American Spanish voices for Spanish.
 *
 * iOS only allows audio after a user gesture, so unlock() must be called from
 * a tap or click before the first line is spoken.
 */

export interface SpeakRequest {
  /** Content id; used to look up a recorded file. */
  id?: string;
  text: string;
  lang: Lang;
  tier: Tier;
  /** 1 is normal speed. */
  rate?: number;
}

export interface SpeakCallbacks {
  /** Called with the character offset of the word being spoken (speech synthesis only). */
  onWord?: (charIndex: number) => void;
  onEnd?: () => void;
}

const VOICE_PREFERENCES: Record<Lang, string[]> = {
  // Latin American first; Castilian only as a last resort.
  es: ["es-MX", "es-US", "es-419", "es-CO", "es-AR", "es-CL", "es-PE", "es-VE", "es-ES"],
  en: ["en-US", "en-CA", "en-GB", "en-AU"],
};

const SPEECH_LANG: Record<Lang, string> = { es: "es-MX", en: "en-US" };

function normalizeTag(tag: string): string {
  return tag.replace("_", "-").toLowerCase();
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: Lang): SpeechSynthesisVoice | null {
  const forLang = voices.filter((v) => normalizeTag(v.lang).startsWith(lang));
  if (forLang.length === 0) return null;
  for (const pref of VOICE_PREFERENCES[lang]) {
    const matches = forLang.filter((v) => normalizeTag(v.lang) === pref.toLowerCase());
    if (matches.length > 0) {
      // Prefer on-device voices: they fire word-boundary events and work offline.
      return matches.find((v) => v.localService) ?? matches[0];
    }
  }
  return forLang[0];
}

// A very short silent WAV, played once on the unlock gesture so later
// HTMLAudioElement playback is allowed on iOS.
function silentWavDataUri(): string {
  const sampleRate = 8000;
  const samples = 80;
  const buffer = new ArrayBuffer(44 + samples);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeStr(36, "data");
  view.setUint32(40, samples, true);
  for (let i = 0; i < samples; i++) view.setUint8(44 + i, 128);
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

class Narrator {
  private voices: SpeechSynthesisVoice[] = [];
  /** "lang/tier/id" → file path under audio/, e.g. "es/T2/press.intro.mp3". */
  private manifest: Map<string, string> | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private unlocked = false;
  private token = 0;

  constructor() {
    if (typeof window === "undefined") return;
    if ("speechSynthesis" in window) {
      const load = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      load();
      window.speechSynthesis.addEventListener?.("voiceschanged", load);
    }
    this.loadManifest();
  }

  get speechSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  /** True when a voice exists for the language (voices can load late, so check at use time). */
  hasVoice(lang: Lang): boolean {
    if (!this.speechSupported) return false;
    if (this.voices.length === 0) this.voices = window.speechSynthesis.getVoices();
    return pickVoice(this.voices, lang) !== null;
  }

  private async loadManifest() {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}audio/manifest.json`, { cache: "no-cache" });
      if (!res.ok) return;
      const data = (await res.json()) as { files?: string[] };
      this.manifest = new Map(
        (data.files ?? []).map((f) => {
          const withExt = /\.(mp3|m4a|wav|ogg)$/i.test(f) ? f : `${f}.mp3`;
          return [withExt.replace(/\.(mp3|m4a|wav|ogg)$/i, ""), withExt] as const;
        })
      );
    } catch {
      this.manifest = null;
    }
  }

  /** Call from a tap/click handler before the first spoken line. */
  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    try {
      if (this.speechSupported) {
        const u = new SpeechSynthesisUtterance(" ");
        u.volume = 0;
        window.speechSynthesis.speak(u);
      }
    } catch {
      // ignore
    }
    try {
      this.audioEl = new Audio();
      this.audioEl.src = silentWavDataUri();
      this.audioEl.play().catch(() => {});
    } catch {
      this.audioEl = null;
    }
  }

  stop() {
    this.token++;
    try {
      if (this.speechSupported) window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    if (this.audioEl) {
      this.audioEl.onended = null;
      this.audioEl.pause();
    }
  }

  speak(req: SpeakRequest, cb: SpeakCallbacks = {}) {
    this.stop();
    const token = this.token;
    const done = () => {
      if (token === this.token) cb.onEnd?.();
    };

    const fileKey = req.id ? `${req.lang}/${req.tier}/${req.id}` : null;
    const file = fileKey ? this.manifest?.get(fileKey) : undefined;
    if (file && this.audioEl) {
      this.audioEl.src = `${import.meta.env.BASE_URL}audio/${file}`;
      this.audioEl.playbackRate = req.rate ?? 1;
      this.audioEl.onended = done;
      this.audioEl.play().catch(() => this.speakSynth(req, cb, token));
      return;
    }
    this.speakSynth(req, cb, token);
  }

  private speakSynth(req: SpeakRequest, cb: SpeakCallbacks, token: number) {
    if (!this.speechSupported) {
      cb.onEnd?.();
      return;
    }
    if (this.voices.length === 0) this.voices = window.speechSynthesis.getVoices();
    const u = new SpeechSynthesisUtterance(speakable(req.text, req.lang));
    const voice = pickVoice(this.voices, req.lang);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? SPEECH_LANG[req.lang];
    u.rate = req.rate ?? 1;
    u.onboundary = (e) => {
      if (token === this.token && (e.name === undefined || e.name === "word")) cb.onWord?.(e.charIndex);
    };
    u.onend = () => {
      if (token === this.token) cb.onEnd?.();
    };
    u.onerror = () => {
      if (token === this.token) cb.onEnd?.();
    };
    window.speechSynthesis.speak(u);
  }
}

export const narrator = new Narrator();
