import { createNoise2D } from "simplex-noise";
import { BlockType } from "../types";

export const CHUNK_SIZE_X = 16;
export const CHUNK_SIZE_Y = 64;
export const CHUNK_SIZE_Z = 16;
export const CHUNK_VOLUME = CHUNK_SIZE_X * CHUNK_SIZE_Y * CHUNK_SIZE_Z;
export const SEA_LEVEL = 21;

export enum BiomeType {
  OCEAN = "OCEAN",
  DESERT = "DESERT",
  PLAINS = "PLAINS",
  FOREST = "FOREST",
  SNOWY_TAIGA = "SNOWY_TAIGA",
}

export interface BiomeConfig {
  type: BiomeType;
  name: string;
  topBlock: BlockType;
  subBlock: BlockType;
  baseHeight: number;
  amplitude: number;
  treeDensity: number;
  cactusDensity: number;
  treeType?: "oak" | "spruce";
}

export const BIOMES: Record<BiomeType, BiomeConfig> = {
  [BiomeType.OCEAN]: {
    type: BiomeType.OCEAN,
    name: "Ocean & Shore",
    topBlock: BlockType.SAND,
    subBlock: BlockType.SAND,
    baseHeight: 17,
    amplitude: 5,
    treeDensity: 0.0,
    cactusDensity: 0.0,
  },
  [BiomeType.DESERT]: {
    type: BiomeType.DESERT,
    name: "Desert",
    topBlock: BlockType.SAND,
    subBlock: BlockType.SANDSTONE,
    baseHeight: 25,
    amplitude: 7,
    treeDensity: 0.0,
    cactusDensity: 0.05,
  },
  [BiomeType.PLAINS]: {
    type: BiomeType.PLAINS,
    name: "Plains",
    topBlock: BlockType.GRASS,
    subBlock: BlockType.DIRT,
    baseHeight: 25,
    amplitude: 9,
    treeDensity: 0.012,
    cactusDensity: 0.0,
    treeType: "oak",
  },
  [BiomeType.FOREST]: {
    type: BiomeType.FOREST,
    name: "Forest",
    topBlock: BlockType.GRASS,
    subBlock: BlockType.DIRT,
    baseHeight: 27,
    amplitude: 14,
    treeDensity: 0.08,
    cactusDensity: 0.0,
    treeType: "oak",
  },
  [BiomeType.SNOWY_TAIGA]: {
    type: BiomeType.SNOWY_TAIGA,
    name: "Snowy Taiga",
    topBlock: BlockType.SNOW,
    subBlock: BlockType.DIRT,
    baseHeight: 28,
    amplitude: 12,
    treeDensity: 0.06,
    cactusDensity: 0.0,
    treeType: "spruce",
  },
};

export class TerrainGenerator {
  private noiseElevation: (x: number, y: number) => number;
  private noiseTemperature: (x: number, y: number) => number;
  private noiseMoisture: (x: number, y: number) => number;
  private seed: string;

  constructor(seed: string = "voxel_minecraft_clone") {
    this.seed = seed;
    this.noiseElevation = createNoise2D(this.createRandom(seed + "_elev"));
    this.noiseTemperature = createNoise2D(this.createRandom(seed + "_temp"));
    this.noiseMoisture = createNoise2D(this.createRandom(seed + "_moist"));
  }

