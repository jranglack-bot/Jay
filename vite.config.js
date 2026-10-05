import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// public/js/main.js und public/js/sub.js laufen nicht durch Vite und bekommen deshalb keinen
// Hash im Namen.
// Hostinger liefert sie mit „max-age=604800“ aus (7 Tage im Browser zwischengespeichert):
// Ohne Versionsanhang sehen wiederkehrende Besucher nach einem Update neues HTML mit
// altem Skript. Jeder Build hängt deshalb ?v=<Zeitstempel> an (gemessen 25.09.2026).
const skriptVersion = () => ({
  name: 'skript-version',
  transformIndexHtml(html) {
    return html.replace(/src="js\/([\w-]+)\.js"/g, `src="js/$1.js?v=${Date.now().toString(36)}"`)
  },
})

export default defineConfig({
  base: '/',
  plugins: [skriptVersion()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        impressum: resolve(import.meta.dirname, 'impressum.html'),
        datenschutz: resolve(import.meta.dirname, 'datenschutz.html'),
        prompts: resolve(import.meta.dirname, 'prompts.html'),
        tools: resolve(import.meta.dirname, 'tools.html'),
      },
    },
  },
})
