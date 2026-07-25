import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/hv-dafp/' : '/';

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'escudo_colombia.svg'],
        manifest: {
          name: 'Formato Único Hoja de Vida - Persona Natural',
          short_name: 'Hoja de Vida DAFP',
          description: 'Diligencia e imprime online el Formato Único de Hoja de Vida Persona Natural (Función Pública Colombia) 100% Offline.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: base,
          icons: [
            {
              src: 'escudo_colombia.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
        }
      })
    ]
  };
});
