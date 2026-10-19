import { Band, Lang, Line } from "../../i18n/types";
import { Chapter } from "../../game/quest";
import { CLAY_WORLD } from "../../game/world";
import type { CarveConfig, HoldConfig, PerBandLang, QuizConfig } from "../../game/activities";
import type { TypesetConfig } from "../press";
import type { GlossaryEntry } from "../glossaryTypes";

// Chapter 0: The Clay Type. Song-dynasty China, 1040s; Korea, 1377.
//
// Historical notes for reviewers:
// - Bi Sheng (畢昇) was a commoner (布衣, "plain-clothes" person, i.e. without
//   official rank) who made movable type from clay during the Qingli reign
//   period (1041-1048). High confidence; the 1040s are told as "about 1040".
// - Nearly all we know comes from Shen Kuo's Dream Pool Essays (Mengxi Bitan),
//   written around 1088 (dates given for it range c. 1086-1093, so "around").
//   High confidence that this is the source; no type made by Bi Sheng is
//   known to survive (stated as "no pieces are known to survive").
// - Process per Shen Kuo: each character carved in sticky clay, thin as the
//   edge of a coin; baked hard in fire; an iron plate coated with pine resin,
//   wax and paper ash; an iron frame set on the plate and filled with type;
//   plate warmed, a flat board pressed on the type to make it even, cooled
//   to hold it; warmed again afterward to release the type. Two plates used
//   in turn. Common characters (e.g. 之, 也) had twenty or more copies;
//   missing characters were carved and baked on the spot. Shen Kuo says the
//   method is not efficient for two or three copies but very fast for
//   hundreds or thousands. All paraphrased; nothing is quoted. High confidence.
// - "Kiln": Shen Kuo says the type was hardened with fire; the game station is
//   a kiln. The "too little heat = weak, too much = cracks" framing is general
//   ceramics, not from the source. Medium confidence as a depiction.
// - Woodblock printing in China predates Bi Sheng by centuries (the Diamond
//   Sutra of 868 is the oldest dated printed book). High confidence.
// - Thousands of characters as "one reason historians give" for woodblock
//   printing staying dominant in China: a common explanation, hedged as such.
// - Jikji (short title of Baegun hwasang chorok buljo jikji simche yojeol),
//   printed with movable metal type in 1377 at Heungdeok Temple, Cheongju,
//   Korea. Oldest surviving (extant) book printed with movable metal type
//   (UNESCO Memory of the World, 2001). Only the second volume survives; it is
//   held by the Bibliothèque nationale de France in Paris. High confidence.
//   Earlier Korean metal-type printing is recorded (13th century) but no
//   copies survive, so the text says "oldest surviving", never "first".
// - Gutenberg's Bible finished about 1455 (used in the 9-12 subtraction).
// - Bi Sheng's lines are written for teaching; they are not quotations.
// - Carving glyphs: only left-right asymmetric characters are used (上 下 月
//   水 人 女), because a symmetric character such as 山 木 中 大 口 looks the
//   same in a mirror and would make the carve activity meaningless.

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };
const BI_SHENG_SPEAKER: Line = { en: "Bi Sheng", es: "Bi Sheng" };
const UPPER_BANDS: Band[] = ["6-8", "9-12"];

