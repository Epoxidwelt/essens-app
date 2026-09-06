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
  build: {
    rollupOptions: {
      output: {
        // Texterkennung (Foto/PDF -> Rezept) braucht die meisten nur selten.
        // Eigene, klar benannte Pakete, damit sie unten gezielt von der
        // Vorab-Ladeliste ausgeschlossen werden koennen.
        manualChunks(id) {
          if (id.includes('tesseract.js')) return 'texterkennung-ocr';
          if (id.includes('pdfjs-dist')) return 'texterkennung-pdf';
        },
      },
    },
  },
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
        // Die Texterkennung (Foto/PDF -> Rezept) braucht nicht jeder sofort –
        // ihre Pakete (u. a. der 1,3-MB-PDF-Baustein) werden erst geladen,
        // wenn die Funktion tatsaechlich genutzt wird, statt beim ersten
        // Start der App alle Handys unnoetig zu belasten.
        globIgnores: ['**/texterkennung-*.js', '**/pdf.worker*.mjs'],
        runtimeCaching: [
          {
            urlPattern: /texterkennung-|pdf\.worker/,
            handler: 'CacheFirst',
            options: { cacheName: 'texterkennung', expiration: { maxEntries: 8 } },
          },
          // Tesseract laedt Sprachdaten von einem CDN nach – einmal genutzt,
          // funktioniert die Texterkennung danach auch ohne Empfang.
          {
            urlPattern: ({ url }: { url: URL }) =>
              /jsdelivr|unpkg/.test(url.hostname) && /tesseract|traineddata/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'texterkennung-sprachdaten', expiration: { maxEntries: 4 } },
          },
        ],
        navigateFallback: `${BASE}index.html`,
      },
      devOptions: { enabled: false },
    }),
  ],
  server: { port: 5180, host: true },
});
