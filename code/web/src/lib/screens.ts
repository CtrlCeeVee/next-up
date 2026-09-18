// App screenshots shown in phone frames. Cropped from the public App Store
// listing (screen area only); replace with raw app screenshots of the same
// names to upgrade quality. Static imports give next/image the dimensions
// and a blur placeholder at build time.
import event from '../../public/app/event.png'
import home from '../../public/app/home.png'
import ranking from '../../public/app/ranking.png'
import score from '../../public/app/score.png'
import stats from '../../public/app/stats.png'

export const SCREENS = {
  home: { src: home, alt: 'Next-Up app home screen with a live league night and upcoming matches' },
  event: { src: event, alt: 'Next-Up app league night screen showing a live match and partnership' },
  score: { src: score, alt: 'Next-Up app score submission screen' },
  ranking: { src: ranking, alt: 'Next-Up app live league night rankings' },
  stats: { src: stats, alt: 'Next-Up app player statistics screen' },
} as const
