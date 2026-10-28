import { logo } from '../../content/photos'

/**
 * Zenzo’s logo, unaltered, as published on zenzobar.be (only the transparent
 * margin around it was trimmed). See docs/ASSETS.md.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt="Zenzo"
      decoding="async"
      className={`w-auto select-none ${className}`}
    />
  )
}
