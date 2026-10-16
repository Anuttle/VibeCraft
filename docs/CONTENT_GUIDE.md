# Content guide: writing a chapter

A chapter is a TypeScript data file in `src/content/chapters/<id>.ts`. It exports one `Chapter` (see `src/game/quest.ts`). `src/content/press.ts` (Chapter 4) is the reference example.

Check a chapter with:

```
npx tsx scripts/validate-content.ts src/content/chapters/<id>.ts
npx tsc --noEmit
```

## 1. The three dials

| Dial | Values | What it changes |
|---|---|---|
| Grade band | `K-2`, `3-5`, `6-8`, `9-12` | Activity difficulty, journal questions, which steps appear (`bands` on a step) |
| Reading tier | `T1`–`T4` | Dialogue and goal text (`Tiered` values) |
| Language | `en`, `es` | Everything a student sees or hears |

- **Tiers are independent of bands.** A 6–8 student may read at T1, so every story line needs all four tiers, written so any band can follow it.
- **Activity configs and journal questions are not tiered.** They are written per band, in plain language for that age, in both languages.

### Reading tiers

| Tier | Lexile target | Style |
|---|---|---|
| T1 | BR–400L | 3–8 word sentences, everyday words, one idea each, present tense where possible |
| T2 | 400–700L | 8–14 word sentences, simple compounds, a little domain vocabulary |
| T3 | 700–1000L | Longer sentences, some subordinate clauses, domain vocabulary explained in context |
| T4 | 1000–1300L+ | Complex sentences, academic vocabulary, cause and consequence |

- Wrap key vocabulary in `*asterisks*` the first time it appears in a line; it shows in bold and links to the glossary.
- Only mark terms that have glossary entries (`src/content/glossary.ts`).

## 2. Spanish

- **Latin American, neutral.** Use *tú* for the player, *ustedes* for plural. Prefer *jalar*, *computadora*, *carro*.
- **Write each tier in parallel. Don't translate line by line.** The Spanish T1 must be just as easy as the English T1.
- **No gendered forms for the player.** The apprentice can be any gender.
  - Use *Te damos la bienvenida* or *Te doy la bienvenida*, never *Bienvenido* or *Bienvenida*.
  - Use *aprendiz* without an article, or rephrase.
  - Avoid adjectives that agree with the player: no *listo/lista* or *cansado/cansada*.
- Accents and ñ are required (*más*, *página*, *año*). The validator rejects text with no accents at all in long Spanish lines.

## 3. Historical accuracy

- **Hedge only what is uncertain.** State well-established facts plainly. Hedge what historians debate with "about", "around", "historians think" / "alrededor de", "los historiadores creen".
- **Invented speech isn't quotation.** Historical figures speak lines written for teaching. Never present them as quotations.
- **No invented specifics.** Don't make up specific prices, quotes or events. Amounts in ledger activities are game coins unless they come from a source noted in a comment.
- **Reviewer notes:** put a "Historical notes for reviewers" comment at the top of each chapter file listing the claims made and how confident they are.
- **Keep characters to their roles:**
  - Fictional characters (Brother Konrad, Marta) represent typical people of the time.
  - Real people (Bi Sheng, Gutenberg, Fust, Paulinus Chappe, Ulrich Zell) say only things consistent with what's known about them.

## 4. Chapter structure

- **Steps** run in order. Each has optional `dialogue` lines (spoken one at a time), then an optional `objective`. `bands` limits a step to some grade bands.
- **Objectives:**
  - `talk` (walk up to a character; `npcId`)
  - `station` (use a station; `station` is a key of `activities`)
  - `journal` (the end-of-chapter check; opens by itself)
  - `walk`, `collect`, `craft`, `look`, `open_inventory` (exploring)
- **Every objective needs `objectiveText`:**
  - `goal`: tiered at least T1 and T3, both languages
  - `hintTouch`: e.g. "Walk to the kiln and tap ✋." / "Camina al horno y toca ✋."
  - `hintMouse`: e.g. "Walk to the kiln and press F." / "Camina al horno y presiona F."
  - Characters use 💬 instead of ✋.
- **Every chapter ends** with a closing dialogue step, then a step with `objective: { type: "journal" }`.
- **World and stations:** the chapter's `world` comes from `src/game/world.ts` (for example `CLAY_WORLD`). Its station ids are fixed there; `activities` must have exactly those keys.
- **Dialogue ids:** each dialogue line needs a unique `id` like `"clay.intro"`. Audio files are named after these ids.

## 5. Activities (`src/game/activities.ts`)

Every activity is configured for all four bands, and in both languages where it has text (`PerBandLang`).

| Kind | Purpose | Band scaling idea |
|---|---|---|
| `typeset` | Set mirrored sorts in order | Shorter text and big hints for K–2; case split, justification and proofreading for older bands |
| `press` | Ink, place paper, pull the bar | More sheets and tighter zones for older bands |
| `mix` | Pick ingredients (`correct`) or set percentages (`targets`) | Pick mode for K–2 and 3–5; ratio mode for 6–8 and 9–12 |
| `sequence` | Put steps or events in order | 3 steps for K–2 up to 6–7 for 9–12 |
| `hold` | Hold, then let go in a zone | K–2: `zone: null` (can't fail); zone width/rate set the reaction window: (hi − lo) / rate seconds. Keep it at least 0.6 s for 3–5, 0.33 s for 6–8 and 0.23 s for 9–12. |
| `carve` | Pick the mirror-image carving of a glyph | 2 options for K–2 up to 4 for 9–12 |
| `copy` | Copy text by hand against a timer | One word for K–2 up to two lines for 9–12 |
| `map` | Tap cities (`tap`) or tap them in date order (`order`) | `tap` for K–2 and 3–5; `order` for 6–8 and 9–12 |
| `quiz` | Questions: `choice`, `number`, `order`, `write`, `evidence` | See the journal checks below |

### Journal checks (`journal`)

| Band | What it asks |
|---|---|
| K–2 | 2–3 `choice` items with an emoji on every option, 2–3 options each |
| 3–5 | 3 `choice` items, 3 options each |
| 6–8 | 2 `choice`, 1 `order`, 1 `write` (with sentence starters) |
| 9–12 | 1–2 `choice` or `number`, 1 `evidence` (claim + 2 evidence + reasoning) |

- Every `choice` has an `explain` that teaches, whether the student was right or wrong.
- **Distractors** are plausible misconceptions (e.g. "Gutenberg invented the first printing"). They aren't joke answers.
