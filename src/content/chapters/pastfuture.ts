import { Lang, Line } from "../../i18n/types";
import { Chapter } from "../../game/quest";
import { PAST_FUTURE_WORLD } from "../../game/world";
import type { MapCity, MapConfig, PerBand, PerBandLang, QuizConfig } from "../../game/activities";
import type { PressConfig } from "../press";
import { PRESS } from "../press";
import { GlossaryEntry } from "../glossaryTypes";

// Chapter 8: Past or Future? Aldus Manutius's print shop, Venice, about 1500.
//
// Written for the 9-12 band only, at one reading level (about 9th grade), and
// built from the class's World History Unit 3 ("The Printing Press"):
//   3.1 What was first printed?        -> library station
//   3.2 How did it preserve the past?  -> library station
//   3.3 How did it spur exploration?   -> letter (press) and map stations
//   3.4 How much did it change things? -> counting station
// and the unit's essential question, "Did the printing press preserve the past
// or invent the future?", which the journal check asks students to argue.
//
// Historical notes for reviewers (sources are the unit's readings unless noted):
// - Aldus Manutius ran a famous press in Venice. He printed Aristotle in Greek
//   (1495-98) and small, portable books in italic type from 1501; told here as
//   "around 1500" (high confidence; outside the unit's readings). His lines
//   are teaching dialogue, not quotations.
// - "About 150 presses" in Venice by 1500 (unit 3.2 Source A, commonly cited;
//   "presses" may mean print shops, so hedged with "about").
// - Scribes could take up to a year to copy one book; universities chained
//   valuable books to reading tables; most people learned news from the
//   village priest and word of mouth (3.2 Source A).
// - Gutenberg's first texts: the Bible (his first major book), Donatus's Latin
//   grammar (Ars minor) and indulgences (3.1a). Which came first is uncertain,
//   so the Bible is "first major book" and the others "among the first".
//   Printers picked texts that would sell quickly to pay back their costs.
// - The humanists' search for ancient texts raised interest in Greek (Debus,
//   3.1b). The unit test key marks "Latin" for this item; the reading says
//   Greek, so the game uses Greek and docs/UNIT3_ALIGNMENT.md flags the key.
// - Columbus's letter: back in Spain in March 1493; printed first in Spanish
//   (Barcelona) and in Latin in Rome (Stephan Plannck); about a dozen editions
//   in 1493 alone (Edney counts eleven; Taylor nine), in Spain, Italy, France,
//   Switzerland and the Netherlands. Edition cities on the map: Barcelona,
//   Rome, Florence (Dati's verse version), Paris, Antwerp (1493) and Basel
//   (1494) (high confidence on the cities; outside the unit's readings).
//   Columbus believed he had reached islands near Asia. He claimed the
//   islands for Spain and took Indigenous people captive (3.3 Source B gives
//   "between ten and twenty-five"; the game says "several"). This is told
//   plainly, not as adventure.
// - Marco Polo's travel account and the invented tales credited to John de
//   Mandeville fed interest in India and China (3.3a, Taylor).
// - "About 20 million books" by 1500 is a common estimate; hedged.
// - Commercial arithmetic books from the 1480s; cities that got presses in
//   the 1400s grew about 60% faster from 1500 to 1600 than similar cities
//   (Dittmar, 3.4c). Other historians (Clark, Mokyr) think printing's overall
//   economic effect was smaller, so this is presented as a debate.
// - New editions let mapmakers correct old errors (Eisenstein, 3.4a); Cartier's
//   1545 line is quoted from the unit's handout (modern translation).
// - Luther: a third of books printed in Germany 1518-25 were his (John Man,
//   3.4b; "one estimate").
// - Exchange rates and prices in the counting-house problems are invented for
//   practice and say "suppose".

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };
const ALDUS_SPEAKER: Line = { en: "Aldus Manutius", es: "Aldo Manucio" };

/** This chapter is for grades 9-12 only; the same config fills every band slot. */
function highSchool<T>(perLang: Record<Lang, T>): PerBandLang<T> {
  return { "K-2": perLang, "3-5": perLang, "6-8": perLang, "9-12": perLang };
}

// ---------------------------------------------------------------------------
// Glossary terms introduced in this chapter.
// ---------------------------------------------------------------------------

