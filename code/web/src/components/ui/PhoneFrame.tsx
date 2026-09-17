import Image, { type StaticImageData } from 'next/image'
import { cn } from '@/lib/cn'

const SIZES = {
  // Bezel radius and padding scale with the rendered width.
  sm: { outer: 'rounded-[1.6rem] p-1', inner: 'rounded-[1.3rem]' },
  md: { outer: 'rounded-[2.2rem] p-1.5', inner: 'rounded-[1.8rem]' },
  lg: { outer: 'rounded-[2.6rem] p-2', inner: 'rounded-[2.1rem]' },
} as const

const TILTS = {
  none: '',
  left: '-rotate-6',
  right: 'rotate-6',
} as const

// CSS-drawn phone bezel around an app screenshot. The image keeps its own
// box (aspect ratio from the static import), so there is no layout shift.
export function PhoneFrame({
  src,
  alt,
  sizes,
  size = 'md',
  tilt = 'none',
  preload = false,
  className,
}: {
  src: StaticImageData
  alt: string
  sizes: string
  size?: keyof typeof SIZES
  tilt?: keyof typeof TILTS
  preload?: boolean
  className?: string
}) {
  return (
    <div className={cn('relative', TILTS[tilt], className)}>
      <div className={cn('bg-slate-950 shadow-phone ring-1 ring-white/15', SIZES[size].outer)}>
        <div className={cn('overflow-hidden bg-court-950', SIZES[size].inner)}>
          <Image
            src={src}
            alt={alt}
            sizes={sizes}
            preload={preload}
            fetchPriority={preload ? 'high' : undefined}
            loading={preload ? 'eager' : 'lazy'}
            placeholder="blur"
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
  )
}
