// Audio tools for read-aloud.
//
//   npm run audio -- list              How many recordings the game can use, per language.
//   npm run audio -- script            Recording sheets for voice actors: audio-scripts/<lang>.csv
//   npm run audio -- manifest          Register every file found in public/audio (run after adding recordings).
//   npm run audio -- gemini [--lang es] [--limit 20]
//                                      Generate missing files with Gemini text-to-speech.
//                                      Needs GEMINI_API_KEY. Optional: GEMINI_TTS_MODEL, GEMINI_VOICE_EN, GEMINI_VOICE_ES.
//
// Files live at public/audio/<lang>/<tier>/<id>.<mp3|m4a|wav|ogg>. Lines that are
// the same at several reading tiers share one file (the tier the text comes from).
// Anything without a file is read by the device's speech voice instead.

import fs from "node:fs";
import path from "node:path";
import { CHAPTERS } from "../src/content/chapters";
import { displayTarget } from "../src/game/quest";
import { LANGS, Lang, Line, TIERS, format, resolveTiered, speakable } from "../src/i18n/types";

const AUDIO_DIR = path.resolve("public/audio");
const EXTENSIONS = ["mp3", "m4a", "wav", "ogg"];

export interface Recording {
  /** "lang/tier/id": the key the game looks up. */
  key: string;
  lang: Lang;
  tier: string;
  id: string;
  /** Exactly what should be said. */
  text: string;
  /** Where it's used, for the voice actor. */
  context: string;
}

function addLine(out: Map<string, Recording>, id: string, line: Line, context: string, vars?: Record<string, string | number>) {
  for (const lang of LANGS) {
    for (const tier of TIERS) {
      const resolved = resolveTiered(line[lang], tier);
      const key = `${lang}/${resolved.tier}/${id}`;
      if (out.has(key)) continue;
      out.set(key, { key, lang, tier: resolved.tier, id, text: speakable(format(resolved.text, vars), lang), context });
    }
  }
}

/** Every line the game reads aloud with a content id. */
export function collectRecordings(): Recording[] {
  const out = new Map<string, Recording>();
  for (const info of CHAPTERS) {
    const ch = info.chapter;
    if (!ch) continue;
    const title = info.title.en;
    for (const step of ch.steps) {
      for (const d of step.dialogue ?? []) addLine(out, d.id, d.text, `${title}: ${d.speaker.en}`);
      if (step.objective && step.objectiveText) {
        const t = step.objectiveText;
        const n = displayTarget(step.objective) ?? "";
        for (const mode of ["touch", "mouse"] as const) {
          const hint = mode === "touch" ? t.hintTouch : t.hintMouse;
          const id = `${ch.id}.${step.id}.goal.${mode}`;
          // ObjectiveTracker speaks goal + hint and files it under the goal's tier.
          for (const lang of LANGS) {
            for (const tier of TIERS) {
              const goal = resolveTiered(t.goal[lang], tier);
              const key = `${lang}/${goal.tier}/${id}`;
              if (out.has(key)) continue;
              const hintText = hint ? resolveTiered(hint[lang], goal.tier).text : "";
              const text = speakable(format(`${goal.text} ${hintText}`.trim(), { n }), lang);
              out.set(key, { key, lang, tier: goal.tier, id, text, context: `${title}: goal (${mode})` });
            }
          }
        }
      }
    }
    for (const npc of ch.world?.npcs ?? []) {
      if (npc.idle) addLine(out, `npc.${npc.id}.idle`, npc.idle, `${npc.name.en}: idle line`);
    }
  }
  // Story order (chapter, then line), which is easiest for a voice actor to read through.
  return [...out.values()];
}

function existingFiles(): string[] {
  const found: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (EXTENSIONS.includes(path.extname(entry.name).slice(1).toLowerCase())) {
        found.push(path.relative(AUDIO_DIR, full).split(path.sep).join("/"));
      }
    }
  };
  walk(AUDIO_DIR);
  return found.sort();
}

function writeManifest() {
  const files = existingFiles();
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.writeFileSync(path.join(AUDIO_DIR, "manifest.json"), JSON.stringify({ files }, null, 2) + "\n");
  const wanted = new Set(collectRecordings().map((r) => r.key));
  const unknown = files.filter((f) => !wanted.has(f.replace(/\.[^.]+$/, "")));
  console.log(`manifest: ${files.length} file(s) registered`);
  if (unknown.length) console.log(`warning: ${unknown.length} file(s) don't match any line (check the names):\n  ${unknown.join("\n  ")}`);
}

