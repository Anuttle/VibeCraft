import { useEffect, useRef } from "react";
import { Target, Volume2 } from "lucide-react";
import { Objective, ObjectiveText, displayTarget, objectiveTarget } from "../game/quest";
import { useApp } from "../AppContext";
import { narrator } from "../audio/narrator";

interface ObjectiveTrackerProps {
  stepId: string;
  objective: Objective;
  text: ObjectiveText;
  progress: number;
  /** Full-width layout for use inside the bag screen. */
  compact?: boolean;
}

// The tracker can remount (e.g. moving between the HUD and the bag), so the
// last goal read automatically is remembered here to avoid repeating it.
let lastAutoRead = "";

export default function ObjectiveTracker({ stepId, objective, text, progress, compact }: ObjectiveTrackerProps) {
  const app = useApp();
  const target = objectiveTarget(objective);
  const shown = displayTarget(objective);
  const goal = app.lineWithTier(text.goal);
  const goalText = app.line(text.goal, { n: shown ?? "" });
  const hintLine = app.inputMode === "touch" ? text.hintTouch : text.hintMouse;
  const hint = hintLine ? app.line(hintLine) : null;
  const pct = Math.min(100, Math.round((progress / target) * 100));
  const isK2 = app.band === "K-2";

  const spoken = hint ? `${goalText} ${hint}` : goalText;
  const read = () => {
    narrator.speak({
      // The hint differs for touch and mouse, so each has its own recording.
      id: `${stepId}.goal.${app.inputMode}`,
      text: spoken,
      lang: app.lang,
      tier: goal.tier,
      rate: isK2 ? 0.85 : 0.95,
    });
  };

  // Read each new goal once when read-aloud is on. Only stepId and language
  // retrigger it, so progress updates don't restart speech.
  const readRef = useRef(read);
  readRef.current = read;
  useEffect(() => {
    const key = `${stepId}|${app.lang}`;
    if (app.audio && key !== lastAutoRead) {
      lastAutoRead = key;
      readRef.current();
    }
  }, [stepId, app.lang, app.audio]);

  return (
    <div
      className={`pointer-events-auto rounded-lg border border-amber-700/50 bg-stone-900/90 text-stone-100 ${
        compact ? "w-full p-3" : "w-[min(22rem,calc(100vw-2rem))] p-4 shadow-xl"
      }`}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <Target className="h-4 w-4" />
          {app.ui("goal")}
        </span>
        <button
          type="button"
          onClick={read}
          aria-label={app.ui("listen")}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-700 bg-stone-800 active:scale-95"
        >
          <Volume2 className="h-5 w-5" />
        </button>
      </div>
      <p className={isK2 ? "text-xl font-semibold" : "text-base font-semibold"}>{goalText}</p>
      {hint && <p className="mt-1 text-sm text-stone-300">{hint}</p>}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-800">
          <div className="h-full rounded-full bg-amber-400 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        {shown !== null && (
          <span className="font-mono text-sm font-bold text-amber-300">
            {Math.min(shown, Math.floor(progress))} / {shown}
          </span>
        )}
      </div>
    </div>
  );
}
