# The Printing Press — Game Design (v2)

Status: proposal, pending approval before implementation.

## Decisions so far

| Question | Decision |
|---|---|
| Audience | K–12, with grade band and reading level set **independently** (mix and match) |
| Length | Multi-day unit, about one chapter per class period |
| Narrative | Hybrid: East Asian prologue → Mainz apprentice core → spread-of-print epilogue |
| Survival elements | Removed (combat, zombies, health, hunger, food, death screen) |
| Language | Full English and Spanish, including spoken audio |

---

## 1. The three dials

Each student session is configured with three independent settings. Because they are separate, a teacher can give a 7th grader reading at 550L the grade 6–8 version of the game with 400–700L text, in Spanish.

### Dial 1: Grade band → how complex the mechanics are

| Band | Design target |
|---|---|
| **K–2** | Guided, picture-supported, no failure states, one goal at a time, every line read aloud |
| **3–5** | Short multi-step tasks, simple counting and money, gentle mistakes with hints |
| **6–8** | Trade-offs, budgets, ratios, cause-and-effect choices, proofreading |
| **9–12** | Systems thinking, debt with interest, evidence-based arguments, consequential choices |

### Dial 2: Reading tier → how complex the text is

All narrative, dialogue, journal entries and instructions are written once per tier:

| Tier | Target Lexile range |
|---|---|
| T1 | BR–400L |
| T2 | 400L–700L |
| T3 | 700L–1000L |
| T4 | 1000L–1300L+ |

Tiers are written to target these ranges. Official Lexile measures come only from MetaMetrics' Lexile Analyzer, so the final text should be run through it, in both English and Spanish (MetaMetrics publishes Spanish Lexile measures).

Key vocabulary (e.g. *movable type / tipo móvil*, *matrix / matriz*, *press / prensa*) is the same in every tier. Lower tiers define each term the first time it appears, and higher tiers use it more densely.

### Dial 3: Language and audio

- **Language:** `en` or `es` for all on-screen text, with a per-line "hear it in the other language" button for English learners.
- **Audio:** every text line can be read aloud, with the current word highlighted. For K–2 audio is always on; for other bands it's a setting.
- **Glossary:** bilingual, with a picture and audio for each term.

---

## 2. Narrative (Hybrid)

The **Printer's Journal** is the thread that runs through the whole game. It's a book the player fills one page per chapter, and it becomes their portfolio and evidence file.

| Day | Chapter | Historical anchor | Core mechanic |
|---|---|---|---|
| 1 | 0. The Clay Sorts | Bi Sheng, c. 1040; Jikji, Korea, 1377 | Shape, bake and set clay type in a wax tray |
| 2 | 1. The Scriptorium | Hand-copied manuscripts | Copy a page against the clock; compare cost and time |
| 3 | 2. The Metal | Gutenberg's hand mould; lead–tin–antimony alloy | Smelting and casting type |
| 4 | 3. Ink & Paper | Oil-based ink; linen-rag paper | Gather materials, run the ink grinder and paper mill |
| 5 | 4. The Press | Screw press adapted from wine presses | Build the press; typesetting and printing |
| 6 | 5. The Indulgences | Gutenberg's printed indulgences, 1454–55 | Customer commissions; balance quality against speed |
| 7 | 6. The Bible & the Debt | 42-line Bible; Fust lawsuit, 1455 | Large print run under pressure from debt; the lawsuit decision |
| 8 | 7. The Scattering | Sack of Mainz, 1462; spread to more than 250 towns by 1500 | Map strategy: send printers out, trace the effects |

- **Chapter selection:** teachers can enable any subset of chapters. Each chapter starts with a short recap, so skipping one doesn't break the story.
- **Player character:** an apprentice the student names. The apprentice is never described with gendered terms; Spanish lines are written to avoid gendered agreement where possible, or use the student's chosen form.

---

## 3. Mechanics by grade band

Each mechanic is built once and given four difficulty profiles.

### Typesetting (the signature mechanic)

| Band | How it plays |
|---|---|
| K–2 | Match mirrored letter shapes to make 3–4 letter words, with picture support |
| 3–5 | Set a short line right to left and mirrored, add spaces, find a planted mistake |
| 6–8 | Set and justify several lines with spacers; proofread the printed sheet; the upper and lower case lesson |
| 9–12 | Set a full page with imposition; work out how many sorts a page needs (letter-frequency math); tension between errors and cost |

In Spanish mode the type case includes ñ, á, é, í, ó, ú and ü. Historically, Spanish printers did cast these sorts.

### Casting type

| Band | How it plays |
|---|---|
| K–2 | Pour-timing tap game |
| 3–5 | Pick the right metals from three choices |
| 6–8 | Mix the alloy by percentage; see the effect on hardness and melting point |
| 9–12 | Optimize the alloy under cost and supply limits; matrices wear out |

### Printing

| Band | How it plays |
|---|---|
| K–2 | Ink, place the paper, pull the lever (rhythm game) |
| 3–5 | Same, plus a quality meter (too little or too much ink) |
| 6–8 | Quality vs. speed for a quota |
| 9–12 | Full production planning across a multi-sheet run |

### Workshop economy (Chapters 5–6)

