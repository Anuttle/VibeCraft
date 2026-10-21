import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Languages, Volume2 } from "lucide-react";
import { DialogueLine } from "../game/quest";
import { useApp } from "../AppContext";
import { narrator } from "../audio/narrator";
import { otherLang } from "../i18n/types";
import RichText from "./RichText";

interface DialogueBoxProps {
  line: DialogueLine;
  onNext: () => void;
}

export default function DialogueBox({ line, onNext }: DialogueBoxProps) {
  const app = useApp();
  const [wordAt, setWordAt] = useState<number | null>(null);
  const [showOther, setShowOther] = useState(false);
  const [otherWordAt, setOtherWordAt] = useState<number | null>(null);

  const main = app.lineWithTier(line.text);
  const altLang = otherLang(app.lang);
  const alt = app.lineWithTier(line.text, altLang);
  const isK2 = app.band === "K-2";
  const rate = isK2 ? 0.85 : 0.95;

  const speakMain = useCallback(() => {
    setOtherWordAt(null);
    narrator.speak(
      { id: line.id, text: main.text, lang: app.lang, tier: main.tier, rate },
      { onWord: setWordAt, onEnd: () => setWordAt(null) }
    );
  }, [line.id, main.text, main.tier, app.lang, rate]);

  const speakOther = () => {
    setShowOther(true);
    setWordAt(null);
    narrator.speak(
      { id: line.id, text: alt.text, lang: altLang, tier: alt.tier, rate },
      { onWord: setOtherWordAt, onEnd: () => setOtherWordAt(null) }
    );
  };

  // Read each new line automatically when read-aloud is on.
  useEffect(() => {
    setShowOther(false);
    setWordAt(null);
    setOtherWordAt(null);
    if (app.audio) speakMain();
    return () => narrator.stop();
  }, [line.id, app.audio, speakMain]);

  const handleNext = useCallback(() => {
    narrator.stop();
    onNext();
  }, [onNext]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext]);

  const textSize = isK2 ? "text-2xl leading-relaxed" : "text-lg leading-relaxed sm:text-xl";

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-6 pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-3xl rounded-md border-2 border-stone-900 bg-stone-100 p-5 text-stone-900 shadow-[0_6px_0_rgba(21,17,13,0.55)]"
        role="dialog"
        aria-live="polite"
      >
        <div className="mb-2 flex items-center gap-2 font-serif text-base font-bold text-rubric-700">
          <span aria-hidden>📖</span>
          {app.line(line.speaker)}
        </div>

        <p className={`${textSize} text-stone-900`} lang={app.lang}>
          <RichText text={main.text} highlightAt={wordAt} tone="paper" />
        </p>

        {showOther && (
          <p className="mt-3 border-t border-stone-300 pt-3 text-base italic leading-relaxed text-stone-600" lang={altLang}>
            <RichText text={alt.text} highlightAt={otherWordAt} tone="paper" />
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={speakMain}
            className="flex min-h-12 items-center gap-2 rounded-md border border-stone-500 bg-stone-200 px-4 font-semibold text-stone-900 active:scale-95"
          >
            <Volume2 className="h-5 w-5" />
            {app.ui("listen")}
          </button>
          <button
            type="button"
            onClick={speakOther}
            className="flex min-h-12 items-center gap-2 rounded-md border border-stone-500 bg-stone-200 px-4 font-semibold text-stone-900 active:scale-95"
          >
            <Languages className="h-5 w-5" />
            {app.ui("hearOther")}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="ml-auto flex min-h-12 items-center gap-1 rounded-md bg-rubric-600 px-6 text-lg font-bold text-stone-50 shadow-[0_3px_0_#5a1612] active:translate-y-0.5 active:shadow-none"
            autoFocus
          >
            {app.ui("next")}
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
