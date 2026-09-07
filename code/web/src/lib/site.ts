// Site-wide constants. Keep every external URL and identity string here so
// metadata, structured data and components never drift apart.

export const SITE_URL = 'https://www.next-up.co.za'
export const SITE_NAME = 'Next-Up'
export const LEGAL_NAME = 'Nextup Sport (Pty) Ltd'
export const APP_NAME = 'NextUp Sport'
export const CONTACT_EMAIL = 'luke.renton@next-up.co.za'

export const APP_STORE_ID = '6766297118'
export const APP_STORE_URL = `https://apps.apple.com/za/app/nextup-sport/id${APP_STORE_ID}`
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.nextupsport.app'

export const GA_MEASUREMENT_ID = 'G-72E690CQ8R'

export const ORGANIZATION_ID = `${SITE_URL}/#organization`

// Marketing numbers shown on the homepage. Replace with live Supabase counts
// once the clubs increment lands.
export const STATS = {
  activePlayers: 300,
  matchesPlayed: 1000,
}
