import { Line } from "../../i18n/types";
import { Chapter } from "../../game/quest";
import type { PerBand, PerBandLang, QuizConfig } from "../../game/activities";
import type { PressConfig } from "../press";
import type { GlossaryEntry } from "../glossaryTypes";
import { INDULGENCE_WORLD } from "../../game/world";

// Chapter 5: The Indulgences. Mainz, 1454-1455.
//
// Historical notes for reviewers:
// - High confidence: printed letters of indulgence from Mainz dated 1454 and
//   1455 survive and are among the earliest dated printed items.
// - High confidence: Pope Nicholas V granted the indulgence (1451) to those who
//   gave money to help defend Cyprus against the Ottoman Empire; Paulinus
//   Chappe, envoy (procurator) of King John II of Cyprus, oversaw its
//   distribution in Germany.
// - High confidence: the letters were one-page forms with blanks for the
//   buyer's name and the date, filled in by hand.
// - Uncertain: how many were printed. The text says "hundreds or thousands"
//   and "historians estimate". Who printed them (Gutenberg's workshop, or
//   associates/other printers in Mainz) is debated, so the text only says
//   "printers in Mainz".
// - Indulgence definition follows Catholic teaching (remission of temporal
//   punishment for sins already forgiven, obtained through prayer, good works
//   or a charitable donation), stated neutrally.
// - High confidence: disputes over the selling of indulgences were one cause
//   of the Protestant Reformation (1517); covered in Chapter 7.
// - All amounts in the ledger are invented game coins, not historical prices.
// - Chappe's lines are written for teaching; they are not quotations.

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };
const CHAPPE_SPEAKER: Line = { en: "Paulinus Chappe", es: "Paulinus Chappe" };

// ---------------------------------------------------------------------------
// Printing the forms: more sheets and tighter zones for older bands.
// Pull windows: 3-5 = 35/55 ≈ 0.64 s, 6-8 = 20/60 ≈ 0.33 s, 9-12 = 17/70 ≈ 0.24 s.
// ---------------------------------------------------------------------------

const FORM_PRESS: PerBand<PressConfig> = {
  "K-2": { sheets: 1, inkPerDab: 25, inkJitter: 0, inkZone: null, pullRate: 80, pullZone: null, showTimer: false },
  "3-5": { sheets: 3, inkPerDab: 15, inkJitter: 0, inkZone: [50, 90], pullRate: 55, pullZone: [55, 90], showTimer: false },
  "6-8": { sheets: 4, inkPerDab: 12, inkJitter: 3, inkZone: [60, 85], pullRate: 60, pullZone: [65, 85], showTimer: false },
  "9-12": { sheets: 5, inkPerDab: 12, inkJitter: 4, inkZone: [65, 82], pullRate: 70, pullZone: [68, 85], showTimer: true },
};

const FORM_LINES: PerBandLang<string[]> = {
  "K-2": {
    en: ["NAME: ____"],
    es: ["NOMBRE: ____"],
  },
  "3-5": {
    en: ["LETTER OF INDULGENCE", "Name: ________"],
    es: ["CARTA DE INDULGENCIA", "Nombre: ________"],
  },
  "6-8": {
    en: ["LETTER OF INDULGENCE", "for the defense of Cyprus", "Name: ________"],
    es: ["CARTA DE INDULGENCIA", "para la defensa de Chipre", "Nombre: ________"],
  },
  "9-12": {
    en: ["LETTER OF INDULGENCE", "for the defense of Cyprus", "Name: ________", "Date: ________"],
    es: ["CARTA DE INDULGENCIA", "para la defensa de Chipre", "Nombre: ________", "Fecha: ________"],
  },
};

// ---------------------------------------------------------------------------
// The account book: business math with game coins.
// ---------------------------------------------------------------------------

