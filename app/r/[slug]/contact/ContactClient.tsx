'use client'

import { useState } from 'react'
import { Restaurant } from '@prisma/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

interface ContactClientProps {
  restaurant: Restaurant
}

export default function ContactClient({ restaurant }: ContactClientProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Veuillez remplir tous les champs')
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Veuillez entrer une adresse email valide')
      setIsSubmitting(false)
      return
    }

    // Simulate form submission (no backend yet)
    setTimeout(() => {
      setShowSuccess(true)
      setIsSubmitting(false)
      setFormData({ name: '', email: '', message: '' })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    }, 500)
  }

  const handleBackToMenu = () => {
    router.push(`/r/${restaurant.slug}`)
  }

  return (
    <div className="min-h-screen bg-black syrian-pattern relative">
      <Navbar
        restaurant={restaurant}
        cartItemCount={0}
        cartTotal={0}
        currency={restaurant.currency}
        onCartClick={() => {}}
        categories={[]}
      />

      <div className="container mx-auto px-4 pt-32 pb-24 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gold-gradient mb-4">Contactez-nous</h1>
          <p className="text-gold-300 text-lg">Nous sommes là pour vous aider</p>
          <div className="mt-6 syrian-divider w-48 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="glass-effect rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold gold-gradient mb-6">Informations</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-gold font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Adresse
                </h3>
                <p className="text-white">{restaurant.city || 'Casablanca'}</p>
              </div>

              <div>
                <h3 className="text-gold font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Téléphone
                </h3>
                <p className="text-white">+212 XXX XXX XXX</p>
              </div>

              {restaurant.instagramUrl && (
                <div>
                  <h3 className="text-gold font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </h3>
                  <a
                    href={restaurant.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-300 hover:text-gold transition-colors"
                  >
                    {restaurant.instagramUrl.replace('https://', '').replace('www.', '')}
                  </a>
                </div>
              )}

              {restaurant.openingHours && typeof restaurant.openingHours === 'object' && (
                <div>
                  <h3 className="text-gold font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Horaires
                  </h3>
                  <div className="text-white space-y-1 text-sm">
                    {Object.entries(restaurant.openingHours as Record<string, { open: string; close: string }>).map(([day, hours]) => (
                      <p key={day}>
                        <span className="capitalize">{day}:</span> {hours?.open || 'N/A'} - {hours?.close || 'N/A'}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-effect rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold gold-gradient mb-6">Envoyez-nous un message</h2>
            
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border-2 border-green-500/50 text-green-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Message envoyé avec succès ! Nous vous répondrons bientôt.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-gold font-semibold mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full p-4 glass-effect-light border border-gold/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gold font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full p-4 glass-effect-light border border-gold/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gold font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full p-4 glass-effect-light border border-gold/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBackToMenu}
                  className="flex-1 px-4 py-3 border border-gold/30 text-gold rounded-xl hover:bg-gold/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  Retour au menu
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gold-gradient hover:shadow-gold-lg text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed gold-glow relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10">
                    {isSubmitting ? 'Envoi...' : 'Envoyer'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