function csvCell(s: string) {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeScripts() {
  const recs = collectRecordings();
  const outDir = path.resolve("audio-scripts");
  fs.mkdirSync(outDir, { recursive: true });
  const have = new Set(existingFiles().map((f) => f.replace(/\.[^.]+$/, "")));
  for (const lang of LANGS) {
    const rows = recs.filter((r) => r.lang === lang);
    const lines = [
      ["file name", "reading tier", "where it's used", "recorded?", "text to read"].join(","),
      ...rows.map((r) =>
        [`public/audio/${r.key}.mp3`, r.tier, r.context, have.has(r.key) ? "yes" : "", r.text].map(csvCell).join(",")
      ),
    ];
    // BOM so spreadsheet apps read accents correctly.
    fs.writeFileSync(path.join(outDir, `${lang}.csv`), "﻿" + lines.join("\n") + "\n");
    console.log(`audio-scripts/${lang}.csv: ${rows.length} line(s)`);
  }
}

function list() {
  const recs = collectRecordings();
  const have = new Set(existingFiles().map((f) => f.replace(/\.[^.]+$/, "")));
  for (const lang of LANGS) {
    const rows = recs.filter((r) => r.lang === lang);
    console.log(`${lang}: ${rows.length} line(s), ${rows.filter((r) => have.has(r.key)).length} recorded`);
  }
}

// ---- Gemini text-to-speech -----------------------------------------------------

/** Wrap raw 16-bit mono PCM in a WAV header. */
function pcmToWav(pcm: Buffer, sampleRate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

const STYLE: Record<Lang, string> = {
  en: "Read this aloud clearly and warmly for students, at a calm pace, in American English:",
  es: "Lee esto en voz alta para estudiantes, con claridad y calidez, a un ritmo tranquilo, en español latinoamericano neutro:",
};

async function gemini(args: string[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Set GEMINI_API_KEY first.");
    process.exit(1);
  }
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });
  // Check the current model and voice names in Google's documentation; they change over time.
  const model = process.env.GEMINI_TTS_MODEL ?? "gemini-2.5-flash-preview-tts";
  const voices: Record<Lang, string> = {
    en: process.env.GEMINI_VOICE_EN ?? "Kore",
    es: process.env.GEMINI_VOICE_ES ?? "Kore",
  };
  const onlyLang = args.includes("--lang") ? (args[args.indexOf("--lang") + 1] as Lang) : null;
  const limit = args.includes("--limit") ? parseInt(args[args.indexOf("--limit") + 1], 10) : Infinity;

  const have = new Set(existingFiles().map((f) => f.replace(/\.[^.]+$/, "")));
  const todo = collectRecordings().filter((r) => !have.has(r.key) && (!onlyLang || r.lang === onlyLang)).slice(0, limit);
  console.log(`generating ${todo.length} file(s) with ${model}`);

  let done = 0;
  for (const r of todo) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: `${STYLE[r.lang]} ${r.text}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voices[r.lang] } } },
        },
      });
      const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
      if (!part?.inlineData?.data) throw new Error("no audio in response");
      const rate = parseInt(part.inlineData.mimeType?.match(/rate=(\d+)/)?.[1] ?? "24000", 10);
      const file = path.join(AUDIO_DIR, `${r.key}.wav`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, pcmToWav(Buffer.from(part.inlineData.data, "base64"), rate));
      done++;
      console.log(`  ✓ ${r.key}`);
    } catch (e) {
      console.log(`  ✗ ${r.key}: ${(e as Error).message}`);
    }
    await new Promise((res) => setTimeout(res, 300));
  }
  console.log(`${done} of ${todo.length} generated`);
  writeManifest();
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "list") list();
else if (cmd === "script") writeScripts();
else if (cmd === "manifest") writeManifest();
else if (cmd === "gemini") gemini(rest);
else {
  console.log("usage: npm run audio -- <list | script | manifest | gemini [--lang en|es] [--limit N]>");
  process.exit(cmd ? 1 : 0);
}
