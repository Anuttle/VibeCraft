import { Band, Line } from "../../i18n/types";
import { Chapter } from "../../game/quest";
import type { HoldConfig, MixConfig, PerBandLang, QuizConfig } from "../../game/activities";
import { METAL_WORLD } from "../../game/world";
import type { GlossaryEntry } from "../glossaryTypes";

// Chapter 2: The Metal. Mainz, c. 1450.
//
// Historical notes for reviewers:
// - Punch -> matrix -> adjustable hand mould -> sort is the standard account
//   of Gutenberg's casting method (high confidence as the usual account).
//   Some researchers (e.g. Agüera y Arcas and Needham, 2001) have argued that
//   his earliest type may have been cast with less permanent matrices; the
//   game teaches the standard account and does not date the method precisely.
// - The adjustable width of the mould (narrow i vs wide m, fixed height) is
//   standard knowledge of the hand mould (high confidence as described for
//   early typefounding; no Gutenberg mould survives).
// - Alloy: mostly lead, with tin and antimony. No type known to be
//   Gutenberg's survives, so the recipe is inferred from later practice and
//   analyses (medium confidence that antimony was in his metal). The ratio
//   activity uses later type-metal proportions (about 80% lead, 15% antimony,
//   5% tin) as "a good mix", never as Gutenberg's documented recipe.
// - Properties: lead melts easily; tin improves flow; antimony hardens the
//   metal and makes it expand slightly as it solidifies (standard type-metal
//   knowledge, high confidence).
// - Gutenberg "had worked with metal before": he is linked with metalwork and,
//   in Strasbourg in the late 1430s, a venture making pilgrim mirrors (high
//   confidence on the mirror venture; his exact training is not documented).
// - Printing with movable type existed earlier in China (Bi Sheng, c. 1040)
//   and Korea (metal type, Jikji 1377) (high confidence).
// - "Tens of thousands of sorts" for the Bible is a hedged order of magnitude,
//   not a documented count. The B42 is set in two columns (high confidence).
// - Gutenberg's lines are written for teaching; they are not quotations.

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };
const GUTENBERG_SPEAKER: Line = { en: "Johannes Gutenberg", es: "Johannes Gutenberg" };
const UPPER_BANDS: Band[] = ["6-8", "9-12"];

// ---------------------------------------------------------------------------
// Furnace: choose the metals (pick) or balance the alloy (ratio).
// ---------------------------------------------------------------------------

const LEAD = { en: "Lead", es: "Plomo", emoji: "🔘" };
const TIN = { en: "Tin", es: "Estaño", emoji: "🥫" };
const ANTIMONY = { en: "Antimony", es: "Antimonio", emoji: "🪨" };

