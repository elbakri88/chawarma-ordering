'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Restaurant } from '@prisma/client'

type Order = {
  id: string
  customerName: string
  customerPhone: string
  orderType: 'DINE_IN' | 'TAKEAWAY'
  status: 'NEW' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED'
  totalAmount: number
  pickupTime: string | null
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    notes: string | null
    item: {
      nameFr: string
      nameAr: string | null
    }
  }>
}

const statusLabels = {
  NEW: 'Nouvelle',
  PREPARING: 'En préparation',
  READY: 'Prête',
  SERVED: 'Servie',
  CANCELLED: 'Annulée',
}

const statusColors = {
  NEW: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  PREPARING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  READY: 'bg-green-500/20 text-green-300 border-green-500/30',
  SERVED: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  CANCELLED: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function OrderStatusPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [phone, setPhone] = useState('')
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchBy, setSearchBy] = useState<'phone' | 'orderId'>('phone')

  const fetchRestaurant = async () => {
    if (!slug) return
    try {
      const res = await fetch(`/api/restaurants/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setRestaurant(data)
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchRestaurant()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const searchOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setOrder(null)

    if (!restaurant) {
      await fetchRestaurant()
    }

    try {
      let url = `/api/orders/search?restaurantSlug=${slug}`
      
      if (searchBy === 'phone') {
        if (!phone.trim()) {
          setError('Veuillez entrer votre numéro de téléphone')
          setIsLoading(false)
          return
        }
        url += `&phone=${encodeURIComponent(phone.trim())}`
      } else {
        if (!orderId.trim()) {
          setError('Veuillez entrer le numéro de commande')
          setIsLoading(false)
          return
        }
        url += `&orderId=${encodeURIComponent(orderId.trim())}`
      }

      const response = await fetch(url)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Commande non trouvée')
      }

      const data = await response.json()
      
      // Si plusieurs commandes, prendre la plus récente
      const orders = Array.isArray(data) ? data : [data]
      if (orders.length > 0) {
        setOrder(orders[0])
      } else {
        setError('Aucune commande trouvée')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-black syrian-pattern relative">
      <Navbar
        restaurant={restaurant || { id: '', slug: slug || '', name: 'ZEN ACHAM', city: '', currency: 'DH' } as Restaurant}
        cartItemCount={0}
        cartTotal={0}
        currency={restaurant?.currency || 'DH'}
        onCartClick={() => {}}
        categories={[]}
      />

      <div className="container mx-auto px-4 pt-32 pb-24 max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gold-gradient mb-3">
            Mon Reçu
          </h1>
          <p className="text-gold-300/70 text-sm md:text-base">
            Consultez le statut de votre commande
          </p>
        </div>

        {/* Search Form */}
        <div className="glass-effect rounded-2xl p-6 md:p-8 border border-gold/20 mb-6">
          <form onSubmit={searchOrder} className="space-y-4">
            {/* Search Method Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setSearchBy('phone')
                  setError('')
                  setOrder(null)
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  searchBy === 'phone'
                    ? 'bg-gold/20 text-gold border border-gold/40'
                    : 'bg-black/40 text-gold-300 border border-gold/10 hover:border-gold/20'
                }`}
              >
                Par téléphone
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchBy('orderId')
                  setError('')
                  setOrder(null)
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  searchBy === 'orderId'
                    ? 'bg-gold/20 text-gold border border-gold/40'
                    : 'bg-black/40 text-gold-300 border border-gold/10 hover:border-gold/20'
                }`}
              >
                Par numéro de commande
              </button>
            </div>

            {/* Input Field */}
            {searchBy === 'phone' ? (
              <div>
                <label className="block text-gold font-semibold mb-2 text-sm">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="w-full p-3 bg-black/40 border border-gold/20 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-400"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-gold font-semibold mb-2 text-sm">
                  Numéro de commande
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Entrez le numéro de commande"
                  className="w-full p-3 bg-black/40 border border-gold/20 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-400 font-mono text-sm"
                  required
                />
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-gradient hover:shadow-gold-lg text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="glass-effect rounded-2xl p-6 md:p-8 border border-gold/20 space-y-6 animate-fade-in">
            {/* Order Header */}
            <div className="text-center border-b border-gold/20 pb-4">
              <div className="text-sm text-gold-300/60 mb-2">Commande N°</div>
              <div className="text-xl font-mono font-bold text-gold mb-3">
                {order.id.slice(0, 8).toUpperCase()}
              </div>
              <div className={`inline-block px-4 py-2 rounded-full border ${statusColors[order.status]} text-sm font-semibold`}>
                {statusLabels[order.status]}
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gold/10">
                <span className="text-gold-300/70 text-sm">Client</span>
                <span className="text-white font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gold/10">
                <span className="text-gold-300/70 text-sm">Téléphone</span>
                <span className="text-white font-medium">{order.customerPhone}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gold/10">
                <span className="text-gold-300/70 text-sm">Type</span>
                <span className="text-white font-medium">
                  {order.orderType === 'DINE_IN' ? 'Sur place' : 'À emporter'}
                </span>
              </div>
              {order.pickupTime && (
                <div className="flex justify-between items-center py-2 border-b border-gold/10">
                  <span className="text-gold-300/70 text-sm">Heure de retrait</span>
                  <span className="text-white font-medium">
                    {new Date(order.pickupTime).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gold/10">
                <span className="text-gold-300/70 text-sm">Date de commande</span>
                <span className="text-white font-medium text-sm">
                  {new Date(order.createdAt).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-gold font-semibold mb-3 text-sm uppercase tracking-wide">
                Articles commandés
              </h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start py-2 border-b border-gold/5"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">
                        {item.item.nameFr}
                      </div>
                      {item.item.nameAr && (
                        <div className="text-gold-300/60 text-xs font-arabic mt-0.5">
                          {item.item.nameAr}
                        </div>
                      )}
                      <div className="text-gold-300/50 text-xs mt-1">
                        {item.quantity} × {formatPrice(item.unitPrice, restaurant?.currency || 'DH')}
                      </div>
                    </div>
                    <div className="text-gold font-semibold ml-4">
                      {formatPrice(item.totalPrice, restaurant?.currency || 'DH')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t-2 border-gold/30">
              <div className="flex justify-between items-center">
                <span className="text-gold font-bold text-lg">Total</span>
                <span className="text-gold text-2xl font-bold">
                  {formatPrice(order.totalAmount, restaurant?.currency || 'DH')}
                </span>
              </div>
            </div>

            {/* Back to Menu */}
            <div className="pt-4">
              <Link
                href={`/r/${slug}`}
                className="block text-center text-gold-300 hover:text-gold transition-colors text-sm"
              >
                ← Retour au menu
              </Link>
            </div>
          </div>
        )}

        {/* Instructions - Only show if no search has been performed */}
        {!order && !isLoading && !error && (
          <div className="glass-effect rounded-2xl p-6 border border-gold/10">
            <div className="text-center text-gold-300/60 text-sm space-y-2">
              <p>Entrez votre numéro de téléphone ou le numéro de commande</p>
              <p className="text-xs text-gold-300/40 mt-2">
                Vous trouverez le numéro de commande dans l'email de confirmation ou sur votre reçu
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

