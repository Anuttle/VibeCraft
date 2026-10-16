// Validates chapter content files against docs/CONTENT_GUIDE.md.
// Usage: npx tsx scripts/validate-content.ts [chapter files...]
// With no arguments, validates every chapter registered in src/content/chapters.ts.

import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Chapter, Step } from "../src/game/quest";
import type { ActivityDef, QuizConfig, QuizItem } from "../src/game/activities";
import { BANDS, LANGS, Line, TIERS, Tiered, resolveTiered, stripMarkup } from "../src/i18n/types";
import { findTerm } from "../src/content/glossary";

const errors: string[] = [];
const warnings: string[] = [];
const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);
const warn = (where: string, msg: string) => warnings.push(`${where}: ${msg}`);

const GENDERED_ES = /(?<!la )\b(bienvenid[oa]s?|list[oa]s? para|cansad[oa]|aprendiz (nuevo|nueva)|el aprendiz|la aprendiz)\b/i;
const VOSOTROS = /\b(vosotros|vosotras|tenéis|sois|habéis|podéis|queréis|vuestro|vuestra)\b/i;

function checkSpanish(where: string, text: string) {
  if (GENDERED_ES.test(text)) err(where, `gendered or non-neutral Spanish for the player: "${text.match(GENDERED_ES)![0]}"`);
  if (VOSOTROS.test(text)) err(where, `use Latin American Spanish (no vosotros): "${text.match(VOSOTROS)![0]}"`);
  if (text.length > 120 && !/[áéíóúñü¿¡]/i.test(text)) warn(where, "long Spanish text has no accents or ñ; check spelling");
}

function checkTiered(where: string, value: Line, needAllTiers: boolean) {
  for (const lang of LANGS) {
    const v: Tiered | undefined = value[lang];
    if (v === undefined) {
      err(where, `missing ${lang}`);
      continue;
    }
    if (needAllTiers && typeof v !== "string") {
      for (const t of TIERS) if (!v[t]) err(where, `missing ${lang} ${t}`);
    }
    for (const t of TIERS) {
      const { text } = resolveTiered(v, t);
      if (!text.trim()) err(where, `empty ${lang} ${t}`);
      if (lang === "es") checkSpanish(`${where} es ${t}`, text);
      if ((text.match(/\*/g) ?? []).length % 2 !== 0) err(where, `unbalanced *emphasis* in ${lang} ${t}`);
      for (const m of text.matchAll(/\*([^*]+)\*/g)) {
        if (!findTerm(m[1], lang)) err(where, `bold "${m[1]}" (${lang} ${t}) has no glossary entry or alias`);
      }
    }
    if (needAllTiers && typeof v !== "string") {
      const words = (t: (typeof TIERS)[number]) => stripMarkup(v[t] ?? "").split(/\s+/).length;
      const avgSentence = (t: (typeof TIERS)[number]) => {
        const s = stripMarkup(v[t] ?? "").split(/[.!?¡¿]+/).filter((x) => x.trim());
        return s.length ? words(t) / s.length : 0;
      };
      if (avgSentence("T1") > 10) warn(where, `${lang} T1 averages ${avgSentence("T1").toFixed(1)} words per sentence (aim for ≤ 8)`);
      if (avgSentence("T1") > avgSentence("T4")) warn(where, `${lang} T1 sentences are longer than T4`);
    }
  }
}

