import { useEffect, useRef, useState } from "react";
import { useApp } from "../../AppContext";
import type { HoldConfig } from "../../game/activities";
import { playSoundEffect } from "../../utils/mobs";
import MinigameFrame from "./MinigameFrame";
import { FinishPanel, Meter, Panel, PrimaryButton } from "./shared";

interface HoldGameProps {
  cfg: HoldConfig;
  title: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

type Result = "good" | "low" | "high" | null;

/** Hold the button to fill the meter; let go inside the green zone. */
export default function HoldGame({ cfg, title, icon, onComplete, onClose }: HoldGameProps) {
  const app = useApp();
  const [value, setValue] = useState(0);
  const [result, setResult] = useState<Result>(null);
  const [good, setGood] = useState(0);
  const holding = useRef(false);
  const valueRef = useRef(0);

  const release = () => {
    if (!holding.current) return;
    holding.current = false;
    const v = valueRef.current;
    const r: Result = !cfg.zone ? "good" : v < cfg.zone[0] ? "low" : v > cfg.zone[1] ? "high" : "good";
    setResult(r);
    if (r === "good") {
      setGood((g) => g + 1);
      playSoundEffect("success");
    } else {
      playSoundEffect("block_break");
    }
  };
  const releaseRef = useRef(release);
  releaseRef.current = release;

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (holding.current) {
        valueRef.current = Math.min(110, valueRef.current + cfg.rate * dt);
        setValue(valueRef.current);
        if (!cfg.zone && valueRef.current >= 100) releaseRef.current();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cfg.rate, cfg.zone]);

  const reset = () => {
    valueRef.current = 0;
    setValue(0);
    setResult(null);
  };

  const finished = good >= cfg.rounds;
  const message = result === "good" ? cfg.good : result === "low" ? cfg.low : result === "high" ? cfg.high : cfg.instruction;

  return (
    <MinigameFrame title={title} icon={icon} instruction={message} onClose={onClose}>
      <p className="text-lg font-bold text-amber-200">{app.ui("roundsDone", { n: Math.min(good, cfg.rounds), total: cfg.rounds })}</p>
      {finished ? (
        <FinishPanel message={cfg.good} onFinish={onComplete} />
      ) : (
        <Panel className="items-center">
          <div className="text-7xl" aria-hidden>
            {cfg.emoji}
          </div>
          <Meter label={cfg.meterLabel} value={value} zone={cfg.zone} />
          {result === null ? (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                holding.current = true;
              }}
              onPointerUp={release}
              onPointerCancel={release}
              onPointerLeave={release}
              onContextMenu={(e) => e.preventDefault()}
              className="min-h-24 min-w-56 touch-none select-none rounded-lg bg-amber-600 px-8 text-2xl font-bold text-stone-950 shadow-lg active:scale-95 active:bg-amber-400"
            >
              {cfg.buttonLabel}
            </button>
          ) : (
            <PrimaryButton onClick={reset}>{app.ui("again")}</PrimaryButton>
          )}
        </Panel>
      )}
    </MinigameFrame>
  );
}