export const GLOSSARY_PAST_FUTURE: GlossaryEntry[] = [
  {
    id: "humanism",
    emoji: "🏛️",
    term: { en: "humanism", es: "humanismo" },
    aliases: { en: ["humanist", "humanists", "Renaissance humanism"], es: ["humanista", "humanistas", "humanismo renacentista"] },
    simple: {
      en: "A way of thinking that focused on people, learning and education.",
      es: "Una forma de pensar centrada en las personas, el aprendizaje y la educación.",
    },
    full: {
      en: "A Renaissance movement that studied the writings of ancient Greece and Rome. Humanists searched for old texts on grammar, history, poetry and philosophy, and printing helped them share those texts widely.",
      es: "Un movimiento del Renacimiento que estudiaba los escritos de la antigua Grecia y Roma. Los humanistas buscaban textos antiguos de gramática, historia, poesía y filosofía, y la imprenta los ayudó a compartirlos con muchas personas.",
    },
  },
  {
    id: "vernacular",
    emoji: "🗣️",
    term: { en: "vernacular", es: "lengua vernácula" },
    aliases: { en: ["vernacular languages", "everyday languages"], es: ["vernácula", "lenguas vernáculas"] },
    simple: {
      en: "The everyday language people speak at home, like German, Spanish or Italian.",
      es: "La lengua que la gente habla todos los días, como el alemán, el español o el italiano.",
    },
    full: {
      en: "A people's own everyday language, as opposed to Latin, the language of scholars and the Church. At first most printed books were in Latin, but readers soon wanted books in the vernacular.",
      es: "La lengua cotidiana de un pueblo, a diferencia del latín, la lengua de los eruditos y de la Iglesia. Al principio, casi todos los libros impresos estaban en latín, pero pronto los lectores quisieron libros en su lengua vernácula.",
    },
  },
  {
    id: "dissemination",
    emoji: "📡",
    term: { en: "dissemination", es: "difusión" },
    aliases: { en: ["disseminate", "spread of information"], es: ["difundir", "difusión de la información"] },
    simple: {
      en: "Spreading information to many people.",
      es: "Hacer llegar información a muchas personas.",
    },
    full: {
      en: "The spreading of information widely. Printing made dissemination much faster, because one text could be copied hundreds of times and carried to many cities at once.",
      es: "La acción de hacer llegar información a muchas personas. La imprenta hizo la difusión mucho más rápida, porque un texto podía copiarse cientos de veces y llevarse a muchas ciudades a la vez.",
    },
  },
  {
    id: "commercial-arithmetic",
    emoji: "🧮",
    term: { en: "commercial arithmetic", es: "aritmética comercial" },
    aliases: { en: ["commercial arithmetics", "merchant arithmetic"], es: ["aritméticas comerciales"] },
    simple: {
      en: "A printed math book that taught the math of buying and selling.",
      es: "Un libro impreso de matemáticas que enseñaba las cuentas de comprar y vender.",
    },
    full: {
      en: "Printed math textbooks for merchants, sold from the 1480s. They taught how to figure profit, interest and money exchange, and how to keep account books.",
      es: "Libros impresos de matemáticas para comerciantes, que se vendían desde la década de 1480. Enseñaban a calcular ganancias, intereses y cambio de monedas, y a llevar libros de cuentas.",
    },
  },
];

// ---------------------------------------------------------------------------
// Library: what was first printed, and how printing preserved the past.
// ---------------------------------------------------------------------------

const LIBRARY: PerBandLang<QuizConfig> = highSchool({
  en: {
    intro: "The chained library: how did printing protect old knowledge?",
    items: [
      {
        kind: "choice",
        prompt: "What was the first major book Gutenberg printed?",
        options: [{ text: "The Iliad" }, { text: "The Bible" }, { text: "The Book of Kells" }, { text: "The Torah" }],
        answer: 1,
        explain:
          "Gutenberg's first major book was the Bible, in Latin, finished around 1455. A short Latin grammar and printed indulgence forms were among his first small jobs, and some may be even older.",
      },
      {
        kind: "choice",
        prompt: "Why did early printers choose texts like the Bible, a Latin grammar and indulgences?",
        options: [
          { text: "They were the shortest texts to print" },
          { text: "They would sell many copies quickly, paying back the cost of the shop" },
          { text: "The law allowed printers to print nothing else" },
          { text: "Scribes refused to copy them" },
        ],
        answer: 1,
        explain:
          "A print shop cost a fortune to set up. Printers needed texts that churches, schools and buyers wanted right away, so they could earn back what they had spent.",
      },
      {
        kind: "choice",
        prompt: "Why did universities chain some books to reading tables?",
        options: [
          { text: "The books were too heavy to lift" },
          { text: "Only priests were allowed to move them" },
          { text: "The books were extremely valuable" },
          { text: "Students kept losing their place" },
        ],
        answer: 2,
        explain:
          "Before printing, a scribe could spend up to a year copying one book by hand, so each copy was rare and expensive.",
      },
      {
        kind: "choice",
        prompt: "Humanist scholars searched for ancient texts by writers like Aristotle. Which language became more important to them as a result?",
        options: [{ text: "Latin" }, { text: "Arabic" }, { text: "Hebrew" }, { text: "Greek" }],
        answer: 3,
        explain:
          "Latin was already the language of scholars. The search for classical texts gave humanists a new awareness of Greek, the language Aristotle and many other ancient writers used.",
      },
      {
        kind: "order",
        prompt: "Put the steps in order: how an ancient text reached readers across Europe.",
        items: [
          "A scholar finds an old manuscript of an ancient writer",
          "An editor compares copies and corrects the mistakes",
          "The printer sets the text in type and prints hundreds of matching copies",
          "Merchants carry the copies to schools and universities in other cities",
        ],
        explain:
          "Once an ancient text was printed, hundreds of identical copies existed at once, so it was far less likely to be lost than a single handwritten manuscript.",
      },
    ],
  },
  es: {
    intro: "La biblioteca encadenada: ¿cómo protegió la imprenta el conocimiento antiguo?",
    items: [
      {
        kind: "choice",
        prompt: "¿Cuál fue el primer gran libro que imprimió Gutenberg?",
        options: [{ text: "La Ilíada" }, { text: "La Biblia" }, { text: "El Libro de Kells" }, { text: "La Torá" }],
        answer: 1,
        explain:
          "El primer gran libro de Gutenberg fue la Biblia, en latín, terminada alrededor de 1455. Una breve gramática latina y formularios impresos de indulgencias estuvieron entre sus primeros trabajos pequeños, y algunos podrían ser incluso más antiguos.",
      },
      {
        kind: "choice",
        prompt: "¿Por qué los primeros impresores eligieron textos como la Biblia, una gramática latina y las indulgencias?",
        options: [
          { text: "Eran los textos más cortos" },
          { text: "Se venderían muchas copias rápido, para recuperar lo que costó el taller" },
          { text: "La ley no permitía imprimir otra cosa" },
          { text: "Los escribas se negaban a copiarlos" },
        ],
        answer: 1,
        explain:
          "Abrir un taller de imprenta costaba una fortuna. Los impresores necesitaban textos que las iglesias, las escuelas y los compradores quisieran de inmediato, para recuperar lo que habían gastado.",
      },
      {
        kind: "choice",
        prompt: "¿Por qué las universidades encadenaban algunos libros a las mesas de lectura?",
        options: [
          { text: "Los libros pesaban demasiado" },
          { text: "Solo los sacerdotes podían moverlos" },
          { text: "Los libros eran muy valiosos" },
          { text: "Los estudiantes perdían la página" },
        ],
        answer: 2,
        explain:
          "Antes de la imprenta, un escriba podía tardar hasta un año en copiar un solo libro a mano, así que cada copia era rara y cara.",
      },
      {
        kind: "choice",
        prompt: "Los eruditos humanistas buscaban textos antiguos de autores como Aristóteles. ¿Qué idioma se volvió más importante para ellos por eso?",
        options: [{ text: "El latín" }, { text: "El árabe" }, { text: "El hebreo" }, { text: "El griego" }],
        answer: 3,
        explain:
          "El latín ya era la lengua de los eruditos. La búsqueda de textos clásicos les dio a los humanistas una nueva conciencia del griego, el idioma de Aristóteles y de muchos otros autores antiguos.",
      },
      {
        kind: "order",
        prompt: "Pon los pasos en orden: cómo un texto antiguo llegaba a lectores de toda Europa.",
        items: [
          "Un erudito encuentra un manuscrito viejo de un autor antiguo",
          "Un editor compara copias y corrige los errores",
          "El impresor compone el texto con tipos e imprime cientos de copias iguales",
          "Los comerciantes llevan las copias a escuelas y universidades de otras ciudades",
        ],
        explain:
          "Cuando un texto antiguo se imprimía, existían cientos de copias idénticas a la vez, así que era mucho menos probable que se perdiera que un solo manuscrito hecho a mano.",
      },
    ],
  },
});

