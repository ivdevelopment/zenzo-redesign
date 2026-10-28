/**
 * Rendered-page QA: screenshots plus automated checks against a running server.
 *
 *   npm run build && npm run preview      # in one terminal (port 4173)
 *   npm run qa                            # in another
 *
 * Writes screenshots to qa/screenshots/ and a JSON report to qa/report.json.
 */
import AxeBuilder from '@axe-core/playwright'
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, type Page } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'qa', 'screenshots')
const url = process.env.QA_URL ?? 'http://localhost:4173/'

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-small', width: 320, height: 640 },
]

const sections = ['home', 'about', 'gallery', 'vip', 'contact']

type Report = Record<string, unknown>
const report: Report = { url, startedAt: new Date().toISOString(), viewports: {} }

/** Load the page; treat a slow network-idle as non-fatal (the load event has already fired). */
async function open(page: Page) {
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 })
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {})
}

/** Scroll through the page so every scroll-triggered reveal and lazy image fires. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    const step = Math.round(window.innerHeight * 0.6)
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 160))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1600)
}

async function pageChecks(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const vw = doc.clientWidth
    const overflowing = [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        if (r.width === 0) return false
        // Ignore content intentionally clipped by an overflow-hidden ancestor
        let p = el.parentElement
        while (p && p !== document.body) {
          const s = getComputedStyle(p)
          if (s.overflowX !== 'visible' || s.overflow === 'hidden' || s.overflow === 'clip') return false
          p = p.parentElement
        }
        return r.right > vw + 1 || r.left < -1
      })
      .slice(0, 10)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`)

    const images = [...document.images]
    // Lazy images inside display:none layout variants (e.g. desktop-only panels on
    // mobile) never load by design; only rendered images count.
    const rendered = images.filter((img) => img.getClientRects().length > 0)
    const broken = rendered.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.currentSrc || img.src)

    // Any headline left unrevealed (its line still clipped away) would show here
    const hiddenHeadings = [...document.querySelectorAll('h1, h2')]
      .filter((h) => [...h.querySelectorAll('span span')].some((s) => getComputedStyle(s).transform !== 'none'))
      .map((h) => h.textContent?.trim().slice(0, 30))

    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: vw,
      horizontalOverflow: doc.scrollWidth > vw,
      overflowingElements: overflowing,
      images: images.length,
      renderedImages: rendered.length,
      brokenImages: broken,
      unrevealedHeadings: hiddenHeadings,
      disclaimerVisible: (() => {
        const el = [...document.querySelectorAll('header p')].find((p) => p.textContent?.includes('Not affiliated'))
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight && r.right <= vw
      })(),
      robotsMeta: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
      forms: document.querySelectorAll('form').length,
      logo: (() => {
        const img = document.querySelector<HTMLImageElement>('header img')
        const r = img?.getBoundingClientRect()
        return img && r ? { src: img.getAttribute('src'), w: Math.round(r.width), h: Math.round(r.height) } : null
      })(),
    }
  })
}

/** WCAG 2.x A/AA scan with axe-core (rendered DOM, current viewport). */
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

/** The VIP section's three experiences: right photo, right title, inclusions present. */
async function vipChecks(page: Page, mobile: boolean) {
  return page.evaluate((isMobile) => {
    const expected = [
      { id: 'bottle-service', title: 'Bottle Service', photo: 'vip-bottle' },
      { id: 'private-lounge', title: 'Private Lounge', photo: 'vip-lounge' },
      { id: 'private-party', title: 'Private Party', photo: 'vip-party' },
    ]
    return expected.map((e) => {
      const details = document.getElementById(isMobile ? `${e.id}-row-details` : `${e.id}-details`)
      const item = details?.closest('li')
      const img = item?.querySelector('img')
      const title = isMobile
        ? [...(item?.querySelectorAll('button span.display') ?? [])].at(-1)?.textContent?.trim()
        : item?.querySelector('h3')?.textContent?.trim()
      return {
        id: e.id,
        titleOk: title?.toLowerCase() === e.title.toLowerCase(),
        photoOk: !!img && (img.getAttribute('src') ?? '').includes('/' + e.photo + '-'),
        inclusions: details?.querySelectorAll('li').length,
      }
    })
  }, mobile)
}

