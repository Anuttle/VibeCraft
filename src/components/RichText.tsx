import React, { useMemo } from "react";

interface Token {
  text: string;
  bold: boolean;
  /** Offset in the text with markup removed (what the speech engine reads). */
  start: number;
  isSpace: boolean;
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let bold = false;
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
      continue;
    }
    const isSpace = /\s/.test(ch);
    if (!current || current.isSpace !== isSpace || current.bold !== bold) {
      flush();
      current = { text: "", bold, start: plainIndex, isSpace };
    }
    current.text += ch;
    plainIndex += ch.length;
  }
  flush();
  return tokens;
}

interface RichTextProps {
  text: string;
  /** Character offset (in text without markup) of the word being read aloud. */
  highlightAt?: number | null;
  className?: string;
}

/** Renders *emphasis* as bold and highlights the word currently being spoken. */
export default function RichText({ text, highlightAt, className }: RichTextProps) {
  const tokens = useMemo(() => tokenize(text), [text]);

  return (
    <span className={className}>
      {tokens.map((t, i) => {
        if (t.isSpace) return <React.Fragment key={i}>{t.text}</React.Fragment>;
        const active =
          highlightAt !== null &&
          highlightAt !== undefined &&
          highlightAt >= t.start &&
          highlightAt < t.start + t.text.length + 1;
        return (
          <span
            key={i}
            className={`${t.bold ? "font-bold text-amber-200" : ""} ${
              active ? "bg-amber-300 text-slate-950 rounded px-0.5 -mx-0.5" : ""
            } transition-colors`}
          >
            {t.text}
          </span>
        );
      })}
    </span>
  );
}
