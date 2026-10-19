import { GlossaryEntry } from "./glossaryTypes";

// Core glossary: terms bolded in the tutorial and Chapter 4 (The Press), plus
// a few workshop words other chapters use. Aliases list the exact bolded forms
// used in dialogue so they link here.

export const GLOSSARY_CORE: GlossaryEntry[] = [
  {
    id: "printing-press",
    emoji: "🖨️",
    term: { en: "printing press", es: "imprenta" },
    aliases: { en: ["press", "printing presses", "presses"], es: ["imprentas", "prensa", "prensas"] },
    simple: { en: "A machine that presses inked letters onto paper.", es: "Una máquina que aprieta letras con tinta sobre el papel." },
    full: {
      en: "A machine that presses paper onto inked type to print a page. Gutenberg's press, built around 1450 in Mainz, could make many identical copies quickly.",
      es: "Una máquina que aprieta el papel contra los tipos entintados para imprimir una página. La prensa de Gutenberg, construida alrededor de 1450 en Maguncia, podía hacer muchas copias idénticas rápidamente.",
    },
  },
  {
    id: "type",
    emoji: "🔤",
    term: { en: "type", es: "tipos" },
    aliases: { en: ["sort", "sorts"], es: ["tipo"] },
    simple: { en: "Small metal blocks, each with one letter.", es: "Bloques pequeños de metal con una letra cada uno." },
    full: {
      en: "Small blocks, usually of metal, each carrying one raised letter or sign. A single block is called a sort, and its letter is a mirror image so the print reads correctly.",
      es: "Bloques pequeños, casi siempre de metal, que llevan cada uno una letra o signo en relieve. La letra es una imagen de espejo para que lo impreso se lea correctamente.",
    },
  },
  {
    id: "movable-type",
    emoji: "🧩",
    term: { en: "movable type", es: "tipos móviles" },
    aliases: { en: ["movable-type"], es: ["tipo móvil"] },
    simple: { en: "Letters you can move and use again.", es: "Letras que puedes mover y usar otra vez." },
    full: {
      en: "Separate letters that can be arranged into any text and reused for the next job. It was used in China and Korea centuries before Gutenberg made it in metal in Europe.",
      es: "Letras separadas que se pueden ordenar para formar cualquier texto y reutilizar en el siguiente trabajo. Se usaron en China y Corea siglos antes de que Gutenberg las hiciera de metal en Europa.",
    },
  },
  {
    id: "set",
    emoji: "🧱",
    term: { en: "set", es: "componer" },
    aliases: { en: ["setting", "sets", "typesetting"], es: ["compón", "compone", "componen"] },
    simple: { en: "To put type in order to make words.", es: "Poner los tipos en orden para formar palabras." },
    full: {
      en: "To pick sorts from the type case one by one and line them up in a composing stick to build words and lines of text.",
      es: "Tomar los tipos de la caja uno por uno y alinearlos en el componedor para formar palabras y líneas de texto.",
    },
  },
  {
    id: "upper-case",
    emoji: "🔠",
    term: { en: "upper case", es: "caja alta" },
    aliases: { en: ["uppercase"], es: [] },
    simple: { en: "Capital letters, like A, B and C.", es: "Las letras mayúsculas, como A, B y C." },
    full: {
      en: "Capital letters. Later printers kept them in the upper tray of the type case, which is where the name comes from.",
      es: "Las letras mayúsculas. Con el tiempo, los impresores las guardaron en la bandeja de arriba de la caja de tipos, y de ahí viene el nombre.",
    },
  },
  {
    id: "lower-case",
    emoji: "🔡",
    term: { en: "lower case", es: "caja baja" },
    aliases: { en: ["lowercase"], es: [] },
    simple: { en: "Small letters, like a, b and c.", es: "Las letras minúsculas, como a, b y c." },
    full: {
      en: "Small letters. Later printers kept them in the lower tray of the type case, closer to hand because they are used most.",
      es: "Las letras minúsculas. Con el tiempo, los impresores las guardaron en la bandeja de abajo, más cerca de la mano, porque se usan más.",
    },
  },
  {
    id: "ink",
    emoji: "🫙",
    term: { en: "ink", es: "tinta" },
    aliases: { en: ["inks"], es: ["tintas"] },
    simple: { en: "A dark liquid used to print or write.", es: "Un líquido oscuro para imprimir o escribir." },
    full: {
      en: "A colored paste or liquid that leaves a mark. Early European printers used a thick, oil-based ink that stuck to metal type.",
      es: "Una pasta o líquido de color que deja una marca. Los primeros impresores europeos usaban una tinta espesa a base de aceite que se pegaba a los tipos de metal.",
    },
  },
  {
    id: "screw",
    emoji: "🔩",
    term: { en: "screw", es: "tornillo" },
    aliases: { en: ["screws", "screw press"], es: ["tornillos", "prensa de tornillo"] },
    simple: { en: "A turning bar that pushes down hard.", es: "Una barra que gira y empuja con fuerza." },
    full: {
      en: "A thick rod with a spiral groove. In a printing press, turning the screw pushes the flat plate down evenly onto the paper and type.",
      es: "Una barra gruesa con una ranura en espiral. En una imprenta, al girar el tornillo, la placa plana baja y aprieta de manera pareja el papel contra los tipos.",
    },
  },
  {
    id: "craft",
    emoji: "🛠️",
    term: { en: "craft", es: "fabricar" },
    aliases: { en: ["crafting", "crafted"], es: ["fabrica", "fabricas"] },
    simple: { en: "To make something by hand.", es: "Hacer algo con las manos." },
    full: {
      en: "To make something useful from raw materials. A craft is also a skilled kind of work, like printing.",
      es: "Hacer algo útil a partir de materiales en bruto. Un oficio, como la imprenta, es un trabajo que requiere habilidad.",
    },
  },
  {
    id: "apprentice",
    emoji: "🧑‍🎓",
    term: { en: "apprentice", es: "aprendiz" },
    aliases: { en: ["apprentices"], es: ["aprendices"] },
    simple: { en: "A young worker learning a skill.", es: "Una persona joven que aprende un oficio." },
    full: {
      en: "A young person who works for a master for several years to learn a skilled trade, such as printing.",
      es: "Una persona joven que trabaja varios años con un maestro para aprender un oficio, como la imprenta.",
    },
  },
  {
    id: "composing-stick",
    emoji: "📏",
    term: { en: "composing stick", es: "componedor" },
    aliases: { en: ["composing sticks"], es: ["componedores"] },
    simple: { en: "A small tray that holds a line of type.", es: "Una bandeja pequeña que sostiene una línea de tipos." },
    full: {
      en: "A hand-held tray where a printer lines up sorts, letter by letter, to build one line of text at a time.",
      es: "Una bandeja que se sostiene en la mano, donde el impresor alinea los tipos, letra por letra, para formar una línea de texto.",
    },
  },
  {
    id: "ink-balls",
    emoji: "🥊",
    term: { en: "ink balls", es: "balas de tinta" },
    aliases: { en: ["ink ball"], es: ["bala de tinta", "balas de cuero"] },
    simple: { en: "Leather pads used to dab ink on type.", es: "Almohadillas de cuero para poner tinta en los tipos." },
    full: {
      en: "Leather pads stuffed with wool or hair and fixed to wooden handles. Printers used a pair of them to dab an even coat of ink onto the type.",
      es: "Almohadillas de cuero rellenas de lana o pelo, con mangos de madera. Los impresores usaban un par para cubrir los tipos con una capa pareja de tinta.",
    },
  },
  {
    id: "proof",
    emoji: "🔍",
    term: { en: "proof", es: "prueba" },
    aliases: { en: ["proofs", "proofread", "proofreading"], es: ["pruebas"] },
    simple: { en: "A test page checked for mistakes.", es: "Una hoja de prueba para buscar errores." },
    full: {
      en: "A first printed sheet that is read carefully for mistakes before the full set of copies is printed.",
      es: "Una primera hoja impresa que se revisa con cuidado para buscar errores antes de imprimir todas las copias.",
    },
  },
];
