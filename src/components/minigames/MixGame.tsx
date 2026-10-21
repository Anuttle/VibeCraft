import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useApp } from "../../AppContext";
import type { MixConfig } from "../../game/activities";
import { playSoundEffect } from "../../utils/mobs";
import MinigameFrame from "./MinigameFrame";
import { Feedback, FinishPanel, Panel, PrimaryButton } from "./shared";

interface MixGameProps {
  cfg: MixConfig;
  title: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

export default function MixGame({ cfg, title, icon, onComplete, onClose }: MixGameProps) {
  const app = useApp();
  const ratioMode = !!cfg.targets;
  const [picked, setPicked] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<Record<string, number>>(() => {
    if (!cfg.targets) return {};
    const ids = Object.keys(cfg.targets);
    const even = Math.floor(100 / ids.length / 5) * 5;
    const start: Record<string, number> = {};
    ids.forEach((id, i) => (start[id] = i === 0 ? 100 - even * (ids.length - 1) : even));
    return start;
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const total = Object.values(amounts).reduce((a, b) => a + b, 0);

  const togglePick = (id: string) => {
    setFeedback(null);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const change = (id: string, delta: number) => {
    setFeedback(null);
    setAmounts((a) => ({ ...a, [id]: Math.max(0, Math.min(100, a[id] + delta)) }));
  };

  const check = () => {
    if (ratioMode && cfg.targets) {
      if (total !== 100) {
        setFeedback(app.ui("mixMustTotal"));
        return;
      }
      for (const [id, [lo, hi]] of Object.entries(cfg.targets)) {
        if (amounts[id] < lo) return setFeedback(cfg.hints[id]?.low ?? app.ui("notQuite"));
        if (amounts[id] > hi) return setFeedback(cfg.hints[id]?.high ?? app.ui("notQuite"));
      }
    } else {
      const correct = cfg.correct ?? [];
      const missing = correct.find((id) => !picked.includes(id));
      if (missing) return setFeedback(cfg.hints[missing]?.low ?? app.ui("notQuite"));
      const extra = picked.find((id) => !correct.includes(id));
      if (extra) return setFeedback(cfg.hints[extra]?.high ?? app.ui("notQuite"));
    }
    playSoundEffect("success");
    setDone(true);
  };

  const label = (id: string) => cfg.ingredients.find((i) => i.id === id);

  return (
    <MinigameFrame title={title} icon={icon} instruction={done ? cfg.success : feedback ?? cfg.instruction} onClose={onClose}>
      {done ? (
        <FinishPanel message={cfg.success} onFinish={onComplete} />
      ) : ratioMode ? (
        <Panel>
          {Object.keys(cfg.targets!).map((id) => (
            <div key={id} className="flex items-center gap-3">
              <span className="w-10 text-3xl" aria-hidden>
                {label(id)?.emoji}
              </span>
              <span className="w-32 text-lg font-semibold text-stone-100">{label(id)?.label}</span>
              <button type="button" aria-label="−" onClick={() => change(id, -5)} className="flex h-12 w-12 items-center justify-center rounded-lg border border-stone-600 text-stone-100">
                <Minus className="h-5 w-5" />
              </button>
              <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-stone-800">
                <div className="absolute inset-y-0 left-0 bg-amber-400" style={{ width: `${amounts[id]}%` }} />
              </div>
              <button type="button" aria-label="+" onClick={() => change(id, 5)} className="flex h-12 w-12 items-center justify-center rounded-lg bg-rubric-600 text-stone-50">
                <Plus className="h-5 w-5" />
              </button>
              <span className="w-14 text-right font-mono text-lg text-amber-200">{amounts[id]}%</span>
            </div>
          ))}
          <p className={`text-center font-mono text-lg ${total === 100 ? "text-emerald-300" : "text-amber-300"}`}>{app.ui("mixTotal", { n: total })}</p>
          <Feedback text={feedback} />
          <PrimaryButton onClick={check} className="self-center">
            {app.ui("checkMix")}
          </PrimaryButton>
        </Panel>
      ) : (
        <Panel>
          <p className="text-sm font-semibold text-stone-400">{app.ui("tapToChoose")}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cfg.ingredients.map((ing) => {
              const on = picked.includes(ing.id);
              return (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => togglePick(ing.id)}
                  aria-pressed={on}
                  className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-lg border-2 p-3 text-lg font-semibold active:scale-95 ${
                    on ? "border-amber-400 bg-amber-500/20 text-amber-100" : "border-stone-700 bg-stone-800 text-stone-200"
                  }`}
                >
                  <span className="text-4xl" aria-hidden>
                    {ing.emoji}
                  </span>
                  {ing.label}
                </button>
              );
            })}
          </div>
          <Feedback text={feedback} />
          <PrimaryButton onClick={check} disabled={picked.length === 0} className="self-center">
            {app.ui("checkMix")}
          </PrimaryButton>
        </Panel>
      )}
    </MinigameFrame>
  );
}