  private createRandom(str: string): () => number {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  /**
   * Sample Temperature map (0.0 to 1.0, Cold to Hot)
   */
  public getTemperature(worldX: number, worldZ: number): number {
    const scale = 0.004; // Smooth large climate regions
    const val = this.noiseTemperature(worldX * scale, worldZ * scale);
    return Math.min(1.0, Math.max(0.0, (val + 1) / 2));
  }

  /**
   * Sample Moisture map (0.0 to 1.0, Arid to Wet)
   */
  public getMoisture(worldX: number, worldZ: number): number {
    const scale = 0.004;
    const val = this.noiseMoisture(worldX * scale, worldZ * scale);
    return Math.min(1.0, Math.max(0.0, (val + 1) / 2));
  }

  /**
   * Determine Biome based on Climate Noise Matrix & Elevation
   */
  public getBiomeAt(worldX: number, worldZ: number): BiomeConfig {
    const temp = this.getTemperature(worldX, worldZ);
    const moist = this.getMoisture(worldX, worldZ);

    const elevScale = 0.01;
    const elevVal = (this.noiseElevation(worldX * elevScale, worldZ * elevScale) + 1) / 2;

    // Check Ocean basins
    if (elevVal < 0.35) {
      return BIOMES[BiomeType.OCEAN];
    }

    // Climate Lookup Matrix
    if (temp > 0.62 && moist < 0.38) {
      return BIOMES[BiomeType.DESERT];
    }
    if (temp < 0.36) {
      return BIOMES[BiomeType.SNOWY_TAIGA];
    }
    if (moist > 0.55) {
      return BIOMES[BiomeType.FOREST];
    }
    return BIOMES[BiomeType.PLAINS];
  }

  /**
   * Calculate exact surface terrain height at a world position
   */
  public getTerrainHeight(worldX: number, worldZ: number): { height: number; biome: BiomeConfig } {
    const biome = this.getBiomeAt(worldX, worldZ);

    const baseScale = 0.015;
    const detailScale = 0.06;

    const n1 = this.noiseElevation(worldX * baseScale, worldZ * baseScale);
    const n2 = this.noiseElevation(worldX * detailScale, worldZ * detailScale) * 0.35;
    const combinedNoise = (n1 + n2) / 1.35; // Normalized -1 to 1

    const height = Math.floor(biome.baseHeight + combinedNoise * biome.amplitude);
    const clampedHeight = Math.max(1, Math.min(CHUNK_SIZE_Y - 2, height));

    return { height: clampedHeight, biome };
  }

  /**
   * Generates voxel block data for a single chunk at chunk coordinates (cx, cz).
   */
  public generateChunk(cx: number, cz: number): Uint8Array {
    const blocks = new Uint8Array(CHUNK_VOLUME);

    // Track surface height per column for structure post-processing
    const surfaceMap = new Array<{ x: number; z: number; y: number; biome: BiomeConfig }>();

    for (let x = 0; x < CHUNK_SIZE_X; x++) {
      for (let z = 0; z < CHUNK_SIZE_Z; z++) {
        const worldX = cx * CHUNK_SIZE_X + x;
        const worldZ = cz * CHUNK_SIZE_Z + z;

        const { height, biome } = this.getTerrainHeight(worldX, worldZ);
        surfaceMap.push({ x, z, y: height, biome });

        // Fill voxel blocks from Y=0 to Y=CHUNK_SIZE_Y
        for (let y = 0; y < CHUNK_SIZE_Y; y++) {
          const idx = x + z * CHUNK_SIZE_X + y * CHUNK_SIZE_X * CHUNK_SIZE_Z;

          if (y === 0) {
            blocks[idx] = BlockType.BEDROCK;
          } else if (y < height) {
            const depth = height - y;
            if (depth > 4) {
              // Deep stone layers with ore pockets
              const oreNoise = this.noiseElevation(worldX * 0.2, worldZ * 0.2);
              if (y < 12 && oreNoise > 0.75) {
                blocks[idx] = BlockType.IRON;
              } else if (y < 20 && oreNoise < -0.75) {
                blocks[idx] = BlockType.COAL;
              } else {
                blocks[idx] = BlockType.STONE;
              }
            } else {
              // Biome-specific Subsurface Layer (Dirt / Sandstone / Sand)
              blocks[idx] = biome.subBlock;
            }
          } else if (y === height) {
            // Biome Surface Top Block
            blocks[idx] = biome.topBlock;
          } else if (y <= SEA_LEVEL) {
            // Fill water up to Sea Level if terrain is below water level
            if (biome.type === BiomeType.SNOWY_TAIGA && y === SEA_LEVEL) {
              blocks[idx] = BlockType.ICE;
            } else {
              blocks[idx] = BlockType.WATER;
            }
          } else {
            blocks[idx] = BlockType.AIR;
          }
        }
      }
    }

    // Procedural Structures (Trees & Cacti) placement pass
    for (const spot of surfaceMap) {
      const { x: tx, z: tz, y: groundY, biome } = spot;

      // Only place structure if ground is above sea level
      if (groundY <= SEA_LEVEL) continue;

      const worldX = cx * CHUNK_SIZE_X + tx;
      const worldZ = cz * CHUNK_SIZE_Z + tz;

      // Deterministic pseudo-random seed for structure probability
      const hash = Math.abs((worldX * 73856093) ^ (worldZ * 19349663) ^ (groundY * 83492791)) % 1000 / 1000;

      // 1. Cacti Generation in Desert
      if (biome.type === BiomeType.DESERT && hash < biome.cactusDensity) {
        if (tx >= 1 && tx < CHUNK_SIZE_X - 1 && tz >= 1 && tz < CHUNK_SIZE_Z - 1) {
          const cactusHeight = 2 + Math.floor(hash * 100) % 2; // 2 to 3 blocks high
          for (let ch = 1; ch <= cactusHeight; ch++) {
            const cy = groundY + ch;
            if (cy < CHUNK_SIZE_Y) {
              const cidx = tx + tz * CHUNK_SIZE_X + cy * CHUNK_SIZE_X * CHUNK_SIZE_Z;
              blocks[cidx] = BlockType.CACTUS;
            }
          }
        }
      }

      // 2. Tree Generation (Oak in Plains/Forest, Spruce in Snowy Taiga)
      else if (hash < biome.treeDensity && biome.treeType) {
        // Ensure tree trunk is safely within chunk margin to prevent border cut-off
        if (tx >= 2 && tx < CHUNK_SIZE_X - 2 && tz >= 2 && tz < CHUNK_SIZE_Z - 2) {
          if (biome.treeType === "spruce") {
            this.generateSpruceTree(blocks, tx, groundY, tz);
          } else {
            this.generateOakTree(blocks, tx, groundY, tz);
          }
        }
      }
    }

    return blocks;
  }

  /**
   * Procedural Oak Tree (Wood Trunk + Broad Leaf Canopy).
   * Public so authored areas can guarantee trees (e.g. near spawn).
   */
  public generateOakTree(blocks: Uint8Array, tx: number, groundY: number, tz: number) {
    const treeHeight = 5;

    // Trunk
    for (let h = 1; h <= treeHeight; h++) {
      const ty = groundY + h;
      if (ty < CHUNK_SIZE_Y) {
        const idx = tx + tz * CHUNK_SIZE_X + ty * CHUNK_SIZE_X * CHUNK_SIZE_Z;
        blocks[idx] = BlockType.WOOD;
      }
    }

    // Canopy
    const canopyCenterY = groundY + treeHeight;
    for (let dy = -2; dy <= 1; dy++) {
      const ly = canopyCenterY + dy;
      if (ly >= CHUNK_SIZE_Y) continue;

      const radius = dy >= 0 ? 1 : 2;

      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (dx === 0 && dz === 0 && dy <= 0) continue; // Don't replace trunk

          const lx = tx + dx;
          const lz = tz + dz;
          if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
            const lidx = lx + lz * CHUNK_SIZE_X + ly * CHUNK_SIZE_X * CHUNK_SIZE_Z;
            if (blocks[lidx] === BlockType.AIR) {
              blocks[lidx] = BlockType.LEAVES;
            }
          }
        }
      }
    }
  }

  /**
   * Procedural Spruce Tree (Tall Wood Trunk + Conical Tiered Canopy)
   */
  private generateSpruceTree(blocks: Uint8Array, tx: number, groundY: number, tz: number) {
    const treeHeight = 7;

    // Trunk
    for (let h = 1; h <= treeHeight; h++) {
      const ty = groundY + h;
      if (ty < CHUNK_SIZE_Y) {
        const idx = tx + tz * CHUNK_SIZE_X + ty * CHUNK_SIZE_X * CHUNK_SIZE_Z;
        blocks[idx] = BlockType.WOOD;
      }
    }

    // Tiered Cone Leaves
    const topY = groundY + treeHeight;
    for (let dy = 1; dy >= -4; dy--) {
      const ly = topY + dy;
      if (ly >= CHUNK_SIZE_Y) continue;

      const radius = Math.abs(dy) % 2 === 0 ? 1 : 2;

      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (Math.abs(dx) === radius && Math.abs(dz) === radius) continue; // Round corners

          const lx = tx + dx;
          const lz = tz + dz;
          if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
            const lidx = lx + lz * CHUNK_SIZE_X + ly * CHUNK_SIZE_X * CHUNK_SIZE_Z;
            if (blocks[lidx] === BlockType.AIR) {
              blocks[lidx] = BlockType.LEAVES;
            }
          }
        }
      }
    }
  }
}
