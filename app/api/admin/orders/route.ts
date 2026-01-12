import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDefaultRestaurantId } from '@/lib/adminHelper'

export async function GET(request: NextRequest) {
  try {
    const restaurantId = await getDefaultRestaurantId()

    const orders = await prisma.order.findMany({
      where: { restaurantId },
      include: {
        items: {
          include: {
            item: true,
            modifiers: {
              include: {
                modifierOption: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Convertir les Decimal en Number pour la sérialisation JSON
    const serializedOrders = orders.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map(orderItem => ({
        ...orderItem,
        unitPrice: Number(orderItem.unitPrice),
        totalPrice: Number(orderItem.totalPrice),
        modifiers: orderItem.modifiers.map(modifier => ({
          ...modifier,
          unitPrice: Number(modifier.unitPrice),
          totalPrice: Number(modifier.totalPrice),
        })),
      })),
    }))

    return NextResponse.json(serializedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur serveur lors du chargement des commandes' 
      },
      { status: 500 }
    )
  }
}





