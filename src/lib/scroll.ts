export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scrolls to a section after a modal closes. Deferred one frame so the page is
 * no longer scroll-locked by the open dialog.
 */
export function scrollToSection(id: string) {
  requestAnimationFrame(() => {
    const target = document.getElementById(id)
    if (!target) return
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  })
}
