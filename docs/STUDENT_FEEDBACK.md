# Student Feedback: Bugs and Feature Requests

Feedback from students who played the game. More is expected: the first student plans to send more later, so add new items under the matching heading.

## Bugs

### iPad

- Every block breaks instantly.
- Double-tapping the screen zooms in, and you can't zoom back out.
- There's no way to split item stacks, so students can't finish onboarding or craft sticks.

### Iron frame and journal questions

- In the iron frame, the wrong symbol is sometimes the correct option, or the symbol you're supposed to click isn't there.
- The journal button overlaps the other button if you close the questions with the X.
- Closing the questions with the X resets your progress.
- The correct answer is always in the same place. (This was flagged as a bug in case the progress reset is intentional.)

### Controls

- There's no mouse or trackpad support. WASD works, but clicking does nothing.
- You can't look straight up or down; the camera stops just short.

### Gameplay

- Animals can't be hit at all.
- Water is solid, which is confusing.
- Anything can be broken instantly with a bare fist, without the right tool. (This could also be a design issue.)

### Other

- The teacher PIN is 1234. (This is more a security or design concern than a bug.)

## Feature requests

### Survival and combat

- A health system, including fall damage from cliffs.
- A hunger system.
- A combat system: attacking pigs and other animals, plus weapons to use against something.
- Possibly enemies. (One student isn't sure enemies fit the game's purpose.)
- Hunting and being hunted, so gathering has a point.

### Visuals and interface

- Textures for every item and block, instead of plain colors or emoji.
- A GUI that looks less "AI-generated". (The student noted this may not matter much for a quick learning game.)
- The item in your hand shown on the right side of the screen.

### Game modes

- A free mode without characters that unlocks after all the lessons are finished, to motivate students to finish them.

### Water

- Water you can at least walk or wade into. Swimming isn't needed.

## Notes

- Several items could be treated as either bugs or design changes, depending on what's intended:
  - tool requirements for breaking blocks
  - solid water
  - the answer position always being the same

## Prioritized fix list

Ranked by how much each problem gets in the way of the lessons. The status column is updated as fixes land.

### Priority 1: stops students from finishing a lesson

| # | Problem | Cause | Fix | Status |
|---|---|---|---|---|
| 1 | Can't split item stacks on iPad, so sticks can't be crafted | Splitting only worked with a right-click | Add a **Take: All / Half / One** switch to the bag that works with taps | Fixed |
| 2 | Double-tap zooms in and won't zoom out | iPad Safari ignores the page's "no zoom" setting | Block double-tap and pinch zoom in code | Fixed |
| 3 | Iron frame: the symbol to tap seems missing, or a wrong one looks right | The clay pieces are drawn mirrored, and many mirrored Chinese characters look like different characters | Print the readable character under each clay piece, and shuffle the tray each time | Fixed |
| 4 | Closing the journal questions with the X loses your answers | The questions were removed from the screen when closed | Keep the questions in place while they're closed, so reopening picks up where you left off | Fixed |
| 5 | The journal button covers the Use/Talk button | Both sat in the same spot | Move the journal button up when the Use/Talk button is showing | Fixed |

### Priority 2: makes the game feel broken

| # | Problem | Cause | Fix | Status |
|---|---|---|---|---|
| 6 | Every block breaks instantly, even with a bare fist | Breaking was a single tap | Hold to break. Harder blocks take longer, and the right tool is faster | Fixed |
| 7 | Mouse and trackpad clicks do nothing on iPad | iPad uses touch controls, where a click only turned the camera | In touch mode, a click breaks (hold) and a right-click or two-finger click places | Fixed |
| 8 | Can't look straight up or down | The camera stopped about 5 degrees short | Let the camera reach almost straight up and down | Fixed |
| 9 | The correct answer is always in the same place | Choices were shown in the order they were written, and the right one was often first | Shuffle answer choices each time a question appears | Fixed |
| 10 | Water is solid | Water counted as a solid block | You can wade through water at a slower pace and jump to swim up | Fixed (not yet tried on a device) |
| 11 | Teacher PIN 1234 is easy to guess | Whoever opens the panel first chooses the PIN, and 1234 was allowed | Refuse easy PINs (1234, 0000, 1111 and so on), warn when the saved PIN is easy, and pause after 5 wrong tries | Fixed |

### Feature requests: decisions and status

| Request | Decision | Status |
|---|---|---|
| Show the held item on the right side of the screen | Do it | Done |
| Animals can't be hit | No combat; animals squeal and run off when tapped | Done |
| A free mode that unlocks after the lessons | Do it: Free Build, with a builder's supply and saved builds | Done |
| A less "AI-generated" interface | Do it: a print-shop look with walnut, paper, brass and red ink | Done |
| Textures for every block and item | The teacher is finding textures; the game now loads them from `public/textures` (see `docs/TEXTURES.md`) | Waiting on textures |
| Health, hunger, combat, enemies, hunting | Not planned: survival was removed so lessons stay on history | Not planned |
