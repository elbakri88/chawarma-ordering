import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { adminLoginSchema } from '@/lib/validations'
import * as bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = adminLoginSchema.parse(body)

    const admin = await prisma.admin.findUnique({
      where: { email },
      include: { restaurant: true },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash)

    if (!isValid) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 })
    }

    const token = sign(
      { adminId: admin.id, restaurantId: admin.restaurantId },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        restaurantId: admin.restaurantId,
      },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}