function checkQuiz(where: string, quiz: QuizConfig, band: string, lang: string) {
  if (!quiz.intro?.trim()) err(where, "quiz needs an intro");
  if (!quiz.items?.length) err(where, "quiz has no items");
  quiz.items.forEach((item: QuizItem, i) => {
    const w = `${where} item ${i}`;
    if (!item.prompt?.trim()) err(w, "empty prompt");
    if (lang === "es") checkSpanish(w, JSON.stringify(item));
    if (item.kind === "choice") {
      if (item.options.length < 2) err(w, "choice needs at least 2 options");
      if (item.answer < 0 || item.answer >= item.options.length) err(w, "answer index out of range");
      if (!item.explain?.trim()) err(w, "choice needs an explain");
      if (band === "K-2" && item.options.some((o) => !o.emoji)) err(w, "K-2 choice options need emoji");
    }
    if (item.kind === "number" && !Number.isFinite(item.answer)) err(w, "number answer must be a number");
    if (item.kind === "order" && item.items.length < 3) err(w, "order needs at least 3 items");
    if (item.kind === "evidence") {
      if (item.claims.length < 2) err(w, "evidence needs at least 2 claims");
      if (item.evidence.length < item.pick + 1) err(w, "evidence needs more pieces than it asks students to pick");
      item.claims.forEach((_, ci) => {
        if (item.evidence.filter((e) => e.supports.includes(ci)).length < item.pick)
          warn(w, `claim ${ci} has fewer than ${item.pick} supporting pieces of evidence`);
      });
    }
  });
}

function checkActivity(where: string, act: ActivityDef) {
  if (!act.title?.en || !act.title?.es) err(where, "activity needs a title in en and es");
  for (const band of BANDS) {
    const perBand = (act.config as Record<string, unknown>)[band];
    if (!perBand) {
      err(where, `missing config for band ${band}`);
      continue;
    }
    if (act.kind === "press") {
      // Press config is per band only; check the pull reaction window.
      const c = perBand as { pullZone: [number, number] | null; pullRate: number };
      if (c.pullZone) {
        const windowS = (c.pullZone[1] - c.pullZone[0]) / c.pullRate;
        const min = band === "3-5" ? 0.6 : band === "6-8" ? 0.33 : 0.23;
        if (windowS < min) err(`${where} ${band}`, `pull window ${windowS.toFixed(2)}s is shorter than ${min}s`);
      }
      continue;
    }
    for (const lang of LANGS) {
      const cfg = (perBand as Record<string, unknown>)[lang] as Record<string, unknown> | undefined;
      const w = `${where} ${band}/${lang}`;
      if (!cfg) {
        err(w, "missing config");
        continue;
      }
      if (lang === "es" && act.kind !== "typeset") checkSpanish(w, JSON.stringify(cfg));
      switch (act.kind) {
        case "hold": {
          const c = cfg as unknown as { zone: [number, number] | null; rate: number };
          if (band === "K-2" && c.zone) warn(w, "K-2 hold usually has zone: null");
          if (c.zone) {
            const windowS = (c.zone[1] - c.zone[0]) / c.rate;
            const min = band === "3-5" ? 0.6 : band === "6-8" ? 0.33 : 0.23;
            if (windowS < min) err(w, `hold window ${windowS.toFixed(2)}s is shorter than ${min}s`);
          }
          break;
        }
        case "mix": {
          const c = cfg as unknown as { correct?: string[]; targets?: Record<string, [number, number]>; ingredients: { id: string }[]; hints: Record<string, unknown> };
          if (!c.correct && !c.targets) err(w, "mix needs correct (pick) or targets (ratio)");
          const ids = c.ingredients.map((i) => i.id);
          for (const id of [...(c.correct ?? []), ...Object.keys(c.targets ?? {})]) if (!ids.includes(id)) err(w, `unknown ingredient ${id}`);
          if (c.targets) {
            const lo = Object.values(c.targets).reduce((a, [l]) => a + l, 0);
            const hi = Object.values(c.targets).reduce((a, [, h]) => a + h, 0);
            if (lo > 100 || hi < 100) err(w, `targets can't total 100 (range ${lo}-${hi})`);
            for (const id of Object.keys(c.targets)) if (!c.hints[id]) err(w, `missing hint for ${id}`);
          }
          break;
        }
        case "sequence": {
          const c = cfg as unknown as { items: unknown[] };
          if (c.items.length < 3) err(w, "sequence needs at least 3 items");
          break;
        }
        case "carve": {
          const c = cfg as unknown as { glyphs: string[] };
          if (!c.glyphs.length) err(w, "carve needs glyphs");
          break;
        }
        case "map": {
          const c = cfg as unknown as { cities: { lat: number; lon: number }[] };
          if (c.cities.length < 3) err(w, "map needs at least 3 cities");
          break;
        }
        case "quiz":
          checkQuiz(w, cfg as unknown as QuizConfig, band, lang);
          break;
      }
    }
  }
}

