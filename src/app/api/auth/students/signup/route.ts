// src/app/api/auth/students/signup/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
    const { email, password, name, class: klass, school, age } = await req.json()
    console.log(req.body)

    if (!email || !password) {
        return NextResponse.json({ error: 'email and password required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    try {
        await payload.create({
            collection: 'students',
            data: { email, password, name, class: klass, school, age },
        })

        const { token, user } = await payload.login({
            collection: 'students',
            data: { email, password },
        })

        if (!token) return NextResponse.json({ error: 'login failed: missing token' }, { status: 500 })

        const res = NextResponse.json(
            { user: { id: user.id, email: user.email, name: user.name } },
            { status: 201 },
        )

        res.cookies.set({
            name: 'students-token',
            value: token,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        })

        return res
    } catch (err: any) {
        console.error(err)
        const msg = typeof err?.message === 'string' ? err.message : 'signup error'
        const code = /duplicate|unique/i.test(msg) ? 409 : 500
        return NextResponse.json({ error: msg }, { status: code })
    }
}