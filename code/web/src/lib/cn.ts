// Joins class names, dropping falsy entries. Enough for this site; no
// dependency needed.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
