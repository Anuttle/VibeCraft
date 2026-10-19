import { Band, Line } from "../../i18n/types";
import { Chapter } from "../../game/quest";
import type { HoldConfig, MixConfig, PerBandLang, QuizConfig, SequenceConfig } from "../../game/activities";
import { INK_PAPER_WORLD } from "../../game/world";
import type { GlossaryEntry } from "../glossaryTypes";

// Chapter 3: Ink & Paper. Mainz, c. 1450.
//
// Historical notes for reviewers:
// - Scribes' inks were water-based (iron-gall or carbon in gum and water) and
//   don't take well on metal type; printers' ink was oil-based, a varnish of
//   boiled linseed oil with lampblack (high confidence).
// - "Painters already knew oil" is the usual explanation for where the idea
//   came from (medium confidence; told as Gutenberg's teaching line).
// - Analyses of Gutenberg Bible ink (e.g. PIXE studies at UC Davis, 1980s)
//   found copper, lead and titanium; why they are there is not fully settled
//   (high confidence on the finding, hedged as "scientists who studied").
// - Resin in the 6-8/9-12 ink ratio activity reflects later printers' ink
//   recipes; the percentages are game targets, not a documented recipe.
// - European paper was linen-rag paper: rags soaked/fermented, beaten by
//   water-powered stamping hammers, pulp in a vat, wire mould, couched onto
//   felt, pressed in a screw press, dried, sized in gelatin (high confidence).
// - Paper came from China through the Islamic world (Samarkand, Baghdad) and
//   reached Spain by the 1100s (high confidence; "about" used in T2).
//   Mills spread to Italy, France and the German lands later (Nuremberg 1390).
// - Historians think much of the B42 paper was Italian, from watermark
//   evidence (medium-high confidence, hedged). Some copies were printed on
//   vellum (high confidence; exact split of paper vs vellum copies not given).
// - Paper was much cheaper than parchment (high confidence; no prices given).
// - Marta is fictional and represents papermakers of the time; she does not
//   claim to supply Gutenberg's actual paper.
// - Gutenberg's lines are written for teaching; they are not quotations.

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };
const GUTENBERG_SPEAKER: Line = { en: "Johannes Gutenberg", es: "Johannes Gutenberg" };
const MARTA_SPEAKER: Line = { en: "Marta the papermaker", es: "Marta, la papelera" };
const UPPER_BANDS: Band[] = ["6-8", "9-12"];

// ---------------------------------------------------------------------------
// Ink bench: choose ingredients (pick) or balance them (ratio).
// ---------------------------------------------------------------------------

const SOOT_EMOJI = "🖤";
const OIL_EMOJI = "🌾";

const INK: PerBandLang<MixConfig> = {
  "K-2": {
    en: {
      instruction: "Pick the two things for sticky printing ink.",
      ingredients: [
        { id: "soot", label: "Black soot", emoji: SOOT_EMOJI },
        { id: "water", label: "Water", emoji: "💧" },
        { id: "oil", label: "Linseed oil", emoji: OIL_EMOJI },
        { id: "milk", label: "Milk", emoji: "🥛" },
        { id: "honey", label: "Honey", emoji: "🍯" },
      ],
      correct: ["soot", "oil"],
      hints: {
        soot: { low: "We need soot. It makes the ink black.", high: "Soot is good. Keep it." },
        oil: { low: "We need oil. It makes the ink sticky.", high: "Oil is good. Keep it." },
        water: { low: "Leave the water out.", high: "Water runs off metal letters. Take it out." },
        milk: { low: "Leave the milk out.", high: "Milk is runny. It would go bad, too!" },
        honey: { low: "Leave the honey out.", high: "Honey is sticky, but it never dries. Take it out." },
      },
      success: "Yes! Soot and oil make sticky black ink.",
    },
    es: {
      instruction: "Elige las dos cosas para la tinta pegajosa.",
      ingredients: [
        { id: "soot", label: "Hollín negro", emoji: SOOT_EMOJI },
        { id: "water", label: "Agua", emoji: "💧" },
        { id: "oil", label: "Aceite de linaza", emoji: OIL_EMOJI },
        { id: "milk", label: "Leche", emoji: "🥛" },
        { id: "honey", label: "Miel", emoji: "🍯" },
      ],
      correct: ["soot", "oil"],
      hints: {
        soot: { low: "Falta el hollín. Hace negra la tinta.", high: "El hollín va. Déjalo." },
        oil: { low: "Falta el aceite. Hace pegajosa la tinta.", high: "El aceite va. Déjalo." },
        water: { low: "El agua no va.", high: "El agua se escurre de las letras de metal. Sácala." },
        milk: { low: "La leche no va.", high: "La leche es aguada. ¡Y se echa a perder!" },
        honey: { low: "La miel no va.", high: "La miel es pegajosa, pero nunca se seca. Sácala." },
      },
      success: "¡Sí! El hollín y el aceite hacen una tinta negra y pegajosa.",
    },
  },
  "3-5": {
    en: {
      instruction: "Choose the ingredients for printer's ink. It must stick to metal type and print dark.",
      ingredients: [
        { id: "soot", label: "Lampblack (soot)", emoji: SOOT_EMOJI },
        { id: "water", label: "Water", emoji: "💧" },
        { id: "sand", label: "Sand", emoji: "🏖️" },
        { id: "oil", label: "Linseed oil", emoji: OIL_EMOJI },
        { id: "milk", label: "Milk", emoji: "🥛" },
        { id: "honey", label: "Honey", emoji: "🍯" },
      ],
      correct: ["soot", "oil"],
      hints: {
        soot: { low: "Add lampblack. This fine soot gives the ink its deep black color.", high: "Lampblack belongs in the ink." },
        oil: { low: "Add linseed oil. Boiled, it turns thick and sticky, so it clings to metal.", high: "Linseed oil belongs in the ink." },
        water: { low: "Water stays out.", high: "Scribes' ink used water, but on metal type it beads up and runs. That is why printers switched to oil." },
        sand: { low: "Sand stays out.", high: "Sand would scratch the type and make lumps on the page." },
        milk: { low: "Milk stays out.", high: "Milk is mostly water, so it would run, and it spoils quickly." },
        honey: { low: "Honey stays out.", high: "Honey is sticky, but it mixes with water and never dries hard on paper." },
      },
      success: "Correct! Lampblack in boiled linseed oil makes a sticky, oil-based ink that clings to metal type.",
    },
    es: {
      instruction: "Elige los ingredientes de la tinta de imprenta. Debe pegarse a los tipos de metal e imprimir oscuro.",
      ingredients: [
        { id: "soot", label: "Negro de humo (hollín)", emoji: SOOT_EMOJI },
        { id: "water", label: "Agua", emoji: "💧" },
        { id: "sand", label: "Arena", emoji: "🏖️" },
        { id: "oil", label: "Aceite de linaza", emoji: OIL_EMOJI },
        { id: "milk", label: "Leche", emoji: "🥛" },
        { id: "honey", label: "Miel", emoji: "🍯" },
      ],
      correct: ["soot", "oil"],
      hints: {
        soot: { low: "Agrega negro de humo. Este hollín fino le da a la tinta su color negro intenso.", high: "El negro de humo sí va en la tinta." },
        oil: { low: "Agrega aceite de linaza. Al hervirlo, se pone espeso y pegajoso, y se queda en el metal.", high: "El aceite de linaza sí va en la tinta." },
        water: { low: "El agua no va.", high: "La tinta de los copistas llevaba agua, pero en los tipos de metal forma gotas y se escurre. Por eso los impresores usaron aceite." },
        sand: { low: "La arena no va.", high: "La arena rayaría los tipos y dejaría grumos en la página." },
        milk: { low: "La leche no va.", high: "La leche es casi toda agua, así que se escurriría, y además se echa a perder pronto." },
        honey: { low: "La miel no va.", high: "La miel es pegajosa, pero se mezcla con agua y nunca se seca bien en el papel." },
      },
      success: "¡Correcto! El negro de humo en aceite de linaza hervido forma una tinta a base de aceite, pegajosa, que se queda en los tipos de metal.",
    },
  },
  "6-8": {
    en: {
      instruction: "Balance the printer's ink. Set the percentage of each ingredient. The total must be 100%.",
      ingredients: [
        { id: "soot", label: "Lampblack", emoji: SOOT_EMOJI },
        { id: "oil", label: "Boiled linseed oil", emoji: OIL_EMOJI },
        { id: "resin", label: "Resin", emoji: "🟠" },
      ],
      targets: { soot: [15, 35], oil: [60, 85], resin: [0, 15] },
      hints: {
        soot: { low: "Too little lampblack. The ink is thin and prints gray.", high: "Too much lampblack. The ink is stiff and clumpy, and it clogs the letters." },
        oil: { low: "Too little oil. The ink is a dry, clumpy paste that won't spread evenly.", high: "Too much oil. The ink is runny and pale, and it smears around the letters." },
        resin: { low: "A little resin is fine to leave out.", high: "Too much resin. The ink gets so sticky it pulls bits off the paper." },
      },
      success: "Good ink! Mostly thick linseed oil varnish, with enough soot to print deep black. Exact recipes varied from shop to shop.",
    },
    es: {
      instruction: "Equilibra la tinta de imprenta. Ajusta el porcentaje de cada ingrediente. El total debe ser 100%.",
      ingredients: [
        { id: "soot", label: "Negro de humo", emoji: SOOT_EMOJI },
        { id: "oil", label: "Aceite de linaza hervido", emoji: OIL_EMOJI },
        { id: "resin", label: "Resina", emoji: "🟠" },
      ],
      targets: { soot: [15, 35], oil: [60, 85], resin: [0, 15] },
      hints: {
        soot: { low: "Muy poco negro de humo. La tinta queda aguada y se imprime gris.", high: "Demasiado negro de humo. La tinta queda dura y grumosa, y tapa las letras." },
        oil: { low: "Muy poco aceite. La tinta es una pasta seca y grumosa que no se extiende bien.", high: "Demasiado aceite. La tinta queda aguada y pálida, y mancha alrededor de las letras." },
        resin: { low: "Está bien dejar fuera la resina.", high: "Demasiada resina. La tinta se pone tan pegajosa que arranca pedacitos del papel." },
      },
      success: "¡Buena tinta! Sobre todo barniz espeso de aceite de linaza, con suficiente hollín para imprimir bien negro. Las recetas exactas cambiaban de un taller a otro.",
    },
  },
  "9-12": {
    en: {
      instruction: "Formulate a printer's ink that is tacky enough to coat metal evenly, dark on the page, and not so stiff that it clogs fine strokes. The total must be 100%.",
      ingredients: [
        { id: "soot", label: "Lampblack", emoji: SOOT_EMOJI },
        { id: "oil", label: "Boiled linseed oil", emoji: OIL_EMOJI },
        { id: "resin", label: "Resin", emoji: "🟠" },
      ],
      targets: { soot: [20, 30], oil: [60, 75], resin: [5, 15] },
      hints: {
        soot: { low: "Too little pigment. The impression looks gray and uneven.", high: "Too much pigment. The ink turns short and clumpy, filling in the counters of letters like e and o." },
        oil: { low: "Too little varnish. The pigment isn't fully bound, so the ink is gritty and rubs off.", high: "Too much varnish. The ink is thin and oily, spreading past the edges of each letter." },
        resin: { low: "Too little resin. The ink lacks tack and may not transfer cleanly from the type.", high: "Too much resin. The ink grows so tacky that it picks fibers from the paper's surface." },
      },
      success: "Well formulated. Printers' ink was essentially a varnish of boiled linseed oil carrying lampblack; resin appears in later recipes. These percentages are a workshop target, not a documented formula.",
    },
    es: {
      instruction: "Formula una tinta de imprenta lo bastante pegajosa para cubrir el metal de manera pareja, oscura en la página y no tan dura que tape los trazos finos. El total debe ser 100%.",
      ingredients: [
        { id: "soot", label: "Negro de humo", emoji: SOOT_EMOJI },
        { id: "oil", label: "Aceite de linaza hervido", emoji: OIL_EMOJI },
        { id: "resin", label: "Resina", emoji: "🟠" },
      ],
      targets: { soot: [20, 30], oil: [60, 75], resin: [5, 15] },
      hints: {
        soot: { low: "Muy poco pigmento. La impresión se ve gris y dispareja.", high: "Demasiado pigmento. La tinta se vuelve corta y grumosa, y llena los huecos de letras como la e y la o." },
        oil: { low: "Muy poco barniz. El pigmento no queda bien ligado, así que la tinta es arenosa y se borra al frotarla.", high: "Demasiado barniz. La tinta queda delgada y grasosa, y se extiende más allá del borde de cada letra." },
        resin: { low: "Muy poca resina. A la tinta le falta adherencia y quizá no pase limpia desde los tipos.", high: "Demasiada resina. La tinta se vuelve tan pegajosa que arranca fibras de la superficie del papel." },
      },
      success: "Bien formulada. La tinta de imprenta era, en esencia, un barniz de aceite de linaza hervido con negro de humo; la resina aparece en recetas posteriores. Estos porcentajes son una meta del taller, no una fórmula documentada.",
    },
  },
};

