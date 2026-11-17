/// <reference types="vite/client" />

declare module "virtual:texture-list" {
  /** Image file names in public/textures, and model files in public/models. */
  const textures: {
    blocks: string[];
    items: string[];
    models: { characters: string[]; town: string[]; townColormap: boolean };
  };
  export default textures;
}
