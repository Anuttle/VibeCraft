import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useApp } from "../../AppContext";
import type { TypesetConfig } from "../../content/press";
import { buildTrays, gapCount, justify, plantError } from "../../game/typesetting";
import { playSoundEffect } from "../../utils/mobs";
import MinigameFrame from "./MinigameFrame";
import { useShuffleSeed } from "./shared";

interface TypesettingProps {
  cfg: TypesetConfig;
  title: string;
  icon: string;
  onComplete: (lines: string[]) => void;
  onClose: () => void;
}

type Phase = "set" | "justify" | "proof" | "done";

/** A metal sort: the letter is cast backwards, as on real type. */
function Sort({ ch, size, mirrored = true }: { ch: string; size: "lg" | "md" | "sm"; mirrored?: boolean }) {
  const dims = size === "lg" ? "h-16 w-14 text-4xl" : size === "md" ? "h-12 w-10 text-2xl" : "h-10 w-7 text-xl";
  return (
    <span
      className={`inline-flex ${dims} items-center justify-center rounded-md border border-stone-500 bg-gradient-to-b from-stone-300 to-stone-400 font-serif font-bold text-stone-900 shadow-inner`}
    >
      <span style={mirrored ? { transform: "scaleX(-1)" } : undefined}>{ch === " " ? "" : ch}</span>
    </span>
  );
}

