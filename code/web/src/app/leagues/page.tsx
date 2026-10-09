import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ClubGrid } from '@/components/ClubGrid'
import { PageIntro } from '@/components/PageIntro'
import { LeagueClosers } from '@/components/RegionLeagues'
import { Section } from '@/components/ui/Section'
import { ACTIVE_CLUBS, activeRegions, clubsInRegion, LEAGUES_PATH, regionPath } from '@/lib/clubs'
import { breadcrumbSchema, clubListSchema, jsonLdGraph, type Crumb } from '@/lib/schema'

const regions = activeRegions()
const regionNames = regions.map((region) => region.name)
const placeList =
  regionNames.length > 1
    ? `${regionNames.slice(0, -1).join(', ')} and ${regionNames[regionNames.length - 1]}`
    : regionNames[0]

export const metadata: Metadata = {
  title: { absolute: 'Pickleball Leagues in South Africa | Next-Up' },
  description: `Find a pickleball league in South Africa. Next-Up runs weekly league nights in ${placeList}: ${ACTIVE_CLUBS.map(
    (club) => club.name,
  ).join(', ')}. Automatic matchmaking and live standings in the free app.`,
  alternates: { canonical: LEAGUES_PATH },
  openGraph: {
    url: LEAGUES_PATH,
    title: 'Pickleball Leagues in South Africa',
    description: `Weekly pickleball league nights in ${placeList}. Check in on the app and get matched into games all night.`,
  },
}

const crumbs: Crumb[] = [
  { name: 'Home', path: '/' },
  { name: 'Leagues', path: LEAGUES_PATH },
]

export default function LeaguesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdGraph(
            clubListSchema('Next-Up pickleball leagues in South Africa', LEAGUES_PATH, ACTIVE_CLUBS),
            breadcrumbSchema(crumbs),
          ),
        }}
      />

      <Section tone="navy" size="sm" width="wide">
        <Breadcrumbs crumbs={crumbs} />
        <PageIntro icon={MapPin} badge="South Africa" title="Pickleball Leagues in South Africa">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Next-Up runs weekly social pickleball leagues at clubs in {placeList}.
            Pick the club nearest you, check in on the app when you arrive, and
            get matched into games all session. Players of every level are
            welcome.
          </p>
        </PageIntro>
      </Section>

      <Section size="md" width="wide">
        <div className="space-y-16 sm:space-y-20">
          {regions.map((region) => {
            const clubs = clubsInRegion(region)
            return (
              <section key={region.slug} aria-labelledby={`region-${region.slug}`}>
                <div className="mb-8 text-center">
                  <h2
                    id={`region-${region.slug}`}
                    className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
                  >
                    Pickleball in {region.name}
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {region.province} · {clubs.length} {clubs.length === 1 ? 'club' : 'clubs'}
                  </p>
                </div>
                <ClubGrid clubs={clubs} />
                <p className="mt-8 text-center">
                  <Link
                    href={regionPath(region)}
                    className="inline-flex items-center gap-2 font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Venues and league nights in {region.name}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </p>
              </section>
            )
          })}

          <LeagueClosers />
        </div>
      </Section>
    </>
  )
}
