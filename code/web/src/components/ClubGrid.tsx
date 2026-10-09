import { ClubCard } from '@/components/ClubCard'
import { Reveal } from '@/components/ui/Reveal'
import type { Club } from '@/lib/clubs'
import { cn } from '@/lib/cn'

// Club cards laid out for the number of clubs: one centred card, two side by
// side, or three across on desktop (two on tablets, an odd last card centred).
export function ClubGrid({ clubs, anchors = false }: { clubs: Club[]; anchors?: boolean }) {
  const many = clubs.length >= 3
  return (
    <div
      className={cn(
        'mx-auto grid grid-cols-1 gap-6',
        clubs.length === 1 && 'max-w-xl',
        clubs.length === 2 && 'max-w-4xl md:grid-cols-2 md:gap-8',
        many && 'max-w-6xl md:grid-cols-2 md:gap-8 lg:grid-cols-3',
      )}
    >
      {clubs.map((club, index) => (
        <div
          key={club.id}
          id={anchors ? club.slug : undefined}
          className={cn(
            'h-full',
            anchors && 'scroll-mt-20',
            many &&
              index === clubs.length - 1 &&
              clubs.length % 2 === 1 &&
              'md:col-span-2 md:mx-auto md:w-[calc(50%-1rem)] lg:col-span-1 lg:mx-0 lg:w-auto',
          )}
        >
          <Reveal delay={index * 90} className="h-full">
            <ClubCard club={club} />
          </Reveal>
        </div>
      ))}
    </div>
  )
}
