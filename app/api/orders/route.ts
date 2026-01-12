import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { orderSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = orderSchema.parse(body)

    // Calculate total
    let totalAmount = 0

    for (const itemData of validatedData.items) {
      const item = await prisma.item.findUnique({
        where: { id: itemData.itemId },
        include: {
          modifiers: {
            include: {
              options: true,
            },
          },
        },
      })

      if (!item || !item.isAvailable) {
        return NextResponse.json(
          { error: `L'article ${itemData.itemId} n'est pas disponible` },
          { status: 400 }
        )
      }

      const itemPrice = Number(item.price) * itemData.quantity
      let modifiersPrice = 0

      if (itemData.modifiers) {
        for (const mod of itemData.modifiers) {
          const option = item.modifiers
            .flatMap((m) => m.options)
            .find((o) => o.id === mod.modifierOptionId)

          if (option) {
            modifiersPrice += Number(option.price) * mod.quantity
          }
        }
      }

      totalAmount += itemPrice + modifiersPrice
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        restaurantId: validatedData.restaurantId,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        orderType: validatedData.orderType,
        pickupTime: validatedData.pickupTime
          ? new Date(`${new Date().toISOString().split('T')[0]}T${validatedData.pickupTime}`)
          : null,
        totalAmount,
        notes: validatedData.items.find((i) => i.notes)?.notes,
        status: 'NEW',
        items: {
          create: await Promise.all(
            validatedData.items.map(async (itemData) => {
              const item = await prisma.item.findUnique({
                where: { id: itemData.itemId },
                include: {
                  modifiers: {
                    include: {
                      options: true,
                    },
                  },
                },
              })

              if (!item) throw new Error('Item not found')

              const unitPrice = Number(item.price)
              let modifiersTotal = 0

              if (itemData.modifiers) {
                for (const mod of itemData.modifiers) {
                  const option = item.modifiers
                    .flatMap((m) => m.options)
                    .find((o) => o.id === mod.modifierOptionId)

                  if (option) {
                    modifiersTotal += Number(option.price) * mod.quantity
                  }
                }
              }

              const totalPrice = (unitPrice + modifiersTotal) * itemData.quantity

              return {
                itemId: itemData.itemId,
                quantity: itemData.quantity,
                unitPrice,
                totalPrice,
                notes: itemData.notes,
                modifiers: {
                  create:
                    itemData.modifiers?.map((mod) => {
                      const option = item.modifiers
                        .flatMap((m) => m.options)
                        .find((o) => o.id === mod.modifierOptionId)

                      return {
                        modifierOptionId: mod.modifierOptionId,
                        quantity: mod.quantity,
                        unitPrice: option ? Number(option.price) : 0,
                        totalPrice: option ? Number(option.price) * mod.quantity : 0,
                      }
                    }) || [],
                },
              }
            })
          ),
        },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}