// ---------------------------------------------------------------------------
// Letter: print Columbus's letter of 1493.
// ---------------------------------------------------------------------------

const LETTER_PRESS: PerBand<PressConfig> = {
  "K-2": PRESS["9-12"],
  "3-5": PRESS["9-12"],
  "6-8": PRESS["9-12"],
  "9-12": PRESS["9-12"],
};

const LETTER_LINES: PerBandLang<string[]> = highSchool({
  en: ["LETTER OF COLUMBUS", "on the islands", "he found", "Rome, 1493"],
  es: ["CARTA DE COLÓN", "sobre las islas", "que encontró", "Roma, 1493"],
});

// ---------------------------------------------------------------------------
// Map: where printers published the letter in 1493-94.
// ---------------------------------------------------------------------------

const LETTER_CITIES: Array<{ id: string; year: number; lat: number; lon: number; name: Record<Lang, string>; note: Record<Lang, string> }> = [
  {
    id: "barcelona",
    year: 1493,
    lat: 41.39,
    lon: 2.17,
    name: { en: "Barcelona", es: "Barcelona" },
    note: { en: "The first printed version, in Spanish, soon after Columbus returned.", es: "La primera versión impresa, en español, poco después del regreso de Colón." },
  },
  {
    id: "rome",
    year: 1493,
    lat: 41.9,
    lon: 12.5,
    name: { en: "Rome", es: "Roma" },
    note: { en: "Stephan Plannck printed it in Latin, so scholars across Europe could read it.", es: "Stephan Plannck la imprimió en latín, para que los eruditos de toda Europa pudieran leerla." },
  },
  {
    id: "florence",
    year: 1493,
    lat: 43.77,
    lon: 11.25,
    name: { en: "Florence", es: "Florencia" },
    note: { en: "A poet retold the voyage in Italian verse, a popular version for everyday readers.", es: "Un poeta contó el viaje en verso en italiano, una versión popular para lectores comunes." },
  },
  {
    id: "paris",
    year: 1493,
    lat: 48.86,
    lon: 2.35,
    name: { en: "Paris", es: "París" },
    note: { en: "A Latin edition reached readers in France the same year.", es: "Una edición en latín llegó a los lectores de Francia ese mismo año." },
  },
  {
    id: "antwerp",
    year: 1493,
    lat: 51.22,
    lon: 4.4,
    name: { en: "Antwerp", es: "Amberes" },
    note: { en: "A busy port city in the Netherlands, full of merchants and sailors.", es: "Una ciudad portuaria muy activa de los Países Bajos, llena de comerciantes y marineros." },
  },
  {
    id: "basel",
    year: 1494,
    lat: 47.56,
    lon: 7.59,
    name: { en: "Basel", es: "Basilea" },
    note: { en: "This edition added woodcut pictures of the islands and ships.", es: "Esta edición agregó grabados en madera de las islas y los barcos." },
  },
];

