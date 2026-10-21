# Adding textures

Every block and item already works without a texture: blocks use a plain color, and items use an emoji. To give one a picture, add a PNG with the right name. No code changes are needed.

## Where the files go

| Folder | What goes there |
|---|---|
| `public/textures/blocks/` | Block faces, shown in the world, in the player's hand and in the bag |
| `public/textures/items/` | Icons for tools and materials (and, optionally, to replace a block's icon in the bag) |

After adding files, merge them to `main` as usual; the game is rebuilt and the textures appear. When testing on your own computer with `npm run dev`, restart it after adding files.

## Image size and style

- **Square images, 16×16 or 32×32 pixels**, are best. Other sizes are scaled to fit a square.
- Pixel art stays sharp: the game doesn't blur textures.
- Transparent pixels show through in leaves (fully clear pixels only).
- PNG is best. WebP and JPEG also work.
- Use textures you're allowed to use: your own, a student's, or ones with a free license (for example CC0). Many Minecraft texture packs can't be shared freely.

## Block file names

Name a file after the block. The game looks for these, in this order:

1. `<name>_top.png`, `<name>_bottom.png` or `<name>_side.png` for one face
2. `<name>.png` for every face that doesn't have its own file

For example, `grass_top.png` and `grass_side.png` give grass a green top and dirt-and-grass sides. The bottom of a grass block uses `dirt.png` if there is one.

| Name (add `.png`) | Block |
|---|---|
| `grass` | Grass |
| `dirt` | Dirt |
| `stone` | Stone |
| `wood` | Wood |
| `leaves` | Leaves |
| `coal` | Coal Ore |
| `iron` | Iron Ore |
| `bedrock` | Bedrock |
| `torch` | Torch |
| `crafting_table` | Crafting Table |
| `sand` | Sand |
| `sandstone` | Sandstone |
| `cactus` | Cactus |
| `snow` | Snow |
| `water` | Water |
| `ice` | Ice |
| `planks` | Planks |
| `timber` | Timber Beam |
| `plaster` | Plaster |
| `type_case` | Type Case |
| `press` | Printing Press |
| `paper` | Paper Stack |
| `ink` | Ink Bench |
| `stone_brick` | Stone Brick |
| `lacquer` | Red Lacquer |
| `desk` | Writing Desk |
| `kiln` | Kiln |
| `furnace` | Furnace |
| `vat` | Paper Vat |
| `counter` | Counter |
| `map_table` | Map Table |
| `clay` | Clay Bench |

## Item file names

Name the file after the item, for example `wooden_pickaxe.png`. A block in the bag uses its side texture unless an item icon with its name exists.

| Name (add `.png`) | Item |
|---|---|
| `coal` | Coal |
| `raw_iron` | Raw Iron |
| `stick` | Stick |
| `wooden_pickaxe` | Wooden Pickaxe |
| `stone_pickaxe` | Stone Pickaxe |
| `iron_pickaxe` | Iron Pickaxe |
| `wooden_axe` | Wooden Axe |
| `stone_axe` | Stone Axe |

## Checking your textures

Open the game, start Free Build (the teacher panel can open it for everyone), and take blocks from **Supply** in the bag to see each one. A file with a wrong name is simply ignored, and a broken file falls back to the plain color.
