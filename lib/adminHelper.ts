import { prisma } from '@/lib/prisma'

/**
 * Get the default restaurant ID (zen-acham)
 * Authentication is disabled, so we always return the default restaurant
 */
export async function getDefaultRestaurantId(): Promise<string> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: 'zen-acham' },
    select: { id: true },
  })

  if (!restaurant) {
    throw new Error('Restaurant zen-acham not found')
  }

  return restaurant.id
}






