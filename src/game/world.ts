import { BlockType } from "../types";
import { Line, UiText } from "../i18n/types";

export type StationId = string;

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

export type DecorKind =
  | "press"
  | "typecase"
  | "paper"
  | "ink"
  | "desk"
  | "kiln"
  | "furnace"
  | "vat"
  | "counter"
  | "maptable"
  | "claybench";

export interface Structure {
  /** Columns (inclusive) whose terrain is flattened to the floor height. */
  area: { x0: number; z0: number; x1: number; z1: number };
  /** Builds the structure on a floor at height `floorY`. */
  build: (set: BlockSetter, floorY: number) => void;
  /** Stations inside the structure, positioned relative to the floor. */
  stations: Array<{ id: string; station: StationId; label: UiText; x: number; dy: number; z: number }>;
  /** Decorative 3D props placed on station blocks. */
  decor?: Array<{ kind: DecorKind; x: number; dy: number; z: number }>;
}

export interface WorldSetup {
  /** Plant oak trees next to spawn (tutorial needs wood within reach). */
  spawnTrees?: boolean;
  structure?: Structure;
  npcs?: NpcDef[];
  /** Spawn point (block coordinates) and the point to face. */
  spawn?: { x: number; z: number; lookAt?: { x: number; z: number } };
  /**
   * Free build: a fixed terrain seed, saved block edits to replay (by chunk,
   * then block index), and a callback for each block the player changes.
   * Workshop blocks can be broken here.
   */
  freeBuild?: {
    seed: string;
    edits: Record<string, Record<number, number>>;
    onEdit: (chunkKey: string, index: number, block: number) => void;
  };
}

// ---------------------------------------------------------------------------
// Room builder. Every chapter scene is a walled yard, open to the sky so the
// interior stays bright on every device, with a south doorway.
//
// Station spots (same in every room):
//   A (5, 5)      B (10-11, 5)      C (4, 9)      D (11, 9)
//   character at (8, 7); a second character at (6, 9); spawn at (7, 11)
// ---------------------------------------------------------------------------

const W0 = 2;
const W1 = 13;

export interface RoomStyle {
  floor: BlockType;
  wall: BlockType;
  post: BlockType;
  beam: BlockType;
}

export interface RoomStation {
  id: StationId;
  label: UiText;
  spot: "A" | "B" | "C" | "D";
  block: BlockType;
  decor?: DecorKind;
}

const SPOTS: Record<RoomStation["spot"], { x: number; z: number; wide: boolean }> = {
  A: { x: 5, z: 5, wide: false },
  B: { x: 10, z: 5, wide: true },
  C: { x: 4, z: 9, wide: false },
  D: { x: 11, z: 9, wide: false },
};

export function makeRoom(
  style: RoomStyle,
  stations: RoomStation[],
  extras: Array<{ x: number; dy: number; z: number; block: BlockType }> = []
): Structure {
  return {
    area: { x0: 1, z0: 1, x1: 14, z1: 14 },
    build(set, y) {
      for (let x = W0; x <= W1; x++) for (let z = W0; z <= W1; z++) set(x, y, z, style.floor);

      for (let x = W0; x <= W1; x++) {
        for (let z = W0; z <= W1; z++) {
          const onWall = x === W0 || x === W1 || z === W0 || z === W1;
          if (!onWall) continue;
          const along = x === W0 || x === W1 ? z : x;
          const isPost = along === W0 || along === W1 || (along - W0) % 3 === 0;
          for (let dy = 1; dy <= 3; dy++) set(x, y + dy, z, dy === 3 ? style.beam : isPost ? style.post : style.wall);
        }
      }

      // Doorway (south) and windows
      for (let dy = 1; dy <= 2; dy++) {
        set(7, y + dy, W1, BlockType.AIR);
        set(8, y + dy, W1, BlockType.AIR);
      }
      for (const wx of [W0, W1]) {
        set(wx, y + 2, 7, BlockType.AIR);
        set(wx, y + 2, 8, BlockType.AIR);
      }

      for (const st of stations) {
        const spot = SPOTS[st.spot];
        set(spot.x, y + 1, spot.z, st.block);
        if (spot.wide) set(spot.x + 1, y + 1, spot.z, st.block);
      }
      for (const e of extras) set(e.x, y + e.dy, e.z, e.block);
    },
    stations: stations.map((st) => {
      const spot = SPOTS[st.spot];
      return { id: st.id, station: st.id, label: st.label, x: spot.wide ? spot.x + 0.5 : spot.x, dy: 1, z: spot.z };
    }),
    decor: stations.flatMap((st) => {
      if (!st.decor) return [];
      const spot = SPOTS[st.spot];
      const one = { kind: st.decor, x: spot.x, dy: 1, z: spot.z };
      return spot.wide ? [one, { ...one, x: spot.x + 1 }] : [one];
    }),
  };
}

