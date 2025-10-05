'use client'

import { useEffect, useState } from 'react'

type UserRole = 'admin' | 'student'

export function useUserRole() {
  const [email, setEmail] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/students/me', {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('not authenticated')

        const data = await res.json()
        setEmail(data.user?.email ?? null)
        setRole(data.user?.role ?? 'student')
      } catch {
        setEmail(null)
        setRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { role, isLoading, email }
}