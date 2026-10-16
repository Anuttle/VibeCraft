import { Band, Line } from "../../i18n/types";
import { Chapter } from "../../game/quest";
import { SCRIPTORIUM_WORLD } from "../../game/world";
import type { CopyConfig, PerBandLang, QuizConfig } from "../../game/activities";
import type { GlossaryEntry } from "../glossaryTypes";

// Chapter 1: The Scriptorium. A monastery in Europe, early 1400s.
//
// Historical notes for reviewers:
// - Brother Konrad is fictional; he represents typical monastic scribes. His
//   lines are written for teaching. The monastery is unnamed and generic.
// - Before printing, European books were copied by hand, often by monks and
//   nuns in a scriptorium. High confidence. (Some monasteries had no
//   dedicated room and copying happened elsewhere; "a room called a
//   scriptorium" is the standard simplification.)
// - Parchment was made from animal skin (soaked, stretched, scraped); vellum
//   is fine parchment, usually calfskin. Medium-high confidence on the
//   distinction: the terms are often used loosely, so the glossary says
//   "usually calfskin".
// - Quills were often goose feathers ("often from a goose"). High confidence.
// - Ruling lines before writing, and checking/correcting copies, were standard
//   practice. High confidence (used in the 6-8 order item).
// - A large book such as a Bible could take one scribe many months, even a
//   year or more. Hedged; estimates vary widely with size, script and
//   decoration. A large Bible could need a great many skins; stated only as
//   "many animal skins".
// - Hand copying introduced new errors that were passed on. High confidence.
// - By the 1400s paper was becoming common in Europe, and professional (lay)
//   scribes worked in towns for universities and customers. High confidence;
//   told lightly ("many", "becoming common").
// - "Verba volant, scripta manent" is a well-known Latin proverb (spoken words
//   fly away, written words remain); its origin is uncertain, so it is only
//   called "an old Latin saying". Used as copying text to avoid sacred texts
//   in a typing exercise.
// - "More than a million letters" in a large book: a whole Bible runs to
//   several million characters, so "more than a million" is conservative.
// - Gutenberg began printing with movable metal type in Mainz around 1450.
// - Every number in the ledger quiz is an assumption stated as "Suppose…";
//   none is presented as a historical figure.

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };
const KONRAD: Line = { en: "Brother Konrad", es: "Hermano Konrad" };
const UPPER_BANDS: Band[] = ["6-8", "9-12"];

