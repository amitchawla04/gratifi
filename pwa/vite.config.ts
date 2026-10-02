import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Gratifi',
        short_name: 'Gratifi',
        description: 'Your points assistant. Knows your points, speaks up at the right moment, and books when you say yes.',
        theme_color: '#F3F4F7',
        background_color: '#F4F4F3',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'], globIgnores: ['barclaycard/**'], navigateFallbackDenylist: [/^\/barclaycard/, /^\/api\//] }
    })
  ],
  build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 900 }
})
