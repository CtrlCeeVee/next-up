import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // The repo root also has a package-lock.json; pin the workspace root so
  // Turbopack does not infer it from the wrong lockfile.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Product routes retired when the app moved native (June 2026). /auth was
  // indexed with real clicks, so it and the other old paths 308 to the
  // homepage instead of 404ing. /league/:id will point at club pages once
  // those exist.
  async redirects() {
    return [
      { source: '/auth', destination: '/', permanent: true },
      { source: '/leagues', destination: '/leagues/johannesburg', permanent: true },
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
