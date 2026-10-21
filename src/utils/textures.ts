import * as THREE from "three";
import textureList from "virtual:texture-list";
import { BlockType } from "../types";

// Block and item textures are optional PNGs in public/textures (see
// docs/TEXTURES.md). Anything without a texture keeps its plain color or emoji.

export type FaceKind = "top" | "bottom" | "side";

/** The file name stem for a block, e.g. STONE_BRICK -> "stone_brick". */
export function blockSlug(block: BlockType): string {
  return (BlockType[block] ?? "").toLowerCase();
}

const blockFiles = new Map(textureList.blocks.map((f) => [f.replace(/\.[^.]+$/, ""), f]));
const itemFiles = new Map(textureList.items.map((f) => [f.replace(/\.[^.]+$/, ""), f]));

const url = (dir: string, file: string) => `${import.meta.env.BASE_URL}textures/${dir}/${file}`;

/** Faces that borrow another block's texture when they have none: grass is dirt underneath. */
const BORROW: Record<string, string> = { grass_bottom: "dirt" };

/** The file for one face of a block: "<slug>_<face>" (top, bottom or side), else "<slug>". */
function blockFile(block: BlockType, face: FaceKind): string | null {
  const slug = blockSlug(block);
  if (!slug) return null;
  const borrowed = BORROW[`${slug}_${face}`];
  return blockFiles.get(`${slug}_${face}`) ?? (borrowed ? blockFiles.get(borrowed) : undefined) ?? blockFiles.get(slug) ?? null;
}

/** Picture for an item in the bag and hotbar: its own icon, else its block's side texture. */
export function itemIconUrl(itemId: string, blockType?: BlockType): string | null {
  const own = itemFiles.get(itemId);
  if (own) return url("items", own);
  if (blockType === undefined) return null;
  const file = blockFile(blockType, "side");
  return file ? url("blocks", file) : null;
}

export const TILE = 32;

export interface BlockAtlas {
  texture: THREE.Texture;
  /** Atlas tile for a face, or 0 (plain white) when the block has no texture. */
  tile(block: BlockType, face: FaceKind): number;
  /** UV rectangle of a tile: [u0, v0, u1, v1]. */
  uv(tile: number): [number, number, number, number];
  /** One tile as its own texture, for the held block. */
  tileTexture(tile: number): THREE.Texture;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // A broken file just falls back to color.
    img.src = src;
  });

/**
 * Load every block texture into one atlas, or null when there are none.
 * Each image is scaled to a TILE x TILE square, keeping pixel art crisp.
 */
export async function loadBlockAtlas(): Promise<BlockAtlas | null> {
  const files = [...new Set(blockFiles.values())];
  if (files.length === 0) return null;
  const images = await Promise.all(files.map((f) => loadImage(url("blocks", f))));

  const count = files.length + 1; // tile 0 is plain white for untextured blocks
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const canvas = document.createElement("canvas");
  canvas.width = cols * TILE;
  canvas.height = rows * TILE;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, TILE, TILE);

  const tileOfFile = new Map<string, number>();
  files.forEach((file, i) => {
    const img = images[i];
    if (!img) return;
    const t = i + 1;
    ctx.drawImage(img, (t % cols) * TILE, Math.floor(t / cols) * TILE, TILE, TILE);
    tileOfFile.set(file, t);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  // Half a texel in from each edge, so neighboring tiles don't bleed in.
  const inset = 0.5 / TILE;
  const tileCache = new Map<number, THREE.Texture>();

  return {
    texture,
    tile(block, face) {
      const file = blockFile(block, face);
      return file ? tileOfFile.get(file) ?? 0 : 0;
    },
    uv(t) {
      const c = t % cols;
      const r = Math.floor(t / cols);
      return [(c + inset) / cols, 1 - (r + 1 - inset) / rows, (c + 1 - inset) / cols, 1 - (r + inset) / rows];
    },
    tileTexture(t) {
      const cached = tileCache.get(t);
      if (cached) return cached;
      const one = document.createElement("canvas");
      one.width = one.height = TILE;
      const c = one.getContext("2d")!;
      c.imageSmoothingEnabled = false;
      c.drawImage(canvas, (t % cols) * TILE, Math.floor(t / cols) * TILE, TILE, TILE, 0, 0, TILE, TILE);
      const tex = new THREE.CanvasTexture(one);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      tileCache.set(t, tex);
      return tex;
    },
  };
}