const WORKSHOP_STYLE: RoomStyle = {
  floor: BlockType.PLANKS,
  wall: BlockType.PLASTER,
  post: BlockType.TIMBER,
  beam: BlockType.TIMBER,
};

// ---------------------------------------------------------------------------
// Characters
// ---------------------------------------------------------------------------

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

const BACK_TO_WORK: Line = {
  en: { T1: "Let's keep working!", T3: "Let's keep working. There is more to learn." },
  es: { T1: "¡Sigamos trabajando!", T3: "Sigamos trabajando. Hay más que aprender." },
};

export const BI_SHENG: NpcDef = {
  id: "bisheng",
  name: { en: "Bi Sheng", es: "Bi Sheng" },
  x: 8,
  z: 7,
  look: { skin: "#d9a77c", hair: "#1c1917", robe: "#2f4f6f", hat: "#1c1917" },
  idle: BACK_TO_WORK,
};

export const SCRIBE: NpcDef = {
  id: "scribe",
  name: { en: "Brother Konrad", es: "Hermano Konrad" },
  x: 8,
  z: 7,
  look: { skin: "#e8c39e", hair: "#8a6d4b", robe: "#3b3024" },
  idle: BACK_TO_WORK,
};

export const PAPERMAKER: NpcDef = {
  id: "papermaker",
  name: { en: "Marta the papermaker", es: "Marta, la papelera" },
  x: 6,
  z: 9,
  look: { skin: "#c99a74", hair: "#2b1d12", robe: "#4d6b3c", hat: "#d6cfc0" },
  idle: BACK_TO_WORK,
};

export const CHAPPE: NpcDef = {
  id: "chappe",
  name: { en: "Paulinus Chappe", es: "Paulinus Chappe" },
  x: 8,
  z: 7,
  look: { skin: "#e3b896", hair: "#6b5544", robe: "#1f3b6b", hat: "#7a1f1f" },
  idle: BACK_TO_WORK,
};

export const FUST: NpcDef = {
  id: "fust",
  name: { en: "Johann Fust", es: "Johann Fust" },
  x: 6,
  z: 9,
  look: { skin: "#e6bd99", hair: "#9a9a9a", robe: "#1e3a2f", hat: "#111111" },
  idle: {
    en: { T1: "I want my money back.", T3: "I lent a great deal of money. I expect it to be repaid." },
    es: { T1: "Quiero que me devuelvan mi dinero.", T3: "Presté mucho dinero. Espero que me lo devuelvan." },
  },
};

export const ZELL: NpcDef = {
  id: "zell",
  name: { en: "Ulrich Zell", es: "Ulrich Zell" },
  x: 8,
  z: 7,
  look: { skin: "#e2b08a", hair: "#a0522d", robe: "#5b3a6b", hat: "#2b2b2b" },
  idle: BACK_TO_WORK,
};

// ---------------------------------------------------------------------------
// Chapter scenes. Station ids here are the keys of each chapter's activities.
// ---------------------------------------------------------------------------

const SPAWN = { x: 7, z: 11, lookAt: { x: 8, z: 7 } };

/** Chapter 0: Bi Sheng's workshop, China, c. 1040. Stations: carve, kiln, frame. */
export const CLAY_WORLD: WorldSetup = {
  structure: makeRoom(
    { floor: BlockType.STONE_BRICK, wall: BlockType.PLASTER, post: BlockType.LACQUER, beam: BlockType.LACQUER },
    [
      { id: "carve", spot: "B", block: BlockType.CLAY, decor: "claybench", label: { en: "the clay bench", es: "la mesa de arcilla" } },
      { id: "kiln", spot: "A", block: BlockType.KILN, decor: "kiln", label: { en: "the kiln", es: "el horno" } },
      { id: "frame", spot: "D", block: BlockType.INK, label: { en: "the iron frame", es: "el marco de hierro" } },
    ]
  ),
  npcs: [BI_SHENG],
  spawn: SPAWN,
};