const letterCities = (lang: Lang): MapCity[] =>
  LETTER_CITIES.map((c) => ({ id: c.id, name: c.name[lang], year: c.year, lat: c.lat, lon: c.lon, note: c.note[lang] }));

const MAP: PerBandLang<MapConfig> = highSchool({
  en: {
    instruction: "Printers in many cities published Columbus's letter within about a year. Tap each city where an edition appeared.",
    cities: letterCities("en"),
    mode: "tap",
    success:
      "About a dozen editions appeared in 1493 alone, in Spain, Italy, France, Switzerland and the Netherlands. Printed news like this made more Europeans eager to explore, and to profit from the lands and peoples Columbus described.",
  },
  es: {
    instruction: "En muchas ciudades, los impresores publicaron la carta de Colón en un año, más o menos. Toca cada ciudad donde salió una edición.",
    cities: letterCities("es"),
    mode: "tap",
    success:
      "Solo en 1493 salieron unas doce ediciones, en España, Italia, Francia, Suiza y los Países Bajos. Noticias impresas como esta hicieron que más europeos quisieran explorar, y sacar provecho de las tierras y los pueblos que describía Colón.",
  },
});

// ---------------------------------------------------------------------------
// Counting house: printing, business and change.
// ---------------------------------------------------------------------------

const COUNTING: PerBandLang<QuizConfig> = highSchool({
  en: {
    intro: "The counting house: a merchant's arithmetic book, and a debate about change.",
    items: [
      {
        kind: "number",
        prompt: "A bookseller buys 120 printed books for 2 ducats each and sells them all for 3 ducats each. What is the profit, in ducats?",
        answer: 120,
        explain: "Each book earns 3 − 2 = 1 ducat, and 120 books × 1 ducat = 120 ducats of profit.",
      },
      {
        kind: "number",
        prompt: "A merchant borrows 200 ducats for one year at 10% interest. How many ducats must be paid back?",
        answer: 220,
        explain: "10% of 200 is 20, so the merchant pays back 200 + 20 = 220 ducats.",
      },
      {
        kind: "number",
        prompt: "Suppose 1 ducat is worth 6 lire. How many lire are 25 ducats worth?",
        answer: 150,
        explain: "25 × 6 = 150 lire. Printed arithmetic books taught merchants exactly this kind of money exchange.",
      },
      {
        kind: "choice",
        prompt: "Economist Jeremiah Dittmar compared cities. From 1500 to 1600, how did cities that got a press in the 1400s grow?",
        options: [
          { text: "About 60% faster than similar cities" },
          { text: "At exactly the same speed" },
          { text: "More slowly, because printing cost jobs" },
          { text: "They all shrank" },
        ],
        answer: 0,
        explain:
          "Dittmar found they grew about 60% faster than similar cities, even though they had no head start before printing arrived.",
      },
      {
        kind: "choice",
        prompt: "What is Dittmar's main explanation for that faster growth?",
        options: [
          { text: "Kings forced people to move there" },
          { text: "Printed books spread math, bookkeeping and business skills" },
          { text: "Printers paid no taxes" },
          { text: "The cities had better farmland" },
        ],
        answer: 1,
        explain:
          "Printed math and bookkeeping books helped merchants work out profits, interest and exchange rates. Not every historian agrees: some, like Gregory Clark, argue printing's overall effect on the economy was small.",
      },
      {
        kind: "choice",
        prompt: "Why could mapmakers fix old mistakes faster after printing?",
        options: [
          { text: "Kings had to approve every map" },
          { text: "New editions could correct errors, and every copy carried the fix" },
          { text: "Maps were copied from memory" },
          { text: "Changing maps was against the law" },
        ],
        answer: 1,
        explain:
          "A correction made once reached every reader of the new edition. As the explorer Jacques Cartier wrote in 1545, sailors \"have learned the opposite of the philosophers by true experience.\"",
      },
    ],
  },
  es: {
    intro: "La casa de cuentas: un libro de aritmética para comerciantes y un debate sobre el cambio.",
    items: [
      {
        kind: "number",
        prompt: "Un librero compra 120 libros impresos a 2 ducados cada uno y los vende todos a 3 ducados cada uno. ¿Cuál es la ganancia, en ducados?",
        answer: 120,
        explain: "Cada libro deja 3 − 2 = 1 ducado, y 120 libros × 1 ducado = 120 ducados de ganancia.",
      },
      {
        kind: "number",
        prompt: "Un comerciante pide prestados 200 ducados por un año, con un interés del 10%. ¿Cuántos ducados debe devolver?",
        answer: 220,
        explain: "El 10% de 200 es 20, así que el comerciante devuelve 200 + 20 = 220 ducados.",
      },
      {
        kind: "number",
        prompt: "Supón que 1 ducado vale 6 liras. ¿Cuántas liras valen 25 ducados?",
        answer: 150,
        explain: "25 × 6 = 150 liras. Los libros de aritmética impresos enseñaban a los comerciantes justo este tipo de cambio de monedas.",
      },
      {
        kind: "choice",
        prompt: "El economista Jeremiah Dittmar comparó ciudades. Entre 1500 y 1600, ¿cómo crecieron las ciudades que tuvieron imprenta en el siglo XV?",
        options: [
          { text: "Alrededor de un 60% más rápido que ciudades parecidas" },
          { text: "Exactamente al mismo ritmo" },
          { text: "Más despacio, porque la imprenta quitó empleos" },
          { text: "Todas se achicaron" },
        ],
        answer: 0,
        explain:
          "Dittmar encontró que crecieron alrededor de un 60% más rápido que ciudades parecidas, aunque no tenían ninguna ventaja antes de que llegara la imprenta.",
      },
      {
        kind: "choice",
        prompt: "¿Cuál es la explicación principal de Dittmar para ese crecimiento?",
        options: [
          { text: "Los reyes obligaron a la gente a mudarse ahí" },
          { text: "Los libros impresos difundieron las matemáticas, la contabilidad y las habilidades de negocios" },
          { text: "Los impresores no pagaban impuestos" },
          { text: "Las ciudades tenían mejores tierras de cultivo" },
        ],
        answer: 1,
        explain:
          "Los libros impresos de matemáticas y contabilidad ayudaron a los comerciantes a calcular ganancias, intereses y tipos de cambio. No todos los historiadores están de acuerdo: algunos, como Gregory Clark, piensan que el efecto general de la imprenta en la economía fue pequeño.",
      },
      {
        kind: "choice",
        prompt: "¿Por qué, después de la imprenta, los cartógrafos podían corregir errores viejos más rápido?",
        options: [
          { text: "Los reyes tenían que aprobar cada mapa" },
          { text: "Las ediciones nuevas podían corregir errores, y cada copia llevaba la corrección" },
          { text: "Los mapas se copiaban de memoria" },
          { text: "Cambiar los mapas estaba prohibido" },
        ],
        answer: 1,
        explain:
          "Una corrección hecha una vez llegaba a todos los lectores de la nueva edición. Como escribió el explorador Jacques Cartier en 1545, los marineros \"aprendieron lo contrario de los filósofos por la experiencia verdadera\".",
      },
    ],
  },
});

