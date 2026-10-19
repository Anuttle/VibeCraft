import { Lang, Line } from "../../i18n/types";
import { Chapter } from "../../game/quest";
import { SPREAD_WORLD } from "../../game/world";
import type { MapCity, MapConfig, PerBandLang, QuizConfig } from "../../game/activities";
import { GlossaryEntry } from "../glossaryTypes";

// Chapter 7: The Spread of Printing. Mainz 1462, Cologne c. 1466, and beyond.
//
// Historical notes for reviewers:
// - 1462: Mainz was stormed and sacked during the Mainz Diocesan Feud
//   between rival archbishops Diether von Isenburg and Adolf of Nassau
//   (high confidence). That printers leaving the city "helped spread
//   printing" is the standard account but is hedged: some printers had
//   already left (Mentelin was printing in Strasbourg by about 1460).
// - Ulrich Zell: trained in Mainz (the exact shop is not documented, so it
//   is not named) and set up Cologne's first press; his first dated books are
//   from about 1466-67, so "around 1466" (high confidence on the role,
//   medium on the exact year). His lines are teaching dialogue, not quotes.
//   He says nothing about events after his lifetime; the journal does.
// - "More than 250 towns by 1500" and "many thousands of editions" are the
//   commonly cited figures (estimates; hedged as "more than" / "many").
//   Incunabula = books printed before 1501 (high confidence).
// - Map dates are the commonly cited approximate first-printing dates and are
//   shown with "c.": Mainz c. 1450, Strasbourg 1460, Subiaco 1465 (Sweynheym
//   and Pannartz), Cologne 1466, Rome 1467, Venice 1469, Paris 1470 (press at
//   the university), Segovia c. 1472, Kraków 1473, Westminster 1476 (Caxton).
//   Medium confidence on individual years; high on the order and the people.
// - Aldus Manutius in Venice: small portable books and italic type around
//   1500 (italic first used 1501; told as "around 1500").
// - Mexico City 1539: Juan Pablos, working for the Seville printer Juan
//   Cromberger, ran the first press in the Americas (high confidence). Later
//   books in Nahuatl and other Indigenous languages are well documented
//   (e.g. Molina, 1550s), so this is told as "over time".
// - Luther's Ninety-five Theses (1517) and pamphlets spread quickly in print
//   and helped the Reformation grow (high confidence; "in a short time"
//   rather than a specific number of weeks).
// - Copernicus, De revolutionibus, printed in Nuremberg in 1543 (high).
// - "Relation", Strasbourg, from 1605, told as "one of the first newspapers"
//   (high on the paper and date; "first" is debated, so hedged).
// - Many early printed books were religious (commonly cited; hedged "many").
// - Literacy rose gradually over centuries; printing is told as one cause.
// - Chapter 0 link: Bi Sheng's clay type (c. 1040) and the Jikji (1377),
//   printed in Korea with metal movable type.

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };
const ZELL_SPEAKER: Line = { en: "Ulrich Zell", es: "Ulrich Zell" };

// ---------------------------------------------------------------------------
// Glossary terms introduced in this chapter.
// ---------------------------------------------------------------------------

export const GLOSSARY_SPREAD: GlossaryEntry[] = [
  {
    id: "incunabula",
    emoji: "📚",
    term: { en: "incunabula", es: "incunables" },
    aliases: { en: ["incunabulum", "incunable", "incunables"], es: ["incunable"] },
    simple: { en: "Books printed before the year 1501.", es: "Libros impresos antes del año 1501." },
    full: {
      en: "Books printed in Europe before 1501, in the first years of printing. The word comes from Latin for \"cradle\", because printing was still young.",
      es: "Libros impresos en Europa antes de 1501, en los primeros años de la imprenta. La palabra viene de \"cuna\", porque la imprenta todavía era muy joven.",
    },
  },
  {
    id: "pamphlet",
    emoji: "📄",
    term: { en: "pamphlet", es: "folleto" },
    aliases: { en: ["pamphlets"], es: ["folletos"] },
    simple: { en: "A short, cheap printed booklet.", es: "Un librito impreso, corto y barato." },
    full: {
      en: "A short printed booklet, quick and cheap to make. In the 1500s, pamphlets carried new ideas about religion and politics to many readers.",
      es: "Un librito impreso corto, rápido y barato de hacer. En el siglo XVI, los folletos llevaron ideas nuevas sobre religión y política a muchos lectores.",
    },
  },
  {
    id: "reformation",
    emoji: "⛪",
    term: { en: "Reformation", es: "Reforma protestante" },
    aliases: { en: ["Protestant Reformation"], es: ["Reforma"] },
    simple: { en: "A big change in Christian churches in the 1500s.", es: "Un gran cambio en las iglesias cristianas en el siglo XVI." },
    full: {
      en: "A movement that began in 1517, when Martin Luther and others called for changes in the Catholic Church. It led to new Protestant churches, and printing helped it spread.",
      es: "Un movimiento que comenzó en 1517, cuando Martín Lutero y otras personas pidieron cambios en la Iglesia católica. Dio origen a nuevas iglesias protestantes, y la imprenta lo ayudó a extenderse.",
    },
  },
  {
    id: "newspaper",
    emoji: "📰",
    term: { en: "newspaper", es: "periódico" },
    aliases: { en: ["newspapers"], es: ["periódicos"] },
    simple: { en: "Printed news that comes out again and again.", es: "Noticias impresas que salen una y otra vez." },
    full: {
      en: "A printed collection of news that comes out regularly, such as every week. \"Relation\", printed in Strasbourg from 1605, is one of the first.",
      es: "Una publicación impresa con noticias que sale con regularidad, por ejemplo cada semana. \"Relation\", impresa en Estrasburgo desde 1605, es uno de los primeros.",
    },
  },
  {
    id: "journeyman",
    emoji: "🧳",
    term: { en: "journeyman", es: "oficial" },
    aliases: { en: ["journeymen"], es: ["oficiales"] },
    simple: { en: "A trained worker who has finished learning.", es: "Una persona que ya aprendió un oficio." },
    full: {
      en: "A skilled worker who has finished an apprenticeship and works for a master for pay. Many journeymen traveled from town to town looking for work.",
      es: "Una persona que terminó su tiempo de aprendiz y trabaja para un maestro a cambio de un pago. Muchos oficiales viajaban de ciudad en ciudad buscando trabajo.",
    },
  },
  {
    id: "edition",
    emoji: "📖",
    term: { en: "edition", es: "edición" },
    aliases: { en: ["editions"], es: ["ediciones"] },
    simple: { en: "All the copies of a book printed at one time.", es: "Todas las copias de un libro impresas a la vez." },
    full: {
      en: "All the copies of a book printed from the same setting of type. One edition might be a few hundred copies.",
      es: "Todas las copias de un libro impresas con los mismos tipos compuestos. Una edición podía tener unos cientos de copias.",
    },
  },
];

// ---------------------------------------------------------------------------
// Map: the cities printing reached. Dates are the commonly cited ones.
// ---------------------------------------------------------------------------

interface CityInfo {
  id: string;
  year: number;
  lat: number;
  lon: number;
  name: Record<Lang, string>;
  /** For K-2. */
  simple: Record<Lang, string>;
  note: Record<Lang, string>;
}

