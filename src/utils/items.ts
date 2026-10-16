import { BlockType } from "../types";

export type ItemType = "block" | "tool" | "resource";
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
  maxDurability?: number; // Total uses for tools
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
    blockType: BlockType.PLANKS,
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
  [BlockType.PLANKS]: {
    itemId: "wood_planks",
    minCount: 1,
    maxCount: 1,
    requiredTool: "none",
    hardness: 0.8,
  },
  // Workshop structure and stations can't be broken, so a chapter can't be
  // made unwinnable by digging out the press.
  [BlockType.TIMBER]: { itemId: "", minCount: 0, maxCount: 0, requiredTool: "none", hardness: Infinity },
  [BlockType.PLASTER]: { itemId: "", minCount: 0, maxCount: 0, requiredTool: "none", hardness: Infinity },
  [BlockType.TYPE_CASE]: { itemId: "", minCount: 0, maxCount: 0, requiredTool: "none", hardness: Infinity },
  [BlockType.PRESS]: { itemId: "", minCount: 0, maxCount: 0, requiredTool: "none", hardness: Infinity },
  [BlockType.PAPER]: { itemId: "", minCount: 0, maxCount: 0, requiredTool: "none", hardness: Infinity },
  [BlockType.INK]: { itemId: "", minCount: 0, maxCount: 0, requiredTool: "none", hardness: Infinity },
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

/**
 * Shapeless recipes: the grid must hold exactly these items in these amounts,
 * in any arrangement. Add a separate entry for each accepted variation.
 */
export interface Recipe {
  ingredients: Record<string, number>;
  result: string;
  count: number;
}

export const RECIPES: Recipe[] = [
  { ingredients: { wood_log: 1 }, result: "wood_planks", count: 4 },
  { ingredients: { wood_planks: 2 }, result: "stick", count: 4 },
  { ingredients: { wood_planks: 4 }, result: "crafting_table", count: 1 },
  { ingredients: { coal: 1, stick: 1 }, result: "torch", count: 4 },
  { ingredients: { wood_log: 1, stick: 1 }, result: "torch", count: 4 },
  { ingredients: { wood_planks: 3, stick: 2 }, result: "wooden_pickaxe", count: 1 },
  { ingredients: { wood_planks: 3, stick: 1 }, result: "wooden_pickaxe", count: 1 },
  { ingredients: { cobblestone: 3, stick: 2 }, result: "stone_pickaxe", count: 1 },
  { ingredients: { cobblestone: 3, stick: 1 }, result: "stone_pickaxe", count: 1 },
  { ingredients: { raw_iron: 3, stick: 2 }, result: "iron_pickaxe", count: 1 },
  { ingredients: { raw_iron: 3, stick: 1 }, result: "iron_pickaxe", count: 1 },
  { ingredients: { wood_planks: 2, stick: 1 }, result: "wooden_axe", count: 1 },
  { ingredients: { cobblestone: 2, stick: 1 }, result: "stone_axe", count: 1 },
  { ingredients: { dirt: 2 }, result: "grass_block", count: 2 },
];

export function checkCraftingRecipe(grid: string[]): CraftingResult | null {
  const counts: Record<string, number> = {};
  for (const id of grid) {
    if (id) counts[id] = (counts[id] || 0) + 1;
  }
  const kinds = Object.keys(counts);
  if (kinds.length === 0) return null;

  const match = RECIPES.find((r) => {
    const needed = Object.keys(r.ingredients);
    return needed.length === kinds.length && needed.every((id) => counts[id] === r.ingredients[id]);
  });
  return match ? { itemId: match.result, count: match.count } : null;
}
