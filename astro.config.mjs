import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// Deploy en GitHub Pages: https://altermundi.github.io/web-hermescraft/
// Para dominio custom (ej. hermescraft.ai): poner site al dominio y base a '/'.
export default defineConfig({
  site: 'https://altermundi.github.io',
  base: '/web-hermescraft/',
  integrations: [tailwind(), react()],
  server: { port: 8767, host: true },
  vite: {
    ssr: { noExternal: ['skinview3d'] },
  },
});