const CITIES: Record<string, CityInfo> = {
  mainz: {
    id: "mainz", year: 1450, lat: 50.0, lon: 8.27,
    name: { en: "Mainz", es: "Maguncia" },
    simple: { en: "Gutenberg printed here first.", es: "Gutenberg imprimió aquí primero." },
    note: { en: "Gutenberg's workshop printed here; his Bible was finished by about 1455.", es: "Aquí imprimía el taller de Gutenberg; su Biblia estuvo terminada alrededor de 1455." },
  },
  strasbourg: {
    id: "strasbourg", year: 1460, lat: 48.58, lon: 7.75,
    name: { en: "Strasbourg", es: "Estrasburgo" },
    simple: { en: "A printer made a big Bible here.", es: "Aquí un impresor hizo una Biblia grande." },
    note: { en: "Johann Mentelin printed a Bible here around 1460, one of the first outside Mainz.", es: "Johann Mentelin imprimió aquí una Biblia alrededor de 1460, una de las primeras fuera de Maguncia." },
  },
  cologne: {
    id: "cologne", year: 1466, lat: 50.94, lon: 6.96,
    name: { en: "Cologne", es: "Colonia" },
    simple: { en: "Ulrich Zell printed here.", es: "Ulrich Zell imprimió aquí." },
    note: { en: "Ulrich Zell, who learned printing in Mainz, set up the city's first press.", es: "Ulrich Zell, que aprendió a imprimir en Maguncia, abrió la primera imprenta de la ciudad." },
  },
  subiaco: {
    id: "subiaco", year: 1465, lat: 41.92, lon: 13.10,
    name: { en: "Subiaco", es: "Subiaco" },
    simple: { en: "The first press in Italy.", es: "La primera imprenta de Italia." },
    note: { en: "Two German printers, Sweynheym and Pannartz, set up Italy's first press at a monastery here.", es: "Dos impresores alemanes, Sweynheym y Pannartz, abrieron aquí la primera imprenta de Italia, en un monasterio." },
  },
  rome: {
    id: "rome", year: 1467, lat: 41.9, lon: 12.5,
    name: { en: "Rome", es: "Roma" },
    simple: { en: "Printers moved here from a monastery.", es: "Unos impresores llegaron aquí desde un monasterio." },
    note: { en: "Sweynheym and Pannartz moved their press from Subiaco to Rome.", es: "Sweynheym y Pannartz trasladaron su imprenta de Subiaco a Roma." },
  },
  venice: {
    id: "venice", year: 1469, lat: 45.44, lon: 12.33,
    name: { en: "Venice", es: "Venecia" },
    simple: { en: "This city printed lots of books.", es: "Esta ciudad imprimió muchísimos libros." },
    note: {
      en: "A rich trading city that became one of Europe's great printing centers. Around 1500, Aldus Manutius printed small books you could carry, in a new slanted type called italic.",
      es: "Una rica ciudad de comercio que llegó a ser uno de los grandes centros de la imprenta en Europa. Alrededor de 1500, Aldo Manucio imprimió libros pequeños para llevar, con una letra inclinada nueva: la cursiva.",
    },
  },
  paris: {
    id: "paris", year: 1470, lat: 48.86, lon: 2.35,
    name: { en: "Paris", es: "París" },
    simple: { en: "The first press in France.", es: "La primera imprenta de Francia." },
    note: { en: "France's first press was set up at the university in Paris.", es: "La primera imprenta de Francia se instaló en la universidad de París." },
  },
  segovia: {
    id: "segovia", year: 1472, lat: 40.95, lon: -4.12,
    name: { en: "Segovia", es: "Segovia" },
    simple: { en: "One of the first presses in Spain.", es: "Una de las primeras imprentas de España." },
    note: { en: "One of the first books printed in Spain was made here, around 1472.", es: "Aquí se hizo uno de los primeros libros impresos en España, alrededor de 1472." },
  },
  krakow: {
    id: "krakow", year: 1473, lat: 50.06, lon: 19.94,
    name: { en: "Kraków", es: "Cracovia" },
    simple: { en: "Printing reached Poland here.", es: "La imprenta llegó a Polonia aquí." },
    note: { en: "One of the first places in Poland to have a press.", es: "Uno de los primeros lugares de Polonia con imprenta." },
  },
  westminster: {
    id: "westminster", year: 1476, lat: 51.5, lon: -0.13,
    name: { en: "Westminster (London)", es: "Westminster (Londres)" },
    simple: { en: "The first press in England.", es: "La primera imprenta de Inglaterra." },
    note: { en: "William Caxton printed the first books in England here.", es: "William Caxton imprimió aquí los primeros libros de Inglaterra." },
  },
};

function cities(ids: string[], lang: Lang, simple: boolean): MapCity[] {
  return ids.map((id) => {
    const c = CITIES[id];
    return { id: c.id, name: c.name[lang], year: c.year, lat: c.lat, lon: c.lon, note: (simple ? c.simple : c.note)[lang] };
  });
}

const K2_CITIES = ["mainz", "cologne", "venice", "paris", "westminster"];
const G35_CITIES = ["mainz", "cologne", "rome", "venice", "paris", "segovia"];
const G68_CITIES = ["mainz", "strasbourg", "subiaco", "cologne", "venice", "paris", "westminster"];
const G912_CITIES = ["mainz", "strasbourg", "subiaco", "cologne", "rome", "venice", "paris", "segovia", "krakow", "westminster"];

const MAP: PerBandLang<MapConfig> = {
  "K-2": {
    en: { instruction: "Printing went to new cities. Tap each city.", cities: cities(K2_CITIES, "en", true), mode: "tap", success: "You found them all! Printing went far." },
    es: { instruction: "La imprenta llegó a ciudades nuevas. Toca cada ciudad.", cities: cities(K2_CITIES, "es", true), mode: "tap", success: "¡Las encontraste todas! La imprenta llegó lejos." },
  },
  "3-5": {
    en: { instruction: "Printers carried their skills from Mainz to new cities. Tap each city to learn who printed there.", cities: cities(G35_CITIES, "en", false), mode: "tap", success: "In about 20 years, printing spread from Mainz to cities all over Europe." },
    es: { instruction: "Los impresores llevaron lo que sabían de Maguncia a ciudades nuevas. Toca cada ciudad para saber quién imprimió ahí.", cities: cities(G35_CITIES, "es", false), mode: "tap", success: "En unos 20 años, la imprenta pasó de Maguncia a ciudades de toda Europa." },
  },
  "6-8": {
    en: { instruction: "Tap the cities in the order printing arrived, starting with Mainz.", cities: cities(G68_CITIES, "en", false), mode: "order", success: "Printing moved along rivers and trade routes, from Mainz to Italy, France and England in about 25 years." },
    es: { instruction: "Toca las ciudades en el orden en que llegó la imprenta, empezando por Maguncia.", cities: cities(G68_CITIES, "es", false), mode: "order", success: "La imprenta avanzó por ríos y rutas de comercio: de Maguncia a Italia, Francia e Inglaterra en unos 25 años." },
  },
  "9-12": {
    en: { instruction: "Tap the cities in the order printing arrived. Notice how trained printers carried the technology from city to city.", cities: cities(G912_CITIES, "en", false), mode: "order", success: "Within about 25 years of Gutenberg's Bible, presses were working from Spain to Poland. By 1500, there were presses in more than 250 towns." },
    es: { instruction: "Toca las ciudades en el orden en que llegó la imprenta. Observa cómo los impresores formados llevaron la tecnología de una ciudad a otra.", cities: cities(G912_CITIES, "es", false), mode: "order", success: "Unos 25 años después de la Biblia de Gutenberg, ya había imprentas desde España hasta Polonia. En 1500, había imprentas en más de 250 ciudades." },
  },
};

