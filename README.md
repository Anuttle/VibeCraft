# The Printing Press

A bilingual (English / Latin American Spanish) educational game about the history of printing, from Bi Sheng's clay type to the first press in the Americas. It runs in the browser and is built for iPads.

- **Teachers:** see [docs/TEACHER_GUIDE.md](docs/TEACHER_GUIDE.md).
- **Design:** [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)
- **Writing content:** [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)
- **Adding textures:** [docs/TEXTURES.md](docs/TEXTURES.md)

## Development

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (bun also works) |
| `npm run dev` | Local server on port 3000 |
| `npm run validate` | Check all chapter content (tiers, languages, glossary links, activities) |
| `npm run lint` | Typecheck |
| `npm run build` | Static site in `dist/` |
| `npm run audio -- list \| script \| manifest \| gemini` | Read-aloud recordings |

Add `?debug=1` to the URL for automated tests. This enables `window.__ppTeleport` and a skip button on activities.
