'use client'

import { useState } from 'react'
import { Item, Modifier, ModifierOption, Restaurant } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import ProductImage from '@/components/ProductImage'

type ItemWithModifiers = Item & {
  modifiers: (Modifier & {
    options: ModifierOption[]
  })[]
}

interface ItemModalProps {
  item: ItemWithModifiers
  restaurant: Restaurant
  onClose: () => void
  onAddToCart: (
    item: Item,
    quantity: number,
    selectedModifiers: { modifierOptionId: string; quantity: number }[],
    notes?: string
  ) => void
}

export default function ItemModal({ item, restaurant, onClose, onAddToCart }: ItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')

  const handleAddToCart = () => {
    const modifiersArray = Object.entries(selectedModifiers).map(([modifierOptionId]) => ({
      modifierOptionId,
      quantity: 1,
    }))
    onAddToCart(item, quantity, modifiersArray, notes || undefined)
  }

  const basePrice = Number(item.price)
  const modifiersPrice = item.modifiers.reduce((sum, modifier) => {
    const selectedOptionId = selectedModifiers[modifier.id]
    if (selectedOptionId) {
      const option = modifier.options.find((o) => o.id === selectedOptionId)
      return sum + (option ? Number(option.price) : 0)
    }
    return sum
  }, 0)
  const totalPrice = (basePrice + modifiersPrice) * quantity

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gold/30 shadow-gold-xl relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-br-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-tl-full blur-3xl"></div>
        
        {/* Product Image */}
        <div className="relative w-full h-72 overflow-hidden rounded-t-2xl">
          <ProductImage
            src={item.imageUrl}
            alt={item.nameFr}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        </div>

        <div className="p-6 md:p-8 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold gold-gradient mb-2">{item.nameFr}</h2>
              {item.nameAr && (
                <p className="text-gold-300 font-arabic text-lg">{item.nameAr}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gold-300 hover:text-gold text-3xl transition-all hover:rotate-90 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
            >
              ×
            </button>
          </div>

          {item.description && (
            <p className="text-gray-300 mb-8 border-l-4 border-gold/40 pl-5 py-2 italic">{item.description}</p>
          )}

          {/* Modifiers */}
          {item.modifiers.length > 0 && (
            <div className="space-y-5 mb-8">
              {item.modifiers.map((modifier) => (
                <div key={modifier.id}>
                  <label className="block text-gold font-bold mb-4">
                    {modifier.nameFr}
                    {modifier.isRequired && <span className="text-red-400"> *</span>}
                  </label>
                  <div className="space-y-3">
                    {modifier.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center justify-between p-4 glass-effect-light rounded-xl border border-gold/20 hover:border-gold/50 hover:shadow-gold-md cursor-pointer transition-all group"
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name={modifier.id}
                            value={option.id}
                            checked={selectedModifiers[modifier.id] === option.id}
                            onChange={(e) =>
                              setSelectedModifiers({ ...selectedModifiers, [modifier.id]: e.target.value })
                            }
                            className="mr-4 w-5 h-5 text-gold focus:ring-gold focus:ring-2"
                          />
                          <span className="text-white font-semibold group-hover:text-gold transition-colors">{option.nameFr}</span>
                          {option.nameAr && (
                            <span className="text-gold-300 text-sm ml-3 font-arabic">{option.nameAr}</span>
                          )}
                        </div>
                        {Number(option.price) > 0 && (
                          <span className="text-gold font-bold gold-gradient">
                            +{formatPrice(Number(option.price), restaurant.currency)}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-gold font-bold mb-3">Notes spéciales</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des instructions..."
              className="w-full p-4 glass-effect-light border border-gold/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between mb-8 p-5 glass-effect-light rounded-xl border border-gold/20">
            <label className="text-gold font-bold text-lg">Quantité</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gold/20 hover:bg-gold/30 rounded-lg text-gold font-bold transition-all border border-gold/30 hover:scale-110"
              >
                −
              </button>
              <span className="text-white font-bold text-xl w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gold/20 hover:bg-gold/30 rounded-lg text-gold font-bold transition-all border border-gold/30 hover:scale-110"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-8 p-5 bg-gold/10 rounded-xl border-2 border-gold/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5"></div>
            <span className="text-gold font-bold text-xl relative z-10">Total</span>
            <span className="text-gold text-3xl font-bold gold-gradient relative z-10">
              {formatPrice(totalPrice, restaurant.currency)}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gold-gradient hover:shadow-gold-lg text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] text-lg gold-glow relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative z-10">Ajouter au panier</span>
          </button>
        </div>
      </div>
    </div>
  )
}