// ---------------------------------------------------------------------------
// Journal check: built on the unit test, ending with the essential question.
// ---------------------------------------------------------------------------

const JOURNAL_CHECK: PerBandLang<QuizConfig> = highSchool({
  en: {
    intro: "Journal check: use what you learned in this unit, then answer the big question.",
    items: [
      {
        kind: "choice",
        prompt: "What was Gutenberg's major innovation?",
        options: [
          { text: "He was the first person to make paper" },
          { text: "He carved clay blocks for Chinese characters" },
          { text: "Durable metal movable type for the European alphabet, used with a press of his own design" },
          { text: "He printed whole pages from carved wooden blocks" },
        ],
        answer: 2,
        explain:
          "Printing and movable type existed earlier in China and Korea. Gutenberg's step was metal type for the small European alphabet, combined with an effective press.",
      },
      {
        kind: "choice",
        prompt: "How did printing change the cost and availability of books over time?",
        options: [
          { text: "Books became more expensive and rare" },
          { text: "Prices stayed the same" },
          { text: "Books became cheaper and much more widely available" },
          { text: "Only the Church could buy books" },
        ],
        answer: 2,
        explain:
          "Books were not cheap at first, but prices soon began to fall. By 1500, Europe had an estimated 20 million printed books.",
      },
      {
        kind: "choice",
        prompt: "Before printing, how did most people in Europe learn information?",
        options: [
          { text: "From newspapers" },
          { text: "From the village priest and from word of mouth" },
          { text: "From books at home" },
          { text: "At public schools" },
        ],
        answer: 1,
        explain: "Most people never owned a book. Memory and spoken news carried information from person to person.",
      },
      {
        kind: "choice",
        prompt: "Which books fed Europeans' dreams about the riches of India and China?",
        options: [
          { text: "Novels about Africa and Russia" },
          { text: "Marco Polo's travel account and the invented tales of John de Mandeville" },
          { text: "Books on astronomy" },
          { text: "Books written at the Vatican" },
        ],
        answer: 1,
        explain:
          "Printing made these travel stories cheaper and more common. Some were true and some were pure fiction, but both made readers curious about distant lands.",
      },
      {
        kind: "choice",
        prompt: "What made Columbus's 1493 letter an early best seller?",
        options: [
          { text: "Columbus sold the copies himself" },
          { text: "About a dozen editions were printed across Europe in 1493 alone" },
          { text: "Schools required students to read it" },
          { text: "It was the only text printed that year" },
        ],
        answer: 1,
        explain:
          "Printers in Spain, Italy, France, Switzerland and the Netherlands published it within months, so news of the voyage spread far faster than any handwritten letter could.",
      },
      {
        kind: "choice",
        prompt: "Why did Martin Luther's ideas spread so quickly after 1517?",
        options: [
          { text: "He traveled to every city himself" },
          { text: "The Catholic Church paid to print them" },
          { text: "His writings were printed in huge numbers in German" },
          { text: "Everyone already agreed with him" },
        ],
        answer: 2,
        explain:
          "By one estimate, a third of all books printed in Germany from 1518 to 1525 were Luther's. Writing in German, the vernacular, let ordinary readers follow his arguments.",
      },
      {
        kind: "evidence",
        prompt: "The big question: Did the printing press do more to preserve the past, or to invent the future?",
        claims: ["The printing press did more to preserve the past.", "The printing press did more to invent the future."],
        evidence: [
          { text: "Printers made hundreds of identical copies of ancient Greek and Roman writers like Aristotle and Cicero.", supports: [0] },
          { text: "One of Gutenberg's first printed texts was a Latin grammar first written in the 300s.", supports: [0] },
          { text: "Most early printed books were in Latin, and many were religious, like the Bible.", supports: [0] },
          { text: "Columbus's letter spread across Europe in about a dozen editions in one year, encouraging new voyages.", supports: [1] },
          { text: "Luther's printed pamphlets helped start the Protestant Reformation.", supports: [1] },
          { text: "Cities with early presses grew faster as printed math books spread business skills.", supports: [1] },
          { text: "Because printed copies lasted, scholars could build on old knowledge and correct it in new editions.", supports: [0, 1] },
        ],
        pick: 2,
        reasoning: true,
      },
      {
        kind: "write",
        prompt: "In what ways did the printing press preserve the past? Use evidence from this unit.",
        starters: [
          "The printing press preserved the past by",
          "Before the printing press, most people in Europe",
          "Because books became cheaper and easier to make,",
          "One way the printing press helped preserve thoughts and beliefs was",
        ],
      },
    ],
  },
  es: {
    intro: "Revisión del diario: usa lo que aprendiste en esta unidad y luego responde la gran pregunta.",
    items: [
      {
        kind: "choice",
        prompt: "¿Cuál fue la gran innovación de Gutenberg?",
        options: [
          { text: "Fue la primera persona que hizo papel" },
          { text: "Talló bloques de arcilla para caracteres chinos" },
          { text: "Tipos móviles de metal resistentes para el alfabeto europeo, usados con una prensa de su propio diseño" },
          { text: "Imprimió páginas enteras con bloques de madera tallada" },
        ],
        answer: 2,
        explain:
          "La impresión y los tipos móviles ya existían antes en China y Corea. El aporte de Gutenberg fue el tipo de metal para el alfabeto europeo, que tiene pocas letras, combinado con una prensa eficaz.",
      },
      {
        kind: "choice",
        prompt: "¿Cómo cambió la imprenta el precio de los libros y lo fácil que era conseguirlos?",
        options: [
          { text: "Los libros se volvieron más caros y raros" },
          { text: "Los precios no cambiaron" },
          { text: "Los libros se volvieron más baratos y mucho más fáciles de conseguir" },
          { text: "Solo la Iglesia podía comprar libros" },
        ],
        answer: 2,
        explain:
          "Al principio los libros no eran baratos, pero los precios pronto empezaron a bajar. Para 1500, Europa tenía unos 20 millones de libros impresos, según los cálculos.",
      },
      {
        kind: "choice",
        prompt: "Antes de la imprenta, ¿cómo se enteraba de las cosas la mayoría de la gente en Europa?",
        options: [
          { text: "Por los periódicos" },
          { text: "Por el sacerdote del pueblo y por lo que contaba la gente" },
          { text: "Por los libros que tenían en casa" },
          { text: "En escuelas públicas" },
        ],
        answer: 1,
        explain: "La mayoría de las personas nunca tuvo un libro. La memoria y las noticias habladas llevaban la información de persona a persona.",
      },
      {
        kind: "choice",
        prompt: "¿Qué libros alimentaron los sueños de los europeos sobre las riquezas de la India y China?",
        options: [
          { text: "Novelas sobre África y Rusia" },
          { text: "El relato de viajes de Marco Polo y los cuentos inventados de Juan de Mandeville" },
          { text: "Libros de astronomía" },
          { text: "Libros escritos en el Vaticano" },
        ],
        answer: 1,
        explain:
          "La imprenta hizo que estas historias de viajes fueran más baratas y comunes. Algunas eran ciertas y otras pura ficción, pero todas despertaron la curiosidad de los lectores por tierras lejanas.",
      },
      {
        kind: "choice",
        prompt: "¿Qué convirtió la carta de Colón de 1493 en uno de los primeros éxitos de venta?",
        options: [
          { text: "Colón vendió las copias él mismo" },
          { text: "Solo en 1493 se imprimieron unas doce ediciones en toda Europa" },
          { text: "Las escuelas obligaban a leerla" },
          { text: "Fue el único texto impreso ese año" },
        ],
        answer: 1,
        explain:
          "Impresores de España, Italia, Francia, Suiza y los Países Bajos la publicaron en pocos meses, así que la noticia del viaje se difundió mucho más rápido de lo que habría podido una carta escrita a mano.",
      },
      {
        kind: "choice",
        prompt: "¿Por qué las ideas de Martín Lutero se difundieron tan rápido después de 1517?",
        options: [
          { text: "Él mismo viajó a cada ciudad" },
          { text: "La Iglesia católica pagó para imprimirlas" },
          { text: "Sus escritos se imprimieron en enormes cantidades en alemán" },
          { text: "Todos ya estaban de acuerdo con él" },
        ],
        answer: 2,
        explain:
          "Según un cálculo, un tercio de todos los libros impresos en Alemania entre 1518 y 1525 eran de Lutero. Escribir en alemán, la lengua vernácula, permitió que lectores comunes siguieran sus argumentos.",
      },
      {
        kind: "evidence",
        prompt: "La gran pregunta: ¿La imprenta hizo más por preservar el pasado o por inventar el futuro?",
        claims: ["La imprenta hizo más por preservar el pasado.", "La imprenta hizo más por inventar el futuro."],
        evidence: [
          { text: "Los impresores hicieron cientos de copias idénticas de autores antiguos de Grecia y Roma, como Aristóteles y Cicerón.", supports: [0] },
          { text: "Uno de los primeros textos que imprimió Gutenberg fue una gramática latina escrita por primera vez en el siglo IV.", supports: [0] },
          { text: "La mayoría de los primeros libros impresos estaban en latín, y muchos eran religiosos, como la Biblia.", supports: [0] },
          { text: "La carta de Colón se difundió por Europa en unas doce ediciones en un año, y animó nuevos viajes.", supports: [1] },
          { text: "Los folletos impresos de Lutero ayudaron a iniciar la Reforma protestante.", supports: [1] },
          { text: "Las ciudades con imprenta temprana crecieron más rápido, porque los libros de matemáticas difundieron habilidades de negocios.", supports: [1] },
          { text: "Como las copias impresas duraban, los eruditos podían partir del conocimiento antiguo y corregirlo en ediciones nuevas.", supports: [0, 1] },
        ],
        pick: 2,
        reasoning: true,
      },
      {
        kind: "write",
        prompt: "¿De qué maneras preservó el pasado la imprenta? Usa evidencia de esta unidad.",
        starters: [
          "La imprenta preservó el pasado al",
          "Antes de la imprenta, la mayoría de la gente en Europa",
          "Como los libros se volvieron más baratos y fáciles de hacer,",
          "Una forma en que la imprenta ayudó a preservar pensamientos y creencias fue",
        ],
      },
    ],
  },
});

