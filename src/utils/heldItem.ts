import * as THREE from "three";
import { BLOCK_CONFIGS } from "../types";
import { ITEM_REGISTRY } from "./items";
import { itemIconUrl } from "./textures";

/** Where the held item sits in front of the camera, in camera space. */
const POSE = {
  // Lower right, like holding it in the right hand.
  mouse: new THREE.Vector3(0.55, -0.42, -1.0),
  // Moved in from the corner so the on-screen action buttons don't cover it.
  touch: new THREE.Vector3(0.3, -0.2, -1.0),
};

const iconCache = new Map<string, THREE.Texture>();

/** An item's emoji drawn onto a texture, for tools and materials. */
function iconTexture(emoji: string): THREE.Texture {
  const cached = iconCache.get(emoji);
  if (cached) return cached;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${size * 0.8}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.fillText(emoji, size / 2, size / 2 + size * 0.04);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  iconCache.set(emoji, texture);
  return texture;
}

/** An item's own PNG icon, when one is in public/textures/items. */
function imageTexture(src: string): THREE.Texture {
  const cached = iconCache.get(src);
  if (cached) return cached;
  const texture = new THREE.TextureLoader().load(src);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  iconCache.set(src, texture);
  return texture;
}

/**
 * The item in the player's hand, drawn over the world in the lower right of
 * the view. Blocks show as a small cube; tools and materials as their icon.
 */
export class HeldItemView {
  readonly group = new THREE.Group();
  private shownId: string | null = null;
  private time = 0;
  private swing = 0;
  /**
   * Optional textured materials for a block's six box faces (+x, -x, +y, -y,
   * +z, -z), so a held block matches the world. Null when it has no texture.
   */
  blockMaterial: ((blockType: number) => THREE.Material[] | null) | null = null;

  constructor(camera: THREE.Camera) {
    camera.add(this.group);
  }

  /** Start a quick swing, e.g. after placing a block. */
  punch() {
    this.swing = 1;
  }

  /** Clear the shown model so the next update rebuilds it (e.g. textures loaded). */
  refresh() {
    this.shownId = null;
  }

  update(itemId: string, delta: number, opts: { touch: boolean; walking: boolean; breaking: boolean }) {
    if (itemId !== this.shownId) this.rebuild(itemId);
    this.time += delta;

    const base = opts.touch ? POSE.touch : POSE.mouse;
    // Gentle bob while walking; steady chopping while breaking.
    const bob = opts.walking ? Math.sin(this.time * 9) * 0.02 : 0;
    if (opts.breaking) this.swing = Math.max(this.swing, (Math.sin(this.time * 14) + 1) / 2);
    else this.swing = Math.max(0, this.swing - delta * 5);

    this.group.position.set(base.x - this.swing * 0.05, base.y + bob - this.swing * 0.08, base.z + this.swing * 0.1);
    this.group.rotation.set(-this.swing * 0.9, -0.5, 0);
  }

  private rebuild(itemId: string) {
    this.shownId = itemId;
    for (const child of [...this.group.children]) {
      this.group.remove(child);
      if (child instanceof THREE.Mesh) {
        // Textures are cached and shared, so only the geometry and materials go.
        child.geometry.dispose();
        for (const m of [child.material].flat()) (m as THREE.Material).dispose();
      }
    }
    const def = itemId ? ITEM_REGISTRY[itemId] : null;
    if (!def) return;

    let mesh: THREE.Mesh;
    if (def.type === "block" && def.blockType !== undefined) {
      const material =
        this.blockMaterial?.(def.blockType) ??
        new THREE.MeshLambertMaterial({ color: BLOCK_CONFIGS[def.blockType]?.color ?? def.color });
      mesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), material);
      mesh.rotation.set(0.3, 0.8, 0);
    } else {
      const icon = itemIconUrl(def.id);
      const material = new THREE.MeshBasicMaterial({ map: icon ? imageTexture(icon) : iconTexture(def.emoji), transparent: true, alphaTest: 0.1 });
      mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.32), material);
      mesh.rotation.set(0, 0.5, 0.35);
    }
    // Always drawn on top, so it never pokes into a wall the player stands against.
    for (const m of [mesh.material].flat() as THREE.MeshBasicMaterial[]) {
      m.depthTest = false;
      m.fog = false;
    }
    mesh.renderOrder = 1000;
    this.group.add(mesh);
  }
}
