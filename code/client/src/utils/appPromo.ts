// code/client/src/utils/appPromo.ts
// Central config for promoting the native Next-Up apps from the (now
// marketing-only) website. All interactive web routes funnel users here.

export const APP_STORE_URL =
  'https://apps.apple.com/za/app/nextup-sport/id6766297118'
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.nextupsport.app'

export type Platform = 'ios' | 'android' | 'desktop'

// Best-effort client detection so we can surface the right store first.
export function getPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent || ''

  // iPadOS 13+ reports a desktop Safari UA, so fall back to a touch check.
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) &&
      typeof document !== 'undefined' &&
      'ontouchend' in document)

  if (isIOS) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'desktop'
}

// Fire a GA event (gtag is loaded in index.html) so app conversion is
// measurable. No-op if analytics is unavailable.
export function trackDownloadClick(store: 'app_store' | 'play_store') {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (typeof w.gtag === 'function') {
    w.gtag('event', 'app_download_click', { store })
  }
}
