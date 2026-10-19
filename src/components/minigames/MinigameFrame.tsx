import React, { useEffect, useRef } from "react";
import { Volume2, X } from "lucide-react";
import { useApp } from "../../AppContext";
import { narrator } from "../../audio/narrator";

interface MinigameFrameProps {
  title: string;
  icon: string;
  /** Current instruction; read aloud automatically when it changes (if read-aloud is on). */
  instruction: string;
  /** What to read aloud, if different from the instruction (e.g. a question plus its answer choices). */
  speakText?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MinigameFrame({ title, icon, instruction, speakText, onClose, children }: MinigameFrameProps) {
  const app = useApp();
  const isK2 = app.band === "K-2";
  const spoken = speakText ?? instruction;
  const speak = () => narrator.speak({ text: spoken, lang: app.lang, tier: app.tier, rate: isK2 ? 0.85 : 0.95 });
  const speakRef = useRef(speak);
  speakRef.current = speak;

  useEffect(() => {
    if (app.audio) speakRef.current();
  }, [spoken, app.audio]);

  useEffect(() => () => narrator.stop(), []);

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-4 px-4 py-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-amber-100">
            <span aria-hidden>{icon}</span>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={app.ui("close")}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-stone-700 bg-stone-900 text-stone-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-700/50 bg-stone-900 p-4">
          <p className={`flex-1 text-stone-100 ${isK2 ? "text-xl" : "text-base sm:text-lg"}`}>{instruction}</p>
          <button
            type="button"
            onClick={speak}
            aria-label={app.ui("listen")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-stone-700 bg-stone-800 text-stone-100"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
