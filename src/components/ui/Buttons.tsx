import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { PageRoute } from '../../lib/routing'
import { Link } from './Link'

/**
 * Either an external/in-page URL (`href`) or an internal page (`to`, optionally with a `hash`).
 * External links open in a new tab and show the diagonal arrow.
 */
type Target = { href: string; to?: never; hash?: never } | { to: PageRoute; hash?: string; href?: never }

type LinkProps = Target & {
  children: ReactNode
  external?: boolean
  className?: string
}

type ArrowLinkProps = (Target | { href?: undefined; to?: undefined; hash?: undefined }) & {
  children: ReactNode
  external?: boolean
  className?: string
  /** With neither `href` nor `to`, a button is rendered (e.g. to open the viewer). */
  onClick?: () => void
  /** Associates the button with a dialog it opens. */
  haspopup?: 'dialog'
}

const externalProps = { target: '_blank', rel: 'noopener noreferrer' }

/** Renders an internal route link or a plain anchor, from the same props. */
function Anchor({
  to,
  hash,
  href,
  external,
  className,
  children,
}: {
  to?: PageRoute
  hash?: string
  href?: string
  external?: boolean
  className: string
  children: ReactNode
}) {
  if (to) {
    return (
      <Link to={to} hash={hash} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} {...(external ? externalProps : {})} className={className}>
      {children}
    </a>
  )
}

/** Outlined button: a thin gold frame that fills with gold on hover. */
export function OutlineButton({ children, external = false, className = '', ...target }: LinkProps) {
  const Icon = external ? ArrowUpRight : ArrowRight
  return (
    <Anchor
      {...target}
      external={external}
      className={`eyebrow group relative inline-flex items-center justify-between gap-8 overflow-hidden border border-gold/70 px-6 py-[1.05rem] text-bone transition-colors duration-700 ease-out-expo hover:text-ink ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
      />
      <span className="relative">{children}</span>
      <Icon
        aria-hidden="true"
        strokeWidth={1.25}
        className="relative size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
      />
    </Anchor>
  )
}

/** Text link (or button) with a gold underline and a small arrow. */
export function ArrowLink({ onClick, haspopup, children, external = false, className = '', ...target }: ArrowLinkProps) {
  const Icon = external ? ArrowUpRight : ArrowRight
  const classes = `eyebrow group inline-flex items-center gap-3 border-b border-line-strong pb-1.5 text-bone transition-colors duration-500 hover:border-gold hover:text-gold-soft ${className}`
  const icon = (
    <Icon
      aria-hidden="true"
      strokeWidth={1.25}
      className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
    />
  )
  if (target.href === undefined && target.to === undefined) {
    return (
      <button type="button" onClick={onClick} aria-haspopup={haspopup} className={classes}>
        {children}
        {icon}
      </button>
    )
  }
  return (
    <Anchor {...(target as Target)} external={external} className={classes}>
      {children}
      {icon}
    </Anchor>
  )
}
