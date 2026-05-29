import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import domstatejsx from 'domstatejsx/vite-plugin';

export default defineConfig({
  base: '/dice/',
  plugins: [
    domstatejsx(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', '*.png'],
      manifest: {
        id: '/dice/',
        name: 'Sex Dice Game',
        short_name: 'Sex Dice',
        description: 'A customizable intimacy dice game for couples',
        theme_color: '#aa3bff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/dice/',
        start_url: '/dice/',
        icons: [
          {
            src: '/dice/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/dice/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
});