// ---------------------------------------------------------------------------
// Vat: order the papermaking steps.
// ---------------------------------------------------------------------------

const VAT: PerBandLang<SequenceConfig> = {
  "K-2": {
    en: {
      instruction: "Put the paper steps in order.",
      items: [
        { text: "Soak and beat the old rags", emoji: "🧶" },
        { text: "Dip the screen in the vat", emoji: "🪣" },
        { text: "Hang the paper to dry", emoji: "☀️" },
      ],
      success: "You made paper! Rags, then the vat, then drying.",
    },
    es: {
      instruction: "Ordena los pasos para hacer papel.",
      items: [
        { text: "Remojar y golpear los trapos viejos", emoji: "🧶" },
        { text: "Meter la malla en la tina", emoji: "🪣" },
        { text: "Colgar el papel para que se seque", emoji: "☀️" },
      ],
      success: "¡Hiciste papel! Primero los trapos, luego la tina y al final el secado.",
    },
  },
  "3-5": {
    en: {
      instruction: "Put the steps for making rag paper in order.",
      items: [
        { text: "Soak the linen rags in water", emoji: "🧶" },
        { text: "Beat the rags into pulp", emoji: "🔨" },
        { text: "Dip the mould in the vat and lift out a sheet", emoji: "🪣" },
        { text: "Hang the sheets to dry", emoji: "☀️" },
      ],
      success: "Correct! Old cloth becomes pulp, pulp becomes a sheet, and the sheet dries into paper.",
    },
    es: {
      instruction: "Ordena los pasos para hacer papel de trapo.",
      items: [
        { text: "Remojar los trapos de lino en agua", emoji: "🧶" },
        { text: "Golpear los trapos hasta hacer pulpa", emoji: "🔨" },
        { text: "Meter el molde en la tina y sacar una hoja", emoji: "🪣" },
        { text: "Colgar las hojas para que se sequen", emoji: "☀️" },
      ],
      success: "¡Correcto! La tela vieja se vuelve pulpa, la pulpa se vuelve hoja y la hoja se seca hasta ser papel.",
    },
  },
  "6-8": {
    en: {
      instruction: "Put the six steps of papermaking in order.",
      items: [
        { text: "Soak the linen rags until they soften", emoji: "🧶" },
        { text: "Pound the rags into pulp with water-powered hammers", emoji: "🔨" },
        { text: "Dip the wire mould into the vat of pulp", emoji: "🪣" },
        { text: "Turn the wet sheet out onto a felt", emoji: "🟫" },
        { text: "Squeeze the stack of sheets and felts in a screw press", emoji: "🗜️" },
        { text: "Hang the sheets up to dry", emoji: "☀️" },
      ],
      success: "Correct! From rags to pulp, from the mould to the felt, then pressing and drying.",
    },
    es: {
      instruction: "Ordena los seis pasos para hacer papel.",
      items: [
        { text: "Remojar los trapos de lino hasta que se ablanden", emoji: "🧶" },
        { text: "Golpear los trapos con martillos movidos por agua hasta hacer pulpa", emoji: "🔨" },
        { text: "Meter el molde de alambre en la tina con pulpa", emoji: "🪣" },
        { text: "Voltear la hoja mojada sobre un fieltro", emoji: "🟫" },
        { text: "Apretar la pila de hojas y fieltros en una prensa de tornillo", emoji: "🗜️" },
        { text: "Colgar las hojas para que se sequen", emoji: "☀️" },
      ],
      success: "¡Correcto! De los trapos a la pulpa, del molde al fieltro, y luego el prensado y el secado.",
    },
  },
  "9-12": {
    en: {
      instruction: "Order the seven stages of making printing paper, from rag to finished sheet.",
      items: [
        { text: "Sort and soak linen rags until the fibers loosen", emoji: "🧶" },
        { text: "Beat the rags into pulp with water-powered stamping hammers", emoji: "🔨" },
        { text: "Dip the mould into the vat and shake the fibers into an even layer", emoji: "🪣" },
        { text: "Couch the sheet onto a damp felt and build a stack", emoji: "🟫" },
        { text: "Press the stack in a screw press to force out water", emoji: "🗜️" },
        { text: "Hang the sheets to dry", emoji: "☀️" },
        { text: "Size the sheets in gelatin so ink won't spread", emoji: "🫕" },
      ],
      success: "Correct! Sizing comes after drying; it seals the surface so the oil-based ink prints crisply.",
    },
    es: {
      instruction: "Ordena las siete etapas para hacer papel de imprenta, del trapo a la hoja terminada.",
      items: [
        { text: "Clasificar y remojar los trapos de lino hasta que se aflojen las fibras", emoji: "🧶" },
        { text: "Golpear los trapos con mazos movidos por agua hasta hacer pulpa", emoji: "🔨" },
        { text: "Meter el molde en la tina y agitarlo para repartir las fibras", emoji: "🪣" },
        { text: "Pasar la hoja a un fieltro húmedo y formar una pila", emoji: "🟫" },
        { text: "Prensar la pila en una prensa de tornillo para sacar el agua", emoji: "🗜️" },
        { text: "Colgar las hojas para que se sequen", emoji: "☀️" },
        { text: "Encolar las hojas con gelatina para que la tinta no se extienda", emoji: "🫕" },
      ],
      success: "¡Correcto! El encolado va después del secado; sella la superficie para que la tinta a base de aceite se imprima nítida.",
    },
  },
};

