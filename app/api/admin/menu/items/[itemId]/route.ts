import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { itemSchema } from '@/lib/validations'
import { getDefaultRestaurantId } from '@/lib/adminHelper'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const restaurantId = await getDefaultRestaurantId()
    const body = await request.json()
    console.log('Received update data:', body)
    
    const validatedData = itemSchema.partial().parse(body)
    console.log('Validated update data:', validatedData)

    // Verify item belongs to restaurant
    const existingItem = await prisma.item.findFirst({
      where: {
        id: params.itemId,
        category: {
          restaurantId,
        },
      },
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 })
    }

    // If categoryId is being updated, verify it belongs to restaurant
    if (validatedData.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: validatedData.categoryId,
          restaurantId,
        },
      })

      if (!category) {
        return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
      }
    }

    const item = await prisma.item.update({
      where: { id: params.itemId },
      data: validatedData,
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Item update error:', error)
    if (error && typeof error === 'object' && 'issues' in error) {
      // Zod validation error
      const zodError = error as { issues: Array<{ path: string[]; message: string }> }
      const errorMessages = zodError.issues.map((issue) => {
        const field = issue.path.join('.')
        return `${field}: ${issue.message}`
      })
      return NextResponse.json({ error: errorMessages.join(', ') }, { status: 400 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

