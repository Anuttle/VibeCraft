import { CSSProperties, useEffect, useRef, useState } from "react";
import { useApp } from "../../AppContext";
import type { PressConfig } from "../../content/press";
import { UiKey } from "../../content/ui";
import { playSoundEffect } from "../../utils/mobs";
import MinigameFrame from "./MinigameFrame";

interface PressGameProps {
  cfg: PressConfig;
  title: string;
  icon: string;
  /** Text set at the type case; printed on each sheet. */
  lines: string[];
  onComplete: () => void;
  onClose: () => void;
}

type Phase = "ink" | "paper" | "pull" | "result";
type Outcome = "good" | "faint" | "blotchy" | "light" | "smudged";

const OUTCOME_TEXT: Record<Outcome, UiKey> = {
  good: "resultGood",
  faint: "resultFaint",
  blotchy: "resultBlotchy",
  light: "resultLight",
  smudged: "resultSmudged",
};

function Meter({ label, value, zone }: { label: string; value: number; zone: [number, number] | null }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-sm font-semibold text-stone-200">
        <span>{label}</span>
        <span className="font-mono">{Math.round(value)}</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-stone-600 bg-stone-800">
        {zone && (
          <div
            className="absolute inset-y-0 bg-emerald-500/40"
            style={{ left: `${zone[0]}%`, width: `${zone[1] - zone[0]}%` }}
            aria-hidden
          />
        )}
        <div className="absolute inset-y-0 left-0 bg-amber-400/90 transition-[width] duration-75" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

/** The printed sheet, with the flaw the student caused (if any) made visible. */
function Sheet({ lines, outcome }: { lines: string[]; outcome: Outcome | null }) {
  const style: CSSProperties =
    outcome === "faint" || outcome === "light"
      ? { opacity: 0.28 }
      : outcome === "blotchy"
        ? { textShadow: "0 0 6px #000, 2px 2px 4px #000", color: "#111" }
        : outcome === "smudged"
          ? { filter: "blur(1.5px)", transform: "skewX(-8deg)" }
          : {};
  return (
    <div className="w-full max-w-xl rounded-sm bg-[#f8f1df] p-6 shadow-xl">
      <div className="font-serif text-2xl leading-snug whitespace-pre text-stone-900" style={style}>
        {lines.join("\n")}
      </div>
    </div>
  );
}

export default function PressGame({ cfg, title, icon, lines, onComplete, onClose }: PressGameProps) {
  const app = useApp();
  const isK2 = app.band === "K-2";

  const [phase, setPhase] = useState<Phase>("ink");
  const [ink, setInk] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [good, setGood] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const holding = useRef(false);
  const pressureRef = useRef(0);
  const inkRef = useRef(0);
  inkRef.current = ink;

  useEffect(() => {
    if (!cfg.showTimer || good >= cfg.sheets) return;
    const id = setInterval(() => setElapsed(Math.round((Date.now() - startedAt) / 1000)), 500);
    return () => clearInterval(id);
  }, [cfg.showTimer, good, cfg.sheets, startedAt]);

  const judge = (inkLevel: number, pressureLevel: number): Outcome => {
    if (cfg.inkZone) {
      if (inkLevel < cfg.inkZone[0]) return "faint";
      if (inkLevel > cfg.inkZone[1]) return "blotchy";
    }
    if (cfg.pullZone) {
      if (pressureLevel < cfg.pullZone[0]) return "light";
      if (pressureLevel > cfg.pullZone[1]) return "smudged";
    }
    return "good";
  };

  const release = () => {
    if (!holding.current) return;
    holding.current = false;
    const result = judge(inkRef.current, pressureRef.current);
    setOutcome(result);
    setPhase("result");
    if (result === "good") {
      setGood((g) => g + 1);
      playSoundEffect("success");
    } else {
      playSoundEffect("block_break");
    }
  };

  // Pressure rises while the bar is held. K-2 releases automatically when full.
  useEffect(() => {
    if (phase !== "pull") return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (holding.current) {
        pressureRef.current = Math.min(110, pressureRef.current + cfg.pullRate * dt);
        setPressure(pressureRef.current);
        if (!cfg.pullZone && pressureRef.current >= 100) release();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // release() only reads refs, so it doesn't need to be a dependency.
  }, [phase, cfg.pullRate, cfg.pullZone]);

  const dab = () => {
    const jitter = cfg.inkJitter ? (Math.random() * 2 - 1) * cfg.inkJitter : 0;
    const nextInk = Math.min(120, ink + cfg.inkPerDab + jitter);
    setInk(nextInk);
    playSoundEffect("pickup");
    if (!cfg.inkZone && nextInk >= 100) setPhase("paper");
  };

  const newSheet = () => {
    setInk(0);
    setPressure(0);
    pressureRef.current = 0;
    setOutcome(null);
    setPhase("ink");
  };

  const finished = good >= cfg.sheets;
  const instruction =
    phase === "ink"
      ? app.ui(isK2 ? "pressInkK2" : "pressInk")
      : phase === "paper"
        ? app.ui("pressPaper")
        : phase === "pull"
          ? app.ui(isK2 ? "pressPullK2" : "pressPull")
          : app.ui(OUTCOME_TEXT[outcome ?? "good"]);

  return (
    <MinigameFrame title={title} icon={icon} instruction={instruction} onClose={onClose}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-lg font-bold text-amber-200">
        <span>{app.ui("goodSheets", { n: Math.min(good, cfg.sheets), total: cfg.sheets })}</span>
        {cfg.showTimer && <span className="font-mono">{app.ui("timer", { s: elapsed })}</span>}
      </div>

      {/* Side view of the press: platen above, type bed below */}
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-stone-700 bg-gradient-to-b from-amber-950/60 to-stone-900 p-4">
        <div
          className="h-6 w-72 rounded bg-amber-900 shadow-lg transition-transform"
          style={{ transform: `translateY(${phase === "pull" || phase === "result" ? Math.min(60, pressure * 0.6) : 0}px)` }}
          aria-hidden
        />
        <div className="relative flex h-24 w-80 items-end justify-center rounded-b-lg border-x-8 border-b-8 border-amber-950">
          {(phase === "paper" || phase === "pull" || phase === "result") && (
            <div className="absolute bottom-10 h-3 w-64 rounded-sm bg-[#f8f1df] shadow" aria-hidden />
          )}
          <div
            className="mb-1 flex h-8 w-64 items-center justify-center overflow-hidden rounded bg-stone-500 font-serif text-sm whitespace-nowrap"
            style={{ color: ink > 0 ? `rgba(0,0,0,${Math.min(1, ink / 80)})` : "#d6d3d1", transform: "scaleX(-1)" }}
            aria-hidden
          >
            {lines.join("  ")}
          </div>
        </div>
      </section>

      {phase === "ink" && (
        <section className="flex flex-col items-center gap-4">
          <Meter label={app.ui("ink")} value={ink} zone={cfg.inkZone} />
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={dab}
              className="flex min-h-20 min-w-40 items-center justify-center gap-2 rounded-2xl bg-stone-800 px-6 text-xl font-bold text-stone-100 shadow-lg active:scale-95"
            >
              🟤🟤 {app.ui("dabInk")}
            </button>
            {cfg.inkZone && (
              <button
                type="button"
                disabled={ink === 0}
                onClick={() => setPhase("paper")}
                className="min-h-20 rounded-2xl bg-amber-500 px-6 text-xl font-bold text-stone-950 disabled:opacity-30"
              >
                {app.ui("doneInking")} →
              </button>
            )}
          </div>
        </section>
      )}

      {phase === "paper" && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setPhase("pull")}
            className="min-h-20 rounded-2xl bg-amber-500 px-8 text-xl font-bold text-stone-950 active:scale-95"
          >
            📄 {app.ui("placePaper")}
          </button>
        </div>
      )}

      {phase === "pull" && (
        <section className="flex flex-col items-center gap-4">
          <Meter label={app.ui("pressure")} value={pressure} zone={cfg.pullZone} />
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
            className="min-h-24 min-w-56 touch-none select-none rounded-2xl bg-amber-600 px-8 text-2xl font-bold text-stone-950 shadow-lg active:scale-95 active:bg-amber-400"
          >
            ⬇️ {app.ui("holdToPull")}
          </button>
        </section>
      )}

      {phase === "result" && (
        <section className="flex flex-col items-center gap-4">
          <Sheet lines={lines} outcome={outcome} />
          {finished ? (
            <>
              {cfg.showTimer && <p className="text-lg text-stone-200">{app.ui("printedIn", { n: good, s: elapsed })}</p>}
              <button type="button" onClick={onComplete} className="min-h-14 rounded-xl bg-amber-500 px-10 text-lg font-bold text-stone-950">
                {app.ui("finish")}
              </button>
            </>
          ) : (
            <button type="button" onClick={newSheet} className="min-h-14 rounded-xl bg-amber-500 px-8 text-lg font-bold text-stone-950">
              {app.ui("printAnother")}
            </button>
          )}
        </section>
      )}
    </MinigameFrame>
  );
}
