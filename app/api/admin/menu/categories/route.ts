import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations'
import { getDefaultRestaurantId } from '@/lib/adminHelper'

export async function GET(request: NextRequest) {
  try {
    const restaurantId = await getDefaultRestaurantId()

    console.log('Fetching categories for restaurant:', restaurantId)

    const categories = await prisma.category.findMany({
      where: { 
        restaurantId,
        isActive: true,
      },
      include: {
        items: {
          where: { isAvailable: true },
          include: {
            modifiers: {
              where: { isRequired: false },
              include: {
                options: {
                  where: { isAvailable: true },
                  orderBy: { displayOrder: 'asc' },
                },
              },
              orderBy: { displayOrder: 'asc' },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    })

    console.log(`Found ${categories.length} categories`)
    
    // Convertir les Decimal en Number pour la sérialisation JSON
    const serializedCategories = categories.map(category => ({
      ...category,
      items: category.items.map(item => ({
        ...item,
        price: Number(item.price),
        modifiers: item.modifiers.map(modifier => ({
          ...modifier,
          options: modifier.options.map(option => ({
            ...option,
            price: Number(option.price),
          })),
        })),
      })),
    }))
    
    return NextResponse.json(serializedCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur serveur lors du chargement des catégories' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const restaurantId = await getDefaultRestaurantId()
    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        restaurantId,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Category creation error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}





