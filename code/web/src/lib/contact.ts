// Shared between the contact form (client) and its server action. Lives
// outside actions.ts because a 'use server' module may only export async
// functions.
export const TOPICS = [
  'Joining a league',
  'League night support',
  'Next-Up for my club',
  'My account',
  'Something else',
] as const

export type Topic = (typeof TOPICS)[number]