export default function Typesetting({ cfg, title, icon, onComplete, onClose }: TypesettingProps) {
  const app = useApp();
  const seed = useShuffleSeed();
  const trays = useMemo(() => buildTrays(cfg, seed), [cfg, seed]);
  const proof = useMemo(() => plantError(cfg.lines[0]), [cfg]);
  const isK2 = app.band === "K-2";
  const tileSize = isK2 ? "lg" : "md";

  const [phase, setPhase] = useState<Phase>("set");
  const [lineIdx, setLineIdx] = useState(0);
  const [pos, setPos] = useState(0);
  const [misses, setMisses] = useState(0);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [extra, setExtra] = useState<number[]>([]);
  const [proofMisses, setProofMisses] = useState(0);

  const line = cfg.lines[lineIdx] ?? "";
  const next = line[pos];
  const showHint = cfg.hintAfter !== null && misses >= cfg.hintAfter;

  const finishLine = (finished: string) => {
    const all = [...done, finished];
    setDone(all);
    setPos(0);
    setMisses(0);
    if (lineIdx + 1 < cfg.lines.length) {
      setLineIdx(lineIdx + 1);
      setPhase("set");
    } else {
      setPhase(cfg.proof ? "proof" : "done");
      if (!cfg.proof) playSoundEffect("success");
    }
  };

  const tap = (ch: string) => {
    if (phase !== "set") return;
    if (ch !== next) {
      setMisses((m) => m + 1);
      setWrongKey(ch + Date.now());
      setMessage(app.ui("tsWrong"));
      return;
    }
    playSoundEffect("pickup");
    setMessage(null);
    setMisses(0);
    const newPos = pos + 1;
    if (newPos < line.length) {
      setPos(newPos);
      return;
    }
    setPos(newPos);
    if (cfg.width && line.length < cfg.width) {
      setExtra(Array(gapCount(line)).fill(0));
      setPhase("justify");
    } else {
      finishLine(line);
    }
  };

  // Justification
  const justified = justify(line, extra);
  const remaining = (cfg.width ?? 0) - justified.length;
  const gaps = extra.map((e) => e + 1);
  const uneven = cfg.evenSpacing && gaps.length > 0 && Math.max(...gaps) - Math.min(...gaps) > 1;
  const changeGap = (i: number, delta: number) => {
    setExtra((prev) => {
      const nextExtra = [...prev];
      nextExtra[i] = Math.max(0, nextExtra[i] + delta);
      if (justify(line, nextExtra).length > (cfg.width ?? 0)) return prev;
      return nextExtra;
    });
  };

  const tapProof = (i: number) => {
    if (i === proof.index) {
      playSoundEffect("success");
      setMessage(app.ui("proofFound"));
      setPhase("done");
    } else {
      setProofMisses((m) => m + 1);
      setMessage(app.ui("proofNo"));
    }
  };

  const instruction =
    phase === "justify"
      ? app.ui("tsJustify")
      : phase === "proof"
        ? app.ui("proofHow")
        : phase === "done"
          ? app.ui("tsDone")
          : cfg.instruction
            ? cfg.instruction
            : isK2
              ? app.ui("tsHowK2")
              : app.ui("tsHow");

  const renderTray = (letters: string[], label: string | null) => (
    <div className="rounded-2xl border border-amber-900/60 bg-amber-950/40 p-3">
      {label && <div className="mb-2 text-sm font-bold uppercase tracking-wider text-amber-300">{label}</div>}
      <div className="flex flex-wrap gap-2">
        {letters.map((ch) => {
          const hinted = showHint && ch === next;
          const shaking = wrongKey?.startsWith(ch) && wrongKey.slice(ch.length).match(/^\d+$/);
          return (
            <button
              key={ch}
              type="button"
              onClick={() => tap(ch)}
              aria-label={ch}
              className={`rounded-lg p-0.5 transition-transform active:scale-90 ${hinted ? "animate-pulse ring-4 ring-amber-400" : ""} ${
                shaking ? "animate-[shake_0.3s]" : ""
              }`}
            >
              <span className="flex flex-col items-center gap-0.5">
                <Sort ch={ch} size={tileSize} />
                {cfg.showFace && (
                  <span className="text-sm font-semibold text-amber-100" aria-hidden>
                    {ch}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <MinigameFrame title={title} icon={icon} instruction={instruction} onClose={onClose}>
      {/* The copy to set, with the current letter marked */}
      <section className="rounded-2xl border border-stone-700 bg-stone-100 p-4 text-stone-900">
        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">{app.ui("tsCopy")}</div>
        {cfg.lines.map((l, i) => (
          <div key={i} className={`font-serif ${isK2 ? "text-4xl" : "text-2xl"} ${i < lineIdx || phase !== "set" ? "text-stone-400" : ""}`}>
            {i === lineIdx && phase === "set"
              ? [...l].map((ch, j) => (
                  <span key={j} className={j < pos ? "text-stone-400" : j === pos ? "rounded bg-amber-300 px-0.5 underline" : ""}>
                    {ch === " " && j === pos ? "␣" : ch}
                  </span>
                ))
              : l}
          </div>
        ))}
      </section>

      {phase === "set" && (
        <>
          {/* The composing stick shows the line exactly as the type sits: mirrored. */}
          <section className="rounded-2xl border border-stone-700 bg-stone-900 p-3">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">{app.ui("tsStick")}</div>
            <div className="flex min-h-16 flex-wrap items-center justify-end gap-1 rounded-lg bg-stone-700 p-2" style={{ transform: "scaleX(-1)" }}>
              {[...line.slice(0, pos)].map((ch, i) => (
                <Sort key={i} ch={ch} size="sm" mirrored={false} />
              ))}
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-wider text-stone-400">{app.ui("tsPreview")}</div>
            <div className="min-h-8 font-serif text-2xl text-stone-100">{line.slice(0, pos) || " "}</div>
          </section>

          {message && <p className="text-center text-lg font-semibold text-amber-300">{message}</p>}

          {cfg.caseSplit ? (
            <>
              {renderTray(trays.upper, app.ui("upperCase"))}
              {renderTray(trays.lower, app.ui("lowerCase"))}
            </>
          ) : (
            renderTray(trays.upper, app.ui("tray"))
          )}

          {trays.space && (
            <button
              type="button"
              onClick={() => tap(" ")}
              className={`mx-auto min-h-14 w-64 rounded-xl border border-stone-500 bg-stone-400 text-lg font-bold text-stone-900 active:scale-95 ${
                showHint && next === " " ? "animate-pulse ring-4 ring-amber-400" : ""
              }`}
            >
              {app.ui("space")} ␣
            </button>
          )}
        </>
      )}

      {phase === "justify" && (
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-stone-700 bg-stone-900 p-4">
          <div className="font-mono text-lg text-amber-300">
            {app.ui("lineCount", { n: lineIdx + 1, len: justified.length, width: cfg.width ?? 0 })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {line.split(" ").map((word, i, words) => (
              <div key={i} className="flex items-center gap-2">
                <span className="rounded-lg bg-stone-100 px-2 py-1 font-serif text-2xl text-stone-900">{word}</span>
                {i < words.length - 1 && (
                  <span className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      aria-label="+"
                      onClick={() => changeGap(i, 1)}
                      disabled={remaining <= 0}
                      className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500 text-stone-950 disabled:opacity-30"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    <span className="font-mono text-sm text-stone-300">{"␣".repeat(1 + extra[i])}</span>
                    <button
                      type="button"
                      aria-label="−"
                      onClick={() => changeGap(i, -1)}
                      disabled={extra[i] === 0}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-stone-600 text-stone-200 disabled:opacity-30"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="w-full max-w-xl rounded-lg bg-stone-100 p-2 font-mono text-xl whitespace-pre text-stone-900">
            {justified.padEnd(cfg.width ?? 0, "·")}
          </div>
          {remaining === 0 && uneven && <p className="font-semibold text-amber-300">{app.ui("tsEven")}</p>}
          <button
            type="button"
            disabled={remaining !== 0 || uneven}
            onClick={() => finishLine(justified)}
            className="min-h-14 rounded-xl bg-amber-500 px-8 text-lg font-bold text-stone-950 disabled:opacity-30"
          >
            {app.ui("lineDone")} ✓
          </button>
        </section>
      )}

      {phase === "proof" && (
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-stone-700 bg-stone-100 p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">{app.ui("proofTitle")}</div>
          <div className="flex flex-wrap justify-center font-serif text-4xl text-stone-900">
            {[...proof.text].map((ch, i) =>
              ch === " " ? (
                <span key={i} className="w-4" />
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => tapProof(i)}
                  className={`min-h-12 min-w-8 rounded px-0.5 hover:bg-amber-200 ${
                    cfg.hintAfter !== null && proofMisses >= 2 && i === proof.index ? "animate-pulse bg-amber-300" : ""
                  }`}
                >
                  {ch}
                </button>
              )
            )}
          </div>
          {message && <p className="text-lg font-semibold text-stone-700">{message}</p>}
        </section>
      )}

      {phase === "done" && (
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-700/60 bg-stone-900 p-5">
          <div className="text-5xl" aria-hidden>
            ✅
          </div>
          <div className="w-full max-w-xl rounded-lg bg-stone-100 p-3 font-mono text-xl whitespace-pre text-stone-900">
            {done.join("\n")}
          </div>
          <button
            type="button"
            onClick={() => onComplete(done)}
            className="min-h-14 rounded-xl bg-amber-500 px-10 text-lg font-bold text-stone-950"
          >
            {app.ui("finish")}
          </button>
        </section>
      )}
    </MinigameFrame>
  );
}
