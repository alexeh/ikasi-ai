export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { jwtVerify } from 'jose'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('students-token')
  if (!tokenCookie?.value) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const token = tokenCookie.value
  const payload = await getPayload({ config })
  let verified: any
  try {
    const secretKey = new TextEncoder().encode(payload.secret)
    const result = await jwtVerify(token, secretKey)
    verified = result.payload
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  if (verified.collection !== 'students') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const user = await payload.findByID({ id: verified.id, collection: 'students' })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json(
    { user: { id: user.id, email: user.email, name: user.name } },
    { status: 200 },
  )
}