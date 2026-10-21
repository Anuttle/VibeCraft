import React, { useState, useEffect } from "react";
import { InventorySlot } from "../types";
import { ITEM_REGISTRY, Item, checkCraftingRecipe } from "../utils/items";
import { X, Trash2, ArrowRight } from "lucide-react";
import { useApp } from "../AppContext";
import { TakeMode, tapSlot } from "../game/inventory";
import ItemIcon from "./ItemIcon";

// Last pointer position, so a held item appears under the finger right away on
// touch screens (there is no hover movement before the first tap).
const lastPointer = { x: 0, y: 0 };

interface InventoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventorySlot[];
  hotbar: InventorySlot[];
  onInventoryChange: (newInv: InventorySlot[]) => void;
  onHotbarChange: (newHotbar: InventorySlot[]) => void;
  onDropItem: (itemId: string, count: number) => void;
  isCraftingTableOpen?: boolean;
  onCrafted?: (itemId: string, count: number) => void;
  /** Shown at the top of the panel, e.g. the current goal. */
  banner?: React.ReactNode;
  /** Free build: items a tap hands out as a full stack. */
  supply?: string[];
}

export default function InventoryMenu({
  isOpen,
  onClose,
  inventory,
  hotbar,
  onInventoryChange,
  onHotbarChange,
  onDropItem,
  isCraftingTableOpen = false,
  onCrafted,
  banner,
  supply,
}: InventoryMenuProps) {
  const app = useApp();
  // Cursor item holds whatever slot the user has "lifted"
  const [cursorItem, setCursorItem] = useState<InventorySlot | null>(null);
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const [takeMode, setTakeMode] = useState<TakeMode>("all");

  // 3x3 / 2x2 Crafting Grid Mode
  const [is3x3Mode, setIs3x3Mode] = useState<boolean>(isCraftingTableOpen);

  // 9-slot Crafting Grid state
  const [craftingGrid, setCraftingGrid] = useState<InventorySlot[]>(() =>
    Array.from({ length: 9 }, () => ({ itemId: "", count: 0 }))
  );

  // Sync crafting mode when opened
  useEffect(() => {
    if (isOpen) {
      setIs3x3Mode(isCraftingTableOpen);
    }
  }, [isOpen, isCraftingTableOpen]);

  // Evaluate current active crafting recipe based on active grid size
  const activeGrid = is3x3Mode ? craftingGrid : craftingGrid.slice(0, 4);
  const craftResult = checkCraftingRecipe(activeGrid.map((s) => s.itemId));
  const craftResultDef = craftResult ? ITEM_REGISTRY[craftResult.itemId] : null;

  useEffect(() => {
    if (!isOpen) return;
    const track = (e: PointerEvent) => {
      lastPointer.x = e.clientX;
      lastPointer.y = e.clientY;
    };
    window.addEventListener("pointerdown", track, true);
    return () => window.removeEventListener("pointerdown", track, true);
  }, [isOpen]);

  // Prevent game keys from registering when typing or navigating inventory
  useEffect(() => {
    if (isOpen) {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    // Return any items in crafting grid to ground/inventory
    craftingGrid.forEach((slot) => {
      if (slot.itemId && slot.count > 0) {
        onDropItem(slot.itemId, slot.count);
      }
    });
    setCraftingGrid(Array.from({ length: 9 }, () => ({ itemId: "", count: 0 })));

    if (cursorItem && cursorItem.itemId) {
      onDropItem(cursorItem.itemId, cursorItem.count);
      setCursorItem(null);
    }
    onClose();
  };

  // A tap moves what the Take switch says. A right-click (mouse) always picks up
  // half a stack or puts down one item, whatever the switch is set to.
  const modesFor = (e: React.PointerEvent): [TakeMode, TakeMode] =>
    e.button === 2 ? ["half", "one"] : [takeMode, takeMode];

  // Handle slot clicks for main inventory and hotbar
  const handleSlotClick = (e: React.PointerEvent, type: "inventory" | "hotbar", index: number) => {
    e.preventDefault();
    const list = type === "inventory" ? [...inventory] : [...hotbar];
    const updateList = type === "inventory" ? onInventoryChange : onHotbarChange;
    const [pick, place] = modesFor(e);
    const result = tapSlot(list[index], cursorItem, pick, place);
    if (result.slot === list[index] && result.cursor === cursorItem) return;
    list[index] = result.slot;
    updateList(list);
    setCursorItem(result.cursor);
    if (result.cursor) setHoveredItem(ITEM_REGISTRY[result.cursor.itemId] ?? null);
  };

  // Handle slot clicks inside the crafting grid
  const handleCraftingSlotClick = (e: React.PointerEvent, index: number) => {
    e.preventDefault();
    const [pick, place] = modesFor(e);
    const result = tapSlot(craftingGrid[index], cursorItem, pick, place);
    if (result.slot === craftingGrid[index] && result.cursor === cursorItem) return;
    const gridCopy = [...craftingGrid];
    gridCopy[index] = result.slot;
    setCraftingGrid(gridCopy);
    setCursorItem(result.cursor);
  };

  // Handle clicking the craft result preview slot
  const handleCraftingResultClick = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!craftResult || !craftResultDef) return;

    const maxStack = craftResultDef.maxStack || 64;

    // Check cursor compatibility
    if (
      cursorItem &&
      cursorItem.itemId !== "" &&
      cursorItem.itemId !== craftResult.itemId
    ) {
      return; // cannot stack different item on cursor
    }

    if (
      cursorItem &&
      cursorItem.itemId === craftResult.itemId &&
      cursorItem.count + craftResult.count > maxStack
    ) {
      return; // exceeds max stack
    }

    // Craft item! Add to cursor
    const newCount = (cursorItem?.count || 0) + craftResult.count;
    const dur = craftResultDef.type === "tool" ? craftResultDef.maxDurability : undefined;
    setCursorItem({ itemId: craftResult.itemId, count: newCount, durability: dur });
    onCrafted?.(craftResult.itemId, craftResult.count);

    // Deduct 1 unit from each ingredient slot in crafting grid
    setCraftingGrid((prev) =>
      prev.map((slot, idx) => {
        const maxIdx = is3x3Mode ? 9 : 4;
        if (idx >= maxIdx || !slot.itemId) return slot;
        const remaining = slot.count - 1;
        return remaining > 0 ? { ...slot, count: remaining } : { itemId: "", count: 0 };
      })
    );
  };

  // Free-build supply: a tap lifts a full stack (or tops up the same item).
  const takeFromSupply = (itemId: string) => {
    const def = ITEM_REGISTRY[itemId];
    if (!def) return;
    if (cursorItem && cursorItem.itemId !== "" && cursorItem.itemId !== itemId) return;
    setCursorItem({ itemId, count: def.maxStack || 64 });
    setHoveredItem(def);
  };

  // Drop cursor item to ground
  const handleDropCursorItem = () => {
    if (cursorItem && cursorItem.itemId !== "") {
      onDropItem(cursorItem.itemId, cursorItem.count);
      setCursorItem(null);
    }
  };

  // Render a standard item slot
  const renderSlot = (type: "inventory" | "hotbar", index: number) => {
    const slot = type === "inventory" ? inventory[index] : hotbar[index];
    const item = slot.itemId ? ITEM_REGISTRY[slot.itemId] : null;

    return (
      <div
        key={`${type}-${index}`}
        onPointerDown={(e) => handleSlotClick(e, type, index)}
        onPointerEnter={() => item && setHoveredItem(item)}
        
        onContextMenu={(e) => e.preventDefault()}
        className={`relative w-12 h-12 rounded-lg bg-slate-950/80 border flex items-center justify-center cursor-pointer select-none transition-all duration-150 group ${
          item
            ? "border-slate-800 hover:border-slate-600 hover:bg-slate-900 shadow-md"
            : "border-slate-900/60 hover:bg-slate-900/20"
        }`}
      >
        {item && (
          <div className="relative flex items-center justify-center w-full h-full p-1.5">
            <div 
              className="absolute inset-1 rounded-md opacity-10" 
              style={{ backgroundColor: item.color }}
            />
            <ItemIcon item={item} className="relative text-xl drop-shadow group-hover:scale-110 transition-transform duration-100" />
            {slot.count > 1 && (
              <span className="absolute bottom-1 right-1 bg-slate-900/90 border border-slate-800 text-xs text-stone-100 font-bold px-1 rounded min-w-[16px] text-center shadow-sm">
                {slot.count}
              </span>
            )}
            {/* Tool Durability Bar */}
            {item.maxDurability && (
              <div className="absolute bottom-0.5 left-1 right-1 h-1 bg-slate-950/90 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${
                    ((slot.durability ?? item.maxDurability) / item.maxDurability) > 0.5
                      ? "bg-emerald-400"
                      : ((slot.durability ?? item.maxDurability) / item.maxDurability) > 0.2
                      ? "bg-amber-400"
                      : "bg-rose-500"
                  }`}
                  style={{
                    width: `${Math.max(0, Math.min(100, ((slot.durability ?? item.maxDurability) / item.maxDurability) * 100))}%`,
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 pointer-events-auto">
      {/* Inventory Panel Container */}
      <div 
        onContextMenu={(e) => e.preventDefault()}
        className="relative bg-stone-900/95 border border-stone-700 rounded-lg w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 shadow-2xl flex flex-col gap-4 text-slate-100 font-sans"
      >
        {/* Close Button & Title */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex flex-col">
            <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              {is3x3Mode ? `🪵 ${app.ui("craftingTableTitle")}` : `🎒 ${app.ui("bagTitle")}`}
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label={app.ui("close")}
            className="h-11 w-11 flex items-center justify-center p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {banner}

        {/* Crafting Grid Section */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-md p-3 flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-400">
                {app.ui("craft")}
              </span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setIs3x3Mode(false)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    !is3x3Mode
                      ? "bg-amber-500/20 text-amber-200 font-bold border border-amber-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  2x2
                </button>
                <button
                  type="button"
                  onClick={() => setIs3x3Mode(true)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    is3x3Mode
                      ? "bg-amber-500/20 text-amber-200 font-bold border border-amber-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  3x3
                </button>
              </div>
            </div>

            <div className={`grid gap-1.5 ${is3x3Mode ? "grid-cols-3" : "grid-cols-2"}`}>
              {(is3x3Mode ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [0, 1, 2, 3]).map((idx) => {
                const slot = craftingGrid[idx];
                const item = slot.itemId ? ITEM_REGISTRY[slot.itemId] : null;

                return (
                  <div
                    key={`craft-${idx}`}
                    onPointerDown={(e) => handleCraftingSlotClick(e, idx)}
                    onPointerEnter={() => item && setHoveredItem(item)}
                    
                    className={`w-11 h-11 rounded-lg bg-slate-900/90 border flex items-center justify-center cursor-pointer select-none transition-all ${
                      item
                        ? "border-slate-700 hover:border-slate-500 bg-slate-850 shadow"
                        : "border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/40"
                    }`}
                  >
                    {item && (
                      <div className="relative flex items-center justify-center w-full h-full">
                        <ItemIcon item={item} className="text-lg" />
                        {slot.count > 1 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-slate-950 text-xs text-stone-100 font-bold px-0.5 rounded">
                            {slot.count}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ArrowRight className="w-5 h-5 text-slate-600" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-stone-100">{app.ui("result")}</span>
              <div
                onPointerDown={handleCraftingResultClick}
                onPointerEnter={() => craftResultDef && setHoveredItem(craftResultDef)}
                
                className={`w-14 h-14 rounded-md border flex items-center justify-center select-none transition-all cursor-pointer ${
                  craftResultDef
                    ? "bg-amber-950/40 border-amber-500/50 shadow-lg scale-105"
                    : "bg-slate-950/40 border-slate-800/50 opacity-40 cursor-not-allowed"
                }`}
              >
                {craftResultDef && (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <ItemIcon item={craftResultDef} className="text-2xl drop-shadow" />
                    <span className="absolute bottom-1 right-1 bg-slate-950 border border-amber-500/40 text-xs text-amber-200 font-black px-1 rounded shadow">
                      {craftResult?.count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex flex-col gap-0.5 max-w-[160px] border-l border-slate-800/60 pl-3">
            <span className="text-slate-300 font-bold">{app.ui("recipes")}</span>
            <span>• {app.ui("recipePlanks")}</span>
            <span>• {app.ui("recipeSticks")}</span>
            <span>• {app.ui("recipeTable")}</span>
            <span>• {app.ui("recipePick")}</span>
            <span>• {app.ui("recipeTorch")}</span>
          </div>
        </div>

        {supply && supply.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 mb-1.5">{app.ui("supply")}</h3>
            <p className="mb-1.5 text-xs text-slate-400">{app.ui("supplyNote")}</p>
            <div className="grid grid-cols-9 gap-1.5 p-2.5 bg-slate-950/40 border border-slate-800/50 rounded-md">
              {supply.map((id) => {
                const item = ITEM_REGISTRY[id];
                if (!item) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={app.itemName(id, item.name)}
                    onClick={() => takeFromSupply(id)}
                    className="relative w-12 h-12 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center text-xl"
                  >
                    <span className="absolute inset-1 rounded-md opacity-20" style={{ backgroundColor: item.color }} />
                    <ItemIcon item={item} className="relative" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Take switch: how much one tap moves. Touch screens have no right-click. */}
        <div className="flex items-center gap-2" role="radiogroup" aria-label={app.ui("take")}>
          <span className="text-xs font-bold text-slate-400">{app.ui("take")}</span>
          {(["all", "half", "one"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={takeMode === m}
              onClick={() => setTakeMode(m)}
              className={`min-h-11 rounded-lg border px-4 text-sm font-bold ${
                takeMode === m
                  ? "border-amber-400 bg-amber-500/20 text-amber-100"
                  : "border-slate-700 bg-slate-900 text-slate-300"
              }`}
            >
              {app.ui(m === "all" ? "takeAll" : m === "half" ? "takeHalf" : "takeOne")}
            </button>
          ))}
        </div>

        {/* Content Section: 27 Slots Grid */}
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-400 mb-1.5">{app.ui("bagSection")}</h3>
            <div className="grid grid-cols-9 gap-1.5 p-2.5 bg-slate-950/40 border border-slate-800/50 rounded-md">
              {Array.from({ length: 27 }).map((_, i) => renderSlot("inventory", i))}
            </div>
          </div>

          {/* Hotbar Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 mb-1.5">{app.ui("hotbarSection")}</h3>
            <div className="grid grid-cols-9 gap-1.5 p-2.5 bg-slate-950/60 border border-amber-500/15 rounded-md shadow-lg">
              {Array.from({ length: 9 }).map((_, i) => renderSlot("hotbar", i))}
            </div>
          </div>
        </div>

        {/* Bottom Panel: Interactive Info & Trash Area */}
        <div className="flex justify-between items-center bg-slate-950/40 border border-slate-800/40 rounded-md p-3 text-xs">
          {/* Hovered item information */}
          <div className="flex-1 flex items-center gap-3 pr-4">
            {hoveredItem ? (
              <>
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
                  <ItemIcon item={hoveredItem} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{app.itemName(hoveredItem.id, hoveredItem.name)}</h4>
                </div>
              </>
            ) : (
              <span className="text-slate-500 italic">{app.ui("tapItem")}</span>
            )}
          </div>

          {/* World Item Drop Target Slot */}
          <button
            onClick={handleDropCursorItem}
            className={`h-11 px-4 rounded-lg flex items-center gap-2 border transition-all cursor-pointer ${
              cursorItem
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50"
                : "bg-slate-900/40 border-slate-800/80 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span className="font-bold text-xs">
              {cursorItem ? app.ui("drop", { n: cursorItem.count }) : app.ui("dropSlot")}
            </span>
          </button>
        </div>
      </div>

      {/* Floating item attached to mouse cursor while moving/dragging */}
      {cursorItem && cursorItem.itemId && (
        <CursorTracker item={ITEM_REGISTRY[cursorItem.itemId]} count={cursorItem.count} />
      )}
    </div>
  );
}

// Utility component to make the floating item perfectly follow mouse pointer
function CursorTracker({ item, count }: { item: Item; count: number }) {
  const [coords, setCoords] = useState({ x: lastPointer.x, y: lastPointer.y });

  useEffect(() => {
    const updatePointer = (e: PointerEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("pointerdown", updatePointer);
    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", updatePointer);
    };
  }, []);

  if (!item) return null;

  return (
    <div
      className="fixed pointer-events-none z-[100] w-12 h-12 flex items-center justify-center select-none"
      style={{
        left: coords.x - 24,
        top: coords.y - 24,
      }}
    >
      <div className="relative w-11 h-11 bg-slate-900/90 border-2 border-amber-400 rounded-lg shadow-2xl flex items-center justify-center">
        <ItemIcon item={item} className="text-2xl" />
        {count > 1 && (
          <span className="absolute bottom-0.5 right-1 bg-slate-950 text-xs text-stone-100 font-bold px-1 rounded shadow">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}
