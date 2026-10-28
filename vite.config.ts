import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'

// Every page is a real path. GitHub Pages serves static files only, so after the build each
// route gets its own copy of index.html (/gallery/index.html …) and 404.html is the same shell —
// a direct visit, a refresh or a shared link opens the right page with no redirect trick.
// Keep this list in step with `routes` in src/lib/routing.ts.
const routePaths = ['gallery', 'vip', 'about', 'contact', 'lost-found']

function staticRoutes(): Plugin {
  let outDir = 'dist'
  return {
    name: 'zenzo-static-routes',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const home = readFileSync(join(outDir, 'index.html'), 'utf8')
      // The homepage hero preloads are useless on other pages; leave them out of those copies.
      const start = home.indexOf('<!--home-preload-->')
      const end = home.indexOf('<!--/home-preload-->')
      const shell = start >= 0 && end > start ? home.slice(0, start) + home.slice(end + '<!--/home-preload-->'.length) : home
      for (const path of routePaths) {
        mkdirSync(join(outDir, path), { recursive: true })
        writeFileSync(join(outDir, path, 'index.html'), shell)
      }
      writeFileSync(join(outDir, '404.html'), shell)
    },
  }
}

// The deployment path is configurable for GitHub Pages project sites, e.g.
//   BASE_PATH=/zenzo-redesign/ npm run build
// or `npm run build:pages`, which passes --base on the command line.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), staticRoutes()],
})