export const CLAY_CHAPTER: Chapter = {
  id: "clay",
  world: CLAY_WORLD,
  // Filled in below, after the configs are defined.
  activities: {},
  steps: [
    {
      id: "intro",
      dialogue: [
        {
          id: "clay.intro",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "This is China. The year is about 1040. You help a craftsman. His name is Bi Sheng.",
              T2: "Welcome to China, around the year 1040, during the Song dynasty. You are helping a craftsman named Bi Sheng in his workshop.",
              T3: "China, in the 1040s, during the Song dynasty. You have come to help Bi Sheng, a craftsman who is not a noble or an official but an ordinary working person. He has an idea for a new way to print.",
              T4: "China, during the Song dynasty, in the 1040s. You have come to assist Bi Sheng, a commoner craftsman with no official rank, who is experimenting with a method of printing that could change how texts are made, roughly four hundred years before anyone in Europe attempts something similar.",
            },
            es: {
              T1: "Esto es China. Es el año 1040, más o menos. Ayudas a un artesano. Se llama Bi Sheng.",
              T2: "Te damos la bienvenida a China, cerca del año 1040, en tiempos de la dinastía Song. Ayudas a un artesano llamado Bi Sheng en su taller.",
              T3: "China, en la década de 1040, durante la dinastía Song. Vienes a ayudar a Bi Sheng, un artesano que no es noble ni funcionario, sino una persona común que trabaja con sus manos. Tiene una idea para una nueva forma de imprimir.",
              T4: "China, durante la dinastía Song, en la década de 1040. Vienes a ayudar a Bi Sheng, un artesano plebeyo sin cargo oficial, que experimenta con un método de impresión capaz de cambiar cómo se hacen los textos, unos cuatrocientos años antes de que alguien en Europa intente algo parecido.",
            },
          },
        },
        {
          id: "clay.source",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "How do we know about Bi Sheng? A writer told his story. His name was Shen Kuo.",
              T2: "We know about Bi Sheng because a scholar named Shen Kuo wrote about his work in a book, around the year 1088.",
              T3: "We know about Bi Sheng's invention because the scholar Shen Kuo described it in his book, the Dream Pool Essays, written around 1088.",
              T4: "Almost everything we know about Bi Sheng comes from the scholar Shen Kuo, who described the method in his Dream Pool Essays, written around 1088. Bi Sheng's own words were never recorded, so what he says in this chapter is imagined for teaching.",
            },
            es: {
              T1: "¿Cómo sabemos de Bi Sheng? Un escritor contó su historia. Se llamaba Shen Kuo.",
              T2: "Sabemos de Bi Sheng porque un sabio llamado Shen Kuo escribió sobre su trabajo en un libro, alrededor del año 1088.",
              T3: "Conocemos el invento de Bi Sheng porque el sabio Shen Kuo lo describió en su libro, los Ensayos del estanque de los sueños, escrito alrededor de 1088.",
              T4: "Casi todo lo que sabemos de Bi Sheng proviene del sabio Shen Kuo, quien describió el método en sus Ensayos del estanque de los sueños, escritos alrededor de 1088. Nadie anotó las palabras del propio Bi Sheng, así que lo que dice en este capítulo es imaginado para enseñar.",
            },
          },
        },
      ],
    },
    {
      id: "meet",
      objective: { type: "talk", npcId: "bisheng" },
      objectiveText: {
        goal: { en: "Talk to Bi Sheng.", es: "Habla con Bi Sheng." },
        hintTouch: { en: "Walk to him and tap 💬.", es: "Camina hacia él y toca 💬." },
        hintMouse: { en: "Walk to him and press F.", es: "Camina hacia él y presiona F." },
      },
    },
    {
      id: "type",
      dialogue: [
        {
          id: "clay.type",
          speaker: BI_SHENG_SPEAKER,
          text: {
            en: {
              T1: "Hello, helper! I make *clay type*. Each little piece has one *character*. A character is a sign for a word.",
              T2: "Hello, helper! I am making *clay type*. On each small piece of sticky clay, I carve one Chinese *character*, a sign that stands for a word or part of a word.",
              T3: "Welcome, helper. I carve each Chinese *character* onto its own thin piece of sticky clay, then bake the pieces hard in the fire. With this *clay type*, I can arrange any text I need, then take it apart and use the pieces again. That is the idea of *movable type*.",
              T4: "Welcome, helper. I carve each Chinese *character* onto its own piece of sticky clay, as thin as the edge of a coin, and then harden it in fire. Because this *clay type* can be arranged into any text and reused afterward, it is *movable type*, a very different approach from carving an entire page into a single block of wood.",
            },
            es: {
              T1: "¡Hola! Yo hago *tipos de arcilla*. Cada pieza tiene un *carácter*. Un carácter es un signo. Quiere decir una palabra.",
              T2: "¡Hola! Estoy haciendo *tipos de arcilla*. En cada pieza pequeña de arcilla pegajosa tallo un *carácter* chino, un signo que representa una palabra o parte de una palabra.",
              T3: "Te doy la bienvenida. Tallo cada *carácter* chino en su propia pieza delgada de arcilla pegajosa y luego cuezo las piezas en el fuego hasta que se endurecen. Con estos *tipos de arcilla* puedo formar cualquier texto, desarmarlo y volver a usar las piezas. Esa es la idea de los *tipos móviles*.",
              T4: "Te doy la bienvenida. Tallo cada *carácter* chino en su propia pieza de arcilla pegajosa, tan delgada como el borde de una moneda, y después la endurezco en el fuego. Como estos *tipos de arcilla* pueden ordenarse para formar cualquier texto y reutilizarse, son *tipos móviles*: algo muy distinto de tallar una página entera en un solo bloque de madera.",
            },
          },
        },
        {
          id: "clay.mirror",
          speaker: BI_SHENG_SPEAKER,
          text: {
            en: {
              T1: "Carve the sign backwards. It is a *mirror image*. Then it prints the right way.",
              T2: "Each character must be carved backwards, as a *mirror image*. When you press it onto paper, it will face the right way.",
              T3: "Remember: carve every character as a *mirror image*, reversed from left to right. When the raised character is inked and pressed onto paper, the print flips it back, so it reads correctly.",
              T4: "Remember that every character must be carved as a *mirror image*, reversed from left to right and raised above the surface. Printing reverses the image once more, so the impression on the paper reads correctly.",
            },
            es: {
              T1: "Talla el signo al revés. Es una *imagen de espejo*. Así sale bien en el papel.",
              T2: "Cada carácter se talla al revés, como una *imagen de espejo*. Cuando lo presiones sobre el papel, quedará en la dirección correcta.",
              T3: "Recuerda: talla cada carácter como una *imagen de espejo*, invertido de izquierda a derecha. Cuando el carácter en relieve se entinta y se presiona sobre el papel, la impresión lo voltea otra vez y se lee bien.",
              T4: "Recuerda que cada carácter debe tallarse como una *imagen de espejo*, invertido de izquierda a derecha y en relieve sobre la superficie. Al imprimir, la imagen se invierte de nuevo, de modo que la impresión en el papel se lee correctamente.",
            },
          },
        },
      ],
    },
    {
      id: "carve",
      objective: { type: "station", station: "carve" },
      objectiveText: {
        goal: {
          en: { T1: "Carve type at the clay bench.", T3: "Carve mirror-image characters at the clay bench." },
          es: { T1: "Talla tipos en la mesa de arcilla.", T3: "Talla caracteres en imagen de espejo en la mesa de arcilla." },
        },
        hintTouch: { en: "Walk to the clay bench and tap ✋.", es: "Camina a la mesa de arcilla y toca ✋." },
        hintMouse: { en: "Walk to the clay bench and press F.", es: "Camina a la mesa de arcilla y presiona F." },
      },
    },
    {
      id: "bake",
      dialogue: [
        {
          id: "clay.bake",
          speaker: BI_SHENG_SPEAKER,
          text: {
            en: {
              T1: "Good! Now we bake the clay. Fire makes it hard. Hard type lasts a long time.",
              T2: "Good carving! Now put the pieces in the *kiln*. The heat will bake the soft clay until it is hard and strong.",
              T3: "Fine work. Soft clay would crumble when we print, so now we bake the pieces in the *kiln*. If they get too little heat, they stay weak. If they get too much, they may crack.",
              T4: "Fine work. Unfired clay would crumble under the pressure of printing, so the pieces must be hardened in the *kiln*. Underfired, they remain fragile; overheated, they may crack. Watch the heat carefully and stop at the right moment.",
            },
            es: {
              T1: "¡Bien! Ahora cocemos la arcilla. El fuego la pone dura. Así dura mucho tiempo.",
              T2: "¡Buen tallado! Ahora pon las piezas en el *horno*. El calor cocerá la arcilla blanda hasta que quede dura y fuerte.",
              T3: "Buen trabajo. La arcilla blanda se desmoronaría al imprimir, así que ahora cocemos las piezas en el *horno*. Si reciben poco calor, quedan débiles. Si reciben demasiado, se pueden agrietar.",
              T4: "Buen trabajo. La arcilla sin cocer se desmoronaría bajo la presión de la impresión, así que hay que endurecer las piezas en el *horno*. Si se cuecen poco, quedan frágiles; si se calientan en exceso, pueden agrietarse. Vigila el calor y detente en el momento justo.",
            },
          },
        },
      ],
      objective: { type: "station", station: "kiln" },
      objectiveText: {
        goal: {
          en: { T1: "Bake the type in the kiln.", T3: "Bake the clay type hard in the kiln." },
          es: { T1: "Cuece los tipos en el horno.", T3: "Cuece los tipos de arcilla en el horno hasta que estén duros." },
        },
        hintTouch: { en: "Walk to the kiln and tap ✋.", es: "Camina al horno y toca ✋." },
        hintMouse: { en: "Walk to the kiln and press F.", es: "Camina al horno y presiona F." },
      },
    },
    {
      id: "plate",
      dialogue: [
        {
          id: "clay.plate",
          speaker: BI_SHENG_SPEAKER,
          text: {
            en: {
              T1: "Look at this iron plate. It has wax on it. Warm wax gets soft. We push the *type* in. Cool wax holds it tight.",
              T2: "This iron plate is covered with a mix of pine resin, wax and paper ash. I put an iron frame on it and fill it with *type*. I warm the plate so the mix gets soft, press the type flat, and let it cool so it holds the type tight.",
              T3: "Here is the iron plate. I coat it with a mixture of pine resin, wax and paper ash, then set an iron frame on top and fill it with *type*. When I warm the plate, the mixture softens. I press the type flat with a board, and as it cools, the mixture hardens and holds every piece in place.",
              T4: "This iron plate is coated with a mixture of pine resin, wax and paper ash. I place an iron frame on it and fill the frame with *type*, packed tightly. Warming the plate softens the mixture; pressing a flat board across the type makes the surface perfectly even; and once it cools, the mixture sets and locks every piece in place. Afterward, warming it again releases the type so it can be reused.",
            },
            es: {
              T1: "Mira esta placa de hierro. Tiene cera. La cera tibia se pone blanda. Ponemos los *tipos*. La cera fría los sostiene.",
              T2: "Esta placa de hierro está cubierta con una mezcla de resina de pino, cera y ceniza de papel. Pongo encima un marco de hierro y lo lleno de *tipos*. Caliento la placa para que la mezcla se ablande, aplano los tipos y dejo que se enfríe para que los sujete bien.",
              T3: "Aquí está la placa de hierro. La cubro con una mezcla de resina de pino, cera y ceniza de papel, pongo encima un marco de hierro y lo lleno de *tipos*. Al calentar la placa, la mezcla se ablanda. Aplano los tipos con una tabla y, al enfriarse, la mezcla se endurece y sostiene cada pieza en su lugar.",
              T4: "Esta placa de hierro está cubierta con una mezcla de resina de pino, cera y ceniza de papel. Coloco encima un marco de hierro y lo lleno de *tipos* bien apretados. Al calentar la placa, la mezcla se ablanda; al presionar una tabla plana sobre los tipos, la superficie queda pareja; y al enfriarse, la mezcla se endurece y fija cada pieza. Después, basta con calentarla otra vez para soltar los tipos y reutilizarlos.",
            },
          },
        },
        {
          id: "clay.frameGo",
          speaker: BI_SHENG_SPEAKER,
          text: {
            en: {
              T1: "Now put the type in the frame. 山 means mountain. 水 means water.",
              T2: "Now *set* the baked type into the iron frame, in the right order. Here is a clue: 山 means mountain and 水 means water.",
              T3: "Now *set* the baked type in the iron frame, in order. The characters you need are shown for you. For example, 山 means mountain and 水 means water. Watch out for characters that look alike!",
              T4: "Now *set* the hardened type in the iron frame, in the correct order. Each piece carries one character: 山 means mountain and 水 means water, for example. Be careful, because several characters look very similar, especially when they are reversed.",
            },
            es: {
              T1: "Ahora pon los tipos en el marco. 山 significa montaña. 水 significa agua.",
              T2: "Ahora *compón* los tipos cocidos en el marco de hierro, en orden. Una pista: 山 significa montaña y 水 significa agua.",
              T3: "Ahora *compón* los tipos cocidos en el marco de hierro, en orden. Verás los caracteres que necesitas. Por ejemplo, 山 significa montaña y 水 significa agua. ¡Cuidado con los caracteres que se parecen!",
              T4: "Ahora *compón* los tipos endurecidos en el marco de hierro, en el orden correcto. Cada pieza lleva un carácter: 山 significa montaña y 水 significa agua, por ejemplo. Ten cuidado, porque varios caracteres se parecen mucho, sobre todo cuando están invertidos.",
            },
          },
        },
      ],
    },
    {
      id: "frame",
      objective: { type: "station", station: "frame" },
      objectiveText: {
        goal: {
          en: { T1: "Put the type in the iron frame.", T3: "Set the baked type in the iron frame." },
          es: { T1: "Pon los tipos en el marco de hierro.", T3: "Compón los tipos cocidos en el marco de hierro." },
        },
        hintTouch: { en: "Walk to the iron frame and tap ✋.", es: "Camina al marco de hierro y toca ✋." },
        hintMouse: { en: "Walk to the iron frame and press F.", es: "Camina al marco de hierro y presiona F." },
      },
    },
    {
      id: "twoPlates",
      bands: UPPER_BANDS,
      dialogue: [
        {
          id: "clay.twoPlates",
          speaker: BI_SHENG_SPEAKER,
          text: {
            en: {
              T1: "I use two plates. One prints. I fill the other. Then they switch. No waiting!",
              T2: "I use two iron plates. While one is being printed, I fill the other with type. Then they switch, so the work never has to stop.",
              T3: "I keep two iron plates. While one is being printed, the next page is set on the other. When the first is finished, the second is ready. For two or three copies this is slow to prepare, but for hundreds of copies it is very fast.",
              T4: "I keep two iron plates working in turn: while one is being printed, the next page is being set on the other, so there is almost no waiting. For two or three copies the method is hardly worth the trouble, but for hundreds or thousands of copies it is remarkably fast.",
            },
            es: {
              T1: "Uso dos placas. Una imprime. Lleno la otra. Luego cambian. ¡Nadie espera!",
              T2: "Uso dos placas de hierro. Mientras se imprime con una, lleno la otra de tipos. Luego cambian, y así el trabajo nunca se detiene.",
              T3: "Tengo dos placas de hierro. Mientras se imprime con una, en la otra se compone la página siguiente. Cuando la primera termina, la segunda ya está lista. Para dos o tres copias, prepararlo es lento, pero para cientos de copias es muy rápido.",
              T4: "Tengo dos placas de hierro que trabajan por turnos: mientras se imprime con una, en la otra se compone la página siguiente, así que casi no hay espera. Para dos o tres copias, el método apenas vale la pena, pero para cientos o miles de copias es sorprendentemente rápido.",
            },
          },
        },
        {
          id: "clay.copies",
          speaker: BI_SHENG_SPEAKER,
          text: {
            en: {
              T1: "Some characters are used a lot. So I make many of them. Twenty or more!",
              T2: "Some characters appear on almost every page, so I make twenty or more copies of each. If a rare character is missing, I carve and bake it right away.",
              T3: "Chinese uses thousands of characters, and some appear on almost every page. So I keep several pieces of type for each character, and twenty or more for the most common ones. If a rare character is missing, I carve it and bake it on the spot.",
              T4: "Written Chinese draws on thousands of characters, some of which appear many times on a single page. I therefore keep several sorts for every character and twenty or more for the most frequent ones. When a rare character is missing, I simply carve and fire it on the spot; even so, organizing so much type is a demanding task.",
            },
            es: {
              T1: "Algunos caracteres se usan mucho. Por eso hago muchos. ¡Veinte o más!",
              T2: "Algunos caracteres aparecen en casi todas las páginas, así que hago veinte copias o más de cada uno. Si falta un carácter raro, lo tallo y lo cuezo en ese momento.",
              T3: "El chino usa miles de caracteres, y algunos aparecen en casi todas las páginas. Por eso guardo varias piezas de cada carácter, y veinte o más de los más comunes. Si falta un carácter raro, lo tallo y lo cuezo ahí mismo.",
              T4: "La escritura china emplea miles de caracteres, y algunos aparecen muchas veces en una sola página. Por eso guardo varios tipos de cada carácter y veinte o más de los más frecuentes. Cuando falta un carácter poco común, lo tallo y lo cuezo en el acto; aun así, organizar tantos tipos es una tarea exigente.",
            },
          },
        },
      ],
    },
    {
      id: "done",
      dialogue: [
        {
          id: "clay.done",
          speaker: BI_SHENG_SPEAKER,
          text: {
            en: {
              T1: "Well done! The type is ready to print. We can use it again and again.",
              T2: "Well done! The page is ready to print. Afterward, we can take the type out and use it again for a new page.",
              T3: "Well done. The page is ready for ink and paper. When we finish, I will warm the plate, the type will come loose, and we can use it again for the next page.",
              T4: "Well done. The page is ready for ink and paper. Once the printing is finished, I will warm the plate until the type comes loose, and the same pieces will be ready for an entirely different page.",
            },
            es: {
              T1: "¡Bien hecho! Ya podemos imprimir. Luego usamos los tipos otra vez.",
              T2: "¡Bien hecho! La página ya está preparada para imprimir. Después, podemos sacar los tipos y usarlos otra vez en una página nueva.",
              T3: "Bien hecho. La página ya puede recibir la tinta y el papel. Cuando terminemos, calentaré la placa, los tipos se soltarán y podremos usarlos de nuevo en la página siguiente.",
              T4: "Bien hecho. Ya podemos poner tinta y papel sobre la página. Cuando terminemos de imprimir, calentaré la placa hasta que los tipos se suelten, y las mismas piezas servirán para una página completamente distinta.",
            },
          },
        },
        {
          id: "clay.wood",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "China printed even before Bi Sheng. People carved a whole page in wood. That is *woodblock printing*. Chinese has thousands of characters. That is one reason wood blocks stayed popular.",
              T2: "People in China were printing even before Bi Sheng. They carved a whole page into one wooden block. This is called *woodblock printing*. Chinese writing uses thousands of characters, and historians say that is one reason wood blocks stayed common there.",
              T3: "Printing in China is even older than Bi Sheng. For centuries, printers had carved an entire page into a wooden block, a method called *woodblock printing*. Because written Chinese needs thousands of different characters, making movable type was a huge job. That is one reason historians give for why woodblocks stayed common in China.",
              T4: "Printing in China predates Bi Sheng by centuries: printers had long carved whole pages into wooden blocks, a technique known as *woodblock printing*. Because written Chinese requires thousands of distinct characters, building and organizing a full set of movable type was an enormous task, which is one reason historians give for woodblock printing remaining common in China.",
            },
            es: {
              T1: "En China ya imprimían antes de Bi Sheng. Tallaban una página entera en madera. Eso es la *xilografía*. El chino tiene miles de caracteres. Por eso, en parte, siguió la madera.",
              T2: "En China ya se imprimía antes de Bi Sheng. Se tallaba una página entera en un bloque de madera. Esto se llama *xilografía*. La escritura china usa miles de caracteres, y los historiadores dicen que esa es una razón por la que la madera siguió siendo común allí.",
              T3: "La imprenta en China es aún más antigua que Bi Sheng. Durante siglos, los impresores habían tallado páginas enteras en bloques de madera, un método llamado *xilografía*. Como la escritura china necesita miles de caracteres distintos, hacer tipos móviles era un trabajo enorme. Esa es una de las razones que dan los historiadores para explicar por qué la xilografía siguió siendo común en China.",
              T4: "La impresión en China antecede a Bi Sheng por siglos: desde hacía mucho, los impresores tallaban páginas enteras en bloques de madera, una técnica conocida como *xilografía*. Como la escritura china requiere miles de caracteres distintos, fabricar y organizar un juego completo de tipos móviles era una tarea enorme; esa es una de las razones que dan los historiadores de que la xilografía siguiera siendo común en China.",
            },
          },
        },
        {
          id: "clay.jikji",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Later, in Korea, people printed a book. It is called *Jikji*. They used *metal type*. The year was 1377. The book is kept in Paris today. This was long before Gutenberg.",
              T2: "Later, in Korea, a Buddhist book called *Jikji* was printed in 1377 at Heungdeok Temple, using *metal type*. It is the oldest book printed with movable metal type that still exists, and it is kept in Paris today. Asia had *movable type* long before Gutenberg.",
              T3: "Movable type did not stop with clay. In Korea in 1377, a Buddhist book called *Jikji* was printed at Heungdeok Temple using movable *metal type*. It is the oldest surviving book printed with movable metal type, and today it is kept in a library in Paris. So *movable type* existed in Asia long before Gutenberg.",
              T4: "The story continued in Korea. In 1377, at Heungdeok Temple, a Buddhist text known as *Jikji* was printed with movable *metal type*. It is the oldest surviving book printed this way and is now held by the National Library of France in Paris. *Movable type*, first in clay and later in metal, existed in Asia long before Gutenberg began his work in Europe some seventy years later.",
            },
            es: {
              T1: "Después, en Corea, se imprimió un libro. Se llama *Jikji*. Usaron *tipos de metal*. Fue en el año 1377. Hoy el libro está en París. Fue mucho antes de Gutenberg.",
              T2: "Después, en Corea, un libro budista llamado *Jikji* se imprimió en 1377 en el templo de Heungdeok con *tipos de metal*. Es el libro impreso con tipos móviles de metal más antiguo que todavía existe, y hoy se guarda en París. Asia tuvo *tipos móviles* mucho antes que Gutenberg.",
              T3: "Los tipos móviles no se quedaron en la arcilla. En Corea, en 1377, un libro budista llamado *Jikji* se imprimió en el templo de Heungdeok con *tipos de metal* móviles. Es el libro más antiguo que se conserva impreso con tipos móviles de metal, y hoy se guarda en una biblioteca de París. Así que los *tipos móviles* existían en Asia mucho antes que Gutenberg.",
              T4: "La historia continuó en Corea. En 1377, en el templo de Heungdeok, se imprimió con *tipos de metal* móviles un texto budista conocido como *Jikji*. Es el libro más antiguo que se conserva impreso de esta manera y hoy lo custodia la Biblioteca Nacional de Francia, en París. Los *tipos móviles*, primero de arcilla y luego de metal, existían en Asia mucho antes de que Gutenberg comenzara su trabajo en Europa, unos setenta años después.",
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
// Carving: choose the mirror-image carving. Only left-right asymmetric
// characters are used (a symmetric one looks the same in a mirror).
// 上 up · 下 down · 月 moon · 水 water · 人 person · 女 woman
// ---------------------------------------------------------------------------

export const CARVE: PerBandLang<CarveConfig> = {
  "K-2": {
    en: { instruction: "Which carving is backwards, like in a mirror? Tap it.", glyphs: ["上", "月"], options: 2, success: "Yes! Backwards type prints the right way." },
    es: { instruction: "¿Cuál tallado está al revés, como en un espejo? Tócalo.", glyphs: ["上", "月"], options: 2, success: "¡Sí! El tipo al revés imprime al derecho." },
  },
  "3-5": {
    en: { instruction: "Pick the clay piece carved as a mirror image of each character. 人 means person, 水 means water, 月 means moon.", glyphs: ["人", "水", "月"], options: 3, success: "Well done! Each piece will print the right way." },
    es: { instruction: "Elige la pieza de arcilla tallada como imagen de espejo de cada carácter. 人 significa persona, 水 significa agua y 月 significa luna.", glyphs: ["人", "水", "月"], options: 3, success: "¡Bien hecho! Cada pieza imprimirá en la dirección correcta." },
  },
  "6-8": {
    en: { instruction: "Choose the carving that is the mirror image of each character. Watch out for carvings that are almost right. (上 up, 下 down, 水 water, 女 woman)", glyphs: ["上", "下", "水", "女"], options: 4, success: "Every piece is carved as a true mirror image." },
    es: { instruction: "Elige el tallado que es la imagen de espejo de cada carácter. Cuidado con los tallados que casi son correctos. (上 arriba, 下 abajo, 水 agua, 女 mujer)", glyphs: ["上", "下", "水", "女"], options: 4, success: "Cada pieza está tallada como una verdadera imagen de espejo." },
  },
  "9-12": {
    en: { instruction: "Select the carving that is a true left-right mirror image of each character; reject carvings that are only nearly right. (上 up, 下 down, 月 moon, 水 water, 女 woman)", glyphs: ["上", "下", "月", "水", "女"], options: 4, success: "All five sorts are correctly reversed and ready for the kiln." },
    es: { instruction: "Selecciona el tallado que sea una verdadera imagen de espejo, de izquierda a derecha, de cada carácter; descarta los que solo son casi correctos. (上 arriba, 下 abajo, 月 luna, 水 agua, 女 mujer)", glyphs: ["上", "下", "月", "水", "女"], options: 4, success: "Los cinco tipos están bien invertidos y preparados para ir al horno." },
  },
};

// ---------------------------------------------------------------------------
// Kiln: hold to heat, let go in the zone.
// Reaction windows, (hi - lo) / rate: 3-5 = 30/40 = 0.75 s,
// 6-8 = 18/45 = 0.40 s, 9-12 = 14/50 = 0.28 s.
// ---------------------------------------------------------------------------

export const KILN: PerBandLang<HoldConfig> = {
  "K-2": {
    en: { instruction: "Hold the button to heat the kiln. Let go when the bar is full.", meterLabel: "Heat", buttonLabel: "Hold to heat", emoji: "🔥", zone: null, rate: 40, rounds: 1, good: "The clay is hard now!", low: "A little more heat!", high: "Too hot!" },
    es: { instruction: "Mantén presionado el botón para calentar el horno. Suéltalo cuando la barra esté llena.", meterLabel: "Calor", buttonLabel: "Mantén para calentar", emoji: "🔥", zone: null, rate: 40, rounds: 1, good: "¡Ahora la arcilla está dura!", low: "¡Un poco más de calor!", high: "¡Demasiado calor!" },
  },
  "3-5": {
    en: { instruction: "Hold to heat the kiln. Let go when the heat is in the green zone. Bake 2 batches.", meterLabel: "Heat", buttonLabel: "Hold to heat", emoji: "🔥", zone: [55, 85], rate: 40, rounds: 2, good: "Baked hard and strong!", low: "Not hot enough. The clay is still soft.", high: "Too hot! The clay cracked." },
    es: { instruction: "Mantén presionado para calentar el horno. Suelta cuando el calor esté en la zona verde. Cuece 2 tandas.", meterLabel: "Calor", buttonLabel: "Mantén para calentar", emoji: "🔥", zone: [55, 85], rate: 40, rounds: 2, good: "¡Quedó dura y fuerte!", low: "Le falta calor. La arcilla sigue blanda.", high: "¡Demasiado calor! La arcilla se agrietó." },
  },
  "6-8": {
    en: { instruction: "Fire 3 batches of clay type. Release when the heat is in the zone: too little leaves the clay weak, too much cracks it.", meterLabel: "Kiln heat", buttonLabel: "Hold to heat", emoji: "🔥", zone: [62, 80], rate: 45, rounds: 3, good: "Fired hard. These sorts will survive printing.", low: "Underfired: the clay would crumble in the frame.", high: "Overheated: the sort cracked." },
    es: { instruction: "Cuece 3 tandas de tipos de arcilla. Suelta cuando el calor esté en la zona: si falta, la arcilla queda débil; si sobra, se agrieta.", meterLabel: "Calor del horno", buttonLabel: "Mantén para calentar", emoji: "🔥", zone: [62, 80], rate: 45, rounds: 3, good: "Bien cocidos. Estos tipos resistirán la impresión.", low: "Poco cocido: la arcilla se desmoronaría en el marco.", high: "Demasiado calor: el tipo se agrietó." },
  },
  "9-12": {
    en: { instruction: "Fire 3 batches. The firing window is narrow: release within the zone to harden the clay without cracking it.", meterLabel: "Kiln heat", buttonLabel: "Hold to heat", emoji: "🔥", zone: [66, 80], rate: 50, rounds: 3, good: "Properly fired: hard, even and reusable.", low: "Underfired: the sort would wear down after a few impressions.", high: "Overfired: the sort cracked and must be carved again." },
    es: { instruction: "Cuece 3 tandas. El margen de cocción es estrecho: suelta dentro de la zona para endurecer la arcilla sin agrietarla.", meterLabel: "Calor del horno", buttonLabel: "Mantén para calentar", emoji: "🔥", zone: [66, 80], rate: 50, rounds: 3, good: "Bien cocido: duro, parejo y reutilizable.", low: "Poco cocido: el tipo se desgastaría tras unas pocas impresiones.", high: "Demasiado cocido: el tipo se agrietó y hay que tallarlo de nuevo." },
  },
};

// ---------------------------------------------------------------------------
// Iron frame: set the baked sorts. TypesetConfig has no instruction field, so
// meanings are given in dialogue (clay.frameGo: 山 and 水 appear in every band).
// K-2 山水 "mountains and water" (a landscape)
// 3-5 山中水 "water in the mountains"
// 6-8 大山大水 "big mountains, big rivers"
// 9-12 日出山上 / 月在水中 "the sun rises over the mountain / the moon is in the water"
// Distractors are look-alikes: 出~山, 永/木~水, 口~中, 太/犬~大, 目~日, 土/止~上, 用~月, 存~在.
// ---------------------------------------------------------------------------

const FRAME_K2: TypesetConfig = { lines: ["山水"], caseSplit: false, distractors: "出永", hintAfter: 1, proof: false, shuffle: false, evenSpacing: false };
const FRAME_35: TypesetConfig = { lines: ["山中水"], caseSplit: false, distractors: "出口永", hintAfter: 3, proof: false, shuffle: false, evenSpacing: false };
const FRAME_68: TypesetConfig = { lines: ["大山大水"], caseSplit: false, distractors: "太犬出永", hintAfter: null, proof: false, shuffle: false, evenSpacing: false };
const FRAME_912: TypesetConfig = { lines: ["日出山上", "月在水中"], caseSplit: false, distractors: "目土止用永存", hintAfter: null, proof: false, shuffle: true, evenSpacing: false };

// Clay sorts, not metal: each band gets its own instruction with the meaning.
const frameText = (cfg: TypesetConfig, en: string, es: string): Record<Lang, TypesetConfig> => ({
  en: { ...cfg, instruction: en },
  es: { ...cfg, instruction: es },
});

export const FRAME: Record<Band, Record<Lang, TypesetConfig>> = {
  "K-2": frameText(
    FRAME_K2,
    "Tap the clay pieces in order. 山 means mountain. 水 means water. The pieces are backwards!",
    "Toca las piezas de arcilla en orden. 山 quiere decir montaña. 水 quiere decir agua. ¡Las piezas están al revés!"
  ),
  "3-5": frameText(
    FRAME_35,
    "Set the baked clay sorts in order: 山 (mountain) 中 (in) 水 (water). Each sort is carved backwards so it prints the right way.",
    "Coloca en orden los tipos de arcilla cocida: 山 (montaña) 中 (en) 水 (agua). Cada tipo está tallado al revés para que se imprima al derecho."
  ),
  "6-8": frameText(
    FRAME_68,
    "Set the clay sorts into the iron frame: 大山大水, \"great mountains, great waters.\" Match each mirrored sort to the character above.",
    "Coloca los tipos de arcilla en el marco de hierro: 大山大水, «grandes montañas, grandes aguas». Busca cada tipo de espejo que corresponde al carácter de arriba."
  ),
  "9-12": frameText(
    FRAME_912,
    "Set two lines in the iron frame: 日出山上 \"the sun rises over the mountain\" and 月在水中 \"the moon is in the water.\" Look-alike characters are mixed into the tray.",
    "Compón dos líneas en el marco de hierro: 日出山上 «el sol sale sobre la montaña» y 月在水中 «la luna está en el agua». En la bandeja hay caracteres parecidos."
  ),
};

// ---------------------------------------------------------------------------
// Journal check.
// ---------------------------------------------------------------------------

export const CLAY_JOURNAL: PerBandLang<QuizConfig> = {
  "K-2": {
    en: {
      intro: "Let's remember what you learned!",
      items: [
        {
          kind: "choice",
          prompt: "Where did Bi Sheng make clay type?",
          options: [
            { text: "China", emoji: "🏯" },
            { text: "Germany", emoji: "🏰" },
          ],
          answer: 0,
          explain: "Bi Sheng made clay type in China, long before printing started in Germany.",
        },
        {
          kind: "choice",
          prompt: "How do you carve a sign on type?",
          options: [
            { text: "Backwards, like in a mirror", emoji: "🪞" },
            { text: "The normal way", emoji: "➡️" },
          ],
          answer: 0,
          explain: "Type is carved backwards. When you print, it comes out the right way.",
        },
        {
          kind: "choice",
          prompt: "How did Bi Sheng make the clay hard?",
          options: [
            { text: "He baked it in fire", emoji: "🔥" },
            { text: "He put it in water", emoji: "💧" },
          ],
          answer: 0,
          explain: "Fire bakes clay hard. Water makes clay soft.",
        },
      ],
    },
    es: {
      intro: "¡Recordemos lo que aprendiste!",
      items: [
        {
          kind: "choice",
          prompt: "¿Dónde hizo Bi Sheng los tipos de arcilla?",
          options: [
            { text: "En China", emoji: "🏯" },
            { text: "En Alemania", emoji: "🏰" },
          ],
          answer: 0,
          explain: "Bi Sheng hizo tipos de arcilla en China, mucho antes de que se imprimiera en Alemania.",
        },
        {
          kind: "choice",
          prompt: "¿Cómo se talla un signo en un tipo?",
          options: [
            { text: "Al revés, como en un espejo", emoji: "🪞" },
            { text: "Al derecho, normal", emoji: "➡️" },
          ],
          answer: 0,
          explain: "El tipo se talla al revés. Al imprimir, sale al derecho.",
        },
        {
          kind: "choice",
          prompt: "¿Cómo puso dura la arcilla Bi Sheng?",
          options: [
            { text: "La coció en el fuego", emoji: "🔥" },
            { text: "La puso en agua", emoji: "💧" },
          ],
          answer: 0,
          explain: "El fuego pone dura la arcilla. El agua la pone blanda.",
        },
      ],
    },
  },
  "3-5": {
    en: {
      intro: "Check what you learned about the first movable type.",
      items: [
        {
          kind: "choice",
          prompt: "Who made movable type first?",
          options: [{ text: "Bi Sheng, in China, around 1040" }, { text: "Johannes Gutenberg, in Germany, around 1450" }, { text: "Monks in a European monastery, around 1300" }],
          answer: 0,
          explain: "Bi Sheng made movable clay type in China about 400 years before Gutenberg. Many people think Gutenberg was first, but he was not.",
        },
        {
          kind: "choice",
          prompt: "Why is each character carved as a mirror image?",
          options: [{ text: "So the printed page reads the right way" }, { text: "To make the type harder to break" }, { text: "Because Chinese is read backwards" }],
          answer: 0,
          explain: "Printing flips the image. A backwards carving prints the right way around.",
        },
        {
          kind: "choice",
          prompt: "What is special about Jikji, a Korean book from 1377?",
          options: [{ text: "It is the oldest surviving book printed with movable metal type" }, { text: "It was the first book ever written" }, { text: "It was printed by Gutenberg" }],
          answer: 0,
          explain: "Jikji was printed with metal type in Korea in 1377, long before Gutenberg. It is kept in Paris today.",
        },
      ],
    },
    es: {
      intro: "Revisa lo que aprendiste sobre los primeros tipos móviles.",
      items: [
        {
          kind: "choice",
          prompt: "¿Quién hizo primero tipos móviles?",
          options: [{ text: "Bi Sheng, en China, alrededor de 1040" }, { text: "Johannes Gutenberg, en Alemania, alrededor de 1450" }, { text: "Unos monjes en un monasterio europeo, alrededor de 1300" }],
          answer: 0,
          explain: "Bi Sheng hizo tipos móviles de arcilla en China unos 400 años antes que Gutenberg. Mucha gente cree que Gutenberg fue el primero, pero no lo fue.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué cada carácter se talla como una imagen de espejo?",
          options: [{ text: "Para que la página impresa se lea bien" }, { text: "Para que el tipo sea más difícil de romper" }, { text: "Porque el chino se lee al revés" }],
          answer: 0,
          explain: "Al imprimir, la imagen se voltea. Un tallado al revés se imprime al derecho.",
        },
        {
          kind: "choice",
          prompt: "¿Qué tiene de especial el Jikji, un libro coreano de 1377?",
          options: [{ text: "Es el libro más antiguo que se conserva impreso con tipos móviles de metal" }, { text: "Fue el primer libro que se escribió en la historia" }, { text: "Lo imprimió Gutenberg" }],
          answer: 0,
          explain: "El Jikji se imprimió con tipos de metal en Corea en 1377, mucho antes que Gutenberg. Hoy se guarda en París.",
        },
      ],
    },
  },
  "6-8": {
    en: {
      intro: "Show what you know about movable type in Asia.",
      items: [
        {
          kind: "choice",
          prompt: "What do Bi Sheng's clay type and the Korean book Jikji show?",
          options: [{ text: "Movable type was used in Asia long before Gutenberg" }, { text: "Gutenberg learned printing on a trip to Korea" }, { text: "Printing in Asia only ever used metal type" }],
          answer: 0,
          explain: "Bi Sheng used clay type around 1040, and Jikji was printed with metal type in 1377. Historians have not found clear evidence that Gutenberg knew about Asian printing.",
        },
        {
          kind: "choice",
          prompt: "Why did woodblock printing stay common in China after Bi Sheng?",
          options: [{ text: "Chinese writing uses thousands of characters, so making and sorting type for all of them was a huge job" }, { text: "China had no clay or metal to make type" }, { text: "Movable type had never been tried in China" }],
          answer: 0,
          explain: "This is one reason historians give. An alphabet has a few dozen letters, but Chinese needs thousands of different characters.",
        },
        {
          kind: "order",
          prompt: "Put Bi Sheng's steps in order.",
          items: [
            "Carve a character in sticky clay as a mirror image",
            "Bake the clay hard in a fire",
            "Set the type in an iron frame on a plate coated with resin, wax and paper ash",
            "Warm the plate, press the type flat, and let it cool",
            "Ink the type and print",
          ],
          explain: "The type is carved, then hardened, then set. Warming and cooling the waxy plate locks it in place for printing.",
        },
        {
          kind: "write",
          prompt: "Someone says, \"Gutenberg invented movable type.\" Explain why that is not quite right.",
          starters: ["That is not quite right because…", "In China, around 1040,…", "In Korea, in 1377,…"],
        },
      ],
    },
    es: {
      intro: "Demuestra lo que sabes sobre los tipos móviles en Asia.",
      items: [
        {
          kind: "choice",
          prompt: "¿Qué demuestran los tipos de arcilla de Bi Sheng y el libro coreano Jikji?",
          options: [{ text: "Que en Asia se usaban tipos móviles mucho antes que Gutenberg" }, { text: "Que Gutenberg aprendió a imprimir en un viaje a Corea" }, { text: "Que en Asia solo se imprimió con tipos de metal" }],
          answer: 0,
          explain: "Bi Sheng usó tipos de arcilla alrededor de 1040, y el Jikji se imprimió con tipos de metal en 1377. Los historiadores no han encontrado pruebas claras de que Gutenberg conociera la imprenta asiática.",
        },
        {
          kind: "choice",
          prompt: "¿Por qué la xilografía siguió siendo común en China después de Bi Sheng?",
          options: [{ text: "La escritura china usa miles de caracteres, así que hacer y ordenar tipos para todos era un trabajo enorme" }, { text: "En China no había arcilla ni metal para hacer tipos" }, { text: "En China nunca se habían probado los tipos móviles" }],
          answer: 0,
          explain: "Esta es una de las razones que dan los historiadores. Un alfabeto tiene unas pocas decenas de letras, pero el chino necesita miles de caracteres distintos.",
        },
        {
          kind: "order",
          prompt: "Ordena los pasos de Bi Sheng.",
          items: [
            "Tallar un carácter en arcilla pegajosa como imagen de espejo",
            "Cocer la arcilla en el fuego hasta que quede dura",
            "Componer los tipos en un marco de hierro sobre una placa cubierta de resina, cera y ceniza de papel",
            "Calentar la placa, aplanar los tipos y dejar que se enfríe",
            "Entintar los tipos e imprimir",
          ],
          explain: "Primero se talla el tipo, luego se endurece y después se compone. Al calentar y enfriar la placa con cera, los tipos quedan fijos para imprimir.",
        },
        {
          kind: "write",
          prompt: "Alguien dice: «Gutenberg inventó los tipos móviles». Explica por qué eso no es del todo correcto.",
          starters: ["Eso no es del todo correcto porque…", "En China, alrededor de 1040,…", "En Corea, en 1377,…"],
        },
      ],
    },
  },
  "9-12": {
    en: {
      intro: "Use evidence to evaluate a common claim about the history of printing.",
      items: [
        {
          kind: "choice",
          prompt: "Most of what we know about Bi Sheng comes from which source?",
          options: [{ text: "A description by the scholar Shen Kuo, written around 1088" }, { text: "Bi Sheng's own workshop diary" }, { text: "Surviving clay type signed by Bi Sheng" }],
          answer: 0,
          explain: "Shen Kuo's Dream Pool Essays is our main source. No pieces of Bi Sheng's type are known to survive, so historians rely on this written account.",
        },
        {
          kind: "number",
          prompt: "Jikji was printed in 1377. Gutenberg's Bible was finished around 1455. About how many years apart are they?",
          answer: 78,
          explain: "1455 − 1377 = 78. Movable metal type was in use in Korea nearly eighty years before Gutenberg's Bible.",
        },
        {
          kind: "evidence",
          prompt: "Which claim does the evidence support best? Choose a claim, pick two pieces of evidence, and explain your reasoning.",
          claims: [
            "Movable type was not invented by Gutenberg; it existed in Asia centuries earlier.",
            "Movable type was first invented by Gutenberg in Europe around 1450.",
          ],
          evidence: [
            { text: "Shen Kuo described Bi Sheng making movable clay type in China in the 1040s.", supports: [0] },
            { text: "The Korean book Jikji was printed with movable metal type in 1377 and still survives.", supports: [0] },
            { text: "Gutenberg was developing printing with cast metal type in Mainz around 1450.", supports: [1] },
            { text: "Gutenberg's Bible, printed with movable type, was finished around 1455.", supports: [1] },
            { text: "Chinese printers carved whole pages into wooden blocks long before Bi Sheng.", supports: [] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
    es: {
      intro: "Usa evidencia para evaluar una afirmación común sobre la historia de la imprenta.",
      items: [
        {
          kind: "choice",
          prompt: "¿De qué fuente proviene casi todo lo que sabemos sobre Bi Sheng?",
          options: [{ text: "De una descripción del sabio Shen Kuo, escrita alrededor de 1088" }, { text: "Del diario de taller del propio Bi Sheng" }, { text: "De tipos de arcilla firmados por Bi Sheng que se conservan" }],
          answer: 0,
          explain: "Los Ensayos del estanque de los sueños, de Shen Kuo, son nuestra fuente principal. No se conoce ninguna pieza de los tipos de Bi Sheng que haya sobrevivido, así que los historiadores dependen de este relato escrito.",
        },
        {
          kind: "number",
          prompt: "El Jikji se imprimió en 1377. La Biblia de Gutenberg se terminó alrededor de 1455. ¿Cuántos años, más o menos, hay entre ambos?",
          answer: 78,
          explain: "1455 − 1377 = 78. En Corea se usaban tipos móviles de metal casi ochenta años antes de la Biblia de Gutenberg.",
        },
        {
          kind: "evidence",
          prompt: "¿Qué afirmación apoya mejor la evidencia? Elige una afirmación, escoge dos pruebas y explica tu razonamiento.",
          claims: [
            "Gutenberg no inventó los tipos móviles; ya existían en Asia siglos antes.",
            "Gutenberg fue el primero en inventar los tipos móviles, en Europa, alrededor de 1450.",
          ],
          evidence: [
            { text: "Shen Kuo describió cómo Bi Sheng hacía tipos móviles de arcilla en China en la década de 1040.", supports: [0] },
            { text: "El libro coreano Jikji se imprimió con tipos móviles de metal en 1377 y todavía se conserva.", supports: [0] },
            { text: "Gutenberg desarrollaba la impresión con tipos de metal fundido en Maguncia alrededor de 1450.", supports: [1] },
            { text: "La Biblia de Gutenberg, impresa con tipos móviles, se terminó alrededor de 1455.", supports: [1] },
            { text: "Los impresores chinos tallaban páginas enteras en bloques de madera mucho antes de Bi Sheng.", supports: [] },
          ],
          pick: 2,
          reasoning: true,
        },
      ],
    },
  },
};

CLAY_CHAPTER.activities = {
  carve: { kind: "carve", title: { en: "Clay bench", es: "Mesa de arcilla" }, icon: "🏺", config: CARVE },
  kiln: { kind: "hold", title: { en: "Kiln", es: "Horno" }, icon: "🔥", config: KILN },
  frame: { kind: "typeset", title: { en: "Iron frame", es: "Marco de hierro" }, icon: "🔲", config: FRAME },
};
CLAY_CHAPTER.journal = CLAY_JOURNAL;

// ---------------------------------------------------------------------------
// Glossary terms introduced in this chapter.
// ---------------------------------------------------------------------------

export const GLOSSARY_CLAY: GlossaryEntry[] = [
  {
    id: "clay-type",
    emoji: "🏺",
    term: { en: "clay type", es: "tipos de arcilla" },
    aliases: { en: ["clay sorts"], es: ["tipo de arcilla"] },
    simple: { en: "Small baked clay pieces, each with one character, used to print.", es: "Piezas pequeñas de arcilla cocida, cada una con un carácter, para imprimir." },
    full: {
      en: "Movable type made from sticky clay, carved with one character per piece and baked hard. Bi Sheng made it in China around 1040.",
      es: "Tipos móviles hechos de arcilla pegajosa, con un carácter tallado en cada pieza y cocidos hasta endurecerse. Bi Sheng los hizo en China alrededor de 1040.",
    },
  },
  {
    id: "kiln",
    emoji: "🔥",
    term: { en: "kiln", es: "horno" },
    aliases: { en: ["kilns"], es: ["hornos"] },
    simple: { en: "A very hot oven that bakes clay hard.", es: "Un horno muy caliente que pone dura la arcilla." },
    full: {
      en: "A very hot oven used to fire clay. Heat changes soft clay into a hard material that keeps its shape.",
      es: "Un horno muy caliente que se usa para cocer arcilla. El calor convierte la arcilla blanda en un material duro que conserva su forma.",
    },
  },
  {
    id: "chinese-character",
    emoji: "🀄",
    term: { en: "character", es: "carácter" },
    aliases: { en: ["characters", "Chinese character", "Chinese characters"], es: ["caracteres", "carácter chino", "caracteres chinos"] },
    simple: { en: "A written sign that stands for a word or part of a word.", es: "Un signo escrito que representa una palabra o parte de una palabra." },
    full: {
      en: "In Chinese writing, each character stands for a word or a meaningful part of a word. Written Chinese uses thousands of different characters, not a small alphabet.",
      es: "En la escritura china, cada carácter representa una palabra o una parte con significado. El chino escrito usa miles de caracteres distintos, no un alfabeto pequeño.",
    },
  },
  {
    id: "mirror-image",
    emoji: "🪞",
    term: { en: "mirror image", es: "imagen de espejo" },
    aliases: { en: ["mirror images", "mirror-image"], es: ["imágenes de espejo"] },
    simple: { en: "A picture flipped left to right, like in a mirror.", es: "Una imagen volteada de izquierda a derecha, como en un espejo." },
    full: {
      en: "An image reversed from left to right. Type is carved or cast as a mirror image, so the printed page reads correctly.",
      es: "Una imagen invertida de izquierda a derecha. Los tipos se tallan o funden como imagen de espejo para que la página impresa se lea correctamente.",
    },
  },
  {
    id: "woodblock-printing",
    emoji: "🪵",
    term: { en: "woodblock printing", es: "xilografía" },
    aliases: { en: ["woodblocks", "woodblock"], es: ["impresión con bloques de madera"] },
    simple: { en: "Printing a page carved into one block of wood.", es: "Imprimir con una página tallada en un bloque de madera." },
    full: {
      en: "Printing from a whole page carved into a single wooden block. It was used in China for centuries, even before movable type.",
      es: "Impresión a partir de una página entera tallada en un solo bloque de madera. Se usó en China durante siglos, incluso antes de los tipos móviles.",
    },
  },
  {
    id: "jikji",
    emoji: "📕",
    term: { en: "Jikji", es: "Jikji" },
    simple: { en: "A Korean book printed with metal type in 1377.", es: "Un libro coreano impreso con tipos de metal en 1377." },
    full: {
      en: "A Buddhist book printed at Heungdeok Temple in Korea in 1377. It is the oldest surviving book printed with movable metal type and is kept in Paris.",
      es: "Un libro budista impreso en el templo de Heungdeok, en Corea, en 1377. Es el libro más antiguo que se conserva impreso con tipos móviles de metal y se guarda en París.",
    },
  },
  {
    id: "metal-type",
    emoji: "🔩",
    term: { en: "metal type", es: "tipos de metal" },
    aliases: { en: ["movable metal type"], es: ["tipo de metal", "tipos móviles de metal"] },
    simple: { en: "Letters or characters made of metal, used to print.", es: "Letras o caracteres de metal que se usan para imprimir." },
    full: {
      en: "Movable type made by pouring melted metal into molds. It is stronger than clay or wood and lasts for many printings.",
      es: "Tipos móviles hechos al verter metal fundido en moldes. Son más resistentes que la arcilla o la madera y duran muchas impresiones.",
    },
  },
];
