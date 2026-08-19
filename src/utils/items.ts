import { BlockType } from "../types";

export type ItemType = "block" | "tool" | "weapon" | "food" | "resource";
export type ToolType = "pickaxe" | "axe" | "shovel" | "none";

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  maxStack: number;
  color: string; // Used for rendering 3D item drops and UI slots
  emoji: string; // Used as an icon in the inventory UI
  toolType?: ToolType; // For tool items
  miningSpeedMultiplier?: number; // Speed boost when harvesting
  maxDurability?: number; // Total uses for tools/weapons
  attackDamage?: number; // Damage dealt to mobs
  foodRestore?: number; // Hunger restored when consumed
  blockType?: BlockType; // If it can be placed as a block
}

// 1. Item Registry
export const ITEM_REGISTRY: Record<string, Item> = {
  // Blocks
  "grass_block": {
    id: "grass_block",
    name: "Grass Block",
    type: "block",
    maxStack: 64,
    color: "#34d399",
    emoji: "🌱",
    blockType: BlockType.GRASS,
  },
  "dirt": {
    id: "dirt",
    name: "Dirt Block",
    type: "block",
    maxStack: 64,
    color: "#78350f",
    emoji: "🟫",
    blockType: BlockType.DIRT,
  },
  "cobblestone": {
    id: "cobblestone",
    name: "Cobblestone",
    type: "block",
    maxStack: 64,
    color: "#64748b",
    emoji: "🪨",
    blockType: BlockType.STONE,
  },
  "wood_log": {
    id: "wood_log",
    name: "Oak Log",
    type: "block",
    maxStack: 64,
    color: "#b45309",
    emoji: "🪵",
    blockType: BlockType.WOOD,
  },
  "leaves": {
    id: "leaves",
    name: "Oak Leaves",
    type: "block",
    maxStack: 64,
    color: "#15803d",
    emoji: "🍃",
    blockType: BlockType.LEAVES,
  },
  "coal_ore": {
    id: "coal_ore",
    name: "Coal Ore",
    type: "block",
    maxStack: 64,
    color: "#1e293b",
    emoji: "⚫",
    blockType: BlockType.COAL,
  },
  "iron_ore": {
    id: "iron_ore",
    name: "Iron Ore",
    type: "block",
    maxStack: 64,
    color: "#d97706",
    emoji: "🟨",
    blockType: BlockType.IRON,
  },
  "torch": {
    id: "torch",
    name: "Torch",
    type: "block",
    maxStack: 64,
    color: "#fbbf24",
    emoji: "🕯️",
    blockType: BlockType.TORCH,
  },
  "crafting_table": {
    id: "crafting_table",
    name: "Crafting Table",
    type: "block",
    maxStack: 64,
    color: "#a16207",
    emoji: "🪵🧱",
    blockType: BlockType.CRAFTING_TABLE,
  },
  "sand": {
    id: "sand",
    name: "Sand",
    type: "block",
    maxStack: 64,
    color: "#fef08a",
    emoji: "🏖️",
    blockType: BlockType.SAND,
  },
  "sandstone": {
    id: "sandstone",
    name: "Sandstone",
    type: "block",
    maxStack: 64,
    color: "#fde047",
    emoji: "🏜️",
    blockType: BlockType.SANDSTONE,
  },
  "cactus": {
    id: "cactus",
    name: "Cactus",
    type: "block",
    maxStack: 64,
    color: "#16a34a",
    emoji: "🌵",
    blockType: BlockType.CACTUS,
  },
  "snow": {
    id: "snow",
    name: "Snow",
    type: "block",
    maxStack: 64,
    color: "#f8fafc",
    emoji: "❄️",
    blockType: BlockType.SNOW,
  },
  "ice": {
    id: "ice",
    name: "Ice",
    type: "block",
    maxStack: 64,
    color: "#bae6fd",
    emoji: "🧊",
    blockType: BlockType.ICE,
  },

  // Resources
  "coal": {
    id: "coal",
    name: "Coal",
    type: "resource",
    maxStack: 64,
    color: "#111827",
    emoji: "💎",
  },
  "raw_iron": {
    id: "raw_iron",
    name: "Raw Iron",
    type: "resource",
    maxStack: 64,
    color: "#f59e0b",
    emoji: "🪙",
  },
  "stick": {
    id: "stick",
    name: "Stick",
    type: "resource",
    maxStack: 64,
    color: "#b45309",
    emoji: "🥢",
  },
  "wood_planks": {
    id: "wood_planks",
    name: "Oak Planks",
    type: "block",
    maxStack: 64,
    color: "#d97706",
    emoji: "🧱",
    // We can allow placing wood planks if we map to a BlockType, but for now we'll support them as a block/resource.
  },

  // Tools
  "wooden_pickaxe": {
    id: "wooden_pickaxe",
    name: "Wooden Pickaxe",
    type: "tool",
    maxStack: 1,
    color: "#b45309",
    emoji: "🪵⛏️",
    toolType: "pickaxe",
    miningSpeedMultiplier: 2.0,
    maxDurability: 60,
  },
  "stone_pickaxe": {
    id: "stone_pickaxe",
    name: "Stone Pickaxe",
    type: "tool",
    maxStack: 1,
    color: "#64748b",
    emoji: "🪨⛏️",
    toolType: "pickaxe",
    miningSpeedMultiplier: 4.0,
    maxDurability: 131,
  },
  "iron_pickaxe": {
    id: "iron_pickaxe",
    name: "Iron Pickaxe",
    type: "tool",
    maxStack: 1,
    color: "#cbd5e1",
    emoji: "⚙️⛏️",
    toolType: "pickaxe",
    miningSpeedMultiplier: 6.0,
    maxDurability: 250,
  },
  "wooden_axe": {
    id: "wooden_axe",
    name: "Wooden Axe",
    type: "tool",
    maxStack: 1,
    color: "#b45309",
    emoji: "🪵🪓",
    toolType: "axe",
    miningSpeedMultiplier: 2.0,
    maxDurability: 60,
  },
  "stone_axe": {
    id: "stone_axe",
    name: "Stone Axe",
    type: "tool",
    maxStack: 1,
    color: "#64748b",
    emoji: "🪨🪓",
    toolType: "axe",
    miningSpeedMultiplier: 4.0,
    maxDurability: 131,
  },

  // Weapons
  "wooden_sword": {
    id: "wooden_sword",
    name: "Wooden Sword",
    type: "weapon",
    maxStack: 1,
    color: "#b45309",
    emoji: "🪵🗡️",
    attackDamage: 4,
    maxDurability: 60,
  },
  "stone_sword": {
    id: "stone_sword",
    name: "Stone Sword",
    type: "weapon",
    maxStack: 1,
    color: "#64748b",
    emoji: "🪨🗡️",
    attackDamage: 6,
    maxDurability: 131,
  },
  "iron_sword": {
    id: "iron_sword",
    name: "Iron Sword",
    type: "weapon",
    maxStack: 1,
    color: "#e2e8f0",
    emoji: "⚙️🗡️",
    attackDamage: 8,
    maxDurability: 250,
  },

  // Food
  "cooked_porkchop": {
    id: "cooked_porkchop",
    name: "Cooked Porkchop",
    type: "food",
    maxStack: 64,
    color: "#f43f5e",
    emoji: "🥩",
    foodRestore: 8,
  },
  "apple": {
    id: "apple",
    name: "Red Apple",
    type: "food",
    maxStack: 64,
    color: "#ef4444",
    emoji: "🍎",
    foodRestore: 4,
  },
  "bread": {
    id: "bread",
    name: "Fresh Bread",
    type: "food",
    maxStack: 64,
    color: "#f59e0b",
    emoji: "🍞",
    foodRestore: 6,
  },
  "rotten_flesh": {
    id: "rotten_flesh",
    name: "Rotten Flesh",
    type: "food",
    maxStack: 64,
    color: "#15803d",
    emoji: "🍖",
    foodRestore: 2,
  },
};