/** Chapter 1: a monastery scriptorium. Stations: desk, ledger. */
export const SCRIPTORIUM_WORLD: WorldSetup = {
  structure: makeRoom(
    { floor: BlockType.STONE_BRICK, wall: BlockType.STONE_BRICK, post: BlockType.STONE_BRICK, beam: BlockType.TIMBER },
    [
      { id: "desk", spot: "B", block: BlockType.DESK, decor: "desk", label: { en: "the writing desk", es: "el escritorio" } },
      { id: "ledger", spot: "A", block: BlockType.DESK, decor: "desk", label: { en: "the library ledger", es: "el registro de la biblioteca" } },
    ]
  ),
  npcs: [SCRIBE],
  spawn: SPAWN,
};

/** Chapter 2: Gutenberg's workshop, casting type. Stations: furnace, mould. */
export const METAL_WORLD: WorldSetup = {
  structure: makeRoom(WORKSHOP_STYLE, [
    { id: "furnace", spot: "A", block: BlockType.FURNACE, decor: "furnace", label: { en: "the furnace", es: "el horno de fundición" } },
    { id: "mould", spot: "B", block: BlockType.COUNTER, decor: "counter", label: { en: "the hand mould", es: "el molde manual" } },
  ]),
  npcs: [GUTENBERG],
  spawn: SPAWN,
};

/** Chapter 3: ink in the workshop; a papermaker shows how paper is made. Stations: ink, vat, paperpress. */
export const INK_PAPER_WORLD: WorldSetup = {
  structure: makeRoom(WORKSHOP_STYLE, [
    { id: "ink", spot: "A", block: BlockType.INK, decor: "ink", label: { en: "the ink bench", es: "la mesa de tinta" } },
    { id: "vat", spot: "B", block: BlockType.VAT, decor: "vat", label: { en: "the paper vat", es: "la tina de papel" } },
    { id: "paperpress", spot: "D", block: BlockType.PRESS, decor: "press", label: { en: "the paper press", es: "la prensa de papel" } },
  ]),
  npcs: [GUTENBERG, PAPERMAKER],
  spawn: SPAWN,
};

/** Chapter 5: printing indulgences for a paying customer. Stations: press, ledger. */
export const INDULGENCE_WORLD: WorldSetup = {
  structure: makeRoom(WORKSHOP_STYLE, [
    { id: "press", spot: "A", block: BlockType.PRESS, decor: "press", label: { en: "the printing press", es: "la prensa" } },
    { id: "ledger", spot: "B", block: BlockType.COUNTER, decor: "counter", label: { en: "the account book", es: "el libro de cuentas" } },
  ]),
  npcs: [CHAPPE],
  spawn: SPAWN,
};

/** Chapter 6: the Bible, the loan and the lawsuit. Stations: press, ledger, court. */
export const BIBLE_WORLD: WorldSetup = {
  structure: makeRoom(WORKSHOP_STYLE, [
    { id: "press", spot: "A", block: BlockType.PRESS, decor: "press", label: { en: "the printing press", es: "la prensa" } },
    { id: "ledger", spot: "B", block: BlockType.COUNTER, decor: "counter", label: { en: "the account book", es: "el libro de cuentas" } },
    { id: "court", spot: "D", block: BlockType.DESK, decor: "desk", label: { en: "the court record", es: "el expediente del juicio" } },
  ]),
  npcs: [GUTENBERG, FUST],
  spawn: SPAWN,
};

/** Chapter 7: printing spreads across Europe and beyond. Stations: map, effects. */
export const SPREAD_WORLD: WorldSetup = {
  structure: makeRoom(WORKSHOP_STYLE, [
    { id: "map", spot: "B", block: BlockType.MAP_TABLE, decor: "maptable", label: { en: "the map table", es: "la mesa del mapa" } },
    { id: "effects", spot: "A", block: BlockType.DESK, decor: "desk", label: { en: "the reading desk", es: "el atril de lectura" } },
  ]),
  npcs: [ZELL],
  spawn: SPAWN,
};

// ---------------------------------------------------------------------------
// Chapter 4 keeps its original hand-placed workshop.
// ---------------------------------------------------------------------------

export const WORKSHOP: Structure = {
  area: { x0: 1, z0: 1, x1: 14, z1: 14 },
  build(set, y) {
    makeRoom(WORKSHOP_STYLE, []).build(set, y);
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
