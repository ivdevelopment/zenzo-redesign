/**
 * QA for the inner pages and the routing, run against the GitHub-Pages build served under
 * its real base path by a GitHub-Pages-like static server (scripts/serve-static.ts).
 *
 *   npm run build:pages && npm run qa:pages
 *
 * Writes screenshots to qa/screenshots/pages/ and a JSON report to qa/report-pages.json.
 */
import AxeBuilder from '@axe-core/playwright'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, type Page } from 'playwright'
import { pagesServer } from './serve-static.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'qa', 'screenshots', 'pages')
const BASE = '/zenzo-redesign/'
const PORT = 4175
const origin = `http://localhost:${PORT}`
const SUFFIX = 'Unofficial Redesign Concept'

const pages = [
  { id: 'home', path: '', title: `Zenzo — ${SUFFIX}`, h1: 'Zenzo', nav: 'Home' },
  { id: 'gallery', path: 'gallery/', title: `Gallery — Zenzo (${SUFFIX})`, h1: 'Moments at Zenzo', nav: 'Gallery' },
  { id: 'vip', path: 'vip/', title: `VIP Experience — Zenzo (${SUFFIX})`, h1: 'VIP Experience', nav: 'VIP Experience' },
  { id: 'about', path: 'about/', title: `About — Zenzo (${SUFFIX})`, h1: 'About Zenzo', nav: 'About' },
  { id: 'contact', path: 'contact/', title: `Contact — Zenzo (${SUFFIX})`, h1: 'Find Zenzo', nav: 'Contact' },
  { id: 'lost-found', path: 'lost-found/', title: `Lost & Found — Zenzo (${SUFFIX})`, h1: 'Lost & Found', nav: 'Lost & Found' },
] as const

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-small', width: 320, height: 640 },
]

type Report = Record<string, unknown>
const report: Report = { base: BASE, startedAt: new Date().toISOString() }

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    const step = Math.round(window.innerHeight * 0.6)
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 140))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1500)
}

async function load(page: Page, path: string) {
  const response = await page.goto(`${origin}${BASE}${path}`, { waitUntil: 'load', timeout: 60_000 })
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {})
  await page.waitForTimeout(1800)
  return response
}

