import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import assets from "virtual:texture-list";

// 3D models from public/models (see docs/MODELS.md): Kenney's Blocky Characters
// for townspeople, and Kenney's Fantasy Town pieces for scenery. A model that
// is missing or fails to load is simply left out.

const BASE = `${import.meta.env.BASE_URL}models/`;
const loader = new GLTFLoader();
const cache = new Map<string, Promise<GLTF | null>>();

function load(path: string): Promise<GLTF | null> {
  let pending = cache.get(path);
  if (!pending) {
    pending = loader.loadAsync(BASE + path).catch(() => null);
    cache.set(path, pending);
  }
  return pending;
}

/** Keep the pixel-art textures crisp, and let the models cast shadows. */
function prepare(root: THREE.Object3D) {
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    o.castShadow = true;
    o.receiveShadow = true;
    for (const m of [o.material].flat() as THREE.MeshStandardMaterial[]) {
      if (m.map) {
        m.map.magFilter = THREE.NearestFilter;
        m.map.minFilter = THREE.NearestFilter;
        m.map.generateMipmaps = false;
        m.map.needsUpdate = true;
      }
    }
  });
}

export const hasCharacter = (id: string) => assets.models.characters.includes(`character-${id}.glb`);

/** Town pieces need their shared palette image, or they would be drawn blank. */
export const hasTownModel = (name: string) => assets.models.townColormap && assets.models.town.includes(`${name}.glb`);

/** About player height, in blocks. */
const CHARACTER_HEIGHT = 1.85;

export interface CharacterInstance {
  /** Origin at the feet; the model faces +z. */
  group: THREE.Group;
  mixer: THREE.AnimationMixer;
  /** Cross-fade to an animation, e.g. "idle", "walk" or "emote-yes". */
  play: (name: string, fade?: number) => void;
  /** Play an animation once, then go back to the one before it. */
  playOnce: (name: string) => void;
}

/** A Kenney blocky character, e.g. id "a" for character-a.glb, with its animations. */
export async function loadCharacter(id: string): Promise<CharacterInstance | null> {
  if (!hasCharacter(id)) return null;
  const gltf = await load(`characters/character-${id}.glb`);
  if (!gltf) return null;

  const model = cloneSkinned(gltf.scene);
  prepare(model);
  const size = new THREE.Box3().setFromObject(model);
  const height = size.max.y - size.min.y || 1;
  model.scale.multiplyScalar(CHARACTER_HEIGHT / height);
  model.position.y = -size.min.y * (CHARACTER_HEIGHT / height);
  const group = new THREE.Group();
  group.add(model);

  const mixer = new THREE.AnimationMixer(model);
  const actions = new Map(gltf.animations.map((clip) => [clip.name, mixer.clipAction(clip)]));
  let current = "";
  const play = (name: string, fade = 0.25) => {
    const next = actions.get(name);
    if (!next || name === current) return;
    next.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(fade).play();
    actions.get(current)?.fadeOut(fade);
    current = name;
  };
  const playOnce = (name: string) => {
    const once = actions.get(name);
    if (!once) return;
    const back = current;
    once.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.15).play();
    once.clampWhenFinished = false;
    actions.get(current)?.fadeOut(0.15);
    current = name;
    const done = (e: { action: THREE.AnimationAction }) => {
      if (e.action !== once) return;
      mixer.removeEventListener("finished", done);
      current = "";
      play(back || "idle", 0.2);
    };
    mixer.addEventListener("finished", done);
  };
  play("idle", 0);
  return { group, mixer, play, playOnce };
}

/** A Fantasy Town piece by file name, e.g. "cart-high". One unit is one block. */
export async function loadTownModel(name: string): Promise<THREE.Object3D | null> {
  if (!hasTownModel(name)) return null;
  const gltf = await load(`town/${name}.glb`);
  if (!gltf) return null;
  const model = gltf.scene.clone(true);
  prepare(model);
  return model;
}
