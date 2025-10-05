// src/hooks/useUser.ts
'use client'

import { useEffect, useState } from 'react'

export function useUser() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/students/me', {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('no session')

        const data = await res.json()
        if (!cancelled) setUser(data.user)
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setIsUserLoading(false)
      }
    }
    fetchUser()
    return () => {
      cancelled = true
    }
  }, [])

  return { user, isUserLoading }
}