| Band | How it plays |
|---|---|
| K–2 | None; story beats only |
| 3–5 | Count coins earned from orders |
| 6–8 | Budget, expenses and a loan |
| 9–12 | Interest, the risk of defaulting, a branching lawsuit outcome, an "Who owns an invention?" argument |

### Spread map (Chapter 7)

| Band | How it plays |
|---|---|
| K–2 | Tap cities to light them up |
| 3–5 | Follow trade routes |
| 6–8 | Cause-and-effect chains (Reformation, science, news) |
| 9–12 | Document-based question: build a claim from primary-source cards |

### End-of-chapter journal checks

| Band | Format |
|---|---|
| K–2 | Picture sorting |
| 3–5 | Multiple choice with read-aloud |
| 6–8 | Sequencing and short constructed response |
| 9–12 | Claim–evidence–reasoning |

---

## 4. Teacher controls (no server required)

**Teacher setup screen**, PIN-protected:
- grade band
- reading tier
- language
- audio default
- which chapters are enabled

**Shareable group links**, so different groups get different versions without anyone touching student devices. For example:

```
?band=6-8&tier=T2&lang=es&audio=on&chapters=2,3,4,5
```

**Student profiles:** the student enters a name on first launch. Progress and journal answers are saved locally (`localStorage`), per profile, so shared Chromebooks work.

**Reporting (later phase):** export the journal as a printable PDF and a progress code or CSV the teacher can collect.

---

## 5. Audio strategy

All text is stored as content IDs:

```
chapter4.press.intro × {T1..T4} × {en, es}
```

The audio service resolves each ID in this order:

1. **Pre-generated audio file**, if one exists (`/audio/es/T2/chapter4.press.intro.mp3`). These are produced by a build script using a TTS service, so voices sound the same on every device.
2. **Browser speech synthesis** (`speechSynthesis` with an `es-US`, `es-MX` or `es-ES` voice) as a fallback. It works immediately at no cost, but voice quality and availability vary by device.

This means audio works from day one through the fallback, and quality improves as recorded or generated files are added. Spanish text should be written in parallel per tier, not translated line by line, and reviewed by a native speaker.

---

## 6. Engineering plan

### Phase 1: Foundation
- Strip out the survival systems.
- Rebrand.
- Content and localization system (IDs × tier × language).
- Settings and teacher config, including URL parameters.
- Student profiles and saving.
- Audio service with word highlighting.
- Dialogue overlay and objective tracker.

### Phase 2: Vertical slice
- Data-driven recipes and workstations.
- NPC entity.
- Hand-built workshop structure.
- **Chapter 4 (The Press): typesetting and printing**, fully playable in all 4 bands × 4 tiers × 2 languages.

### Phase 3: Remaining chapters
- Chapters 0–3 and 5–7.
- Journal checks.
- Glossary.

### Phase 4: Teacher tools
- Journal PDF export.
- Progress export.
- Pre-generated audio files.

### Refactors this requires
- Split `GameCanvas.tsx` (1,706 lines) into world, player, interaction and entity modules.
- Replace the hard-coded crafting chain in `utils/items.ts` with recipe data.
- Remove `MobType.ZOMBIE`, `SKELETON` and the combat paths.
- Remove health and hunger from `App.tsx` and `HUD.tsx`.

---

## 7. Implementation status

### Phase 1: Foundation (done)

| Area | Where |
|---|---|
| Survival removed: combat, zombies, health, hunger, food, death screen, night | `GameCanvas.tsx`, `items.ts`, `mobs.ts` |
| Three dials (band, reading tier, language) plus audio | `settings/settings.ts`, `AppContext.tsx` |
| Tiered bilingual content, with fallback to the nearest written tier | `i18n/types.ts`, `content/` |
| Teacher panel (PIN), chapter toggles, group links | `components/TeacherPanel.tsx` |
| Student profiles and saved progress (`localStorage`) | `save/` |
| Read-aloud with word highlighting; Latin American voices preferred | `audio/narrator.ts` |
| Dialogue box, goal tracker, and a quest engine with band-specific steps | `game/quest.ts`, `components/` |
| Touch controls: joystick, drag to look, buttons | `components/TouchControls.tsx`, `game/input.ts` |
| Tutorial chapter, playable in every band × tier × language | `content/tutorial.ts` |

### Device support

- **Touch mode** is used on any touch-capable device (iPad, touchscreen Chromebooks). Keyboard movement still works, so an iPad with a keyboard case gets both.
- **Mouse mode** is used on desktops (pointer lock).
- Either mode can be forced with `?controls=touch` or `?controls=mouse`.

### Audio files

To add recorded or generated audio:
1. Place each file at `public/audio/<lang>/<tier>/<contentId>.mp3`.
2. List it in `public/audio/manifest.json` as `"<lang>/<tier>/<contentId>"`.

Unlisted lines fall back to the device's speech voice.

### Group link parameters

| Parameter | Values |
|---|---|
| `band` | `K-2`, `3-5`, `6-8`, `9-12` |
| `tier` | `T1`–`T4` |
| `lang` | `en`, `es` |
| `audio` | `on`, `off` |
| `switch` | `on`, `off` (whether students may change language) |
| `chapters` | comma-separated numbers, e.g. `2,3,4` |
