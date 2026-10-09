import type { Metadata } from 'next'
import { RegionLeagues } from '@/components/RegionLeagues'
import { clubsInRegion, regionPath, REGIONS } from '@/lib/clubs'

const region = REGIONS.portAlfred
const clubs = clubsInRegion(region)
const path = regionPath(region)

export const metadata: Metadata = {
  title: { absolute: `Pickleball Leagues in ${region.name} | Next-Up` },
  description: `Play pickleball in Port Alfred, Eastern Cape: ${clubs
    .map((club) => `${club.name} at the ${club.venue} in Thornhill`)
    .join(' and ')}. Tuesday and Saturday sessions for Port Alfred and Nemato, with matchmaking in the free Next-Up app.`,
  alternates: { canonical: path },
  openGraph: {
    url: path,
    title: `Pickleball Leagues in ${region.name}`,
    description:
      'Weekly social pickleball in Port Alfred and Nemato, Eastern Cape. Check in on the app and get matched into games all session.',
  },
}

export default function PortAlfredPage() {
  return (
    <RegionLeagues
      region={region}
      intro={
        <>
          Pickleball in Port Alfred runs on Next-Up. Kowie Pickleball hosts
          Tuesday evening and Saturday afternoon sessions for Port Alfred and
          Nemato on the indoor courts at the Titi Jonas Multi-Purpose Community
          Centre in Thornhill. Check in on the app when you arrive and get
          matched into games all session. Players of every level are welcome,
          including first-timers.
        </>
      }
    />
  )
}
