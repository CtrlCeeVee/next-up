'use client'

import { useLayoutEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

function preferredTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}

// The icon pair is switched purely with CSS (dark: variant) so the server
// markup never depends on the user's preference and hydration stays clean.
export function ThemeToggle() {
  // React Strict Mode remounts once in development and resets the <html>
  // attributes the inline script set. Re-apply here; no-op in production.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', preferredTheme() === 'dark')
  }, [])

  function toggle() {
    const dark = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch {
      // Storage unavailable (private mode); the toggle still works for this page.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="group rounded-full p-2 text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
    >
      <Moon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 dark:hidden" />
      <Sun className="hidden h-5 w-5 text-ball transition-transform duration-300 group-hover:rotate-12 dark:block" />
    </button>
  )
}
