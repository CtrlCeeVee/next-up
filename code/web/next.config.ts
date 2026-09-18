import type { NextConfig } from 'next'
import path from 'node:path'
import { ACTIVE_CLUBS, clubPath } from './src/lib/clubs'

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // The repo root also has a package-lock.json; pin the workspace root so
  // Turbopack does not infer it from the wrong lockfile.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Product routes retired when the app moved native (June 2026). /auth was
  // indexed with real clicks, so it and the other old paths 308 to the
  // homepage instead of 404ing. /league/<id> for a listed club goes to that
  // club's page; any other id falls through to the homepage.
  async redirects() {
    return [
      { source: '/auth', destination: '/', permanent: true },
      { source: '/leagues', destination: '/leagues/johannesburg', permanent: true },
      ...ACTIVE_CLUBS.map((club) => ({
        source: `/league/${club.id}`,
        destination: clubPath(club),
        permanent: true,
      })),
      { source: '/league/:id', destination: '/', permanent: true },
      { source: '/league/:id/night/:nightId', destination: '/', permanent: true },
      { source: '/leaderboard', destination: '/', permanent: true },
      { source: '/profile', destination: '/', permanent: true },
      { source: '/profile/:username', destination: '/', permanent: true },
      // Password reset is handled entirely in the app (owner, 2026-09-07).
      { source: '/reset-password', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