// ---------------------------------------------------------------------------
// Chapter.
// ---------------------------------------------------------------------------

const stationGoal = (en: string, es: string, placeEn: string, placeEs: string) => ({
  goal: { en, es },
  hintTouch: { en: `Walk to ${placeEn} and tap ✋.`, es: `Camina ${placeEs} y toca ✋.` },
  hintMouse: { en: `Walk to ${placeEn} and press F.`, es: `Camina ${placeEs} y presiona F.` },
});

export const PAST_FUTURE_CHAPTER: Chapter = {
  id: "past-future",
  bands: ["9-12"],
  world: PAST_FUTURE_WORLD,
  activities: {
    library: { kind: "quiz", title: { en: "The chained library", es: "La biblioteca encadenada" }, icon: "⛓️", config: LIBRARY },
    letter: { kind: "press", title: { en: "Print the letter", es: "Imprime la carta" }, icon: "🖨️", config: LETTER_PRESS, lines: LETTER_LINES },
    map: { kind: "map", title: { en: "Where the letter went", es: "Adónde llegó la carta" }, icon: "🗺️", config: MAP },
    counting: { kind: "quiz", title: { en: "The counting house", es: "La casa de cuentas" }, icon: "🧮", config: COUNTING },
  },
  journal: JOURNAL_CHECK,
  steps: [
    {
      id: "intro",
      dialogue: [
        {
          id: "past-future.intro",
          speaker: JOURNAL,
          text: {
            en: "Venice, around 1500. About fifty years after Gutenberg's Bible, this rich trading city has roughly 150 presses at work, more than anywhere else in Europe. In this chapter you will gather evidence for one big question: did the *printing press* do more to preserve the past, or to invent the future?",
            es: "Venecia, alrededor de 1500. Unos cincuenta años después de la Biblia de Gutenberg, esta rica ciudad comercial tiene cerca de 150 prensas trabajando, más que ningún otro lugar de Europa. En este capítulo vas a reunir evidencia para una gran pregunta: ¿la *imprenta* hizo más por preservar el pasado o por inventar el futuro?",
          },
        },
      ],
    },
    {
      id: "meet",
      objective: { type: "talk", npcId: "aldus" },
      objectiveText: {
        goal: { en: "Talk to Aldus Manutius.", es: "Habla con Aldo Manucio." },
        hintTouch: { en: "Walk to him and tap 💬.", es: "Camina hacia él y toca 💬." },
        hintMouse: { en: "Walk to him and press F.", es: "Camina hacia él y presiona F." },
      },
    },
    {
      id: "library",
      dialogue: [
        {
          id: "past-future.aldus",
          speaker: ALDUS_SPEAKER,
          text: {
            en: "Welcome to my workshop. I am Aldus Manutius, and I publish the works of ancient Greek philosophers like Aristotle so that scholars in every European city can study exactly the same words. *Humanism*, the study of these ancient authors, depends on reliable texts that will not be lost or slowly corrupted by careless copying.",
            es: "Este es mi taller. Soy Aldo Manucio y publico las obras de filósofos de la antigua Grecia, como Aristóteles, para que los eruditos de todas las ciudades de Europa puedan estudiar exactamente las mismas palabras. El *humanismo*, el estudio de esos autores antiguos, depende de textos confiables que no se pierdan ni se deformen poco a poco por copias descuidadas.",
          },
        },
        {
          id: "past-future.library",
          speaker: ALDUS_SPEAKER,
          text: {
            en: "Within living memory, a *scribe* could spend an entire year copying a single *manuscript* by hand. Books were so valuable that universities chained them to their reading tables, and most people, who could not read at all, learned the news from the village priest or from rumors. Visit the chained library and examine what printing changed.",
            es: "No hace tanto tiempo, un *copista* podía pasar un año entero copiando a mano un solo *manuscrito*. Los libros eran tan valiosos que las universidades los encadenaban a sus mesas de lectura, y la mayoría de la gente, que no sabía leer, se enteraba de las noticias por el sacerdote del pueblo o por rumores. Visita la biblioteca encadenada y examina qué cambió la imprenta.",
          },
        },
      ],
      objective: { type: "station", station: "library" },
      objectiveText: stationGoal("Study the chained library.", "Estudia la biblioteca encadenada.", "the chained library", "a la biblioteca encadenada"),
    },
    {
      id: "letter",
      dialogue: [
        {
          id: "past-future.news",
          speaker: ALDUS_SPEAKER,
          text: {
            en: "Printing does more than keep old books alive. In 1493, Christopher Columbus returned to Spain and described, in a letter, the islands he had reached across the Atlantic, which he mistakenly believed lay near Asia. European readers who had grown up on Marco Polo's descriptions of the wealth of India and China were eager for exactly this kind of news.",
            es: "La imprenta hace más que mantener vivos los libros antiguos. En 1493, Cristóbal Colón volvió a España y describió en una carta las islas a las que había llegado al otro lado del Atlántico, que él creía, por error, cercanas a Asia. Los lectores europeos que habían crecido con las descripciones de Marco Polo sobre la riqueza de la India y China esperaban con ansias justo este tipo de noticias.",
          },
        },
        {
          id: "past-future.letterTruth",
          speaker: JOURNAL,
          text: {
            en: "The letter praised the islands' harbors, rivers and gold, but it also described claiming the islands for the king and queen of Spain, and during the voyage Columbus took several Indigenous people captive. For the people who already lived there, these were the first steps of a conquest. Print a run of the letter at the press.",
            es: "La carta elogiaba los puertos, los ríos y el oro de las islas, pero también contaba que Colón reclamó las islas para el rey y la reina de España, y durante el viaje tomó prisioneras a varias personas indígenas. Para los pueblos que ya vivían allí, fueron los primeros pasos de una conquista. Imprime una tirada de la carta en la prensa.",
          },
        },
      ],
      objective: { type: "station", station: "letter" },
      objectiveText: stationGoal("Print Columbus's letter.", "Imprime la carta de Colón.", "the press", "a la prensa"),
    },
    {
      id: "map",
      dialogue: [
        {
          id: "past-future.mapGo",
          speaker: JOURNAL,
          text: {
            en: "Once printers in several countries had copies, a single letter could become thousands of identical pages within months. No handwritten message could match that speed of *dissemination*. Go to the map table and identify the cities where printers published the letter.",
            es: "En cuanto los impresores de varios países tuvieron copias, una sola carta podía convertirse en miles de páginas idénticas en pocos meses. Ningún mensaje escrito a mano podía igualar esa rapidez de *difusión*. Ve a la mesa del mapa e identifica las ciudades donde los impresores publicaron la carta.",
          },
        },
      ],
      objective: { type: "station", station: "map" },
      objectiveText: stationGoal("Trace where the letter was printed.", "Sigue el recorrido de la carta impresa.", "the map table", "a la mesa del mapa"),
    },
    {
      id: "counting",
      dialogue: [
        {
          id: "past-future.counting",
          speaker: ALDUS_SPEAKER,
          text: {
            en: "Merchants are among my customers as well. Since the 1480s, printers have sold *commercial arithmetic* books that explain how to calculate profit, interest and currency exchange. Some modern historians argue that spreading these skills helped printing cities grow faster than their neighbors, while others conclude the overall effect was modest. Work through the merchant's book at the counting house and evaluate the evidence yourself.",
            es: "Entre mis clientes también hay comerciantes. Desde la década de 1480, los impresores venden libros de *aritmética comercial* que explican cómo calcular ganancias, intereses y cambio de monedas. Algunos historiadores actuales sostienen que difundir estas habilidades hizo que las ciudades con imprenta crecieran más rápido que sus vecinas, mientras que otros concluyen que el efecto general fue modesto. Resuelve el libro del comerciante en la casa de cuentas y evalúa la evidencia por tu cuenta.",
          },
        },
      ],
      objective: { type: "station", station: "counting" },
      objectiveText: stationGoal("Solve the merchant's book.", "Resuelve el libro del comerciante.", "the counting house", "a la casa de cuentas"),
    },
    {
      id: "closing",
      dialogue: [
        {
          id: "past-future.closing",
          speaker: ALDUS_SPEAKER,
          text: {
            en: "You have now gathered evidence on both sides. Printing preserved ancient books, mostly in Latin, yet it also spread news of unfamiliar lands, practical business skills and, soon afterward, Martin Luther's challenge to the Church, written in German, the *vernacular*. So did the press preserve the past or invent the future? Perhaps it had to accomplish the first before it could achieve the second.",
            es: "Ya reuniste evidencia de los dos lados. La imprenta preservó libros antiguos, casi todos en latín, pero también difundió noticias de tierras desconocidas, habilidades prácticas de negocios y, poco después, el desafío de Martín Lutero a la Iglesia, escrito en alemán, la *lengua vernácula*. Entonces, ¿la imprenta preservó el pasado o inventó el futuro? Tal vez tuvo que lograr lo primero antes de poder conseguir lo segundo.",
          },
        },
      ],
    },
    { id: "journal", objective: { type: "journal" } },
  ],
};
