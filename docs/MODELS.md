# 3D models

The game uses two free model packs by Kenney (www.kenney.nl), both CC0, so they can be used and shared freely.

| Folder | Pack | Used for |
|---|---|---|
| `public/models/characters/` | Blocky Characters 2.0 | Townspeople who walk around outside the workshops and in Free Build |
| `public/models/town/` | Fantasy Town Kit (part 1) | Scenery: a fountain, a cart, market stools, stone pillars, rocks and hedges |

The rest of each pack's download (previews and the overview page) is kept in `art/` for reference; it isn't part of the game.

## Town models need their color map

Every Fantasy Town model takes its colors from one shared image, `colormap.png`. It wasn't in the upload, so **the town scenery is switched off until it's added**:

1. In the Kenney Fantasy Town Kit download, find `Models/GLB format/Textures/colormap.png`.
2. Upload it to `public/models/town/Textures/colormap.png`.

The scenery then appears in every chapter. Nothing else needs to change.

## Which characters appear

Most characters in the pack wear modern clothes (a police officer, a suit, robots, zombies), so only those that could pass for the 1000s–1500s are used:

| Character | Looks like | Where |
|---|---|---|
| a | Workman with a beard | Mainz chapters, the tutorial, Free Build |
| e | Townsperson | Mainz chapters, Free Build |
| k | Merchant in a red vest | Mainz chapters, Free Build |
| m | Traveler with a satchel | Mainz chapters, the tutorial, Free Build |
| n | Robe and headband | The clay type chapter (China), Free Build |

The named historical characters (Gutenberg, Bi Sheng, Fust and the others) keep their own period costumes. Tapping a townsperson makes them stop and nod; there's no conversation with them.

## Changing the scenery

Each chapter's townspeople and props are listed in `src/game/world.ts` (`TOWN_SCENE`, `CHINA_SCENE`, `MONASTERY_SCENE`, `COUNTRY_SCENE` and `FREE_SCENE`). A prop names a model file in `public/models/town` without `.glb`, a position, and an optional number of quarter turns. Any other model from the kit can be added the same way after copying its `.glb` into that folder.
