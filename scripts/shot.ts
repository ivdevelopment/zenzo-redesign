/**
 * Screenshot one element (or the whole page) at a given width, after every
 * scroll-triggered reveal has fired. Used for reviewing a section in isolation.
 *
 *   node scripts/shot.ts <width> <selector|page> <out.png> [url]
 *
 * The fixed header is hidden so it doesn't overlay the capture.
 */
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'

const [, , widthArg, selector, outArg, urlArg] = process.argv
if (!widthArg || !selector || !outArg) {
  console.error('usage: node scripts/shot.ts <width> <selector|page> <out.png> [url]')
  process.exit(1)
}

const width = Number(widthArg)
const height = width < 500 ? 844 : 900
const out = resolve(outArg)
const url = urlArg ?? process.env.QA_URL ?? 'http://localhost:5173/'

await mkdir(dirname(out), { recursive: true })
const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width, height } })).newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = 'auto'
  const step = Math.round(window.innerHeight * 0.5)
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 140))
  }
})
await page.waitForTimeout(1500)
if (!process.env.KEEP_HEADER) await page.addStyleTag({ content: 'header,a[href="#main"]{display:none!important}' })

if (selector === 'page') {
  await page.addStyleTag({ content: `#home{min-height:${height}px!important;height:${height}px}` })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  await page.screenshot({ path: out, fullPage: true })
} else {
  const el = page.locator(selector).first()
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  await el.screenshot({ path: out })
}
await browser.close()
console.log(`saved ${out}`)
