import React, { useMemo } from "react";
import { useApp } from "../AppContext";
import { findTerm } from "../content/glossary";
import { openGlossaryEntry } from "./Glossary";

interface Token {
  text: string;
  bold: boolean;
  /** Offset in the text with markup removed (what the speech engine reads). */
  start: number;
  isSpace: boolean;
  /** Bold tokens from the same *phrase* share a group, so "movable type" links as one term. */
  group: number;
}

function tokenize(text: string): { tokens: Token[]; phrases: Map<number, string> } {
  const tokens: Token[] = [];
  const phrases = new Map<number, string>();
  let bold = false;
  let group = -1;
  let plainIndex = 0;
  let current: Token | null = null;

  const flush = () => {
    if (current && current.text) tokens.push(current);
    current = null;
  };

  for (const ch of text) {
    if (ch === "*") {
      flush();
      bold = !bold;
      if (bold) group++;
      continue;
    }
    const isSpace = /\s/.test(ch);
    if (!current || current.isSpace !== isSpace || current.bold !== bold) {
      flush();
      current = { text: "", bold, start: plainIndex, isSpace, group: bold ? group : -1 };
    }
    current.text += ch;
    plainIndex += ch.length;
    if (bold) phrases.set(group, (phrases.get(group) ?? "") + ch);
  }
  flush();
  return { tokens, phrases };
}

interface RichTextProps {
  text: string;
  /** Character offset (in text without markup) of the word being read aloud. */
  highlightAt?: number | null;
  className?: string;
}

/**
 * Renders *emphasis* as bold and highlights the word being spoken. Bold words
 * that are in the glossary can be tapped to open their card.
 */
export default function RichText({ text, highlightAt, className }: RichTextProps) {
  const app = useApp();
  const { tokens, phrases } = useMemo(() => tokenize(text), [text]);

  return (
    <span className={className}>
      {tokens.map((t, i) => {
        if (t.isSpace) return <React.Fragment key={i}>{t.text}</React.Fragment>;
        const active =
          highlightAt !== null &&
          highlightAt !== undefined &&
          highlightAt >= t.start &&
          highlightAt < t.start + t.text.length + 1;
        const entry = t.bold ? findTerm(phrases.get(t.group) ?? t.text, app.lang) : undefined;
        const cls = `${t.bold ? "font-bold text-amber-200" : ""} ${active ? "bg-amber-300 text-slate-950 rounded px-0.5 -mx-0.5" : ""} transition-colors`;
        if (entry) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => openGlossaryEntry(entry)}
              className={`${cls} underline decoration-amber-400/60 decoration-dotted underline-offset-4`}
            >
              {t.text}
            </button>
          );
        }
        return (
          <span key={i} className={cls}>
            {t.text}
          </span>
        );
      })}
    </span>
  );
}
