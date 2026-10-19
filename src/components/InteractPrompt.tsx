import { Interactable } from "../game/world";
import { useApp } from "../AppContext";

interface InteractPromptProps {
  target: Interactable;
  onUse: () => void;
}

/**
 * Appears when the player is close to a station or character. A large button
 * works for touch and young players; desktop players can also press F.
 */
export default function InteractPrompt({ target, onUse }: InteractPromptProps) {
  const app = useApp();
  const label =
    target.kind === "npc"
      ? app.ui("talkTo", { name: app.pick(target.label) })
      : app.ui("useThing", { thing: app.pick(target.label) });

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-32 z-30 flex justify-center px-4">
      <button
        type="button"
        onClick={onUse}
        className="pointer-events-auto flex min-h-16 items-center gap-3 rounded-2xl border-2 border-amber-300 bg-amber-500 px-6 text-xl font-bold text-stone-950 shadow-2xl active:scale-95"
      >
        <span aria-hidden className="text-2xl">
          {target.kind === "npc" ? "💬" : "✋"}
        </span>
        {label}
        {app.inputMode === "mouse" && (
          <kbd className="rounded-md border border-stone-800 bg-stone-900 px-2 py-0.5 font-mono text-base text-amber-200">F</kbd>
        )}
      </button>
    </div>
  );
}