const FURNACE: PerBandLang<MixConfig> = {
  "K-2": {
    en: {
      instruction: "Pick the three metals for our letters.",
      ingredients: [
        { id: "lead", label: LEAD.en, emoji: LEAD.emoji },
        { id: "wood", label: "Wood", emoji: "🪵" },
        { id: "tin", label: TIN.en, emoji: TIN.emoji },
        { id: "wax", label: "Wax", emoji: "🕯️" },
        { id: "antimony", label: ANTIMONY.en, emoji: ANTIMONY.emoji },
      ],
      correct: ["lead", "tin", "antimony"],
      hints: {
        lead: { low: "We need lead. It melts easily.", high: "Lead is good. Keep it." },
        tin: { low: "We need tin. It helps the metal flow.", high: "Tin is good. Keep it." },
        antimony: { low: "We need antimony. It makes letters hard.", high: "Antimony is good. Keep it." },
        wood: { low: "Leave the wood out.", high: "Wood burns in the fire! Take it out." },
        wax: { low: "Leave the wax out.", high: "Wax melts, but it is too soft. Take it out." },
      },
      success: "Yes! Lead, tin and antimony. Now we can melt them.",
    },
    es: {
      instruction: "Elige los tres metales para nuestras letras.",
      ingredients: [
        { id: "lead", label: LEAD.es, emoji: LEAD.emoji },
        { id: "wood", label: "Madera", emoji: "🪵" },
        { id: "tin", label: TIN.es, emoji: TIN.emoji },
        { id: "wax", label: "Cera", emoji: "🕯️" },
        { id: "antimony", label: ANTIMONY.es, emoji: ANTIMONY.emoji },
      ],
      correct: ["lead", "tin", "antimony"],
      hints: {
        lead: { low: "Falta el plomo. Se derrite fácil.", high: "El plomo va. Déjalo." },
        tin: { low: "Falta el estaño. Ayuda a que el metal corra.", high: "El estaño va. Déjalo." },
        antimony: { low: "Falta el antimonio. Hace duras las letras.", high: "El antimonio va. Déjalo." },
        wood: { low: "La madera no va.", high: "¡La madera se quema en el fuego! Sácala." },
        wax: { low: "La cera no va.", high: "La cera se derrite, pero es muy blanda. Sácala." },
      },
      success: "¡Sí! Plomo, estaño y antimonio. Ya podemos derretirlos.",
    },
  },
  "3-5": {
    en: {
      instruction: "Choose the metals that go into type metal. Some of these were used in the workshop, but not for the letters themselves.",
      ingredients: [
        { id: "lead", label: LEAD.en, emoji: LEAD.emoji },
        { id: "copper", label: "Copper", emoji: "🪙" },
        { id: "tin", label: TIN.en, emoji: TIN.emoji },
        { id: "wood", label: "Wood", emoji: "🪵" },
        { id: "antimony", label: ANTIMONY.en, emoji: ANTIMONY.emoji },
        { id: "iron", label: "Iron", emoji: "⛓️" },
      ],
      correct: ["lead", "tin", "antimony"],
      hints: {
        lead: { low: "Add lead. It is the main metal because it melts at a low heat.", high: "Lead belongs in the mix." },
        tin: { low: "Add tin. It helps the melted metal flow into every corner of the mould.", high: "Tin belongs in the mix." },
        antimony: { low: "Add antimony. It makes the letters hard enough to last in the press.", high: "Antimony belongs in the mix." },
        copper: { low: "Copper stays out of the mix.", high: "Copper was used for the matrix, the mould for one letter, not for the letters themselves." },
        wood: { low: "Wood stays out of the mix.", high: "Wood can't be melted. It would just burn in the furnace." },
        iron: { low: "Iron stays out of the mix.", high: "Iron needs far more heat to melt than this furnace gives. Hard steel was used for punches instead." },
      },
      success: "Correct! Type metal is mostly lead, with tin and antimony. Copper and steel had other jobs: matrices and punches.",
    },
    es: {
      instruction: "Elige los metales que van en el metal de los tipos. Algunos se usaban en el taller, pero no para las letras.",
      ingredients: [
        { id: "lead", label: LEAD.es, emoji: LEAD.emoji },
        { id: "copper", label: "Cobre", emoji: "🪙" },
        { id: "tin", label: TIN.es, emoji: TIN.emoji },
        { id: "wood", label: "Madera", emoji: "🪵" },
        { id: "antimony", label: ANTIMONY.es, emoji: ANTIMONY.emoji },
        { id: "iron", label: "Hierro", emoji: "⛓️" },
      ],
      correct: ["lead", "tin", "antimony"],
      hints: {
        lead: { low: "Agrega plomo. Es el metal principal porque se derrite con poco calor.", high: "El plomo sí va en la mezcla." },
        tin: { low: "Agrega estaño. Ayuda a que el metal derretido llegue a cada rincón del molde.", high: "El estaño sí va en la mezcla." },
        antimony: { low: "Agrega antimonio. Hace que las letras sean duras y aguanten la prensa.", high: "El antimonio sí va en la mezcla." },
        copper: { low: "El cobre no va en la mezcla.", high: "El cobre se usaba para la matriz, el molde de una letra, no para las letras." },
        wood: { low: "La madera no va en la mezcla.", high: "La madera no se derrite. Solo se quemaría en el horno." },
        iron: { low: "El hierro no va en la mezcla.", high: "El hierro necesita mucho más calor para derretirse. El acero duro se usaba para los punzones." },
      },
      success: "¡Correcto! El metal de los tipos es sobre todo plomo, con estaño y antimonio. El cobre y el acero tenían otras tareas: las matrices y los punzones.",
    },
  },
  "6-8": {
    en: {
      instruction: "Set the percentage of each metal in the type alloy. The total must be 100%.",
      ingredients: [
        { id: "lead", label: LEAD.en, emoji: LEAD.emoji },
        { id: "antimony", label: ANTIMONY.en, emoji: ANTIMONY.emoji },
        { id: "tin", label: TIN.en, emoji: TIN.emoji },
      ],
      targets: { lead: [70, 90], antimony: [5, 25], tin: [0, 15] },
      hints: {
        lead: {
          low: "Not enough lead. Lead is the base: it melts easily. Without enough, the metal is hard to cast and brittle.",
          high: "Too much lead. The letters will be soft and squash flat in the press.",
        },
        antimony: {
          low: "Not enough antimony. The letters will be too soft, and their edges won't come out sharp.",
          high: "Too much antimony. The metal turns brittle, and the letters may crack.",
        },
        tin: {
          low: "Not enough tin. The metal won't flow well into the fine lines of the matrix.",
          high: "Too much tin. Tin was expensive, and too much makes the letters softer.",
        },
      },
      success: "A good mix! Mostly lead, some antimony and a little tin. Later type founders used about 80% lead, 15% antimony and 5% tin.",
    },
    es: {
      instruction: "Ajusta el porcentaje de cada metal en la aleación. El total debe ser 100%.",
      ingredients: [
        { id: "lead", label: LEAD.es, emoji: LEAD.emoji },
        { id: "antimony", label: ANTIMONY.es, emoji: ANTIMONY.emoji },
        { id: "tin", label: TIN.es, emoji: TIN.emoji },
      ],
      targets: { lead: [70, 90], antimony: [5, 25], tin: [0, 15] },
      hints: {
        lead: {
          low: "Falta plomo. El plomo es la base: se derrite fácilmente. Sin suficiente, el metal es difícil de fundir y quebradizo.",
          high: "Demasiado plomo. Las letras quedarán blandas y se aplastarán en la prensa.",
        },
        antimony: {
          low: "Falta antimonio. Las letras quedarán muy blandas y sus bordes no saldrán nítidos.",
          high: "Demasiado antimonio. El metal se vuelve quebradizo y las letras pueden romperse.",
        },
        tin: {
          low: "Falta estaño. El metal no fluirá bien hacia las líneas finas de la matriz.",
          high: "Demasiado estaño. El estaño era caro y, en exceso, hace más blandas las letras.",
        },
      },
      success: "¡Buena mezcla! Mucho plomo, algo de antimonio y un poco de estaño. Los fundidores de tipos de épocas posteriores usaban cerca de 80% de plomo, 15% de antimonio y 5% de estaño.",
    },
  },
  "9-12": {
    en: {
      instruction: "Balance the type alloy. It must melt easily, flow into fine detail, and stay hard under the press. The total must be 100%.",
      ingredients: [
        { id: "lead", label: LEAD.en, emoji: LEAD.emoji },
        { id: "antimony", label: ANTIMONY.en, emoji: ANTIMONY.emoji },
        { id: "tin", label: TIN.en, emoji: TIN.emoji },
      ],
      targets: { lead: [75, 85], antimony: [10, 20], tin: [5, 10] },
      hints: {
        lead: {
          low: "Too little lead. The alloy becomes hard to melt and brittle, and costs more because the other metals are scarcer.",
          high: "Too much lead. The sorts will be soft, wear quickly and deform under repeated impressions.",
        },
        antimony: {
          low: "Too little antimony. The metal stays soft and shrinks as it cools, so letters come out blunt.",
          high: "Too much antimony. The alloy grows brittle; fine serifs will chip off.",
        },
        tin: {
          low: "Too little tin. The molten metal is sluggish and won't fill the hairline strokes of the matrix.",
          high: "Too much tin. It adds expense without making the type any tougher.",
        },
      },
      success: "Well balanced. Later type metal was roughly 80% lead, 15% antimony and 5% tin. No type known to be Gutenberg's survives, so his exact recipe is inferred.",
    },
    es: {
      instruction: "Equilibra la aleación. Debe fundirse con facilidad, llenar los detalles finos y mantenerse dura bajo la prensa. El total debe ser 100%.",
      ingredients: [
        { id: "lead", label: LEAD.es, emoji: LEAD.emoji },
        { id: "antimony", label: ANTIMONY.es, emoji: ANTIMONY.emoji },
        { id: "tin", label: TIN.es, emoji: TIN.emoji },
      ],
      targets: { lead: [75, 85], antimony: [10, 20], tin: [5, 10] },
      hints: {
        lead: {
          low: "Muy poco plomo. La aleación cuesta más fundirla, se vuelve quebradiza y sale más cara, porque los otros metales son más escasos.",
          high: "Demasiado plomo. Los tipos serán blandos, se gastarán pronto y se deformarán con las impresiones repetidas.",
        },
        antimony: {
          low: "Muy poco antimonio. El metal queda blando y se encoge al enfriarse, así que las letras salen romas.",
          high: "Demasiado antimonio. La aleación se vuelve quebradiza y los remates finos se desprenden.",
        },
        tin: {
          low: "Muy poco estaño. El metal fundido fluye con dificultad y no llena los trazos más finos de la matriz.",
          high: "Demasiado estaño. Aumenta el costo sin hacer los tipos más resistentes.",
        },
      },
      success: "Bien equilibrada. El metal de tipos posterior tenía cerca de 80% de plomo, 15% de antimonio y 5% de estaño. No se conserva ningún tipo que sepamos que fue de Gutenberg, así que su receta exacta se deduce.",
    },
  },
};