async function pageChecks(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const vw = doc.clientWidth
    const overflowing = [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        if (r.width === 0) return false
        let p = el.parentElement
        while (p && p !== document.body) {
          const s = getComputedStyle(p)
          if (s.overflowX !== 'visible' || s.overflow === 'hidden' || s.overflow === 'clip') return false
          p = p.parentElement
        }
        return r.right > vw + 1 || r.left < -1
      })
      .slice(0, 8)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)}`)

    const images = [...document.images]
    const rendered = images.filter((img) => img.getClientRects().length > 0)
    const broken = rendered.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.currentSrc || img.src)
    const unrevealed = [...document.querySelectorAll('h1, h2')]
      .filter((h) => [...h.querySelectorAll('span span')].some((s) => getComputedStyle(s).transform !== 'none'))
      .map((h) => h.textContent?.trim().slice(0, 30))
    const strip = [...document.querySelectorAll('header p')].find((p) => p.textContent?.includes('Not affiliated'))
    const sr = strip?.getBoundingClientRect()
    // Text smaller than 11px (other than the deliberately tiny uppercase labels) would be a readability problem
    const tinyBody = [...document.querySelectorAll<HTMLElement>('main p, main li, main dd, footer p')]
      .filter((el) => el.getClientRects().length && parseFloat(getComputedStyle(el).fontSize) < 12 && !el.classList.contains('eyebrow'))
      .map((el) => `${Math.round(parseFloat(getComputedStyle(el).fontSize))}px: ${el.textContent?.trim().slice(0, 40)}`)
      .slice(0, 5)

    return {
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      h1: (document.querySelector('h1') as HTMLElement | null)?.innerText.replace(/\s+/g, ' ').trim(),
      current: [...document.querySelectorAll('header [aria-current="page"]')].map((a) => a.textContent?.trim()),
      scrollWidth: doc.scrollWidth,
      clientWidth: vw,
      horizontalOverflow: doc.scrollWidth > vw,
      overflowingElements: overflowing,
      renderedImages: rendered.length,
      brokenImages: broken,
      unrevealedHeadings: unrevealed,
      disclaimerVisible: !!sr && sr.height > 0 && sr.top >= 0 && sr.bottom <= window.innerHeight && sr.right <= vw,
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
      forms: document.querySelectorAll('form, input, textarea, select').length,
      footerDisclaimer: !!document.querySelector('footer')?.textContent?.includes('Not affiliated with Zenzo'),
      externalWithoutNoopener: [...document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')]
        .filter((a) => !(a.rel || '').includes('noopener'))
        .map((a) => a.href),
      internalOutsideBase: [...document.querySelectorAll<HTMLAnchorElement>('a[href]')]
        .map((a) => a.getAttribute('href') ?? '')
        .filter((h) => h.startsWith('/') && !h.startsWith('/zenzo-redesign/')),
      tinyBody,
    }
  })
}

async function axeScan(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  return {
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      sample: v.nodes[0]?.target.join(' '),
      detail: v.nodes[0]?.any[0]?.message,
    })),
    passes: result.passes.length,
  }
}

async function run() {
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  const server = pagesServer(join(root, 'dist-pages'), BASE)
  await new Promise<void>((resolve) => server.listen(PORT, resolve))
  const browser = await chromium.launch()

  // ---- Every page at every width -------------------------------------------------------
  const matrix: Record<string, unknown> = {}
  for (const vp of viewports) {
    for (const pg of [...pages.slice(1), { id: 'not-found', path: 'no-such-page/', title: `Page not found — Zenzo (${SUFFIX})`, h1: 'Page not found', nav: '' }]) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 })
      const page = await context.newPage()
      const consoleErrors: string[] = []
      const failed: string[] = []
      page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
      page.on('pageerror', (e) => consoleErrors.push(e.message))
      page.on('response', (r) => r.status() >= 400 && r.request().resourceType() !== 'document' && failed.push(`${r.status()} ${r.url()}`))
      page.on('requestfailed', (r) => failed.push(`failed ${r.url()}`))

      const response = await load(page, pg.path)
      const status = response?.status()
      await page.screenshot({ path: join(outDir, `${vp.name}-${pg.id}-1-hero.png`) })
      await scrollThrough(page)
      const checks = await pageChecks(page)
      const accessibility = await axeScan(page)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(300)
      await page.screenshot({ path: join(outDir, `${vp.name}-${pg.id}-0-full.png`), fullPage: true })

      // The 404 route's own document response is logged by the browser; that one message is expected.
      const unexpectedConsole = pg.id === 'not-found' ? consoleErrors.filter((m) => !/status of 404/.test(m)) : consoleErrors
      const expectedStatus = pg.id === 'not-found' ? 404 : 200
      const ok =
        status === expectedStatus &&
        checks.title === pg.title &&
        checks.h1Count === 1 &&
        checks.h1?.toLowerCase() === pg.h1.toLowerCase() &&
        (pg.id === 'not-found' ? checks.current.length === 0 : checks.current.length === 1 && checks.current[0] === pg.nav) &&
        !checks.horizontalOverflow &&
        !checks.brokenImages.length &&
        !unexpectedConsole.length &&
        !failed.length &&
        checks.disclaimerVisible &&
        checks.footerDisclaimer &&
        !accessibility.violations.length &&
        !checks.unrevealedHeadings.length &&
        checks.forms === 0 &&
        !checks.externalWithoutNoopener.length &&
        !checks.internalOutsideBase.length &&
        /noindex/.test(checks.robots ?? '')
      matrix[`${vp.name}/${pg.id}`] = { ok, status, ...checks, accessibility, consoleErrors: pg.id === 'not-found' ? unexpectedConsole : consoleErrors, failed }
      await context.close()
    }
  }
  report.pages = matrix

  // ---- Navigation, under the base path ---------------------------------------------------
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    await load(page, '')
    const steps: Record<string, unknown>[] = []
    for (const pg of pages.slice(1)) {
      await page.locator('header').getByRole('link', { name: pg.nav, exact: true }).first().click()
      await page.waitForTimeout(700)
      steps.push(
        await page.evaluate((expected) => ({
          to: expected.nav,
          url: location.pathname,
          title: document.title,
          h1: (document.querySelector('h1') as HTMLElement | null)?.innerText.replace(/\s+/g, ' ').trim(),
          current: document.querySelector('header [aria-current="page"]')?.textContent?.trim(),
          scrollY: Math.round(window.scrollY),
          focusOnMain: document.activeElement?.id === 'main',
          fullReload: false,
        }), pg),
      )
    }
    // client-side: no full reload happened (a marker set on window survives)
    await page.evaluate(() => ((window as unknown as { __marker: number }).__marker = 1))
    await page.locator('header').getByRole('link', { name: 'Gallery', exact: true }).first().click()
    await page.waitForTimeout(500)
    const stayedClientSide = await page.evaluate(() => (window as unknown as { __marker?: number }).__marker === 1)
    // back / forward
    await page.goBack()
    await page.waitForTimeout(500)
    const afterBack = await page.evaluate(() => ({ url: location.pathname, h1: (document.querySelector('h1') as HTMLElement | null)?.innerText.replace(/\s+/g, ' ').trim() }))
    await page.goForward()
    await page.waitForTimeout(500)
    const afterForward = await page.evaluate(() => ({ url: location.pathname, h1: (document.querySelector('h1') as HTMLElement | null)?.innerText.replace(/\s+/g, ' ').trim() }))
    // logo, footer and in-page links
    await page.getByRole('link', { name: 'Zenzo — home' }).first().click()
    await page.waitForTimeout(600)
    const logoHome = await page.evaluate(() => ({ url: location.pathname, h1: (document.querySelector('h1') as HTMLElement | null)?.innerText.replace(/\s+/g, ' ').trim() }))
    await page.locator('footer').getByRole('link', { name: 'VIP Experience', exact: true }).first().click()
    await page.waitForTimeout(600)
    const footerVip = await page.evaluate(() => ({ url: location.pathname, scrollY: Math.round(window.scrollY) }))
    await page.getByRole('link', { name: 'Home', exact: true }).first().click()
    await page.waitForTimeout(600)
    const homeLinks: Record<string, string> = {}
    for (const [label, expected] of [
      ['Discover VIP', 'vip/'],
      ['View full gallery', 'gallery/'],
      ['Read more', 'about/'],
      ['All contact details', 'contact/'],
    ] as const) {
      await page.goto(`${origin}${BASE}`, { waitUntil: 'load' })
      await page.waitForTimeout(800)
      if (label === 'Read more') await page.getByText('About Zenzo', { exact: true }).first().click()
      const link = page.getByRole('link', { name: label }).first()
      await link.scrollIntoViewIfNeeded()
      await link.click()
      await page.waitForTimeout(700)
      homeLinks[label] = (await page.evaluate(() => location.pathname)).replace(BASE, '') === expected ? 'ok' : `went to ${await page.evaluate(() => location.pathname)}`
    }
    // modifier click opens normally (not intercepted): the href must be a real URL
    const realHrefs = await page.evaluate(() => [...document.querySelectorAll('header nav a')].map((a) => (a as HTMLAnchorElement).getAttribute('href')))
    report.navigation = { steps, stayedClientSide, afterBack, afterForward, logoHome, footerVip, homeLinks, realHrefs }
    await context.close()
  }

  // ---- Direct navigation, refresh, redirects, 404 -----------------------------------------
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    const direct: Record<string, unknown> = {}
    for (const pg of pages) {
      const res = await load(page, pg.path)
      const first = { status: res?.status(), h1: await page.locator('h1').first().innerText().then((t) => t.replace(/\s+/g, ' ').trim()) }
      await page.reload({ waitUntil: 'load' })
      await page.waitForTimeout(800)
      const afterReload = await page.locator('h1').first().innerText().then((t) => t.replace(/\s+/g, ' ').trim())
      direct[pg.id || 'home'] = { ...first, afterReload, title: await page.title() }
    }
    // without a trailing slash (Pages redirects to the directory)
    const noSlash = await page.goto(`${origin}${BASE}gallery`, { waitUntil: 'load' })
    await page.waitForTimeout(800)
    const redirect = { finalUrl: new URL(page.url()).pathname, redirected: noSlash?.request().redirectedFrom() !== null, h1: await page.locator('h1').first().innerText().then((t) => t.replace(/\s+/g, ' ').trim()) }
    // hash on an inner page
    await page.goto(`${origin}${BASE}vip/#private-lounge`, { waitUntil: 'load' })
    await page.waitForTimeout(1200)
    const hashTop = await page.evaluate(() => Math.round(document.getElementById('private-lounge')!.getBoundingClientRect().top))
    // 404
    const missing = await page.goto(`${origin}${BASE}nope/`, { waitUntil: 'load' })
    await page.waitForTimeout(800)
    const notFound = { status: missing?.status(), h1: await page.locator('h1').first().innerText().then((t) => t.replace(/\s+/g, ' ').trim()), backLink: await page.getByRole('link', { name: 'Back to the homepage' }).getAttribute('href') }
    // asset URLs carry the base path
    await page.goto(`${origin}${BASE}`, { waitUntil: 'load' })
    const assetPaths = await page.evaluate(() => [...document.images].map((i) => new URL(i.currentSrc || i.src).pathname).filter((p) => !p.startsWith('/zenzo-redesign/')))
    // the root (outside the base) is intentionally not served
    const outside = await page.goto(`${origin}/gallery/`, { waitUntil: 'load' })
    report.direct = { direct, redirect, hashTop, notFound, assetsOutsideBase: assetPaths, outsideBaseStatus: outside?.status() }
    await context.close()
  }

  // ---- Mobile menu routes to pages -------------------------------------------------------
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await load(page, '')
    const results: Record<string, unknown>[] = []
    for (const pg of pages.slice(1)) {
      await page.getByRole('button', { name: 'Open menu' }).click()
      await page.waitForTimeout(700)
      if (pg.id === 'gallery') await page.screenshot({ path: join(outDir, 'mobile-menu-open.png') })
      // menu links are numbered ("02 Gallery"), so match the end of the name
      await page.getByRole('dialog').getByRole('link', { name: new RegExp(pg.nav + '$') }).click()
      await page.waitForTimeout(800)
      results.push(
        await page.evaluate((expected) => ({
          to: expected.nav,
          url: location.pathname,
          h1: (document.querySelector('h1') as HTMLElement | null)?.innerText.replace(/\s+/g, ' ').trim(),
          menuClosed: !document.querySelector('dialog[aria-label="Site navigation"]')?.hasAttribute('open'),
          current: document.querySelector('header [aria-current="page"]')?.textContent?.trim() ?? null,
        }), pg),
      )
    }
    // current page marked in the menu
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.waitForTimeout(600)
    const menuCurrent = await page.evaluate(() => document.querySelector('dialog [aria-current="page"]')?.textContent?.replace(/\d+/, '').trim())
    await page.keyboard.press('Escape')
    report.mobileMenuRoutes = { results, menuCurrent }
    await context.close()
  }

  // ---- Gallery page: lightbox, hover ------------------------------------------------------
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    await load(page, 'gallery/')
    const tile = page.getByRole('button', { name: /Open image 1 of/ })
    await tile.scrollIntoViewIfNeeded()
    await tile.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(900)
    const counter = () => page.evaluate(() => document.querySelector('dialog[aria-label="Gallery viewer"] [aria-live]')?.textContent)
    const first = await counter()
    await page.screenshot({ path: join(outDir, 'desktop-gallery-lightbox.png') })
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)
    const wrapped = await counter()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)
    const back = await counter()
    const loaded = await page.evaluate(() => {
      const img = document.querySelector<HTMLImageElement>('dialog[aria-label="Gallery viewer"] img')
      return !!img && img.complete && img.naturalWidth > 0
    })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    const after = await page.evaluate(() => ({ open: document.querySelector('dialog[aria-label="Gallery viewer"]')?.hasAttribute('open'), focus: document.activeElement?.getAttribute('aria-label')?.slice(0, 30) }))
    const tiles = await page.locator('main button[aria-label^="Open image"]').count()
    const sizes = await page.evaluate(() => [...document.querySelectorAll('main button[aria-label^="Open image"]')].map((b) => { const r = b.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}` }))
    const distinct = new Set(sizes).size
    // open the last frame from a late tile
    await page.getByRole('button', { name: /Open image 12 of/ }).scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /Open image 12 of/ }).click()
    await page.waitForTimeout(600)
    const last = await counter()
    await page.keyboard.press('Escape')
    report.galleryPage = { tiles, distinctFrameSizes: distinct, first, wrapped, back, loaded, after, last }
    await context.close()
  }

  // ---- Official routing links -------------------------------------------------------------
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    const links: Record<string, string[]> = {}
    for (const id of ['vip/', 'contact/', 'lost-found/']) {
      await load(page, id)
      links[id] = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>('main a[href^="https://zenzobar.be"]')].map((a) => `${a.textContent?.replace(/\s+/g, ' ').trim()} → ${a.href} [${a.target || 'same-tab'}]`),
      )
    }
    report.officialLinks = links
    await context.close()
  }

  // ---- Reduced motion on a content page ---------------------------------------------------
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    await load(page, 'vip/')
    report.reducedMotion = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('main section picture')!.parentElement!
      const h1Line = document.querySelector<HTMLElement>('h1 > span > span')!
      const frame = document.querySelector<HTMLElement>('article#bottle-service > div > div')!
      return {
        heroAnimation: getComputedStyle(hero).animationName,
        titleTransform: getComputedStyle(h1Line).transform,
        chapterImageClip: getComputedStyle(frame).clipPath,
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      }
    })
    await context.close()
  }

  await browser.close()
  server.close()
  report.finishedAt = new Date().toISOString()
  await writeFile(join(root, 'qa', 'report-pages.json'), JSON.stringify(report, null, 2))
  const failing = Object.entries(matrix).filter(([, v]) => !(v as { ok: boolean }).ok).map(([k]) => k)
  console.log(`pages checked: ${Object.keys(matrix).length}, failing: ${failing.length}${failing.length ? ' → ' + failing.join(', ') : ''}`)
}

await run()
