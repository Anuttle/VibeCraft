import { useEffect, useMemo, useState } from "react";
import { useApp } from "../../AppContext";
import type { CopyConfig } from "../../game/activities";
import { format } from "../../i18n/types";
import { playSoundEffect } from "../../utils/mobs";
import MinigameFrame from "./MinigameFrame";
import { Feedback, FinishPanel, Panel } from "./shared";

interface CopyGameProps {
  cfg: CopyConfig;
  title: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

/** Copy text letter by letter, the way a scribe would, while a clock runs. */
export default function CopyGame({ cfg, title, icon, onComplete, onClose }: CopyGameProps) {
  const app = useApp();
  const text = cfg.lines.join("\n");
  const keys = useMemo(() => {
    const set = new Set<string>();
    for (const ch of text + cfg.distractors) if (ch !== " " && ch !== "\n") set.add(ch);
    return [...set].sort((a, b) => a.localeCompare(b, "es"));
  }, [text, cfg.distractors]);
  const hasSpace = text.includes(" ");

  const [pos, setPos] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const done = pos >= text.length;
  const letters = text.replace(/[\s]/g, "").length;

  useEffect(() => {
    if (startedAt === null || done) return;
    const id = setInterval(() => setElapsed(Math.round((Date.now() - startedAt) / 1000)), 250);
    return () => clearInterval(id);
  }, [startedAt, done]);

  const tap = (ch: string) => {
    if (done) return;
    if (startedAt === null) setStartedAt(Date.now());
    let expected = text[pos];
    let advance = 1;
    // Line breaks are skipped automatically.
    if (expected === "\n") {
      expected = text[pos + 1];
      advance = 2;
    }
    if (ch !== expected) {
      setFeedback(app.ui("notYet"));
      return;
    }
    setFeedback(null);
    const next = pos + advance;
    setPos(next);
    if (next >= text.length) {
      setElapsed(Math.max(1, Math.round((Date.now() - (startedAt ?? Date.now())) / 1000)));
      playSoundEffect("success");
    }
  };

  const report = format(cfg.report, { letters, seconds: elapsed });

  return (
    <MinigameFrame title={title} icon={icon} instruction={done ? report : cfg.instruction} onClose={onClose}>
      <Panel>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">{app.ui("copyThis")}</span>
          <span className="font-mono text-lg text-amber-200">⏱ {elapsed} s</span>
        </div>
        <div className="rounded-lg bg-[#efe3c4] p-4 font-serif text-3xl whitespace-pre-wrap text-stone-900">
          {[...text].map((ch, i) => (
            <span key={i} className={i < pos ? "text-stone-400" : i === pos ? "rounded bg-amber-300" : ""}>
              {ch}
            </span>
          ))}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">{app.ui("yourCopy")}</span>
        <div className="min-h-14 rounded-lg bg-[#f8f1df] p-4 font-serif text-3xl whitespace-pre-wrap text-amber-950 italic">
          {text.slice(0, pos) || " "}
        </div>
      </Panel>

      {done ? (
        <FinishPanel message={report} onFinish={onComplete} />
      ) : (
        <>
          <Feedback text={feedback} />
          <div className="flex flex-wrap justify-center gap-2">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => tap(k)}
                className="flex h-14 min-w-12 items-center justify-center rounded-lg border border-stone-500 bg-stone-200 px-2 font-serif text-2xl text-stone-900 active:scale-90"
              >
                {k}
              </button>
            ))}
          </div>
          {hasSpace && (
            <button
              type="button"
              onClick={() => tap(" ")}
              className="mx-auto min-h-14 w-64 rounded-xl border border-stone-500 bg-stone-300 text-lg font-bold text-stone-900 active:scale-95"
            >
              {app.ui("space")} ␣
            </button>
          )}
        </>
      )}
    </MinigameFrame>
  );
}