// ---------------------------------------------------------------------------
// Paper press: squeeze the water out of the stack.
// Windows: 3-5 = 35/50 = 0.70 s, 6-8 = 20/55 ≈ 0.36 s, 9-12 = 15/60 = 0.25 s.
// ---------------------------------------------------------------------------

const SQUEEZE_EN = {
  meterLabel: "Pressure",
  buttonLabel: "Squeeze",
  emoji: "🗜️",
  good: "Just right! The water is out and the sheets are whole.",
  low: "Not enough. The sheets are still too wet.",
  high: "Too hard! The sheets got crushed and torn.",
};
const SQUEEZE_ES = {
  meterLabel: "Presión",
  buttonLabel: "Apretar",
  emoji: "🗜️",
  good: "¡Justo! Salió el agua y las hojas están enteras.",
  low: "Falta presión. Las hojas siguen muy mojadas.",
  high: "¡Demasiado fuerte! Las hojas se aplastaron y se rompieron.",
};

const PAPERPRESS: PerBandLang<HoldConfig> = {
  "K-2": {
    en: { ...SQUEEZE_EN, instruction: "Hold the button to squeeze the water out of the paper.", zone: null, rate: 50, rounds: 1 },
    es: { ...SQUEEZE_ES, instruction: "Mantén presionado el botón para sacarle el agua al papel.", zone: null, rate: 50, rounds: 1 },
  },
  "3-5": {
    en: { ...SQUEEZE_EN, instruction: "Hold to squeeze. Let go when enough water is out, before the sheets tear. Press 2 stacks.", zone: [50, 85], rate: 50, rounds: 2 },
    es: { ...SQUEEZE_ES, instruction: "Mantén presionado para apretar. Suelta cuando haya salido suficiente agua, antes de que se rompan las hojas. Prensa 2 pilas.", zone: [50, 85], rate: 50, rounds: 2 },
  },
  "6-8": {
    en: { ...SQUEEZE_EN, instruction: "Turn the screw to press the stack. Stop when the water is out but the sheets are unharmed. Press 3 stacks.", zone: [60, 80], rate: 55, rounds: 3 },
    es: { ...SQUEEZE_ES, instruction: "Gira el tornillo para prensar la pila. Detente cuando salga el agua sin dañar las hojas. Prensa 3 pilas.", zone: [60, 80], rate: 55, rounds: 3 },
  },
  "9-12": {
    en: { ...SQUEEZE_EN, instruction: "Press each stack firmly enough to remove the water and bind the fibers, but stop before the sheets crush. Press 4 stacks.", zone: [65, 80], rate: 60, rounds: 4 },
    es: { ...SQUEEZE_ES, instruction: "Prensa cada pila con la fuerza suficiente para sacar el agua y unir las fibras, pero detente antes de aplastar las hojas. Prensa 4 pilas.", zone: [65, 80], rate: 60, rounds: 4 },
  },
};

// ---------------------------------------------------------------------------
// Journal check
// ---------------------------------------------------------------------------

