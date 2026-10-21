import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/**
 * Lists the images in public/textures as `virtual:texture-list`, so a texture
 * is added just by putting a PNG with the right name in the folder (see
 * docs/TEXTURES.md). The list is made at build time; restart the dev server
 * after adding files.
 */
function textureList(): Plugin {
  const id = 'virtual:texture-list';
  const list = (dir: string) => {
    try {
      return fs.readdirSync(path.resolve(__dirname, 'public/textures', dir)).filter((f) => /\.(png|webp|jpe?g)$/i.test(f)).sort();
    } catch {
      return [];
    }
  };
  return {
    name: 'texture-list',
    resolveId: (source) => (source === id ? '\0' + id : null),
    load: (resolved) =>
      resolved === '\0' + id ? `export default ${JSON.stringify({blocks: list('blocks'), items: list('items')})};` : null,
  };
}

export default defineConfig(() => {
  return {
    // Relative paths so the built game works from any folder or host
    // (GitHub Pages, a school web server, or a USB stick opened in a browser).
    base: "./",
    plugins: [react(), tailwindcss(), textureList()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
