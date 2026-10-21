import * as THREE from "three";
import { BlockType, BLOCK_CONFIGS } from "../types";
import { CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z } from "./terrain";
import type { BlockAtlas, FaceKind } from "./textures";

// Face definitions
interface Face {
  dir: [number, number, number];
  vertices: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ];
  normal: [number, number, number];
  shading: number; // Simple lighting factor (ambient shading)
}

const FACES: Face[] = [
  {
    // Top (Y+)
    dir: [0, 1, 0],
    vertices: [
      [0, 1, 0],
      [0, 1, 1],
      [1, 1, 1],
      [1, 1, 0],
    ],
    normal: [0, 1, 0],
    shading: 1.0,
  },
  {
    // Bottom (Y-)
    dir: [0, -1, 0],
    vertices: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 0, 1],
      [0, 0, 1],
    ],
    normal: [0, -1, 0],
    shading: 0.5,
  },
  {
    // Left (X-)
    dir: [-1, 0, 0],
    vertices: [
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    normal: [-1, 0, 0],
    shading: 0.75,
  },
  {
    // Right (X+)
    dir: [1, 0, 0],
    vertices: [
      [1, 0, 1],
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 1],
    ],
    normal: [1, 0, 0],
    shading: 0.75,
  },
  {
    // Front (Z+)
    dir: [0, 0, 1],
    vertices: [
      [0, 0, 1],
      [1, 0, 1],
      [1, 1, 1],
      [0, 1, 1],
    ],
    normal: [0, 0, 1],
    shading: 0.85,
  },
  {
    // Back (Z-)
    dir: [0, 0, -1],
    vertices: [
      [1, 0, 0],
      [0, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    normal: [0, 0, -1],
    shading: 0.85,
  },
];

/**
 * Texture coordinates for a face corner, so textures stand upright on the
 * sides and keep one orientation on top.
 */
const faceUv = (dir: [number, number, number], v: [number, number, number]): [number, number] => {
  if (dir[1] !== 0) return [v[0], v[2]];
  if (dir[0] !== 0) return [dir[0] > 0 ? 1 - v[2] : v[2], v[1]];
  return [dir[2] > 0 ? v[0] : 1 - v[0], v[1]];
};

const faceKind = (dir: [number, number, number]): FaceKind => (dir[1] > 0 ? "top" : dir[1] < 0 ? "bottom" : "side");

export function buildChunkGeometry(
  cx: number,
  cz: number,
  loadedChunks: Map<string, Uint8Array>,
  atlas: BlockAtlas | null = null
): THREE.BufferGeometry | null {
  const currentKey = `${cx},${cz}`;
  const currentChunk = loadedChunks.get(currentKey);
  if (!currentChunk) return null;

  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  let vertexCount = 0;

  // Helper to get block type (handles boundary checks across neighboring chunks)
  const getBlockType = (x: number, y: number, z: number): BlockType => {
    if (y < 0 || y >= CHUNK_SIZE_Y) return BlockType.AIR;

    let targetCx = cx;
    let targetCz = cz;
    let lx = x;
    let lz = z;

    if (x < 0) {
      targetCx -= 1;
      lx = CHUNK_SIZE_X + x;
    } else if (x >= CHUNK_SIZE_X) {
      targetCx += 1;
      lx = x - CHUNK_SIZE_X;
    }

    if (z < 0) {
      targetCz -= 1;
      lz = CHUNK_SIZE_Z + z;
    } else if (z >= CHUNK_SIZE_Z) {
      targetCz += 1;
      lz = z - CHUNK_SIZE_Z;
    }

    const key = `${targetCx},${targetCz}`;
    const blocks = loadedChunks.get(key);
    if (!blocks) return BlockType.AIR;

    const idx = lx + lz * CHUNK_SIZE_X + y * CHUNK_SIZE_X * CHUNK_SIZE_Z;
    return blocks[idx];
  };

  // Convert Hex color to RGB object
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return { r, g, b };
  };

  // Helper to check if block is solid for AO calculations
  const isSolidBlock = (bt: BlockType): boolean => {
    return (
      bt !== BlockType.AIR &&
      bt !== BlockType.TORCH &&
      bt !== BlockType.WATER &&
      bt !== BlockType.LEAVES &&
      bt !== BlockType.CACTUS
    );
  };

  // Helper to check if face should be rendered against neighboring block
  const shouldRenderFace = (currentType: BlockType, neighborType: BlockType): boolean => {
    if (neighborType === BlockType.AIR || neighborType === BlockType.TORCH) return true;

    const currentConfig = BLOCK_CONFIGS[currentType];
    const neighborConfig = BLOCK_CONFIGS[neighborType];

    // Don't render interior faces between identical transparent blocks (e.g. water next to water)
    if (currentType === neighborType && currentConfig?.isTransparent) {
      return false;
    }

    // Render face if neighboring block is transparent (e.g. water or leaves next to solid block)
    if (neighborConfig?.isTransparent) {
      return true;
    }

    return false;
  };

  // Compute Smooth Ambient Occlusion for a vertex corner on a quad face
  const computeVertexAo = (
    fx: number, fy: number, fz: number,
    fnx: number, fny: number, fnz: number,
    vx: number, vy: number, vz: number
  ): number => {
    const tx = fx + fnx;
    const ty = fy + fny;
    const tz = fz + fnz;

    let side1 = false;
    let side2 = false;
    let corner = false;

    if (fnx !== 0) {
      const dy = vy === 1 ? 1 : -1;
      const dz = vz === 1 ? 1 : -1;
      side1 = isSolidBlock(getBlockType(tx, ty + dy, tz));
      side2 = isSolidBlock(getBlockType(tx, ty, tz + dz));
      corner = isSolidBlock(getBlockType(tx, ty + dy, tz + dz));
    } else if (fny !== 0) {
      const dx = vx === 1 ? 1 : -1;
      const dz = vz === 1 ? 1 : -1;
      side1 = isSolidBlock(getBlockType(tx + dx, ty, tz));
      side2 = isSolidBlock(getBlockType(tx, ty, tz + dz));
      corner = isSolidBlock(getBlockType(tx + dx, ty + dx, tz + dz));
    } else {
      const dx = vx === 1 ? 1 : -1;
      const dy = vy === 1 ? 1 : -1;
      side1 = isSolidBlock(getBlockType(tx + dx, ty, tz));
      side2 = isSolidBlock(getBlockType(tx, ty + dy, tz));
      corner = isSolidBlock(getBlockType(tx + dx, ty + dy, tz));
    }

    if (side1 && side2) return 0;
    return 3 - ((side1 ? 1 : 0) + (side2 ? 1 : 0) + (corner ? 1 : 0));
  };

  const AO_LEVELS = [0.45, 0.68, 0.84, 1.0];

  // Iterate over every block position in the chunk
  for (let x = 0; x < CHUNK_SIZE_X; x++) {
    for (let z = 0; z < CHUNK_SIZE_Z; z++) {
      for (let y = 0; y < CHUNK_SIZE_Y; y++) {
        const blockIdx = x + z * CHUNK_SIZE_X + y * CHUNK_SIZE_X * CHUNK_SIZE_Z;
        const blockType = currentChunk[blockIdx];

        if (blockType === BlockType.AIR) continue;

        const config = BLOCK_CONFIGS[blockType];
        const baseColor = hexToRgb(config.color);

        // Check each of the 6 faces for exposure
        FACES.forEach((face) => {
          const nx = x + face.dir[0];
          const ny = y + face.dir[1];
          const nz = z + face.dir[2];

          const neighborType = getBlockType(nx, ny, nz);
          
          // Render face if adjacent block requires it
          if (shouldRenderFace(blockType, neighborType)) {
            const vertexAos: number[] = [];
            // A textured face is tinted white (the texture gives the color); an
            // untextured one samples the atlas's white tile and keeps its color.
            const tile = atlas ? atlas.tile(blockType, faceKind(face.dir)) : 0;
            const [u0, v0, u1, v1] = atlas ? atlas.uv(tile) : [0, 0, 1, 1];
            const tint = tile ? { r: 1, g: 1, b: 1 } : baseColor;

            // Add the 4 vertices of this face
            face.vertices.forEach((v) => {
              // Convert local coordinates back to absolute chunk coordinates
              const vx = cx * CHUNK_SIZE_X + x + v[0];
              const vy = y + v[1];
              const vz = cz * CHUNK_SIZE_Z + z + v[2];

              positions.push(vx, vy, vz);

              // Calculate Smooth Ambient Occlusion value (0..3)
              const aoValue = computeVertexAo(x, y, z, face.dir[0], face.dir[1], face.dir[2], v[0], v[1], v[2]);
              vertexAos.push(aoValue);
              const aoFactor = AO_LEVELS[aoValue];

              // Directional shading + Smooth AO
              colors.push(
                tint.r * face.shading * aoFactor,
                tint.g * face.shading * aoFactor,
                tint.b * face.shading * aoFactor
              );
              const [fu, fv] = faceUv(face.dir, v);
              uvs.push(u0 + (u1 - u0) * fu, v0 + (v1 - v0) * fv);

              normals.push(...face.normal);
            });

            // Triangulate quad with AO anisotropy flip prevention
            const ao0 = vertexAos[0];
            const ao1 = vertexAos[1];
            const ao2 = vertexAos[2];
            const ao3 = vertexAos[3];

            if (ao0 + ao2 > ao1 + ao3) {
              indices.push(
                vertexCount, vertexCount + 1, vertexCount + 2,
                vertexCount, vertexCount + 2, vertexCount + 3
              );
            } else {
              indices.push(
                vertexCount + 1, vertexCount + 2, vertexCount + 3,
                vertexCount + 1, vertexCount + 3, vertexCount
              );
            }

            vertexCount += 4;
          }
        });
      }
    }
  }

  if (vertexCount === 0) return null;

  // Build high-performance BufferGeometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
}
