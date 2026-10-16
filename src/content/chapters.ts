import { UiText } from "../i18n/types";
import { Chapter } from "../game/quest";
import { TUTORIAL } from "./tutorial";
import { PRESS_CHAPTER } from "./press";
import { CLAY_CHAPTER } from "./chapters/clay";
import { SCRIPTORIUM_CHAPTER } from "./chapters/scriptorium";
import { METAL_CHAPTER } from "./chapters/metal";
import { INK_PAPER_CHAPTER } from "./chapters/inkpaper";
import { INDULGENCES_CHAPTER } from "./chapters/indulgences";
import { BIBLE_CHAPTER } from "./chapters/bible";
import { SPREAD_CHAPTER } from "./chapters/spread";

export interface ChapterInfo {
  id: string;
  /** Story chapter number 0-7, or null for the tutorial. */
  number: number | null;
  title: UiText;
  /** Historical anchor shown under the title. */
  anchor: UiText;
  icon: string;
  /** Playable chapter definition; null until the chapter is built. */
  chapter: Chapter | null;
}

export const CHAPTERS: ChapterInfo[] = [
  {
    id: "tutorial",
    number: null,
    title: { en: "Getting Started", es: "Primeros pasos" },
    anchor: { en: "Learn to move, gather, and craft", es: "Aprende a moverte, recoger y fabricar" },
    icon: "🧭",
    chapter: TUTORIAL,
  },
  {
    id: "clay",
    number: 0,
    title: { en: "The Clay Type", es: "Los tipos de arcilla" },
    anchor: { en: "Bi Sheng, China, c. 1040 · Jikji, Korea, 1377", es: "Bi Sheng, China, c. 1040 · Jikji, Corea, 1377" },
    icon: "🏺",
    chapter: CLAY_CHAPTER,
  },
  {
    id: "scriptorium",
    number: 1,
    title: { en: "The Scriptorium", es: "El scriptorium" },
    anchor: { en: "Books copied by hand", es: "Libros copiados a mano" },
    icon: "🪶",
    chapter: SCRIPTORIUM_CHAPTER,
  },
  {
    id: "metal",
    number: 2,
    title: { en: "The Metal", es: "El metal" },
    anchor: { en: "Gutenberg's hand mould, Mainz", es: "El molde manual de Gutenberg, Maguncia" },
    icon: "🔥",
    chapter: METAL_CHAPTER,
  },
  {
    id: "ink-paper",
    number: 3,
    title: { en: "Ink & Paper", es: "Tinta y papel" },
    anchor: { en: "Oil-based ink and linen-rag paper", es: "Tinta a base de aceite y papel de trapo" },
    icon: "🫙",
    chapter: INK_PAPER_CHAPTER,
  },
  {
    id: "press",
    number: 4,
    title: { en: "The Press", es: "La prensa" },
    anchor: { en: "A screw press built for printing", es: "Una prensa de tornillo para imprimir" },
    icon: "🖨️",
    chapter: PRESS_CHAPTER,
  },
  {
    id: "indulgences",
    number: 5,
    title: { en: "The Indulgences", es: "Las indulgencias" },
    anchor: { en: "Printing for paying customers, 1454–55", es: "Imprimir para clientes, 1454–55" },
    icon: "📜",
    chapter: INDULGENCES_CHAPTER,
  },
  {
    id: "bible-debt",
    number: 6,
    title: { en: "The Bible & the Debt", es: "La Biblia y la deuda" },
    anchor: { en: "The 42-line Bible and the 1455 lawsuit", es: "La Biblia de 42 líneas y el juicio de 1455" },
    icon: "⚖️",
    chapter: BIBLE_CHAPTER,
  },
  {
    id: "scattering",
    number: 7,
    title: { en: "The Spread of Printing", es: "La expansión de la imprenta" },
    anchor: { en: "From Mainz to more than 250 towns by 1500", es: "De Maguncia a más de 250 ciudades en 1500" },
    icon: "🗺️",
    chapter: SPREAD_CHAPTER,
  },
];

export function findChapter(id: string): ChapterInfo | undefined {
  return CHAPTERS.find((c) => c.id === id);
}
