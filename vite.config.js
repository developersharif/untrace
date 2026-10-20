import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'

const guides = ['', 'remove-gps-from-photo', 'remove-exif-data-iphone', 'remove-exif-data-android', 'what-is-exif-data', 'what-is-c2pa']

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...Object.fromEntries(
          guides.map((slug) => [
            `guides-${slug || 'index'}`,
            resolve(__dirname, 'guides', slug, 'index.html'),
          ])
        ),
      },
    },
  },
})