// ---------------------------------------------------------------------------
// Hand mould: pour just enough metal.
// Windows: 3-5 = 35/50 = 0.70 s, 6-8 = 20/55 ≈ 0.36 s, 9-12 = 15/60 = 0.25 s.
// ---------------------------------------------------------------------------

const POUR_EN = {
  meterLabel: "Metal in the mould",
  buttonLabel: "Pour",
  emoji: "🫗",
  good: "A perfect letter! Open the mould and take out your sort.",
  low: "Not enough metal. The letter is incomplete.",
  high: "Too much! The metal spilled over the mould.",
};
const POUR_ES = {
  meterLabel: "Metal en el molde",
  buttonLabel: "Verter",
  emoji: "🫗",
  good: "¡Una letra perfecta! Abre el molde y saca tu tipo.",
  low: "Falta metal. La letra quedó incompleta.",
  high: "¡Demasiado! El metal se derramó fuera del molde.",
};

const MOULD: PerBandLang<HoldConfig> = {
  "K-2": {
    en: { ...POUR_EN, instruction: "Hold the button to pour the hot metal into the mould.", zone: null, rate: 50, rounds: 1 },
    es: { ...POUR_ES, instruction: "Mantén presionado el botón para echar el metal caliente en el molde.", zone: null, rate: 50, rounds: 1 },
  },
  "3-5": {
    en: { ...POUR_EN, instruction: "Hold to pour. Let go when the mould is full, before it spills. Cast 2 letters.", zone: [55, 90], rate: 50, rounds: 2 },
    es: { ...POUR_ES, instruction: "Mantén presionado para verter. Suelta cuando el molde esté lleno, antes de que se derrame. Funde 2 letras.", zone: [55, 90], rate: 50, rounds: 2 },
  },
  "6-8": {
    en: { ...POUR_EN, instruction: "Pour the molten metal and stop when the mould is full. Cast 3 sorts.", zone: [65, 85], rate: 55, rounds: 3 },
    es: { ...POUR_ES, instruction: "Vierte el metal fundido y detente cuando el molde esté lleno. Funde 3 tipos.", zone: [65, 85], rate: 55, rounds: 3 },
  },
  "9-12": {
    en: { ...POUR_EN, instruction: "Pour with a quick, steady hand and stop exactly when the cavity is full. Cast 4 sorts.", zone: [70, 85], rate: 60, rounds: 4 },
    es: { ...POUR_ES, instruction: "Vierte con mano rápida y firme, y detente justo cuando la cavidad esté llena. Funde 4 tipos.", zone: [70, 85], rate: 60, rounds: 4 },
  },
};

// ---------------------------------------------------------------------------
// Journal check
// ---------------------------------------------------------------------------

