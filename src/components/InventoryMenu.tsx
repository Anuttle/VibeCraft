import React, { useState, useEffect } from "react";
import { InventorySlot } from "../types";
import { ITEM_REGISTRY, Item, checkCraftingRecipe } from "../utils/items";
import { X, Trash2, ArrowRight } from "lucide-react";
import { useApp } from "../AppContext";

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
}: InventoryMenuProps) {
  const app = useApp();
  // Cursor item holds whatever slot the user has "lifted"
  const [cursorItem, setCursorItem] = useState<InventorySlot | null>(null);
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);

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

  // Handle slot clicks for main inventory and hotbar
  const handleSlotClick = (
    e: React.MouseEvent,
    type: "inventory" | "hotbar",
    index: number
  ) => {
    e.preventDefault();
    const isRightClick = e.button === 2;

    const list = type === "inventory" ? [...inventory] : [...hotbar];
    const updateList = type === "inventory" ? onInventoryChange : onHotbarChange;
    const currentSlot = list[index];

    // Case 1: Cursor is empty
    if (!cursorItem || cursorItem.itemId === "") {
      if (currentSlot.itemId === "") return; // Clicked an empty slot

      const itemDef = ITEM_REGISTRY[currentSlot.itemId];
      if (!itemDef) return;

      if (isRightClick && currentSlot.count > 1) {
        // Split stack (Right Click)
        const takeCount = Math.ceil(currentSlot.count / 2);
        const keepCount = currentSlot.count - takeCount;

        setCursorItem({ ...currentSlot, count: takeCount });
        setHoveredItem(itemDef);
        list[index] = { ...currentSlot, count: keepCount };
        updateList(list);
      } else {
        // Take entire stack (Left Click)
        setCursorItem({ ...currentSlot });
        setHoveredItem(itemDef);
        list[index] = { itemId: "", count: 0 };
        updateList(list);
      }
    }
    // Case 2: Cursor holds an item
    else {
      const cursorDef = ITEM_REGISTRY[cursorItem.itemId];
      if (!cursorDef) return;

      // Clicked an empty slot
      if (currentSlot.itemId === "") {
        if (isRightClick) {
          // Place 1 unit
          list[index] = { ...cursorItem, count: 1 };
          if (cursorItem.count > 1) {
            setCursorItem({ ...cursorItem, count: cursorItem.count - 1 });
          } else {
            setCursorItem(null);
          }
        } else {
          // Place entire stack
          list[index] = { ...cursorItem };
          setCursorItem(null);
        }
        updateList(list);
      }
      // Clicked slot with same item type (Stacking)
      else if (currentSlot.itemId === cursorItem.itemId) {
        const maxStack = cursorDef.maxStack || 64;
        if (isRightClick) {
          if (currentSlot.count < maxStack) {
            list[index].count += 1;
            if (cursorItem.count > 1) {
              setCursorItem({ ...cursorItem, count: cursorItem.count - 1 });
            } else {
              setCursorItem(null);
            }
            updateList(list);
          }
        } else {
          const spaceLeft = maxStack - currentSlot.count;
          if (spaceLeft > 0) {
            const transfer = Math.min(spaceLeft, cursorItem.count);
            list[index].count += transfer;
            if (cursorItem.count > transfer) {
              setCursorItem({ ...cursorItem, count: cursorItem.count - transfer });
            } else {
              setCursorItem(null);
            }
            updateList(list);
          }
        }
      }
      // Clicked slot with a different item (Swapping)
      else {
        if (!isRightClick) {
          const temp = { ...currentSlot };
          list[index] = { ...cursorItem };
          setCursorItem(temp);
          updateList(list);
        }
      }
    }
  };

  // Handle slot clicks inside 2x2 Crafting Grid
  const handleCraftingSlotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const isRightClick = e.button === 2;
    const gridCopy = [...craftingGrid];
    const currentSlot = gridCopy[index];

    if (!cursorItem || cursorItem.itemId === "") {
      if (currentSlot.itemId === "") return;
      if (isRightClick && currentSlot.count > 1) {
        const takeCount = Math.ceil(currentSlot.count / 2);
        const keepCount = currentSlot.count - takeCount;
        setCursorItem({ ...currentSlot, count: takeCount });
        gridCopy[index] = { ...currentSlot, count: keepCount };
      } else {
        setCursorItem({ ...currentSlot });
        gridCopy[index] = { itemId: "", count: 0 };
      }
      setCraftingGrid(gridCopy);
    } else {
      if (currentSlot.itemId === "") {
        if (isRightClick) {
          gridCopy[index] = { ...cursorItem, count: 1 };
          if (cursorItem.count > 1) {
            setCursorItem({ ...cursorItem, count: cursorItem.count - 1 });
          } else {
            setCursorItem(null);
          }
        } else {
          gridCopy[index] = { ...cursorItem };
          setCursorItem(null);
        }
        setCraftingGrid(gridCopy);
      } else if (currentSlot.itemId === cursorItem.itemId) {
        const maxStack = ITEM_REGISTRY[cursorItem.itemId]?.maxStack || 64;
        if (isRightClick) {
          if (currentSlot.count < maxStack) {
            gridCopy[index].count += 1;
            if (cursorItem.count > 1) {
              setCursorItem({ ...cursorItem, count: cursorItem.count - 1 });
            } else {
              setCursorItem(null);
            }
            setCraftingGrid(gridCopy);
          }
        } else {
          const spaceLeft = maxStack - currentSlot.count;
          if (spaceLeft > 0) {
            const transfer = Math.min(spaceLeft, cursorItem.count);
            gridCopy[index].count += transfer;
            if (cursorItem.count > transfer) {
              setCursorItem({ ...cursorItem, count: cursorItem.count - transfer });
            } else {
              setCursorItem(null);
            }
            setCraftingGrid(gridCopy);
          }
        }
      } else {
        if (!isRightClick) {
          const temp = { ...currentSlot };
          gridCopy[index] = { ...cursorItem };
          setCursorItem(temp);
          setCraftingGrid(gridCopy);
        }
      }
    }
  };

  // Handle clicking the craft result preview slot
  const handleCraftingResultClick = (e: React.MouseEvent) => {
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
            <span className="text-xl filter drop-shadow group-hover:scale-110 transition-transform duration-100">
              {item.emoji}
            </span>
            {slot.count > 1 && (
              <span className="absolute bottom-1 right-1 bg-slate-900/90 border border-slate-800 text-[10px] text-emerald-400 font-mono font-bold px-1 rounded min-w-[16px] text-center shadow-sm">
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
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md pointer-events-auto">
      {/* Inventory Panel Container */}
      <div 
        onContextMenu={(e) => e.preventDefault()}
        className="relative bg-stone-900/95 border border-stone-700 rounded-2xl w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 shadow-2xl flex flex-col gap-4 text-slate-100 font-sans"
      >
        {/* Close Button & Title */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex flex-col">
            <h2 className="text-lg font-extrabold tracking-wide text-slate-100 flex items-center gap-2">
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
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                {app.ui("craft")}
              </span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[9px] font-mono">
                <button
                  type="button"
                  onClick={() => setIs3x3Mode(false)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    !is3x3Mode
                      ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
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
                      ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
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
                        <span className="text-lg">{item.emoji}</span>
                        {slot.count > 1 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-slate-950 text-[9px] text-emerald-400 font-mono font-bold px-0.5 rounded">
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
              <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider font-mono">{app.ui("result")}</span>
              <div
                onPointerDown={handleCraftingResultClick}
                onPointerEnter={() => craftResultDef && setHoveredItem(craftResultDef)}
                
                className={`w-14 h-14 rounded-xl border flex items-center justify-center select-none transition-all cursor-pointer ${
                  craftResultDef
                    ? "bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-105"
                    : "bg-slate-950/40 border-slate-800/50 opacity-40 cursor-not-allowed"
                }`}
              >
                {craftResultDef && (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <span className="text-2xl filter drop-shadow">{craftResultDef.emoji}</span>
                    <span className="absolute bottom-1 right-1 bg-slate-950 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono font-black px-1 rounded shadow">
                      {craftResult?.count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono flex flex-col gap-0.5 max-w-[160px] border-l border-slate-800/60 pl-3">
            <span className="text-slate-300 font-bold">{app.ui("recipes")}</span>
            <span>• {app.ui("recipePlanks")}</span>
            <span>• {app.ui("recipeSticks")}</span>
            <span>• {app.ui("recipeTable")}</span>
            <span>• {app.ui("recipePick")}</span>
            <span>• {app.ui("recipeTorch")}</span>
          </div>
        </div>

        {/* Content Section: 27 Slots Grid */}
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 font-mono">{app.ui("bagSection")}</h3>
            <div className="grid grid-cols-9 gap-1.5 p-2.5 bg-slate-950/40 border border-slate-800/50 rounded-xl">
              {Array.from({ length: 27 }).map((_, i) => renderSlot("inventory", i))}
            </div>
          </div>

          {/* Hotbar Section */}
          <div>
            <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 font-mono">{app.ui("hotbarSection")}</h3>
            <div className="grid grid-cols-9 gap-1.5 p-2.5 bg-slate-950/60 border border-emerald-500/15 rounded-xl shadow-lg shadow-emerald-500/5">
              {Array.from({ length: 9 }).map((_, i) => renderSlot("hotbar", i))}
            </div>
          </div>
        </div>

        {/* Bottom Panel: Interactive Info & Trash Area */}
        <div className="flex justify-between items-center bg-slate-950/40 border border-slate-800/40 rounded-xl p-3 text-xs">
          {/* Hovered item information */}
          <div className="flex-1 flex items-center gap-3 pr-4">
            {hoveredItem ? (
              <>
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
                  {hoveredItem.emoji}
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
            <span className="font-bold font-mono text-[10px] uppercase tracking-wide">
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
      <div className="relative w-11 h-11 bg-slate-900/90 border-2 border-emerald-400 rounded-lg shadow-2xl flex items-center justify-center">
        <span className="text-2xl">{item.emoji}</span>
        {count > 1 && (
          <span className="absolute bottom-0.5 right-1 bg-slate-950 text-[10px] text-emerald-400 font-mono font-bold px-1 rounded shadow">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}
