'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Restaurant } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

interface NavbarProps {
  restaurant: Restaurant
  cartItemCount: number
  cartTotal: number
  currency: string
  onCartClick: () => void
  categories?: Array<{ id: string; nameFr: string; nameAr?: string | null }>
}

export default function Navbar({
  restaurant,
  cartItemCount,
  cartTotal,
  currency,
  onCartClick,
  categories = [],
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  const logoUrl = restaurant.logoUrl || '/assets/zen-acham-logo.svg'
  const contactPath = `/r/${restaurant.slug}/contact`
  const isContactPage = pathname === contactPath

  // Remove duplicate categories by ID using useMemo for performance
  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>()
    return categories.filter((category) => {
      if (seen.has(category.id)) {
        return false
      }
      seen.add(category.id)
      return true
    })
  }, [categories])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-effect shadow-gold-lg border-b border-gold/30'
          : 'bg-black/80 backdrop-blur-sm'
      }`}
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Restaurant Name */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-4 flex-1 min-w-0"
            aria-label="Retour en haut de la page"
          >
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 group">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-full h-full rounded-full border-2 border-gold/30 group-hover:border-gold/60 transition-colors p-1">
                <Image
                  src={logoUrl}
                  alt={`${restaurant.name} logo`}
                  fill
                  className="object-contain rounded-full"
                  priority
                  unoptimized={logoUrl.startsWith('/')}
                />
              </div>
            </div>
            <div className="hidden sm:block min-w-0">
              <h1 className="text-xl md:text-2xl font-bold gold-gradient truncate">{restaurant.name}</h1>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center max-w-3xl">
            {/* Categories Link */}
            <Link
              href={`/r/${restaurant.slug}/categories`}
              className={`text-gold-300 hover:text-gold transition-all text-sm font-medium py-2 px-3 rounded-lg hover:bg-gold/10 relative group overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                pathname === `/r/${restaurant.slug}/categories` ? 'text-gold bg-gold/10' : ''
              }`}
              aria-label="Voir toutes les catégories"
            >
              <span className="relative z-10">Catégories</span>
              <div className="absolute inset-0 bg-gold/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Link>
            
            {/* Mon Reçu Link */}
            <Link
              href={`/r/${restaurant.slug}/order-status`}
              className={`text-gold-300 hover:text-gold transition-all text-sm font-medium py-2 px-3 rounded-lg hover:bg-gold/10 relative group overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                pathname === `/r/${restaurant.slug}/order-status` ? 'text-gold bg-gold/10' : ''
              }`}
              aria-label="Voir le statut de ma commande"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Mon Reçu
              </span>
              <div className="absolute inset-0 bg-gold/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Link>
            
            {/* Localisation Link */}
            <Link
              href={`/r/${restaurant.slug}/location`}
              className={`text-gold-300 hover:text-gold transition-all text-sm font-medium py-2 px-3 rounded-lg hover:bg-gold/10 relative group overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                pathname === `/r/${restaurant.slug}/location` ? 'text-gold bg-gold/10' : ''
              }`}
              aria-label="Localisation du restaurant"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Localisation
              </span>
              <div className="absolute inset-0 bg-gold/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Link>
            
            {/* Contact Link */}
            <Link
              href={contactPath}
              className={`text-gold-300 hover:text-gold transition-all text-sm font-medium py-2 px-3 rounded-lg hover:bg-gold/10 relative group overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                isContactPage ? 'text-gold bg-gold/10' : ''
              }`}
              aria-label="Page de contact"
            >
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 bg-gold/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Link>
          </div>

          {/* Cart Button */}
          <div className="flex items-center gap-4">
            {cartItemCount > 0 && (
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gold-300 font-light">{cartItemCount} article(s)</p>
                <p className="text-sm font-bold gold-gradient">{formatPrice(cartTotal, currency)}</p>
              </div>
            )}
            <button
              onClick={onCartClick}
              className="relative bg-gold-gradient hover:shadow-gold-lg text-black font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 flex items-center gap-2 group overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold/50"
              aria-label={`Panier: ${cartItemCount} article${cartItemCount !== 1 ? 's' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <svg
                className="w-5 h-5 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-black z-20 animate-pulse">
                  {cartItemCount}
                </span>
              )}
              <span className="hidden sm:inline relative z-10">Panier</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gold ml-2 p-2 focus:outline-none focus:ring-2 focus:ring-gold/50 rounded-lg"
              aria-label="Menu mobile"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gold/30 glass-effect" role="menu">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {/* Categories link in mobile menu */}
            <Link
              href={`/r/${restaurant.slug}/categories`}
              className={`block text-left text-gold-300 hover:text-gold hover:bg-gold/10 p-4 rounded-lg transition-all border border-gold/10 hover:border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                pathname === `/r/${restaurant.slug}/categories` ? 'text-gold bg-gold/10 border-gold/30' : ''
              }`}
              role="menuitem"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Catégories
              </div>
              <div className="text-xs text-gold-300/70 mt-1">Voir toutes les catégories</div>
            </Link>
            
            {/* Mon Reçu link in mobile menu */}
            <Link
              href={`/r/${restaurant.slug}/order-status`}
              className={`block text-left text-gold-300 hover:text-gold hover:bg-gold/10 p-4 rounded-lg transition-all border border-gold/10 hover:border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                pathname === `/r/${restaurant.slug}/order-status` ? 'text-gold bg-gold/10 border-gold/30' : ''
              }`}
              role="menuitem"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Mon Reçu
              </div>
              <div className="text-xs text-gold-300/70 mt-1">Voir le statut de ma commande</div>
            </Link>
            
            {/* Localisation link in mobile menu */}
            <Link
              href={`/r/${restaurant.slug}/location`}
              className={`block text-left text-gold-300 hover:text-gold hover:bg-gold/10 p-4 rounded-lg transition-all border border-gold/10 hover:border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                pathname === `/r/${restaurant.slug}/location` ? 'text-gold bg-gold/10 border-gold/30' : ''
              }`}
              role="menuitem"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Localisation
              </div>
              <div className="text-xs text-gold-300/70 mt-1">Adresse et plan</div>
            </Link>
            
            {/* Contact link in mobile menu */}
            <Link
              href={contactPath}
              className={`block text-left text-gold-300 hover:text-gold hover:bg-gold/10 p-4 rounded-lg transition-all border border-gold/10 hover:border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                isContactPage ? 'text-gold bg-gold/10 border-gold/30' : ''
              }`}
              role="menuitem"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </div>
              <div className="text-xs text-gold-300/70 mt-1">Nous contacter</div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

