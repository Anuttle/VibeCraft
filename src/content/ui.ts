import { UiText } from "../i18n/types";

// Interface text (buttons, labels). Kept short and identical across reading
// tiers so the interface stays familiar; story text lives in the chapter files.
// Spanish is Latin American and avoids gendered forms where possible.

export const UI = {
  gameTitle: { en: "The Printing Press", es: "La imprenta" },
  gameSubtitle: {
    en: "How printed books changed the world",
    es: "Cómo los libros impresos cambiaron el mundo",
  },
  whoIsPlaying: { en: "Who is playing?", es: "¿Quién va a jugar?" },
  addName: { en: "Add my name", es: "Agregar mi nombre" },
  typeName: { en: "Type your first name", es: "Escribe tu nombre" },
  start: { en: "Start", es: "Comenzar" },
  back: { en: "Back", es: "Atrás" },
  teacher: { en: "Teacher", es: "Docente" },
  language: { en: "Language", es: "Idioma" },
  english: { en: "English", es: "Inglés" },
  spanish: { en: "Spanish", es: "Español" },
  hello: { en: "Hi, {name}!", es: "¡Hola, {name}!" },

  chooseChapter: { en: "Choose a chapter", es: "Elige un capítulo" },
  comingSoon: { en: "Coming soon", es: "Próximamente" },
  completed: { en: "Completed", es: "Completado" },
  play: { en: "Play", es: "Jugar" },
  continue: { en: "Continue", es: "Continuar" },
  playAgain: { en: "Play again", es: "Jugar otra vez" },
  chapterN: { en: "Chapter {n}", es: "Capítulo {n}" },
  switchProfile: { en: "Switch profile", es: "Cambiar de perfil" },

  next: { en: "Next", es: "Siguiente" },
  listen: { en: "Listen", es: "Escuchar" },
  hearOther: { en: "En español", es: "In English" },
  goal: { en: "Goal", es: "Meta" },

  paused: { en: "Paused", es: "En pausa" },
  resume: { en: "Resume", es: "Seguir jugando" },
  clickToPlay: { en: "Click to play", es: "Haz clic para jugar" },
  safeSpot: { en: "Move to a safe spot", es: "Ir a un lugar seguro" },
  readAloud: { en: "Read aloud", es: "Leer en voz alta" },
  on: { en: "On", es: "Sí" },
  off: { en: "Off", es: "No" },
  chapters: { en: "Chapters", es: "Capítulos" },

  chapterComplete: { en: "Chapter complete!", es: "¡Capítulo completado!" },
  keepExploring: { en: "Keep exploring", es: "Seguir explorando" },
  backToChapters: { en: "Back to chapters", es: "Volver a los capítulos" },

  jump: { en: "Jump", es: "Saltar" },
  breakBlock: { en: "Break", es: "Romper" },
  placeBlock: { en: "Place", es: "Colocar" },
  bag: { en: "Bag", es: "Bolsa" },
  pause: { en: "Pause", es: "Pausa" },
  hand: { en: "Hand", es: "Mano" },

  controls: { en: "Controls", es: "Controles" },
  ctrlMove: { en: "Move", es: "Moverse" },
  ctrlLook: { en: "Look", es: "Mirar" },
  ctrlBreak: { en: "Break (hold)", es: "Romper (mantener)" },
  ctrlPlace: { en: "Place / use", es: "Colocar / usar" },
  ctrlBag: { en: "Bag", es: "Bolsa" },
  ctrlPause: { en: "Pause", es: "Pausa" },
  keyMouse: { en: "Mouse", es: "Mouse" },
  keyLeftClick: { en: "Left click", es: "Clic izquierdo" },
  keyRightClick: { en: "Right click", es: "Clic derecho" },

  bagTitle: { en: "Bag", es: "Bolsa" },
  craftingTableTitle: { en: "Crafting table", es: "Mesa de trabajo" },
  craft: { en: "Crafting", es: "Fabricar" },
  result: { en: "Result", es: "Resultado" },
  recipes: { en: "Recipes", es: "Recetas" },
  recipeTable: { en: "4 planks → crafting table", es: "4 tablones → mesa de trabajo" },
  recipePlanks: { en: "1 log → 4 planks", es: "1 tronco → 4 tablones" },
  recipeSticks: { en: "2 planks → 4 sticks", es: "2 tablones → 4 palos" },
  recipePick: { en: "3 planks + 2 sticks → pickaxe", es: "3 tablones + 2 palos → pico" },
  recipeTorch: { en: "1 coal + 1 stick → 4 torches", es: "1 carbón + 1 palo → 4 antorchas" },
  bagSection: { en: "Bag", es: "Bolsa" },
  hotbarSection: { en: "Hotbar", es: "Barra rápida" },
  take: { en: "Take", es: "Tomar" },
  takeAll: { en: "All", es: "Todo" },
  takeHalf: { en: "Half", es: "Mitad" },
  takeOne: { en: "One", es: "Uno" },
  tapItem: {
    en: "Tap an item to pick it up. Choose One to put items down one at a time.",
    es: "Toca un objeto para tomarlo. Elige «Uno» para soltarlos de uno en uno.",
  },
  drop: { en: "Drop {n}", es: "Soltar {n}" },
  dropSlot: { en: "Drop", es: "Soltar" },
  close: { en: "Close", es: "Cerrar" },

  teacherSettings: { en: "Teacher settings", es: "Ajustes docentes" },
  enterPin: { en: "Enter the teacher PIN", es: "Escribe el PIN docente" },
  createPin: { en: "Create a 4-digit teacher PIN", es: "Crea un PIN docente de 4 dígitos" },
  pinNote: {
    en: "The PIN keeps students out of these settings on this device. It is not a password.",
    es: "El PIN evita que los estudiantes cambien estos ajustes en este dispositivo. No es una contraseña.",
  },
  wrongPin: { en: "That PIN is not right.", es: "Ese PIN no es correcto." },
  pinFourDigits: { en: "The PIN must be 4 digits.", es: "El PIN debe tener 4 dígitos." },
  easyPin: {
    en: "That PIN is easy to guess. Choose one that isn't a run (1234), a repeat (1111) or a pair (1212).",
    es: "Ese PIN es fácil de adivinar. Elige uno que no sea una serie (1234), un número repetido (1111) ni un par (1212).",
  },
  easyPinWarning: {
    en: "This device's PIN is easy for students to guess. Change it to keep them out of these settings.",
    es: "El PIN de este dispositivo es fácil de adivinar para los estudiantes. Cámbialo para que no entren a estos ajustes.",
  },
  pinLocked: {
    en: "Too many wrong tries. Wait {n} seconds and try again.",
    es: "Demasiados intentos incorrectos. Espera {n} segundos y vuelve a intentarlo.",
  },
  unlock: { en: "Unlock", es: "Abrir" },
  gradeBand: { en: "Grade band: how hard the game is", es: "Nivel de grado: dificultad del juego" },
  readingLevel: { en: "Reading level: how hard the text is", es: "Nivel de lectura: dificultad del texto" },
  lexileNote: {
    en: "Text is written toward these Lexile ranges. Official measures require the MetaMetrics Lexile Analyzer.",
    es: "Los textos están escritos para estos rangos Lexile. Las medidas oficiales requieren el Lexile Analyzer de MetaMetrics.",
  },
  startingLanguage: { en: "Starting language", es: "Idioma inicial" },
  allowSwitch: { en: "Students can switch language", es: "Se puede cambiar de idioma" },
  audioDefault: { en: "Read text aloud", es: "Leer el texto en voz alta" },
  k2AudioNote: { en: "Always on for K–2.", es: "Siempre activado en K–2." },
  chaptersEnabled: { en: "Chapters students can play", es: "Capítulos disponibles" },
  groupLink: { en: "Group link", es: "Enlace de grupo" },
  groupLinkNote: {
    en: "Open this link on a student device to apply these settings. Make one link per group.",
    es: "Abre este enlace en el dispositivo de un estudiante para aplicar estos ajustes. Crea un enlace por grupo.",
  },
  copy: { en: "Copy", es: "Copiar" },
  copied: { en: "Copied!", es: "¡Copiado!" },
  save: { en: "Save", es: "Guardar" },
  studentData: { en: "Student data on this device", es: "Datos de estudiantes en este dispositivo" },
  clearData: { en: "Delete all student progress", es: "Borrar todo el progreso" },
  confirmClear: {
    en: "Delete every student name and all progress on this device?",
    es: "¿Borrar todos los nombres y el progreso en este dispositivo?",
  },
  changePin: { en: "Change PIN", es: "Cambiar PIN" },
  voiceMissing: {
    en: "This device has no {lang} voice installed, so read-aloud will be silent in {lang}.",
    es: "Este dispositivo no tiene una voz en {lang}, así que la lectura en voz alta no funcionará en {lang}.",
  },
  langNameEn: { en: "English", es: "inglés" },
  langNameEs: { en: "Spanish", es: "español" },

  // Using stations and talking to characters
  talkTo: { en: "Talk to {name}", es: "Hablar con {name}" },
  useThing: { en: "Use {thing}", es: "Usar {thing}" },

  // Typesetting
  tsTitle: { en: "Type case", es: "Caja de tipos" },
  tsCopy: { en: "Set this text", es: "Compón este texto" },
  tsStick: { en: "Composing stick (the type, backwards)", es: "Componedor (los tipos, al revés)" },
  tsPreview: { en: "How it will print", es: "Así se imprimirá" },
  tsHowK2: {
    en: "Tap the letters to spell the word. Metal letters are backwards!",
    es: "Toca las letras para formar la palabra. ¡Las letras de metal están al revés!",
  },
  tsHow: {
    en: "Tap the sorts in order. Each metal letter is backwards, so the page will print the right way.",
    es: "Toca los tipos en orden. Cada letra de metal está al revés, para que la página se imprima al derecho.",
  },
  upperCase: { en: "Upper case · capital letters", es: "Caja alta · mayúsculas" },
  lowerCase: { en: "Lower case · small letters", es: "Caja baja · minúsculas" },
  tray: { en: "Type case", es: "Caja de tipos" },
  space: { en: "Space", es: "Espacio" },
  tsWrong: { en: "Not that one. Look again!", es: "Ese no. ¡Mira otra vez!" },
  tsJustify: {
    en: "Fill the line: tap + to add spaces between words until the line is full.",
    es: "Llena la línea: toca + para agregar espacios entre las palabras hasta completarla.",
  },
  tsEven: { en: "Spread the spaces more evenly.", es: "Reparte los espacios de forma más pareja." },
  lineCount: { en: "Line {n}: {len} / {width}", es: "Línea {n}: {len} / {width}" },
  lineDone: { en: "Line full!", es: "¡Línea llena!" },
  proofTitle: { en: "Proofreading", es: "Corrección de pruebas" },
  proofHow: {
    en: "Someone else set this line and made one mistake. Tap the wrong letter.",
    es: "Otra persona compuso esta línea y cometió un error. Toca la letra equivocada.",
  },
  proofFound: { en: "You found it! Good eye.", es: "¡Lo encontraste! Buen ojo." },
  proofNo: { en: "That letter is right. Keep looking.", es: "Esa letra está bien. Sigue buscando." },
  tsDone: { en: "The type is ready for the press!", es: "¡Los tipos están listos para la prensa!" },
  finish: { en: "Finish", es: "Terminar" },

  // Printing
  pressTitle: { en: "Printing press", es: "La prensa" },
  pressInk: {
    en: "1. Ink the type: tap the ink balls. Stop when the ink is in the green zone.",
    es: "1. Pon tinta en los tipos: toca las balas de tinta. Detente cuando la tinta esté en la zona verde.",
  },
  pressInkK2: { en: "1. Tap the ink balls until the type is full of ink.", es: "1. Toca las balas de tinta hasta llenar los tipos de tinta." },
  pressPaper: { en: "2. Put a damp sheet of paper on the press.", es: "2. Coloca una hoja de papel húmeda en la prensa." },
  pressPull: {
    en: "3. Hold the bar to pull. Let go when the pressure is in the green zone.",
    es: "3. Mantén presionada la barra para jalar. Suéltala cuando la presión esté en la zona verde.",
  },
  pressPullK2: { en: "3. Hold the bar until the meter is full.", es: "3. Mantén presionada la barra hasta llenar el medidor." },
  ink: { en: "Ink", es: "Tinta" },
  pressure: { en: "Pressure", es: "Presión" },
  dabInk: { en: "Dab ink", es: "Entintar" },
  doneInking: { en: "Done inking", es: "Listo con la tinta" },
  placePaper: { en: "Place paper", es: "Colocar papel" },
  holdToPull: { en: "Hold to pull", es: "Mantén para jalar" },
  resultGood: { en: "A clean, sharp page!", es: "¡Una página limpia y nítida!" },
  resultFaint: { en: "Too faint. Use more ink.", es: "Muy clara. Usa más tinta." },
  resultBlotchy: { en: "Too much ink. It's blotchy.", es: "Demasiada tinta. Quedó manchada." },
  resultLight: { en: "Too light. Pull a little longer.", es: "Muy suave. Jala un poco más." },
  resultSmudged: { en: "Too hard! The page smudged.", es: "¡Demasiada fuerza! La página se corrió." },
  goodSheets: { en: "Good pages: {n} / {total}", es: "Páginas buenas: {n} / {total}" },
  printAnother: { en: "Print another page", es: "Imprimir otra página" },
  timer: { en: "Time: {s} s", es: "Tiempo: {s} s" },
  printedIn: { en: "You printed {n} pages in {s} seconds.", es: "Imprimiste {n} páginas en {s} segundos." },

  // Mix
  checkMix: { en: "Check the mix", es: "Revisar la mezcla" },
  mixTotal: { en: "Total: {n}%", es: "Total: {n} %" },
  mixMustTotal: { en: "The parts must add up to 100%.", es: "Las partes deben sumar 100 %." },
  tapToChoose: { en: "Tap to choose", es: "Toca para elegir" },

  // Sequence and ordering
  yourOrder: { en: "Your order", es: "Tu orden" },
  notYet: { en: "Not yet. What comes next?", es: "Todavía no. ¿Qué sigue?" },

  // Hold
  roundsDone: { en: "Done: {n} / {total}", es: "Listos: {n} / {total}" },
  again: { en: "Again", es: "Otra vez" },

  // Carve
  carveWhich: { en: "Which carving will print this?", es: "¿Qué tallado imprimirá esto?" },
  carvePrints: { en: "On the page", es: "En la página" },
  carveWrong: {
    en: "That one would print backwards or upside down.",
    es: "Ese se imprimiría al revés o de cabeza.",
  },
  carveRight: { en: "Yes! The mirror image prints the right way.", es: "¡Sí! La imagen de espejo se imprime al derecho." },

  // Copy
  copyThis: { en: "Copy this by hand", es: "Copia esto a mano" },
  yourCopy: { en: "Your copy", es: "Tu copia" },

  // Map
  citiesReached: { en: "Cities: {n} / {total}", es: "Ciudades: {n} / {total}" },
  mapWrong: {
    en: "Not yet. Which of these cities got printing earlier?",
    es: "Todavía no. ¿Cuál de estas ciudades tuvo imprenta antes?",
  },
  mapHint: { en: "Hint: printing spread outward from Mainz.", es: "Pista: la imprenta se extendió desde Maguncia." },

  // Quiz and journal
  check: { en: "Check", es: "Revisar" },
  correct: { en: "Correct!", es: "¡Correcto!" },
  notQuite: { en: "Not quite.", es: "No exactamente." },
  typeAnswer: { en: "Type your answer", es: "Escribe tu respuesta" },
  writeMore: { en: "Write a little more (at least 3 words).", es: "Escribe un poco más (al menos 3 palabras)." },
  starters: { en: "Need help starting?", es: "¿Necesitas ayuda para empezar?" },
  pickClaim: { en: "1. Choose the claim you think is best supported.", es: "1. Elige la afirmación que crees que tiene mejor apoyo." },
  pickEvidence: { en: "2. Choose {n} pieces of evidence that support your claim.", es: "2. Elige {n} evidencias que apoyen tu afirmación." },
  writeReasoning: { en: "3. Explain how your evidence supports your claim.", es: "3. Explica cómo tu evidencia apoya tu afirmación." },
  evidenceMismatch: {
    en: "At least one piece of evidence doesn't support your claim. Look again.",
    es: "Al menos una evidencia no apoya tu afirmación. Revisa otra vez.",
  },
  evidenceGood: { en: "Your evidence supports your claim.", es: "Tu evidencia apoya tu afirmación." },
  quizDone: { en: "Journal entry saved!", es: "¡Entrada del diario guardada!" },
  done: { en: "Done!", es: "¡Listo!" },
  score: { en: "You got {n} of {total} right.", es: "Acertaste {n} de {total}." },
  journalCheck: { en: "Journal check", es: "Revisión del diario" },
  journal: { en: "Journal", es: "Diario" },
  journalTitle: { en: "Printer's Journal", es: "Diario del impresor" },
  journalEmpty: {
    en: "No entries yet. Finish a chapter to add one.",
    es: "Todavía no hay entradas. Termina un capítulo para agregar una.",
  },
  glossary: { en: "Glossary", es: "Glosario" },
  search: { en: "Search", es: "Buscar" },
  noMatches: { en: "No matching words.", es: "No hay palabras que coincidan." },

  // Teacher tools
  printJournal: { en: "Print journal", es: "Imprimir diario" },
  printedOn: { en: "Printed {date}", es: "Impreso el {date}" },
  classProgress: { en: "Class progress on this device", es: "Progreso de la clase en este dispositivo" },
  classProgressNote: {
    en: "Each device keeps its own students. Download the files on each iPad and combine them in a spreadsheet.",
    es: "Cada dispositivo guarda a sus propios estudiantes. Descarga los archivos en cada iPad y combínalos en una hoja de cálculo.",
  },
  downloadSummary: { en: "Download summary (CSV)", es: "Descargar resumen (CSV)" },
  downloadAnswers: { en: "Download journal answers (CSV)", es: "Descargar respuestas del diario (CSV)" },
  printReport: { en: "Print class report", es: "Imprimir informe de la clase" },
  noStudents: { en: "No students on this device yet.", es: "Todavía no hay estudiantes en este dispositivo." },
  student: { en: "Student", es: "Estudiante" },
  chaptersDone: { en: "Chapters done", es: "Capítulos completados" },
  printKey: {
    en: "✓ completed · … in progress · numbers = journal check score",
    es: "✓ completado · … en curso · números = puntaje de la revisión del diario",
  },
} satisfies Record<string, UiText>;

export type UiKey = keyof typeof UI;
