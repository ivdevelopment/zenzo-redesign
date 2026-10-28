import { m, useInView, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

const ease = [0.16, 1, 0.3, 1] as const

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Vertical travel in px. Motion drops transforms for reduced-motion users (see MotionConfig). */
  y?: number
  as?: 'div' | 'li' | 'p' | 'figure' | 'header' | 'span'
}

/** Fades and lifts content once as it enters the viewport. */
export function Reveal({ children, className, delay = 0, y = 18, as = 'div' }: RevealProps) {
  const Component = m[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </Component>
  )
}

/** Masked line reveal for display typography. */
export function LineReveal({
  children,
  delay = 0,
  className,
  innerClassName = '',
  immediate = false,
}: {
  children: ReactNode
  delay?: number
  className?: string
  /** Classes for the moving line itself (e.g. a text gradient, which must sit on the animated element). */
  innerClassName?: string
  /** Animate on mount rather than on scroll (used in the hero). */
  immediate?: boolean
}) {
  // Observe the visible mask, not the moving line: the line starts fully clipped away,
  // so an observer on it would never see it intersect.
  const mask = useRef<HTMLSpanElement>(null)
  const seen = useInView(mask, { once: true, margin: '0px 0px -8% 0px' })
  return (
    <span ref={mask} className={`block overflow-hidden pb-[0.1em] ${className ?? ''}`}>
      <m.span
        className={`block ${innerClassName}`}
        initial={{ y: '108%' }}
        animate={{ y: immediate || seen ? '0%' : '108%' }}
        transition={{ duration: 1.2, delay, ease }}
      >
        {children}
      </m.span>
    </span>
  )
}

/**
 * Unveils an image with a clip wipe the first time it scrolls into view.
 * Reduced-motion visitors get the finished frame with no wipe.
 */
export function ClipFrame({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <m.div
      className={className}
      initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.2, delay, ease }}
    >
      {children}
    </m.div>
  )
}
