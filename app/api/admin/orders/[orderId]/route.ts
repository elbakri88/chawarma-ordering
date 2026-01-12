import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { orderStatusSchema } from '@/lib/validations'
import { getDefaultRestaurantId } from '@/lib/adminHelper'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const restaurantId = await getDefaultRestaurantId()
    const body = await request.json()
    const { status } = body

    const validatedStatus = orderStatusSchema.parse(status)

    const order = await prisma.order.findFirst({
      where: {
        id: params.orderId,
        restaurantId,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: { status: validatedStatus },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Order update error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}





