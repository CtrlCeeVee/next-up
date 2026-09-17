import { cn } from '@/lib/cn'

const SIZES = {
  sm: 'h-10 w-10 rounded-xl text-sm',
  md: 'h-12 w-12 rounded-2xl text-base',
  lg: 'h-16 w-16 rounded-2xl text-xl',
} as const

/** "Northcliff Eagles" -> "NE", "GPC Pickleball" -> "GP". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

// Club initials on the logo gradient. A visual anchor for club cards and
// club pages until clubs supply logos.
export function Monogram({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center bg-logo-gradient font-display font-bold text-white shadow-md shadow-logo-blue/20',
        SIZES[size],
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  )
}