function checkChapter(file: string, ch: Chapter) {
  const where = `${path.basename(file)} [${ch.id}]`;
  const stationIds = new Set((ch.world?.structure?.stations ?? []).map((s) => s.station));
  const npcIds = new Set((ch.world?.npcs ?? []).map((n) => n.id));
  const activityIds = new Set(Object.keys(ch.activities ?? {}));
  const dialogueIds = new Set<string>();

  for (const id of stationIds) if (!activityIds.has(id)) err(where, `station "${id}" has no activity`);
  for (const id of activityIds) if (!stationIds.has(id)) err(where, `activity "${id}" has no station in the world`);
  for (const [id, act] of Object.entries(ch.activities ?? {})) checkActivity(`${where} activity ${id}`, act);

  for (const band of BANDS) {
    const steps = ch.steps.filter((s: Step) => !s.bands || s.bands.includes(band));
    const last = steps[steps.length - 1];
    if (ch.id !== "tutorial" && last?.objective?.type !== "journal") err(where, `${band}: last step should be the journal check`);
  }

  ch.steps.forEach((step) => {
    const w = `${where} step ${step.id}`;
    // Steps shown only to K-2 may rely on the T1/T2 fallback.
    const k2Only = !!step.bands && step.bands.every((b) => b === "K-2");
    for (const d of step.dialogue ?? []) {
      if (dialogueIds.has(d.id)) err(w, `duplicate dialogue id ${d.id}`);
      dialogueIds.add(d.id);
      checkTiered(`${w} ${d.id}`, d.text, !k2Only);
      checkTiered(`${w} ${d.id} speaker`, d.speaker, false);
    }
    const o = step.objective;
    if (o) {
      if (o.type !== "journal" && !step.objectiveText) err(w, "objective needs objectiveText");
      if (step.objectiveText) {
        checkTiered(`${w} goal`, step.objectiveText.goal, false);
        if (step.objectiveText.hintTouch) checkTiered(`${w} hintTouch`, step.objectiveText.hintTouch, false);
        if (step.objectiveText.hintMouse) checkTiered(`${w} hintMouse`, step.objectiveText.hintMouse, false);
      }
      if (o.type === "station" && !activityIds.has(o.station)) err(w, `objective uses unknown station ${o.station}`);
      if (o.type === "talk" && !npcIds.has(o.npcId)) err(w, `objective uses unknown character ${o.npcId}`);
    }
  });

  if (ch.id !== "tutorial") {
    if (!ch.journal) err(where, "chapter needs a journal check");
    else
      for (const band of BANDS)
        for (const lang of LANGS) {
          const q = ch.journal[band]?.[lang];
          if (!q) err(where, `journal missing ${band}/${lang}`);
          else checkQuiz(`${where} journal ${band}/${lang}`, q, band, lang);
        }
  }
}

async function main() {
  const files = process.argv.slice(2);
  const chapters: Array<{ file: string; ch: Chapter }> = [];
  if (files.length === 0) {
    const mod = await import(pathToFileURL(path.resolve("src/content/chapters.ts")).href);
    for (const info of mod.CHAPTERS) if (info.chapter) chapters.push({ file: "chapters.ts", ch: info.chapter });
  } else {
    for (const f of files) {
      const mod = await import(pathToFileURL(path.resolve(f)).href);
      for (const value of Object.values(mod)) {
        if (value && typeof value === "object" && "steps" in value && "id" in value) chapters.push({ file: f, ch: value as Chapter });
      }
      if (!chapters.some((c) => c.file === f)) err(f, "no Chapter export found");
    }
  }
  for (const { file, ch } of chapters) checkChapter(file, ch);
  for (const w of warnings) console.log(`warn  ${w}`);
  for (const e of errors) console.log(`ERROR ${e}`);
  console.log(`\n${chapters.length} chapter(s), ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}

main();
