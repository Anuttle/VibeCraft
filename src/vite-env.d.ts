/// <reference types="vite/client" />

declare module "virtual:texture-list" {
  /** Image file names found in public/textures/blocks and public/textures/items. */
  const textures: { blocks: string[]; items: string[] };
  export default textures;
}
