'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Restaurant } from '@prisma/client'
import { CartItem } from './MenuClient'
import { formatPrice } from '@/lib/utils'

interface CartProps {
  cart: CartItem[]
  restaurant: Restaurant
  onClose: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, updates: Partial<CartItem>) => void
}

export default function Cart({ cart, restaurant, onClose, onRemove, onUpdate }: CartProps) {
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY'>('DINE_IN')
  const [pickupTime, setPickupTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const calculateTotal = () => {
    return cart.reduce((sum, cartItem) => {
      const itemTotal = Number(cartItem.item.price) * cartItem.quantity
      // Note: Modifier prices would need to be calculated if we had access to modifier options
      // For now, we'll use the item price only
      return sum + itemTotal
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Veuillez remplir tous les champs')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          orderType,
          pickupTime: pickupTime || undefined,
          items: cart.map((cartItem) => ({
            itemId: cartItem.item.id,
            quantity: cartItem.quantity,
            modifiers: cartItem.selectedModifiers,
            notes: cartItem.notes,
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la commande')
      }

      const order = await response.json()
      router.push(`/r/${restaurant.slug}/order/${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsSubmitting(false)
    }
  }

  const total = calculateTotal()

  // Generate time slots (every 15 minutes for next 2 hours)
  const generateTimeSlots = () => {
    const slots = []
    const now = new Date()
    const startHour = now.getHours()
    const startMinute = Math.ceil(now.getMinutes() / 15) * 15

    for (let i = 0; i < 8; i++) {
      const minutes = startMinute + i * 15
      const hour = startHour + Math.floor(minutes / 60)
      const finalMinutes = minutes % 60
      const timeString = `${String(hour).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`
      slots.push(timeString)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold/30 shadow-gold-xl relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-br-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-tl-full blur-3xl"></div>
        
        <div className="p-6 md:p-8 relative z-10">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gold/30">
            <h2 className="text-3xl font-bold gold-gradient">Panier</h2>
            <button onClick={onClose} className="text-gold-300 hover:text-gold text-3xl transition-all hover:rotate-90 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10">
              ×
            </button>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {cart.map((cartItem, index) => (
              <div key={index} className="glass-effect-light rounded-xl p-5 border border-gold/20 hover:border-gold/40 transition-all hover:shadow-gold-md group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg group-hover:text-gold transition-colors">{cartItem.item.nameFr}</h3>
                    {cartItem.item.nameAr && (
                      <p className="text-sm text-gold-300 mt-1 font-arabic">{cartItem.item.nameAr}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-400 hover:text-red-300 ml-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/10 transition-all"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/20">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdate(index, { quantity: Math.max(1, cartItem.quantity - 1) })}
                      className="w-9 h-9 bg-gold/20 hover:bg-gold/30 rounded-lg text-gold font-bold transition-all border border-gold/30 hover:scale-110"
                    >
                      −
                    </button>
                    <span className="text-white font-bold text-lg w-8 text-center">{cartItem.quantity}</span>
                    <button
                      onClick={() => onUpdate(index, { quantity: cartItem.quantity + 1 })}
                      className="w-9 h-9 bg-gold/20 hover:bg-gold/30 rounded-lg text-gold font-bold transition-all border border-gold/30 hover:scale-110"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gold font-bold text-xl gold-gradient">
                    {formatPrice(Number(cartItem.item.price) * cartItem.quantity, restaurant.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-8 p-5 bg-gold/10 rounded-xl border-2 border-gold/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5"></div>
            <span className="text-gold font-bold text-xl relative z-10">Total</span>
            <span className="text-gold text-3xl font-bold gold-gradient relative z-10">
              {formatPrice(total, restaurant.currency)}
            </span>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gold font-bold mb-3">Nom</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full p-4 glass-effect-light border border-gold/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-gold font-bold mb-3">Téléphone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full p-4 glass-effect-light border border-gold/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-gold font-bold mb-3">Type de commande</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    value="DINE_IN"
                    checked={orderType === 'DINE_IN'}
                    onChange={(e) => setOrderType(e.target.value as 'DINE_IN')}
                    className="mr-3 w-5 h-5 text-gold focus:ring-gold focus:ring-2"
                  />
                  <span className="text-white group-hover:text-gold transition-colors font-medium">Sur place</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    value="TAKEAWAY"
                    checked={orderType === 'TAKEAWAY'}
                    onChange={(e) => setOrderType(e.target.value as 'TAKEAWAY')}
                    className="mr-3 w-5 h-5 text-gold focus:ring-gold focus:ring-2"
                  />
                  <span className="text-white group-hover:text-gold transition-colors font-medium">À emporter</span>
                </label>
              </div>
            </div>

            {orderType === 'TAKEAWAY' && (
              <div>
                <label className="block text-gold font-bold mb-3">Heure de retrait</label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full p-4 glass-effect-light border border-gold/20 rounded-xl text-white focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                >
                  <option value="" className="bg-black">Sélectionnez une heure</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot} className="bg-black">
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border-2 border-red-500/50 text-red-200 p-4 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold-gradient hover:shadow-gold-lg text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed gold-glow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10">{isSubmitting ? 'Traitement...' : 'Valider la commande'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

