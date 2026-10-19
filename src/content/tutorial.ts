import { Line } from "../i18n/types";
import { Chapter } from "../game/quest";

// Tutorial: learn the controls before the story begins.
//
// Each line is written for four reading tiers (see TIER_LEXILE). Tiers are
// written toward their Lexile range and still need checking with the Lexile
// Analyzer. Spanish is Latin American, written in parallel rather than
// translated line by line, and speaks to the player with "tú" without
// gendered adjectives. Words wrapped in *asterisks* are key vocabulary and
// are shown in bold.

const JOURNAL: Line = { en: "The Printer's Journal", es: "El diario del impresor" };

const NOT_K2 = ["3-5", "6-8", "9-12"] as const;

export const TUTORIAL: Chapter = {
  id: "tutorial",
  world: { spawnTrees: true },
  steps: [
    {
      id: "welcome",
      dialogue: [
        {
          id: "tutorial.welcome",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Hi! I am the Printer's Journal. I tell the story of books. Let's learn how to play.",
              T2: "Welcome! I am the Printer's Journal. I will tell you how people learned to print books. First, let's learn how to move around.",
              T3: "Welcome, apprentice. I am the Printer's Journal, and I hold the story of how the *printing press* changed the world. Before the story begins, you need to learn how to move through this world.",
              T4: "Welcome, apprentice. I am the Printer's Journal, a record of how the *printing press* transformed the way knowledge traveled across the world. Before our story begins, take a moment to learn how to navigate your surroundings.",
            },
            es: {
              T1: "¡Hola! Soy el Diario del Impresor. Cuento la historia de los libros. Vamos a aprender a jugar.",
              T2: "¡Te damos la bienvenida! Soy el Diario del Impresor. Te voy a contar cómo las personas aprendieron a imprimir libros. Primero, vamos a aprender a moverte.",
              T3: "Te damos la bienvenida, aprendiz. Soy el Diario del Impresor y guardo la historia de cómo la *imprenta* cambió el mundo. Antes de comenzar, necesitas aprender a moverte por este mundo.",
              T4: "Te damos la bienvenida, aprendiz. Soy el Diario del Impresor, un registro de cómo la *imprenta* transformó la manera en que el conocimiento viajaba por el mundo. Antes de comenzar nuestra historia, tómate un momento para aprender a recorrer tu entorno.",
            },
          },
        },
      ],
    },
    {
      id: "look",
      objective: { type: "look", angle: Math.PI * 1.5 },
      objectiveText: {
        goal: {
          en: { T1: "Look around you.", T3: "Look all the way around you." },
          es: { T1: "Mira a tu alrededor.", T3: "Mira todo lo que te rodea." },
        },
        hintTouch: { en: "Slide your finger on the screen.", es: "Desliza el dedo por la pantalla." },
        hintMouse: { en: "Move the mouse.", es: "Mueve el mouse." },
      },
    },
    {
      id: "walk",
      objective: { type: "walk", distance: 12 },
      objectiveText: {
        goal: {
          en: { T1: "Walk {n} steps.", T3: "Walk {n} steps in any direction." },
          es: { T1: "Camina {n} pasos.", T3: "Camina {n} pasos en cualquier dirección." },
        },
        hintTouch: { en: "Push the circle on the left.", es: "Empuja el círculo de la izquierda." },
        hintMouse: { en: "Press W, A, S, or D.", es: "Presiona W, A, S o D." },
      },
    },
    {
      id: "wood",
      dialogue: [
        {
          id: "tutorial.wood",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "Good job! Printers needed wood. They made the press out of wood. Go get some wood from a tree.",
              T2: "Great work! Long ago, printers built their presses out of strong wood. Find a tree and collect some wood.",
              T3: "Well done. The first printing presses in Europe were built mostly from heavy timber, so a printer always needed a good supply of wood. Find a tree and gather some logs.",
              T4: "Well done. Early European printing presses were massive wooden frames assembled from heavy timber beams, so anyone establishing a workshop needed a dependable supply of wood. Locate a tree and gather some logs.",
            },
            es: {
              T1: "¡Muy bien! Los impresores necesitaban madera. Hacían la prensa de madera. Busca un árbol y consigue madera.",
              T2: "¡Excelente trabajo! Hace mucho tiempo, los impresores construían sus prensas con madera fuerte. Busca un árbol y recoge un poco de madera.",
              T3: "Bien hecho. Las primeras imprentas de Europa se construían principalmente con madera pesada, así que un impresor siempre necesitaba una buena reserva de madera. Busca un árbol y recoge algunos troncos.",
              T4: "Bien hecho. Las primeras prensas europeas eran enormes estructuras armadas con pesadas vigas de madera, por lo que cualquier persona que estableciera un taller necesitaba un suministro confiable de madera. Localiza un árbol y recoge algunos troncos.",
            },
          },
        },
      ],
      objective: { type: "collect", itemId: "wood_log", count: 3 },
      objectiveText: {
        goal: {
          en: { T1: "Get {n} logs from a tree.", T3: "Collect {n} logs from a tree trunk." },
          es: { T1: "Consigue {n} troncos de un árbol.", T3: "Corta {n} troncos de un árbol." },
        },
        hintTouch: {
          en: "Point the + at the trunk and tap ⛏. Then walk to the wood.",
          es: "Apunta la + al tronco y toca ⛏. Luego camina hacia la madera.",
        },
        hintMouse: {
          en: "Point the + at the trunk and click. Then walk to the wood.",
          es: "Apunta la + al tronco y haz clic. Luego camina hacia la madera.",
        },
      },
    },
    {
      id: "bag",
      bands: [...NOT_K2],
      dialogue: [
        {
          id: "tutorial.bag",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "You have wood! Now open your bag. You can make things in it.",
              T2: "You got the wood! Now open your bag. Inside, you can turn materials into new things.",
              T3: "Excellent. Raw logs are not very useful yet. Open your bag, where you can *craft* raw materials into useful parts.",
              T4: "Excellent. Raw logs must be shaped before they become useful. Open your bag, where you can *craft* raw materials into the components a workshop requires.",
            },
            es: {
              T1: "¡Tienes madera! Ahora abre tu bolsa. Ahí puedes hacer cosas.",
              T2: "¡Conseguiste la madera! Ahora abre tu bolsa. Adentro puedes convertir materiales en cosas nuevas.",
              T3: "Excelente. Los troncos todavía no son muy útiles. Abre tu bolsa, donde puedes *fabricar* piezas útiles con materiales en bruto.",
              T4: "Excelente. Los troncos deben trabajarse antes de ser útiles. Abre tu bolsa, donde puedes *fabricar* con materiales en bruto las piezas que necesita un taller.",
            },
          },
        },
      ],
      objective: { type: "open_inventory" },
      objectiveText: {
        goal: { en: "Open your bag.", es: "Abre tu bolsa." },
        hintTouch: { en: "Tap 🎒.", es: "Toca 🎒." },
        hintMouse: { en: "Press E.", es: "Presiona E." },
      },
    },
    {
      id: "planks",
      bands: [...NOT_K2],
      objective: { type: "craft", itemId: "wood_planks", count: 4 },
      objectiveText: {
        goal: {
          en: { T1: "Make wood boards.", T3: "Turn a log into planks." },
          es: { T1: "Haz tablas de madera.", T3: "Convierte un tronco en tablones." },
        },
        hintTouch: {
          en: "Tap a log, tap a crafting square, then tap the result.",
          es: "Toca un tronco, toca un cuadro de fabricar y luego toca el resultado.",
        },
        hintMouse: {
          en: "Click a log, click a crafting square, then click the result.",
          es: "Haz clic en un tronco, en un cuadro de fabricar y luego en el resultado.",
        },
      },
    },
    {
      id: "done",
      bands: [...NOT_K2],
      dialogue: [
        {
          id: "tutorial.done",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "You did it! You can look, walk, and make things. Now the story can begin.",
              T2: "You did it! You know how to look, walk, and make things. Now you are ready for the story of the printing press.",
              T3: "Well done, apprentice. You have learned to explore, gather, and craft. Now you are ready to discover how the *printing press* came to be.",
              T4: "Well done, apprentice. You have learned to explore, gather, and craft. You are now prepared to investigate how the *printing press* emerged, and why it mattered so much.",
            },
            es: {
              T1: "¡Lo lograste! Ya puedes mirar, caminar y hacer cosas. Ahora puede comenzar la historia.",
              T2: "¡Lo lograste! Ya sabes mirar, caminar y hacer cosas. Ahora puedes conocer la historia de la imprenta.",
              T3: "Bien hecho, aprendiz. Aprendiste a explorar, recoger y fabricar. Ahora puedes descubrir cómo nació la *imprenta*.",
              T4: "Bien hecho, aprendiz. Aprendiste a explorar, recoger y fabricar. Ahora puedes investigar cómo surgió la *imprenta* y por qué fue tan importante.",
            },
          },
        },
      ],
    },
    {
      id: "done-k2",
      bands: ["K-2"],
      dialogue: [
        {
          id: "tutorial.done-k2",
          speaker: JOURNAL,
          text: {
            en: {
              T1: "You did it! You can look, walk, and get wood. Now the story can begin.",
              T2: "You did it! You know how to look, walk, and collect wood. Now you are ready for the story of the printing press.",
            },
            es: {
              T1: "¡Lo lograste! Ya puedes mirar, caminar y conseguir madera. Ahora puede comenzar la historia.",
              T2: "¡Lo lograste! Ya sabes mirar, caminar y recoger madera. Ahora puedes conocer la historia de la imprenta.",
            },
          },
        },
      ],
    },
  ],
};
