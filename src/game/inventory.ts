import { InventorySlot } from "../types";
import { ITEM_REGISTRY } from "../utils/items";

export interface PlayerInventory {
  hotbar: InventorySlot[];
  inventory: InventorySlot[];
}

export function emptyInventory(): PlayerInventory {
  return {
    hotbar: Array.from({ length: 9 }, () => ({ itemId: "", count: 0 })),
    inventory: Array.from({ length: 27 }, () => ({ itemId: "", count: 0 })),
  };
}

/**
 * Add items, filling existing stacks first (hotbar, then bag), then empty slots.
 * Returns the new inventory and how many items did not fit.
 */
export function addItem(
  inv: PlayerInventory,
  itemId: string,
  count: number
): { inv: PlayerInventory; remaining: number } {
  const hotbar = inv.hotbar.map((s) => ({ ...s }));
  const inventory = inv.inventory.map((s) => ({ ...s }));
  const def = ITEM_REGISTRY[itemId];
  if (!def) return { inv, remaining: count };
  const maxStack = def.maxStack ?? 64;
  let remaining = count;

  for (const list of [hotbar, inventory]) {
    for (const slot of list) {
      if (remaining === 0) break;
      if (slot.itemId === itemId && slot.count < maxStack) {
        const moved = Math.min(maxStack - slot.count, remaining);
        slot.count += moved;
        remaining -= moved;
      }
    }
  }

  for (const list of [hotbar, inventory]) {
    for (let i = 0; i < list.length && remaining > 0; i++) {
      if (list[i].itemId === "") {
        const moved = Math.min(maxStack, remaining);
        list[i] = {
          itemId,
          count: moved,
          durability: def.type === "tool" ? def.maxDurability : undefined,
        };
        remaining -= moved;
      }
    }
  }

  return { inv: { hotbar, inventory }, remaining };
}

/** Remove one item from a hotbar slot. */
export function consumeHotbarItem(inv: PlayerInventory, slotIndex: number): PlayerInventory {
  const hotbar = inv.hotbar.map((s) => ({ ...s }));
  const slot = hotbar[slotIndex];
  if (slot && slot.count > 0) {
    slot.count--;
    if (slot.count === 0) hotbar[slotIndex] = { itemId: "", count: 0 };
  }
  return { ...inv, hotbar };
}

/** Wear down a tool by one use; it breaks at zero. */
export function wearTool(inv: PlayerInventory, slotIndex: number): PlayerInventory {
  const hotbar = inv.hotbar.map((s) => ({ ...s }));
  const slot = hotbar[slotIndex];
  const def = slot?.itemId ? ITEM_REGISTRY[slot.itemId] : null;
  if (!def || def.type !== "tool") return inv;
  const max = def.maxDurability ?? 60;
  const next = (slot.durability ?? max) - 1;
  hotbar[slotIndex] = next <= 0 ? { itemId: "", count: 0 } : { ...slot, durability: next };
  return { ...inv, hotbar };
}

/** How much a tap on a slot moves: the whole stack, half of it, or one item. */
export type TakeMode = "all" | "half" | "one";

const EMPTY: InventorySlot = { itemId: "", count: 0 };

const portion = (n: number, mode: TakeMode) => (mode === "all" ? n : mode === "half" ? Math.ceil(n / 2) : 1);

/**
 * One tap on a slot while `cursor` holds what the player has lifted. Picking up
 * takes `pickMode` from the slot; putting down drops `placeMode` from the cursor
 * (merging into a matching stack, up to its limit). A different item swaps
 * places, but only when moving whole stacks. Returns the new slot and cursor.
 */
export function tapSlot(
  slot: InventorySlot,
  cursor: InventorySlot | null,
  pickMode: TakeMode,
  placeMode: TakeMode
): { slot: InventorySlot; cursor: InventorySlot | null } {
  const holding = cursor && cursor.itemId !== "" && cursor.count > 0 ? cursor : null;

  if (!holding) {
    if (slot.itemId === "" || slot.count <= 0) return { slot, cursor: null };
    const take = portion(slot.count, pickMode);
    const left = slot.count - take;
    return { slot: left > 0 ? { ...slot, count: left } : { ...EMPTY }, cursor: { ...slot, count: take } };
  }

  if (slot.itemId === "" || slot.itemId === holding.itemId) {
    const maxStack = ITEM_REGISTRY[holding.itemId]?.maxStack ?? 64;
    const base = slot.itemId === "" ? 0 : slot.count;
    const put = Math.min(portion(holding.count, placeMode), maxStack - base);
    if (put <= 0) return { slot, cursor: holding };
    const left = holding.count - put;
    return {
      slot: { ...holding, count: base + put, durability: slot.itemId === "" ? holding.durability : slot.durability },
      cursor: left > 0 ? { ...holding, count: left } : null,
    };
  }

  if (placeMode !== "all") return { slot, cursor: holding };
  return { slot: { ...holding }, cursor: { ...slot } };
}

/** Free build starts with a hotbar of building blocks; the bag's supply has the rest. */
export function freeBuildInventory(): PlayerInventory {
  let inv = emptyInventory();
  for (const id of ["wood_planks", "stone_brick", "timber_beam", "plaster", "red_lacquer", "cobblestone", "torch"]) {
    inv = addItem(inv, id, ITEM_REGISTRY[id]?.maxStack ?? 64).inv;
  }
  return inv;
}
