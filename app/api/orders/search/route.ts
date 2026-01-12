import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantSlug = searchParams.get('restaurantSlug')
    const phone = searchParams.get('phone')
    const orderId = searchParams.get('orderId')

    if (!restaurantSlug) {
      return NextResponse.json({ error: 'Restaurant requis' }, { status: 400 })
    }

    if (!phone && !orderId) {
      return NextResponse.json({ error: 'Téléphone ou numéro de commande requis' }, { status: 400 })
    }

    // Get restaurant first
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: restaurantSlug },
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant non trouvé' }, { status: 404 })
    }

    // Build where clause
    const where: any = {
      restaurantId: restaurant.id,
    }

    if (phone) {
      where.customerPhone = phone.trim()
    }

    if (orderId) {
      where.id = orderId.trim()
    }

    // Find orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            item: {
              select: {
                nameFr: true,
                nameAr: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to 10 most recent
    })

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Aucune commande trouvée' }, { status: 404 })
    }

    // Return most recent order or all orders
    return NextResponse.json(orders.length === 1 ? orders[0] : orders)
  } catch (error) {
    console.error('Order search error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


