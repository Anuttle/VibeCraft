# The Printing Press: Teacher Guide

A game in English and Latin American Spanish about how printing changed the world, from Bi Sheng's clay type in China to the first press in the Americas.

The game runs in a web browser. It's built for iPads, and also works on Chromebooks, laptops and desktops.

## Chapters

Each chapter takes about one class period. Turn on only the chapters you want to use.

| # | Chapter | Students… |
|---|---|---|
| — | Getting Started | learn to move, gather and craft (no history) |
| 0 | The Clay Type | carve mirror-image characters, bake clay type, set it in an iron frame |
| 1 | The Scriptorium | copy a text by hand against the clock, and estimate how long a whole book takes |
| 2 | The Metal | choose the metals for type, pour type in a hand mould |
| 3 | Ink & Paper | mix printer's ink, make paper step by step, press water out of the sheets |
| 4 | The Press | set type (backwards!) and print pages |
| 5 | The Indulgences | print forms for a customer and keep the accounts |
| 6 | The Bible & the Debt | print Bible pages, work out Gutenberg's loan, argue who should own the business |
| 7 | The Spread of Printing | follow printing across Europe and to Mexico City, and connect it to the Reformation, science and news |

Every chapter ends with a journal check. The game saves the answers.

## The three settings: mix and match for each group

Open **Teacher** (top right), then enter your PIN. The first time, you create a 4-digit PIN.

| Setting | What it changes | Options |
|---|---|---|
| **Grade band** | How hard the activities and questions are | K–2, 3–5, 6–8, 9–12 |
| **Reading level** | How hard the story text is | T1 (BR–400L), T2 (400–700L), T3 (700–1000L), T4 (1000–1300L+) |
| **Language** | Starting language, and whether students may switch | English / Español |

These settings are separate. For example, a 7th grader reading at 550L can play the 6–8 activities with T2 text, in Spanish.

The Lexile ranges are targets the text was written toward. Official Lexile measures need the MetaMetrics Lexile Analyzer.

**Read aloud** reads every line with each word highlighted. Students can hear any line in the other language too. It is always on for K–2.

### Group links

The teacher panel builds a **group link** from the settings you choose. Opening that link on a student device applies those settings and remembers them. Make one link per group, for example:

```
…/?band=6-8&tier=T2&lang=es&chapters=0,1,2
```

## Setting up iPads

1. **Open the game link in Safari**, then tap Share → **Add to Home Screen**. The game then opens full screen, like an app.
2. **Check the Spanish voice.** Go to Settings → Accessibility → Spoken Content → Voices → Spanish → **Spanish (Mexico)**. Download an "Enhanced" voice for better sound. The teacher panel warns you if a device has no voice for a language.
3. **Turn the volume up.** Students can use headphones.

Touch controls:

| Control | What it does |
|---|---|
| Joystick (left) | Walk |
| Drag on the screen | Look around |
| ✋ / 💬 button | Use a station or talk to a character |
| ⛏ / 🧱 buttons | Break (hold ⛏ down) or place blocks |
| ⬆ | Jump |
| 🎒 | Open the bag. **Take: All / Half / One** sets how much each tap moves, so stacks can be split |

With a keyboard, the controls are W A S D to walk, the mouse to look, F to use or talk, E for the bag and Esc to pause.

On an iPad with a trackpad or mouse, drag to look around, hold the click to break a block, and right-click (two-finger click) to place one.

## Students and progress

- **Saving:** students type their first name on the title screen. Progress and journal answers save **on that device** (no accounts, nothing is sent anywhere).
- **Journal:** students can reread their answers under **Journal**, and print them there.
- **Glossary:** every bold word in the story opens a picture card with both languages and audio. The full word list is under **Journal → Glossary**, and in the pause menu.

### Collecting results

On each device, open **Teacher**, then go to **Class progress on this device**:

| Button | What you get |
|---|---|
| **Download summary (CSV)** | One row per student: each chapter's status and journal score |
| **Download journal answers (CSV)** | One row per answer, including written responses |
| **Print class report** | A one-page table |
| **Print journal** (next to a student) | That student's journal, ready to print or save as PDF |

On an iPad, a download opens the share sheet. Save it to Files or send it to yourself. Open the CSV files in Google Sheets, Excel or Numbers, and paste the files from different iPads together.

**Delete all student progress** (in the teacher panel) clears every name and answer on that device. You'll be asked to confirm, and it can't be undone.

## Recorded audio (optional)

When there's no recording, the game uses the device's built-in voice. To use human recordings instead:

1. **Make the recording sheets** with `npm run audio -- script`. This creates `audio-scripts/en.csv` and `audio-scripts/es.csv`. Each row has the exact text to read and the file name to save it as.
2. **Record the lines.** Save each one as MP3, M4A or WAV at the path listed in the sheet, for example `public/audio/es/T2/press.intro.mp3`.
3. **Register the files** with `npm run audio -- manifest`, then rebuild.

You can record only some of the lines; everything else falls back to the device voice.

### Generated voices

To generate the files automatically with Google Gemini text-to-speech, run `GEMINI_API_KEY=… npm run audio -- gemini --lang es`.

- Check Google's current model and voice names first, and listen to a sample before generating everything.
- Always have a Spanish speaker review generated audio.

## Putting the game online

The game is a set of static files. It needs no server or database.

### GitHub Pages

The repository includes a workflow that publishes `main`:

1. In GitHub, go to repository **Settings → Pages → Source** and choose **GitHub Actions**.
2. Merge to `main`. The game appears at `https://<your-account>.github.io/<repository>/`.

### Anywhere else

Run `npm install`, then `npm run build`, then copy the `dist` folder to any web host. It also works from a school server or a shared drive opened in a browser.

## Before you teach

- **Spanish review:** a native speaker should review the Spanish text.
- **Lexile check:** run the text through the Lexile Analyzer if you need official measures.
- **Historical notes:** each chapter file in `src/content/` begins with notes for reviewers that list its historical claims and how certain they are.
- **Real people:** characters' lines are written for teaching; they aren't quotations.
- **Money in the game:** in the account-book activities, amounts are game coins. Fust's loan figures (800 + 800 guilders, a claim of about 2,026) are the commonly cited historical numbers.
