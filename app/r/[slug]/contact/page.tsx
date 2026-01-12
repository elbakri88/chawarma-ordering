import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ContactClient from './ContactClient'

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

export default async function ContactPage({ params }: PageProps) {
  const restaurant = await getRestaurant(params.slug)

  if (!restaurant) {
    notFound()
  }

  return <ContactClient restaurant={restaurant} />
}






