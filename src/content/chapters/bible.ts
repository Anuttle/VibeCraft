import { Line } from "../../i18n/types";
import { Chapter } from "../../game/quest";
import type { PerBand, PerBandLang, QuizConfig, QuizItem } from "../../game/activities";
import type { PressConfig } from "../press";
import type { GlossaryEntry } from "../glossaryTypes";
import { BIBLE_WORLD } from "../../game/world";

// Chapter 6: The Bible and the Debt. Mainz, 1450-1455.
//
// Historical notes for reviewers:
// - High confidence: the Latin "42-line Bible" is named for the 42 lines per
//   column on most pages, two columns per page; it was completed by about
//   1455. It runs to well over a thousand pages (about 1,280).
// - Medium-high confidence (standard estimates, hedged with "about"): about
//   180 copies were printed, most on paper and some on vellum; the 3-5 ledger
//   uses the commonly cited split of about 135 paper and about 45 vellum.
//   About 49 copies survive, some incomplete.
// - High confidence: Johann Fust, a wealthy Mainz merchant, lent Gutenberg
//   800 guilders around 1450 (with the workshop's equipment as security) and
//   another 800 around 1452.
// - High confidence: in 1455 Fust sued for repayment with interest; the
//   Helmasperger Instrument (a notary's record, dated 6 November 1455)
//   survives. Fust's claim of about 2,026 guilders is the commonly cited
//   figure; the interest arithmetic in the ledger (426 = 2,026 - 1,600,
//   ≈ 27%) is derived from it. The record shows the two disagreed about how
//   the money was used and what was owed; the text stays at that level.
// - Medium-high confidence: the court ruled largely in Fust's favor; Fust took
//   over much of the equipment and the Bible business and printed with Peter
//   Schöffer (a former Gutenberg worker, later Fust's son-in-law). The Mainz
//   Psalter (1457) is usually called the first printed book to name its
//   printers and date (T4 only).
// - High confidence: in 1465 Archbishop Adolph II of Mainz gave Gutenberg a
//   court title with an allowance.
// - "Fust was an investor" and "Fust took a big risk" are interpretations,
//   presented alongside Gutenberg's role as inventor. The ownership question is
//   handled as an open question (write/evidence items), never scored.
// - Gutenberg's and Fust's lines are written for teaching; they are not quotations.

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };
const GUTENBERG_SPEAKER: Line = { en: "Johannes Gutenberg", es: "Johannes Gutenberg" };
const FUST_SPEAKER: Line = { en: "Johann Fust", es: "Johann Fust" };

// ---------------------------------------------------------------------------
// Printing a Bible page: more sheets and tighter zones for older bands.
// Pull windows: 3-5 = 32/50 = 0.64 s, 6-8 = 19/55 ≈ 0.35 s, 9-12 = 16/65 ≈ 0.25 s.
// ---------------------------------------------------------------------------

const BIBLE_PRESS: PerBand<PressConfig> = {
  "K-2": { sheets: 1, inkPerDab: 25, inkJitter: 0, inkZone: null, pullRate: 80, pullZone: null, showTimer: false },
  "3-5": { sheets: 3, inkPerDab: 15, inkJitter: 0, inkZone: [55, 88], pullRate: 50, pullZone: [58, 90], showTimer: false },
  "6-8": { sheets: 4, inkPerDab: 12, inkJitter: 3, inkZone: [62, 85], pullRate: 55, pullZone: [66, 85], showTimer: false },
  "9-12": { sheets: 5, inkPerDab: 12, inkJitter: 4, inkZone: [66, 82], pullRate: 65, pullZone: [70, 86], showTimer: true },
};

// "In principio creavit Deus caelum et terram": the opening of Genesis in the Latin Vulgate.
const BIBLE_LINES: PerBandLang<string[]> = {
  "K-2": {
    en: ["IN PRINCIPIO"],
    es: ["IN PRINCIPIO"],
  },
  "3-5": {
    en: ["IN PRINCIPIO", "In the beginning"],
    es: ["IN PRINCIPIO", "En el principio"],
  },
  "6-8": {
    en: ["GENESIS", "IN PRINCIPIO", "In the beginning"],
    es: ["GÉNESIS", "IN PRINCIPIO", "En el principio"],
  },
  "9-12": {
    en: ["IN PRINCIPIO CREAVIT", "DEUS CAELUM ET TERRAM", "In the beginning God", "created heaven and earth"],
    es: ["IN PRINCIPIO CREAVIT", "DEUS CAELUM ET TERRAM", "En el principio creó", "Dios el cielo y la tierra"],
  },
};

// ---------------------------------------------------------------------------
// The account book: the loans in guilders (documented amounts).
// ---------------------------------------------------------------------------

