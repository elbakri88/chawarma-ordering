import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import LocationClient from './LocationClient'

interface PageProps {
  params: {
    slug: string
  }
}

async function getRestaurant(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
  })
  return restaurant
}

export default async function LocationPage({ params }: PageProps) {
  const restaurant = await getRestaurant(params.slug)

  if (!restaurant) {
    notFound()
  }

  return <LocationClient restaurant={restaurant} />
}


