import { BlockType } from "../types";
import { Line, UiText } from "../i18n/types";

export type StationId = "typecase" | "press";

export interface NpcDef {
  id: string;
  name: UiText;
  /** Block coordinates (chunk 0,0 local = world coordinates). */
  x: number;
  z: number;
  look: { skin: string; hair: string; robe: string; hat?: string };
  /** Said when talked to with no conversation planned for this moment. */
  idle?: Line;
}

/** Something the player can walk up to and use: a station or a character. */
export interface Interactable {
  id: string;
  kind: "station" | "npc";
  station?: StationId;
  label: UiText;
  x: number;
  y: number;
  z: number;
}

export type BlockSetter = (x: number, y: number, z: number, block: BlockType) => void;

export interface Structure {
  /** Columns (inclusive) whose terrain is flattened to the floor height. */
  area: { x0: number; z0: number; x1: number; z1: number };
  /** Builds the structure on a floor at height `floorY`. */
  build: (set: BlockSetter, floorY: number) => void;
  /** Stations inside the structure, positioned relative to the floor. */
  stations: Array<{ id: string; station: StationId; label: UiText; x: number; dy: number; z: number }>;
  /** Decorative 3D props placed on station blocks. */
  decor?: Array<{ kind: "press" | "typecase" | "paper" | "ink"; x: number; dy: number; z: number }>;
}

export interface WorldSetup {
  /** Plant oak trees next to spawn (tutorial needs wood within reach). */
  spawnTrees?: boolean;
  structure?: Structure;
  npcs?: NpcDef[];
  /** Spawn point (block coordinates) and the point to face. */
  spawn?: { x: number; z: number; lookAt?: { x: number; z: number } };
}

// ---------------------------------------------------------------------------
// Gutenberg's workshop, Mainz, c. 1450.
// A walled timber-framed yard with the press, a type case, paper and ink.
// Left open to the sky so the interior stays bright on every device.
// ---------------------------------------------------------------------------

const W0 = 2; // outer wall min x/z
const W1 = 13; // outer wall max x/z

export const WORKSHOP: Structure = {
  area: { x0: 1, z0: 1, x1: 14, z1: 14 },
  build(set, y) {
    // Floor
    for (let x = W0; x <= W1; x++) for (let z = W0; z <= W1; z++) set(x, y, z, BlockType.PLANKS);

    // Walls: timber posts every third block and at corners, plaster between, beam on top
    for (let x = W0; x <= W1; x++) {
      for (let z = W0; z <= W1; z++) {
        const onWall = x === W0 || x === W1 || z === W0 || z === W1;
        if (!onWall) continue;
        const along = x === W0 || x === W1 ? z : x;
        const isPost = along === W0 || along === W1 || (along - W0) % 3 === 0;
        for (let dy = 1; dy <= 3; dy++) {
          set(x, y + dy, z, dy === 3 || isPost ? BlockType.TIMBER : BlockType.PLASTER);
        }
      }
    }

    // Doorway (south wall) and two windows
    for (let dy = 1; dy <= 2; dy++) {
      set(7, y + dy, W1, BlockType.AIR);
      set(8, y + dy, W1, BlockType.AIR);
    }
    set(W0, y + 2, 7, BlockType.AIR);
    set(W0, y + 2, 8, BlockType.AIR);
    set(W1, y + 2, 7, BlockType.AIR);
    set(W1, y + 2, 8, BlockType.AIR);

    // Workshop contents
    set(5, y + 1, 5, BlockType.PRESS);
    set(6, y + 1, 4, BlockType.INK);
    set(10, y + 1, 5, BlockType.TYPE_CASE);
    set(11, y + 1, 5, BlockType.TYPE_CASE);
    set(4, y + 1, 9, BlockType.PAPER);
    set(4, y + 2, 9, BlockType.PAPER);
  },
  stations: [
    { id: "press", station: "press", label: { en: "the printing press", es: "la prensa" }, x: 5, dy: 1, z: 5 },
    { id: "typecase", station: "typecase", label: { en: "the type case", es: "la caja de tipos" }, x: 10.5, dy: 1, z: 5 },
  ],
  decor: [
    { kind: "press", x: 5, dy: 1, z: 5 },
    { kind: "typecase", x: 10, dy: 1, z: 5 },
    { kind: "typecase", x: 11, dy: 1, z: 5 },
    { kind: "ink", x: 6, dy: 1, z: 4 },
    { kind: "paper", x: 4, dy: 2, z: 9 },
  ],
};

export const GUTENBERG: NpcDef = {
  id: "gutenberg",
  name: { en: "Johannes Gutenberg", es: "Johannes Gutenberg" },
  x: 8,
  z: 7,
  look: { skin: "#e0b48f", hair: "#5b4636", robe: "#7a2e2e", hat: "#3b2a20" },
  idle: {
    en: { T1: "The work is waiting!", T3: "Back to work, apprentice. The press is waiting." },
    es: { T1: "¡El trabajo nos espera!", T3: "A trabajar, aprendiz. La prensa nos espera." },
  },
};