const JOURNAL_CHECK: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Let's remember how we made ink and paper.",
      items: [
        {
          kind: "choice",
          prompt: "What makes printing ink stick to metal letters?",
          options: [
            { text: "Oil", emoji: "🌾" },
            { text: "Water", emoji: "💧" },
            { text: "Milk", emoji: "🥛" },
          ],
          answer: 0,
          explain: "Oil makes the ink thick and sticky. Water just runs off metal.",
        },
        {
          kind: "choice",
          prompt: "What was the paper made from?",
          options: [
            { text: "Old cloth rags", emoji: "🧶" },
            { text: "Trees", emoji: "🌲" },
          ],
          answer: 0,
          explain: "Back then, paper was made from old cloth. Paper from trees came much later.",
        },
        {
          kind: "choice",
          prompt: "Why do we squeeze the wet paper?",
          options: [
            { text: "To get the water out", emoji: "💧" },
            { text: "To make it colorful", emoji: "🌈" },
          ],
          answer: 0,
          explain: "Squeezing pushes the water out. Then the paper can dry.",
        },
      ],
    },
    es: {
      intro: "Recordemos cómo hicimos la tinta y el papel.",
      items: [
        {
          kind: "choice",
          prompt: "¿Qué hace que la tinta se pegue a las letras de metal?",
          options: [
            { text: "El aceite", emoji: "🌾" },
            { text: "El agua", emoji: "💧" },
            { text: "La leche", emoji: "🥛" },
          ],
          answer: 0,
          explain: "El aceite hace la tinta espesa y pegajosa. El agua se escurre del metal.",
        },
        {
          kind: "choice",
          prompt: "¿De qué se hacía el papel?",
          options: [
            { text: "De trapos viejos", emoji: "🧶" },
            { text: "De árboles", emoji: "🌲" },
          ],
          answer: 0,
          explain: "En esa época, el papel se hacía con tela vieja. El papel de árboles llegó mucho después.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué apretamos el papel mojado?",
          options: [
            { text: "Para sacarle el agua", emoji: "💧" },
            { text: "Para darle colores", emoji: "🌈" },
          ],
          answer: 0,
          explain: "Al apretar, sale el agua. Así el papel se puede secar.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Show what you learned about ink and paper.",
      items: [
        {
          kind: "choice",
          prompt: "Why didn't scribes' ink work well for printing?",
          options: [
            { text: "It was water-based, so it beaded up and ran off metal type" },
            { text: "It was much too expensive" },
            { text: "It was the wrong color" },
          ],
          answer: 0,
          explain: "Scribes' ink was made with water. It worked with a quill, but it would not stick to metal, so printers used an oil-based ink.",
        },
        {
          kind: "choice",
          prompt: "What was European paper made from in Gutenberg's time?",
          options: [{ text: "Wood chips" }, { text: "Linen rags" }, { text: "Papyrus reeds" }],
          answer: 1,
          explain: "Paper was made from old linen rags. Papyrus was used in ancient Egypt, and paper from wood came in the 1800s.",
        },
        {
          kind: "choice",
          prompt: "Why was paper so important for printing?",
          options: [
            { text: "It was much cheaper than parchment, so many copies could be printed" },
            { text: "It was much stronger than parchment" },
            { text: "Gutenberg invented it for his press" },
          ],
          answer: 0,
          explain: "Parchment came from animal skins and cost a lot. Cheap paper made it possible to print many copies. Paper came from China long before Gutenberg.",
        },
      ],
    },
    es: {
      intro: "Muestra lo que aprendiste sobre la tinta y el papel.",
      items: [
        {
          kind: "choice",
          prompt: "¿Por qué la tinta de los copistas no servía bien para imprimir?",
          options: [
            { text: "Era a base de agua, así que formaba gotas y se escurría de los tipos de metal" },
            { text: "Era demasiado cara" },
            { text: "Era del color equivocado" },
          ],
          answer: 0,
          explain: "La tinta de los copistas llevaba agua. Funcionaba con la pluma, pero no se pegaba al metal; por eso los impresores usaron tinta a base de aceite.",
        },
        {
          kind: "choice",
          prompt: "¿De qué se hacía el papel europeo en la época de Gutenberg?",
          options: [{ text: "De astillas de madera" }, { text: "De trapos de lino" }, { text: "De juncos de papiro" }],
          answer: 1,
          explain: "El papel se hacía con trapos viejos de lino. El papiro se usaba en el antiguo Egipto, y el papel de madera llegó en el siglo XIX.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué el papel era tan importante para la imprenta?",
          options: [
            { text: "Era mucho más barato que el pergamino, así que se podían imprimir muchas copias" },
            { text: "Era mucho más resistente que el pergamino" },
            { text: "Gutenberg lo inventó para su prensa" },
          ],
          answer: 0,
          explain: "El pergamino se hacía con piel de animales y costaba mucho. El papel barato permitió imprimir muchas copias. El papel venía de China, mucho antes de Gutenberg.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Check your understanding of ink, paper and the printing system.",
      items: [
        {
          kind: "choice",
          prompt: "How did papermaking reach Europe?",
          options: [
            { text: "From China, through the Islamic world, reaching Spain by the 1100s" },
            { text: "Gutenberg invented it in Mainz" },
            { text: "It was invented in ancient Rome" },
          ],
          answer: 0,
          explain: "Paper was invented in China. Papermakers in the Islamic world spread the craft west, and it reached Spain by the 1100s, centuries before Gutenberg.",
        },
        {
          kind: "choice",
          prompt: "Why were sheets sized (dipped in gelatin)?",
          options: [
            { text: "So ink would not spread into the fibers" },
            { text: "To make the paper whiter" },
            { text: "To make the sheets heavier" },
          ],
          answer: 0,
          explain: "Unsized paper soaks up ink like a towel. Gelatin seals the surface, so letters print sharp.",
        },
        {
          kind: "order",
          prompt: "Put these papermaking steps in order.",
          items: [
            "Soak and beat linen rags into pulp",
            "Dip the wire mould into the vat",
            "Turn the sheet out onto a felt",
            "Squeeze the stack in a screw press",
            "Hang the sheets to dry",
          ],
          explain: "Rags become pulp, the mould forms a sheet, the felt holds it, the press removes water, and drying finishes the job.",
        },
        {
          kind: "write",
          prompt: "Explain how metal type, oil-based ink, cheap paper and the press worked together as a system.",
          starters: ["Metal type needed…", "Oil-based ink was important because…", "Without cheap paper…"],
        },
      ],
    },
    es: {
      intro: "Comprueba lo que entendiste sobre la tinta, el papel y el sistema de impresión.",
      items: [
        {
          kind: "choice",
          prompt: "¿Cómo llegó a Europa la fabricación de papel?",
          options: [
            { text: "Desde China, a través del mundo islámico, y llegó a España hacia el siglo XII" },
            { text: "Gutenberg la inventó en Maguncia" },
            { text: "Se inventó en la antigua Roma" },
          ],
          answer: 0,
          explain: "El papel se inventó en China. Los papeleros del mundo islámico llevaron el oficio hacia el oeste, y llegó a España hacia el siglo XII, siglos antes de Gutenberg.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué se encolaban las hojas (se mojaban en gelatina)?",
          options: [
            { text: "Para que la tinta no se extendiera por las fibras" },
            { text: "Para que el papel fuera más blanco" },
            { text: "Para que las hojas pesaran más" },
          ],
          answer: 0,
          explain: "El papel sin encolar absorbe la tinta como una toalla. La gelatina sella la superficie y las letras salen nítidas.",
        },
        {
          kind: "order",
          prompt: "Ordena estos pasos para hacer papel.",
          items: [
            "Remojar y golpear los trapos de lino hasta hacer pulpa",
            "Meter el molde de alambre en la tina",
            "Voltear la hoja sobre un fieltro húmedo",
            "Apretar la pila en una prensa de tornillo",
            "Colgar las hojas para que se sequen",
          ],
          explain: "Los trapos se vuelven pulpa, el molde forma la hoja, el fieltro la recibe, la prensa saca el agua y el secado termina el trabajo.",
        },
        {
          kind: "write",
          prompt: "Explica cómo los tipos de metal, la tinta a base de aceite, el papel barato y la prensa funcionaban juntos como un sistema.",
          starters: ["Los tipos de metal necesitaban…", "La tinta a base de aceite era importante porque…", "Sin papel barato…"],
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Evaluate the evidence about Gutenberg's materials.",
      items: [
        {
          kind: "choice",
          prompt: "How do historians think they know where much of the Gutenberg Bible's paper came from?",
          options: [
            { text: "Watermarks in the sheets point to Italian paper mills" },
            { text: "Gutenberg's surviving receipts list the mills he bought from" },
            { text: "Each sheet is stamped with the name of its city" },
          ],
          answer: 0,
          explain: "Watermarks are faint designs left by wire shapes on the mould, and they identify mills. They suggest much of the paper came from Italy, though no purchase records survive to confirm it.",
        },
        {
          kind: "choice",
          prompt: "What did scientists who analyzed Gutenberg Bible ink find?",
          options: [
            { text: "Metals such as copper, lead and titanium along with the carbon black" },
            { text: "Only soot and water, like scribes' ink" },
            { text: "Gold mixed into every letter" },
          ],
          answer: 0,
          explain: "The ink contained metals as well as carbon. Why they were added is not fully known, which reminds us that the workshop's exact recipe was never written down.",
        },
        {
          kind: "evidence",
          prompt: "Was cheap paper as important to printing as metal type? Choose a claim, pick two pieces of evidence, and explain your reasoning.",
          claims: [
            "Cheap paper was as important to the success of printing as metal type.",
            "Metal type was more important to the success of printing than cheap paper.",
          ],
          evidence: [
            { text: "Paper cost far less than parchment, which needed the skins of many animals for one large book.", supports: [0] },
            { text: "Printing hundreds of copies of a book uses enormous amounts of writing material.", supports: [0] },
            { text: "Some Gutenberg Bibles were printed on vellum, so printing could work without paper, though at great cost.", supports: [1] },
            { text: "Paper had been made in Europe for centuries before printing, yet books were still copied by hand.", supports: [1] },
            { text: "Cast metal sorts made it possible to set pages quickly and reuse the letters.", supports: [1] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
    es: {
      intro: "Evalúa las pruebas sobre los materiales de Gutenberg.",
      items: [
        {
          kind: "choice",
          prompt: "¿Cómo creen saber los historiadores de dónde vino gran parte del papel de la Biblia de Gutenberg?",
          options: [
            { text: "Las filigranas de las hojas apuntan a molinos de papel italianos" },
            { text: "Los recibos de Gutenberg que se conservan nombran los molinos" },
            { text: "Cada hoja lleva sellado el nombre de su ciudad" },
          ],
          answer: 0,
          explain: "Las filigranas son dibujos tenues que dejan figuras de alambre en el molde, e identifican a los molinos. Sugieren que gran parte del papel vino de Italia, aunque no se conservan registros de compra que lo confirmen.",
        },
        {
          kind: "choice",
          prompt: "¿Qué encontraron los científicos que analizaron la tinta de la Biblia de Gutenberg?",
          options: [
            { text: "Metales como cobre, plomo y titanio, además del negro de humo" },
            { text: "Solo hollín y agua, como la tinta de los copistas" },
            { text: "Oro mezclado en cada letra" },
          ],
          answer: 0,
          explain: "La tinta contenía metales además de carbón. No se sabe del todo por qué estaban ahí, lo que nos recuerda que la receta exacta del taller nunca se escribió.",
        },
        {
          kind: "evidence",
          prompt: "¿Fue el papel barato tan importante para la imprenta como los tipos de metal? Elige una afirmación, escoge dos pruebas y explica tu razonamiento.",
          claims: [
            "El papel barato fue tan importante para el éxito de la imprenta como los tipos de metal.",
            "Los tipos de metal fueron más importantes para el éxito de la imprenta que el papel barato.",
          ],
          evidence: [
            { text: "El papel costaba mucho menos que el pergamino, que necesitaba la piel de muchos animales para un libro grande.", supports: [0] },
            { text: "Imprimir cientos de copias de un libro gasta una enorme cantidad de material para escribir.", supports: [0] },
            { text: "Algunas Biblias de Gutenberg se imprimieron en vitela, así que se podía imprimir sin papel, aunque con un costo muy alto.", supports: [1] },
            { text: "En Europa se hacía papel desde siglos antes de la imprenta, y aun así los libros se copiaban a mano.", supports: [1] },
            { text: "Los tipos de metal fundidos permitían componer páginas rápido y reutilizar las letras.", supports: [1] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Chapter
// ---------------------------------------------------------------------------

export const INK_PAPER_CHAPTER: Chapter = {
  id: "ink-paper",
  world: INK_PAPER_WORLD,
  activities: {
    ink: { kind: "mix", title: { en: "Printer's ink", es: "Tinta de imprenta" }, icon: "🫙", config: INK },
    vat: { kind: "sequence", title: { en: "Making paper", es: "Hacer papel" }, icon: "🪣", config: VAT },
    paperpress: { kind: "hold", title: { en: "Paper press", es: "Prensa de papel" }, icon: "🗜️", config: PAPERPRESS },
  },
  journal: JOURNAL_CHECK,
  steps: [
    {
      id: "intro",
      dialogue: [
        {
          id: "inkpaper.intro",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "You are in Gutenberg's shop again. He has metal letters now. Next he needs ink. He needs paper, too!",
              T2: "You are back in Gutenberg's workshop in Mainz. The metal letters are ready, but printing needs two more things: the right ink and plenty of paper.",
              T3: "Back in Mainz, the metal type is ready. But type alone cannot make a book. Gutenberg still needs an ink that will stick to metal, and a large supply of paper to print on.",
              T4: "Back in Mainz, the workshop now has its metal type. Yet type is only one part of a printing system: Gutenberg also needs an ink that will cling to metal and a steady supply of paper cheap enough to print hundreds of sheets.",
            },
            es: {
              T1: "Vuelves al taller de Gutenberg. Ya tiene letras de metal. Ahora necesita tinta. ¡Y también papel!",
              T2: "Vuelves al taller de Gutenberg en Maguncia. Las letras de metal ya están hechas, pero para imprimir hacen falta dos cosas más: la tinta correcta y mucho papel.",
              T3: "De vuelta en Maguncia, los tipos de metal ya están hechos. Pero los tipos solos no hacen un libro. Gutenberg todavía necesita una tinta que se pegue al metal y mucho papel para imprimir.",
              T4: "De vuelta en Maguncia, el taller ya cuenta con sus tipos de metal. Sin embargo, los tipos son solo una parte del sistema de impresión: Gutenberg también necesita una tinta que se adhiera al metal y un suministro constante de papel lo bastante barato para imprimir cientos de hojas.",
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
      id: "ink",
      dialogue: [
        {
          id: "inkpaper.water",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Watch this. I put scribe's ink on metal. See? It runs off. It makes little beads. We need a sticky *ink*.",
              T2: "Watch what happens when I brush scribe's ink onto metal type. It is made with water, so it beads up and runs off. On paper it would smear. We need a thicker, stickier *ink*.",
              T3: "Watch closely. Scribes write with a water-based ink, which flows nicely from a quill onto parchment. But on smooth metal *type* it beads up like rain on a window, and under the press it would blur and run. For printing we need a different kind of *ink*: one thick and sticky enough to cling to the metal.",
              T4: "Observe. Scribes use water-based inks, which flow well from a quill and sink into parchment. On polished metal *type*, however, such ink beads up instead of spreading, and under the pressure of the press it would smear and bleed into the paper. Printing demands an entirely different *ink*: one thick and tacky enough to coat the metal in a thin, even film and transfer cleanly to the page.",
            },
            es: {
              T1: "Mira esto. Pongo tinta de copista en el metal. ¿Ves? Se escurre. Forma gotitas. Necesitamos una *tinta* pegajosa.",
              T2: "Mira lo que pasa cuando pongo tinta de copista en los tipos de metal. Está hecha con agua, así que forma gotitas y se escurre. En el papel se correría. Necesitamos una *tinta* más espesa y pegajosa.",
              T3: "Mira con atención. Los copistas escriben con una tinta a base de agua, que corre bien de la pluma al pergamino. Pero sobre los *tipos* de metal, que son lisos, forma gotitas como la lluvia en una ventana, y bajo la prensa se correría y quedaría borrosa. Para imprimir necesitamos otra clase de *tinta*: una tan espesa y pegajosa que se quede en el metal.",
              T4: "Observa. Los copistas usan tintas a base de agua, que fluyen bien de la pluma y penetran en el pergamino. Sobre los *tipos* de metal pulido, en cambio, esa tinta forma gotas en lugar de extenderse, y bajo la presión de la prensa se correría y mancharía el papel. Imprimir exige una *tinta* completamente distinta: lo bastante espesa y pegajosa para cubrir el metal con una capa fina y pareja, y pasar limpiamente a la página.",
            },
          },
        },
        {
          id: "inkpaper.recipe",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "My ink uses oil. It is *linseed oil*. It comes from flax seeds. I add black soot. That is *lampblack*. Now it sticks! Go make some.",
              T2: "My ink is made with oil instead of water. I boil *linseed oil*, which is pressed from flax seeds, until it turns thick like varnish. Then I stir in *lampblack*, the black soot from lamps. Go to the ink bench and make some.",
              T3: "Painters already knew the answer: oil. I boil *linseed oil*, pressed from the seeds of the flax plant, until it thickens into a sticky varnish. Then I grind in *lampblack*, the fine black soot collected from burning lamps. The result clings to metal and prints dark and sharp. Go to the ink bench and mix a batch.",
              T4: "The solution comes from the painters' workshops: oil. *Linseed oil*, pressed from flax seeds, is boiled until it thickens into a tacky varnish, and into it I grind *lampblack*, the fine carbon soot gathered from burning lamps. Too much soot and the ink turns stiff and clumpy; too little and it is thin and gray. Go to the ink bench and find the balance.",
            },
            es: {
              T1: "Mi tinta lleva aceite. Es *aceite de linaza*. Sale de las semillas del lino. Le pongo hollín negro. Es *negro de humo*. ¡Ahora sí se pega! Ve a hacer un poco.",
              T2: "Mi tinta se hace con aceite y no con agua. Hiervo *aceite de linaza*, que se saca de las semillas del lino, hasta que se pone espeso como un barniz. Luego le mezclo *negro de humo*, el hollín negro de las lámparas. Ve a la mesa de tinta y prepara un poco.",
              T3: "Los pintores ya conocían la respuesta: el aceite. Hiervo *aceite de linaza*, que se exprime de las semillas del lino, hasta que se espesa como un barniz pegajoso. Luego le mezclo *negro de humo*, el hollín fino que dejan las lámparas al arder. Así la tinta se queda en el metal y la impresión sale oscura y nítida. Ve a la mesa de tinta y prepara una tanda.",
              T4: "La solución viene de los talleres de los pintores: el aceite. El *aceite de linaza*, exprimido de las semillas del lino, se hierve hasta que se espesa como un barniz pegajoso, y en él muelo *negro de humo*, el fino hollín de carbón que se recoge de las lámparas encendidas. Con demasiado hollín, la tinta queda dura y grumosa; con muy poco, sale aguada y gris. Ve a la mesa de tinta y encuentra el equilibrio.",
            },
          },
        },
      ],
      objective: { type: "station", station: "ink" },
      objectiveText: {
        goal: {
          en: { T1: "Make ink at the ink bench.", T3: "Mix printer's ink at the ink bench." },
          es: { T1: "Haz tinta en la mesa de tinta.", T3: "Prepara tinta de imprenta en la mesa de tinta." },
        },
        hintTouch: { en: "Walk to the ink bench and tap ✋.", es: "Camina a la mesa de tinta y toca ✋." },
        hintMouse: { en: "Walk to the ink bench and press F.", es: "Camina a la mesa de tinta y presiona F." },
      },
    },
    {
      id: "inkScience",
      bands: UPPER_BANDS,
      dialogue: [
        {
          id: "inkpaper.science",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "People still study this ink today. They found tiny bits of metal in it. There is copper and lead.",
              T2: "Scientists who studied the ink in Gutenberg's Bibles found small amounts of metals in it, such as copper and lead. After more than 500 years, the ink is still dark and shiny.",
              T3: "Scientists who studied the ink of Gutenberg's Bibles found that it contained metals such as copper, lead and titanium, not just soot and oil. No one knows the workshop's exact recipe, but after more than 500 years the letters are still black and glossy.",
              T4: "When scientists analyzed the ink of surviving Gutenberg Bibles, they found metals such as copper, lead and titanium alongside the carbon black. The workshop never wrote its recipe down, so it is not fully clear why these ingredients are there, but the ink has stayed strikingly black and glossy for more than five centuries.",
            },
            es: {
              T1: "Hoy todavía se estudia esta tinta. Le encontraron pedacitos de metal. Tiene cobre y plomo.",
              T2: "Los científicos que estudiaron la tinta de las Biblias de Gutenberg encontraron un poco de metales, como cobre y plomo. Después de más de 500 años, la tinta sigue oscura y brillante.",
              T3: "Los científicos que estudiaron la tinta de las Biblias de Gutenberg descubrieron que tenía metales como cobre, plomo y titanio, no solo hollín y aceite. Nadie conoce la receta exacta del taller, pero después de más de 500 años las letras siguen negras y brillantes.",
              T4: "Cuando los científicos analizaron la tinta de las Biblias de Gutenberg que se conservan, hallaron metales como cobre, plomo y titanio junto al negro de carbón. El taller nunca escribió su receta, así que no está del todo claro por qué están ahí esos ingredientes; aun así, la tinta se ha mantenido sorprendentemente negra y brillante durante más de cinco siglos.",
            },
          },
        },
      ],
    },
    {
      id: "marta",
      dialogue: [
        {
          id: "inkpaper.visitor",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Someone is at the door. It is Marta. She makes paper. Go say hello!",
              T2: "A visitor has arrived. Marta is a papermaker, and she has brought sheets of paper for the workshop. Go and talk to her.",
              T3: "A visitor has arrived: Marta, a papermaker, carrying a bundle of fresh sheets. A printer needs far more paper than a scribe ever did. Go and talk to her.",
              T4: "A visitor has arrived: Marta, a papermaker with a bundle of fresh sheets. She is not a historical figure but stands for the skilled papermakers of her time. A press can use up paper far faster than any scribe, so her craft matters as much as the type. Go and talk to her.",
            },
            es: {
              T1: "Alguien llega a la puerta. Es Marta. Ella hace papel. ¡Ve a saludarla!",
              T2: "Llegó una visita. Marta hace papel y trae hojas para el taller. Ve a hablar con ella.",
              T3: "Llegó una visita: Marta, una papelera, con un paquete de hojas nuevas. Un impresor necesita mucho más papel del que jamás usó un copista. Ve a hablar con ella.",
              T4: "Llegó una visita: Marta, una papelera con un paquete de hojas nuevas. No es un personaje histórico, sino que representa a los hábiles papeleros de su época. Una prensa puede gastar papel mucho más rápido que cualquier copista, así que su oficio importa tanto como los tipos. Ve a hablar con ella.",
            },
          },
        },
      ],
      objective: { type: "talk", npcId: "papermaker" },
      objectiveText: {
        goal: { en: "Talk to Marta.", es: "Habla con Marta." },
        hintTouch: { en: "Walk to her and tap 💬.", es: "Camina hacia ella y toca 💬." },
        hintMouse: { en: "Walk to her and press F.", es: "Camina hacia ella y presiona F." },
      },
    },
    {
      id: "vat",
      dialogue: [
        {
          id: "inkpaper.journey",
          speaker: MARTA_SPEAKER,
          text: {
            en: {
              T1: "Hello! I make paper. Paper began in China. It traveled a long way. Now Europe makes paper too.",
              T2: "Hello! I am Marta, and I make paper. Paper was invented in China long ago. Papermakers in the Islamic world learned the craft and carried it west. It reached Spain by about the 1100s, and now there are paper mills across Europe.",
              T3: "Good day! I am Marta, a papermaker. Paper was first made in China more than a thousand years ago. Over the centuries, papermakers in the Islamic world, in cities like Baghdad, learned the craft and carried it west. It reached Spain by the 1100s, and since then mills have spread across Europe.",
              T4: "Good day. I am Marta, a papermaker. Paper was invented in China more than a thousand years ago and travelled west along trade routes, through papermaking centers of the Islamic world such as Samarkand and Baghdad. It had reached Spain by the 1100s, and over the following centuries mills spread to Italy, France and the German lands.",
            },
            es: {
              T1: "¡Hola! Yo hago papel. El papel nació en China. Viajó muy lejos. Ahora en Europa también se hace.",
              T2: "¡Hola! Soy Marta y hago papel. El papel se inventó en China hace mucho tiempo. Los papeleros del mundo islámico aprendieron el oficio y lo llevaron hacia el oeste. Llegó a España hacia el siglo XII, y ahora hay molinos de papel en toda Europa.",
              T3: "¡Buen día! Soy Marta, papelera. El papel se hizo por primera vez en China hace más de mil años. Con los siglos, los papeleros del mundo islámico, en ciudades como Bagdad, aprendieron el oficio y lo llevaron hacia el oeste. Llegó a España hacia el siglo XII, y desde entonces los molinos se han extendido por Europa.",
              T4: "Buen día. Soy Marta, papelera. El papel se inventó en China hace más de mil años y viajó hacia el oeste por las rutas comerciales, a través de centros papeleros del mundo islámico como Samarcanda y Bagdad. Ya había llegado a España en el siglo XII y, en los siglos siguientes, los molinos se extendieron a Italia, Francia y las tierras alemanas.",
            },
          },
        },
        {
          id: "inkpaper.rags",
          speaker: MARTA_SPEAKER,
          text: {
            en: {
              T1: "My paper is made from old cloth. We call it *rag paper*. We soak the rags. Big hammers pound them. They turn into mush. That is *pulp*. Come try the *vat*!",
              T2: "My paper is made from old linen rags, so we call it *rag paper*. First, the rags soak in water. Then big hammers, turned by a water wheel, beat them into a soft mush called *pulp*. We stir the pulp into a *vat* of water and dip a screen to catch a thin sheet.",
              T3: "European paper is *rag paper*, made from worn-out linen cloth. The rags soak until they soften, and then, at the mill, heavy hammers driven by a water wheel pound them into tiny fibers. Mixed with water in a *vat*, the fibers become a soupy *pulp*. Then I dip a *paper mould*, a wooden frame with a fine wire screen, and lift out a thin, even layer of fibers. Come, try the vat.",
              T4: "European paper is *rag paper*, made from discarded linen. The rags are soaked and left to soften, then pounded by heavy stamping hammers, driven by a water wheel, until the cloth breaks down into its individual fibers. Suspended in water in a large *vat*, these fibers form *pulp*. The papermaker dips a *paper mould*, a wooden frame strung with fine wire, lifts it level and shakes it gently so the fibers lock together into a thin, uniform sheet. Come and try the vat.",
            },
            es: {
              T1: "Mi papel se hace con tela vieja. Se llama *papel de trapo*. Mojamos los trapos. Unos martillos grandes los golpean. Se vuelven una pasta. Eso es la *pulpa*. ¡Ven a probar la *tina*!",
              T2: "Mi papel se hace con trapos viejos de lino, por eso lo llamamos *papel de trapo*. Primero, los trapos se remojan en agua. Luego, unos martillos grandes, movidos por una rueda de agua, los golpean hasta formar una pasta blanda llamada *pulpa*. Después echamos la pulpa en una *tina* con agua y metemos una malla para sacar una hoja delgada.",
              T3: "El papel europeo es *papel de trapo*, hecho con tela de lino gastada. Los trapos se remojan hasta ablandarse y, en el molino, unos martillos pesados movidos por una rueda de agua los golpean hasta deshacerlos en fibras diminutas. Mezcladas con agua en una *tina*, las fibras forman una *pulpa* aguada. Después sumerjo un *molde de papel*, un marco de madera con una malla fina de alambre, y saco una capa delgada y pareja de fibras. Ven, prueba en la tina.",
              T4: "El papel europeo es *papel de trapo*, hecho con lino desechado. Los trapos se remojan y se dejan ablandar; después, unos pesados mazos movidos por una rueda de agua los golpean hasta que la tela se deshace en fibras sueltas. Suspendidas en el agua de una gran *tina*, esas fibras forman la *pulpa*. El papelero sumerge un *molde de papel*, un marco de madera con alambre fino, lo saca nivelado y lo agita con suavidad para que las fibras se entrelacen en una hoja delgada y uniforme. Ven a probar la tina.",
            },
          },
        },
      ],
      objective: { type: "station", station: "vat" },
      objectiveText: {
        goal: {
          en: { T1: "Make paper at the vat.", T3: "Put the papermaking steps in order at the vat." },
          es: { T1: "Haz papel en la tina.", T3: "Ordena los pasos para hacer papel en la tina." },
        },
        hintTouch: { en: "Walk to the vat and tap ✋.", es: "Camina a la tina y toca ✋." },
        hintMouse: { en: "Walk to the vat and press F.", es: "Camina a la tina y presiona F." },
      },
    },
    {
      id: "paperpress",
      dialogue: [
        {
          id: "inkpaper.couch",
          speaker: MARTA_SPEAKER,
          text: {
            en: {
              T1: "Now the wet sheets go on cloth. We make a tall stack. Then we squeeze it hard. Out comes the water! Not too hard, though.",
              T2: "Each wet sheet is flipped out of the mould onto a piece of felt. We stack sheets and felts into a tall pile. Then we squeeze the pile in a *screw* press to push out the water. Squeeze firmly, but not too hard!",
              T3: "Each new sheet is turned out of the mould onto a damp felt; papermakers call this couching. Sheet after sheet, felt after felt, the stack grows. Then it goes into a *screw* press, which squeezes out most of the water. Squeeze too little and the sheets stay soggy; squeeze too hard and you can crush or tear them.",
              T4: "Each freshly formed sheet is couched, turned out of the mould onto a damp woollen felt, and the next sheet is laid on another felt above it, until a tall stack, called a post, is built. The post then goes into a *screw* press, which forces out most of the remaining water and presses the fibers more tightly together. Too little pressure leaves the sheets waterlogged; too much can crush or tear them.",
            },
            es: {
              T1: "Ahora las hojas mojadas van sobre tela. Hacemos una pila alta. Luego la apretamos fuerte. ¡Sale el agua! Pero no aprietes de más.",
              T2: "Cada hoja mojada se voltea del molde sobre un fieltro. Apilamos hojas y fieltros hasta formar una pila alta. Luego apretamos la pila en una prensa de *tornillo* para sacar el agua. ¡Aprieta firme, pero no demasiado!",
              T3: "Cada hoja nueva se voltea del molde sobre un fieltro húmedo. Hoja tras hoja, fieltro tras fieltro, la pila crece. Luego va a una prensa de *tornillo*, que exprime casi toda el agua. Si aprietas poco, las hojas siguen empapadas; si aprietas demasiado, puedes aplastarlas o romperlas.",
              T4: "Cada hoja recién formada se pasa del molde a un fieltro de lana húmedo, y la siguiente se coloca sobre otro fieltro encima, hasta formar una pila alta. Después, la pila va a una prensa de *tornillo*, que expulsa casi toda el agua que queda y une más las fibras. Con poca presión, las hojas quedan empapadas; con demasiada, pueden aplastarse o romperse.",
            },
          },
        },
      ],
      objective: { type: "station", station: "paperpress" },
      objectiveText: {
        goal: {
          en: { T1: "Squeeze the stack of paper.", T3: "Press the water out of the stack at the paper press." },
          es: { T1: "Aprieta la pila de papel.", T3: "Saca el agua de la pila en la prensa de papel." },
        },
        hintTouch: { en: "Walk to the paper press and tap ✋.", es: "Camina a la prensa de papel y toca ✋." },
        hintMouse: { en: "Walk to the paper press and press F.", es: "Camina a la prensa de papel y presiona F." },
      },
    },
    {
      id: "dry",
      dialogue: [
        {
          id: "inkpaper.dry",
          speaker: MARTA_SPEAKER,
          text: {
            en: {
              T1: "Now the sheets hang up to dry. Then we dip them in thin glue. Now ink will not spread. Paper costs less than animal skin!",
              T2: "After pressing, the sheets hang up to dry. Then we dip them in gelatin, a kind of thin glue, so ink will not spread. Paper costs much less than parchment, which is made from animal skin.",
              T3: "After pressing, the sheets are hung up to dry. Then each one is dipped in gelatin, a thin glue made from animal parts. This sizing keeps ink from spreading into the fibers like water into cloth. Best of all, paper costs far less than parchment, which is made from animal skins. A printer who wants many copies needs paper.",
              T4: "Once pressed, the sheets are hung to dry and then sized: dipped in a bath of gelatin, a thin glue boiled from animal hides and bones, which seals the surface so that ink sits crisply instead of spreading. Above all, paper is far cheaper than parchment, which requires the skins of many animals for a single large book. Only an inexpensive material makes printing hundreds of copies practical.",
            },
            es: {
              T1: "Ahora las hojas se cuelgan para secarse. Luego las mojamos en pegamento suave. Así la tinta no se corre. ¡El papel cuesta menos que la piel!",
              T2: "Después de prensarlas, las hojas se cuelgan para que se sequen. Luego las mojamos en gelatina, una especie de pegamento suave, para que la tinta no se corra. El papel cuesta mucho menos que el pergamino, que se hace con piel de animal.",
              T3: "Después del prensado, las hojas se cuelgan para que se sequen. Luego cada una se moja en gelatina, un pegamento suave hecho con partes de animales. Este encolado evita que la tinta se extienda por las fibras como el agua en una tela. Y lo mejor: el papel cuesta mucho menos que el pergamino, que se hace con pieles de animales. Un impresor que quiere muchas copias necesita papel.",
              T4: "Una vez prensadas, las hojas se cuelgan a secar y después se encolan: se sumergen en un baño de gelatina, un pegamento suave que se obtiene hirviendo pieles y huesos de animales, y que sella la superficie para que la tinta quede nítida en lugar de extenderse. Sobre todo, el papel es mucho más barato que el pergamino, que exige las pieles de muchos animales para un solo libro grande. Solo un material económico vuelve práctico imprimir cientos de copias.",
            },
          },
        },
      ],
    },
    {
      id: "watermark",
      bands: UPPER_BANDS,
      dialogue: [
        {
          id: "inkpaper.watermark",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Hold paper up to the light. You may see a picture. It is a *watermark*. It shows where the paper was made.",
              T2: "Hold a sheet up to the light and you may see a faint picture, called a *watermark*. It comes from a wire shape on the mould. Historians think much of the paper for Gutenberg's Bible came from Italy. Some copies were printed on *vellum*, a fine calfskin.",
              T3: "Hold a sheet to the light and you may see a faint design, a *watermark*, left by a wire shape sewn onto the mould. By studying watermarks, historians think much of the paper in Gutenberg's Bible came from Italy. A smaller number of copies were printed on *vellum*, fine calfskin, which cost far more.",
              T4: "Held to the light, many sheets reveal a *watermark*, a faint design left by a wire figure attached to the mould's screen and used to identify the mill. From the watermarks in surviving copies, historians think much of the Gutenberg Bible's paper was imported from Italy. Some copies were printed on *vellum*, fine calfskin, a luxury option that greatly increased the cost.",
            },
            es: {
              T1: "Pon el papel frente a la luz. Puede verse un dibujo. Es una *filigrana*. Muestra dónde se hizo el papel.",
              T2: "Pon una hoja frente a la luz y quizá veas un dibujo tenue, llamado *filigrana*. Lo deja una figura de alambre en el molde. Los historiadores creen que gran parte del papel de la Biblia de Gutenberg vino de Italia. Algunas copias se imprimieron en *vitela*, una piel fina de ternero.",
              T3: "Pon una hoja frente a la luz y quizá veas un dibujo tenue, una *filigrana*, que deja una figura de alambre cosida al molde. Al estudiar las filigranas, los historiadores creen que gran parte del papel de la Biblia de Gutenberg vino de Italia. Un número menor de copias se imprimió en *vitela*, piel fina de ternero, que costaba mucho más.",
              T4: "A contraluz, muchas hojas revelan una *filigrana*, un dibujo tenue que deja una figura de alambre sujeta a la malla del molde y que sirve para identificar el molino. Por las filigranas de las copias que se conservan, los historiadores creen que gran parte del papel de la Biblia de Gutenberg se importó de Italia. Algunas copias se imprimieron en *vitela*, piel fina de ternero, una opción de lujo que elevaba mucho el costo.",
            },
          },
        },
      ],
    },
    {
      id: "done",
      dialogue: [
        {
          id: "inkpaper.system",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Now we have it all. We have metal letters. We have sticky ink. We have cheap paper. We have a strong press. Together, they make books!",
              T2: "Now every part is ready: metal *type*, sticky oil *ink*, cheap paper and the press. One part alone is not enough. Working together, they let us print many copies of a book.",
              T3: "Now we have every piece. Metal *type* that we can cast by the thousands, oil-based *ink* that clings to it, affordable paper, and a *printing press* to bring them together. None of these would be enough alone. Together they form a system that can print many identical copies.",
              T4: "Consider what we now have: metal *type* cast in quantity, an oil-based *ink* that clings to it, paper cheap enough to use by the stack, and a *printing press* to join them under even pressure. None of these was sufficient alone; it is their combination, each part suited to the others, that makes it possible to print hundreds of identical copies of a book.",
            },
            es: {
              T1: "Ahora lo tenemos todo. Hay letras de metal. Hay tinta pegajosa. Hay papel barato. Hay una prensa fuerte. ¡Juntos hacen libros!",
              T2: "Ahora todas las partes están hechas: los *tipos* de metal, la *tinta* de aceite pegajosa, el papel barato y la prensa. Una parte sola no basta. Juntas, nos dejan imprimir muchas copias de un libro.",
              T3: "Ahora tenemos todas las piezas: *tipos* de metal que podemos fundir por miles, *tinta* a base de aceite que se queda en ellos, papel económico y una *imprenta* que lo une todo. Ninguna de estas cosas bastaría sola. Juntas forman un sistema que puede imprimir muchas copias idénticas.",
              T4: "Piensa en lo que ahora tenemos: *tipos* de metal fundidos en cantidad, una *tinta* a base de aceite que se adhiere a ellos, papel tan barato que puede usarse por montones y una *imprenta* que los une bajo una presión pareja. Ninguno de estos elementos bastaba por sí solo; es su combinación, con cada parte adaptada a las demás, lo que hace posible imprimir cientos de copias idénticas de un libro.",
            },
          },
        },
      ],
    },
    {
      id: "journal",
      objective: { type: "journal" },
    },
  ],
};

// ---------------------------------------------------------------------------
// Glossary terms introduced in this chapter
// ---------------------------------------------------------------------------

export const GLOSSARY_INK_PAPER: GlossaryEntry[] = [
  {
    id: "linseed-oil",
    emoji: "🌾",
    term: { en: "linseed oil", es: "aceite de linaza" },
    simple: { en: "Oil pressed from flax seeds.", es: "Aceite que se saca de las semillas del lino." },
    full: {
      en: "An oil pressed from the seeds of the flax plant. Boiled until thick and sticky, it was the base of printers' ink.",
      es: "Un aceite que se exprime de las semillas del lino. Hervido hasta quedar espeso y pegajoso, era la base de la tinta de imprenta.",
    },
  },
  {
    id: "lampblack",
    emoji: "🖤",
    term: { en: "lampblack", es: "negro de humo" },
    simple: { en: "Fine black soot from burning lamps.", es: "Hollín negro y fino de las lámparas." },
    full: {
      en: "A fine black powder of carbon collected from the smoke of burning oil or fat. Mixed into boiled linseed oil, it gave printers' ink its color.",
      es: "Un polvo negro y fino de carbón que se recoge del humo de aceite o grasa al arder. Mezclado con aceite de linaza hervido, le daba su color a la tinta de imprenta.",
    },
  },
  {
    id: "rag-paper",
    emoji: "🧶",
    term: { en: "rag paper", es: "papel de trapo" },
    simple: { en: "Paper made from old cloth.", es: "Papel hecho con tela vieja." },
    full: {
      en: "Paper made from the fibers of old linen or cotton rags. It was the usual paper in Europe until paper from wood took over in the 1800s.",
      es: "Papel hecho con las fibras de trapos viejos de lino o algodón. Fue el papel común en Europa hasta que el papel de madera lo reemplazó en el siglo XIX.",
    },
  },
  {
    id: "pulp",
    emoji: "🥣",
    term: { en: "pulp", es: "pulpa" },
    simple: { en: "Soft, wet fibers used to make paper.", es: "Fibras blandas y mojadas para hacer papel." },
    full: {
      en: "A watery mixture of tiny fibers made by beating rags. A papermaker lifts a thin layer of pulp on a mould to form each sheet.",
      es: "Una mezcla aguada de fibras diminutas que se obtiene al golpear trapos. El papelero levanta una capa delgada de pulpa con un molde para formar cada hoja.",
    },
  },
  {
    id: "vat",
    emoji: "🪣",
    term: { en: "vat", es: "tina" },
    aliases: { en: ["vats"], es: ["tinas"] },
    simple: { en: "A big tub of pulp and water.", es: "Un recipiente grande con pulpa y agua." },
    full: {
      en: "A large tub that holds pulp mixed with water. The papermaker dips the mould into the vat to make each sheet.",
      es: "Un recipiente grande que contiene pulpa mezclada con agua. El papelero mete el molde en la tina para hacer cada hoja.",
    },
  },
  {
    id: "paper-mould",
    emoji: "🪟",
    term: { en: "paper mould", es: "molde de papel" },
    aliases: { en: ["paper moulds", "paper mold"], es: ["moldes de papel", "forma"] },
    simple: { en: "A screen in a frame that catches pulp.", es: "Una malla en un marco que atrapa la pulpa." },
    full: {
      en: "A wooden frame with a fine wire screen. Dipped in the vat and lifted out, it catches a thin, even layer of fibers that becomes a sheet of paper.",
      es: "Un marco de madera con una malla fina de alambre. Al meterlo en la tina y sacarlo, atrapa una capa delgada y pareja de fibras que se convierte en una hoja de papel.",
    },
  },
  {
    id: "watermark",
    emoji: "💧",
    term: { en: "watermark", es: "filigrana" },
    aliases: { en: ["watermarks"], es: ["filigranas"] },
    simple: { en: "A faint picture you see when paper is held to light.", es: "Un dibujo tenue que se ve al poner el papel a contraluz." },
    full: {
      en: "A faint design in a sheet of paper, made by a wire shape on the mould. Watermarks help historians tell which mill made a sheet.",
      es: "Un dibujo tenue en una hoja de papel, hecho por una figura de alambre en el molde. Las filigranas ayudan a los historiadores a saber qué molino hizo la hoja.",
    },
  },
  {
    id: "vellum",
    emoji: "🐄",
    term: { en: "vellum", es: "vitela" },
    simple: { en: "Fine writing material made from calfskin.", es: "Material fino para escribir, hecho con piel de ternero." },
    full: {
      en: "A fine kind of parchment made from calfskin. It was beautiful and long-lasting but far more expensive than paper; some Gutenberg Bibles were printed on it.",
      es: "Un tipo fino de pergamino hecho con piel de ternero. Era bello y duradero, pero mucho más caro que el papel; algunas Biblias de Gutenberg se imprimieron en vitela.",
    },
  },
];
