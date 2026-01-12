'use client'

import { useState, useMemo, useEffect } from 'react'
import { Restaurant, Category, Item, Modifier, ModifierOption } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Cart from '../Cart'
import ItemModal from '../ItemModal'
import Navbar from '@/components/Navbar'
import ProductImage from '@/components/ProductImage'

type RestaurantWithCategories = Restaurant & {
  categories: (Category & {
    items: (Item & {
      modifiers: (Modifier & {
        options: ModifierOption[]
      })[]
    })[]
  })[]
}

interface CategoriesClientProps {
  restaurant: RestaurantWithCategories
}

export type CartItem = {
  item: Item
  quantity: number
  selectedModifiers: {
    modifierOptionId: string
    quantity: number
  }[]
  notes?: string
}

type ItemWithModifiers = Item & {
  modifiers: (Modifier & {
    options: ModifierOption[]
  })[]
}

export default function CategoriesClient({ restaurant }: CategoriesClientProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ItemWithModifiers | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Categories are already deduplicated on the server, use them directly
  // No need to deduplicate again on client to avoid hydration mismatches
  const uniqueCategories = restaurant.categories

  // Scroll to category if hash is present in URL
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const categoryId = hash.replace('#category-', '')
      const element = document.getElementById(`category-${categoryId}`)
      if (element) {
        setTimeout(() => {
          const offset = 100
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }, 100)
      }
    }
  }, [])

  const addToCart = (item: Item, quantity: number, selectedModifiers: { modifierOptionId: string; quantity: number }[], notes?: string) => {
    setCart((prev) => [...prev, { item, quantity, selectedModifiers, notes }])
    setSelectedItem(null)
  }

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  const updateCartItem = (index: number, updates: Partial<CartItem>) => {
    setCart((prev) => prev.map((item, i) => (i === index ? { ...item, ...updates } : item)))
  }

  const total = cart.reduce((sum, cartItem) => {
    const itemTotal = Number(cartItem.item.price) * cartItem.quantity
    return sum + itemTotal
  }, 0)

  return (
    <div className="min-h-screen bg-black syrian-pattern relative">
      <Navbar
        restaurant={restaurant}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        cartTotal={total}
        currency={restaurant.currency}
        onCartClick={() => setIsCartOpen(true)}
        categories={[]}
      />

      <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gold-gradient mb-4">Notre Menu</h1>
          <p className="text-gold-300 text-lg md:text-xl">Découvrez toutes nos catégories</p>
          <div className="mt-6 syrian-divider w-48 mx-auto"></div>
        </div>

        {/* Full Menu Categories */}
        <div className="space-y-16 mb-24">
          {uniqueCategories.map((category, categoryIndex) => (
            <div
              key={category.id}
              id={`category-${category.id}`}
              className="scroll-mt-24"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}
            >
              <div className="glass-effect rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gold/5 rounded-br-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/5 rounded-tl-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="mb-8 pb-6 border-b border-gold/30">
                    <h2 className="text-3xl md:text-4xl font-bold gold-gradient mb-3">
                      {category.nameFr}
                    </h2>
                    {category.nameAr && (
                      <p className="text-lg text-gold-300 font-arabic">{category.nameAr}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="group premium-card glass-effect-light rounded-xl overflow-hidden"
                      >
                        {/* Product Image */}
                        <div className="relative w-full h-56 overflow-hidden">
                          <ProductImage
                            src={item.imageUrl}
                            alt={item.nameFr}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                          {/* Gold overlay on hover */}
                          <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Product Info */}
                        <div className="p-5 relative">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 text-left">
                              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-gold transition-colors duration-300">
                                {item.nameFr}
                              </h3>
                              {item.nameAr && (
                                <p className="text-sm text-gold-300 font-arabic mb-2">{item.nameAr}</p>
                              )}
                              {item.description && (
                                <p className="text-sm text-gray-400 mt-2 line-clamp-2 group-hover:text-gray-300 transition-colors">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gold/20 group-hover:border-gold/40 transition-colors">
                            <span className="text-gold font-bold text-xl gold-gradient">
                              {formatPrice(Number(item.price), restaurant.currency)}
                            </span>
                            <span className="text-gold-300 text-sm font-medium group-hover:text-gold transition-colors flex items-center gap-1">
                              Détails
                              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Cart Button - Only show on mobile when cart has items */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 lg:hidden z-40 animate-float">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gold-gradient text-black font-bold px-6 py-4 rounded-full shadow-gold-xl gold-glow transition-all hover:scale-110 flex items-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-lg relative z-10 font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
              <span className="hidden sm:inline relative z-10 font-bold">{formatPrice(total, restaurant.currency)}</span>
            </button>
          </div>
        )}

        {/* Item Modal */}
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            restaurant={restaurant}
            onClose={() => setSelectedItem(null)}
            onAddToCart={addToCart}
          />
        )}

        {/* Cart Modal */}
        {isCartOpen && (
          <Cart
            cart={cart}
            restaurant={restaurant}
            onClose={() => setIsCartOpen(false)}
            onRemove={removeFromCart}
            onUpdate={updateCartItem}
          />
        )}
      </div>
    </div>
  )
}

