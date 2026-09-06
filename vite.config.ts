import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Unterpfad, unter dem die App ausgeliefert wird.
 *
 * - Eigener Familien-Server: '/' (Standard)
 * - GitHub Pages:            '/<name-des-repositories>/'
 *
 * Wird beim Bauen gesetzt, z. B.:  BASE_PATH=/essens-app/ npm run build
 */
const BASE = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    // Macht die App auf dem Handy installierbar und offline nutzbar.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Essens App – Familienrezepte',
        short_name: 'Essens App',
        description: 'Familienrezepte ohne zugesetzten Zucker: kochen, bewerten, einkaufen, planen.',
        lang: 'de',
        // Relativ, damit die App auch unter einer Unteradresse funktioniert.
        start_url: '.',
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fbf9f5',
        theme_color: '#1f7a5a',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Rezepte, Bilder und Code werden vorgeladen – die App laeuft damit
        // auch in der Kueche ohne Empfang.
        globPatterns: ['**/*.{js,css,html,png,ico,svg,woff2}'],
        navigateFallback: `${BASE}index.html`,
      },
      devOptions: { enabled: false },
    }),
  ],
  server: { port: 5180, host: true },
});
