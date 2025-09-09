import { useState, useEffect } from 'react'
import { leaguesAPI } from '../services/api'

export interface League {
  id: number
  name: string
  description: string
  location: string
  address: string
  leagueDays: string[]
  startTime: string
  totalPlayers: number
  isActive: boolean
  // Deprecated - keeping for backward compatibility, can be removed later
  skillLevel?: string
}

export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeagues() {
      try {
        setLoading(true)
        const data = await leaguesAPI.getAll()
        setLeagues(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leagues')
      } finally {
        setLoading(false)
      }
    }

    fetchLeagues()
  }, [])

  return { leagues, loading, error }
}

export function useLeague(leagueId: number) {
  const [league, setLeague] = useState<League | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeague() {
      try {
        setLoading(true)
        const data = await leaguesAPI.getById(leagueId)
        setLeague(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch league')
      } finally {
        setLoading(false)
      }
    }

    if (leagueId > 0) {
      fetchLeague()
    }
  }, [leagueId])

  return { league, loading, error }
}