/**
 * A static file server that behaves like GitHub Pages, for testing a build under its real base path:
 *   - the site lives under BASE (e.g. /zenzo-redesign/); the root is not served
 *   - a directory URL serves its index.html; a directory URL without a trailing slash is 301-redirected
 *   - anything missing returns 404.html with a 404 status
 *
 *   node scripts/serve-static.ts dist-pages /zenzo-redesign/ 4174
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
}

export function pagesServer(dir: string, base: string): Server {
  const root = resolve(dir)
  return createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost')
    const send = (file: string, status = 200) => {
      res.writeHead(status, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
      createReadStream(file).pipe(res)
    }
    const notFound = () => send(join(root, '404.html'), 404)

    if (!url.pathname.startsWith(base)) return notFound()
    const rel = normalize(decodeURIComponent(url.pathname.slice(base.length)))
    if (rel.startsWith('..')) return notFound()
    const target = join(root, rel)

    if (existsSync(target) && statSync(target).isFile()) return send(target)
    if (existsSync(target) && statSync(target).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { location: url.pathname + '/' + url.search })
        return res.end()
      }
      const index = join(target, 'index.html')
      if (existsSync(index)) return send(index)
    }
    return notFound()
  })
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const [, , dir = 'dist-pages', base = '/zenzo-redesign/', port = '4174'] = process.argv
  pagesServer(dir, base).listen(Number(port), () => console.log(`serving ${dir} at http://localhost:${port}${base}`))
}
