import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { itemSchema } from '@/lib/validations'
import { getDefaultRestaurantId } from '@/lib/adminHelper'

export async function POST(request: NextRequest) {
  try {
    const restaurantId = await getDefaultRestaurantId()
    const body = await request.json()
    console.log('Received data:', body)
    
    const validatedData = itemSchema.parse(body)
    console.log('Validated data:', validatedData)

    // Verify category belongs to restaurant
    const category = await prisma.category.findFirst({
      where: {
        id: validatedData.categoryId,
        restaurantId,
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    const item = await prisma.item.create({
      data: validatedData,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Item creation error:', error)
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