const JOURNAL_CHECK: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Let's remember how we made metal letters.",
      items: [
        {
          kind: "choice",
          prompt: "What were Gutenberg's letters made of?",
          options: [
            { text: "Metal", emoji: "🔩" },
            { text: "Gold", emoji: "👑" },
            { text: "Wood", emoji: "🪵" },
          ],
          answer: 0,
          explain: "They were metal, mostly lead. Gold costs too much and is too soft.",
        },
        {
          kind: "choice",
          prompt: "Why did Gutenberg use a mould?",
          options: [
            { text: "To make lots of the same letter fast", emoji: "🔁" },
            { text: "To paint the letters", emoji: "🎨" },
          ],
          answer: 0,
          explain: "The mould made the same letter again and again. That was fast!",
        },
        {
          kind: "choice",
          prompt: "What happens if you pour too little metal?",
          options: [
            { text: "The letter is not finished", emoji: "🧩" },
            { text: "The letter is perfect", emoji: "⭐" },
          ],
          answer: 0,
          explain: "Too little metal makes a broken letter. The mould must be full.",
        },
      ],
    },
    es: {
      intro: "Recordemos cómo hicimos las letras de metal.",
      items: [
        {
          kind: "choice",
          prompt: "¿De qué estaban hechas las letras de Gutenberg?",
          options: [
            { text: "De metal", emoji: "🔩" },
            { text: "De oro", emoji: "👑" },
            { text: "De madera", emoji: "🪵" },
          ],
          answer: 0,
          explain: "Eran de metal, sobre todo de plomo. El oro cuesta mucho y es muy blando.",
        },
        {
          kind: "choice",
          prompt: "¿Para qué usaba Gutenberg un molde?",
          options: [
            { text: "Para hacer rápido muchas letras iguales", emoji: "🔁" },
            { text: "Para pintar las letras", emoji: "🎨" },
          ],
          answer: 0,
          explain: "El molde hacía la misma letra una y otra vez. ¡Era muy rápido!",
        },
        {
          kind: "choice",
          prompt: "¿Qué pasa si echas muy poco metal?",
          options: [
            { text: "La letra no queda terminada", emoji: "🧩" },
            { text: "La letra queda perfecta", emoji: "⭐" },
          ],
          answer: 0,
          explain: "Con poco metal, la letra sale rota. El molde tiene que estar lleno.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Show what you learned about casting type.",
      items: [
        {
          kind: "choice",
          prompt: "What was struck into soft copper to make a matrix?",
          options: [{ text: "A steel punch" }, { text: "A wooden stamp" }, { text: "A goose feather" }],
          answer: 0,
          explain: "A hard steel punch with a raised, backwards letter was struck into copper. It left a sunken letter: the matrix.",
        },
        {
          kind: "choice",
          prompt: "Why was type made from a mix of metals instead of lead alone?",
          options: [
            { text: "Lead alone is too soft; tin and antimony help it flow and make it harder" },
            { text: "Mixing metals makes the letters shine like gold" },
            { text: "Lead alone will not melt at all" },
          ],
          answer: 0,
          explain: "Lead melts easily but is soft. Tin helps it flow into the mould, and antimony makes it hard enough for the press.",
        },
        {
          kind: "choice",
          prompt: "What was Gutenberg's big breakthrough?",
          options: [
            { text: "Carving every letter from wood, one at a time" },
            { text: "Casting many identical metal letters quickly with a hand mould" },
            { text: "Inventing the very first printing in the world" },
          ],
          answer: 1,
          explain: "Printing already existed in China and Korea. Gutenberg's mould made it fast to cast thousands of matching metal letters.",
        },
      ],
    },
    es: {
      intro: "Muestra lo que aprendiste sobre fundir tipos.",
      items: [
        {
          kind: "choice",
          prompt: "¿Qué se golpeaba contra el cobre blando para hacer una matriz?",
          options: [{ text: "Un punzón de acero" }, { text: "Un sello de madera" }, { text: "Una pluma de ganso" }],
          answer: 0,
          explain: "Se golpeaba un punzón de acero duro, con una letra en relieve y al revés. Dejaba la letra hundida en el cobre: la matriz.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué los tipos se hacían con una mezcla de metales y no solo con plomo?",
          options: [
            { text: "El plomo solo es muy blando; el estaño y el antimonio lo ayudan a fluir y lo endurecen" },
            { text: "La mezcla hace que las letras brillen como el oro" },
            { text: "El plomo solo no se derrite nunca" },
          ],
          answer: 0,
          explain: "El plomo se derrite fácil, pero es blando. El estaño lo ayuda a llenar el molde y el antimonio lo hace duro para la prensa.",
        },
        {
          kind: "choice",
          prompt: "¿Cuál fue el gran avance de Gutenberg?",
          options: [
            { text: "Tallar cada letra en madera, una por una" },
            { text: "Fundir rápido muchas letras de metal idénticas con un molde manual" },
            { text: "Inventar la primera impresión del mundo" },
          ],
          answer: 1,
          explain: "En China y Corea ya se imprimía. El molde de Gutenberg permitía fundir rápido miles de letras de metal iguales.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Check your understanding of Gutenberg's casting system.",
      items: [
        {
          kind: "choice",
          prompt: "Why did the hand mould need an adjustable width?",
          options: [
            { text: "So narrow letters like i and wide letters like m could be cast at the same height" },
            { text: "So the metal would cool faster" },
            { text: "So letters could be cast in bigger sizes for titles" },
          ],
          answer: 0,
          explain: "Letters differ in width, but every sort must be the same height to print evenly. The mould's halves slid to change only the width.",
        },
        {
          kind: "choice",
          prompt: "What does antimony add to type metal?",
          options: [
            { text: "Hardness, and a slight expansion as it cools that fills the mould sharply" },
            { text: "Lightness, so the letters are easier to carry" },
            { text: "A black color, so the letters need less ink" },
          ],
          answer: 0,
          explain: "Antimony hardens the alloy, and the metal swells slightly as it sets, pressing into every detail of the matrix.",
        },
        {
          kind: "order",
          prompt: "Put the steps for making one sort in order.",
          items: [
            "Cut a raised, mirror-image letter on a steel punch",
            "Strike the punch into copper to make a matrix",
            "Fit the matrix into the hand mould",
            "Pour in the molten alloy",
            "Open the mould and take out the sort",
          ],
          explain: "Punch, then matrix, then mould, then pouring. One punch could make a matrix that cast the same letter many times.",
        },
        {
          kind: "write",
          prompt: "Why was making type quickly so important for printing a whole Bible?",
          starters: ["A Bible needed…", "Without the hand mould…", "Because every sort was the same…"],
        },
      ],
    },
    es: {
      intro: "Comprueba lo que entendiste del sistema de fundición de Gutenberg.",
      items: [
        {
          kind: "choice",
          prompt: "¿Por qué el molde manual necesitaba un ancho ajustable?",
          options: [
            { text: "Para fundir letras angostas como la i y anchas como la m con la misma altura" },
            { text: "Para que el metal se enfriara más rápido" },
            { text: "Para fundir letras más grandes para los títulos" },
          ],
          answer: 0,
          explain: "Las letras tienen distinto ancho, pero todos los tipos deben tener la misma altura para imprimir parejo. Las mitades del molde se deslizaban para cambiar solo el ancho.",
        },
        {
          kind: "choice",
          prompt: "¿Qué le aporta el antimonio al metal de los tipos?",
          options: [
            { text: "Dureza, y una ligera expansión al enfriarse que llena bien el molde" },
            { text: "Ligereza, para que las letras sean fáciles de cargar" },
            { text: "Color negro, para que las letras necesiten menos tinta" },
          ],
          answer: 0,
          explain: "El antimonio endurece la aleación, y el metal se expande un poco al solidificarse, entrando en cada detalle de la matriz.",
        },
        {
          kind: "order",
          prompt: "Ordena los pasos para hacer un tipo.",
          items: [
            "Tallar una letra en relieve y al revés en un punzón de acero",
            "Golpear el punzón contra el cobre para hacer una matriz",
            "Colocar la matriz en el molde manual",
            "Verter la aleación fundida",
            "Abrir el molde y sacar el tipo",
          ],
          explain: "Primero el punzón, luego la matriz, después el molde y al final el vertido. Con una sola matriz se podía fundir la misma letra muchas veces.",
        },
        {
          kind: "write",
          prompt: "¿Por qué era tan importante hacer tipos rápido para imprimir una Biblia completa?",
          starters: ["Una Biblia necesitaba…", "Sin el molde manual…", "Como todos los tipos eran iguales…"],
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Analyze Gutenberg's casting system and the evidence for it.",
      items: [
        {
          kind: "choice",
          prompt: "No type known to be Gutenberg's has survived. How do historians reconstruct his type metal?",
          options: [
            { text: "From analyses of early type and the practice of later typefounders" },
            { text: "From a recipe Gutenberg wrote down in his workshop notes" },
            { text: "From traces of gold found in the pages of his Bible" },
          ],
          answer: 0,
          explain: "No written recipe of his survives. Historians infer the alloy from later type-metal practice and scientific analyses, so the exact recipe stays uncertain.",
        },
        {
          kind: "number",
          prompt: "Later type metal was about 80% lead and 15% antimony. What percent was tin?",
          answer: 5,
          explain: "80 + 15 + 5 = 100. A small amount of tin was enough to help the metal flow.",
        },
        {
          kind: "evidence",
          prompt: "Which part of the casting system mattered most? Choose a claim, pick two pieces of evidence, and explain your reasoning.",
          claims: [
            "The adjustable hand mould was the most important part of Gutenberg's casting system.",
            "The type alloy was the most important part of Gutenberg's casting system.",
          ],
          evidence: [
            { text: "One adjustable mould could cast narrow and wide letters, changing only the matrix.", supports: [0] },
            { text: "A caster could make many identical sorts quickly from one mould and matrix.", supports: [0] },
            { text: "Pure lead is too soft; antimony makes type hard enough to survive many impressions.", supports: [1] },
            { text: "Tin and antimony help the metal fill every corner of the matrix, so letters come out sharp.", supports: [1] },
            { text: "A Bible needed tens of thousands of sorts, all the same height.", supports: [0, 1] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
    es: {
      intro: "Analiza el sistema de fundición de Gutenberg y las pruebas que lo respaldan.",
      items: [
        {
          kind: "choice",
          prompt: "No se conserva ningún tipo que sepamos que fue de Gutenberg. ¿Cómo reconstruyen los historiadores su metal?",
          options: [
            { text: "Con análisis de tipos antiguos y la práctica de fundidores posteriores" },
            { text: "Con una receta que Gutenberg anotó en su taller" },
            { text: "Con restos de oro hallados en las páginas de su Biblia" },
          ],
          answer: 0,
          explain: "No se conserva ninguna receta escrita por él. Los historiadores deducen la aleación de la práctica posterior y de análisis científicos, así que la receta exacta sigue siendo incierta.",
        },
        {
          kind: "number",
          prompt: "El metal de tipos posterior tenía cerca de 80% de plomo y 15% de antimonio. ¿Qué porcentaje era estaño?",
          answer: 5,
          explain: "80 + 15 + 5 = 100. Bastaba un poco de estaño para que el metal fluyera.",
        },
        {
          kind: "evidence",
          prompt: "¿Qué parte del sistema de fundición fue la más importante? Elige una afirmación, escoge dos pruebas y explica tu razonamiento.",
          claims: [
            "El molde manual ajustable fue la parte más importante del sistema de Gutenberg.",
            "La aleación fue la parte más importante del sistema de Gutenberg.",
          ],
          evidence: [
            { text: "Un solo molde ajustable podía fundir letras angostas y anchas cambiando solo la matriz.", supports: [0] },
            { text: "Con un molde y una matriz se podían hacer rápido muchos tipos idénticos.", supports: [0] },
            { text: "El plomo puro es muy blando; el antimonio hace los tipos lo bastante duros para muchas impresiones.", supports: [1] },
            { text: "El estaño y el antimonio ayudan al metal a llenar cada rincón de la matriz, y las letras salen nítidas.", supports: [1] },
            { text: "Una Biblia necesitaba decenas de miles de tipos, todos de la misma altura.", supports: [0, 1] },
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

export const METAL_CHAPTER: Chapter = {
  id: "metal",
  world: METAL_WORLD,
  activities: {
    furnace: { kind: "mix", title: { en: "Type metal", es: "El metal de los tipos" }, icon: "🔥", config: FURNACE },
    mould: { kind: "hold", title: { en: "Hand mould", es: "Molde manual" }, icon: "🫗", config: MOULD },
  },
  journal: JOURNAL_CHECK,
  steps: [
    {
      id: "intro",
      dialogue: [
        {
          id: "metal.intro",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "This is Mainz. The year is about 1450. Gutenberg needs metal letters. He needs lots of them!",
              T2: "You arrive at the workshop of Johannes Gutenberg in Mainz, around 1450. To print a book, he needs thousands of metal letters. Today you will help make them.",
              T3: "Mainz, around 1450. Before Johannes Gutenberg can print a single page, he needs letters: thousands of them, all exactly the same size. Today you will learn how he makes them out of metal.",
              T4: "Mainz, around 1450. Printing a book with *movable type* requires an enormous supply of letters, each precisely the same height so that every one meets the paper evenly. Today you will learn the method Johannes Gutenberg developed to produce them in metal.",
            },
            es: {
              T1: "Esta es Maguncia. Es el año 1450, más o menos. Gutenberg necesita letras de metal. ¡Necesita muchísimas!",
              T2: "Llegas al taller de Johannes Gutenberg en Maguncia, cerca del año 1450. Para imprimir un libro, necesita miles de letras de metal. Hoy vas a ayudar a hacerlas.",
              T3: "Maguncia, alrededor de 1450. Antes de imprimir una sola página, Johannes Gutenberg necesita letras: miles de ellas, todas exactamente del mismo tamaño. Hoy aprenderás cómo las fabrica con metal.",
              T4: "Maguncia, alrededor de 1450. Imprimir un libro con *tipos móviles* exige una enorme cantidad de letras, todas con la misma altura exacta para que cada una toque el papel de manera pareja. Hoy conocerás el método que Johannes Gutenberg desarrolló para producirlas en metal.",
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
      id: "explain",
      dialogue: [
        {
          id: "metal.welcome",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Hello! I have worked with metal before. Now I need many letters. Carving each one is too slow. Let me show you my way.",
              T2: "Welcome! I have worked with metal before, so I had an idea. Carving every letter by hand would take forever. Instead, we pour hot metal into a mould and make the same letter again and again.",
              T3: "Welcome, apprentice. Before I came to printing, I worked with metal, so I know how it melts and flows. A book needs thousands of letters, and carving each one by hand would be far too slow. My answer is to cast them: pour melted metal into a mould and make the same letter as many times as we like.",
              T4: "Welcome, apprentice. Long before printing, I worked with metal, so I understand how it melts, flows and hardens. A single book demands thousands of letters, and carving each by hand would be hopelessly slow and uneven. The solution is to cast them: to pour molten metal into a mould and reproduce the same letter, identical every time, as often as we need.",
            },
            es: {
              T1: "¡Hola! Ya trabajé con metal antes. Ahora necesito muchas letras. Tallar cada una es muy lento. Te muestro mi método.",
              T2: "¡Te doy la bienvenida! Ya había trabajado con metal, así que tuve una idea. Tallar cada letra a mano tomaría muchísimo tiempo. En lugar de eso, echamos metal caliente en un molde y hacemos la misma letra una y otra vez.",
              T3: "Te doy la bienvenida, aprendiz. Antes de dedicarme a la imprenta trabajé con metal, así que sé cómo se derrite y cómo fluye. Un libro necesita miles de letras, y tallar cada una a mano sería demasiado lento. Mi solución es fundirlas: echar metal derretido en un molde y repetir la misma letra todas las veces que queramos.",
              T4: "Te doy la bienvenida, aprendiz. Mucho antes de la imprenta trabajé con metal, así que entiendo cómo se funde, cómo fluye y cómo se endurece. Un solo libro exige miles de letras, y tallarlas una por una sería lentísimo y desigual. La solución es fundirlas: verter metal fundido en un molde y reproducir la misma letra, idéntica cada vez, tantas veces como haga falta.",
            },
          },
        },
        {
          id: "metal.punch",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "First I cut a letter on steel. This is a *punch*. The letter is backwards. I hit it into soft copper. That makes a *matrix*. The matrix goes in the *hand mould*. Hot metal goes in. Out comes a letter!",
              T2: "First, I cut a raised, backwards letter on the end of a steel bar. This is a *punch*. I strike it into softer copper, which leaves a dent shaped like the letter. That is the *matrix*. The matrix fits into the *hand mould*. When we pour in hot metal, out comes one letter, called a *sort*.",
              T3: "Here is how it works. First, a steel *punch* is cut with a raised letter, backwards like a mirror image. I strike the punch into a bar of softer copper, leaving a sunken letter: the *matrix*. The matrix slides into the bottom of this *hand mould*. Pour in melted metal, let it cool for a moment, open the mould, and there is a finished letter, called a *sort*.",
              T4: "The process has three stages. First, a craftsman engraves a single letter, in relief and reversed, on the tip of a hardened steel *punch*. Striking that punch into softer copper leaves a precise sunken impression, the *matrix*. The matrix is then locked into the base of the *hand mould*; molten metal poured into the mould takes the matrix's shape and, once cooled, emerges as a *sort*: a single letter, ready for the type case.",
            },
            es: {
              T1: "Primero corto una letra en acero. Es un *punzón*. La letra está al revés. Lo golpeo contra cobre blando. Así hago una *matriz*. La matriz va en el *molde manual*. Entra el metal caliente. ¡Sale una letra!",
              T2: "Primero corto una letra en relieve y al revés en la punta de una barra de acero. Es un *punzón*. Lo golpeo contra cobre, que es más blando, y queda un hueco con la forma de la letra. Esa es la *matriz*. La matriz encaja en el *molde manual*. Al echar metal caliente, sale una letra suelta: un *tipo suelto*.",
              T3: "Así funciona. Primero se talla un *punzón* de acero con una letra en relieve, al revés, como en un espejo. Golpeo el punzón contra una barra de cobre, que es más blando, y queda la letra hundida: esa es la *matriz*. La matriz se coloca en la parte de abajo de este *molde manual*. Echas el metal derretido, esperas un momento a que se enfríe, abres el molde y ahí está la letra terminada, un *tipo suelto*.",
              T4: "El proceso tiene tres etapas. Primero, un artesano graba una sola letra, en relieve e invertida, en la punta de un *punzón* de acero templado. Al golpear ese punzón contra cobre, que es más blando, queda una impresión hundida y precisa: la *matriz*. Luego la matriz se fija en la base del *molde manual*; el metal fundido que se vierte en el molde toma la forma de la matriz y, al enfriarse, sale convertido en un *tipo suelto*: una sola letra que ya puede ir a la caja de tipos.",
            },
          },
        },
      ],
    },
    {
      id: "widths",
      bands: UPPER_BANDS,
      dialogue: [
        {
          id: "metal.widths",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Look at i and m. The i is thin. The m is wide. My mould can slide. It fits thin and wide letters.",
              T2: "Some letters are thin, like i, and some are wide, like m. The two halves of my mould slide apart or together, so one mould can cast every letter. Only the matrix changes.",
              T3: "Here is the clever part. An i is narrow and an m is wide, but every sort must be exactly the same height so they print evenly. The two halves of the mould slide to change the width while the height stays fixed. To cast a new letter, I only swap the matrix.",
              T4: "The mould's real ingenuity is that it adjusts. Letters vary in width, from a narrow i to a broad m, yet every sort must share the same height and depth so that a full page prints evenly. The mould's two interlocking halves slide to set the width while holding the other dimensions constant, so a single tool, fitted with different matrices, can cast the entire alphabet.",
            },
            es: {
              T1: "Mira la i y la m. La i es delgada. La m es ancha. Mi molde se puede deslizar. Sirve para letras delgadas y anchas.",
              T2: "Algunas letras son delgadas, como la i, y otras son anchas, como la m. Las dos mitades de mi molde se abren o se juntan, así que un solo molde sirve para todas las letras. Solo cambia la matriz.",
              T3: "Aquí está lo ingenioso. La i es angosta y la m es ancha, pero todos los tipos deben tener exactamente la misma altura para imprimir de manera pareja. Las dos mitades del molde se deslizan para cambiar el ancho, mientras la altura no cambia. Para fundir otra letra, solo cambio la matriz.",
              T4: "El verdadero ingenio del molde es que se ajusta. Las letras varían en ancho, desde una i angosta hasta una m amplia; sin embargo, todos los tipos deben compartir la misma altura y profundidad para que una página completa se imprima de manera pareja. Las dos mitades del molde encajan y se deslizan para fijar el ancho sin alterar las otras medidas, de modo que una sola herramienta, con distintas matrices, puede fundir todo el alfabeto.",
            },
          },
        },
      ],
    },
    {
      id: "furnace",
      dialogue: [
        {
          id: "metal.alloy",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Now we melt the metal. *Lead* melts easily. But lead alone is too soft. We add *tin* and *antimony*. This mix is an *alloy*. Go to the furnace. Pick the right metals.",
              T2: "Now for the metal. *Lead* melts easily, but on its own it is too soft. So we mix in *tin* and *antimony*. A mix of metals like this is called an *alloy*. Go to the furnace and choose what goes in.",
              T3: "Now we need the right metal. *Lead* melts at a low heat, but alone it is soft and would squash in the press. *Tin* helps the melted metal flow into every corner of the matrix. *Antimony* makes it harder, and it swells a little as it cools, so the letter comes out sharp. This blend is our *alloy*. Go to the furnace and make the mix.",
              T4: "Next, the metal itself. *Lead* melts at a modest temperature, but pure lead is too soft and would flatten under the press. *Tin* makes the molten metal more fluid, so it fills the finest lines of the matrix. *Antimony* hardens the metal and, unusually, makes it expand slightly as it solidifies, pressing it into every detail of the mould. Balancing the three gives an *alloy* that is easy to cast yet tough enough for thousands of impressions. Go to the furnace and prepare the mix.",
            },
            es: {
              T1: "Ahora derretimos el metal. El *plomo* se derrite fácil. Pero solo es muy blando. Le ponemos *estaño* y *antimonio*. Esta mezcla es una *aleación*. Ve al horno. Elige los metales correctos.",
              T2: "Ahora, el metal. El *plomo* se derrite fácilmente, pero solo es demasiado blando. Por eso le mezclamos *estaño* y *antimonio*. Una mezcla de metales así se llama *aleación*. Ve al horno de fundición y elige qué lleva.",
              T3: "Ahora necesitamos el metal adecuado. El *plomo* se derrite con poco calor, pero solo es blando y se aplastaría en la prensa. El *estaño* ayuda a que el metal derretido llegue a cada rincón de la matriz. El *antimonio* lo hace más duro y lo hace crecer un poco al enfriarse, así que la letra sale nítida. Esta mezcla es nuestra *aleación*. Ve al horno de fundición y prepárala.",
              T4: "Ahora, el metal. El *plomo* se funde a una temperatura moderada, pero puro es tan blando que se aplastaría bajo la prensa. El *estaño* hace que el metal fundido sea más fluido, de modo que llena las líneas más finas de la matriz. El *antimonio* endurece el metal y, algo poco común, hace que se expanda ligeramente al solidificarse, empujándolo hacia cada detalle del molde. Equilibrar los tres produce una *aleación* fácil de fundir y, a la vez, resistente para miles de impresiones. Ve al horno de fundición y prepara la mezcla.",
            },
          },
        },
      ],
      objective: { type: "station", station: "furnace" },
      objectiveText: {
        goal: {
          en: { T1: "Mix the metal at the furnace.", T3: "Choose the metals for the type alloy at the furnace." },
          es: { T1: "Mezcla el metal en el horno.", T3: "Elige los metales de la aleación en el horno de fundición." },
        },
        hintTouch: { en: "Walk to the furnace and tap ✋.", es: "Camina al horno de fundición y toca ✋." },
        hintMouse: { en: "Walk to the furnace and press F.", es: "Camina al horno de fundición y presiona F." },
      },
    },
    {
      id: "mould",
      dialogue: [
        {
          id: "metal.pour",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Good mix! Now pour it in the mould. Not too little. Not too much. Fill it just right.",
              T2: "That is a good mix! Now carry the hot metal to the hand mould. Pour just enough to fill it. Too little leaves a broken letter, and too much spills over.",
              T3: "A fine mix. Now take a ladle of hot metal to the *hand mould*. Pour quickly and stop when it is full. Too little metal leaves the letter unfinished; too much spills over and wastes metal. Then open the mould and drop out the new *sort*.",
              T4: "An excellent mix. Now ladle the molten metal into the *hand mould*. Pour with a quick, steady motion and stop precisely when the cavity is full: too little and the letter will be incomplete, too much and it will spill over the mould. Once it sets, open the mould and release the finished *sort*. Then repeat, again and again.",
            },
            es: {
              T1: "¡Buena mezcla! Ahora échala en el molde. Ni muy poco. Ni demasiado. Llénalo justo.",
              T2: "¡Esa mezcla está muy bien! Ahora lleva el metal caliente al molde manual. Echa solo lo necesario para llenarlo. Si echas poco, la letra queda incompleta, y si echas mucho, se derrama.",
              T3: "Buena mezcla. Ahora lleva un cucharón de metal caliente al *molde manual*. Vierte rápido y detente cuando esté lleno. Con poco metal, la letra queda sin terminar; con demasiado, se derrama y se desperdicia. Luego abre el molde y saca el nuevo *tipo suelto*.",
              T4: "Excelente mezcla. Ahora vierte el metal fundido en el *molde manual* con el cucharón. Hazlo con un movimiento rápido y firme, y detente justo cuando la cavidad esté llena: si falta metal, la letra quedará incompleta; si sobra, se derramará fuera del molde. Cuando se solidifique, abre el molde y saca el *tipo suelto* terminado. Después, repite el proceso una y otra vez.",
            },
          },
        },
      ],
      objective: { type: "station", station: "mould" },
      objectiveText: {
        goal: {
          en: { T1: "Pour metal into the mould.", T3: "Cast sorts in the hand mould." },
          es: { T1: "Echa metal en el molde.", T3: "Funde tipos en el molde manual." },
        },
        hintTouch: { en: "Walk to the hand mould and tap ✋.", es: "Camina al molde manual y toca ✋." },
        hintMouse: { en: "Walk to the hand mould and press F.", es: "Camina al molde manual y presiona F." },
      },
    },
    {
      id: "done",
      dialogue: [
        {
          id: "metal.done",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Look at all these letters! They are all the same. A Bible needs so many. It needs tens of thousands! Now we can make them fast.",
              T2: "Look at this pile of letters, every one the same! A whole Bible needs tens of thousands of them. With the mould, we can make them quickly instead of carving each one. That is what makes printing a big book possible.",
              T3: "Look at this tray: every *sort* is identical. People in China and Korea printed with *movable type* long before us, but our mould lets us cast huge numbers of identical metal letters quickly. A Bible needs tens of thousands of sorts, and this way we make them far faster than anyone could carve them. That is the real heart of this work.",
              T4: "Examine this tray: every *sort* can replace any other of the same letter. Printers in China and Korea had used *movable type* centuries earlier, but casting identical metal letters in quantity, quickly and precisely, is what makes printing a book of this size practical. A Bible set in two columns to a page requires tens of thousands of sorts. Without the mould, the press would sit idle, waiting for letters.",
            },
            es: {
              T1: "¡Mira cuántas letras! Todas son iguales. Una Biblia necesita muchísimas. ¡Necesita decenas de miles! Ahora podemos hacerlas rápido.",
              T2: "¡Mira este montón de letras, todas iguales! Una Biblia completa necesita decenas de miles. Con el molde podemos hacerlas rápido en lugar de tallar cada una. Eso es lo que hace posible imprimir un libro grande.",
              T3: "Mira esta bandeja: todos los *tipos sueltos* son idénticos. En China y Corea ya se imprimía con *tipos móviles* mucho antes que nosotros, pero nuestro molde nos permite fundir enormes cantidades de letras de metal idénticas en poco tiempo. Una Biblia necesita decenas de miles de tipos, y así los hacemos mucho más rápido de lo que nadie podría tallarlos. Ese es el verdadero corazón de este trabajo.",
              T4: "Examina esta bandeja: cada *tipo suelto* puede reemplazar a cualquier otro de la misma letra. En China y Corea ya se usaban *tipos móviles* siglos antes, pero fundir letras de metal idénticas en grandes cantidades, con rapidez y precisión, es lo que vuelve práctico imprimir un libro de este tamaño. Una Biblia compuesta a dos columnas por página necesita decenas de miles de tipos. Sin el molde, la prensa se quedaría parada, esperando letras.",
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

export const GLOSSARY_METAL: GlossaryEntry[] = [
  {
    id: "punch",
    emoji: "🔨",
    term: { en: "punch", es: "punzón" },
    aliases: { en: ["punches"], es: ["punzones"] },
    simple: { en: "A steel bar with a backwards letter cut on its tip.", es: "Una barra de acero con una letra al revés en la punta." },
    full: {
      en: "A hardened steel bar with a single raised, mirror-image letter engraved on its tip. It is struck into softer copper to make a matrix.",
      es: "Una barra de acero templado con una sola letra en relieve, invertida como en un espejo, grabada en la punta. Se golpea contra cobre, más blando, para hacer una matriz.",
    },
  },
  {
    id: "matrix",
    emoji: "🟫",
    term: { en: "matrix", es: "matriz" },
    aliases: { en: ["matrices"], es: ["matrices"] },
    simple: { en: "A copper piece that shapes one letter.", es: "Una pieza de cobre que da forma a una letra." },
    full: {
      en: "A small block of copper with a letter sunk into it by a punch. Fitted into the hand mould, it gives each cast sort its letter shape.",
      es: "Un pequeño bloque de cobre con una letra hundida por un punzón. Colocada en el molde manual, le da a cada tipo fundido la forma de su letra.",
    },
  },
  {
    id: "hand-mould",
    emoji: "🫗",
    term: { en: "hand mould", es: "molde manual" },
    aliases: { en: ["hand moulds", "hand mold"], es: ["moldes manuales"] },
    simple: { en: "A tool you pour hot metal into to make a letter.", es: "Una herramienta donde se vierte metal caliente para hacer una letra." },
    full: {
      en: "A two-part metal tool, held in the hand, into which molten metal is poured over a matrix to cast a sort. Its halves slide to fit narrow or wide letters.",
      es: "Una herramienta de metal de dos partes, que se sostiene con la mano, donde se vierte metal fundido sobre una matriz para fundir un tipo. Sus mitades se deslizan para letras angostas o anchas.",
    },
  },
  {
    id: "sort",
    emoji: "🔤",
    term: { en: "sort", es: "tipo suelto" },
    aliases: { en: ["sorts"], es: ["tipos sueltos"] },
    simple: { en: "One metal letter, ready to print.", es: "Una sola letra de metal para imprimir." },
    full: {
      en: "A single piece of cast type carrying one raised, reversed letter or mark. Thousands of sorts are set side by side to make a page.",
      es: "Una sola pieza de tipo fundido que lleva una letra o signo en relieve e invertido. Se colocan miles de tipos juntos para formar una página.",
    },
  },
  {
    id: "alloy",
    emoji: "⚗️",
    term: { en: "alloy", es: "aleación" },
    aliases: { en: ["alloys"], es: ["aleaciones"] },
    simple: { en: "A mix of different metals.", es: "Una mezcla de distintos metales." },
    full: {
      en: "A metal made by melting two or more metals together. Type metal is an alloy of mostly lead, with tin and antimony.",
      es: "Un metal que se obtiene al fundir juntos dos o más metales. El metal de los tipos es una aleación de mucho plomo, con estaño y antimonio.",
    },
  },
  {
    id: "lead",
    emoji: "🔘",
    term: { en: "lead", es: "plomo" },
    simple: { en: "A soft, heavy metal that melts easily.", es: "Un metal blando y pesado que se derrite fácilmente." },
    full: {
      en: "A soft, heavy gray metal that melts at a fairly low temperature. It is the main ingredient of type metal.",
      es: "Un metal gris, blando y pesado, que se funde a una temperatura bastante baja. Es el ingrediente principal del metal de los tipos.",
    },
  },
  {
    id: "tin",
    emoji: "🥫",
    term: { en: "tin", es: "estaño" },
    simple: { en: "A metal that helps melted metal flow.", es: "Un metal que ayuda a que el metal derretido fluya." },
    full: {
      en: "A silvery metal. A little tin in type metal helps it flow into every fine line of the matrix.",
      es: "Un metal plateado. Un poco de estaño en el metal de los tipos lo ayuda a llenar cada línea fina de la matriz.",
    },
  },
  {
    id: "antimony",
    emoji: "🪨",
    term: { en: "antimony", es: "antimonio" },
    simple: { en: "A material that makes type metal hard.", es: "Un material que hace duro el metal de los tipos." },
    full: {
      en: "A brittle, silvery element added to type metal. It hardens the alloy and makes it expand slightly as it cools, so letters come out sharp.",
      es: "Un elemento plateado y quebradizo que se añade al metal de los tipos. Endurece la aleación y hace que se expanda un poco al enfriarse, para que las letras salgan nítidas.",
    },
  },
];
