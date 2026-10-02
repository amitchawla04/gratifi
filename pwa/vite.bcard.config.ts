import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// The Barclaycard concept app, served at /barclaycard/ next to the original demo.
export default defineConfig({
  root: 'bcard',
  base: '/barclaycard/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      scope: '/barclaycard/',
      manifest: {
        name: 'Gratifi for Barclaycard (concept)',
        short_name: 'Gratifi Card',
        description: 'A concept by Reward360 for Barclays. Demo data.',
        theme_color: '#F2F4F7',
        background_color: '#F2F4F7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/barclaycard/',
        scope: '/barclaycard/',
        icons: [
          { src: '/barclaycard/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/barclaycard/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/barclaycard/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'], navigateFallback: '/barclaycard/index.html', navigateFallbackDenylist: [/^\/api\//] }
    })
  ],
  build: { outDir: '../dist/barclaycard', emptyOutDir: true, assetsInlineLimit: 0, chunkSizeWarningLimit: 900 },
  server: { fs: { allow: ['..'] } }
})
