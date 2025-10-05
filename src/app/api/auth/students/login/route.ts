// src/app/api/auth/students/login/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        const payload = await getPayload({ config })


        const result = await payload.login({
            collection: 'students',
            data: { email, password },
        })

        if (!result?.token) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const res = NextResponse.json(
            {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                },
            },
            { status: 200 }
        )

        res.cookies.set({
            name: 'students-token',
            value: result.token,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        })

        return res
    } catch (err: any) {
        console.error('Login error:', err)
        return NextResponse.json({ error: 'Login failed' }, { status: 500 })
    }
}