import { useEffect, useMemo, useState } from "react";
import { Volume2, X } from "lucide-react";
import { useApp } from "../AppContext";
import { GLOSSARY } from "../content/glossary";
import { GlossaryEntry } from "../content/glossaryTypes";
import { Lang, otherLang } from "../i18n/types";
import { narrator } from "../audio/narrator";

// Tapping a bolded word anywhere opens its card. Components announce the word
// here, and <GlossaryHost> in the App shows the card.
type Listener = (entry: GlossaryEntry) => void;
const listeners = new Set<Listener>();
export function openGlossaryEntry(entry: GlossaryEntry) {
  listeners.forEach((l) => l(entry));
}

function useSimple() {
  const app = useApp();
  return app.tier === "T1" || app.tier === "T2";
}

/** One glossary word in both languages, each with its own read-aloud button. */
export function GlossaryCard({ entry }: { entry: GlossaryEntry }) {
  const app = useApp();
  const simple = useSimple();
  const say = (lang: Lang) => {
    const def = (simple ? entry.simple : entry.full)[lang];
    narrator.speak({ text: `${entry.term[lang]}. ${def}`, lang, tier: app.tier, rate: app.band === "K-2" ? 0.85 : 0.95 });
  };
  const langs: Lang[] = [app.lang, otherLang(app.lang)];

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center text-6xl" aria-hidden>
        {entry.emoji}
      </div>
      {langs.map((l, i) => (
        <div key={l} className={`flex items-start gap-3 rounded-xl p-3 ${i === 0 ? "bg-stone-800" : "bg-stone-900 opacity-90"}`} lang={l}>
          <div className="flex-1">
            <div className={`font-bold text-amber-200 ${i === 0 ? "text-2xl" : "text-lg"}`}>{entry.term[l]}</div>
            <p className={`text-stone-100 ${i === 0 ? "text-lg" : "text-base italic"}`}>{(simple ? entry.simple : entry.full)[l]}</p>
          </div>
          <button
            type="button"
            onClick={() => say(l)}
            aria-label={app.ui("listen")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-stone-600 bg-stone-700 text-stone-100"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Shows a glossary card over everything when a bolded word is tapped. */
export function GlossaryHost() {
  const app = useApp();
  const [entry, setEntry] = useState<GlossaryEntry | null>(null);
  useEffect(() => {
    const l: Listener = (e) => setEntry(e);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  if (!entry) return null;
  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center bg-stone-950/70 p-4" onClick={() => setEntry(null)}>
      <div
        className="w-full max-w-md rounded-2xl border border-amber-700/60 bg-stone-900 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={entry.term[app.lang]}
      >
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => setEntry(null)}
            aria-label={app.ui("close")}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-700 text-stone-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <GlossaryCard entry={entry} />
      </div>
    </div>
  );
}

/** Searchable list of every word. */
export function GlossaryList() {
  const app = useApp();
  const [q, setQ] = useState("");
  const sorted = useMemo(
    () => [...GLOSSARY].sort((a, b) => a.term[app.lang].localeCompare(b.term[app.lang], app.lang)),
    [app.lang]
  );
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const shown = sorted.filter((g) => !q || norm(g.term.en).includes(norm(q)) || norm(g.term.es).includes(norm(q)));

  return (
    <div className="flex flex-col gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={app.ui("search")}
        aria-label={app.ui("search")}
        className="min-h-12 rounded-xl border border-stone-600 bg-stone-950 px-4 text-lg text-stone-100 outline-none focus:border-amber-400"
      />
      {shown.length === 0 && <p className="text-stone-400">{app.ui("noMatches")}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {shown.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => openGlossaryEntry(g)}
            className="flex min-h-14 items-center gap-3 rounded-xl border border-stone-700 bg-stone-800 px-4 text-left text-stone-100"
          >
            <span className="text-2xl" aria-hidden>
              {g.emoji}
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">{g.term[app.lang]}</span>
              <span className="text-sm text-stone-400">{g.term[otherLang(app.lang)]}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
