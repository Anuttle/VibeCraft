import { useMemo, useState } from "react";
import { useApp } from "../../AppContext";
import { shuffleOutOfOrder } from "../../game/typesetting";
import { playSoundEffect } from "../../utils/mobs";
import MinigameFrame from "./MinigameFrame";
import { Feedback, FinishPanel, Panel, useShuffleSeed } from "./shared";

interface OrderPickerProps {
  /** In the correct order. */
  items: Array<{ text: string; emoji?: string }>;
  /** Highlight the next item after this many wrong taps; null for never. */
  hintAfter: number | null;
  onDone: (mistakes: number) => void;
}

/** Tap items in the right order. Shared by the sequence activity and quiz "order" items. */
export function OrderPicker({ items, hintAfter, onDone }: OrderPickerProps) {
  const app = useApp();
  const seed = useShuffleSeed();
  const shuffled = useMemo(
    () => shuffleOutOfOrder(items.map((it, i) => ({ ...it, i })), items.map((i) => i.text).join("|") + seed),
    [items, seed]
  );
  const [placed, setPlaced] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [totalMisses, setTotalMisses] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const next = placed.length;

  const tap = (i: number) => {
    if (placed.includes(i)) return;
    if (i !== next) {
      setMisses((m) => m + 1);
      setTotalMisses((m) => m + 1);
      setFeedback(app.ui("notYet"));
      return;
    }
    playSoundEffect("pickup");
    setFeedback(null);
    setMisses(0);
    const nowPlaced = [...placed, i];
    setPlaced(nowPlaced);
    if (nowPlaced.length === items.length) onDone(totalMisses);
  };

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col gap-2">
        {placed.map((i, n) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-emerald-700/60 bg-emerald-950/40 p-3 text-lg text-stone-100">
            <span className="font-mono text-emerald-300">{n + 1}.</span>
            {items[i].emoji && <span aria-hidden>{items[i].emoji}</span>}
            {items[i].text}
          </li>
        ))}
      </ol>
      <Feedback text={feedback} />
      <div className="grid gap-2 sm:grid-cols-2">
        {shuffled
          .filter((it) => !placed.includes(it.i))
          .map((it) => (
            <button
              key={it.i}
              type="button"
              onClick={() => tap(it.i)}
              className={`flex min-h-16 items-center gap-3 rounded-xl border border-stone-600 bg-stone-800 p-3 text-left text-lg text-stone-100 active:scale-[0.98] ${
                hintAfter !== null && misses >= hintAfter && it.i === next ? "animate-pulse ring-4 ring-amber-400" : ""
              }`}
            >
              {it.emoji && (
                <span className="text-3xl" aria-hidden>
                  {it.emoji}
                </span>
              )}
              {it.text}
            </button>
          ))}
      </div>
    </div>
  );
}

interface SequenceGameProps {
  cfg: { instruction: string; items: Array<{ text: string; emoji: string }>; success: string };
  title: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

export default function SequenceGame({ cfg, title, icon, onComplete, onClose }: SequenceGameProps) {
  const app = useApp();
  const [done, setDone] = useState(false);
  return (
    <MinigameFrame
      title={title}
      icon={icon}
      instruction={done ? cfg.success : cfg.instruction}
      speakText={done ? cfg.success : app.band === "K-2" ? `${cfg.instruction} ${cfg.items.map((i) => i.text).join(". ")}` : undefined}
      onClose={onClose}
    >
      {done ? (
        <FinishPanel message={cfg.success} onFinish={onComplete} />
      ) : (
        <Panel>
          <OrderPicker
            items={cfg.items}
            hintAfter={app.band === "K-2" ? 1 : app.band === "3-5" ? 2 : null}
            onDone={() => {
              playSoundEffect("success");
              setDone(true);
            }}
          />
        </Panel>
      )}
    </MinigameFrame>
  );
}
