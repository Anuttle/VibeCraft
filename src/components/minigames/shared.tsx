import React, { useState } from "react";
import { useApp } from "../../AppContext";

/**
 * A random seed fixed for as long as an activity stays open, so answer choices
 * land in a new place each time it opens but don't jump around mid-question.
 */
export function useShuffleSeed(): string {
  const [seed] = useState(() => Math.random().toString(36).slice(2));
  return seed;
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-14 rounded-xl bg-amber-500 px-8 text-lg font-bold text-stone-950 shadow-lg active:scale-95 disabled:opacity-30 ${className}`}
    >
      {children}
    </button>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`flex flex-col gap-4 rounded-2xl border border-stone-700 bg-stone-900 p-4 ${className}`}>{children}</section>;
}

export function Feedback({ text, good }: { text: string | null; good?: boolean }) {
  if (!text) return null;
  return (
    <p className={`text-center text-lg font-semibold ${good ? "text-emerald-300" : "text-amber-300"}`} role="status">
      {text}
    </p>
  );
}

/** Success message and the Finish button shown at the end of an activity. */
export function FinishPanel({ message, onFinish, children }: { message: string; onFinish: () => void; children?: React.ReactNode }) {
  const app = useApp();
  return (
    <Panel className="items-center border-emerald-700/60 text-center">
      <div className="text-5xl" aria-hidden>
        ✅
      </div>
      <p className="text-xl font-semibold text-stone-100">{message}</p>
      {children}
      <PrimaryButton onClick={onFinish}>{app.ui("finish")}</PrimaryButton>
    </Panel>
  );
}

/** A 0-100 meter with an optional green target zone. */
export function Meter({ label, value, zone }: { label: string; value: number; zone: [number, number] | null }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-sm font-semibold text-stone-200">
        <span>{label}</span>
        <span className="font-mono">{Math.round(value)}</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-stone-600 bg-stone-800">
        {zone && (
          <div className="absolute inset-y-0 bg-emerald-500/40" style={{ left: `${zone[0]}%`, width: `${zone[1] - zone[0]}%` }} aria-hidden />
        )}
        <div className="absolute inset-y-0 left-0 bg-amber-400/90" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}