const LEDGER: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Let's look at the money for the Bible.",
      items: [
        {
          kind: "choice",
          prompt: "Who gave Gutenberg money for the Bible?",
          options: [
            { text: "Johann Fust", emoji: "💰" },
            { text: "A king", emoji: "👑" },
            { text: "A monk", emoji: "📿" },
          ],
          answer: 0,
          explain: "Johann Fust lent Gutenberg the money. Fust was a rich man in Mainz.",
        },
        {
          kind: "choice",
          prompt: "Fust gave money two times. Is that a little or a lot?",
          options: [
            { text: "A lot", emoji: "💰💰" },
            { text: "A little", emoji: "🪙" },
          ],
          answer: 0,
          explain: "It was a lot of money! A big Bible needs lots of paper, ink and workers.",
        },
        {
          kind: "choice",
          prompt: "Gutenberg borrowed money. What should he do later?",
          options: [
            { text: "Pay it back", emoji: "🔙" },
            { text: "Keep it all", emoji: "🙈" },
          ],
          answer: 0,
          explain: "When you borrow, you give it back. That was the promise.",
        },
      ],
    },
    es: {
      intro: "Veamos el dinero para la Biblia.",
      items: [
        {
          kind: "choice",
          prompt: "¿Quién le dio dinero a Gutenberg para la Biblia?",
          options: [
            { text: "Johann Fust", emoji: "💰" },
            { text: "Un rey", emoji: "👑" },
            { text: "Un monje", emoji: "📿" },
          ],
          answer: 0,
          explain: "Johann Fust le prestó el dinero a Gutenberg. Fust era un hombre rico de Maguncia.",
        },
        {
          kind: "choice",
          prompt: "Fust dio dinero dos veces. ¿Es poco o mucho?",
          options: [
            { text: "Mucho", emoji: "💰💰" },
            { text: "Poco", emoji: "🪙" },
          ],
          answer: 0,
          explain: "¡Era mucho dinero! Una Biblia grande necesita mucho papel, tinta y trabajadores.",
        },
        {
          kind: "choice",
          prompt: "Gutenberg pidió dinero prestado. ¿Qué debe hacer después?",
          options: [
            { text: "Devolverlo", emoji: "🔙" },
            { text: "Quedarse con todo", emoji: "🙈" },
          ],
          answer: 0,
          explain: "Cuando pides prestado, lo devuelves. Esa era la promesa.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Add up Fust's loans. A guilder was a gold coin used in Mainz.",
      items: [
        {
          kind: "number",
          prompt: "Fust lent Gutenberg 800 guilders around 1450 and 800 more around 1452. How many guilders in all?",
          answer: 1600,
          explain: "800 + 800 = 1,600 guilders. That was a huge amount of money at the time.",
        },
        {
          kind: "choice",
          prompt: "What did Gutenberg need the money for?",
          options: [
            { text: "Type, paper, ink and workers for the Bible" },
            { text: "A new house for his family" },
            { text: "A ship to sail to Cyprus" },
          ],
          answer: 0,
          explain: "A Bible with more than a thousand pages needed huge amounts of type, paper and ink, and many workers to print it.",
        },
        {
          kind: "number",
          prompt: "The workshop printed about 180 Bibles. About 45 were on vellum. About how many were on paper?",
          answer: 135,
          explain: "180 − 45 = 135. Most copies were on paper, because vellum was much more expensive.",
        },
      ],
    },
    es: {
      intro: "Suma los préstamos de Fust. Un florín era una moneda de oro que se usaba en Maguncia.",
      items: [
        {
          kind: "number",
          prompt: "Fust le prestó a Gutenberg 800 florines alrededor de 1450 y 800 más alrededor de 1452. ¿Cuántos florines en total?",
          answer: 1600,
          explain: "800 + 800 = 1600 florines. Era muchísimo dinero en esa época.",
        },
        {
          kind: "choice",
          prompt: "¿Para qué necesitaba Gutenberg el dinero?",
          options: [
            { text: "Para tipos, papel, tinta y trabajadores para la Biblia" },
            { text: "Para una casa nueva para su familia" },
            { text: "Para un barco para viajar a Chipre" },
          ],
          answer: 0,
          explain: "Una Biblia de más de mil páginas necesitaba enormes cantidades de tipos, papel y tinta, y muchos trabajadores para imprimirla.",
        },
        {
          kind: "number",
          prompt: "El taller imprimió unas 180 Biblias. Unas 45 eran de vitela. ¿Cuántas eran de papel, más o menos?",
          answer: 135,
          explain: "180 − 45 = 135. La mayoría eran de papel, porque la vitela costaba mucho más.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Check Fust's numbers. These amounts come from the court record of 1455.",
      items: [
        {
          kind: "number",
          prompt: "Fust lent 800 guilders around 1450 and another 800 around 1452. How much did he lend in total?",
          answer: 1600,
          explain: "800 + 800 = 1,600 guilders.",
        },
        {
          kind: "number",
          prompt: "In 1455, Fust asked for about 2,026 guilders. How much more than the loans was that?",
          answer: 426,
          explain: "2,026 − 1,600 = 426 guilders. This extra amount was mostly interest: the price of borrowing money over several years.",
        },
        {
          kind: "choice",
          prompt: "What does interest on a loan mean?",
          options: [
            { text: "Extra money the borrower pays for using someone else's money" },
            { text: "How curious the lender is about the project" },
            { text: "A gift the lender gives to the borrower" },
          ],
          answer: 0,
          explain: "Interest is the cost of borrowing. The longer you borrow and the more you borrow, the more interest usually adds up.",
        },
      ],
    },
    es: {
      intro: "Revisa las cuentas de Fust. Estas cantidades vienen del expediente del juicio de 1455.",
      items: [
        {
          kind: "number",
          prompt: "Fust prestó 800 florines alrededor de 1450 y otros 800 alrededor de 1452. ¿Cuánto prestó en total?",
          answer: 1600,
          explain: "800 + 800 = 1600 florines.",
        },
        {
          kind: "number",
          prompt: "En 1455, Fust pidió unos 2026 florines. ¿Cuánto más que los préstamos era eso?",
          answer: 426,
          explain: "2026 − 1600 = 426 florines. Esa cantidad extra era sobre todo interés: el precio de usar dinero prestado durante varios años.",
        },
        {
          kind: "choice",
          prompt: "¿Qué significa el interés de un préstamo?",
          options: [
            { text: "Dinero extra que se paga por usar el dinero de otra persona" },
            { text: "Cuánta curiosidad siente el prestamista por el proyecto" },
            { text: "Un regalo que el prestamista le da a quien recibe el préstamo" },
          ],
          answer: 0,
          explain: "El interés es el costo de pedir prestado. Mientras más tiempo y más dinero se pide, más interés suele acumularse.",
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Analyze the debt. The loan amounts and Fust's claim come from the 1455 court record (the claim is a commonly cited approximate total).",
      items: [
        {
          kind: "number",
          prompt: "Fust lent 800 guilders around 1450 and another 800 around 1452. What was the total principal?",
          answer: 1600,
          explain: "Principal = 800 + 800 = 1,600 guilders.",
        },
        {
          kind: "number",
          prompt: "Fust claimed about 2,026 guilders in 1455. How much of that was beyond the principal?",
          answer: 426,
          explain: "2,026 − 1,600 = 426 guilders, mostly interest.",
        },
        {
          kind: "number",
          prompt: "What percentage of the 1,600-guilder principal is 426 guilders? Round to the nearest whole percent.",
          answer: 27,
          explain: "426 ÷ 1,600 ≈ 0.266, or about 26.6%, which rounds to 27%. That built up over several years, not in one year.",
        },
        {
          kind: "choice",
          prompt: "The extra 27% built up over three to five years. Why is that different from 27% interest per year?",
          options: [
            { text: "Spread over several years, the yearly rate was much lower than 27%" },
            { text: "It isn't different; 27% is 27% no matter how long it takes" },
            { text: "The yearly rate must have been higher than 27%" },
          ],
          answer: 0,
          explain: "A total spread across several years means a smaller rate each year. The second loan was also borrowed for a shorter time than the first, so the rate can't simply be divided evenly.",
        },
        {
          kind: "write",
          prompt: "Was it fair for Fust to ask for interest on top of his 1,600 guilders? Explain using the numbers and what each man contributed.",
          starters: ["I think it was fair because…", "I think it was unfair because…", "The numbers show that…"],
        },
      ],
    },
    es: {
      intro: "Analiza la deuda. Los préstamos y lo que reclamó Fust vienen del expediente del juicio de 1455 (el total reclamado es una cifra aproximada que se cita con frecuencia).",
      items: [
        {
          kind: "number",
          prompt: "Fust prestó 800 florines alrededor de 1450 y otros 800 alrededor de 1452. ¿Cuál fue el capital total?",
          answer: 1600,
          explain: "Capital = 800 + 800 = 1600 florines.",
        },
        {
          kind: "number",
          prompt: "En 1455, Fust reclamó unos 2026 florines. ¿Cuánto de eso iba más allá del capital?",
          answer: 426,
          explain: "2026 − 1600 = 426 florines, sobre todo de interés.",
        },
        {
          kind: "number",
          prompt: "¿Qué porcentaje del capital de 1600 florines son 426 florines? Redondea al número entero más cercano.",
          answer: 27,
          explain: "426 ÷ 1600 ≈ 0.266, o alrededor de 26.6 %, que se redondea a 27 %. Eso se acumuló a lo largo de varios años, no en uno solo.",
        },
        {
          kind: "choice",
          prompt: "Ese 27 % extra se acumuló en tres a cinco años. ¿Por qué no es lo mismo que un interés de 27 % al año?",
          options: [
            { text: "Repartido en varios años, la tasa anual era mucho menor que 27 %" },
            { text: "Es lo mismo; 27 % es 27 % sin importar el tiempo" },
            { text: "La tasa anual tuvo que ser mayor que 27 %" },
          ],
          answer: 0,
          explain: "Un total repartido en varios años significa una tasa menor cada año. Además, el segundo préstamo duró menos tiempo que el primero, así que no basta con dividir en partes iguales.",
        },
        {
          kind: "write",
          prompt: "¿Fue justo que Fust pidiera interés además de sus 1600 florines? Explica con los números y con lo que aportó cada uno.",
          starters: ["Creo que fue justo porque…", "Creo que no fue justo porque…", "Los números muestran que…"],
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// The court record: fairness, promises, and who should own the business.
// ---------------------------------------------------------------------------

const OWNERSHIP_EN: QuizItem = {
  kind: "evidence",
  prompt: "Who should own the printing business?",
  claims: ["Fust should own it.", "Gutenberg should own it.", "They should share it."],
  evidence: [
    { text: "Fust lent about 1,600 guilders, a huge sum, to pay for the work.", supports: [0, 2] },
    { text: "The loan agreement used the workshop's equipment as security.", supports: [0] },
    { text: "Fust took a big risk: the Bible might never have been finished or sold.", supports: [0, 2] },
    { text: "Gutenberg invented the process of printing with metal movable type.", supports: [1, 2] },
    { text: "Gutenberg and his workers did the skilled work of printing the Bible.", supports: [1, 2] },
    { text: "Fust asked for about 426 guilders more than he had lent.", supports: [1] },
    { text: "Neither man could have made the Bible alone: one had the money, the other had the method.", supports: [2] },
  ],
  pick: 2,
  reasoning: false,
};

const OWNERSHIP_ES: QuizItem = {
  kind: "evidence",
  prompt: "¿Quién debería quedarse con el negocio de la imprenta?",
  claims: ["Fust debería quedárselo.", "Gutenberg debería quedárselo.", "Deberían compartirlo."],
  evidence: [
    { text: "Fust prestó unos 1600 florines, una suma enorme, para pagar el trabajo.", supports: [0, 2] },
    { text: "El acuerdo del préstamo usaba el equipo del taller como garantía.", supports: [0] },
    { text: "Fust corrió un gran riesgo: la Biblia podía no terminarse ni venderse nunca.", supports: [0, 2] },
    { text: "Gutenberg inventó el proceso de imprimir con tipos móviles de metal.", supports: [1, 2] },
    { text: "Gutenberg y sus trabajadores hicieron el trabajo especializado de imprimir la Biblia.", supports: [1, 2] },
    { text: "Fust pidió unos 426 florines más de lo que había prestado.", supports: [1] },
    { text: "Ninguno de los dos podía hacer la Biblia solo: uno tenía el dinero y el otro, el método.", supports: [2] },
  ],
  pick: 2,
  reasoning: false,
};

const COURT: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Let's think about promises and fairness.",
      items: [
        {
          kind: "choice",
          prompt: "When you borrow something, you should…",
          options: [
            { text: "Give it back", emoji: "🤝" },
            { text: "Keep it forever", emoji: "🙈" },
            { text: "Forget about it", emoji: "💭" },
          ],
          answer: 0,
          explain: "Borrowing is a promise. You give it back, just like you said.",
        },
        {
          kind: "choice",
          prompt: "Fust gave money. Gutenberg gave ideas and work. Who helped make the Bible?",
          options: [
            { text: "Only Fust", emoji: "💰" },
            { text: "Only Gutenberg", emoji: "💡" },
            { text: "Both of them", emoji: "🤝" },
          ],
          answer: 2,
          explain: "Both helped! The money paid for paper and ink. The ideas and work made the pages.",
        },
      ],
    },
    es: {
      intro: "Pensemos en las promesas y en lo que es justo.",
      items: [
        {
          kind: "choice",
          prompt: "Cuando pides algo prestado, debes…",
          options: [
            { text: "Devolverlo", emoji: "🤝" },
            { text: "Quedártelo para siempre", emoji: "🙈" },
            { text: "Olvidarlo", emoji: "💭" },
          ],
          answer: 0,
          explain: "Pedir prestado es una promesa. Lo devuelves, como dijiste.",
        },
        {
          kind: "choice",
          prompt: "Fust dio dinero. Gutenberg dio ideas y trabajo. ¿Quién ayudó a hacer la Biblia?",
          options: [
            { text: "Solo Fust", emoji: "💰" },
            { text: "Solo Gutenberg", emoji: "💡" },
            { text: "Los dos", emoji: "🤝" },
          ],
          answer: 2,
          explain: "¡Los dos ayudaron! El dinero pagó el papel y la tinta. Las ideas y el trabajo hicieron las páginas.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Read the court record and think about what is fair.",
      items: [
        {
          kind: "choice",
          prompt: "When you borrow money, what is the fair thing to do?",
          options: [
            { text: "Pay it back the way you agreed" },
            { text: "Pay it back only if the project is a success" },
            { text: "Keep it if you worked very hard" },
          ],
          answer: 0,
          explain: "A loan is a promise to pay back what you agreed, even if things go badly. That is why lenders often ask for something valuable as security.",
        },
        {
          kind: "choice",
          prompt: "Why did Fust lend Gutenberg so much money?",
          options: [
            { text: "He hoped to get it back with extra and share in the business" },
            { text: "The law forced him to give money to inventors" },
            { text: "He did not expect to get any of it back" },
          ],
          answer: 0,
          explain: "Fust was a merchant and an investor. He took a risk because he hoped the Bible would earn money.",
        },
        {
          kind: "choice",
          prompt: "Who helped make the 42-line Bible possible?",
          options: [
            { text: "Both Fust and Gutenberg" },
            { text: "Only Gutenberg, because he had the idea" },
            { text: "Only Fust, because he paid for it" },
          ],
          answer: 0,
          explain: "Gutenberg invented the process and led the work. Fust's money paid for type, paper, ink and workers. The Bible needed both.",
        },
        {
          kind: "write",
          prompt: "Who do you think should own the printing business: Fust, Gutenberg or both? Why?",
          starters: ["I think … should own it because…", "It would be fair if…"],
        },
      ],
    },
    es: {
      intro: "Lee el expediente del juicio y piensa en lo que es justo.",
      items: [
        {
          kind: "choice",
          prompt: "Cuando pides dinero prestado, ¿qué es lo justo?",
          options: [
            { text: "Devolverlo como se acordó" },
            { text: "Devolverlo solo si el proyecto sale bien" },
            { text: "Quedártelo si trabajaste mucho" },
          ],
          answer: 0,
          explain: "Un préstamo es una promesa de devolver lo acordado, aunque las cosas salgan mal. Por eso los prestamistas suelen pedir algo valioso como garantía.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué Fust le prestó tanto dinero a Gutenberg?",
          options: [
            { text: "Esperaba recuperarlo con algo extra y participar en el negocio" },
            { text: "La ley lo obligaba a darles dinero a los inventores" },
            { text: "No esperaba recuperar nada" },
          ],
          answer: 0,
          explain: "Fust era comerciante e inversionista. Corrió un riesgo porque esperaba que la Biblia dejara dinero.",
        },
        {
          kind: "choice",
          prompt: "¿Quién hizo posible la Biblia de 42 líneas?",
          options: [
            { text: "Fust y Gutenberg" },
            { text: "Solo Gutenberg, porque tuvo la idea" },
            { text: "Solo Fust, porque la pagó" },
          ],
          answer: 0,
          explain: "Gutenberg inventó el proceso y dirigió el trabajo. El dinero de Fust pagó tipos, papel, tinta y trabajadores. La Biblia necesitaba las dos cosas.",
        },
        {
          kind: "write",
          prompt: "¿Quién crees que debería quedarse con el negocio de la imprenta: Fust, Gutenberg o los dos? ¿Por qué?",
          starters: ["Creo que … debería quedárselo porque…", "Sería justo que…"],
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "You are reviewing the case. There is no single right answer to the main question, but your answer should rest on evidence.",
      items: [
        {
          kind: "choice",
          prompt: "The workshop's equipment was \"security\" for the loan. What does that mean?",
          options: [
            { text: "If the loan was not repaid, the lender could claim the equipment" },
            { text: "Guards were hired to protect the equipment" },
            { text: "The equipment could never be sold or moved" },
          ],
          answer: 0,
          explain: "Security (also called collateral) is something valuable a borrower promises to give up if the loan isn't repaid. That is how Fust could take over much of the equipment.",
        },
        OWNERSHIP_EN,
      ],
    },
    es: {
      intro: "Vas a revisar el caso. La pregunta principal no tiene una sola respuesta correcta, pero tu respuesta debe basarse en evidencia.",
      items: [
        {
          kind: "choice",
          prompt: "El equipo del taller era la \"garantía\" del préstamo. ¿Qué significa eso?",
          options: [
            { text: "Si no se pagaba el préstamo, el prestamista podía reclamar el equipo" },
            { text: "Se contrataron guardias para proteger el equipo" },
            { text: "El equipo nunca podía venderse ni moverse" },
          ],
          answer: 0,
          explain: "Una garantía es algo valioso que quien pide prestado promete entregar si no paga. Así fue como Fust pudo quedarse con gran parte del equipo.",
        },
        OWNERSHIP_ES,
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Review the case as a historian would. Who owns an invention: the inventor or the investor? There is no single right answer; build an argument from evidence.",
      items: [
        {
          kind: "choice",
          prompt: "Most of what we know about the lawsuit comes from the Helmasperger Instrument. What kind of source is it?",
          options: [
            { text: "A primary source: a notary's record written at the time of the case" },
            { text: "A secondary source: a history book written centuries later" },
            { text: "A legend passed down by word of mouth" },
          ],
          answer: 0,
          explain: "The notary's document dates from November 1455, so it is a primary source. It records only part of the case, so historians still interpret what it leaves out.",
        },
        { ...OWNERSHIP_EN, reasoning: true },
      ],
    },
    es: {
      intro: "Revisa el caso como lo haría un historiador. ¿De quién es un invento: de quien lo inventa o de quien lo financia? No hay una sola respuesta correcta; construye un argumento con evidencia.",
      items: [
        {
          kind: "choice",
          prompt: "Casi todo lo que sabemos de la demanda viene del Instrumento Helmasperger. ¿Qué tipo de fuente es?",
          options: [
            { text: "Una fuente primaria: un registro notarial escrito en la época del caso" },
            { text: "Una fuente secundaria: un libro de historia escrito siglos después" },
            { text: "Una leyenda contada de boca en boca" },
          ],
          answer: 0,
          explain: "El documento notarial es de noviembre de 1455, así que es una fuente primaria. Solo registra una parte del caso, por eso los historiadores todavía interpretan lo que no dice.",
        },
        { ...OWNERSHIP_ES, reasoning: true },
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
      intro: "What do you remember?",
      items: [
        {
          kind: "choice",
          prompt: "What big book did Gutenberg print?",
          options: [
            { text: "A Bible", emoji: "📖" },
            { text: "A map book", emoji: "🗺️" },
            { text: "A comic", emoji: "💬" },
          ],
          answer: 0,
          explain: "Gutenberg's workshop printed a big Bible. It has many, many pages.",
        },
        {
          kind: "choice",
          prompt: "Who lent Gutenberg money?",
          options: [
            { text: "Fust", emoji: "💰" },
            { text: "Chappe", emoji: "🧳" },
          ],
          answer: 0,
          explain: "Johann Fust lent the money. Chappe ordered forms in another story.",
        },
        {
          kind: "choice",
          prompt: "How many lines are in most columns of the Bible?",
          options: [
            { text: "42", emoji: "📏" },
            { text: "4", emoji: "✋" },
            { text: "100", emoji: "💯" },
          ],
          answer: 0,
          explain: "Most columns have 42 lines. That is why it is called the 42-line Bible.",
        },
      ],
    },
    es: {
      intro: "¿Qué recuerdas?",
      items: [
        {
          kind: "choice",
          prompt: "¿Qué libro grande imprimió Gutenberg?",
          options: [
            { text: "Una Biblia", emoji: "📖" },
            { text: "Un libro de mapas", emoji: "🗺️" },
            { text: "Una historieta", emoji: "💬" },
          ],
          answer: 0,
          explain: "El taller de Gutenberg imprimió una Biblia grande. Tiene muchísimas páginas.",
        },
        {
          kind: "choice",
          prompt: "¿Quién le prestó dinero a Gutenberg?",
          options: [
            { text: "Fust", emoji: "💰" },
            { text: "Chappe", emoji: "🧳" },
          ],
          answer: 0,
          explain: "Johann Fust le prestó el dinero. Chappe pidió formularios en otra historia.",
        },
        {
          kind: "choice",
          prompt: "¿Cuántas líneas tienen casi todas las columnas de la Biblia?",
          options: [
            { text: "42", emoji: "📏" },
            { text: "4", emoji: "✋" },
            { text: "100", emoji: "💯" },
          ],
          answer: 0,
          explain: "Casi todas las columnas tienen 42 líneas. Por eso se llama la Biblia de 42 líneas.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Check what you learned about the Bible and the loan.",
      items: [
        {
          kind: "choice",
          prompt: "Why is it called the 42-line Bible?",
          options: [
            { text: "Most columns on its pages have 42 lines" },
            { text: "It has exactly 42 pages" },
            { text: "42 workers printed it" },
          ],
          answer: 0,
          explain: "Most pages have two columns of 42 lines each. The whole book has more than a thousand pages.",
        },
        {
          kind: "choice",
          prompt: "Why did Gutenberg borrow money from Fust?",
          options: [
            { text: "The Bible needed lots of type, paper, ink and workers" },
            { text: "He wanted to buy the city of Mainz" },
            { text: "Fust asked him to print indulgence letters" },
          ],
          answer: 0,
          explain: "A huge book cost a huge amount before any copy could be sold, so Gutenberg needed a lender.",
        },
        {
          kind: "choice",
          prompt: "What happened in 1455?",
          options: [
            { text: "Fust took Gutenberg to court to get his money back" },
            { text: "Gutenberg and Fust started their partnership" },
            { text: "The first printing press was built" },
          ],
          answer: 0,
          explain: "In 1455, Fust sued Gutenberg. The loans had started around 1450, and Gutenberg had been printing for several years.",
        },
      ],
    },
    es: {
      intro: "Revisa lo que aprendiste sobre la Biblia y el préstamo.",
      items: [
        {
          kind: "choice",
          prompt: "¿Por qué se llama la Biblia de 42 líneas?",
          options: [
            { text: "Casi todas las columnas de sus páginas tienen 42 líneas" },
            { text: "Tiene exactamente 42 páginas" },
            { text: "La imprimieron 42 trabajadores" },
          ],
          answer: 0,
          explain: "Casi todas las páginas tienen dos columnas de 42 líneas. El libro completo tiene más de mil páginas.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué Gutenberg pidió dinero prestado a Fust?",
          options: [
            { text: "La Biblia necesitaba muchos tipos, papel, tinta y trabajadores" },
            { text: "Quería comprar la ciudad de Maguncia" },
            { text: "Fust le pidió imprimir cartas de indulgencia" },
          ],
          answer: 0,
          explain: "Un libro enorme costaba muchísimo antes de poder vender una sola copia, así que Gutenberg necesitaba un prestamista.",
        },
        {
          kind: "choice",
          prompt: "¿Qué pasó en 1455?",
          options: [
            { text: "Fust llevó a Gutenberg a juicio para recuperar su dinero" },
            { text: "Gutenberg y Fust empezaron a trabajar juntos" },
            { text: "Se construyó la primera prensa de imprenta" },
          ],
          answer: 0,
          explain: "En 1455, Fust demandó a Gutenberg. Los préstamos habían empezado alrededor de 1450, y Gutenberg llevaba varios años imprimiendo.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Show what you know about the Bible, the loan and the lawsuit.",
      items: [
        {
          kind: "choice",
          prompt: "What did Fust receive after the court decided largely in his favor?",
          options: [
            { text: "Much of the equipment and the Bible business" },
            { text: "Nothing; the court ruled completely for Gutenberg" },
            { text: "Gutenberg's title at the Archbishop's court" },
          ],
          answer: 0,
          explain: "Fust took over much of the equipment and kept printing with Peter Schöffer. The court title went to Gutenberg, from the Archbishop, in 1465.",
        },
        {
          kind: "choice",
          prompt: "About how many copies of the 42-line Bible survive today?",
          options: [
            { text: "About 49, some of them incomplete" },
            { text: "All of the roughly 180 copies" },
            { text: "Only one" },
          ],
          answer: 0,
          explain: "About 49 copies survive, out of about 180 printed. Many are kept in libraries and museums.",
        },
        {
          kind: "order",
          prompt: "Put these events in order.",
          items: [
            "Fust lends Gutenberg 800 guilders (around 1450).",
            "Fust lends another 800 guilders (around 1452).",
            "Fust sues Gutenberg, and a notary records the case (1455).",
            "The Archbishop of Mainz gives Gutenberg a court title (1465).",
          ],
          explain: "The two loans came first, then the lawsuit in 1455. Ten years later, the Archbishop honored Gutenberg.",
        },
        {
          kind: "write",
          prompt: "Who owns an invention: the inventor or the investor? Explain your thinking using Gutenberg and Fust.",
          starters: ["I think the inventor should own it because…", "I think the investor should own it because…", "I think they should share it because…"],
        },
      ],
    },
    es: {
      intro: "Demuestra lo que sabes sobre la Biblia, el préstamo y la demanda.",
      items: [
        {
          kind: "choice",
          prompt: "¿Qué recibió Fust cuando el tribunal le dio la razón en gran parte?",
          options: [
            { text: "Gran parte del equipo y el negocio de la Biblia" },
            { text: "Nada; el tribunal le dio toda la razón a Gutenberg" },
            { text: "El título de Gutenberg en la corte del arzobispo" },
          ],
          answer: 0,
          explain: "Fust se quedó con gran parte del equipo y siguió imprimiendo con Peter Schöffer. El título en la corte fue para Gutenberg, de parte del arzobispo, en 1465.",
        },
        {
          kind: "choice",
          prompt: "¿Cuántas copias de la Biblia de 42 líneas se conservan hoy, más o menos?",
          options: [
            { text: "Unas 49, algunas incompletas" },
            { text: "Todas las cerca de 180 copias" },
            { text: "Solo una" },
          ],
          answer: 0,
          explain: "Se conservan unas 49 copias de las cerca de 180 que se imprimieron. Muchas están en bibliotecas y museos.",
        },
        {
          kind: "order",
          prompt: "Pon estos sucesos en orden.",
          items: [
            "Fust le presta a Gutenberg 800 florines (alrededor de 1450).",
            "Fust le presta otros 800 florines (alrededor de 1452).",
            "Fust demanda a Gutenberg y un notario registra el caso (1455).",
            "El arzobispo de Maguncia le da a Gutenberg un título en su corte (1465).",
          ],
          explain: "Primero vinieron los dos préstamos y luego la demanda de 1455. Diez años después, el arzobispo honró a Gutenberg.",
        },
        {
          kind: "write",
          prompt: "¿De quién es un invento: de quien lo inventa o de quien lo financia? Explica tu idea con el caso de Gutenberg y Fust.",
          starters: ["Creo que debería ser de quien lo inventa porque…", "Creo que debería ser de quien lo financia porque…", "Creo que deberían compartirlo porque…"],
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Use evidence to explain why the 42-line Bible mattered.",
      items: [
        {
          kind: "number",
          prompt: "About 180 copies of the 42-line Bible were printed, and about 49 survive. About how many have been lost?",
          answer: 131,
          explain: "180 − 49 = 131. Most copies were lost over more than five centuries, which is why the survivors are so valuable.",
        },
        {
          kind: "evidence",
          prompt: "Why did the 42-line Bible matter?",
          claims: [
            "It proved that printed books could be as beautiful as the finest handwritten ones.",
            "It proved that printing could produce many copies of a very long book.",
          ],
          evidence: [
            { text: "Its pages have dark, even letters set in neat columns of 42 lines.", supports: [0] },
            { text: "Some copies were printed on vellum, the costly material used for fine manuscripts.", supports: [0] },
            { text: "Many copies were decorated by hand with colored letters and borders after printing.", supports: [0] },
            { text: "The workshop made about 180 copies in a few years.", supports: [1] },
            { text: "Each copy has well over a thousand pages.", supports: [1] },
            { text: "A single scribe could spend many months copying one Bible by hand.", supports: [1] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
    es: {
      intro: "Usa evidencia para explicar por qué importó la Biblia de 42 líneas.",
      items: [
        {
          kind: "number",
          prompt: "Se imprimieron unas 180 copias de la Biblia de 42 líneas y se conservan unas 49. ¿Cuántas se han perdido, más o menos?",
          answer: 131,
          explain: "180 − 49 = 131. La mayoría se perdió a lo largo de más de cinco siglos; por eso las que quedan son tan valiosas.",
        },
        {
          kind: "evidence",
          prompt: "¿Por qué importó la Biblia de 42 líneas?",
          claims: [
            "Demostró que un libro impreso podía ser tan hermoso como los mejores libros escritos a mano.",
            "Demostró que la imprenta podía producir muchas copias de un libro muy largo.",
          ],
          evidence: [
            { text: "Sus páginas tienen letras oscuras y parejas en columnas ordenadas de 42 líneas.", supports: [0] },
            { text: "Algunas copias se imprimieron en vitela, el material costoso de los manuscritos finos.", supports: [0] },
            { text: "Muchas copias se decoraron a mano con letras de colores y bordes después de imprimirse.", supports: [0] },
            { text: "El taller hizo unas 180 copias en pocos años.", supports: [1] },
            { text: "Cada copia tiene mucho más de mil páginas.", supports: [1] },
            { text: "Un solo copista podía tardar muchos meses en copiar una Biblia a mano.", supports: [1] },
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

export const BIBLE_CHAPTER: Chapter = {
  id: "bible-debt",
  world: BIBLE_WORLD,
  activities: {
    press: { kind: "press", title: { en: "Printing press", es: "La prensa" }, icon: "🖨️", config: BIBLE_PRESS, lines: BIBLE_LINES },
    ledger: { kind: "quiz", title: { en: "Account book", es: "Libro de cuentas" }, icon: "💰", config: LEDGER },
    court: { kind: "quiz", title: { en: "Court record", es: "Expediente del juicio" }, icon: "⚖️", config: COURT },
  },
  journal: JOURNAL_CHECK,
  steps: [
    {
      id: "intro",
      dialogue: [
        {
          id: "bible.intro",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "This is Mainz again. The year is about 1452. Gutenberg has a big plan. He wants to print a whole Bible.",
              T2: "Mainz, Germany, around 1452. Gutenberg's workshop is busy with its biggest job yet: printing a complete Bible in Latin.",
              T3: "Mainz, around 1452. Gutenberg's workshop has taken on an enormous project: a complete Latin Bible, printed with *movable type*. It will take years, many workers and a great deal of money.",
              T4: "Mainz, around 1452. Gutenberg's workshop is committed to its most ambitious undertaking: a complete Latin Bible, printed with *movable type* to a standard that could rival the finest handwritten books. The project will consume years of labor and vast quantities of metal, paper and *ink*.",
            },
            es: {
              T1: "Otra vez estás en Maguncia. Es el año 1452, más o menos. Gutenberg tiene un gran plan. Quiere imprimir una Biblia entera.",
              T2: "Maguncia, Alemania, alrededor de 1452. El taller de Gutenberg está ocupado con su trabajo más grande: imprimir una Biblia completa en latín.",
              T3: "Maguncia, alrededor de 1452. El taller de Gutenberg ha emprendido un proyecto enorme: una Biblia completa en latín, impresa con *tipos móviles*. Tomará años, muchos trabajadores y muchísimo dinero.",
              T4: "Maguncia, alrededor de 1452. El taller de Gutenberg está volcado en su empresa más ambiciosa: una Biblia completa en latín, impresa con *tipos móviles* con una calidad capaz de competir con los mejores libros escritos a mano. El proyecto consumirá años de trabajo y enormes cantidades de metal, papel y *tinta*.",
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
      id: "print",
      dialogue: [
        {
          id: "bible.project",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Look at this page! It has two columns. Most columns have 42 lines. The Bible has many pages. We need lots of *type* and paper.",
              T2: "Look at this page. It has two neat columns, and most columns have 42 lines. A whole Bible has more than a thousand pages, so we need piles of *type*, paper and *ink*, and many workers.",
              T3: "Look closely at this page. The text sits in two columns, and most columns hold 42 lines. A complete Bible fills more than a thousand pages, so this project needs huge amounts of *type*, paper and *ink*, and a team of skilled workers who must all be paid.",
              T4: "Examine this page: two columns of text, most of them exactly 42 lines long, set in a dense, even script. A complete Bible runs to well over a thousand pages, so the project demands enormous quantities of *type*, paper and *ink*, along with skilled workers whose wages must be paid long before a single copy is sold.",
            },
            es: {
              T1: "¡Mira esta página! Tiene dos columnas. Casi todas tienen 42 líneas. La Biblia tiene muchas páginas. Necesitamos muchos *tipos* y papel.",
              T2: "Mira esta página. Tiene dos columnas ordenadas, y casi todas tienen 42 líneas. Una Biblia entera tiene más de mil páginas, así que necesitamos montones de *tipos*, papel y *tinta*, y muchos trabajadores.",
              T3: "Mira con atención esta página. El texto va en dos columnas, y casi todas tienen 42 líneas. Una Biblia completa ocupa más de mil páginas, así que este proyecto necesita enormes cantidades de *tipos*, papel y *tinta*, y un equipo de trabajadores expertos a quienes hay que pagar.",
              T4: "Examina esta página: dos columnas de texto, casi todas de exactamente 42 líneas, con una letra densa y pareja. Una Biblia completa supera con creces las mil páginas, así que el proyecto exige cantidades enormes de *tipos*, papel y *tinta*, además de trabajadores expertos cuyos salarios hay que pagar mucho antes de vender una sola copia.",
            },
          },
        },
        {
          id: "bible.name",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Today we call it the *42-line Bible*. About 180 copies were made. Some were on soft calfskin. It is called *vellum*.",
              T2: "Today this book is known as the *42-line Bible*. The workshop printed about 180 copies. Most were on paper, and some were on *vellum*, made from calfskin.",
              T3: "Today this book is called the *42-line Bible*, or the Gutenberg Bible. The workshop printed about 180 copies: most on paper, and some on *vellum*, a smooth material made from calfskin. The work was finished by about 1455.",
              T4: "Historians call this book the *42-line Bible*, or simply the Gutenberg Bible. The workshop produced about 180 copies, most on paper and the rest on *vellum*, a costly writing surface made from calfskin, and completed the work by about 1455.",
            },
            es: {
              T1: "Hoy la llamamos la *Biblia de 42 líneas*. Se hicieron unas 180 copias. Algunas eran de piel de becerro. Se llama *vitela*.",
              T2: "Hoy este libro se conoce como la *Biblia de 42 líneas*. El taller imprimió unas 180 copias. Casi todas eran de papel, y algunas de *vitela*, hecha de piel de becerro.",
              T3: "Hoy este libro se llama la *Biblia de 42 líneas*, o Biblia de Gutenberg. El taller imprimió unas 180 copias: la mayoría en papel y algunas en *vitela*, un material liso hecho de piel de becerro. El trabajo se terminó alrededor de 1455.",
              T4: "Los historiadores llaman a este libro la *Biblia de 42 líneas*, o simplemente la Biblia de Gutenberg. El taller produjo unas 180 copias, la mayoría en papel y el resto en *vitela*, una costosa superficie de escritura hecha de piel de becerro, y terminó la obra alrededor de 1455.",
            },
          },
        },
        {
          id: "bible.pressGo",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "Now print a page. Ink the type. Pull the bar. Make it neat!",
              T2: "Now help me print a Bible page. Ink the *type* evenly and pull the bar firmly. This book must be beautiful.",
              T3: "Now print a page of the Bible. Ink the *type* evenly and pull the bar firmly. This book has to be as beautiful as any handwritten one, so every sheet counts.",
              T4: "Now take the bar and print a page. Ink the *type* evenly and pull with steady pressure: this Bible must stand comparison with the finest manuscripts, and every spoiled sheet is paper and money wasted.",
            },
            es: {
              T1: "Ahora imprime una página. Pon tinta en los tipos. Jala la barra. ¡Que quede bonita!",
              T2: "Ahora ayúdame a imprimir una página de la Biblia. Pon tinta pareja en los *tipos* y jala la barra con fuerza. Este libro tiene que ser hermoso.",
              T3: "Ahora imprime una página de la Biblia. Pon tinta pareja en los *tipos* y jala la barra con fuerza. Este libro debe ser tan hermoso como uno escrito a mano, así que cada hoja cuenta.",
              T4: "Ahora toma la barra e imprime una página. Entinta los *tipos* de manera pareja y jala con presión constante: esta Biblia debe compararse con los mejores manuscritos, y cada hoja echada a perder es papel y dinero desperdiciados.",
            },
          },
        },
      ],
      objective: { type: "station", station: "press" },
      objectiveText: {
        goal: {
          en: { T1: "Print a Bible page.", T3: "Print a page of the Bible at the press." },
          es: { T1: "Imprime una página de la Biblia.", T3: "Imprime una página de la Biblia en la prensa." },
        },
        hintTouch: { en: "Walk to the press and tap ✋.", es: "Camina a la prensa y toca ✋." },
        hintMouse: { en: "Walk to the press and press F.", es: "Camina a la prensa y presiona F." },
      },
    },
    {
      id: "cost",
      dialogue: [
        {
          id: "bible.cost",
          speaker: GUTENBERG_SPEAKER,
          text: {
            en: {
              T1: "A fine page! But paper costs money. Workers cost money. I did not have enough. Johann Fust lent me money. Go talk to him.",
              T2: "A fine page! But all this paper, metal and work costs a lot of money. I did not have enough, so I borrowed from Johann Fust. Go and speak with him.",
              T3: "A fine page. But paper, metal, *ink* and wages cost far more than my workshop earns. To pay for it all, I took a *loan* from Johann Fust, a wealthy merchant of Mainz. Go and speak with him.",
              T4: "A fine page. Yet paper, metal, *ink* and wages cost far more than this workshop can earn while the Bible is unfinished. To keep the work going, I accepted a *loan* from Johann Fust, a wealthy Mainz merchant. Go and speak with him; he keeps a careful account of every *guilder*.",
            },
            es: {
              T1: "¡Qué buena página! Pero el papel cuesta dinero. Los trabajadores también. Yo no tenía suficiente. Johann Fust me prestó dinero. Ve a hablar con él.",
              T2: "¡Qué buena página! Pero todo este papel, el metal y el trabajo cuestan mucho dinero. No me alcanzaba, así que le pedí prestado a Johann Fust. Ve a hablar con él.",
              T3: "Una buena página. Pero el papel, el metal, la *tinta* y los salarios cuestan mucho más de lo que gana mi taller. Para pagarlo todo, recibí un *préstamo* de Johann Fust, un rico comerciante de Maguncia. Ve a hablar con él.",
              T4: "Una buena página. Sin embargo, el papel, el metal, la *tinta* y los salarios cuestan mucho más de lo que este taller puede ganar mientras la Biblia no esté terminada. Para que el trabajo siga, acepté un *préstamo* de Johann Fust, un rico comerciante de Maguncia. Ve a hablar con él; lleva la cuenta de cada *florín*.",
            },
          },
        },
      ],
      objective: { type: "talk", npcId: "fust" },
      objectiveText: {
        goal: {
          en: { T1: "Talk to Fust.", T3: "Talk to Johann Fust." },
          es: { T1: "Habla con Fust.", T3: "Habla con Johann Fust." },
        },
        hintTouch: { en: "Walk to him and tap 💬.", es: "Camina hacia él y toca 💬." },
        hintMouse: { en: "Walk to him and press F.", es: "Camina hacia él y presiona F." },
      },
    },
    {
      id: "loan",
      dialogue: [
        {
          id: "bible.loan",
          speaker: FUST_SPEAKER,
          text: {
            en: {
              T1: "I am Johann Fust. I gave Gutenberg 800 *guilders*. Later, I gave him 800 more. That is a lot of money!",
              T2: "I am Johann Fust. Around 1450, I lent Gutenberg 800 gold coins called *guilders*. About two years later, I lent him 800 more. If he could not pay, I could take his tools.",
              T3: "I am Johann Fust, a merchant of Mainz. Around 1450, I gave Gutenberg a *loan* of 800 *guilders*, and around 1452, another 800. The workshop's tools were the security: if the money was not repaid, the equipment could become mine.",
              T4: "I am Johann Fust, merchant of Mainz and, you might say, the *investor* behind this Bible. Around 1450, I lent Gutenberg 800 *guilders*, with the workshop's equipment pledged as security, and around 1452, a further 800. I took a considerable risk: if the Bible failed, I might never see that money again.",
            },
            es: {
              T1: "Soy Johann Fust. Le di a Gutenberg 800 *florines*. Después le di 800 más. ¡Es mucho dinero!",
              T2: "Soy Johann Fust. Alrededor de 1450, le presté a Gutenberg 800 monedas de oro llamadas *florines*. Unos dos años después, le presté 800 más. Si no podía pagar, yo podía quedarme con sus herramientas.",
              T3: "Soy Johann Fust, comerciante de Maguncia. Alrededor de 1450, le di a Gutenberg un *préstamo* de 800 *florines*, y alrededor de 1452, otros 800. Las herramientas del taller eran la garantía: si no me devolvía el dinero, el equipo podía pasar a ser mío.",
              T4: "Soy Johann Fust, comerciante de Maguncia y, por así decirlo, el *inversionista* detrás de esta Biblia. Alrededor de 1450, le presté a Gutenberg 800 *florines*, con el equipo del taller como garantía, y alrededor de 1452, otros 800. Corrí un riesgo considerable: si la Biblia fracasaba, quizá nunca volvería a ver ese dinero.",
            },
          },
        },
        {
          id: "bible.loanGo",
          speaker: FUST_SPEAKER,
          text: {
            en: {
              T1: "Come see my account book. Let us add it up.",
              T2: "Come to the account book. Let's add up what Gutenberg owes me.",
              T3: "Come to the account book, and let us add up what was lent, and what is owed with *interest*.",
              T4: "Come to the account book. Let us add up what was lent, and what is owed once *interest* is counted. Numbers, unlike promises, are easy to check.",
            },
            es: {
              T1: "Ven a ver mi libro de cuentas. Vamos a sumar.",
              T2: "Ven al libro de cuentas. Vamos a sumar lo que Gutenberg me debe.",
              T3: "Ven al libro de cuentas y sumemos lo que presté y lo que se debe con *interés*.",
              T4: "Ven al libro de cuentas. Sumemos lo que presté y lo que se debe una vez que se cuenta el *interés*. Los números, a diferencia de las promesas, son fáciles de comprobar.",
            },
          },
        },
      ],
      objective: { type: "station", station: "ledger" },
      objectiveText: {
        goal: {
          en: { T1: "Use the account book.", T3: "Add up the loans in the account book." },
          es: { T1: "Usa el libro de cuentas.", T3: "Suma los préstamos en el libro de cuentas." },
        },
        hintTouch: { en: "Walk to the account book and tap ✋.", es: "Camina al libro de cuentas y toca ✋." },
        hintMouse: { en: "Walk to the account book and press F.", es: "Camina al libro de cuentas y presiona F." },
      },
    },
    {
      id: "lawsuit",
      dialogue: [
        {
          id: "bible.lawsuit",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Now it is 1455. Fust wants his money back. Gutenberg cannot pay it all. So Fust goes to court.",
              T2: "In 1455, Fust wanted his money back, plus extra. Gutenberg could not pay it all. So Fust brought a *lawsuit* against him in court.",
              T3: "In 1455, Fust brought a *lawsuit* against Gutenberg to get back his money, plus *interest*. He claimed about 2,026 guilders in all. A *notary* wrote down part of the case in November 1455, and that record still exists. It is called the Helmasperger Instrument.",
              T4: "In 1455, Fust brought a *lawsuit* against Gutenberg, demanding repayment of his loans with *interest*: about 2,026 guilders in total. The two men disagreed about how the money had been used and how much was truly owed. A *notary*'s record of the case, written in November 1455 and known as the Helmasperger Instrument, survives and is one of our best sources on Gutenberg's life.",
            },
            es: {
              T1: "Ya es 1455. Fust quiere su dinero. Gutenberg no puede pagarlo todo. Entonces Fust va a juicio.",
              T2: "En 1455, Fust quería recuperar su dinero, y algo más. Gutenberg no podía pagarlo todo. Así que Fust le puso una *demanda* ante un tribunal.",
              T3: "En 1455, Fust le puso una *demanda* a Gutenberg para recuperar su dinero, más el *interés*. Reclamó unos 2026 florines en total. Un *notario* escribió parte del caso en noviembre de 1455, y ese documento todavía existe. Se llama el Instrumento Helmasperger.",
              T4: "En 1455, Fust le puso una *demanda* a Gutenberg para exigir que le devolviera los préstamos con *interés*: unos 2026 florines en total. Los dos no estaban de acuerdo sobre cómo se había usado el dinero ni sobre cuánto se debía en realidad. El registro de un *notario*, escrito en noviembre de 1455 y conocido como el Instrumento Helmasperger, se conserva y es una de nuestras mejores fuentes sobre la vida de Gutenberg.",
            },
          },
        },
        {
          id: "bible.courtGo",
          speaker: FUST_SPEAKER,
          text: {
            en: {
              T1: "I kept my promise. I gave the money. Now you look at the facts. What is fair?",
              T2: "I kept my side of the deal. Now go to the court record. Look at the facts, and decide what you think is fair.",
              T3: "I lent the money in good faith and took the risk. Gutenberg will tell you the invention was his. Go to the court record, weigh the facts on both sides, and decide what is fair.",
              T4: "I lent that money in good faith and carried the risk; Gutenberg will say, with reason, that the invention and the skill were his. Go to the court record and weigh the evidence. Should an invention belong to the inventor who created it, or to the *investor* who paid for it?",
            },
            es: {
              T1: "Yo cumplí mi promesa. Di el dinero. Ahora mira tú los datos. ¿Qué es justo?",
              T2: "Yo cumplí mi parte del trato. Ahora ve al expediente del juicio. Mira los datos y decide qué te parece justo.",
              T3: "Presté el dinero de buena fe y corrí el riesgo. Gutenberg te dirá que el invento era suyo. Ve al expediente del juicio, compara los datos de los dos lados y decide qué es justo.",
              T4: "Presté ese dinero de buena fe y cargué con el riesgo; Gutenberg dirá, con razón, que el invento y la destreza eran suyos. Ve al expediente del juicio y analiza la evidencia. ¿Un invento debería pertenecer a quien lo creó o al *inversionista* que lo pagó?",
            },
          },
        },
      ],
      objective: { type: "station", station: "court" },
      objectiveText: {
        goal: {
          en: { T1: "Read the court record.", T3: "Weigh the evidence in the court record." },
          es: { T1: "Lee el expediente del juicio.", T3: "Analiza la evidencia del expediente del juicio." },
        },
        hintTouch: { en: "Walk to the court record and tap ✋.", es: "Camina al expediente del juicio y toca ✋." },
        hintMouse: { en: "Walk to the court record and press F.", es: "Camina al expediente del juicio y presiona F." },
      },
    },
    {
      id: "done",
      dialogue: [
        {
          id: "bible.verdict",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "The court mostly agreed with Fust. Fust got many of the tools. He kept printing with Peter Schöffer.",
              T2: "The court decided mostly in Fust's favor. Fust took much of the equipment. He kept printing with Peter Schöffer, who had worked for Gutenberg.",
              T3: "The court decided largely in Fust's favor. Fust took over much of the equipment and the Bible business. He kept printing with Peter Schöffer, Gutenberg's former worker, who later married Fust's daughter.",
              T4: "The court ruled largely in Fust's favor, and Fust took over much of the equipment along with the Bible business. He continued printing in partnership with Peter Schöffer, a skilled former member of Gutenberg's workshop who later married Fust's daughter. In 1457, the two produced the Mainz Psalter, usually called the first printed book to name its printers and its date.",
            },
            es: {
              T1: "El tribunal le dio la razón a Fust, casi en todo. Fust se quedó con muchas herramientas. Siguió imprimiendo con Peter Schöffer.",
              T2: "El tribunal decidió casi todo a favor de Fust. Fust se quedó con gran parte del equipo. Siguió imprimiendo con Peter Schöffer, que había trabajado con Gutenberg.",
              T3: "El tribunal decidió en gran parte a favor de Fust. Fust se quedó con gran parte del equipo y con el negocio de la Biblia. Siguió imprimiendo con Peter Schöffer, antiguo trabajador de Gutenberg, que después se casó con la hija de Fust.",
              T4: "El tribunal falló en gran parte a favor de Fust, quien se quedó con gran parte del equipo y con el negocio de la Biblia. Siguió imprimiendo en sociedad con Peter Schöffer, un hábil antiguo miembro del taller de Gutenberg que más tarde se casó con la hija de Fust. En 1457, ambos produjeron el Salterio de Maguncia, considerado por lo general el primer libro impreso que nombra a sus impresores y su fecha.",
            },
          },
        },
        {
          id: "bible.done",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Gutenberg kept printing in a small way. In 1465, the Archbishop of Mainz honored him. About 49 of his Bibles still exist. They are beautiful!",
              T2: "Gutenberg kept working on a smaller scale. In 1465, the Archbishop of Mainz gave him a title at his court and an allowance. About 49 copies of the Bible survive today, and people still admire their beauty.",
              T3: "Gutenberg kept working on a smaller scale, and in 1465 the Archbishop of Mainz gave him a court title with an allowance. About 49 copies of the 42-line Bible survive, some incomplete. Fust risked his money, and Gutenberg created the process: the Bible needed both.",
              T4: "Gutenberg continued to work on a smaller scale, and in 1465 the Archbishop of Mainz granted him a position at court with an allowance. About 49 copies of the *42-line Bible* survive, some of them incomplete, and they remain among the most treasured books in the world. The story leaves an open question: Fust's money and Gutenberg's invention were both essential, so who deserves the credit, and who should own the result?",
            },
            es: {
              T1: "Gutenberg siguió imprimiendo, pero en pequeño. En 1465, el arzobispo de Maguncia lo honró. Todavía existen unas 49 de sus Biblias. ¡Son hermosas!",
              T2: "Gutenberg siguió trabajando en menor escala. En 1465, el arzobispo de Maguncia le dio un título en su corte y una pensión. Hoy se conservan unas 49 copias de la Biblia, y la gente todavía admira su belleza.",
              T3: "Gutenberg siguió trabajando en menor escala, y en 1465 el arzobispo de Maguncia le dio un título en su corte con una pensión. Se conservan unas 49 copias de la Biblia de 42 líneas, algunas incompletas. Fust arriesgó su dinero y Gutenberg creó el proceso: la Biblia necesitó a los dos.",
              T4: "Gutenberg continuó trabajando en menor escala, y en 1465 el arzobispo de Maguncia le concedió un puesto en su corte con una pensión. Se conservan unas 49 copias de la *Biblia de 42 líneas*, algunas incompletas, y siguen entre los libros más valiosos del mundo. La historia deja una pregunta abierta: el dinero de Fust y el invento de Gutenberg fueron esenciales, así que ¿quién merece el crédito y a quién debería pertenecer el resultado?",
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
          en: { T1: "Fill in your journal.", T3: "Answer the questions in your journal." },
          es: { T1: "Completa tu diario.", T3: "Responde las preguntas de tu diario." },
        },
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Glossary.
// ---------------------------------------------------------------------------

export const GLOSSARY_BIBLE: GlossaryEntry[] = [
  {
    id: "42-line-bible",
    emoji: "📖",
    term: { en: "42-line Bible", es: "Biblia de 42 líneas" },
    aliases: { en: ["Gutenberg Bible"], es: ["Biblia de Gutenberg"] },
    simple: {
      en: "The big Latin Bible printed in Gutenberg's workshop.",
      es: "La gran Biblia en latín impresa en el taller de Gutenberg.",
    },
    full: {
      en: "The Latin Bible printed in Mainz and finished by about 1455, named for the 42 lines in most of its columns. About 180 copies were printed and about 49 survive.",
      es: "La Biblia en latín impresa en Maguncia y terminada alrededor de 1455, llamada así por las 42 líneas de casi todas sus columnas. Se imprimieron unas 180 copias y se conservan unas 49.",
    },
  },
  {
    id: "vellum",
    emoji: "🐄",
    term: { en: "vellum", es: "vitela" },
    simple: {
      en: "Thin, smooth calfskin used to write or print on.",
      es: "Piel de becerro delgada y lisa para escribir o imprimir.",
    },
    full: {
      en: "A fine writing material made from calfskin, long used for precious manuscripts. It was much more expensive than paper, so only some copies of the 42-line Bible were printed on it.",
      es: "Un material fino para escribir hecho de piel de becerro, usado desde hacía mucho para manuscritos valiosos. Costaba mucho más que el papel, así que solo algunas copias de la Biblia de 42 líneas se imprimieron en ella.",
    },
  },
  {
    id: "loan",
    emoji: "🤝",
    term: { en: "loan", es: "préstamo" },
    aliases: { en: ["loans", "lent", "lend"], es: ["préstamos", "prestó", "prestar"] },
    simple: {
      en: "Money you borrow and must pay back.",
      es: "Dinero que pides y debes devolver.",
    },
    full: {
      en: "Money given on the promise that it will be repaid, often with interest. Gutenberg's loans from Fust were backed by the workshop's equipment as security.",
      es: "Dinero que se entrega con la promesa de devolverlo, a menudo con interés. Los préstamos de Fust a Gutenberg tenían como garantía el equipo del taller.",
    },
  },
  {
    id: "interest",
    emoji: "➕",
    term: { en: "interest", es: "interés" },
    aliases: { es: ["intereses"] },
    simple: {
      en: "Extra money paid back for borrowing money.",
      es: "Dinero extra que se paga por pedir prestado.",
    },
    full: {
      en: "The price of borrowing money, usually a percentage of the amount borrowed for each year. Fust's claim in 1455 included interest on top of the 1,600 guilders he had lent.",
      es: "El precio de pedir dinero prestado, casi siempre un porcentaje de lo prestado por cada año. Lo que Fust reclamó en 1455 incluía interés además de los 1600 florines que había prestado.",
    },
  },
  {
    id: "investor",
    emoji: "💼",
    term: { en: "investor", es: "inversionista" },
    aliases: { en: ["investors"], es: ["inversionistas"] },
    simple: {
      en: "A person who puts money into a project, hoping to earn more.",
      es: "Una persona que pone dinero en un proyecto para ganar más.",
    },
    full: {
      en: "Someone who provides money for a business or project and takes the risk of losing it, in hope of a return. Fust's loans made him the main investor in Gutenberg's Bible.",
      es: "Alguien que aporta dinero a un negocio o proyecto y corre el riesgo de perderlo, con la esperanza de ganar. Los préstamos de Fust lo convirtieron en el principal inversionista de la Biblia de Gutenberg.",
    },
  },
  {
    id: "lawsuit",
    emoji: "⚖️",
    term: { en: "lawsuit", es: "demanda" },
    aliases: { en: ["lawsuits", "sued"], es: ["demandas", "demandó"] },
    simple: {
      en: "When one person takes another to court to settle a problem.",
      es: "Cuando una persona lleva a otra a juicio para resolver un problema.",
    },
    full: {
      en: "A case brought before a court by one party against another. In 1455, Fust's lawsuit against Gutenberg asked for the loans to be repaid with interest.",
      es: "Un caso que una parte presenta ante un tribunal contra otra. En 1455, la demanda de Fust contra Gutenberg pedía que le devolviera los préstamos con interés.",
    },
  },
  {
    id: "guilder",
    emoji: "🪙",
    term: { en: "guilder", es: "florín" },
    aliases: { en: ["guilders"], es: ["florines"] },
    simple: {
      en: "A gold coin used in Germany long ago.",
      es: "Una moneda de oro que se usaba en Alemania hace mucho.",
    },
    full: {
      en: "A gold coin (in German, Gulden) widely used in the Rhine region in the 1400s. Fust lent Gutenberg 1,600 guilders in two loans, a very large sum at the time.",
      es: "Una moneda de oro (en alemán, Gulden) muy usada en la región del Rin en el siglo XV. Fust le prestó a Gutenberg 1600 florines en dos préstamos, una suma enorme para la época.",
    },
  },
  {
    id: "notary",
    emoji: "🖋️",
    term: { en: "notary", es: "notario" },
    aliases: { en: ["notaries"], es: ["notarios"] },
    simple: {
      en: "An official who writes down and signs important records.",
      es: "Un funcionario que escribe y firma documentos importantes.",
    },
    full: {
      en: "An official trusted to write and witness legal documents. The notary Ulrich Helmasperger recorded part of Fust's case against Gutenberg in November 1455.",
      es: "Un funcionario de confianza que redacta y certifica documentos legales. El notario Ulrich Helmasperger registró parte del caso de Fust contra Gutenberg en noviembre de 1455.",
    },
  },
];
