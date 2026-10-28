/**
 * Link audit + GitHub Pages readiness, against the Pages build (dist-pages) under /zenzo-redesign/.
 *
 *   npm run build:pages && npm run qa:links
 *
 * - Every internal link on every page resolves (HTTP 200 from a Pages-like server) and stays under the base path.
 * - The named links (nav, logo, footer, directions, official-site routing) exist on the homepage AND on a subpage and
 *   point where they should.
 * - The built files contain no localhost / absolute development paths / credentials, and every asset URL is base-aware.
 * Writes qa/report-links.json.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { pagesServer } from './serve-static.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = '/zenzo-redesign/'
const PORT = 4176
const origin = `http://localhost:${PORT}`
const pages = ['', 'gallery/', 'vip/', 'about/', 'contact/', 'lost-found/']
const report: Record<string, unknown> = {}

const server = pagesServer(join(root, 'dist-pages'), BASE)
await new Promise<void>((resolve) => server.listen(PORT, resolve))
const browser = await chromium.launch()

// ---- 1. every link on every page ---------------------------------------------------------
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const internalSeen = new Map<string, number>()
const externalSeen = new Map<string, Set<string>>()
const problems: string[] = []
const perPage: Record<string, Record<string, string[]>> = {}

for (const path of pages) {
  await page.goto(`${origin}${BASE}${path}`, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  const links = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].map((a) => ({
      text: (a.getAttribute('aria-label') ?? a.innerText ?? '').replace(/\s+/g, ' ').trim().slice(0, 40),
      href: a.getAttribute('href') ?? '',
      abs: a.href,
      blank: a.target === '_blank',
      rel: a.rel,
    })),
  )
  const labelled: Record<string, string[]> = {}
  for (const l of links) {
    const u = new URL(l.abs)
    const isInternal = u.origin === origin
    if (isInternal) {
      if (!u.pathname.startsWith(BASE)) problems.push(`${path || '/'}: "${l.text}" leaves the base → ${l.href}`)
      const key = u.pathname
      if (!internalSeen.has(key)) {
        const res = await fetch(`${origin}${key}`)
        internalSeen.set(key, res.status)
        if (res.status !== 200) problems.push(`${path || '/'}: "${l.text}" → ${key} returned ${res.status}`)
      }
      if (u.hash && u.hash !== '#main') {
        // an in-page anchor is fine if its target exists on this page
        const exists = await page.evaluate((id) => !!document.getElementById(id), u.hash.slice(1))
        if (!exists || u.pathname !== new URL(page.url()).pathname) problems.push(`${path || '/'}: broken in-page anchor "${l.text}" → ${l.href}`)
      }
    } else {
      if (!/^https:\/\//.test(l.abs)) problems.push(`${path || '/'}: non-https external link ${l.abs}`)
      if (!l.blank || !l.rel.includes('noopener')) problems.push(`${path || '/'}: external link "${l.text}" lacks target/rel`)
      const set = externalSeen.get(l.abs) ?? new Set<string>()
      set.add(l.text)
      externalSeen.set(l.abs, set)
    }
    const bucket = isInternal ? 'internal' : 'external'
    labelled[bucket] = labelled[bucket] ?? []
    labelled[bucket].push(`${l.text} → ${isInternal ? u.pathname : l.abs}`)
  }
  perPage[path || '/'] = labelled
}
report.internalTargets = Object.fromEntries(internalSeen)
report.externalTargets = Object.fromEntries([...externalSeen].map(([k, v]) => [k, [...v]]))

// ---- 2. the named links, from the homepage and from a subpage ------------------------------
const named: Record<string, Record<string, string | null>> = {}
const want = {
  'Home (nav)': { sel: 'header nav a', name: /^Home$/, href: BASE },
  'Gallery (nav)': { sel: 'header nav a', name: /^Gallery$/, href: `${BASE}gallery/` },
  'VIP Experience (nav)': { sel: 'header nav a', name: /^VIP Experience$/, href: `${BASE}vip/` },
  'About (nav)': { sel: 'header nav a', name: /^About$/, href: `${BASE}about/` },
  'Contact (nav)': { sel: 'header nav a', name: /^Contact$/, href: `${BASE}contact/` },
  'Lost & Found (nav)': { sel: 'header nav a', name: /^Lost & Found$/, href: `${BASE}lost-found/` },
  'Logo (home link)': { sel: 'header a', name: /^Zenzo — home$/, href: BASE },
  'Footer: Home': { sel: 'footer nav a', name: /^Home$/, href: BASE },
  'Footer: Gallery': { sel: 'footer nav a', name: /^Gallery$/, href: `${BASE}gallery/` },
  'Footer: VIP Experience': { sel: 'footer nav a', name: /^VIP Experience$/, href: `${BASE}vip/` },
  'Footer: About': { sel: 'footer nav a', name: /^About$/, href: `${BASE}about/` },
  'Footer: Contact': { sel: 'footer nav a', name: /^Contact$/, href: `${BASE}contact/` },
  'Footer: Lost & Found': { sel: 'footer nav a', name: /^Lost & Found$/, href: `${BASE}lost-found/` },
  'Footer: Directions': { sel: 'footer a', name: /^Directions/, href: 'https://www.google.com/maps/search/?api=1&query=Eiermarkt+13%2C+8000+Brugge%2C+Belgium' },
  'Official site (strip)': { sel: 'header a', name: /^Official site/, href: 'https://zenzobar.be/' },
  'Footer: Official website': { sel: 'footer a', name: /^Official website$/, href: 'https://zenzobar.be/' },
}
for (const path of ['', 'about/']) {
  await page.goto(`${origin}${BASE}${path}`, { waitUntil: 'load' })
  await page.waitForTimeout(800)
  const found: Record<string, string | null> = {}
  for (const [label, w] of Object.entries(want)) {
    const href = await page.evaluate(
      ([sel, source]) => {
        const re = new RegExp(source, 'i')
        const a = [...document.querySelectorAll<HTMLAnchorElement>(sel)].find((el) => re.test((el.getAttribute('aria-label') ?? el.innerText).replace(/\s+/g, ' ').trim()))
        return a ? a.getAttribute('href') : null
      },
      [w.sel, w.name.source] as [string, string],
    )
    found[label] = href
    if (href !== w.href) problems.push(`${path || '/'}: ${label} is ${href}, expected ${w.href}`)
  }
  named[path || '/'] = found
}
report.namedLinks = named

// enquiry routing on the content pages
const routing: Record<string, string[]> = {}
const expectedRouting: Record<string, [string, string]> = {
  'vip/': ['Enquire at zenzobar.be', 'https://zenzobar.be/#vip'],
  'contact/': ['Official contact form', 'https://zenzobar.be/#contact'],
  'lost-found/': ['Open the official form', 'https://zenzobar.be/#contact?type=lost-found'],
}
for (const [path, [label, href]] of Object.entries(expectedRouting)) {
  await page.goto(`${origin}${BASE}${path}`, { waitUntil: 'load' })
  await page.waitForTimeout(600)
  const hrefs = await page.evaluate((l) => [...document.querySelectorAll<HTMLAnchorElement>('main a')].filter((a) => a.innerText.toLowerCase().includes(l.toLowerCase())).map((a) => a.href), label)
  routing[path] = hrefs
  if (!hrefs.length || hrefs.some((h) => h !== href)) problems.push(`${path}: "${label}" links are ${JSON.stringify(hrefs)}, expected ${href}`)
}
await page.goto(`${origin}${BASE}contact/`, { waitUntil: 'load' })
const vipEnquiry = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>('main a')].find((a) => a.innerText.toLowerCase().includes('vip enquiries'))?.href)
if (vipEnquiry !== 'https://zenzobar.be/#vip') problems.push(`contact/: VIP enquiries is ${vipEnquiry}`)
routing['contact/ (VIP enquiries)'] = [String(vipEnquiry)]
const directions = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>('main a')].find((a) => a.innerText.toLowerCase().includes('get directions'))?.href)
routing['contact/ (Get directions)'] = [String(directions)]
if (!directions?.startsWith('https://www.google.com/maps/search/?api=1&query=Eiermarkt')) problems.push(`contact/: directions is ${directions}`)
report.enquiryRouting = routing
await browser.close()
server.close()

// ---- 3. Pages readiness: scan the built files ------------------------------------------------
const files: string[] = []
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else files.push(p)
  }
}
walk(join(root, 'dist-pages'))
const text = files.filter((f) => /\.(html|js|css|txt|json)$/.test(f))
const scan: Record<string, string[]> = { localhost: [], devPaths: [], notBaseAware: [], secrets: [] }
for (const f of text) {
  const s = readFileSync(f, 'utf8')
  const rel = relative(join(root, 'dist-pages'), f)
  if (/localhost|127\.0\.0\.1|0\.0\.0\.0/.test(s)) scan.localhost.push(rel)
  if (/[A-Z]:\\\\|[A-Z]:\\|\/Users\/|\/home\/\w+|file:\/\//.test(s)) scan.devPaths.push(rel)
  // root-absolute URLs that skip the base: ="/assets/…", ="/favicon", url(/assets/…
  if (/(?:href|src)="\/(?!zenzo-redesign\/)[a-z]/i.test(s) || /url\(["']?\/(?!zenzo-redesign\/)[a-z]/i.test(s)) scan.notBaseAware.push(rel)
  if (/(api[_-]?key\s*[:=]|secret[_-]?key|private[_-]?key|-----BEGIN [A-Z ]*PRIVATE|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30}|sk-[A-Za-z0-9]{20,}|xox[bp]-)/i.test(s)) scan.secrets.push(rel)
}
const hasRoutes = ['index.html', 'gallery/index.html', 'vip/index.html', 'about/index.html', 'contact/index.html', 'lost-found/index.html', '404.html', 'robots.txt'].map((f) => [f, files.some((x) => relative(join(root, 'dist-pages'), x).replace(/\\/g, '/') === f)])
report.pagesBuild = { files: files.length, routeFilesPresent: Object.fromEntries(hasRoutes), scan }
for (const [k, v] of Object.entries(scan)) if (v.length) problems.push(`built files: ${k} → ${v.join(', ')}`)
for (const [f, ok] of hasRoutes) if (!ok) problems.push(`missing build file ${f}`)

// source tree: no env files, no keys
const srcFiles: string[] = []
const walkSrc = (dir: string) => {
  for (const name of readdirSync(dir)) {
    if (['node_modules', 'dist', 'dist-pages', 'qa', 'assets-src', '.git'].includes(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walkSrc(p)
    else srcFiles.push(p)
  }
}
walkSrc(root)
const envFiles = srcFiles.filter((f) => /(^|[\\/])\.env/.test(f))
const keyHits = srcFiles.filter((f) => /\.(ts|tsx|json|html|md|css|cjs)$/.test(f) && !f.endsWith('package-lock.json') && /(api[_-]?key|secret[_-]?key|private[_-]?key|AKIA[0-9A-Z]{12}|ghp_[A-Za-z0-9]{20})/i.test(readFileSync(f, 'utf8')))
report.sourceScan = { envFiles, keyHits }
if (envFiles.length || keyHits.length) problems.push(`source: env ${envFiles} keys ${keyHits}`)

report.problems = problems
report.summary = { internalLinksChecked: internalSeen.size, externalLinks: externalSeen.size, pagesScanned: pages.length }
writeFileSync(join(root, 'qa', 'report-links.json'), JSON.stringify(report, null, 2))
console.log(`internal targets: ${internalSeen.size}, external: ${externalSeen.size}, problems: ${problems.length}`)
for (const p of problems) console.log(' -', p)
