import { useMemo, useState } from "react";
import { useApp } from "../../AppContext";
import type { CarveConfig } from "../../game/activities";
import { seededShuffle } from "../../game/typesetting";
import { playSoundEffect } from "../../utils/mobs";
import MinigameFrame from "./MinigameFrame";
import { Feedback, FinishPanel, Panel } from "./shared";

interface CarveGameProps {
  cfg: CarveConfig;
  title: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

// The carved block that prints correctly is the mirror image. The others are
// common mistakes: carving it the normal way, upside down, or flipped both ways.
const CARVINGS = [
  { id: "mirror", transform: "scaleX(-1)", correct: true },
  { id: "plain", transform: "none", correct: false },
  { id: "flipped", transform: "scaleY(-1)", correct: false },
  { id: "rotated", transform: "rotate(180deg)", correct: false },
];

export default function CarveGame({ cfg, title, icon, onComplete, onClose }: CarveGameProps) {
  const app = useApp();
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; good: boolean } | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const glyph = cfg.glyphs[round];
  const done = round >= cfg.glyphs.length;

  const options = useMemo(
    () => seededShuffle(CARVINGS.slice(0, cfg.options), `${glyph}-${round}`),
    [cfg.options, glyph, round]
  );

  const choose = (opt: (typeof CARVINGS)[number]) => {
    if (!opt.correct) {
      setWrong((w) => [...w, opt.id]);
      setFeedback({ text: app.ui("carveWrong"), good: false });
      return;
    }
    playSoundEffect(round + 1 >= cfg.glyphs.length ? "success" : "pickup");
    setFeedback({ text: app.ui("carveRight"), good: true });
    setWrong([]);
    setTimeout(() => {
      setFeedback(null);
      setRound((r) => r + 1);
    }, 900);
  };

  return (
    <MinigameFrame title={title} icon={icon} instruction={done ? cfg.success : cfg.instruction} onClose={onClose}>
      {done ? (
        <FinishPanel message={cfg.success} onFinish={onComplete} />
      ) : (
        <Panel className="items-center">
          <p className="text-sm font-bold text-amber-200">
            {round + 1} / {cfg.glyphs.length}
          </p>
          <div className="flex flex-col items-center rounded-lg bg-[#f8f1df] px-10 py-4 shadow">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{app.ui("carvePrints")}</span>
            <span className="font-serif text-7xl text-stone-900">{glyph}</span>
          </div>
          <p className="text-lg font-semibold text-stone-100">{app.ui("carveWhich")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt)}
                disabled={wrong.includes(opt.id) || feedback?.good}
                aria-label={`${glyph} ${opt.id}`}
                className="flex h-28 w-28 items-center justify-center rounded-xl border-4 border-orange-900 bg-gradient-to-b from-orange-700 to-orange-800 shadow-lg active:scale-95 disabled:opacity-40"
              >
                <span className="font-serif text-6xl text-orange-200" style={{ transform: opt.transform, display: "inline-block" }}>
                  {glyph}
                </span>
              </button>
            ))}
          </div>
          <Feedback text={feedback?.text ?? null} good={feedback?.good} />
        </Panel>
      )}
    </MinigameFrame>
  );
}
