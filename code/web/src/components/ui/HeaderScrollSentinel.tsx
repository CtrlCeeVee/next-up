'use client'

import { useEffect, useRef } from 'react'

// A 1px marker at the top of the page. When it leaves the viewport the page
// has scrolled, and <html data-scrolled> lets CSS give the sticky header its
// shadow. IntersectionObserver instead of a scroll listener: no work on the
// main thread while scrolling.
export function HeaderScrollSentinel() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const io = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.toggleAttribute('data-scrolled', !entry.isIntersecting)
      },
      { threshold: 0 },
    )
    io.observe(element)
    return () => io.disconnect()
  }, [])

  return <div ref={ref} aria-hidden="true" className="absolute top-0 left-0 h-px w-px" />
}