export const SCRIPTORIUM_CHAPTER: Chapter = {
  id: "scriptorium",
  world: SCRIPTORIUM_WORLD,
  // Filled in below, after the configs are defined.
  activities: {},
  steps: [
    {
      id: "intro",
      dialogue: [
        {
          id: "scriptorium.intro",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "This is a monastery in Europe. The time is the early 1400s. Here, books are made by hand.",
              T2: "Welcome to a monastery in Europe in the early 1400s. Here, monks copy books by hand in a special room called a *scriptorium*.",
              T3: "A monastery in Europe, in the early 1400s. In a quiet room called the *scriptorium*, monks spend their days copying books by hand, letter by letter. In convents, nuns did the same work.",
              T4: "A monastery in Europe, in the early 1400s. In the *scriptorium*, a room set aside for writing, monks copy books by hand, one letter at a time. For centuries, monasteries and convents had been among the main places in Europe where books were made, copied and kept.",
            },
            es: {
              T1: "Este es un monasterio en Europa. Es el principio de los años 1400. Aquí los libros se hacen a mano.",
              T2: "Te damos la bienvenida a un monasterio de Europa, a principios de los años 1400. Aquí los monjes copian libros a mano en un cuarto especial llamado *scriptorium*.",
              T3: "Un monasterio en Europa, a principios de los años 1400. En un cuarto silencioso llamado *scriptorium*, los monjes pasan el día copiando libros a mano, letra por letra. En los conventos, las monjas hacían el mismo trabajo.",
              T4: "Un monasterio en Europa, a principios de los años 1400. En el *scriptorium*, un cuarto dedicado a la escritura, los monjes copian libros a mano, una letra a la vez. Durante siglos, los monasterios y conventos habían sido de los principales lugares de Europa donde se hacían, copiaban y guardaban libros.",
            },
          },
        },
      ],
    },
    {
      id: "meet",
      objective: { type: "talk", npcId: "scribe" },
      objectiveText: {
        goal: { en: "Talk to Brother Konrad.", es: "Habla con el hermano Konrad." },
        hintTouch: { en: "Walk to him and tap 💬.", es: "Camina hacia él y toca 💬." },
        hintMouse: { en: "Walk to him and press F.", es: "Camina hacia él y presiona F." },
      },
    },
    {
      id: "explain",
      dialogue: [
        {
          id: "scriptorium.konrad",
          speaker: KONRAD,
          text: {
            en: {
              T1: "Good day! I am Brother Konrad. I am a *scribe*. I copy books by hand. I write with a *quill*. It is a bird feather.",
              T2: "Good day! I am Brother Konrad, a *scribe*. I copy books by hand with a *quill*, a pen made from a bird's feather. I write on *parchment*, which is made from animal skin.",
              T3: "Good day. I am Brother Konrad, a *scribe*. I copy books by hand with a *quill*, often cut from a goose feather and dipped in *ink*. I write on *parchment*, made from animal skin that has been cleaned, stretched and scraped thin. A book written by hand is called a *manuscript*.",
              T4: "Good day. I am Brother Konrad, a *scribe* of this monastery. I copy books by hand with a *quill*, often cut from a goose feather and dipped in *ink*. I write on *parchment*, animal skin that has been soaked, stretched and scraped until it is thin and smooth; the finest kind, usually calfskin, is called *vellum*. A book written out by hand like this is a *manuscript*.",
            },
            es: {
              T1: "¡Buen día! Soy el hermano Konrad. Soy *copista*. Copio libros a mano. Escribo con una *pluma de ave*. Es una pluma de pájaro.",
              T2: "¡Buen día! Soy el hermano Konrad, un *copista*. Copio libros a mano con una *pluma de ave*, hecha con la pluma de un pájaro. Escribo sobre *pergamino*, que se hace con piel de animal.",
              T3: "Buen día. Soy el hermano Konrad, un *copista*. Copio libros a mano con una *pluma de ave*, muchas veces de ganso, que mojo en *tinta*. Escribo sobre *pergamino*, una piel de animal que se limpia, se estira y se raspa hasta quedar delgada. Un libro escrito a mano se llama *manuscrito*.",
              T4: "Buen día. Soy el hermano Konrad, *copista* de este monasterio. Copio libros a mano con una *pluma de ave*, a menudo de ganso, que mojo en *tinta*. Escribo sobre *pergamino*, piel de animal que se remoja, se estira y se raspa hasta que queda fina y lisa; la variedad más fina, por lo general de ternero, se llama *vitela*. Un libro escrito a mano de esta forma es un *manuscrito*.",
            },
          },
        },
        {
          id: "scriptorium.copyGo",
          speaker: KONRAD,
          text: {
            en: {
              T1: "Now you try! Go to the desk. Copy the words. Go slow and be careful.",
              T2: "Now it is your turn. Sit at the writing desk and copy the words. Be careful, because every mistake stays on the page.",
              T3: "Now it is your turn. Sit at the writing desk and copy the text exactly, letter by letter. Take care: a mistake on parchment is hard to remove, and whoever copies your book later will copy your mistakes too.",
              T4: "Now it is your turn. Take your place at the writing desk and copy the text exactly, letter by letter. Work carefully: an error on parchment must be scraped away with a knife, and anyone who later copies from your book will repeat whatever mistakes you leave behind.",
            },
            es: {
              T1: "¡Ahora te toca! Ve al escritorio. Copia las palabras. Hazlo despacio y con cuidado.",
              T2: "Ahora te toca a ti. Siéntate en el escritorio y copia las palabras. Ten cuidado, porque cada error se queda en la página.",
              T3: "Ahora te toca a ti. Siéntate en el escritorio y copia el texto tal como está, letra por letra. Ten cuidado: un error en el pergamino es difícil de borrar, y quien copie tu libro después copiará también tus errores.",
              T4: "Ahora te toca a ti. Ocupa tu lugar en el escritorio y copia el texto con exactitud, letra por letra. Trabaja con cuidado: un error en el pergamino hay que rasparlo con una cuchilla, y quien copie después a partir de tu libro repetirá cualquier error que dejes.",
            },
          },
        },
      ],
    },
    {
      id: "copy",
      objective: { type: "station", station: "desk" },
      objectiveText: {
        goal: {
          en: { T1: "Copy words at the desk.", T3: "Copy the text by hand at the writing desk." },
          es: { T1: "Copia palabras en el escritorio.", T3: "Copia el texto a mano en el escritorio." },
        },
        hintTouch: { en: "Walk to the writing desk and tap ✋.", es: "Camina al escritorio y toca ✋." },
        hintMouse: { en: "Walk to the writing desk and press F.", es: "Camina al escritorio y presiona F." },
      },
    },
    {
      id: "slow",
      dialogue: [
        {
          id: "scriptorium.slow",
          speaker: KONRAD,
          text: {
            en: {
              T1: "That was slow, right? A big book has many pages. It can take many months. Some take a year or more!",
              T2: "Writing by hand is slow! A big book, like a Bible, has hundreds of pages. One scribe could need many months, even a year or more, to copy it.",
              T3: "You see how slow it is. A large book such as a Bible has hundreds of pages. Working alone, a scribe could spend many months, sometimes a year or more, copying a single one. That is why books are rare and very expensive.",
              T4: "Now you understand the pace of our work. A large book such as a Bible runs to hundreds of pages, and a single scribe might need many months, even a year or more, to copy it alone. Add the cost of the parchment, which takes many animal skins for one book, and you can see why books are rare and expensive.",
            },
            es: {
              T1: "Fue lento, ¿verdad? Un libro grande tiene muchas páginas. Puede tardar muchos meses. ¡Algunos tardan un año o más!",
              T2: "¡Escribir a mano es lento! Un libro grande, como una Biblia, tiene cientos de páginas. Un copista podía necesitar muchos meses, incluso un año o más, para copiarlo.",
              T3: "Ya ves lo lento que es. Un libro grande, como una Biblia, tiene cientos de páginas. Trabajando solo, un copista podía pasar muchos meses, a veces un año o más, copiando uno. Por eso los libros son escasos y muy caros.",
              T4: "Ahora entiendes el ritmo de nuestro trabajo. Un libro grande, como una Biblia, tiene cientos de páginas, y un solo copista podía necesitar muchos meses, incluso un año o más, para copiarlo. Si sumas el costo del pergamino, que requiere muchas pieles de animal para un solo libro, verás por qué los libros son escasos y caros.",
            },
          },
        },
        {
          id: "scriptorium.mistakes",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Scribes get tired. Tired scribes make mistakes. The next copy keeps the mistakes. Then it gets new ones!",
              T2: "Even careful scribes made mistakes. When someone copied that book later, they copied the old mistakes and often added new ones.",
              T3: "Every copy made by hand could include new mistakes: a skipped word, a misspelled name, a repeated line. When a *manuscript* was copied again, the old errors were passed along, and more were added.",
              T4: "Each hand-made copy risked new errors, such as a skipped line, a misread word or a repeated phrase. Because later scribes copied from earlier copies, mistakes piled up over generations, so two *manuscripts* of the same text could differ in many small ways.",
            },
            es: {
              T1: "Los copistas se cansan. Con el cansancio, hay errores. La copia nueva tiene esos errores. ¡Y luego tiene más!",
              T2: "Hasta los copistas más cuidadosos cometían errores. Cuando alguien copiaba ese libro después, copiaba los errores viejos y muchas veces agregaba nuevos.",
              T3: "Cada copia hecha a mano podía tener errores nuevos: una palabra saltada, un nombre mal escrito, una línea repetida. Cuando se volvía a copiar un *manuscrito*, los errores viejos pasaban a la copia nueva, y se sumaban otros.",
              T4: "Cada copia hecha a mano corría el riesgo de tener errores nuevos, como una línea omitida, una palabra mal leída o una frase repetida. Como los copistas posteriores copiaban de copias anteriores, los errores se acumulaban de generación en generación, y dos *manuscritos* del mismo texto podían diferir en muchos detalles.",
            },
          },
        },
      ],
    },
    {
      id: "towns",
      bands: UPPER_BANDS,
      dialogue: [
        {
          id: "scriptorium.towns",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "By the 1400s, paper is easier to get. Some scribes work in towns. They copy books for money.",
              T2: "By the 1400s, paper was becoming common in Europe, and it cost less than parchment. Some scribes also worked in towns, copying books for students and other buyers.",
              T3: "By the 1400s, things were changing. Paper, cheaper than parchment, was becoming common in Europe. Besides monks and nuns, many professional scribes worked in towns, copying books for universities, merchants and other customers. Still, every copy had to be written by hand.",
              T4: "By the 1400s, the world of books was changing. Paper, less costly than parchment, was becoming common in Europe, and professional scribes in towns copied books for universities, lawyers, merchants and wealthy readers. Demand for books was growing, yet every copy still had to be written out by hand.",
            },
            es: {
              T1: "En los años 1400 hay más papel. Algunos copistas trabajan en las ciudades. Copian libros por dinero.",
              T2: "En los años 1400, el papel se volvía común en Europa y costaba menos que el pergamino. Algunos copistas también trabajaban en las ciudades, copiando libros para estudiantes y otros compradores.",
              T3: "En los años 1400, las cosas estaban cambiando. El papel, más barato que el pergamino, se volvía común en Europa. Además de monjes y monjas, muchos copistas profesionales trabajaban en las ciudades, copiando libros para universidades, comerciantes y otros clientes. Aun así, cada copia tenía que escribirse a mano.",
              T4: "En los años 1400, el mundo de los libros estaba cambiando. El papel, menos costoso que el pergamino, se volvía común en Europa, y en las ciudades había copistas profesionales que copiaban libros para universidades, abogados, comerciantes y lectores adinerados. La demanda de libros crecía, pero cada copia todavía tenía que escribirse a mano.",
            },
          },
        },
      ],
    },
    {
      id: "ledger",
      dialogue: [
        {
          id: "scriptorium.ledgerGo",
          speaker: KONRAD,
          text: {
            en: {
              T1: "Let's count! How long does a book take? Go to the library ledger.",
              T2: "Let's do some counting. Go to the library ledger and work out how long it takes to copy books by hand.",
              T3: "Let's put numbers to it. Go to the library ledger and work out how long copying takes. The numbers there are for practice, so read each question's assumptions carefully.",
              T4: "Let's measure the problem. At the library ledger, estimate how long hand copying takes. The figures are assumptions for practice rather than historical records, so read each question's assumptions carefully before calculating.",
            },
            es: {
              T1: "¡Vamos a contar! ¿Cuánto tarda un libro? Ve al registro de la biblioteca.",
              T2: "Hagamos algunas cuentas. Ve al registro de la biblioteca y calcula cuánto se tarda en copiar libros a mano.",
              T3: "Pongámosle números. Ve al registro de la biblioteca y calcula cuánto tarda la copia. Los números son para practicar, así que lee con atención lo que supone cada pregunta.",
              T4: "Midamos el problema. En el registro de la biblioteca, estima cuánto tarda la copia a mano. Las cifras son supuestos para practicar, no registros históricos, así que lee con atención lo que supone cada pregunta antes de calcular.",
            },
          },
        },
      ],
      objective: { type: "station", station: "ledger" },
      objectiveText: {
        goal: {
          en: { T1: "Do the math at the ledger.", T3: "Estimate copying time at the library ledger." },
          es: { T1: "Haz las cuentas en el registro.", T3: "Estima el tiempo de copia en el registro de la biblioteca." },
        },
        hintTouch: { en: "Walk to the library ledger and tap ✋.", es: "Camina al registro de la biblioteca y toca ✋." },
        hintMouse: { en: "Walk to the library ledger and press F.", es: "Camina al registro de la biblioteca y presiona F." },
      },
    },
    {
      id: "done",
      dialogue: [
        {
          id: "scriptorium.done",
          speaker: KONRAD,
          text: {
            en: {
              T1: "Thank you for your help! Copying is slow. But it is careful work.",
              T2: "Thank you for your help today. Copying is slow, but every book we make is precious.",
              T3: "Thank you for your help today. Our work is slow, but each book we finish will be read and treasured for many years.",
              T4: "Thank you for your help today. Our work is painstaking and slow, but each finished book may be read, studied and copied again for generations.",
            },
            es: {
              T1: "¡Gracias por tu ayuda! Copiar es lento. Pero es un trabajo cuidadoso.",
              T2: "Gracias por tu ayuda hoy. Copiar es lento, pero cada libro que hacemos es muy valioso.",
              T3: "Gracias por tu ayuda hoy. Nuestro trabajo es lento, pero cada libro que terminamos se leerá y se cuidará durante muchos años.",
              T4: "Gracias por tu ayuda hoy. Nuestro trabajo es minucioso y lento, pero cada libro terminado podrá leerse, estudiarse y volver a copiarse durante generaciones.",
            },
          },
        },
        {
          id: "scriptorium.next",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Books take a long time to make. They cost a lot. Few people have them. People need a faster way. Soon, someone in Germany will find one.",
              T2: "Books were rare and costly because each one took so long to copy. People needed a faster way to make books. Around 1450, in the German city of Mainz, Johannes Gutenberg would begin to print them.",
              T3: "Because every book had to be copied by hand, books stayed rare and expensive, and few people owned any. As more people wanted books, the need for a faster way to make them grew. Around 1450, in Mainz, Germany, Johannes Gutenberg began printing with movable metal type.",
              T4: "Hand copying kept books scarce and expensive: each one represented months of skilled labor and costly materials, and each copy risked new errors. As demand grew, so did the need for a faster, more reliable way to make books. Around 1450, in Mainz, Johannes Gutenberg began developing a system of printing with movable metal type that would meet that need in Europe.",
            },
            es: {
              T1: "Hacer un libro tarda mucho. Cuesta mucho. Poca gente tiene libros. Hace falta una forma más rápida. Pronto, alguien en Alemania la encontrará.",
              T2: "Los libros eran escasos y caros porque copiar cada uno tardaba mucho. Hacía falta una forma más rápida de hacer libros. Alrededor de 1450, en la ciudad alemana de Maguncia, Johannes Gutenberg comenzaría a imprimirlos.",
              T3: "Como cada libro tenía que copiarse a mano, los libros seguían siendo escasos y caros, y poca gente tenía alguno. A medida que más personas querían libros, crecía la necesidad de una forma más rápida de hacerlos. Alrededor de 1450, en Maguncia, Alemania, Johannes Gutenberg comenzó a imprimir con tipos móviles de metal.",
              T4: "La copia a mano mantenía los libros escasos y caros: cada uno representaba meses de trabajo especializado y materiales costosos, y cada copia corría el riesgo de tener errores nuevos. Al crecer la demanda, también creció la necesidad de una forma más rápida y confiable de hacer libros. Alrededor de 1450, en Maguncia, Johannes Gutenberg comenzó a desarrollar un sistema de impresión con tipos móviles de metal que respondería a esa necesidad en Europa.",
            },
          },
        },
      ],
    },
    {
      id: "journal",
      objective: { type: "journal" },
      objectiveText: {
        goal: {
          en: { T1: "Fill in your journal.", T3: "Answer the questions in the Printer's Journal." },
          es: { T1: "Completa tu diario.", T3: "Responde las preguntas del diario del impresor." },
        },
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Writing desk: copy by hand against the clock. The text is an old Latin
// saying, "Verba volant, scripta manent": spoken words fly away, written
// words remain.
// ---------------------------------------------------------------------------

export const DESK: PerBandLang<CopyConfig> = {
  "K-2": {
    en: { instruction: "Copy the word LUX. It is Latin for \"light\".", lines: ["LUX"], distractors: "OVW", report: "You copied {letters} letters in {seconds} seconds. A book has many, many more!" },
    es: { instruction: "Copia la palabra LUX. En latín significa «luz».", lines: ["LUX"], distractors: "OVW", report: "Copiaste {letters} letras en {seconds} segundos. ¡Un libro tiene muchísimas más!" },
  },
  "3-5": {
    en: { instruction: "Copy this old saying, letter by letter.", lines: ["Words fly away"], distractors: "qvz", report: "You copied {letters} letters in {seconds} seconds. A big book has hundreds of thousands of letters!" },
    es: { instruction: "Copia este dicho antiguo, letra por letra.", lines: ["Las palabras vuelan"], distractors: "qvz", report: "Copiaste {letters} letras en {seconds} segundos. ¡Un libro grande tiene cientos de miles de letras!" },
  },
  "6-8": {
    en: { instruction: "Copy this line exactly. It comes from an old Latin saying.", lines: ["Words fly away, writing stays."], distractors: "qvzk", report: "You copied {letters} letters in {seconds} seconds. A large book can have more than a million letters. How long would that take you?" },
    es: { instruction: "Copia esta línea con exactitud. Viene de un dicho antiguo en latín.", lines: ["Las palabras vuelan, lo escrito queda."], distractors: "qvzk", report: "Copiaste {letters} letras en {seconds} segundos. Un libro grande puede tener más de un millón de letras. ¿Cuánto tardarías tú?" },
  },
  "9-12": {
    en: { instruction: "Copy both lines exactly: an old Latin saying, then its meaning.", lines: ["Verba volant, scripta manent.", "Spoken words fly, written words remain."], distractors: "qxzk", report: "You copied {letters} letters in {seconds} seconds. At that pace, how long would a book of more than a million letters take?" },
    es: { instruction: "Copia las dos líneas con exactitud: un dicho antiguo en latín y luego su significado.", lines: ["Verba volant, scripta manent.", "Las palabras vuelan, lo escrito permanece."], distractors: "qxzk", report: "Copiaste {letters} letras en {seconds} segundos. A ese ritmo, ¿cuánto tardarías en copiar un libro de más de un millón de letras?" },
  },
};

// ---------------------------------------------------------------------------
// Library ledger: how slow is copying? Every number is a stated assumption.
// ---------------------------------------------------------------------------

export const LEDGER: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Let's think about how long books take to make.",
      items: [
        {
          kind: "choice",
          prompt: "One scribe writes every page by hand. A printing press prints pages fast. Which one makes more books?",
          options: [
            { text: "One scribe", emoji: "🪶" },
            { text: "A printing press", emoji: "🖨️" },
          ],
          answer: 1,
          explain: "A press can print many copies quickly. A scribe must write every copy by hand.",
        },
        {
          kind: "choice",
          prompt: "Suppose a scribe writes 1 page each day. A little book has 3 pages. How many days does it take?",
          options: [
            { text: "1 day", emoji: "1️⃣" },
            { text: "3 days", emoji: "3️⃣" },
          ],
          answer: 1,
          explain: "1 page each day, 3 pages. That is 3 days!",
        },
      ],
    },
    es: {
      intro: "Pensemos cuánto se tarda en hacer libros.",
      items: [
        {
          kind: "choice",
          prompt: "Un copista escribe cada página a mano. Una imprenta imprime páginas rápido. ¿Cuál hace más libros?",
          options: [
            { text: "Un copista", emoji: "🪶" },
            { text: "Una imprenta", emoji: "🖨️" },
          ],
          answer: 1,
          explain: "Una imprenta puede imprimir muchas copias rápido. Un copista tiene que escribir cada copia a mano.",
        },
        {
          kind: "choice",
          prompt: "Imagina que un copista escribe 1 página cada día. Un libro pequeño tiene 3 páginas. ¿Cuántos días tarda?",
          options: [
            { text: "1 día", emoji: "1️⃣" },
            { text: "3 días", emoji: "3️⃣" },
          ],
          answer: 1,
          explain: "1 página cada día, 3 páginas. ¡Son 3 días!",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "These numbers are made up for practice. They help us see how slow copying by hand was.",
      items: [
        {
          kind: "number",
          prompt: "Suppose a scribe copies 2 pages a day. How many pages does the scribe copy in 5 days?",
          answer: 10,
          explain: "2 pages × 5 days = 10 pages.",
        },
        {
          kind: "number",
          prompt: "Suppose a book has 30 pages, and the scribe still copies 2 pages a day. How many days does it take to copy the whole book?",
          answer: 15,
          explain: "30 pages ÷ 2 pages a day = 15 days. Real books were often much longer.",
        },
        {
          kind: "choice",
          prompt: "Suppose 3 scribes each copy a different part of that book at the same time. Will it take more days or fewer days?",
          options: [{ text: "Fewer days" }, { text: "More days" }, { text: "The same number of days" }],
          answer: 0,
          explain: "Sharing the work means each scribe copies fewer pages, so the book is done sooner. But it is still only one copy!",
        },
      ],
    },
    es: {
      intro: "Estos números son inventados para practicar. Nos ayudan a ver lo lento que era copiar a mano.",
      items: [
        {
          kind: "number",
          prompt: "Imagina que un copista copia 2 páginas al día. ¿Cuántas páginas copia en 5 días?",
          answer: 10,
          explain: "2 páginas × 5 días = 10 páginas.",
        },
        {
          kind: "number",
          prompt: "Imagina que un libro tiene 30 páginas y el copista sigue copiando 2 páginas al día. ¿Cuántos días tarda en copiar todo el libro?",
          answer: 15,
          explain: "30 páginas ÷ 2 páginas al día = 15 días. Los libros reales solían ser mucho más largos.",
        },
        {
          kind: "choice",
          prompt: "Imagina que 3 copistas copian, cada uno, una parte distinta de ese libro al mismo tiempo. ¿Tardarán más días o menos días?",
          options: [{ text: "Menos días" }, { text: "Más días" }, { text: "Los mismos días" }],
          answer: 0,
          explain: "Si comparten el trabajo, cada copista copia menos páginas y el libro se termina antes. ¡Pero sigue siendo una sola copia!",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "These numbers are assumptions for practice, not historical records. Use them to estimate how long copying took.",
      items: [
        {
          kind: "number",
          prompt: "Suppose a large book has 600 pages, and a scribe copies 3 pages a day. How many days does one copy take?",
          answer: 200,
          explain: "600 ÷ 3 = 200 days, more than six months of steady work for a single copy.",
        },
        {
          kind: "number",
          prompt: "Suppose 4 scribes share the same 600-page book equally, each still copying 3 pages a day. How many days does it take now?",
          answer: 50,
          explain: "Each scribe copies 600 ÷ 4 = 150 pages, and 150 ÷ 3 = 50 days. Faster, but four people are busy for one book.",
        },
        {
          kind: "choice",
          prompt: "Suppose a town wants 10 copies, and one scribe makes them one after another at 200 days each. About how long is that?",
          options: [{ text: "About 2,000 days, more than 5 years" }, { text: "About 200 days, less than a year" }, { text: "About 20 days, less than a month" }],
          answer: 0,
          explain: "10 × 200 = 2,000 days. Copying by hand does not get faster with more copies: each one takes the full time again.",
        },
      ],
    },
    es: {
      intro: "Estos números son supuestos para practicar, no registros históricos. Úsalos para estimar cuánto tardaba la copia.",
      items: [
        {
          kind: "number",
          prompt: "Imagina que un libro grande tiene 600 páginas y un copista copia 3 páginas al día. ¿Cuántos días tarda una copia?",
          answer: 200,
          explain: "600 ÷ 3 = 200 días, más de seis meses de trabajo constante para una sola copia.",
        },
        {
          kind: "number",
          prompt: "Imagina que 4 copistas se reparten por igual el mismo libro de 600 páginas, y cada uno sigue copiando 3 páginas al día. ¿Cuántos días tardan ahora?",
          answer: 50,
          explain: "Cada copista copia 600 ÷ 4 = 150 páginas, y 150 ÷ 3 = 50 días. Es más rápido, pero cuatro personas trabajan en un solo libro.",
        },
        {
          kind: "choice",
          prompt: "Imagina que una ciudad quiere 10 copias, y un copista las hace una tras otra, a 200 días cada una. ¿Cuánto tiempo es, más o menos?",
          options: [{ text: "Unos 2,000 días, más de 5 años" }, { text: "Unos 200 días, menos de un año" }, { text: "Unos 20 días, menos de un mes" }],
          answer: 0,
          explain: "10 × 200 = 2,000 días. Copiar a mano no se vuelve más rápido con más copias: cada una vuelve a tardar todo el tiempo.",
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Compare rates of production. All figures are assumptions for practice, not historical data.",
      items: [
        {
          kind: "number",
          prompt: "Suppose a scribe copies 3 pages per day and a book has 600 pages. How many days of work does one copy take?",
          answer: 200,
          explain: "600 ÷ 3 = 200 days per copy.",
        },
        {
          kind: "number",
          prompt: "Suppose a print shop needs 600 working days in total to set the type and print 150 copies of the same 600-page book. On average, how many days of work is that per copy?",
          answer: 4,
          explain: "600 ÷ 150 = 4 days per copy.",
        },
        {
          kind: "number",
          prompt: "Using your two answers, how many times faster per copy is the print shop than one scribe?",
          answer: 50,
          explain: "200 ÷ 4 = 50. Under these assumptions, printing is 50 times faster per copy, and every copy has the same text.",
        },
        {
          kind: "choice",
          prompt: "Suppose a customer wants just 1 copy of a book. Under the same assumptions, which is the better choice, and why?",
          options: [
            { text: "A scribe, because the print shop's setup work only pays off over many copies" },
            { text: "The print shop, because printing is always faster" },
            { text: "Neither, because one copy cannot be made" },
          ],
          answer: 0,
          explain: "Printing has a large up-front cost: all the type must be set before the first sheet is printed. That cost is shared across copies, so printing wins only when many copies are needed.",
        },
      ],
    },
    es: {
      intro: "Compara ritmos de producción. Todas las cifras son supuestos para practicar, no datos históricos.",
      items: [
        {
          kind: "number",
          prompt: "Imagina que un copista copia 3 páginas al día y un libro tiene 600 páginas. ¿Cuántos días de trabajo lleva una copia?",
          answer: 200,
          explain: "600 ÷ 3 = 200 días por copia.",
        },
        {
          kind: "number",
          prompt: "Imagina que un taller de imprenta necesita 600 días de trabajo en total para componer los tipos e imprimir 150 copias del mismo libro de 600 páginas. En promedio, ¿cuántos días de trabajo son por copia?",
          answer: 4,
          explain: "600 ÷ 150 = 4 días por copia.",
        },
        {
          kind: "number",
          prompt: "Con tus dos respuestas, ¿cuántas veces más rápido por copia es el taller de imprenta que un copista?",
          answer: 50,
          explain: "200 ÷ 4 = 50. Con estos supuestos, imprimir es 50 veces más rápido por copia, y todas las copias tienen el mismo texto.",
        },
        {
          kind: "choice",
          prompt: "Imagina que alguien quiere solo 1 copia de un libro. Con los mismos supuestos, ¿qué opción conviene más y por qué?",
          options: [
            { text: "Un copista, porque la preparación del taller solo compensa con muchas copias" },
            { text: "El taller de imprenta, porque imprimir siempre es más rápido" },
            { text: "Ninguna, porque no se puede hacer una sola copia" },
          ],
          answer: 0,
          explain: "Imprimir tiene un gran costo inicial: hay que componer todos los tipos antes de imprimir la primera hoja. Ese costo se reparte entre las copias, así que la imprenta conviene solo cuando se necesitan muchas.",
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Journal check.
// ---------------------------------------------------------------------------

export const SCRIPTORIUM_JOURNAL: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Let's remember what you learned!",
      items: [
        {
          kind: "choice",
          prompt: "How did Brother Konrad make books?",
          options: [
            { text: "By hand", emoji: "✍️" },
            { text: "With a printing machine", emoji: "🖨️" },
          ],
          answer: 0,
          explain: "Brother Konrad copied every book by hand. There were no printing presses in Europe yet.",
        },
        {
          kind: "choice",
          prompt: "Were books cheap or expensive?",
          options: [
            { text: "Expensive", emoji: "💰" },
            { text: "Cheap", emoji: "🪙" },
          ],
          answer: 0,
          explain: "Books cost a lot. Each one took a long time to make.",
        },
        {
          kind: "choice",
          prompt: "What did Brother Konrad write with?",
          options: [
            { text: "A quill made from a feather", emoji: "🪶" },
            { text: "A pencil", emoji: "✏️" },
          ],
          answer: 0,
          explain: "Scribes wrote with a quill. A quill is a bird feather dipped in ink.",
        },
      ],
    },
    es: {
      intro: "¡Recordemos lo que aprendiste!",
      items: [
        {
          kind: "choice",
          prompt: "¿Cómo hacía libros el hermano Konrad?",
          options: [
            { text: "A mano", emoji: "✍️" },
            { text: "Con una máquina de imprimir", emoji: "🖨️" },
          ],
          answer: 0,
          explain: "El hermano Konrad copiaba cada libro a mano. Todavía no había imprentas en Europa.",
        },
        {
          kind: "choice",
          prompt: "¿Los libros eran baratos o caros?",
          options: [
            { text: "Caros", emoji: "💰" },
            { text: "Baratos", emoji: "🪙" },
          ],
          answer: 0,
          explain: "Los libros costaban mucho. Hacer cada uno tardaba mucho tiempo.",
        },
        {
          kind: "choice",
          prompt: "¿Con qué escribía el hermano Konrad?",
          options: [
            { text: "Con una pluma de ave", emoji: "🪶" },
            { text: "Con un lápiz", emoji: "✏️" },
          ],
          answer: 0,
          explain: "Los copistas escribían con una pluma de ave. Es una pluma de pájaro que se moja en tinta.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Check what you learned about books copied by hand.",
      items: [
        {
          kind: "choice",
          prompt: "Why were books rare before printing in Europe?",
          options: [{ text: "Each one had to be copied by hand, which took a long time" }, { text: "Books were so cheap that nobody kept them" }, { text: "Only kings were allowed to own books" }],
          answer: 0,
          explain: "Copying a big book by hand could take many months. That made books rare and expensive, not cheap.",
        },
        {
          kind: "choice",
          prompt: "What was parchment made from?",
          options: [{ text: "Animal skin" }, { text: "Linen cloth" }, { text: "Tree leaves" }],
          answer: 0,
          explain: "Parchment was animal skin, cleaned, stretched and scraped thin. Paper, which came later to Europe, was often made from linen rags.",
        },
        {
          kind: "choice",
          prompt: "What could happen each time a book was copied by hand?",
          options: [{ text: "New mistakes could be added" }, { text: "The copy was always perfect" }, { text: "The words changed into another language by themselves" }],
          answer: 0,
          explain: "Even careful scribes made mistakes, and later copies repeated the old mistakes and added new ones.",
        },
      ],
    },
    es: {
      intro: "Revisa lo que aprendiste sobre los libros copiados a mano.",
      items: [
        {
          kind: "choice",
          prompt: "¿Por qué los libros eran escasos en Europa antes de la imprenta?",
          options: [{ text: "Cada uno tenía que copiarse a mano, y eso tardaba mucho" }, { text: "Los libros eran tan baratos que nadie los guardaba" }, { text: "Solo los reyes podían tener libros" }],
          answer: 0,
          explain: "Copiar un libro grande a mano podía tardar muchos meses. Por eso los libros eran escasos y caros, no baratos.",
        },
        {
          kind: "choice",
          prompt: "¿De qué se hacía el pergamino?",
          options: [{ text: "De piel de animal" }, { text: "De tela de lino" }, { text: "De hojas de árbol" }],
          answer: 0,
          explain: "El pergamino era piel de animal limpia, estirada y raspada hasta quedar delgada. El papel, que llegó después a Europa, a menudo se hacía con trapos de lino.",
        },
        {
          kind: "choice",
          prompt: "¿Qué podía pasar cada vez que se copiaba un libro a mano?",
          options: [{ text: "Se podían agregar errores nuevos" }, { text: "La copia siempre salía perfecta" }, { text: "Las palabras cambiaban solas a otro idioma" }],
          answer: 0,
          explain: "Hasta los copistas más cuidadosos se equivocaban, y las copias posteriores repetían los errores viejos y agregaban otros.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Show what you know about books before printing in Europe.",
      items: [
        {
          kind: "choice",
          prompt: "Which statement about books in Europe before about 1450 is true?",
          options: [
            { text: "Books were rare and expensive, and many people could not read" },
            { text: "Books were cheap, so most families owned several" },
            { text: "Everyone could read, so scribes made a book for every home" },
          ],
          answer: 0,
          explain: "Hand-copied books took months to make and used costly materials. Most people could not read, and few owned books.",
        },
        {
          kind: "choice",
          prompt: "By the 1400s, what was changing in the world of books?",
          options: [
            { text: "Paper was becoming common, and professional scribes also worked in towns" },
            { text: "Printing presses were already working in every town" },
            { text: "Monasteries had stopped copying books" },
          ],
          answer: 0,
          explain: "Paper cost less than parchment, and more people wanted books, but every copy was still written by hand.",
        },
        {
          kind: "order",
          prompt: "Put the steps of making a manuscript in order.",
          items: [
            "Make parchment from cleaned, stretched animal skin",
            "Mark faint lines on the page to keep the writing straight",
            "Copy the text with a quill and ink",
            "Check the copy for mistakes",
            "Sew the pages together into a book",
          ],
          explain: "The page is prepared first, then written, checked and finally bound into a book.",
        },
        {
          kind: "write",
          prompt: "Why did people in Europe need a faster way to make books? Use what you learned in the scriptorium.",
          starters: ["People needed a faster way because…", "Copying one large book could take…", "Each new copy could…"],
        },
      ],
    },
    es: {
      intro: "Demuestra lo que sabes sobre los libros en Europa antes de la imprenta.",
      items: [
        {
          kind: "choice",
          prompt: "¿Qué afirmación sobre los libros en Europa antes de 1450, más o menos, es verdadera?",
          options: [
            { text: "Los libros eran escasos y caros, y mucha gente no sabía leer" },
            { text: "Los libros eran baratos, así que casi todas las familias tenían varios" },
            { text: "Todo el mundo sabía leer, así que los copistas hacían un libro para cada casa" },
          ],
          answer: 0,
          explain: "Los libros copiados a mano tardaban meses en hacerse y usaban materiales costosos. La mayoría de la gente no sabía leer y pocas personas tenían libros.",
        },
        {
          kind: "choice",
          prompt: "En los años 1400, ¿qué estaba cambiando en el mundo de los libros?",
          options: [
            { text: "El papel se volvía común, y también había copistas profesionales en las ciudades" },
            { text: "Ya había imprentas funcionando en todas las ciudades" },
            { text: "Los monasterios habían dejado de copiar libros" },
          ],
          answer: 0,
          explain: "El papel costaba menos que el pergamino y más gente quería libros, pero cada copia todavía se escribía a mano.",
        },
        {
          kind: "order",
          prompt: "Ordena los pasos para hacer un manuscrito.",
          items: [
            "Hacer pergamino con piel de animal limpia y estirada",
            "Marcar líneas suaves en la página para escribir derecho",
            "Copiar el texto con pluma de ave y tinta",
            "Revisar la copia para buscar errores",
            "Coser las páginas para formar un libro",
          ],
          explain: "Primero se prepara la página; luego se escribe, se revisa y, al final, se encuaderna el libro.",
        },
        {
          kind: "write",
          prompt: "¿Por qué en Europa hacía falta una forma más rápida de hacer libros? Usa lo que aprendiste en el scriptorium.",
          starters: ["Hacía falta una forma más rápida porque…", "Copiar un libro grande podía tardar…", "Cada copia nueva podía…"],
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Use evidence to explain why books were scarce before printing in Europe.",
      items: [
        {
          kind: "choice",
          prompt: "Which statement about books in Europe before about 1450 is accurate?",
          options: [
            { text: "Books were scarce and costly, and most people could not read" },
            { text: "Books were cheap because monasteries produced them in large numbers" },
            { text: "Nearly everyone could read, so demand for books was already met" },
          ],
          answer: 0,
          explain: "Hand copying limited supply, parchment was expensive, and literacy was limited. Demand grew in the 1400s faster than scribes could meet it.",
        },
        {
          kind: "number",
          prompt: "Suppose a scribe needs 200 working days to copy one large book and works 300 days a year. How many copies could that scribe finish in 10 years?",
          answer: 15,
          explain: "300 × 10 = 3,000 working days, and 3,000 ÷ 200 = 15 copies in a decade, under these assumptions.",
        },
        {
          kind: "evidence",
          prompt: "Which claim does the evidence support best? Choose a claim, pick two pieces of evidence, and explain your reasoning.",
          claims: [
            "Before printing, books in Europe were rare and expensive because each copy took a great deal of time and costly materials.",
            "Before printing, books in Europe were cheap and common because many people were able to make them.",
          ],
          evidence: [
            { text: "Copying a large book such as a Bible could take one scribe many months, even a year or more.", supports: [0] },
            { text: "Parchment was made from animal skin, and one large book needed many skins.", supports: [0] },
            { text: "Monks, nuns and professional scribes in towns all copied books.", supports: [1] },
            { text: "By the 1400s, paper was becoming common in Europe.", supports: [1] },
            { text: "Each new hand-made copy could add new mistakes.", supports: [] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
    es: {
      intro: "Usa evidencia para explicar por qué los libros eran escasos en Europa antes de la imprenta.",
      items: [
        {
          kind: "choice",
          prompt: "¿Qué afirmación sobre los libros en Europa antes de 1450, más o menos, es correcta?",
          options: [
            { text: "Los libros eran escasos y costosos, y la mayoría de la gente no sabía leer" },
            { text: "Los libros eran baratos porque los monasterios los producían en grandes cantidades" },
            { text: "Casi todo el mundo sabía leer, así que ya había libros suficientes" },
          ],
          answer: 0,
          explain: "La copia a mano limitaba la cantidad de libros, el pergamino era caro y pocas personas sabían leer. En los años 1400, la demanda creció más rápido de lo que los copistas podían cubrir.",
        },
        {
          kind: "number",
          prompt: "Imagina que un copista necesita 200 días de trabajo para copiar un libro grande y trabaja 300 días al año. ¿Cuántas copias podría terminar en 10 años?",
          answer: 15,
          explain: "300 × 10 = 3,000 días de trabajo, y 3,000 ÷ 200 = 15 copias en una década, con estos supuestos.",
        },
        {
          kind: "evidence",
          prompt: "¿Qué afirmación apoya mejor la evidencia? Elige una afirmación, escoge dos pruebas y explica tu razonamiento.",
          claims: [
            "Antes de la imprenta, los libros en Europa eran escasos y caros porque cada copia requería mucho tiempo y materiales costosos.",
            "Antes de la imprenta, los libros en Europa eran baratos y comunes porque mucha gente podía hacerlos.",
          ],
          evidence: [
            { text: "Copiar un libro grande, como una Biblia, podía llevarle a un copista muchos meses, incluso un año o más.", supports: [0] },
            { text: "El pergamino se hacía con piel de animal, y un libro grande necesitaba muchas pieles.", supports: [0] },
            { text: "Monjes, monjas y copistas profesionales de las ciudades copiaban libros.", supports: [1] },
            { text: "En los años 1400, el papel se volvía común en Europa.", supports: [1] },
            { text: "Cada copia nueva hecha a mano podía agregar errores nuevos.", supports: [] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
  },
};

SCRIPTORIUM_CHAPTER.activities = {
  desk: { kind: "copy", title: { en: "Writing desk", es: "Escritorio" }, icon: "🪶", config: DESK },
  ledger: { kind: "quiz", title: { en: "Library ledger", es: "Registro de la biblioteca" }, icon: "📒", config: LEDGER },
};
SCRIPTORIUM_CHAPTER.journal = SCRIPTORIUM_JOURNAL;

// ---------------------------------------------------------------------------
// Glossary terms introduced in this chapter.
// ---------------------------------------------------------------------------

export const GLOSSARY_SCRIPTORIUM: GlossaryEntry[] = [
  {
    id: "scribe",
    emoji: "✍️",
    term: { en: "scribe", es: "copista" },
    aliases: { en: ["scribes"], es: ["copistas"] },
    simple: { en: "A person whose job is to copy writing by hand.", es: "Una persona cuyo trabajo es copiar textos a mano." },
    full: {
      en: "A person trained to write and copy texts by hand. Before printing, scribes made every copy of every book in Europe.",
      es: "Una persona preparada para escribir y copiar textos a mano. Antes de la imprenta, los copistas hacían cada copia de cada libro en Europa.",
    },
  },
  {
    id: "scriptorium",
    emoji: "🏛️",
    term: { en: "scriptorium", es: "scriptorium" },
    aliases: { en: ["scriptoria", "scriptoriums"], es: ["escritorio monástico"] },
    simple: { en: "A room in a monastery where books were copied.", es: "Un cuarto de un monasterio donde se copiaban libros." },
    full: {
      en: "A room in a monastery or convent set aside for writing and copying books by hand. The word comes from Latin and means \"a place for writing\".",
      es: "Un cuarto de un monasterio o convento dedicado a escribir y copiar libros a mano. La palabra viene del latín y significa «lugar para escribir».",
    },
  },
  {
    id: "manuscript",
    emoji: "📜",
    term: { en: "manuscript", es: "manuscrito" },
    aliases: { en: ["manuscripts"], es: ["manuscritos"] },
    simple: { en: "A book or paper written by hand.", es: "Un libro o papel escrito a mano." },
    full: {
      en: "A book or document written by hand rather than printed. The word comes from Latin words meaning \"written by hand\".",
      es: "Un libro o documento escrito a mano en lugar de impreso. La palabra viene del latín y significa «escrito a mano».",
    },
  },
  {
    id: "parchment",
    emoji: "🐑",
    term: { en: "parchment", es: "pergamino" },
    aliases: { en: ["parchments"], es: ["pergaminos"] },
    simple: { en: "Animal skin made thin and smooth for writing.", es: "Piel de animal fina y lisa para escribir." },
    full: {
      en: "A writing material made from animal skin, such as sheep, goat or calf, that has been soaked, stretched and scraped thin. It was costly but lasted a very long time.",
      es: "Un material para escribir hecho con piel de animal, como oveja, cabra o ternero, que se remoja, se estira y se raspa hasta quedar delgada. Era caro, pero duraba muchísimo tiempo.",
    },
  },
  {
    id: "vellum",
    emoji: "🐄",
    term: { en: "vellum", es: "vitela" },
    simple: { en: "Very fine parchment, usually from calfskin.", es: "Pergamino muy fino, casi siempre de piel de ternero." },
    full: {
      en: "The finest, smoothest kind of parchment, usually made from calfskin. People often use the words vellum and parchment for the same thing.",
      es: "La clase de pergamino más fina y lisa, por lo general hecha con piel de ternero. Muchas veces se usan las palabras vitela y pergamino para lo mismo.",
    },
  },
  {
    id: "quill",
    emoji: "🪶",
    term: { en: "quill", es: "pluma de ave" },
    aliases: { en: ["quills", "quill pen"], es: ["plumas de ave"] },
    simple: { en: "A pen made from a big bird feather.", es: "Una pluma para escribir hecha con la pluma de un ave grande." },
    full: {
      en: "A pen made from a large feather, often from a goose, with its tip cut to a point. The scribe dipped it in ink again and again while writing.",
      es: "Un instrumento para escribir hecho con una pluma grande, a menudo de ganso, con la punta cortada en forma afilada. El copista la mojaba en tinta una y otra vez mientras escribía.",
    },
  },
];
