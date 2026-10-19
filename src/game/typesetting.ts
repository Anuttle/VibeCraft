import { TypesetConfig } from "../content/press";

export interface Trays {
  /** Capital letters (upper case), or every letter when the case is not split. */
  upper: string[];
  /** Small letters (lower case); empty when the case is not split. */
  lower: string[];
  /** Whether a space sort is needed. */
  space: boolean;
}

function isUpper(ch: string) {
  return ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}

/** Deterministic shuffle so a class sees the same tray layout. */
export function seededShuffle<T>(items: T[], seedText: string): T[] {
  let seed = 0;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildTrays(cfg: TypesetConfig): Trays {
  const text = cfg.lines.join("");
  const letters = new Set<string>();
  for (const ch of text + cfg.distractors) if (ch !== " ") letters.add(ch);
  const order = (list: string[]) =>
    cfg.shuffle ? seededShuffle(list, text) : [...list].sort((a, b) => a.localeCompare(b, "es"));

  const all = [...letters];
  if (!cfg.caseSplit) return { upper: order(all), lower: [], space: cfg.lines.some((l) => l.includes(" ")) };
  return {
    upper: order(all.filter(isUpper)),
    lower: order(all.filter((c) => !isUpper(c))),
    space: true,
  };
}

// Letters that look alike when mirrored or flipped: the classic compositor's mix-ups.
const LOOKALIKE: Record<string, string> = { b: "d", d: "b", p: "q", q: "p", n: "u", u: "n" };

/** A copy of the line with one look-alike letter swapped, for the proofreading task. */
export function plantError(line: string): { text: string; index: number } {
  for (const group of ["bdpq", "nu"]) {
    for (let i = 0; i < line.length; i++) {
      if (group.includes(line[i])) {
        return { text: line.slice(0, i) + LOOKALIKE[line[i]] + line.slice(i + 1), index: i };
      }
    }
  }
  // Fallback: swap two neighboring letters inside the first long word.
  const i = line.search(/[^\s]{3}/);
  const at = i >= 0 ? i + 1 : 0;
  return { text: line.slice(0, at) + line[at + 1] + line[at] + line.slice(at + 2), index: at };
}

/** Rebuild a line with `extra[i]` added spaces at each word gap. */
export function justify(line: string, extra: number[]): string {
  const words = line.split(" ");
  return words.reduce((acc, word, i) => (i === 0 ? word : acc + " ".repeat(1 + (extra[i - 1] ?? 0)) + word), "");
}

export function gapCount(line: string): number {
  return line.split(" ").length - 1;
}
