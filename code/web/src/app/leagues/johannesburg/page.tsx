import type { Metadata } from 'next'
import { RegionLeagues } from '@/components/RegionLeagues'
import { clubsInRegion, regionPath, REGIONS } from '@/lib/clubs'

const region = REGIONS.johannesburg
const clubs = clubsInRegion(region)
const path = regionPath(region)

export const metadata: Metadata = {
  title: { absolute: `Pickleball Leagues in ${region.name} | Next-Up` },
  description: `Join a Next-Up pickleball league in Johannesburg: ${clubs
    .map((club) => `${club.name} at ${club.venue} in ${club.city}`)
    .join(' and ')}. Weekly league nights, automatic matchmaking and live standings in the free app.`,
  alternates: { canonical: path },
  openGraph: {
    url: path,
    title: `Pickleball Leagues in ${region.name}`,
    description:
      'Weekly competitive social pickleball leagues at clubs across Johannesburg. Check in on the app and get matched all night.',
  },
}

export default function JohannesburgPage() {
  return (
    <RegionLeagues
      region={region}
      intro={
        <>
          Next-Up runs weekly competitive social pickleball leagues at clubs
          across Johannesburg, from Randburg to Sandton. Turn up on league
          night, check in on the app, and get matched into games all evening.
          Players of every level are welcome.
        </>
      }
    />
  )
}
