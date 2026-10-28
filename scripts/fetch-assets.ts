/**
 * Downloads the source assets used by the concept build into assets-src/ (git-ignored):
 *   - Zenzo's logo and four photographs, from the public zenzobar.be site
 *   - one Bruges stock photograph (Unsplash, free licence) for the location panel
 *
 * Assets are fetched once at build-preparation time and served locally; the
 * site never hotlinks zenzobar.be at runtime. Provenance is recorded in docs/ASSETS.md.
 *
 *   npm run assets:fetch
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const sources = [
  { url: 'https://zenzobar.be/images/logo.png', out: 'zenzo/logo.png' },
  { url: 'https://zenzobar.be/images/favicon_io/favicon-32x32.png', out: 'zenzo/favicon-32x32.png' },
  { url: 'https://zenzobar.be/images/example1.jpg', out: 'zenzo/example1.jpg' },
  { url: 'https://zenzobar.be/images/example2.jpg', out: 'zenzo/example2.jpg' },
  { url: 'https://zenzobar.be/images/example3.jpg', out: 'zenzo/example3.jpg' },
  { url: 'https://zenzobar.be/images/example4.jpg', out: 'zenzo/example4.jpg' },
  // Bruges at night — Cedric Letsch, Unsplash (https://unsplash.com/photos/Tp5qZakZUrg)
  { url: 'https://images.unsplash.com/photo-1767705411904-3f41d97acf12?w=2400&q=85&fm=jpg', out: 'stock/city.jpg' },
]

for (const { url, out } of sources) {
  const target = join(root, 'assets-src', out)
  try {
    await stat(target)
    console.log(`have     ${out}`)
    continue
  } catch {
    // not downloaded yet
  }
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, Buffer.from(await res.arrayBuffer()))
  console.log(`fetched  ${out}`)
}