// ---------------------------------------------------------------------------
// Effects: cause and effect at the reading desk.
// ---------------------------------------------------------------------------

const EFFECTS: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Printing made many copies. What happened next?",
      items: [
        {
          kind: "choice",
          prompt: "Printers made many copies of a book. What happened?",
          options: [{ text: "More people could read it", emoji: "📚" }, { text: "Fewer people could read it", emoji: "🚫" }],
          answer: 0,
          explain: "More copies meant more people could read the same book.",
        },
        {
          kind: "choice",
          prompt: "In 1517, Martin Luther wrote his ideas. Printers made many copies. How fast did his ideas go?",
          options: [{ text: "Very fast", emoji: "🐇" }, { text: "Very slow", emoji: "🐢" }],
          answer: 0,
          explain: "Printed copies went to many towns, so his ideas spread fast.",
        },
        {
          kind: "choice",
          prompt: "What did people start to print in 1605?",
          options: [{ text: "Newspapers", emoji: "📰" }, { text: "Bibles", emoji: "📖" }],
          answer: 0,
          explain: "Bibles were printed long before, around 1455. In 1605, some of the first newspapers were printed.",
        },
      ],
    },
    es: {
      intro: "La imprenta hizo muchas copias. ¿Qué pasó después?",
      items: [
        {
          kind: "choice",
          prompt: "Los impresores hicieron muchas copias de un libro. ¿Qué pasó?",
          options: [{ text: "Más personas pudieron leerlo", emoji: "📚" }, { text: "Menos personas pudieron leerlo", emoji: "🚫" }],
          answer: 0,
          explain: "Más copias querían decir que más personas podían leer el mismo libro.",
        },
        {
          kind: "choice",
          prompt: "En 1517, Martín Lutero escribió sus ideas. Los impresores hicieron muchas copias. ¿Qué tan rápido viajaron sus ideas?",
          options: [{ text: "Muy rápido", emoji: "🐇" }, { text: "Muy lento", emoji: "🐢" }],
          answer: 0,
          explain: "Las copias impresas llegaron a muchos pueblos, así que sus ideas viajaron rápido.",
        },
        {
          kind: "choice",
          prompt: "¿Qué se empezó a imprimir en 1605?",
          options: [{ text: "Periódicos", emoji: "📰" }, { text: "Biblias", emoji: "📖" }],
          answer: 0,
          explain: "Las Biblias se imprimían desde mucho antes, alrededor de 1455. En 1605 se imprimieron algunos de los primeros periódicos.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Match each cause with its effect.",
      items: [
        {
          kind: "choice",
          prompt: "In 1517, Martin Luther wrote ideas about changing the church. Why did his ideas spread so quickly?",
          options: [
            { text: "Printers made thousands of copies of his writings" },
            { text: "He walked to every town to tell people" },
            { text: "Monks copied his writings by hand" },
          ],
          answer: 0,
          explain: "Printers could make many copies fast, so Luther's pamphlets reached readers all over Germany in a short time.",
        },
        {
          kind: "choice",
          prompt: "In 1543, a book by Copernicus said the Earth moves around the Sun. How did printing help scientists like him?",
          options: [
            { text: "Every reader got the same words and pictures" },
            { text: "It kept their ideas secret" },
            { text: "It made every copy a little different" },
          ],
          answer: 0,
          explain: "Printed copies were identical, so scientists in different cities could study and check the very same work.",
        },
        {
          kind: "choice",
          prompt: "Books became cheaper and easier to find. What happened over time?",
          options: [
            { text: "More people learned to read" },
            { text: "Everyone learned to read right away" },
            { text: "People stopped reading" },
          ],
          answer: 0,
          explain: "More books helped more people learn to read, but it happened slowly, over many years.",
        },
      ],
    },
    es: {
      intro: "Une cada causa con su efecto.",
      items: [
        {
          kind: "choice",
          prompt: "En 1517, Martín Lutero escribió ideas para cambiar la Iglesia. ¿Por qué sus ideas se difundieron tan rápido?",
          options: [
            { text: "Los impresores hicieron miles de copias de sus textos" },
            { text: "Él caminó a cada pueblo para contarlas" },
            { text: "Unos monjes copiaron sus textos a mano" },
          ],
          answer: 0,
          explain: "Los impresores podían hacer muchas copias rápido, así que los folletos de Lutero llegaron a lectores de toda Alemania en poco tiempo.",
        },
        {
          kind: "choice",
          prompt: "En 1543, un libro de Copérnico dijo que la Tierra gira alrededor del Sol. ¿Cómo ayudó la imprenta a científicos como él?",
          options: [
            { text: "Cada lector recibía las mismas palabras y dibujos" },
            { text: "Mantenía sus ideas en secreto" },
            { text: "Hacía que cada copia fuera un poco distinta" },
          ],
          answer: 0,
          explain: "Las copias impresas eran idénticas, así que científicos de distintas ciudades podían estudiar y revisar exactamente el mismo trabajo.",
        },
        {
          kind: "choice",
          prompt: "Los libros se volvieron más baratos y fáciles de conseguir. ¿Qué pasó con el tiempo?",
          options: [
            { text: "Más personas aprendieron a leer" },
            { text: "Todo el mundo aprendió a leer enseguida" },
            { text: "La gente dejó de leer" },
          ],
          answer: 0,
          explain: "Más libros ayudaron a que más personas aprendieran a leer, pero ocurrió poco a poco, a lo largo de muchos años.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Trace how printing changed what came after it.",
      items: [
        {
          kind: "order",
          prompt: "Put these events in order, from earliest to latest.",
          items: [
            "Gutenberg's Bible is finished in Mainz (c. 1455)",
            "Luther's Ninety-five Theses spread in print (1517)",
            "Copernicus's book on the planets is printed in Nuremberg (1543)",
            "\"Relation\", one of the first newspapers, is printed in Strasbourg (1605)",
          ],
          explain: "In about 150 years, printing went from Bibles to religious debate, new science and regular news.",
        },
        {
          kind: "choice",
          prompt: "Which effect of printing helped the Protestant Reformation grow?",
          options: [
            { text: "Cheap pamphlets spread Luther's ideas to many readers quickly" },
            { text: "Printing was banned, so people met in secret" },
            { text: "Only priests were allowed to own printed books" },
          ],
          answer: 0,
          explain: "Printers turned out Luther's pamphlets in large numbers, so his ideas reached far more people than handwritten copies could.",
        },
        {
          kind: "choice",
          prompt: "Why did identical printed copies matter for science?",
          options: [
            { text: "Scholars in different places could compare and check the same text and diagrams" },
            { text: "Scientists no longer needed to observe anything" },
            { text: "Each copy could be changed to fit the reader" },
          ],
          answer: 0,
          explain: "When every copy matched, readers could test the same ideas and spot errors, like in Copernicus's 1543 book about the planets.",
        },
      ],
    },
    es: {
      intro: "Sigue cómo la imprenta cambió lo que vino después.",
      items: [
        {
          kind: "order",
          prompt: "Ordena estos hechos, del más antiguo al más reciente.",
          items: [
            "Se termina la Biblia de Gutenberg en Maguncia (c. 1455)",
            "Las noventa y cinco tesis de Lutero se difunden impresas (1517)",
            "Se imprime en Núremberg el libro de Copérnico sobre los planetas (1543)",
            "Se imprime en Estrasburgo \"Relation\", uno de los primeros periódicos (1605)",
          ],
          explain: "En unos 150 años, la imprenta pasó de las Biblias a los debates religiosos, la nueva ciencia y las noticias.",
        },
        {
          kind: "choice",
          prompt: "¿Qué efecto de la imprenta ayudó a crecer a la Reforma protestante?",
          options: [
            { text: "Los folletos baratos llevaron rápido las ideas de Lutero a muchos lectores" },
            { text: "Se prohibió la imprenta, así que la gente se reunía en secreto" },
            { text: "Solo los sacerdotes podían tener libros impresos" },
          ],
          answer: 0,
          explain: "Los impresores hicieron muchísimos folletos de Lutero, así que sus ideas llegaron a mucha más gente que con copias a mano.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué importaban las copias impresas idénticas para la ciencia?",
          options: [
            { text: "Estudiosos de distintos lugares podían comparar y revisar el mismo texto y los mismos diagramas" },
            { text: "Los científicos ya no necesitaban observar nada" },
            { text: "Cada copia se podía cambiar según el lector" },
          ],
          answer: 0,
          explain: "Cuando todas las copias eran iguales, los lectores podían poner a prueba las mismas ideas y encontrar errores, como en el libro de Copérnico de 1543 sobre los planetas.",
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Weigh the evidence: how far did printing's effects reach?",
      items: [
        {
          kind: "choice",
          prompt: "Historians call books printed before 1501 \"incunabula\". About how many towns in Europe had a press by 1500?",
          options: [{ text: "More than 250" }, { text: "About 10" }, { text: "Only Mainz" }],
          answer: 0,
          explain: "Commonly cited counts put presses in more than 250 European towns by 1500, producing many thousands of editions.",
        },
        {
          kind: "evidence",
          prompt: "How did printing change Europe? Choose a claim and the two pieces of evidence that best support it.",
          claims: ["It mainly changed religion.", "It changed how knowledge spread in many fields."],
          evidence: [
            { text: "Luther's Ninety-five Theses (1517) and his pamphlets spread quickly in print, helping the Reformation grow.", supports: [0, 1] },
            { text: "Many of the earliest printed books were Bibles, prayer books and other religious works.", supports: [0] },
            { text: "Copernicus's book on the movement of the planets was printed in Nuremberg in 1543, so scholars could study identical copies.", supports: [1] },
            { text: "\"Relation\", one of the first newspapers, was printed in Strasbourg from 1605.", supports: [1] },
            { text: "Over time, more and cheaper books helped more people learn to read.", supports: [1] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
    es: {
      intro: "Evalúa la evidencia: ¿hasta dónde llegaron los efectos de la imprenta?",
      items: [
        {
          kind: "choice",
          prompt: "Los historiadores llaman \"incunables\" a los libros impresos antes de 1501. ¿Cuántas ciudades de Europa tenían imprenta en 1500, aproximadamente?",
          options: [{ text: "Más de 250" }, { text: "Unas 10" }, { text: "Solo Maguncia" }],
          answer: 0,
          explain: "Los cálculos más citados indican que en 1500 había imprentas en más de 250 ciudades europeas, que produjeron muchos miles de ediciones.",
        },
        {
          kind: "evidence",
          prompt: "¿Cómo cambió la imprenta a Europa? Elige una afirmación y las dos pruebas que mejor la apoyan.",
          claims: ["Cambió sobre todo la religión.", "Cambió la forma en que el conocimiento se difundía en muchos campos."],
          evidence: [
            { text: "Las noventa y cinco tesis de Lutero (1517) y sus folletos se difundieron rápido gracias a la imprenta y ayudaron a crecer a la Reforma.", supports: [0, 1] },
            { text: "Muchos de los primeros libros impresos fueron Biblias, libros de oraciones y otras obras religiosas.", supports: [0] },
            { text: "El libro de Copérnico sobre el movimiento de los planetas se imprimió en Núremberg en 1543, así que los estudiosos podían leer copias idénticas.", supports: [1] },
            { text: "\"Relation\", uno de los primeros periódicos, se imprimió en Estrasburgo desde 1605.", supports: [1] },
            { text: "Con el tiempo, libros más numerosos y baratos ayudaron a que más personas aprendieran a leer.", supports: [1] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Journal check.
// ---------------------------------------------------------------------------

const JOURNAL_CHECK: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Let's remember how printing traveled.",
      items: [
        {
          kind: "choice",
          prompt: "Printers left Mainz. What did they take with them?",
          options: [{ text: "How to print", emoji: "🖨️" }, { text: "Nothing at all", emoji: "🤷" }],
          answer: 0,
          explain: "They knew how to print, so they could start new print shops in new towns.",
        },
        {
          kind: "choice",
          prompt: "Where was the first press in the Americas?",
          options: [{ text: "Mexico City", emoji: "🇲🇽" }, { text: "Mainz", emoji: "🏰" }, { text: "On a ship", emoji: "⛵" }],
          answer: 0,
          explain: "The first press in the Americas started in Mexico City in 1539.",
        },
        {
          kind: "choice",
          prompt: "Who had movable type before Mainz?",
          options: [{ text: "China and Korea", emoji: "🏯" }, { text: "Nobody", emoji: "🚫" }],
          answer: 0,
          explain: "People in China and Korea printed with movable type long before Gutenberg.",
        },
      ],
    },
    es: {
      intro: "Recordemos cómo viajó la imprenta.",
      items: [
        {
          kind: "choice",
          prompt: "Los impresores se fueron de Maguncia. ¿Qué se llevaron?",
          options: [{ text: "Lo que sabían de imprimir", emoji: "🖨️" }, { text: "Nada", emoji: "🤷" }],
          answer: 0,
          explain: "Sabían imprimir, así que pudieron abrir talleres nuevos en otras ciudades.",
        },
        {
          kind: "choice",
          prompt: "¿Dónde estuvo la primera imprenta de América?",
          options: [{ text: "Ciudad de México", emoji: "🇲🇽" }, { text: "Maguncia", emoji: "🏰" }, { text: "En un barco", emoji: "⛵" }],
          answer: 0,
          explain: "La primera imprenta de América empezó a trabajar en la Ciudad de México en 1539.",
        },
        {
          kind: "choice",
          prompt: "¿Quién tuvo tipos móviles antes que Maguncia?",
          options: [{ text: "China y Corea", emoji: "🏯" }, { text: "Nadie", emoji: "🚫" }],
          answer: 0,
          explain: "En China y Corea ya imprimían con tipos móviles mucho antes que Gutenberg.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Show what you learned about how printing spread.",
      items: [
        {
          kind: "choice",
          prompt: "Why did many printers leave Mainz in 1462?",
          options: [
            { text: "The city was attacked during a war between two archbishops" },
            { text: "Gutenberg told them to sell books in other towns" },
            { text: "Printing was against the law in Mainz" },
          ],
          answer: 0,
          explain: "Soldiers attacked and sacked Mainz in 1462. Many printers left and took their skills with them, which helped printing spread.",
        },
        {
          kind: "choice",
          prompt: "What are \"incunabula\"?",
          options: [
            { text: "Books printed before the year 1501" },
            { text: "Books copied by hand in monasteries" },
            { text: "The metal letters used for printing" },
          ],
          answer: 0,
          explain: "Incunabula are the books printed in the first years of printing, before 1501.",
        },
        {
          kind: "choice",
          prompt: "Where did the first printing press in the Americas start working in 1539?",
          options: [{ text: "Mexico City" }, { text: "Seville" }, { text: "Venice" }],
          answer: 0,
          explain: "Juan Pablos, working for Juan Cromberger, a printer from Seville in Spain, began printing in Mexico City in 1539.",
        },
      ],
    },
    es: {
      intro: "Demuestra lo que aprendiste sobre cómo se extendió la imprenta.",
      items: [
        {
          kind: "choice",
          prompt: "¿Por qué muchos impresores se fueron de Maguncia en 1462?",
          options: [
            { text: "La ciudad fue atacada durante una guerra entre dos arzobispos" },
            { text: "Gutenberg les pidió vender libros en otras ciudades" },
            { text: "Imprimir estaba prohibido en Maguncia" },
          ],
          answer: 0,
          explain: "En 1462, unos soldados atacaron y saquearon Maguncia. Muchos impresores se fueron y llevaron su oficio a otros lugares, y eso ayudó a extender la imprenta.",
        },
        {
          kind: "choice",
          prompt: "¿Qué son los \"incunables\"?",
          options: [
            { text: "Libros impresos antes del año 1501" },
            { text: "Libros copiados a mano en los monasterios" },
            { text: "Las letras de metal que se usaban para imprimir" },
          ],
          answer: 0,
          explain: "Los incunables son los libros impresos en los primeros años de la imprenta, antes de 1501.",
        },
        {
          kind: "choice",
          prompt: "¿Dónde empezó a trabajar en 1539 la primera imprenta de América?",
          options: [{ text: "Ciudad de México" }, { text: "Sevilla" }, { text: "Venecia" }],
          answer: 0,
          explain: "Juan Pablos, que trabajaba para Juan Cromberger, un impresor de Sevilla, en España, empezó a imprimir en la Ciudad de México en 1539.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Explain how printing spread and why it mattered.",
      items: [
        {
          kind: "choice",
          prompt: "Which best explains how printing spread so quickly after 1462?",
          options: [
            { text: "Trained printers moved to new cities and opened their own shops" },
            { text: "Each city invented the printing press on its own" },
            { text: "Mainz shipped finished presses to every town in Europe" },
          ],
          answer: 0,
          explain: "Printing traveled with people. Printers like Ulrich Zell learned in Mainz and set up presses elsewhere, then trained new apprentices.",
        },
        {
          kind: "choice",
          prompt: "About how many European towns had a press by 1500?",
          options: [{ text: "More than 250" }, { text: "About 25" }, { text: "More than 10,000" }],
          answer: 0,
          explain: "The commonly cited figure is more than 250 towns, together printing many thousands of editions.",
        },
        {
          kind: "order",
          prompt: "Put these in order, from earliest to latest.",
          items: [
            "Bi Sheng makes movable type from clay in China (c. 1040)",
            "Gutenberg prints in Mainz (c. 1450)",
            "Mainz is sacked and printers leave (1462)",
            "The first press in the Americas opens in Mexico City (1539)",
          ],
          explain: "Movable type began in China, came to Mainz in metal, then spread across Europe and over the ocean.",
        },
        {
          kind: "write",
          prompt: "What new technology spreads ideas quickly today? How is it like the printing press?",
          starters: ["Today, ... spreads ideas quickly because ...", "Like the printing press, it ...", "One difference is ..."],
        },
      ],
    },
    es: {
      intro: "Explica cómo se extendió la imprenta y por qué fue importante.",
      items: [
        {
          kind: "choice",
          prompt: "¿Qué explica mejor por qué la imprenta se extendió tan rápido después de 1462?",
          options: [
            { text: "Impresores formados se mudaron a otras ciudades y abrieron sus propios talleres" },
            { text: "Cada ciudad inventó la imprenta por su cuenta" },
            { text: "Maguncia envió prensas terminadas a cada ciudad de Europa" },
          ],
          answer: 0,
          explain: "La imprenta viajó con las personas. Impresores como Ulrich Zell aprendieron en Maguncia, abrieron imprentas en otros lugares y formaron a nuevos aprendices.",
        },
        {
          kind: "choice",
          prompt: "¿Cuántas ciudades europeas tenían imprenta en 1500, aproximadamente?",
          options: [{ text: "Más de 250" }, { text: "Unas 25" }, { text: "Más de 10,000" }],
          answer: 0,
          explain: "La cifra más citada es de más de 250 ciudades, que juntas imprimieron muchos miles de ediciones.",
        },
        {
          kind: "order",
          prompt: "Ordena estos hechos, del más antiguo al más reciente.",
          items: [
            "Bi Sheng hace tipos móviles de arcilla en China (c. 1040)",
            "Gutenberg imprime en Maguncia (c. 1450)",
            "Maguncia es saqueada y los impresores se van (1462)",
            "Abre la primera imprenta de América en la Ciudad de México (1539)",
          ],
          explain: "Los tipos móviles nacieron en China, llegaron en metal a Maguncia y luego se extendieron por Europa y al otro lado del océano.",
        },
        {
          kind: "write",
          prompt: "¿Qué tecnología nueva difunde ideas rápidamente hoy? ¿En qué se parece a la imprenta?",
          starters: ["Hoy, ... difunde ideas rápido porque ...", "Igual que la imprenta, ...", "Una diferencia es que ..."],
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Argue from evidence about how printing spread.",
      items: [
        {
          kind: "number",
          prompt: "In what year did the first printing press in the Americas begin working in Mexico City?",
          answer: 1539,
          explain: "In 1539, Juan Pablos, working for the Seville printer Juan Cromberger, began printing in Mexico City, less than a century after Gutenberg's Bible.",
        },
        {
          kind: "choice",
          prompt: "Which statement about the history of movable type is most accurate?",
          options: [
            { text: "Movable type was used in China and Korea centuries before Gutenberg; he developed a metal-type system that spread rapidly in Europe" },
            { text: "Gutenberg invented the first printing of any kind" },
            { text: "Printing reached Europe only after it was used in the Americas" },
          ],
          answer: 0,
          explain: "Bi Sheng made clay movable type around 1040, and the Jikji was printed with metal type in Korea in 1377. Gutenberg's contribution was a practical system that spread quickly through Europe.",
        },
        {
          kind: "evidence",
          prompt: "What best explains how printing spread so far, so fast? Choose a claim and the two pieces of evidence that best support it.",
          claims: [
            "Printing spread because skilled printers moved and trained others.",
            "Printing spread because cities with money and readers wanted books.",
          ],
          evidence: [
            { text: "After Mainz was sacked in 1462, many printers left and set up shop elsewhere.", supports: [0] },
            { text: "Ulrich Zell learned printing in Mainz and set up the first press in Cologne around 1466.", supports: [0] },
            { text: "Two German printers set up Italy's first press at Subiaco in 1465.", supports: [0] },
            { text: "Venice, a rich trading city, became one of Europe's great printing centers.", supports: [1] },
            { text: "France's first press was set up at the university in Paris in 1470.", supports: [1] },
            { text: "The Seville printer Juan Cromberger sent Juan Pablos to open a press in Mexico City in 1539.", supports: [0, 1] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
    es: {
      intro: "Argumenta con evidencia sobre cómo se extendió la imprenta.",
      items: [
        {
          kind: "number",
          prompt: "¿En qué año empezó a trabajar en la Ciudad de México la primera imprenta de América?",
          answer: 1539,
          explain: "En 1539, Juan Pablos, que trabajaba para el impresor sevillano Juan Cromberger, empezó a imprimir en la Ciudad de México, menos de un siglo después de la Biblia de Gutenberg.",
        },
        {
          kind: "choice",
          prompt: "¿Cuál afirmación sobre la historia de los tipos móviles es más precisa?",
          options: [
            { text: "En China y Corea se usaron tipos móviles siglos antes que Gutenberg; él creó un sistema de tipos de metal que se extendió rápido por Europa" },
            { text: "Gutenberg inventó la primera forma de imprimir que existió" },
            { text: "La imprenta llegó a Europa después de usarse en América" },
          ],
          answer: 0,
          explain: "Bi Sheng hizo tipos móviles de arcilla alrededor de 1040, y el Jikji se imprimió con tipos de metal en Corea en 1377. El aporte de Gutenberg fue un sistema práctico que se difundió rápido por Europa.",
        },
        {
          kind: "evidence",
          prompt: "¿Qué explica mejor que la imprenta llegara tan lejos y tan rápido? Elige una afirmación y las dos pruebas que mejor la apoyan.",
          claims: [
            "La imprenta se extendió porque impresores con experiencia se mudaron y formaron a otras personas.",
            "La imprenta se extendió porque las ciudades con dinero y lectores querían libros.",
          ],
          evidence: [
            { text: "Después del saqueo de Maguncia en 1462, muchos impresores se fueron y abrieron talleres en otros lugares.", supports: [0] },
            { text: "Ulrich Zell aprendió a imprimir en Maguncia y abrió la primera imprenta de Colonia alrededor de 1466.", supports: [0] },
            { text: "Dos impresores alemanes abrieron la primera imprenta de Italia en Subiaco en 1465.", supports: [0] },
            { text: "Venecia, una rica ciudad de comercio, llegó a ser uno de los grandes centros de la imprenta en Europa.", supports: [1] },
            { text: "La primera imprenta de Francia se instaló en la universidad de París en 1470.", supports: [1] },
            { text: "El impresor sevillano Juan Cromberger envió a Juan Pablos a abrir una imprenta en la Ciudad de México en 1539.", supports: [0, 1] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// The chapter.
// ---------------------------------------------------------------------------

export const SPREAD_CHAPTER: Chapter = {
  id: "scattering",
  world: SPREAD_WORLD,
  activities: {
    map: { kind: "map", title: { en: "Map of Europe", es: "Mapa de Europa" }, icon: "🗺️", config: MAP },
    effects: { kind: "quiz", title: { en: "Causes and effects", es: "Causas y efectos" }, icon: "📰", config: EFFECTS },
  },
  journal: JOURNAL_CHECK,
  steps: [
    {
      id: "intro",
      dialogue: [
        {
          id: "scattering.intro",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "This is Mainz again. The year is 1462. Two leaders fight over the city. Soldiers attack Mainz. Many printers leave. They take printing with them.",
              T2: "It is 1462 in Mainz. Two archbishops, both powerful church leaders, are at war over who will rule the city. Soldiers attack and rob Mainz. Many printers leave and take their skills to new towns.",
              T3: "Mainz, 1462. Two rival archbishops are at war over who will control the city, and this year soldiers attack and sack it. Many people are forced to leave, including printers who learned their trade here. As they settle in new towns, they bring printing with them, and this helps it spread.",
              T4: "Mainz, 1462. A bitter war between two rival archbishops, each claiming the right to rule the city, ends with Mainz being stormed and sacked. Many residents are driven out, among them skilled *journeymen* who learned printing in its workshops. Historians think this scattering of trained printers helped carry the new technology to cities across Europe.",
            },
            es: {
              T1: "Esta es Maguncia otra vez. Es el año 1462. Dos líderes pelean por la ciudad. Unos soldados atacan Maguncia. Muchos impresores se van. Se llevan lo que saben.",
              T2: "Es el año 1462 en Maguncia. Dos arzobispos, líderes poderosos de la Iglesia, están en guerra para ver quién gobierna la ciudad. Unos soldados atacan y roban Maguncia. Muchos impresores se van y llevan su oficio a otras ciudades.",
              T3: "Maguncia, 1462. Dos arzobispos rivales están en guerra por el control de la ciudad, y este año unos soldados la atacan y la saquean. Muchas personas tienen que irse, entre ellas impresores que aprendieron su oficio aquí. Al instalarse en otras ciudades, llevan consigo la imprenta, y eso la ayuda a extenderse.",
              T4: "Maguncia, 1462. Una dura guerra entre dos arzobispos rivales, que se disputan el derecho a gobernar la ciudad, termina con el asalto y el saqueo de Maguncia. Muchos habitantes son expulsados, entre ellos *oficiales* con experiencia que aprendieron a imprimir en sus talleres. Los historiadores creen que esta dispersión de impresores formados ayudó a llevar la nueva tecnología a ciudades de toda Europa.",
            },
          },
        },
      ],
    },
    {
      id: "meet",
      objective: { type: "talk", npcId: "zell" },
      objectiveText: {
        goal: { en: "Talk to Ulrich Zell.", es: "Habla con Ulrich Zell." },
        hintTouch: { en: "Walk to him and tap 💬.", es: "Camina hacia él y toca 💬." },
        hintMouse: { en: "Walk to him and press F.", es: "Camina hacia él y presiona F." },
      },
    },
    {
      id: "map",
      dialogue: [
        {
          id: "scattering.zell",
          speaker: ZELL_SPEAKER,
          text: {
            en: {
              T1: "Hello! I am Ulrich Zell. I learned to print in Mainz. Now I live in Cologne. I made the first press here.",
              T2: "Hello! My name is Ulrich Zell. I learned how to print in Mainz. Around 1466, I set up the first printing press here in Cologne.",
              T3: "Good day. I am Ulrich Zell. I learned the art of printing in Mainz, and around 1466 I set up the first *printing press* here in Cologne. I am not the only one: printers trained in Mainz are opening shops in other cities, too.",
              T4: "Good day. My name is Ulrich Zell. I learned the printer's art in Mainz, and around 1466 I established the first *printing press* in Cologne, a busy city on the Rhine with a large university. Printers trained in Mainz are carrying the same knowledge to other towns, and each new shop trains apprentices of its own.",
            },
            es: {
              T1: "¡Hola! Soy Ulrich Zell. Aprendí a imprimir en Maguncia. Ahora vivo en Colonia. Hice la primera imprenta de aquí.",
              T2: "¡Hola! Me llamo Ulrich Zell. Aprendí a imprimir en Maguncia. Alrededor de 1466, abrí la primera imprenta aquí, en Colonia.",
              T3: "Buen día. Soy Ulrich Zell. Aprendí el arte de imprimir en Maguncia y, alrededor de 1466, instalé la primera *imprenta* aquí, en Colonia. No soy el único: impresores formados en Maguncia están abriendo talleres en otras ciudades.",
              T4: "Buen día. Me llamo Ulrich Zell. Aprendí el oficio de impresor en Maguncia y, alrededor de 1466, establecí la primera *imprenta* de Colonia, una ciudad muy activa a orillas del Rin, con una gran universidad. Los impresores formados en Maguncia llevan ese mismo conocimiento a otras ciudades, y cada taller nuevo forma a sus propios aprendices.",
            },
          },
        },
        {
          id: "scattering.mapGo",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Look at the map. Printing went to many cities. Find them!",
              T2: "Go to the map table. Find the cities where printers set up new shops.",
              T3: "Go to the map table. Find the cities where printing arrived in the years after Gutenberg, and see how far it traveled.",
              T4: "Go to the map table and trace the path of printing as trained printers carried it from Mainz to cities across Europe in the decades after Gutenberg.",
            },
            es: {
              T1: "Mira el mapa. La imprenta llegó a muchas ciudades. ¡Encuéntralas!",
              T2: "Ve a la mesa del mapa. Busca las ciudades donde los impresores abrieron talleres nuevos.",
              T3: "Ve a la mesa del mapa. Encuentra las ciudades adonde llegó la imprenta en los años después de Gutenberg y descubre qué tan lejos viajó.",
              T4: "Ve a la mesa del mapa y sigue el recorrido de la imprenta, mientras impresores formados la llevaban de Maguncia a ciudades de toda Europa en las décadas posteriores a Gutenberg.",
            },
          },
        },
      ],
      objective: { type: "station", station: "map" },
      objectiveText: {
        goal: {
          en: { T1: "Use the map.", T3: "Find the printing cities on the map." },
          es: { T1: "Usa el mapa.", T3: "Encuentra en el mapa las ciudades con imprenta." },
        },
        hintTouch: { en: "Walk to the map table and tap ✋.", es: "Camina a la mesa del mapa y toca ✋." },
        hintMouse: { en: "Walk to the map table and press F.", es: "Camina a la mesa del mapa y presiona F." },
      },
    },
    {
      id: "americas",
      dialogue: [
        {
          id: "scattering.mapDone",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "By 1500, more than 250 towns had printing. Books from then have a name. We call them *incunabula*.",
              T2: "By the year 1500, printing had spread to more than 250 towns in Europe. Books printed before 1501 have a special name: *incunabula*.",
              T3: "By 1500, printers were at work in more than 250 towns across Europe, and they had produced many thousands of *editions*. Books printed before 1501 are called *incunabula*, from a Latin word for \"cradle\", because printing was still young.",
              T4: "By 1500, presses had operated in more than 250 European towns, producing many thousands of *editions*. Scholars call the books printed before 1501 *incunabula*, from the Latin for \"cradle\", since they come from the infancy of printing in Europe.",
            },
            es: {
              T1: "En 1500, más de 250 ciudades tenían imprenta. Esos libros tienen un nombre. Se llaman *incunables*.",
              T2: "En el año 1500, la imprenta ya había llegado a más de 250 ciudades de Europa. Los libros impresos antes de 1501 tienen un nombre especial: *incunables*.",
              T3: "En 1500, había impresores trabajando en más de 250 ciudades de Europa, y ya habían producido muchos miles de *ediciones*. Los libros impresos antes de 1501 se llaman *incunables*, una palabra que viene de \"cuna\", porque la imprenta todavía era muy joven.",
              T4: "Hacia 1500, había imprentas en más de 250 ciudades europeas, que habían producido muchos miles de *ediciones*. Los especialistas llaman *incunables* a los libros impresos antes de 1501, palabra que viene del latín y se relaciona con \"cuna\", porque pertenecen a la infancia de la imprenta en Europa.",
            },
          },
        },
        {
          id: "scattering.zellNext",
          speaker: ZELL_SPEAKER,
          text: {
            en: {
              T1: "So many new presses! Printers keep moving. Where will printing go next?",
              T2: "So many new presses! Printers keep moving to new places. I wonder how far printing will go.",
              T3: "Every year, printers carry their tools and skills to new places. I wonder how far printing will travel, perhaps even beyond Europe.",
              T4: "Each year, more printers pack up their type and their skills and set out for new cities. I can only wonder how far this craft will travel once it leaves Europe behind.",
            },
            es: {
              T1: "¡Cuántas imprentas nuevas! Los impresores siguen viajando. ¿A dónde llegará la imprenta?",
              T2: "¡Cuántas imprentas nuevas! Los impresores siguen yendo a lugares nuevos. Me pregunto hasta dónde llegará la imprenta.",
              T3: "Cada año, los impresores llevan sus herramientas y su oficio a lugares nuevos. Me pregunto hasta dónde viajará la imprenta, quizás más allá de Europa.",
              T4: "Cada año, más impresores empacan sus tipos y su oficio y parten hacia ciudades nuevas. Solo puedo imaginar hasta dónde llegará este oficio cuando salga de Europa.",
            },
          },
        },
        {
          id: "scattering.mexico",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Printing crossed the ocean. In 1539, a press opened in Mexico City. It was the first in the Americas.",
              T2: "Printing even crossed the ocean. In 1539, a printer named Juan Pablos began printing in Mexico City. It was the first printing press in the Americas.",
              T3: "Printing did not stop at the edge of Europe. In 1539, Juan Pablos, who worked for Juan Cromberger, a printer from Seville in Spain, started the first *printing press* in the Americas, in Mexico City. Over time, printers there made books in Spanish and in Indigenous languages such as Nahuatl.",
              T4: "Printing did not stop at Europe's shores. In 1539, less than a century after Gutenberg's Bible, Juan Pablos, working on behalf of the Seville printer Juan Cromberger, began operating the first *printing press* in the Americas, in Mexico City. In the decades that followed, presses there produced books in Spanish and in Indigenous languages such as Nahuatl.",
            },
            es: {
              T1: "La imprenta cruzó el océano. En 1539, llegó a la Ciudad de México. Fue la primera imprenta de América.",
              T2: "La imprenta hasta cruzó el océano. En 1539, un impresor llamado Juan Pablos empezó a imprimir en la Ciudad de México. Fue la primera imprenta de América.",
              T3: "La imprenta no se quedó en Europa. En 1539, Juan Pablos, que trabajaba para Juan Cromberger, un impresor de Sevilla, en España, abrió la primera *imprenta* de América en la Ciudad de México. Con el tiempo, ahí se imprimieron libros en español y en lenguas indígenas, como el náhuatl.",
              T4: "La imprenta no se detuvo en las costas de Europa. En 1539, menos de un siglo después de la Biblia de Gutenberg, Juan Pablos, en nombre del impresor sevillano Juan Cromberger, puso en marcha la primera *imprenta* del continente americano, en la Ciudad de México. En las décadas siguientes, sus prensas produjeron libros en español y en lenguas indígenas como el náhuatl.",
            },
          },
        },
      ],
    },
    {
      id: "effects",
      dialogue: [
        {
          id: "scattering.luther",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Printing changed many things. In 1517, Martin Luther wrote about the church. Printers made many copies. Soon, many people read his ideas.",
              T2: "Printing changed much more than books. In 1517, a monk and teacher named Martin Luther wrote ideas about changing the church. Printers copied his short *pamphlets* quickly, and his ideas spread far.",
              T3: "Printing changed much more than how books were made. In 1517, Martin Luther, a monk and university teacher, wrote the Ninety-five Theses, a list of complaints about the church. Printers quickly made copies, and his *pamphlets* spread across Germany in a short time. This helped a movement called the Protestant *Reformation* grow.",
              T4: "Printing reshaped far more than book production. In 1517, Martin Luther, a monk and professor in Wittenberg, wrote the Ninety-five Theses criticizing the sale of indulgences. Printers reproduced the theses and his later *pamphlets* in large numbers, so his ideas reached readers across the German lands far faster than handwritten copies could. Print helped the Protestant *Reformation* grow from one man's protest into a movement that divided Western Christianity.",
            },
            es: {
              T1: "La imprenta cambió muchas cosas. En 1517, Martín Lutero escribió sobre la Iglesia. Los impresores hicieron muchas copias. Pronto, mucha gente leyó sus ideas.",
              T2: "La imprenta cambió mucho más que los libros. En 1517, un monje y maestro llamado Martín Lutero escribió ideas para cambiar la Iglesia. Los impresores copiaron rápido sus *folletos*, y sus ideas llegaron lejos.",
              T3: "La imprenta cambió mucho más que la forma de hacer libros. En 1517, Martín Lutero, un monje y profesor universitario, escribió las noventa y cinco tesis, una lista de críticas a la Iglesia. Los impresores hicieron copias rápidamente, y sus *folletos* recorrieron Alemania en poco tiempo. Esto ayudó a crecer a un movimiento llamado *Reforma protestante*.",
              T4: "La imprenta transformó mucho más que la producción de libros. En 1517, Martín Lutero, monje y profesor en Wittenberg, escribió las noventa y cinco tesis contra la venta de indulgencias. Los impresores reprodujeron las tesis y sus *folletos* posteriores en grandes cantidades, de modo que sus ideas llegaron a lectores de todas las tierras alemanas mucho más rápido que con copias a mano. La imprenta ayudó a que la *Reforma protestante* pasara de ser la protesta de una persona a un movimiento que dividió al cristianismo occidental.",
            },
          },
        },
        {
          id: "scattering.science",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Scientists printed books too. Every copy was the same. In 1543, a book said something new. The Earth moves around the Sun! Later, people printed the news.",
              T2: "Scientists printed their work, so every reader saw the same words and pictures. In 1543, a book by Copernicus said the Earth moves around the Sun. By 1605, one of the first *newspapers* was printed in Strasbourg.",
              T3: "Scientists could now share identical copies of their work. In 1543, a book by Copernicus about the movement of the planets was printed in Nuremberg. In 1605, \"Relation\", one of the first *newspapers*, began in Strasbourg. Little by little, more books helped more people learn to read. Go to the reading desk to explore these changes.",
              T4: "Scholars could now circulate identical copies of their findings, so readers in distant cities could test the same arguments and diagrams. In 1543, Copernicus's book on the movement of the planets was printed in Nuremberg, and from 1605 \"Relation\", one of the first *newspapers*, appeared in Strasbourg. Over generations, cheaper books also helped literacy grow. Visit the reading desk to examine these causes and effects.",
            },
            es: {
              T1: "Los científicos también imprimían libros. Todas las copias eran iguales. En 1543, un libro dijo algo nuevo. ¡La Tierra gira alrededor del Sol! Después, se imprimieron noticias.",
              T2: "Los científicos imprimían su trabajo, y así cada lector veía las mismas palabras y dibujos. En 1543, un libro de Copérnico dijo que la Tierra gira alrededor del Sol. En 1605, se imprimió en Estrasburgo uno de los primeros *periódicos*.",
              T3: "Ahora los científicos podían compartir copias idénticas de su trabajo. En 1543, se imprimió en Núremberg un libro de Copérnico sobre el movimiento de los planetas. En 1605, empezó en Estrasburgo \"Relation\", uno de los primeros *periódicos*. Poco a poco, más libros ayudaron a que más personas aprendieran a leer. Ve al atril de lectura para explorar estos cambios.",
              T4: "Los estudiosos ya podían difundir copias idénticas de sus descubrimientos, de modo que lectores de ciudades lejanas ponían a prueba los mismos argumentos y diagramas. En 1543, se imprimió en Núremberg el libro de Copérnico sobre el movimiento de los planetas, y desde 1605 apareció en Estrasburgo \"Relation\", uno de los primeros *periódicos*. Con el paso de las generaciones, los libros más baratos también ayudaron a que más personas aprendieran a leer. Visita el atril de lectura para analizar estas causas y efectos.",
            },
          },
        },
      ],
      objective: { type: "station", station: "effects" },
      objectiveText: {
        goal: {
          en: { T1: "Read at the desk.", T3: "Find out at the reading desk what printing changed." },
          es: { T1: "Lee en el atril.", T3: "Descubre en el atril de lectura qué cambió la imprenta." },
        },
        hintTouch: { en: "Walk to the reading desk and tap ✋.", es: "Camina al atril de lectura y toca ✋." },
        hintMouse: { en: "Walk to the reading desk and press F.", es: "Camina al atril de lectura y presiona F." },
      },
    },
    {
      id: "closing",
      dialogue: [
        {
          id: "scattering.closing",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "China and Korea had *movable type* first. Then came Mainz. Then printing went everywhere. What spreads ideas fast today? Think about it.",
              T2: "Long ago, people in China and Korea printed with *movable type*. Later, Gutenberg printed in Mainz. Then printers carried it across Europe and the ocean. What new tool spreads ideas fast today?",
              T3: "The story of printing connects many places: clay type in China, metal type in Korea, Gutenberg's press in Mainz, and new shops from Cologne to Mexico City. Each step helped ideas travel farther and faster. What new technology spreads ideas quickly today, and how is it like the *printing press*?",
              T4: "The history of printing links the whole world: Bi Sheng's clay *movable type* in China, the Jikji printed with metal type in Korea, Gutenberg's press in Mainz, and the printers who carried the craft from Cologne to Mexico City. Each advance changed who could share ideas and how fast. Which technology spreads ideas that quickly today, and what might its effects be, for better and for worse?",
            },
            es: {
              T1: "China y Corea tuvieron *tipos móviles* primero. Luego vino Maguncia. Luego la imprenta llegó a todas partes. ¿Qué difunde ideas rápido hoy? Piénsalo.",
              T2: "Hace mucho tiempo, en China y Corea se imprimía con *tipos móviles*. Después, Gutenberg imprimió en Maguncia. Luego los impresores la llevaron por Europa y al otro lado del océano. ¿Qué herramienta nueva difunde ideas rápido hoy?",
              T3: "La historia de la imprenta une muchos lugares: los tipos de arcilla de China, los tipos de metal de Corea, la prensa de Gutenberg en Maguncia y los talleres nuevos desde Colonia hasta la Ciudad de México. Cada paso ayudó a que las ideas viajaran más lejos y más rápido. ¿Qué tecnología nueva difunde ideas rápidamente hoy, y en qué se parece a la *imprenta*?",
              T4: "La historia de la imprenta une al mundo entero: los *tipos móviles* de arcilla de Bi Sheng en China, el Jikji impreso con tipos de metal en Corea, la prensa de Gutenberg en Maguncia y los impresores que llevaron el oficio desde Colonia hasta la Ciudad de México. Cada avance cambió quién podía compartir ideas y con qué rapidez. ¿Qué tecnología difunde ideas así de rápido hoy, y cuáles podrían ser sus efectos, buenos y malos?",
            },
          },
        },
      ],
    },
    { id: "journal", objective: { type: "journal" } },
  ],
};
