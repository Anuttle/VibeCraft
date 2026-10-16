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
