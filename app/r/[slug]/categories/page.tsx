import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CategoriesClient from './CategoriesClient'

interface PageProps {
  params: {
    slug: string
  }
}

async function getRestaurant(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      categories: {
        where: { isActive: true },
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
      },
    },
  })
  
  // Deduplicate categories by ID and name at the server level
  if (restaurant && restaurant.categories) {
    const seenIds = new Set<string>()
    const seenNames = new Set<string>()
    const uniqueCategories = restaurant.categories.filter((category) => {
      // Check both ID and name to catch duplicates
      const isDuplicate = seenIds.has(category.id) || seenNames.has(category.nameFr)
      if (isDuplicate) {
        return false
      }
      seenIds.add(category.id)
      seenNames.add(category.nameFr)
      return true
    })
    // Return new object with deduplicated categories to avoid mutation
    return {
      ...restaurant,
      categories: uniqueCategories,
    }
  }
  
  return restaurant
}

export default async function CategoriesPage({ params }: PageProps) {
  const restaurant = await getRestaurant(params.slug)

  if (!restaurant) {
    notFound()
  }

  return <CategoriesClient restaurant={restaurant} />
}