async function run() {
  await mkdir(outDir, { recursive: true })
  for (const file of await readdir(outDir)) if (file.endsWith('.png')) await rm(join(outDir, file))
  const browser = await chromium.launch()

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 })
    const page = await context.newPage()
    const consoleErrors: string[] = []
    const failedRequests: string[] = []
    page.on('console', (msg) => msg.type() === 'error' && consoleErrors.push(msg.text()))
    page.on('pageerror', (err) => consoleErrors.push(err.message))
    page.on('response', (res) => res.status() >= 400 && failedRequests.push(`${res.status()} ${res.url()}`))
    page.on('requestfailed', (req) => failedRequests.push(`failed ${req.url()}`))

    await open(page)
    await page.waitForTimeout(2600) // hero entrance
    await page.screenshot({ path: join(outDir, `${vp.name}-01-hero.png`) }) // with header

    await scrollThrough(page)
    const checks = await pageChecks(page)
    const accessibility = await axeScan(page)
    const vipSync = await vipChecks(page, vp.width < 768)

    // Section captures without the fixed header covering them
    await page.addStyleTag({ content: 'header{visibility:hidden!important}' })
    for (const [i, id] of sections.entries()) {
      if (id === 'home') continue
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(700)
      await page.locator(`#${id}`).screenshot({ path: join(outDir, `${vp.name}-${String(i + 1).padStart(2, '0')}-${id}.png`) })
    }
    await page.locator('footer').screenshot({ path: join(outDir, `${vp.name}-07-footer.png`) })

    // Full page: pin the hero to the viewport height first, since a full-page
    // capture otherwise stretches the hero's min-height to the whole document.
    await page.addStyleTag({ content: `header{visibility:visible!important}#home{min-height:${vp.height}px!important;height:${vp.height}px}` })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    await page.screenshot({ path: join(outDir, `${vp.name}-00-full.png`), fullPage: true })

    ;(report.viewports as Report)[vp.name] = { ...checks, accessibility, vipSync, consoleErrors, failedRequests }
    await context.close()
  }

  // ---- Mobile menu (keyboard) ---------------------------------------------
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await open(page)
    const menuButton = page.getByRole('button', { name: 'Open menu' })
    await menuButton.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(900)
    const opened = await page.evaluate(() => ({
      open: document.querySelector('dialog[aria-label="Site navigation"]')?.hasAttribute('open'),
      focus: document.activeElement?.getAttribute('aria-label'),
      bodyScrollLocked: getComputedStyle(document.documentElement).overflow,
    }))
    await page.screenshot({ path: join(outDir, 'mobile-menu-open.png') })
    const tabbed: string[] = []
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab')
      tabbed.push(
        await page.evaluate(() => {
          const el = document.activeElement
          if (el === document.body) return 'BODY (focus left the page, as expected)'
          const inDialog = !!el?.closest('dialog')
          return `${inDialog ? 'dialog' : 'PAGE'}:${(el?.getAttribute('aria-label') ?? el?.textContent)?.trim().slice(0, 24)}`
        }),
      )
    }
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    const closed = await page.evaluate(() => ({
      open: document.querySelector('dialog[aria-label="Site navigation"]')?.hasAttribute('open'),
      focusReturnedTo: document.activeElement?.getAttribute('aria-label'),
    }))
    await menuButton.click()
    await page.waitForTimeout(700)
    await page.getByRole('dialog').getByRole('link', { name: /VIP Experience$/ }).click()
    await page.waitForTimeout(1600)
    const navigated = await page.evaluate(() => ({
      open: document.querySelector('dialog[aria-label="Site navigation"]')?.hasAttribute('open'),
      path: location.pathname,
      h1: (document.querySelector('h1') as HTMLElement | null)?.innerText.trim(),
    }))
    report.mobileMenu = { opened, tabbed, closed, navigated }
    await context.close()
  }

  // ---- Desktop: nav, language selector, VIP panels, lightbox ---------------
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    await open(page)
    await page.waitForTimeout(2000)

    // Header structure: logo centred, links split left/right
    report.header = await page.evaluate(() => {
      const logo = document.querySelector<HTMLElement>('header img')!.getBoundingClientRect()
      const left = [...document.querySelectorAll('nav[aria-label="Primary"] a')].map((a) => a.textContent?.trim())
      const right = [...document.querySelectorAll('nav[aria-label="Secondary"] a')].map((a) => a.textContent?.trim())
      return {
        logoCentre: Math.round(logo.left + logo.width / 2),
        viewportCentre: Math.round(document.documentElement.clientWidth / 2),
        left,
        right,
        activeOnLoad: document.querySelector('header a[aria-current="page"]')?.textContent?.trim(),
      }
    })

    // Language selector
    const langButton = page.getByRole('button', { name: /change language/i })
    await langButton.click()
    await page.waitForTimeout(300)
    const langOpen = await page.evaluate(() => ({
      items: [...document.querySelectorAll('header ul[id] li')].map((li) => li.textContent?.trim().replace(/\s+/g, ' ')),
      disabled: document.querySelectorAll('header ul[id] [aria-disabled="true"]').length,
    }))
    await page.screenshot({ path: join(outDir, 'desktop-language-open.png'), clip: { x: 900, y: 0, width: 540, height: 220 } })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
    const langClosed = await page.evaluate(() => !document.querySelector('header ul[id]'))
    report.languageSelect = { ...langOpen, closesOnEscape: langClosed }

    // Scrolled header
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto'
      document.getElementById('gallery')!.scrollIntoView()
    })
    await page.waitForTimeout(700)
    await page.screenshot({ path: join(outDir, 'desktop-header-scrolled.png'), clip: { x: 0, y: 0, width: 1440, height: 120 } })

    // VIP panels: hover reveals inclusions, button toggles them
    await page.locator('#vip').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    const panel = page.locator('#vip ul').first().locator('li').first()
    const detailsHeight = () => page.evaluate(() => Math.round(document.getElementById('bottle-service-details')!.getBoundingClientRect().height))
    const before = await detailsHeight()
    await panel.hover()
    await page.waitForTimeout(1000)
    const hovered = await detailsHeight()
    await page.screenshot({ path: join(outDir, 'desktop-vip-hover.png') })
    await page.mouse.move(5, 5)
    await page.waitForTimeout(1000)
    const button = page.getByRole('button', { name: /Bottle Service: show/ })
    await button.click()
    await page.mouse.move(5, 5)
    await page.waitForTimeout(1000)
    const toggled = {
      expanded: await page.locator('button[aria-controls="bottle-service-details"]').getAttribute('aria-expanded'),
      height: await detailsHeight(),
    }
    report.vipPanel = { collapsedHeight: before, hoverHeight: hovered, toggled }

    // Lightbox
    const firstTile = page.getByRole('button', { name: /Open image 1 of/ })
    await firstTile.scrollIntoViewIfNeeded()
    await firstTile.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(900)
    const counter = () => page.evaluate(() => document.querySelector('dialog[aria-label="Gallery viewer"] [aria-live]')?.textContent)
    const first = await counter()
    await page.screenshot({ path: join(outDir, 'desktop-lightbox.png') })
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)
    const afterRight = await counter()
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)
    const wrapped = await counter()
    const imageLoaded = await page.evaluate(() => {
      const img = document.querySelector<HTMLImageElement>('dialog[aria-label="Gallery viewer"] img')
      return !!img && img.complete && img.naturalWidth > 0
    })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    const after = await page.evaluate(() => ({
      open: document.querySelector('dialog[aria-label="Gallery viewer"]')?.hasAttribute('open'),
      focusReturnedTo: document.activeElement?.getAttribute('aria-label')?.slice(0, 30),
    }))
    // "View full gallery" is a link to the gallery page now
    const viewAll = await page.getByRole('link', { name: 'View full gallery' }).getAttribute('href')
    report.lightbox = { first, afterRight, wrapped, imageLoaded, after, viewAll }

    // Gallery: varied frame sizes; hovering a frame slowly scales its image and draws a keyline
    await page.locator('#gallery').scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)
    const sizes = await page.evaluate(() =>
      [...document.querySelectorAll('#gallery ul li')].map((li) => {
        const r = li.getBoundingClientRect()
        return [Math.round(r.width), Math.round(r.height)]
      }),
    )
    const imgScale = () => page.evaluate(() => getComputedStyle(document.querySelectorAll('#gallery ul li img')[1]).scale)
    const scaleBefore = await imgScale()
    await page.locator('#gallery ul li').nth(1).hover()
    await page.waitForTimeout(2200)
    const scaleHover = await imgScale()
    await page.screenshot({ path: join(outDir, 'desktop-gallery-hover.png') })
    report.gallery = { sizes, areaOfLargest: Math.max(...sizes.map(([w, h]) => w * h)), areaOfSmallest: Math.min(...sizes.map(([w, h]) => w * h)), scaleBefore, scaleHover }

    // Credits: the Bruges photographer must be named, in the caption and the footer
    report.credits = await page.evaluate(() => ({
      caption: document.querySelector<HTMLAnchorElement>('#contact a[href*="unsplash.com/@"]')?.textContent?.trim(),
      captionHref: document.querySelector<HTMLAnchorElement>('#contact a[href*="unsplash.com/@"]')?.getAttribute('href'),
      footer: [...document.querySelectorAll('footer details a')].map((a) => a.textContent?.trim()),
    }))

    // Keyboard order from the top of the page
    await open(page)
    const order: string[] = []
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab')
      order.push(await page.evaluate(() => (document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent)?.trim().slice(0, 28) ?? ''))
    }
    report.desktopTabOrder = order
    await open(page)
    await page.keyboard.press('Tab')
    await page.waitForTimeout(300)
    await page.screenshot({ path: join(outDir, 'desktop-skip-link.png'), clip: { x: 0, y: 0, width: 600, height: 160 } })
    await context.close()
  }

  // ---- Mobile: VIP rows ---------------------------------------------------
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await open(page)
    await page.locator('#vip').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    const state = () =>
      page.evaluate(() =>
        ['bottle-service', 'private-lounge', 'private-party'].map((id) => {
          const d = document.getElementById(`${id}-row-details`)!
          return {
            id,
            expanded: document.querySelector(`button[aria-controls="${id}-row-details"]`)?.getAttribute('aria-expanded'),
            height: Math.round(d.getBoundingClientRect().height),
            inert: d.hasAttribute('inert'),
          }
        }),
      )
    const closed = await state()
    await page.locator('button[aria-controls="private-lounge-row-details"]').click()
    await page.waitForTimeout(1100)
    const opened = await state()
    await page.locator('#vip').screenshot({ path: join(outDir, 'mobile-vip-row-open.png') })
    report.vipRows = { closed, opened }
    await context.close()
  }

  // ---- Reduced motion ------------------------------------------------------
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    await open(page)
    await page.waitForTimeout(300)
    const state = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('#home picture')!.parentElement!
      const line = document.querySelector<HTMLElement>('#hero-title > span > span')!
      const strip = document.querySelector<HTMLElement>('#gallery ul')!.parentElement!
      return {
        heroSettleAnimation: getComputedStyle(hero).animationName,
        headlineTransform: getComputedStyle(line).transform,
        galleryClipPath: getComputedStyle(strip).clipPath,
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      }
    })
    await page.screenshot({ path: join(outDir, 'reduced-motion-hero.png') })
    report.reducedMotion = state
    await context.close()
  }

  await browser.close()
  report.finishedAt = new Date().toISOString()
  await writeFile(join(root, 'qa', 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
}

await run()