const LEDGER: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Let's count! These are game coins, not real coins from long ago.",
      items: [
        {
          kind: "choice",
          prompt: "Chappe pays 🪙🪙🪙. How many coins is that?",
          options: [
            { text: "2", emoji: "🪙🪙" },
            { text: "3", emoji: "🪙🪙🪙" },
            { text: "4", emoji: "🪙🪙🪙🪙" },
          ],
          answer: 1,
          explain: "Count them: one, two, three. Chappe pays 3 coins.",
        },
        {
          kind: "choice",
          prompt: "Each form earns 1 coin. We print 2 forms. How many coins?",
          options: [
            { text: "1 coin", emoji: "🪙" },
            { text: "2 coins", emoji: "🪙🪙" },
          ],
          answer: 1,
          explain: "One form, one coin. Two forms, two coins!",
        },
        {
          kind: "choice",
          prompt: "We print more forms. Do we get more coins or fewer coins?",
          options: [
            { text: "More coins", emoji: "💰" },
            { text: "Fewer coins", emoji: "🪙" },
          ],
          answer: 0,
          explain: "More forms to sell means more coins for the print shop.",
        },
      ],
    },
    es: {
      intro: "¡A contar! Son monedas del juego, no monedas reales de hace mucho tiempo.",
      items: [
        {
          kind: "choice",
          prompt: "Chappe paga 🪙🪙🪙. ¿Cuántas monedas son?",
          options: [
            { text: "2", emoji: "🪙🪙" },
            { text: "3", emoji: "🪙🪙🪙" },
            { text: "4", emoji: "🪙🪙🪙🪙" },
          ],
          answer: 1,
          explain: "Cuenta: una, dos, tres. Chappe paga 3 monedas.",
        },
        {
          kind: "choice",
          prompt: "Cada formulario da 1 moneda. Imprimimos 2. ¿Cuántas monedas hay?",
          options: [
            { text: "1 moneda", emoji: "🪙" },
            { text: "2 monedas", emoji: "🪙🪙" },
          ],
          answer: 1,
          explain: "Un formulario, una moneda. ¡Dos formularios, dos monedas!",
        },
        {
          kind: "choice",
          prompt: "Imprimimos más formularios. ¿Recibimos más monedas o menos monedas?",
          options: [
            { text: "Más monedas", emoji: "💰" },
            { text: "Menos monedas", emoji: "🪙" },
          ],
          answer: 0,
          explain: "Más formularios para vender son más monedas para el taller.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Fill in the account book. All prices are game coins, not real prices from 1454.",
      items: [
        {
          kind: "number",
          prompt: "Chappe pays 2 game coins for each form. We print 10 forms. How many coins do we earn?",
          answer: 20,
          explain: "10 forms × 2 coins = 20 coins.",
        },
        {
          kind: "number",
          prompt: "On Monday we earn 15 coins. On Tuesday we earn 25 coins. How many coins in all?",
          answer: 40,
          explain: "15 + 25 = 40 coins.",
        },
        {
          kind: "number",
          prompt: "Chappe orders 100 forms at 3 game coins each. How many coins will he pay?",
          answer: 300,
          explain: "100 × 3 = 300 coins. Big orders bring in a lot of money, which is why printers wanted them.",
        },
      ],
    },
    es: {
      intro: "Completa el libro de cuentas. Todos los precios son monedas del juego, no precios reales de 1454.",
      items: [
        {
          kind: "number",
          prompt: "Chappe paga 2 monedas del juego por cada formulario. Imprimimos 10. ¿Cuántas monedas ganamos?",
          answer: 20,
          explain: "10 formularios × 2 monedas = 20 monedas.",
        },
        {
          kind: "number",
          prompt: "El lunes ganamos 15 monedas. El martes ganamos 25. ¿Cuántas monedas hay en total?",
          answer: 40,
          explain: "15 + 25 = 40 monedas.",
        },
        {
          kind: "number",
          prompt: "Chappe pide 100 formularios a 3 monedas del juego cada uno. ¿Cuántas monedas pagará?",
          answer: 300,
          explain: "100 × 3 = 300 monedas. Los pedidos grandes dejan mucho dinero; por eso los impresores los querían.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Work out the profit on Chappe's order. All amounts are game coins, not historical prices.",
      items: [
        {
          kind: "number",
          prompt: "Chappe pays 3 game coins per form and orders 200 forms. What is the shop's income?",
          answer: 600,
          explain: "Income = 200 forms × 3 coins = 600 coins.",
        },
        {
          kind: "number",
          prompt: "Paper for the job costs 150 coins and ink costs 50 coins. Income is 600 coins. What is the profit?",
          answer: 400,
          explain: "Profit = income − costs = 600 − (150 + 50) = 400 coins.",
        },
        {
          kind: "choice",
          prompt: "Which change would raise the shop's profit on this job?",
          options: [
            { text: "Spoil fewer sheets, so less paper is wasted" },
            { text: "Print extra forms that nobody has ordered" },
            { text: "Buy more ink than the job needs" },
          ],
          answer: 0,
          explain: "Profit goes up when costs go down. Wasted paper is a cost with no income; extra forms and extra ink cost money but bring nothing in.",
        },
      ],
    },
    es: {
      intro: "Calcula la ganancia del pedido de Chappe. Todas las cantidades son monedas del juego, no precios históricos.",
      items: [
        {
          kind: "number",
          prompt: "Chappe paga 3 monedas del juego por formulario y pide 200. ¿Cuánto ingresa el taller?",
          answer: 600,
          explain: "Ingreso = 200 formularios × 3 monedas = 600 monedas.",
        },
        {
          kind: "number",
          prompt: "El papel cuesta 150 monedas y la tinta, 50. El ingreso es de 600 monedas. ¿Cuál es la ganancia?",
          answer: 400,
          explain: "Ganancia = ingreso − costos = 600 − (150 + 50) = 400 monedas.",
        },
        {
          kind: "choice",
          prompt: "¿Qué cambio aumentaría la ganancia del taller en este trabajo?",
          options: [
            { text: "Echar a perder menos hojas, para desperdiciar menos papel" },
            { text: "Imprimir formularios extra que nadie pidió" },
            { text: "Comprar más tinta de la que hace falta" },
          ],
          answer: 0,
          explain: "La ganancia sube cuando bajan los costos. El papel desperdiciado cuesta y no deja ingreso; los formularios y la tinta de más cuestan dinero y no dejan nada.",
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Analyze the job like a print-shop owner. All amounts are game coins, not historical prices. Setting the type costs 200 coins once; each printed copy then costs 1 coin in paper and ink.",
      items: [
        {
          kind: "number",
          prompt: "What is the total cost of printing 200 copies?",
          answer: 400,
          explain: "Fixed cost + variable cost = 200 + (200 × 1) = 400 coins.",
        },
        {
          kind: "number",
          prompt: "What is the cost per copy when you print 200 copies?",
          answer: 2,
          explain: "400 coins ÷ 200 copies = 2 coins per copy.",
        },
        {
          kind: "choice",
          prompt: "If the shop prints 1,000 copies instead, what happens to the cost per copy?",
          options: [
            { text: "It goes down, because the setup cost is spread over more copies" },
            { text: "It stays at 2 coins, because each copy uses the same paper" },
            { text: "It goes up, because the shop uses more paper" },
          ],
          answer: 0,
          explain: "Total cost = 200 + 1,000 = 1,200 coins, so each copy costs 1.2 coins. The one-time cost of setting type is shared by more copies. This is why long print runs made printing cheaper per page.",
        },
        {
          kind: "number",
          prompt: "Chappe pays 3 coins per copy. How many copies must the shop sell to break even (income equals total cost)?",
          answer: 100,
          explain: "Each copy brings in 3 coins and costs 1, leaving 2 coins toward the 200-coin setup. 200 ÷ 2 = 100 copies. Every copy after that is profit.",
        },
        {
          kind: "write",
          prompt: "Why would a printer want regular customers like Chappe, and not only one-time jobs?",
          starters: ["A printer would want regular customers because…", "Steady orders help a print shop…", "Without regular customers, a printer might…"],
        },
      ],
    },
    es: {
      intro: "Analiza el trabajo como lo haría quien dirige el taller. Todas las cantidades son monedas del juego, no precios históricos. Componer los tipos cuesta 200 monedas una sola vez; después, cada copia cuesta 1 moneda en papel y tinta.",
      items: [
        {
          kind: "number",
          prompt: "¿Cuál es el costo total de imprimir 200 copias?",
          answer: 400,
          explain: "Costo fijo + costo variable = 200 + (200 × 1) = 400 monedas.",
        },
        {
          kind: "number",
          prompt: "¿Cuál es el costo por copia si imprimes 200 copias?",
          answer: 2,
          explain: "400 monedas ÷ 200 copias = 2 monedas por copia.",
        },
        {
          kind: "choice",
          prompt: "Si el taller imprime 1000 copias, ¿qué pasa con el costo por copia?",
          options: [
            { text: "Baja, porque el costo de preparación se reparte entre más copias" },
            { text: "Sigue en 2 monedas, porque cada copia usa el mismo papel" },
            { text: "Sube, porque el taller usa más papel" },
          ],
          answer: 0,
          explain: "Costo total = 200 + 1000 = 1200 monedas, así que cada copia cuesta 1.2 monedas. El costo único de componer los tipos se reparte entre más copias. Por eso los tirajes largos abarataban cada página.",
        },
        {
          kind: "number",
          prompt: "Chappe paga 3 monedas por copia. ¿Cuántas copias debe vender el taller para alcanzar el punto de equilibrio (ingreso igual al costo total)?",
          answer: 100,
          explain: "Cada copia deja 3 monedas y cuesta 1, así que quedan 2 monedas para cubrir las 200 de preparación. 200 ÷ 2 = 100 copias. Cada copia después de esa es ganancia.",
        },
        {
          kind: "write",
          prompt: "¿Por qué un impresor querría clientes fijos como Chappe, y no solo trabajos de una vez?",
          starters: ["Un impresor querría clientes fijos porque…", "Los pedidos constantes ayudan a un taller a…", "Sin clientes fijos, un impresor podría…"],
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
      intro: "What do you remember?",
      items: [
        {
          kind: "choice",
          prompt: "What did the printers make for Chappe?",
          options: [
            { text: "Forms", emoji: "📄" },
            { text: "Maps", emoji: "🗺️" },
            { text: "Toys", emoji: "🧸" },
          ],
          answer: 0,
          explain: "They printed many forms. Each form was one page with a blank for a name.",
        },
        {
          kind: "choice",
          prompt: "Why use the press, not a pen?",
          options: [
            { text: "The press is faster", emoji: "⚡" },
            { text: "A pen is faster", emoji: "🖊️" },
          ],
          answer: 0,
          explain: "The press makes many pages fast. Writing each one by hand is slow.",
        },
        {
          kind: "choice",
          prompt: "What was written on the form by hand?",
          options: [
            { text: "A name", emoji: "✍️" },
            { text: "A picture", emoji: "🖼️" },
            { text: "Nothing", emoji: "⬜" },
          ],
          answer: 0,
          explain: "The words were printed. The person's name was written in by hand.",
        },
      ],
    },
    es: {
      intro: "¿Qué recuerdas?",
      items: [
        {
          kind: "choice",
          prompt: "¿Qué hicieron los impresores para Chappe?",
          options: [
            { text: "Formularios", emoji: "📄" },
            { text: "Mapas", emoji: "🗺️" },
            { text: "Juguetes", emoji: "🧸" },
          ],
          answer: 0,
          explain: "Imprimieron muchos formularios. Cada uno era una hoja con un espacio para un nombre.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué usar la prensa y no una pluma?",
          options: [
            { text: "La prensa es más rápida", emoji: "⚡" },
            { text: "La pluma es más rápida", emoji: "🖊️" },
          ],
          answer: 0,
          explain: "La prensa hace muchas hojas rápido. Escribir cada una a mano es lento.",
        },
        {
          kind: "choice",
          prompt: "¿Qué se escribía a mano en el formulario?",
          options: [
            { text: "Un nombre", emoji: "✍️" },
            { text: "Un dibujo", emoji: "🖼️" },
            { text: "Nada", emoji: "⬜" },
          ],
          answer: 0,
          explain: "Las palabras estaban impresas. El nombre de la persona se escribía a mano.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Check what you learned about the indulgence letters.",
      items: [
        {
          kind: "choice",
          prompt: "What were the blank spaces on each indulgence letter for?",
          options: [
            { text: "The buyer's name and the date, written by hand" },
            { text: "A picture the printer drew later" },
            { text: "Nothing; they were mistakes in printing" },
          ],
          answer: 0,
          explain: "The letters were forms. The printed text was the same on every copy, and each buyer's name and the date were filled in by hand.",
        },
        {
          kind: "choice",
          prompt: "Why was the money from these indulgences being collected?",
          options: [
            { text: "To help defend Cyprus against the Ottoman Empire" },
            { text: "To build Gutenberg's workshop" },
            { text: "To pay for a new road in Mainz" },
          ],
          answer: 0,
          explain: "Pope Nicholas V granted this indulgence to raise money to help defend the island of Cyprus. Chappe worked for the King of Cyprus.",
        },
        {
          kind: "choice",
          prompt: "Why was a big order of forms good for a print shop?",
          options: [
            { text: "It brought in money to pay for paper, ink and workers" },
            { text: "It let the shop stop printing books forever" },
            { text: "Forms were the only thing a press could print" },
          ],
          answer: 0,
          explain: "Printing was a business. A paying customer like Chappe helped the shop cover its costs. Presses could print books too, but books took much longer.",
        },
      ],
    },
    es: {
      intro: "Revisa lo que aprendiste sobre las cartas de indulgencia.",
      items: [
        {
          kind: "choice",
          prompt: "¿Para qué eran los espacios en blanco de cada carta de indulgencia?",
          options: [
            { text: "Para el nombre de la persona y la fecha, escritos a mano" },
            { text: "Para un dibujo que el impresor hacía después" },
            { text: "Para nada; eran errores de impresión" },
          ],
          answer: 0,
          explain: "Las cartas eran formularios. El texto impreso era igual en todas las copias, y el nombre y la fecha se escribían a mano.",
        },
        {
          kind: "choice",
          prompt: "¿Para qué se juntaba el dinero de estas indulgencias?",
          options: [
            { text: "Para ayudar a defender Chipre del Imperio otomano" },
            { text: "Para construir el taller de Gutenberg" },
            { text: "Para pagar un camino nuevo en Maguncia" },
          ],
          answer: 0,
          explain: "El papa Nicolás V concedió esta indulgencia para reunir dinero y ayudar a defender la isla de Chipre. Chappe trabajaba para el rey de Chipre.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué un pedido grande de formularios era bueno para un taller?",
          options: [
            { text: "Dejaba dinero para pagar papel, tinta y trabajadores" },
            { text: "Permitía al taller dejar de imprimir libros para siempre" },
            { text: "Los formularios eran lo único que una prensa podía imprimir" },
          ],
          answer: 0,
          explain: "La imprenta era un negocio. Un cliente que pagaba, como Chappe, ayudaba a cubrir los costos. Las prensas también imprimían libros, pero tardaban mucho más.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Show what you know about printing as a business.",
      items: [
        {
          kind: "choice",
          prompt: "In the Catholic Church, what was an indulgence?",
          options: [
            { text: "A grant that removed some of the punishment owed for sins already forgiven, given for prayer, good works or a donation" },
            { text: "A tax that every person in Germany had to pay to the king" },
            { text: "A printed book of prayers sold in shops" },
          ],
          answer: 0,
          explain: "An indulgence was a grant from the Church. The printed letter was the buyer's proof of it. It was not a royal tax, and it was a single sheet, not a book.",
        },
        {
          kind: "choice",
          prompt: "Why were indulgence letters such a good job for early printers?",
          options: [
            { text: "Many identical copies were needed quickly, and only a few details changed" },
            { text: "Each letter had to be different, which only a press could do" },
            { text: "Scribes were not allowed to write Church documents" },
          ],
          answer: 0,
          explain: "A press is best at making many identical copies. The forms were the same except for names and dates, which were written in by hand. Scribes could and did copy Church documents, just much more slowly.",
        },
        {
          kind: "order",
          prompt: "Put these events in order.",
          items: [
            "Pope Nicholas V grants an indulgence to help defend Cyprus.",
            "Paulinus Chappe needs many letters for Germany.",
            "Printers in Mainz print hundreds or thousands of forms.",
            "A clerk writes a buyer's name and the date into a form.",
          ],
          explain: "The indulgence came first, then the need for letters, then printing, and last the hand-filled details for each buyer.",
        },
        {
          kind: "write",
          prompt: "Printing was a business from the start. Explain what a print shop needed in order to keep working.",
          starters: ["A print shop needed…", "Customers were important because…", "Without money for paper and ink…"],
        },
      ],
    },
    es: {
      intro: "Demuestra lo que sabes sobre la imprenta como negocio.",
      items: [
        {
          kind: "choice",
          prompt: "En la Iglesia católica, ¿qué era una indulgencia?",
          options: [
            { text: "Una concesión que quitaba parte del castigo por pecados ya perdonados, a cambio de oración, buenas obras o un donativo" },
            { text: "Un impuesto que toda persona en Alemania pagaba al rey" },
            { text: "Un libro de oraciones impreso que se vendía en tiendas" },
          ],
          answer: 0,
          explain: "Una indulgencia era una concesión de la Iglesia. La carta impresa era la prueba para quien la recibía. No era un impuesto del rey, y era una sola hoja, no un libro.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué las cartas de indulgencia eran un buen trabajo para los primeros impresores?",
          options: [
            { text: "Se necesitaban muchas copias idénticas y rápido, y solo cambiaban unos pocos datos" },
            { text: "Cada carta tenía que ser distinta, y solo una prensa podía hacerlo" },
            { text: "Los copistas no podían escribir documentos de la Iglesia" },
          ],
          answer: 0,
          explain: "Una prensa sirve sobre todo para hacer muchas copias idénticas. Los formularios eran iguales salvo el nombre y la fecha, que se escribían a mano. Los copistas sí copiaban documentos de la Iglesia, pero mucho más despacio.",
        },
        {
          kind: "order",
          prompt: "Pon estos sucesos en orden.",
          items: [
            "El papa Nicolás V concede una indulgencia para ayudar a defender Chipre.",
            "Paulinus Chappe necesita muchas cartas para Alemania.",
            "Impresores de Maguncia imprimen cientos o miles de formularios.",
            "Un escribano anota a mano el nombre y la fecha en un formulario.",
          ],
          explain: "Primero vino la indulgencia, luego la necesidad de cartas, después la impresión y al final los datos escritos a mano para cada persona.",
        },
        {
          kind: "write",
          prompt: "La imprenta fue un negocio desde el principio. Explica qué necesitaba un taller para seguir trabajando.",
          starters: ["Un taller de imprenta necesitaba…", "Los clientes eran importantes porque…", "Sin dinero para papel y tinta…"],
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Use evidence to explain the role of small jobs in early printing.",
      items: [
        {
          kind: "choice",
          prompt: "Why are the Mainz indulgence letters of 1454 and 1455 so important to historians of printing?",
          options: [
            { text: "They are among the earliest printed items that carry a date" },
            { text: "They prove Gutenberg personally printed every one of them" },
            { text: "They were the first things ever printed anywhere in the world" },
          ],
          answer: 0,
          explain: "Printed dates let historians anchor the timeline of early European printing. Who printed them is still debated, and printing had existed in East Asia for centuries.",
        },
        {
          kind: "evidence",
          prompt: "What kept early printing going as a business?",
          claims: [
            "Small paid jobs, like indulgence forms, were essential to early print shops.",
            "Large, valuable books were what made printing succeed.",
          ],
          evidence: [
            { text: "Forms could be printed quickly and paid for soon, bringing in steady money.", supports: [0] },
            { text: "Printers in Mainz printed hundreds or thousands of indulgence letters in 1454 and 1455.", supports: [0] },
            { text: "A big book took years to finish, and the printer had to pay for paper, ink and workers long before selling it.", supports: [0] },
            { text: "A printed Bible was worth far more than a single one-page form.", supports: [1] },
            { text: "A beautiful printed book showed buyers that printing could equal fine handwritten books.", supports: [1] },
            { text: "Long books spread knowledge and made printers famous across Europe.", supports: [1] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
    es: {
      intro: "Usa evidencia para explicar el papel de los trabajos pequeños en la imprenta temprana.",
      items: [
        {
          kind: "choice",
          prompt: "¿Por qué las cartas de indulgencia de Maguncia de 1454 y 1455 son tan importantes para la historia de la imprenta?",
          options: [
            { text: "Están entre los primeros impresos que llevan una fecha" },
            { text: "Prueban que Gutenberg imprimió cada una en persona" },
            { text: "Fueron lo primero que se imprimió en todo el mundo" },
          ],
          answer: 0,
          explain: "Las fechas impresas permiten a los historiadores ordenar la cronología de la imprenta europea. Quién las imprimió todavía se discute, y en Asia oriental ya se imprimía desde hacía siglos.",
        },
        {
          kind: "evidence",
          prompt: "¿Qué mantuvo a la imprenta temprana funcionando como negocio?",
          claims: [
            "Los trabajos pequeños y pagados, como los formularios de indulgencia, fueron esenciales para los primeros talleres.",
            "Los libros grandes y valiosos fueron lo que hizo triunfar a la imprenta.",
          ],
          evidence: [
            { text: "Los formularios se imprimían rápido y se pagaban pronto, lo que daba dinero constante.", supports: [0] },
            { text: "Impresores de Maguncia imprimieron cientos o miles de cartas de indulgencia en 1454 y 1455.", supports: [0] },
            { text: "Un libro grande tardaba años, y el impresor pagaba papel, tinta y trabajadores mucho antes de venderlo.", supports: [0] },
            { text: "Una Biblia impresa valía mucho más que un formulario de una sola hoja.", supports: [1] },
            { text: "Un libro impreso hermoso mostraba que la imprenta podía igualar a los mejores libros escritos a mano.", supports: [1] },
            { text: "Los libros largos difundían el conocimiento y hacían famosos a los impresores en toda Europa.", supports: [1] },
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

export const INDULGENCES_CHAPTER: Chapter = {
  id: "indulgences",
  world: INDULGENCE_WORLD,
  activities: {
    press: { kind: "press", title: { en: "Printing press", es: "La prensa" }, icon: "🖨️", config: FORM_PRESS, lines: FORM_LINES },
    ledger: { kind: "quiz", title: { en: "Account book", es: "Libro de cuentas" }, icon: "🪙", config: LEDGER },
  },
  journal: JOURNAL_CHECK,
  steps: [
    {
      id: "intro",
      dialogue: [
        {
          id: "indulgences.intro",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "This is Mainz, in Germany. The year is 1454. Printing is new. Printers need paying work.",
              T2: "Mainz, Germany, in the year 1454. Printing is still new, and printers must find paying jobs to keep their shops open.",
              T3: "Mainz, Germany, 1454. Printing is only a few years old, but it is already a business. Printers have to pay for metal, paper, *ink* and workers, so they need *customers* who will pay for their work.",
              T4: "Mainz, 1454. Printing with *movable type* is barely a few years old, yet from the start it is a business as much as an invention. Metal, paper, *ink* and skilled labor all cost money, so a print shop survives only if it finds *customers* willing to pay.",
            },
            es: {
              T1: "Esta es Maguncia, en Alemania. Es el año 1454. La imprenta es nueva. Los impresores necesitan trabajos pagados.",
              T2: "Maguncia, Alemania, en el año 1454. La imprenta todavía es nueva, y los impresores deben buscar trabajos pagados para mantener abiertos sus talleres.",
              T3: "Maguncia, Alemania, 1454. La imprenta tiene apenas unos años, pero ya es un negocio. Los impresores pagan el metal, el papel, la *tinta* y a sus trabajadores, así que necesitan *clientes* que paguen por su trabajo.",
              T4: "Maguncia, 1454. La impresión con *tipos móviles* tiene apenas unos años y, desde el principio, es tanto un negocio como un invento. El metal, el papel, la *tinta* y el trabajo especializado cuestan dinero, de modo que un taller solo sobrevive si encuentra *clientes* dispuestos a pagar.",
            },
          },
        },
      ],
    },
    {
      id: "meet",
      objective: { type: "talk", npcId: "chappe" },
      objectiveText: {
        goal: {
          en: { T1: "Talk to Chappe.", T3: "Talk to Paulinus Chappe." },
          es: { T1: "Habla con Chappe.", T3: "Habla con Paulinus Chappe." },
        },
        hintTouch: { en: "Walk to him and tap 💬.", es: "Camina hacia él y toca 💬." },
        hintMouse: { en: "Walk to him and press F.", es: "Camina hacia él y presiona F." },
      },
    },
    {
      id: "order",
      dialogue: [
        {
          id: "indulgences.order",
          speaker: CHAPPE_SPEAKER,
          text: {
            en: {
              T1: "Hello! I am Paulinus Chappe. I work for the King of Cyprus. I need many letters. Can you print them?",
              T2: "Good day! I am Paulinus Chappe, an *envoy* sent by the King of Cyprus. I need many copies of one letter, and I need them fast.",
              T3: "Good day, apprentice. I am Paulinus Chappe, an *envoy* of the King of Cyprus. The island of Cyprus is in danger from the armies of the Ottoman Empire, and the Church is helping to raise money for its defense. I need hundreds of copies of one letter, quickly.",
              T4: "Good day, apprentice. I am Paulinus Chappe, *envoy* of the King of Cyprus. Our island kingdom is threatened by the Ottoman Empire, and Pope Nicholas V has granted an *indulgence* to raise money for its defense. I oversee its distribution here in Germany, and for that I need a great many identical letters, far more than scribes could copy in time.",
            },
            es: {
              T1: "¡Hola! Soy Paulinus Chappe. Trabajo para el rey de Chipre. Necesito muchas cartas. ¿Puedes imprimirlas?",
              T2: "¡Buenos días! Soy Paulinus Chappe, *enviado* del rey de Chipre. Necesito muchas copias de una carta, y las necesito pronto.",
              T3: "Buenos días, aprendiz. Soy Paulinus Chappe, *enviado* del rey de Chipre. La isla de Chipre está en peligro por los ejércitos del Imperio otomano, y la Iglesia ayuda a reunir dinero para defenderla. Necesito cientos de copias de una carta, y rápido.",
              T4: "Buenos días, aprendiz. Soy Paulinus Chappe, *enviado* del rey de Chipre. Nuestro reino isleño está amenazado por el Imperio otomano, y el papa Nicolás V ha concedido una *indulgencia* para reunir fondos para su defensa. Yo superviso su distribución aquí en Alemania, y para eso necesito muchísimas cartas idénticas, muchas más de las que los copistas podrían terminar a tiempo.",
            },
          },
        },
        {
          id: "indulgences.what",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Chappe needs *indulgence* letters. People gave money to help Cyprus. The Church gave each one a letter. Catholics believed it took away some punishment for sins.",
              T2: "An *indulgence* letter was a paper from the Catholic Church. People who gave money or did good works could receive one. Catholics believed it took away some of the punishment for sins.",
              T3: "In the Catholic Church, an *indulgence* was a grant that removed some of the punishment owed for sins that had already been forgiven. It was given in return for prayers, good works or a *donation*. Here, the donations would help defend Cyprus.",
              T4: "In Catholic teaching, an *indulgence* granted the remission of some of the punishment due for sins that had already been forgiven. It was obtained through prayer, good works or a charitable *donation*; in this case, the donations were meant to fund the defense of Cyprus, and each giver received a letter as proof.",
            },
            es: {
              T1: "Chappe necesita cartas de *indulgencia*. La gente daba dinero para ayudar a Chipre. La Iglesia daba una carta a cada persona. Los católicos creían que quitaba parte del castigo por los pecados.",
              T2: "Una carta de *indulgencia* era un papel de la Iglesia católica. Quien daba dinero o hacía buenas obras podía recibir una. Los católicos creían que quitaba parte del castigo por los pecados.",
              T3: "En la Iglesia católica, una *indulgencia* era una concesión que quitaba parte del castigo por pecados que ya habían sido perdonados. Se daba a cambio de oraciones, buenas obras o un *donativo*. Aquí, los donativos ayudarían a defender Chipre.",
              T4: "Según la enseñanza católica, una *indulgencia* concedía el perdón de parte del castigo debido por pecados ya perdonados. Se obtenía mediante la oración, las buenas obras o un *donativo* caritativo; en este caso, los donativos servirían para financiar la defensa de Chipre, y cada donante recibía una carta como comprobante.",
            },
          },
        },
        {
          id: "indulgences.form",
          speaker: CHAPPE_SPEAKER,
          text: {
            en: {
              T1: "Each letter is one page. It has empty spaces. A name goes there, by hand. The date goes there too.",
              T2: "Each letter is a one-page *form* with blank spaces. After someone gives money, a clerk writes in that person's name and the date by hand.",
              T3: "Each letter is a one-page *form* with blank spaces. The printed words are the same on every copy. When someone makes a donation, a clerk writes that person's name and the date into the blanks by hand.",
              T4: "Each letter is a single-page *form*: the text is identical on every copy, with blank spaces left for the details. When a donation is made, a clerk fills in the giver's name and the date by hand, so one printed text can serve thousands of different people.",
            },
            es: {
              T1: "Cada carta es una hoja. Tiene espacios vacíos. Ahí se escribe un nombre a mano. También va la fecha.",
              T2: "Cada carta es un *formulario* de una sola página con espacios en blanco. Cuando alguien da dinero, un escribano anota a mano su nombre y la fecha.",
              T3: "Cada carta es un *formulario* de una página con espacios en blanco. Las palabras impresas son iguales en todas las copias. Cuando alguien hace un donativo, un escribano escribe a mano su nombre y la fecha en los espacios.",
              T4: "Cada carta es un *formulario* de una sola hoja: el texto es idéntico en todas las copias y deja espacios en blanco para los datos. Cuando alguien hace un donativo, un escribano anota a mano su nombre y la fecha, de modo que un mismo texto impreso sirve para miles de personas distintas.",
            },
          },
        },
      ],
    },
    {
      id: "print",
      dialogue: [
        {
          id: "indulgences.pressGo",
          speaker: CHAPPE_SPEAKER,
          text: {
            en: {
              T1: "Go to the press. Put *ink* on the *type*. Print my forms!",
              T2: "Please go to the press. Ink the *type*, lay down the paper and pull the bar. I need many clean forms!",
              T3: "Go to the *printing press* and run off the forms. Ink the *type* evenly and pull the bar firmly: every copy must be clear enough to use.",
              T4: "Take your place at the *printing press*. Ink the *type* evenly, lay down each sheet and pull the bar with steady pressure; a smudged *form* is paper wasted and a letter no one can use.",
            },
            es: {
              T1: "Ve a la prensa. Pon *tinta* en los *tipos*. ¡Imprime mis formularios!",
              T2: "Por favor, ve a la prensa. Pon tinta en los *tipos*, coloca el papel y jala la barra. ¡Necesito muchos formularios limpios!",
              T3: "Ve a la prensa e imprime los formularios. Pon tinta pareja en los *tipos* y jala la barra con fuerza: así cada copia saldrá clara y útil.",
              T4: "Ocupa tu lugar en la prensa. Entinta los *tipos* de manera pareja, coloca cada hoja y jala la barra con presión constante; un *formulario* manchado es papel desperdiciado y una carta que nadie puede usar.",
            },
          },
        },
      ],
      objective: { type: "station", station: "press" },
      objectiveText: {
        goal: {
          en: { T1: "Print the forms.", T3: "Print the indulgence forms at the press." },
          es: { T1: "Imprime los formularios.", T3: "Imprime los formularios de indulgencia en la prensa." },
        },
        hintTouch: { en: "Walk to the press and tap ✋.", es: "Camina a la prensa y toca ✋." },
        hintMouse: { en: "Walk to the press and press F.", es: "Camina a la prensa y presiona F." },
      },
    },
    {
      id: "count",
      dialogue: [
        {
          id: "indulgences.count",
          speaker: CHAPPE_SPEAKER,
          text: {
            en: {
              T1: "Good work! All the forms look the same. The press is fast. Now check the account book.",
              T2: "Excellent! Every form matches. Scribes would need weeks to copy this many. Now check the account book to see what the job earned.",
              T3: "Excellent. Every form is identical, and the press makes them far faster than any scribe. But a printer must also keep accounts. Let us see if this job earns more than it *costs*.",
              T4: "Excellent. Every sheet is identical, and the press turns them out faster than a room full of scribes. But a print shop is a business: before you celebrate, check the account book and find out whether this job brings in more than its *costs*, and how much *profit* is left.",
            },
            es: {
              T1: "¡Buen trabajo! Todos los formularios son iguales. La prensa es rápida. Ahora revisa el libro de cuentas.",
              T2: "¡Excelente! Todos los formularios coinciden. Los copistas tardarían semanas en hacer tantos. Ahora revisa el libro de cuentas para ver cuánto dejó el trabajo.",
              T3: "Excelente. Todos los formularios son idénticos, y la prensa los hace mucho más rápido que cualquier copista. Pero un impresor también lleva cuentas. Veamos si este trabajo deja más de lo que *cuesta*.",
              T4: "Excelente. Todas las hojas son idénticas, y la prensa las produce más rápido que una sala llena de copistas. Pero un taller es un negocio: antes de celebrar, revisa el libro de cuentas y averigua si este trabajo deja más de lo que suman sus *costos*, y cuánta *ganancia* queda.",
            },
          },
        },
        {
          id: "indulgences.coins",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "The account book uses game coins. They are not real old prices.",
              T2: "The account book uses game coins. They help you practice the math, but they are not real prices from 1454.",
              T3: "The account book uses game coins, not real prices from 1454. The numbers are made up so you can practice the math a printer needed.",
              T4: "The account book uses invented game coins rather than historical prices, which varied from place to place and are not well recorded for this job; the point is to practice the reasoning a printer needed.",
            },
            es: {
              T1: "El libro de cuentas usa monedas del juego. No son precios reales de antes.",
              T2: "El libro de cuentas usa monedas del juego. Sirven para practicar las cuentas, pero no son precios reales de 1454.",
              T3: "El libro de cuentas usa monedas del juego, no precios reales de 1454. Los números son inventados para que practiques las cuentas que hacía un impresor.",
              T4: "El libro de cuentas usa monedas inventadas para el juego, no precios históricos, que variaban de un lugar a otro y no están bien documentados para este trabajo; la idea es practicar el razonamiento que necesitaba un impresor.",
            },
          },
        },
      ],
      objective: { type: "station", station: "ledger" },
      objectiveText: {
        goal: {
          en: { T1: "Use the account book.", T3: "Work out the money in the account book." },
          es: { T1: "Usa el libro de cuentas.", T3: "Calcula el dinero en el libro de cuentas." },
        },
        hintTouch: { en: "Walk to the account book and tap ✋.", es: "Camina al libro de cuentas y toca ✋." },
        hintMouse: { en: "Walk to the account book and press F.", es: "Camina al libro de cuentas y presiona F." },
      },
    },
    {
      id: "done",
      dialogue: [
        {
          id: "indulgences.done",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Printers need *customers*. Customers bring money. Big books need much more money. Gutenberg's Bible is a big book!",
              T2: "Historians think printers in Mainz made hundreds or thousands of these letters. Small jobs like this paid the bills. But a big book, like a whole Bible, needed much more money.",
              T3: "Historians estimate that printers in Mainz produced hundreds, perhaps thousands, of indulgence letters in 1454 and 1455. Small jobs like these brought in steady money from *customers*. But a huge project, such as a printed Bible, needed far more money than any single job could pay.",
              T4: "Historians estimate that printers in Mainz produced hundreds, possibly thousands, of indulgence letters in 1454 and 1455, and these forms are among the earliest printed items that carry a date. Such jobs gave printers steady income from paying *customers*. Yet a far larger project, a complete printed Bible, demanded more money than small jobs could ever supply, and raising it would lead to a famous dispute.",
            },
            es: {
              T1: "Los impresores necesitan *clientes*. Los clientes traen dinero. Los libros grandes necesitan mucho más dinero. ¡La Biblia de Gutenberg es un libro grande!",
              T2: "Los historiadores creen que los impresores de Maguncia hicieron cientos o miles de estas cartas. Los trabajos pequeños pagaban las cuentas. Pero un libro grande, como una Biblia entera, necesitaba mucho más dinero.",
              T3: "Los historiadores calculan que los impresores de Maguncia produjeron cientos, tal vez miles, de cartas de indulgencia en 1454 y 1455. Estos trabajos pequeños daban dinero constante de los *clientes*. Pero un proyecto enorme, como una Biblia impresa, necesitaba mucho más dinero del que podía pagar un solo trabajo.",
              T4: "Los historiadores calculan que los impresores de Maguncia produjeron cientos, quizá miles, de cartas de indulgencia en 1454 y 1455, y estos formularios están entre los primeros impresos que llevan fecha. Esos trabajos daban a los impresores ingresos constantes de *clientes* que pagaban. Sin embargo, un proyecto mucho mayor, una Biblia impresa completa, exigía más dinero del que los trabajos pequeños podían aportar, y conseguirlo terminaría en una disputa famosa.",
            },
          },
        },
        {
          id: "indulgences.later",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Later, people argued about selling indulgences. Some wanted big changes in the Church. You will learn more in Chapter 7.",
              T2: "Many years later, people argued about selling indulgences. In 1517, these arguments helped start the Protestant Reformation. You will learn more in Chapter 7.",
              T3: "Over the next sixty years, the selling of indulgences became more and more controversial. By 1517, disagreements about it had become one of the causes of the Protestant Reformation, which you will explore in Chapter 7.",
              T4: "In the following decades, the selling of indulgences grew increasingly controversial. By 1517, disputes over the practice had become one of the causes of the Protestant Reformation, a turning point you will explore in Chapter 7, and one that the printing press itself would help to spread.",
            },
            es: {
              T1: "Después, la gente discutió sobre vender indulgencias. Algunos querían grandes cambios en la Iglesia. Aprenderás más en el capítulo 7.",
              T2: "Muchos años después, la gente discutió sobre la venta de indulgencias. En 1517, esas discusiones ayudaron a comenzar la Reforma protestante. Aprenderás más en el capítulo 7.",
              T3: "En los siguientes sesenta años, la venta de indulgencias causó cada vez más polémica. Para 1517, los desacuerdos sobre ella se habían vuelto una de las causas de la Reforma protestante, que explorarás en el capítulo 7.",
              T4: "En las décadas siguientes, la venta de indulgencias se volvió cada vez más polémica. Para 1517, las disputas sobre esta práctica se habían convertido en una de las causas de la Reforma protestante, un momento decisivo que explorarás en el capítulo 7 y que la propia *imprenta* ayudaría a difundir.",
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

export const GLOSSARY_INDULGENCES: GlossaryEntry[] = [
  {
    id: "indulgence",
    emoji: "📜",
    term: { en: "indulgence", es: "indulgencia" },
    aliases: { en: ["indulgences"], es: ["indulgencias"] },
    simple: {
      en: "A grant from the Catholic Church that Catholics believed took away some punishment for sins.",
      es: "Una concesión de la Iglesia católica que, según los católicos, quitaba parte del castigo por los pecados.",
    },
    full: {
      en: "In Catholic teaching, a remission of some of the punishment due for sins already forgiven, obtained through prayer, good works or a donation. In 1454 and 1455, printed letters of indulgence served as proof for people who gave money to defend Cyprus.",
      es: "Según la enseñanza católica, el perdón de parte del castigo debido por pecados ya perdonados, que se obtenía con oración, buenas obras o un donativo. En 1454 y 1455, las cartas de indulgencia impresas servían como comprobante para quienes daban dinero para defender Chipre.",
    },
  },
  {
    id: "envoy",
    emoji: "🧳",
    term: { en: "envoy", es: "enviado" },
    aliases: { en: ["envoys"], es: ["enviados", "enviada"] },
    simple: {
      en: "A person sent by a ruler to do a job in another place.",
      es: "Una persona que un gobernante manda a otro lugar para hacer un trabajo.",
    },
    full: {
      en: "A representative sent by a ruler or government on official business. Paulinus Chappe was an envoy of the King of Cyprus who oversaw the indulgence in Germany.",
      es: "Un representante que un gobernante o gobierno envía para tratar asuntos oficiales. Paulinus Chappe fue enviado del rey de Chipre y supervisó la indulgencia en Alemania.",
    },
  },
  {
    id: "form",
    emoji: "📝",
    term: { en: "form", es: "formulario" },
    aliases: { en: ["forms"], es: ["formularios"] },
    simple: {
      en: "A printed page with blank spaces to fill in.",
      es: "Una hoja impresa con espacios en blanco para llenar.",
    },
    full: {
      en: "A document with the same printed text on every copy and blanks for details that change, such as a name or date. Forms were ideal for the press because one setting of type made many identical copies.",
      es: "Un documento con el mismo texto impreso en todas las copias y espacios para los datos que cambian, como un nombre o una fecha. Los formularios eran ideales para la prensa porque un solo juego de tipos daba muchas copias idénticas.",
    },
  },
  {
    id: "donation",
    emoji: "🎁",
    term: { en: "donation", es: "donativo" },
    aliases: { en: ["donations"], es: ["donativos", "donación", "donaciones"] },
    simple: {
      en: "Money or a gift given to help a cause.",
      es: "Dinero o un regalo que se da para ayudar a una causa.",
    },
    full: {
      en: "Something given freely to support a cause, such as a church, a charity or, in 1454, the defense of Cyprus.",
      es: "Algo que se da libremente para apoyar una causa, como una iglesia, una obra de caridad o, en 1454, la defensa de Chipre.",
    },
  },
  {
    id: "customer",
    emoji: "🧑‍💼",
    term: { en: "customer", es: "cliente" },
    aliases: { en: ["customers"], es: ["clientes"] },
    simple: {
      en: "A person who pays for something.",
      es: "Una persona que paga por algo.",
    },
    full: {
      en: "A person or group who buys goods or services from a business. Early print shops depended on customers who ordered and paid for printed work.",
      es: "Una persona o grupo que compra productos o servicios a un negocio. Los primeros talleres de imprenta dependían de clientes que encargaban y pagaban trabajos impresos.",
    },
  },
  {
    id: "cost",
    emoji: "🧾",
    term: { en: "cost", es: "costo" },
    aliases: { en: ["costs"], es: ["costos", "cuesta", "cuestan"] },
    simple: {
      en: "The money you must spend to make something.",
      es: "El dinero que hay que gastar para hacer algo.",
    },
    full: {
      en: "The money a business spends to produce something. For a printer, costs included paper, ink, metal for type and workers' wages; some costs are paid once (setting type) and some for every copy (paper).",
      es: "El dinero que un negocio gasta para producir algo. Para un impresor, los costos incluían papel, tinta, metal para los tipos y el pago a los trabajadores; algunos se pagan una vez (componer los tipos) y otros por cada copia (el papel).",
    },
  },
  {
    id: "profit",
    emoji: "📈",
    term: { en: "profit", es: "ganancia" },
    aliases: { en: ["profits"], es: ["ganancias"] },
    simple: {
      en: "The money left after you pay your costs.",
      es: "El dinero que queda después de pagar los costos.",
    },
    full: {
      en: "Income minus costs. If a job brings in more money than it costs, the difference is profit; if it brings in less, the business loses money.",
      es: "El ingreso menos los costos. Si un trabajo deja más dinero del que cuesta, la diferencia es ganancia; si deja menos, el negocio pierde dinero.",
    },
  },
];
