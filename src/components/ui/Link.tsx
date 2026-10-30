import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { hrefFor, navigate, useLang, type PageRoute } from '../../lib/routing'

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: PageRoute
  hash?: string
}

/**
 * An ordinary <a> with a real URL — so it opens in a new tab, can be copied and works
 * without JavaScript — that navigates client-side on a plain click.
 */
export function Link({ to, hash, onClick, children, ...rest }: LinkProps) {
  const href = hrefFor(to, useLang(), hash)

  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(href)
  }

  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