export interface BlockDrop {
  itemId: string;
  minCount: number;
  maxCount: number;
  requiredTool: ToolType;
  hardness: number; // Duration in seconds to break with hand (multiplier affects this)
}

// 2. Block Break/Drop Table
export const BLOCK_DROP_TABLE: Record<BlockType, BlockDrop | null> = {
  [BlockType.AIR]: null,
  [BlockType.GRASS]: {
    itemId: "dirt", // Drops dirt like standard game mechanics
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.4,
  },
  [BlockType.DIRT]: {
    itemId: "dirt",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.4,
  },
  [BlockType.STONE]: {
    itemId: "cobblestone",
    minCount: 1,
    maxCount: 1,
    requiredTool: "pickaxe", // Requires pickaxe to drop cobblestone
    hardness: 1.5,
  },
  [BlockType.WOOD]: {
    itemId: "wood_log",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none", // breaks faster with axe, but drops with hand
    hardness: 1.0,
  },
  [BlockType.LEAVES]: {
    itemId: "leaves",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.1,
  },
  [BlockType.COAL]: {
    itemId: "coal",
    minCount: 1,
    maxCount: 2,
    requiredTool: "pickaxe",
    hardness: 2.0,
  },
  [BlockType.IRON]: {
    itemId: "raw_iron",
    minCount: 1,
    maxCount: 1,
    requiredTool: "pickaxe",
    hardness: 2.5,
  },
  [BlockType.BEDROCK]: {
    itemId: "",
    minCount: 0,
    maxCount: 0,
    requiredTool: "none",
    hardness: Infinity, // Unbreakable
  },
  [BlockType.TORCH]: {
    itemId: "torch",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.1,
  },
  [BlockType.CRAFTING_TABLE]: {
    itemId: "crafting_table",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.8,
  },
  [BlockType.SAND]: {
    itemId: "sand",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.5,
  },
  [BlockType.SANDSTONE]: {
    itemId: "sandstone",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.8,
  },
  [BlockType.CACTUS]: {
    itemId: "cactus",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.4,
  },
  [BlockType.SNOW]: {
    itemId: "snow",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.2,
  },
  [BlockType.ICE]: {
    itemId: "ice",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.5,
  },
  [BlockType.WATER]: {
    itemId: "",
    minCount: 0,
    maxCount: 0,
    requiredTool: "none",
    hardness: Infinity,
  },
};

