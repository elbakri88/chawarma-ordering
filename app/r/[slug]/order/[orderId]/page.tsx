import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

interface PageProps {
  params: {
    slug: string
    orderId: string
  }
}

async function getOrder(orderId: string, restaurantSlug: string) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      restaurant: {
        slug: restaurantSlug,
      },
    },
    include: {
      restaurant: true,
      items: {
        include: {
          item: true,
          modifiers: {
            include: {
              modifierOption: true,
            },
          },
        },
      },
    },
  })
  return order
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const order = await getOrder(params.orderId, params.slug)

  if (!order) {
    notFound()
  }

  const statusLabels = {
    NEW: 'Nouvelle',
    PREPARING: 'En préparation',
    READY: 'Prête',
    SERVED: 'Servie',
    CANCELLED: 'Annulée',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-dark to-primary flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 border-4 border-gold shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-primary mb-2">Commande reçue !</h1>
          <p className="text-gray-600">Merci pour votre commande</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Numéro de commande</p>
            <p className="font-semibold text-primary">{order.id.slice(0, 8).toUpperCase()}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <p className="font-semibold text-primary">{statusLabels[order.status]}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-semibold text-primary">
              {order.orderType === 'DINE_IN' ? 'Sur place' : 'À emporter'}
            </p>
          </div>

          {order.pickupTime && (
            <div>
              <p className="text-sm text-gray-500">Heure de retrait</p>
              <p className="font-semibold text-primary">
                {new Date(order.pickupTime).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold text-2xl text-gold">
              {formatPrice(Number(order.totalAmount), order.restaurant.currency)}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Articles commandés</h3>
          <div className="space-y-2">
            {order.items.map((orderItem) => (
              <div key={orderItem.id} className="flex justify-between text-sm">
                <span>
                  {orderItem.item.nameFr} × {orderItem.quantity}
                </span>
                <span className="font-semibold">
                  {formatPrice(Number(orderItem.totalPrice), order.restaurant.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href={`/r/${params.slug}`}
            className="text-gold hover:text-gold/80 font-semibold"
          >
            Retour au menu
          </a>
        </div>
      </div>
    </div>
  )
}





