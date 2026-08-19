export enum BlockType {
  AIR = 0,
  GRASS = 1,
  DIRT = 2,
  STONE = 3,
  WOOD = 4,
  LEAVES = 5,
  COAL = 6,
  IRON = 7,
  BEDROCK = 8,
  TORCH = 9,
  CRAFTING_TABLE = 10,
  SAND = 11,
  SANDSTONE = 12,
  CACTUS = 13,
  SNOW = 14,
  WATER = 15,
  ICE = 16,
}

export interface BlockConfig {
  name: string;
  color: string;
  isSolid: boolean;
  isLightSource?: boolean;
  isTransparent?: boolean;
}

export const BLOCK_CONFIGS: Record<BlockType, BlockConfig> = {
  [BlockType.AIR]: { name: "Air", color: "transparent", isSolid: false },
  [BlockType.GRASS]: { name: "Grass", color: "#34d399", isSolid: true }, // Tailwind Emerald-400
  [BlockType.DIRT]: { name: "Dirt", color: "#78350f", isSolid: true },  // Amber-900
  [BlockType.STONE]: { name: "Stone", color: "#64748b", isSolid: true }, // Slate-500
  [BlockType.WOOD]: { name: "Wood", color: "#b45309", isSolid: true },  // Amber-700
  [BlockType.LEAVES]: { name: "Leaves", color: "#15803d", isSolid: true, isTransparent: true }, // Green-700
  [BlockType.COAL]: { name: "Coal Ore", color: "#1e293b", isSolid: true }, // Slate-800
  [BlockType.IRON]: { name: "Iron Ore", color: "#d97706", isSolid: true }, // Amber-600
  [BlockType.BEDROCK]: { name: "Bedrock", color: "#0f172a", isSolid: true }, // Slate-900
  [BlockType.TORCH]: { name: "Torch", color: "#fbbf24", isSolid: false, isLightSource: true }, // Warm Glow
  [BlockType.CRAFTING_TABLE]: { name: "Crafting Table", color: "#a16207", isSolid: true }, // Oak Crafting Table
  [BlockType.SAND]: { name: "Sand", color: "#fef08a", isSolid: true }, // Yellow-200
  [BlockType.SANDSTONE]: { name: "Sandstone", color: "#fde047", isSolid: true }, // Yellow-300
  [BlockType.CACTUS]: { name: "Cactus", color: "#16a34a", isSolid: true }, // Green-600
  [BlockType.SNOW]: { name: "Snow", color: "#f8fafc", isSolid: true }, // Slate-50
  [BlockType.WATER]: { name: "Water", color: "#38bdf8", isSolid: false, isTransparent: true }, // Sky-400
  [BlockType.ICE]: { name: "Ice", color: "#bae6fd", isSolid: true, isTransparent: true }, // Sky-200
};

export interface ChunkKey {
  cx: number;
  cz: number;
}

export interface ChunkData {
  cx: number; // Chunk X index
  cz: number; // Chunk Z index
  blocks: Uint8Array; // Flat array of size CHUNK_SIZE_X * CHUNK_SIZE_Y * CHUNK_SIZE_Z
}

export interface InventorySlot {
  itemId: string; // "" means empty slot
  count: number;
  durability?: number;
}