export interface CraftingResult {
  itemId: string;
  count: number;
}

export function checkCraftingRecipe(grid: string[]): CraftingResult | null {
  const counts: Record<string, number> = {};
  let totalItems = 0;
  for (const id of grid) {
    if (id) {
      counts[id] = (counts[id] || 0) + 1;
      totalItems++;
    }
  }

  if (totalItems === 0) return null;

  // 4 Wood Planks -> Crafting Table (2x2 or 3x3)
  if (totalItems === 4 && counts["wood_planks"] === 4) {
    return { itemId: "crafting_table", count: 1 };
  }

  // 1 Wood Log -> 4 Oak Planks
  if (totalItems === 1 && counts["wood_log"] === 1) {
    return { itemId: "wood_planks", count: 4 };
  }

  // 2 Wood Planks -> 4 Sticks
  if (totalItems === 2 && counts["wood_planks"] === 2) {
    return { itemId: "stick", count: 4 };
  }

  // 1 Coal + 1 Stick -> 4 Torches
  if (totalItems === 2 && counts["coal"] === 1 && counts["stick"] === 1) {
    return { itemId: "torch", count: 4 };
  }

  // 1 Wood Log + 1 Stick -> 4 Torches (survival shortcut)
  if (totalItems === 2 && counts["wood_log"] === 1 && counts["stick"] === 1) {
    return { itemId: "torch", count: 4 };
  }

  // Wooden Pickaxe (3 Wood Planks + 2 Sticks or 1 Stick)
  if (
    counts["wood_planks"] === 3 &&
    (counts["stick"] === 2 || counts["stick"] === 1) &&
    (totalItems === 5 || totalItems === 4)
  ) {
    return { itemId: "wooden_pickaxe", count: 1 };
  }

  // Stone Pickaxe (3 Cobblestone + 2 Sticks or 1 Stick)
  if (
    counts["cobblestone"] === 3 &&
    (counts["stick"] === 2 || counts["stick"] === 1) &&
    (totalItems === 5 || totalItems === 4)
  ) {
    return { itemId: "stone_pickaxe", count: 1 };
  }

  // Iron Pickaxe (3 Raw Iron + 2 Sticks or 1 Stick)
  if (
    counts["raw_iron"] === 3 &&
    (counts["stick"] === 2 || counts["stick"] === 1) &&
    (totalItems === 5 || totalItems === 4)
  ) {
    return { itemId: "iron_pickaxe", count: 1 };
  }

  // Wooden Axe (3 Wood Planks + 2 Sticks or 2 Wood Planks + 1 Stick)
  if (
    ((counts["wood_planks"] === 3 && counts["stick"] === 2 && totalItems === 5) ||
      (counts["wood_planks"] === 2 && counts["stick"] === 1 && totalItems === 3))
  ) {
    return { itemId: "wooden_axe", count: 1 };
  }

  // Stone Axe (3 Cobblestone + 2 Sticks or 2 Cobblestone + 1 Stick)
  if (
    ((counts["cobblestone"] === 3 && counts["stick"] === 2 && totalItems === 5) ||
      (counts["cobblestone"] === 2 && counts["stick"] === 1 && totalItems === 3))
  ) {
    return { itemId: "stone_axe", count: 1 };
  }

  // Wooden Sword (2 Wood Planks + 1 Stick)
  if (totalItems === 3 && counts["wood_planks"] === 2 && counts["stick"] === 1) {
    return { itemId: "wooden_sword", count: 1 };
  }

  // Stone Sword (2 Cobblestone + 1 Stick)
  if (totalItems === 3 && counts["cobblestone"] === 2 && counts["stick"] === 1) {
    return { itemId: "stone_sword", count: 1 };
  }

  // Iron Sword (2 Raw Iron + 1 Stick)
  if (totalItems === 3 && counts["raw_iron"] === 2 && counts["stick"] === 1) {
    return { itemId: "iron_sword", count: 1 };
  }

  // 3 Leaves -> 1 Apple
  if (totalItems === 3 && counts["leaves"] === 3) {
    return { itemId: "apple", count: 1 };
  }

  // 3 Wood Logs -> 2 Bread (survival shortcut)
  if (totalItems === 3 && counts["wood_log"] === 3) {
    return { itemId: "bread", count: 2 };
  }

  // 2 Dirt -> 2 Grass Block
  if (totalItems === 2 && counts["dirt"] === 2) {
    return { itemId: "grass_block", count: 2 };
  }

  return null;
}

