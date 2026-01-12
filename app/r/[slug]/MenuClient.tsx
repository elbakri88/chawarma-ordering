'use client'

import { useState, useMemo } from 'react'
import { Restaurant, Category, Item, Modifier, ModifierOption } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import { getTopCategoriesByItemCount, getCategoryImage } from '@/lib/categoryConfig'
import Image from 'next/image'
import Link from 'next/link'
import Cart from './Cart'
import ItemModal from './ItemModal'
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
  homeCategories?: (Category & {
    items: (Item & {
      modifiers: (Modifier & {
        options: ModifierOption[]
      })[]
    })[]
  })[]
}

interface MenuClientProps {
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

export default function MenuClient({ restaurant }: MenuClientProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ItemWithModifiers | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Categories are already deduplicated on the server, use them directly
  // No need to deduplicate again on client to avoid hydration mismatches
  const uniqueCategories = restaurant.categories

  // Use pre-computed homeCategories from server, or compute on client as fallback
  // This ensures server and client render the same content
  const homeCategories = restaurant.homeCategories || getTopCategoriesByItemCount(uniqueCategories, 8)

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
    // Note: Modifier prices are calculated when adding to cart
    // For now, we'll use item price only in the cart display
    // Full calculation happens server-side during order creation
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

      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-20 md:pb-28 max-w-6xl relative z-10">
        {/* Hero Section - Modern Minimal Design */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <div className="hero-minimal relative rounded-2xl md:rounded-3xl overflow-hidden border border-gold/10">
            <div className="relative w-full min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center px-6 py-16 md:py-20">
              {/* Animated radial gradient background */}
              
              {/* Content - Centered & Elegant */}
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                {/* Logo - Minimal with subtle animation */}
                <div className="relative mb-6 md:mb-8 inline-block">
                  <div className="absolute inset-0 bg-gold/5 rounded-full blur-2xl scale-150 opacity-50"></div>
                  <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto">
                    <div className="absolute inset-0 rounded-full border border-gold/20"></div>
                    <div className="relative w-full h-full p-3 md:p-4">
                      <Image
                        src={restaurant.logoUrl || "/assets/zen-acham-logo.svg"}
                        alt={`${restaurant.name} Logo`}
                        fill
                        className="object-contain"
                        priority
                        unoptimized={restaurant.logoUrl?.startsWith('/')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Restaurant Name - Large & Bold */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black gold-gradient mb-3 md:mb-4 tracking-tighter leading-none relative z-10">
                  {restaurant.name}
                </h1>
                
                {/* City - Elegant Subtitle */}
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-gold/40"></div>
                  <p className="text-sm md:text-base lg:text-lg text-gold-400/70 font-light tracking-widest uppercase">
                    {restaurant.city}
                  </p>
                  <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-gold/40"></div>
                </div>
                
                {/* Elegant Decorative Line */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="w-1 h-1 rounded-full bg-gold/40"></div>
                  <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/50"></div>
                  <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
                  <div className="w-1 h-1 rounded-full bg-gold/40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section - Modern Elegant Design */}
        {homeCategories.length > 0 && (
          <div className="mb-16 md:mb-20">
            {/* Section Header - Minimal & Elegant */}
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 tracking-tight">
                Nos <span className="gold-gradient">Catégories</span>
              </h2>
              <p className="text-sm md:text-base text-gold-300/60 font-light tracking-wide mb-6">
                Découvrez une sélection de notre menu authentique
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gold/30"></div>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gold/40"></div>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
                <div className="w-1 h-1 rounded-full bg-gold/30"></div>
              </div>
            </div>

            {/* Elegant Category Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
              {homeCategories.map((category, index) => {
                const categoryImage = getCategoryImage(category)
                return (
                  <Link
                    key={category.id}
                    href={`/r/${restaurant.slug}/categories#category-${category.id}`}
                    className="group card-elegant rounded-xl overflow-hidden cursor-pointer focus-ring focus:outline-none animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 0.03}s`,
                    }}
                  >
                    {/* Image Container - Elegant */}
                    <div className="relative w-full h-40 md:h-44 lg:h-48 overflow-hidden bg-black">
                      <ProductImage
                        src={categoryImage}
                        alt={category.nameFr}
                        className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Elegant overlay */}
                      <div className="absolute inset-0 image-overlay-elegant pointer-events-none"></div>
                      {/* Gold accent on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>

                    {/* Category Info - Clean & Readable */}
                    <div className="p-4 md:p-5 relative z-10 pointer-events-none bg-black">
                      <h3 className="text-sm md:text-base font-bold text-white mb-1.5 group-hover:text-gold transition-colors duration-300 min-h-[2.5rem]" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.3',
                      }}>
                        {category.nameFr}
                      </h3>
                      {category.nameAr && (
                        <p className="text-xs text-gold-300/70 font-arabic mb-3 overflow-hidden text-ellipsis whitespace-nowrap" dir="rtl">
                          {category.nameAr}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gold/10 group-hover:border-gold/30 transition-colors duration-300">
                        <span className="text-xs text-gold-300/80 font-medium">
                          {category.items.length} {category.items.length === 1 ? 'article' : 'articles'}
                        </span>
                        <div className="w-5 h-5 rounded-full border border-gold/20 group-hover:border-gold/40 group-hover:bg-gold/10 transition-all duration-300 flex items-center justify-center">
                          <svg 
                            className="w-3 h-3 text-gold-300/60 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Link to full categories - Elegant CTA */}
            {uniqueCategories.length > 8 && (
              <div className="text-center mt-8 md:mt-10">
                <Link
                  href={`/r/${restaurant.slug}/categories`}
                  className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3.5 text-gold-300 hover:text-gold border border-gold/20 hover:border-gold/40 rounded-lg transition-all duration-300 hover:bg-gold/5 focus-ring focus:outline-none group"
                >
                  <span className="text-sm md:text-base font-medium">Voir toutes les catégories</span>
                  <svg 
                    className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Floating Cart Button - Premium Mobile CTA */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-4 md:right-6 lg:hidden z-40 animate-float">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gold-gradient text-black font-bold px-5 py-4 rounded-2xl shadow-2xl shadow-gold/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2.5 relative overflow-hidden group focus-ring focus:outline-none"
              aria-label={`Panier: ${cart.reduce((sum, item) => sum + item.quantity, 0)} article(s), total ${formatPrice(total, restaurant.currency)}`}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              {/* Cart Icon */}
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              
              {/* Badge with count */}
              <span className="relative z-10 font-bold text-base min-w-[1.5rem] text-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
              
              {/* Total price - hidden on very small screens */}
              <span className="hidden xs:inline relative z-10 font-bold text-sm">
                {formatPrice(total, restaurant.currency)}
              </span>
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

