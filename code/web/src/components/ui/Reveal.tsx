'use client'

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// Fade-up once when the element scrolls into view.
//
// The static HTML is fully visible: globals.css only hides [data-reveal]
// elements under html.js, and that class is added here, in a layout effect,
// after hydration. Elements already in the viewport at that point are marked
// "in" in the same synchronous pass, before the browser paints, so nothing
// above the fold flickers or delays the largest contentful paint; only
// content below the fold waits for its scroll-in. One shared observer for the
// whole page; the "in" state is written straight to the DOM, so there is no
// React state and no hydration mismatch.
let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'in')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
  }
  return observer
}

function inViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

type Props = {
  children: ReactNode
  /** Stagger in milliseconds. */
  delay?: number
  as?: 'div' | 'li' | 'section'
  className?: string
}

export function Reveal({ children, delay = 0, as = 'div', className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || inViewport(element)) {
      element.setAttribute('data-reveal', 'in')
      document.documentElement.classList.add('js')
      return
    }
    document.documentElement.classList.add('js')
    const io = getObserver()
    io.observe(element)
    return () => io.unobserve(element)
  }, [])

  const Tag = as as 'div'
  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
