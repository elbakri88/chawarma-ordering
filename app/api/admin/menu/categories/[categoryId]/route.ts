import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations'
import { getDefaultRestaurantId } from '@/lib/adminHelper'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const restaurantId = await getDefaultRestaurantId()
    
    // Verify category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.categoryId },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    if (existingCategory.restaurantId !== restaurantId) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    const category = await prisma.category.update({
      where: { id: params.categoryId },
      data: validatedData,
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Category update error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const restaurantId = await getDefaultRestaurantId()
    
    // Verify category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.categoryId },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    if (existingCategory.restaurantId !== restaurantId) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    // Soft delete by setting isActive to false
    await prisma.category.update({
      where: { id: params.categoryId },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Category delete error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

