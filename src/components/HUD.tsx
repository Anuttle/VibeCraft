import { HelpCircle } from "lucide-react";
import { InventorySlot } from "../types";
import { ITEM_REGISTRY } from "../utils/items";
import { useApp } from "../AppContext";
import ItemIcon from "./ItemIcon";

interface HUDProps {
  showCrosshair: boolean;
  activeSlotIndex: number;
  onActiveSlotIndexChange: (idx: number) => void;
  hotbar: InventorySlot[];
}

export default function HUD({ showCrosshair, activeSlotIndex, onActiveSlotIndexChange, hotbar }: HUDProps) {
  const app = useApp();
  const activeSlot = hotbar[activeSlotIndex];
  const activeItemName = activeSlot?.itemId ? app.itemName(activeSlot.itemId, activeSlot.itemId) : app.ui("hand");
  const isTouch = app.inputMode === "touch";

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-4">
      {showCrosshair && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-6 w-6 items-center justify-center">
            <div className="absolute h-[2px] w-5 rounded-full bg-white opacity-80 mix-blend-difference" />
            <div className="absolute h-5 w-[2px] rounded-full bg-white opacity-80 mix-blend-difference" />
          </div>
        </div>
      )}

      <div className="flex w-full items-end justify-center gap-6">
        <div className="pointer-events-auto flex flex-col items-center gap-1.5">
          <div className="rounded-full border border-stone-700 bg-stone-950/85 px-3 py-1 shadow-md">
            <span className="text-sm font-bold text-stone-100">{activeItemName}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-900/80 p-2 shadow-2xl">
            {hotbar.map((slot, idx) => {
              const isSelected = idx === activeSlotIndex;
              const def = slot.itemId ? ITEM_REGISTRY[slot.itemId] : null;
              const name = slot.itemId ? app.itemName(slot.itemId, slot.itemId) : "";
              const durability = def?.maxDurability ? (slot.durability ?? def.maxDurability) / def.maxDurability : null;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onActiveSlotIndexChange(idx)}
                  aria-label={name || `${idx + 1}`}
                  className={`relative flex items-center justify-center rounded-md transition-all ${
                    isTouch ? "h-14 w-14" : "h-12 w-12"
                  } ${
                    isSelected
                      ? "-translate-y-1 scale-110 border-2 border-amber-400 bg-stone-800 shadow-lg"
                      : "border border-stone-700 bg-stone-950/50"
                  }`}
                >
                  {def ? (
                    <span className="relative text-xl">
                      <ItemIcon item={def} />
                      {slot.count > 1 && (
                        <span className="absolute -bottom-2 -right-3 rounded-sm border border-stone-600 bg-stone-950 px-1 text-xs font-black text-white">
                          {slot.count}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="h-6 w-6 rounded-md border border-dashed border-stone-700/50" />
                  )}
                  {durability !== null && (
                    <span className="absolute bottom-1 left-1.5 right-1.5 h-1 overflow-hidden rounded-full bg-stone-950">
                      <span
                        className={`block h-full ${
                          durability > 0.5 ? "bg-emerald-400" : durability > 0.2 ? "bg-amber-400" : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, durability * 100))}%` }}
                      />
                    </span>
                  )}
                  {!isTouch && (
                    <span className="absolute left-1 top-0.5 text-[10px] font-bold text-stone-500">{idx + 1}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {!isTouch && (
        <div className="pointer-events-auto absolute bottom-4 right-4 hidden w-56 flex-col gap-1.5 rounded-md border border-stone-700 bg-stone-900/75 p-3 text-xs text-stone-300 shadow-lg lg:flex">
          <span className="mb-0.5 flex items-center gap-1.5 text-[11px] font-bold text-stone-400">
            <HelpCircle className="h-3.5 w-3.5" /> {app.ui("controls")}
          </span>
          {(
            [
              ["W A S D", "ctrlMove"],
              [app.ui("keyMouse"), "ctrlLook"],
              [app.ui("keyLeftClick"), "ctrlBreak"],
              [app.ui("keyRightClick"), "ctrlPlace"],
              ["E", "ctrlBag"],
              ["Esc", "ctrlPause"],
            ] as const
          ).map(([key, label]) => (
            <div key={label} className="flex items-center justify-between">
              <span className=" text-stone-400">{key}</span>
              <span className="rounded border border-stone-700 bg-stone-800 px-1.5 py-0.5 text-stone-100">
                {app.ui(label)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
