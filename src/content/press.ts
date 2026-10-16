import { Band, Lang, Line } from "../i18n/types";
import { Chapter } from "../game/quest";
import { GUTENBERG, WORKSHOP } from "../game/world";

// Chapter 4: The Press. Mainz, c. 1450.
//
// Historical notes for reviewers:
// - Gutenberg was back in Mainz by 1448 and was developing printing there
//   around 1450; the Bible was finished by about 1455, roughly 180 copies.
// - Type was cast as mirror images; ink was oil-based and applied with
//   leather ink balls; paper was dampened before printing.
// - The screw press is described as "like" a wine press, as historians do;
//   its exact origins aren't documented.
// - The upper/lower case tray arrangement is from later print shops, so it
//   is told by the journal as "later printers", not by Gutenberg.
// - Gutenberg's lines are written for teaching; they are not quotations.

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };
const GUTENBERG_SPEAKER: Line = { en: "Johannes Gutenberg", es: "Johannes Gutenberg" };
const UPPER_BANDS: Band[] = ["6-8", "9-12"];

export const PRESS_CHAPTER: Chapter = {
  id: "press",
  world: {
    structure: WORKSHOP,
    npcs: [GUTENBERG],
    spawn: { x: 7, z: 11, lookAt: { x: 8, z: 7 } },
  },
  steps: [
    {
      id: "intro",
      dialogue: [
        {
          id: "press.intro",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "This is Mainz, a city in Germany. The year is about 1450. You are a helper in a print shop.",
              T2: "Welcome to Mainz, a city in Germany, around the year 1450. You are a new apprentice in the workshop of Johannes Gutenberg.",
              T3: "Mainz, Germany, around 1450. You have just joined the workshop of Johannes Gutenberg as an apprentice. He is working on a new way to make books.",
              T4: "Mainz, in the Holy Roman Empire, around 1450. You have just joined the workshop of Johannes Gutenberg as an apprentice, at a moment when he is perfecting a new method of producing books.",
            },
            es: {
              T1: "Esta es Maguncia, una ciudad de Alemania. Es el año 1450, más o menos. Ayudas en un taller de imprenta.",
              T2: "Te damos la bienvenida a Maguncia, una ciudad de Alemania, cerca del año 1450. Eres aprendiz en el taller de Johannes Gutenberg.",
              T3: "Maguncia, Alemania, alrededor de 1450. Acabas de entrar como aprendiz al taller de Johannes Gutenberg. Él está trabajando en una nueva forma de hacer libros.",
              T4: "Maguncia, en el Sacro Imperio Romano Germánico, alrededor de 1450. Acabas de entrar como aprendiz al taller de Johannes Gutenberg, justo cuando perfecciona un nuevo método para producir libros.",
            },
          },
        },
      ],
    },
    {
      id: "meet",
      objective: { type: "talk", npcId: "gutenberg" },
      objectiveText: {
        goal: { en: "Talk to Gutenberg.", es: "Habla con Gutenberg." },
        hintTouch: { en: "Walk to him and tap 💬.", es: "Camina hacia él y toca 💬." },
        hintMouse: { en: "Walk to him and press F.", es: "Camina hacia él y presiona F." },
      },
    },
    {
      id: "type",
      dialogue: [
        {
          id: "press.type",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Hello! Look at these little metal letters. We call them *type*. The letters are backwards. That way, the page comes out the right way.",
              T2: "Welcome! These small metal letters are called *type*. We line them up to make words. Each letter is backwards, so the printed page reads the right way.",
              T3: "Welcome, apprentice. Each of these small metal blocks carries a single letter. We call it *movable type*, because we can arrange the letters into any words we need and use them again and again. Notice that each letter is a mirror image, so the printed page reads correctly.",
              T4: "Welcome, apprentice. Each of these small metal blocks, called a sort, carries a single raised letter. Because the sorts can be arranged into any text and reused for the next job, we call this *movable type*. Each letter is cast as a mirror image, so that when it is pressed against paper, the text reads correctly.",
            },
            es: {
              T1: "¡Hola! Mira estas letras de metal. Se llaman *tipos*. Las letras están al revés. Así, la página sale al derecho.",
              T2: "¡Te doy la bienvenida! Estas pequeñas letras de metal se llaman *tipos*. Las ponemos en fila para formar palabras. Cada letra está al revés, para que la página impresa se lea bien.",
              T3: "Te doy la bienvenida, aprendiz. Cada uno de estos bloques de metal lleva una sola letra. Los llamamos *tipos móviles*, porque podemos ordenar las letras para formar cualquier palabra y usarlas una y otra vez. Fíjate que cada letra es una imagen de espejo, para que la página impresa se lea correctamente.",
              T4: "Te doy la bienvenida, aprendiz. Cada uno de estos pequeños bloques de metal lleva una sola letra en relieve. Como pueden ordenarse para formar cualquier texto y reutilizarse en el siguiente trabajo, los llamamos *tipos móviles*. Cada letra se funde como una imagen de espejo, de modo que, al presionarla contra el papel, el texto se lea correctamente.",
            },
          },
        },
        {
          id: "press.typeGo",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Go to the type case. Make a word with the letters.",
              T2: "Go to the type case and build the words with the letters.",
              T3: "Go to the type case and *set* the text. Pick each letter in order and place it in the composing stick.",
              T4: "Take your place at the type case and *set* the text: select each sort in order and place it in the composing stick.",
            },
            es: {
              T1: "Ve a la caja de tipos. Forma una palabra con las letras.",
              T2: "Ve a la caja de tipos y forma las palabras con las letras.",
              T3: "Ve a la caja de tipos y *compón* el texto. Elige cada letra en orden y colócala en el componedor.",
              T4: "Ocupa tu lugar en la caja de tipos y *compón* el texto: selecciona cada tipo en orden y colócalo en el componedor.",
            },
          },
        },
      ],
    },
    {
      id: "cases",
      bands: UPPER_BANDS,
      dialogue: [
        {
          id: "press.cases",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Big letters go in the top box. Small letters go in the bottom box. That is why we say *upper case* and *lower case*.",
              T2: "Later, printers kept big letters in a top box called the *upper case*, and small letters in a bottom box called the *lower case*. We still use these names today.",
              T3: "Later printers kept capital letters in the top tray, the *upper case*, and small letters in the bottom tray, the *lower case*. That is where those names come from.",
              T4: "Later printers stored capital letters in the upper tray, or *upper case*, and small letters in the lower tray, or *lower case*. Our everyday words for capital and small letters come straight from the print shop.",
            },
            es: {
              T1: "Las letras grandes van en la caja de arriba. Las pequeñas van en la caja de abajo. Por eso decimos *caja alta* y *caja baja*.",
              T2: "Más tarde, los impresores guardaban las letras grandes en una caja de arriba, la *caja alta*, y las pequeñas en una caja de abajo, la *caja baja*. Todavía usamos estos nombres.",
              T3: "Más tarde, los impresores guardaban las mayúsculas en la bandeja de arriba, la *caja alta*, y las minúsculas en la de abajo, la *caja baja*. De ahí vienen esos nombres.",
              T4: "Con el tiempo, los impresores guardaron las mayúsculas en la bandeja superior, o *caja alta*, y las minúsculas en la inferior, o *caja baja*. Esos nombres, que aún usamos, vienen directamente del taller de imprenta.",
            },
          },
        },
      ],
    },
    {
      id: "typeset",
      objective: { type: "station", station: "typecase" },
      objectiveText: {
        goal: {
          en: { T1: "Use the type case.", T3: "Set the text at the type case." },
          es: { T1: "Usa la caja de tipos.", T3: "Compón el texto en la caja de tipos." },
        },
        hintTouch: { en: "Walk to the type case and tap ✋.", es: "Camina a la caja de tipos y toca ✋." },
        hintMouse: { en: "Walk to the type case and press F.", es: "Camina a la caja de tipos y presiona F." },
      },
    },
    {
      id: "print",
      dialogue: [
        {
          id: "press.print",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Good work! Now we print. Put ink on the type. Lay down the paper. Then pull the bar.",
              T2: "Well done! Now let's print. First, dab ink on the type. Next, lay a damp sheet of paper on top. Then pull the bar to press the paper down.",
              T3: "Well done. Now we print. Dab the type with *ink* using the leather ink balls, lay down a sheet of damp paper, and pull the bar. The big wooden *screw* presses the paper evenly onto every letter.",
              T4: "Well done. Now we print. Dab the type with our oil-based *ink* using the leather ink balls, lay a sheet of dampened paper over it, and pull the bar. The great wooden *screw*, much like those in presses used to squeeze grapes for wine, forces the paper down evenly onto every letter.",
            },
            es: {
              T1: "¡Buen trabajo! Ahora vamos a imprimir. Pon tinta en los tipos. Pon el papel. Luego jala la barra.",
              T2: "¡Muy bien! Ahora vamos a imprimir. Primero, pon tinta en los tipos. Después, coloca encima una hoja de papel húmeda. Luego jala la barra para apretar el papel.",
              T3: "Bien hecho. Ahora vamos a imprimir. Pon *tinta* en los tipos con las balas de cuero, coloca una hoja de papel húmeda y jala la barra. El gran *tornillo* de madera aprieta el papel de manera pareja sobre cada letra.",
              T4: "Bien hecho. Ahora vamos a imprimir. Pon nuestra *tinta* a base de aceite en los tipos con las balas de cuero, coloca encima una hoja de papel humedecida y jala la barra. El gran *tornillo* de madera, parecido al de las prensas que exprimían uvas para hacer vino, aprieta el papel de manera pareja sobre cada letra.",
            },
          },
        },
      ],
      objective: { type: "station", station: "press" },
      objectiveText: {
        goal: {
          en: { T1: "Print with the press.", T3: "Print pages at the printing press." },
          es: { T1: "Imprime con la prensa.", T3: "Imprime páginas en la prensa." },
        },
        hintTouch: { en: "Walk to the press and tap ✋.", es: "Camina a la prensa y toca ✋." },
        hintMouse: { en: "Walk to the press and press F.", es: "Camina a la prensa y presiona F." },
      },
    },
    {
      id: "done",
      dialogue: [
        {
          id: "press.done",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Look! Every page is the same. Writing by hand is slow. The press is fast. Now many people can have books.",
              T2: "Look! Every page comes out the same. Copying a book by hand could take many months. With the press, we can make many copies much faster, so more people can own books.",
              T3: "Look closely: every copy is exactly the same. Copying one Bible by hand could take a scribe many months. Our workshop will print about 180 Bibles in a few years. Books will become cheaper, and more people will be able to read them.",
              T4: "Compare the sheets: every copy is identical. A single scribe could spend many months copying one Bible by hand, and every copy risked new errors. Within a few years, this workshop will complete about 180 copies of the Bible. Printing will make books cheaper, more accurate, and available to far more readers.",
            },
            es: {
              T1: "¡Mira! Todas las páginas son iguales. Escribir a mano es lento. La prensa es rápida. Ahora mucha gente puede tener libros.",
              T2: "¡Mira! Todas las páginas salen iguales. Copiar un libro a mano podía tardar muchos meses. Con la prensa podemos hacer muchas copias más rápido, y así más personas pueden tener libros.",
              T3: "Mira con atención: todas las copias son exactamente iguales. Un copista podía tardar muchos meses en copiar una Biblia a mano. Nuestro taller imprimirá unas 180 Biblias en pocos años. Los libros serán más baratos y más personas podrán leerlos.",
              T4: "Compara las hojas: todas las copias son idénticas. Un solo copista podía pasar muchos meses copiando una Biblia a mano, y cada copia corría el riesgo de tener errores nuevos. En pocos años, este taller terminará unas 180 copias de la Biblia. La imprenta hará que los libros sean más baratos, más precisos y que lleguen a muchas más personas.",
            },
          },
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Typesetting: what each grade band sets, and how much help it gets.
// ---------------------------------------------------------------------------

export interface TypesetConfig {
  /** Text to set, one entry per line. */
  lines: string[];
  /** Line width in characters; when set, lines must be justified to fill it. */
  width?: number;
  /** Separate upper case (capitals) and lower case trays. */
  caseSplit: boolean;
  /** Extra sorts in the tray to choose between (mirror look-alikes are best). */
  distractors: string;
  /** Highlight the right sort after this many wrong taps; null for no hints. */
  hintAfter: number | null;
  /** Find a planted mistake in another apprentice's proof afterward. */
  proof: boolean;
  /** Shuffle the tray instead of alphabetical order. */
  shuffle: boolean;
  /** Spaces must be spread evenly when justifying. */
  evenSpacing: boolean;
}

export const TYPESET: Record<Band, Record<Lang, TypesetConfig>> = {
  "K-2": {
    en: { lines: ["BOOK"], caseSplit: false, distractors: "DQ", hintAfter: 1, proof: false, shuffle: false, evenSpacing: false },
    es: { lines: ["LIBRO"], caseSplit: false, distractors: "DQ", hintAfter: 1, proof: false, shuffle: false, evenSpacing: false },
  },
  "3-5": {
    en: { lines: ["big book"], caseSplit: false, distractors: "dpq", hintAfter: 3, proof: true, shuffle: false, evenSpacing: false },
    es: { lines: ["un libro"], caseSplit: false, distractors: "dpq", hintAfter: 3, proof: true, shuffle: false, evenSpacing: false },
  },
  "6-8": {
    en: { lines: ["Print a page", "for every town"], width: 16, caseSplit: true, distractors: "bdqT", hintAfter: null, proof: true, shuffle: false, evenSpacing: false },
    es: { lines: ["Imprime una hoja", "para cada pueblo"], width: 18, caseSplit: true, distractors: "bdqT", hintAfter: null, proof: true, shuffle: false, evenSpacing: false },
  },
  "9-12": {
    en: { lines: ["Print many pages", "for every town in", "the whole world"], width: 18, caseSplit: true, distractors: "bdqPT", hintAfter: null, proof: true, shuffle: true, evenSpacing: true },
    es: { lines: ["Imprime más hojas", "para cada pueblo", "del mundo entero"], width: 20, caseSplit: true, distractors: "bdqñP", hintAfter: null, proof: true, shuffle: true, evenSpacing: true },
  },
};

// ---------------------------------------------------------------------------
// Printing: how many good sheets each band prints, and how tight the targets are.
// ---------------------------------------------------------------------------

export interface PressConfig {
  sheets: number;
  /** Ink added per dab (0-100 scale), with a little random variation. */
  inkPerDab: number;
  inkJitter: number;
  /** Good range for ink; null means any full inking is good (no failure). */
  inkZone: [number, number] | null;
  /** Pressure gained per second while holding the bar. */
  pullRate: number;
  pullZone: [number, number] | null;
  showTimer: boolean;
}

export const PRESS: Record<Band, PressConfig> = {
  "K-2": { sheets: 1, inkPerDab: 25, inkJitter: 0, inkZone: null, pullRate: 80, pullZone: null, showTimer: false },
  // Pull windows: 3-5 ≈ 0.6 s, 6-8 ≈ 0.33 s, 9-12 ≈ 0.23 s to let go in the zone.
  "3-5": { sheets: 2, inkPerDab: 15, inkJitter: 0, inkZone: [50, 90], pullRate: 55, pullZone: [55, 90], showTimer: false },
  "6-8": { sheets: 3, inkPerDab: 12, inkJitter: 3, inkZone: [60, 85], pullRate: 60, pullZone: [65, 85], showTimer: false },
  "9-12": { sheets: 4, inkPerDab: 12, inkJitter: 4, inkZone: [65, 82], pullRate: 70, pullZone: [68, 84], showTimer: true },
};
