/**
 * Dutch pages, against the Pages build (dist-pages) under /zenzo-redesign/.
 *
 *   npm run build:pages && npm run qa:nl
 *
 * For each Dutch page at four widths: HTTP status, <html lang>, title, h1, disclaimer, no horizontal overflow,
 * no broken images, no console errors, axe (WCAG 2.0/2.1 A + AA). Then the language switcher (desktop and
 * phone menu) both ways, and that every internal link on a Dutch page stays Dutch.
 */
import AxeBuilder from '@axe-core/playwright'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { pagesServer } from './serve-static.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = '/zenzo-redesign/'
const PORT = 4177
const origin = `http://localhost:${PORT}${BASE}`
const pages = ['nl/', 'nl/galerij/', 'nl/vip/', 'nl/over-zenzo/', 'nl/contact/', 'nl/gevonden-voorwerpen/', 'nl/nope/']
const widths = [1440, 768, 390, 320]
const failures: string[] = []
const fail = (msg: string) => failures.push(msg)

const server = pagesServer(join(root, 'dist-pages'), BASE)
await new Promise<void>((resolve) => server.listen(PORT, resolve))
const browser = await chromium.launch()

for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  for (const path of pages) {
    const page = await context.newPage()
    const errors: string[] = []
    page.on('console', (m) => m.type() === 'error' && !/404/.test(m.text()) && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(String(e)))
    const res = await page.goto(origin + path, { waitUntil: 'load' })
    await page.waitForTimeout(1200)
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 50))
      }
    })
    const tag = `${width}px ${path}`
    const expected = path.endsWith('nope/') ? 404 : 200
    if (res?.status() !== expected) fail(`${tag}: status ${res?.status()}`)
    const info = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      title: document.title,
      h1s: document.querySelectorAll('h1').length,
      disclaimer: /Niet gelieerd aan Zenzo/.test(document.body.innerText),
      overflow: document.documentElement.scrollWidth > innerWidth,
      broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
      englishLinks: [...document.querySelectorAll<HTMLAnchorElement>('a[href]:not([hreflang="en"])')]
        .map((a) => new URL(a.href))
        .filter((u) => u.origin === location.origin && !/\/nl\//.test(u.pathname) && u.pathname !== '/zenzo-redesign/')
        .map((u) => u.pathname),
    }))
    if (info.lang !== 'nl') fail(`${tag}: html lang is "${info.lang}"`)
    if (!/Onofficieel redesignconcept/.test(info.title)) fail(`${tag}: title "${info.title}"`)
    if (info.h1s !== 1) fail(`${tag}: ${info.h1s} h1`)
    if (!info.disclaimer) fail(`${tag}: Dutch disclaimer missing`)
    if (info.overflow) fail(`${tag}: horizontal overflow`)
    if (info.broken) fail(`${tag}: ${info.broken} broken images`)
    if (info.englishLinks.length) fail(`${tag}: links that leave Dutch: ${info.englishLinks.join(', ')}`)
    if (errors.length) fail(`${tag}: console errors: ${errors.join(' | ')}`)
    await page.waitForTimeout(1600)
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    for (const v of axe.violations) fail(`${tag}: axe ${v.id} (${v.nodes.length}) ${v.nodes.slice(0, 2).map((n) => n.target.join(' ') + ' ' + (n.any[0]?.message ?? '')).join(' ; ')}`)
    await page.close()
  }
  await context.close()
}

// ---- language switcher ----------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(`${origin}about/`)
  await page.waitForTimeout(600)
  await page.click('button[aria-label^="EN"]')
  await page.click('a[hreflang="nl"]')
  await page.waitForTimeout(600)
  if (!page.url().endsWith(`${BASE}nl/over-zenzo/`)) fail(`switcher EN→NL landed on ${page.url()}`)
  await page.click('button[aria-label^="NL"]')
  await page.click('a[hreflang="en"]')
  await page.waitForTimeout(600)
  if (!page.url().endsWith(`${BASE}about/`)) fail(`switcher NL→EN landed on ${page.url()}`)
  await context.close()

  const phone = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const p2 = await phone.newPage()
  await p2.goto(`${origin}nl/contact/`)
  await p2.waitForTimeout(600)
  await p2.click('button[aria-label="Menu openen"]')
  await p2.waitForTimeout(500)
  await p2.click('dialog a[hreflang="en"]')
  await p2.waitForTimeout(600)
  if (!p2.url().endsWith(`${BASE}contact/`)) fail(`menu NL→EN landed on ${p2.url()}`)
  await phone.close()
}

await browser.close()
server.close()
console.log(`dutch pages: ${pages.length * widths.length} page×width combinations, failing: ${failures.length}`)
for (const f of failures) console.log(' -', f)
process.exitCode = failures.length ? 1 : 0
