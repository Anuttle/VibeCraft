import { Lang } from "../i18n/types";
import { GlossaryEntry } from "./glossaryTypes";
import { GLOSSARY_CORE } from "./glossaryCore";
import { GLOSSARY_CLAY } from "./chapters/clay";
import { GLOSSARY_SCRIPTORIUM } from "./chapters/scriptorium";
import { GLOSSARY_METAL } from "./chapters/metal";
import { GLOSSARY_INK_PAPER } from "./chapters/inkpaper";
import { GLOSSARY_INDULGENCES } from "./chapters/indulgences";
import { GLOSSARY_BIBLE } from "./chapters/bible";
import { GLOSSARY_SPREAD } from "./chapters/spread";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim();

// Every chapter contributes its own entries; they are combined here. When two
// chapters define the same word, the first definition (core, then chapter
// order) is kept and the later one's terms and aliases are added to it, so
// bold words in every chapter still link.
function combine(lists: GlossaryEntry[][]): GlossaryEntry[] {
  const byKey = new Map<string, GlossaryEntry>();
  const out: GlossaryEntry[] = [];
  for (const list of lists) {
    for (const entry of list) {
      const keys = [`id:${entry.id}`, `en:${normalize(entry.term.en)}`, `es:${normalize(entry.term.es)}`];
      const existing = keys.map((k) => byKey.get(k)).find(Boolean);
      if (!existing) {
        const copy: GlossaryEntry = { ...entry, aliases: { en: [...(entry.aliases?.en ?? [])], es: [...(entry.aliases?.es ?? [])] } };
        out.push(copy);
        keys.forEach((k) => byKey.set(k, copy));
        continue;
      }
      for (const lang of ["en", "es"] as const) {
        const extra = [entry.term[lang], ...(entry.aliases?.[lang] ?? [])];
        const list = existing.aliases![lang]!;
        for (const word of extra) if (!list.includes(word) && word !== existing.term[lang]) list.push(word);
      }
      keys.forEach((k) => byKey.set(k, existing));
    }
  }
  return out;
}

export const GLOSSARY: GlossaryEntry[] = combine([
  GLOSSARY_CORE,
  GLOSSARY_CLAY,
  GLOSSARY_SCRIPTORIUM,
  GLOSSARY_METAL,
  GLOSSARY_INK_PAPER,
  GLOSSARY_INDULGENCES,
  GLOSSARY_BIBLE,
  GLOSSARY_SPREAD,
]);

/** Find the entry for a bolded word or phrase, matching the term or an alias in that language. */
export function findTerm(word: string, lang: Lang): GlossaryEntry | undefined {
  const w = normalize(word);
  if (!w) return undefined;
  return GLOSSARY.find(
    (g) => normalize(g.term[lang]) === w || (g.aliases?.[lang] ?? []).some((a) => normalize(a) === w)
  );
}
