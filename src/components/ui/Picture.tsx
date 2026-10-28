import type { ImgHTMLAttributes } from 'react'
import { photoFile, photoSrcSet, type Photo } from '../../content/photos'

type PictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> & {
  photo: Photo
  /** A different crop to serve below 768px (art direction for phones). */
  mobile?: Photo
  /** Responsive `sizes` hint — keep it honest so the browser fetches the right variant. */
  sizes: string
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean
  /** Pass an empty string when the image is purely decorative. */
  alt?: string
}

export function Picture({ photo, mobile, sizes, priority = false, alt, className, style, ...rest }: PictureProps) {
  const fallbackWidth = photo.widths[Math.min(1, photo.widths.length - 1)]

  return (
    <picture className="contents">
      {mobile && <source media="(max-width: 767px)" type="image/webp" srcSet={photoSrcSet(mobile)} sizes={sizes} />}
      <img
        src={photoFile(photo, fallbackWidth)}
        srcSet={photoSrcSet(photo)}
        sizes={sizes}
        alt={alt ?? photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
        style={{ backgroundColor: photo.tone, ...style }}
        {...rest}
      />
    </picture>
  )
}
