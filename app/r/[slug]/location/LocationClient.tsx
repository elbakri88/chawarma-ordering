'use client'

import { Restaurant } from '@prisma/client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface LocationClientProps {
  restaurant: Restaurant
}

export default function LocationClient({ restaurant }: LocationClientProps) {
  const address = restaurant.address || 'Adresse non disponible'
  const addressAr = restaurant.addressAr || null
  const phone = restaurant.phone || null
  const latitude = restaurant.latitude
  const longitude = restaurant.longitude

  // Default location (Casablanca) if coordinates not set
  const mapLat = latitude || 33.5731
  const mapLng = longitude || -7.5898

  // Google Maps embed URL
  const googleMapsUrl = latitude && longitude
    ? `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(`${address}, ${restaurant.city}`)}&output=embed`

  // Google Maps link for "Ouvrir dans Maps"
  const googleMapsLink = latitude && longitude
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${restaurant.city}`)}`

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

      <div className="container mx-auto px-4 pt-32 pb-24 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold gold-gradient mb-3">
            Localisation
          </h1>
          <p className="text-gold-300/70 text-sm md:text-base">
            Retrouvez-nous facilement
          </p>
          <div className="divider-premium w-32 md:w-40 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Restaurant Info Card */}
          <div className="glass-effect rounded-2xl p-6 md:p-8 border border-gold/20 space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                {restaurant.name}
              </h2>
              <p className="text-gold-300/80 text-sm md:text-base">
                {restaurant.city}
              </p>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <div>
                <div className="flex items-start gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-gold mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="text-gold font-semibold text-sm mb-1">Adresse</div>
                    <div className="text-white text-sm md:text-base leading-relaxed">
                      {address}
                    </div>
                    {addressAr && (
                      <div className="text-gold-300/70 text-sm md:text-base font-arabic mt-2" dir="rtl">
                        {addressAr}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              {phone && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-5 h-5 text-gold flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div className="flex-1">
                      <div className="text-gold font-semibold text-sm mb-1">Téléphone</div>
                      <a
                        href={`tel:${phone}`}
                        className="text-white hover:text-gold transition-colors text-sm md:text-base"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {restaurant.openingHours && (
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <svg
                      className="w-5 h-5 text-gold mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <div className="text-gold font-semibold text-sm mb-2">Horaires</div>
                      <div className="space-y-1 text-white text-sm">
                        {Object.entries(restaurant.openingHours as Record<string, { open: string; close: string }>).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize text-gold-300/70">
                              {day === 'monday' ? 'Lundi' :
                               day === 'tuesday' ? 'Mardi' :
                               day === 'wednesday' ? 'Mercredi' :
                               day === 'thursday' ? 'Jeudi' :
                               day === 'friday' ? 'Vendredi' :
                               day === 'saturday' ? 'Samedi' :
                               day === 'sunday' ? 'Dimanche' : day}
                            </span>
                            <span>{hours.open} - {hours.close}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gold/20 space-y-3">
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 hover:border-gold/50 rounded-lg py-3 px-4 text-center font-medium transition-all duration-300 hover:scale-[1.02]"
              >
                Ouvrir dans Google Maps →
              </a>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="block w-full bg-black/40 hover:bg-black/60 text-white border border-gold/20 hover:border-gold/40 rounded-lg py-3 px-4 text-center font-medium transition-all duration-300 hover:scale-[1.02]"
                >
                  Appeler maintenant
                </a>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="glass-effect rounded-2xl overflow-hidden border border-gold/20">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-full min-h-[400px]">
              <iframe
                src={googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title={`Localisation de ${restaurant.name}`}
              ></iframe>
              {/* Overlay pour style premium */}
              <div className="absolute inset-0 pointer-events-none border border-gold/10 rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Back to Menu */}
        <div className="text-center mt-8">
          <Link
            href={`/r/${restaurant.slug}`}
            className="inline-flex items-center gap-2 text-gold-300 hover:text-gold transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Retour au menu
          </Link>
        </div>
      </div>
    </div>
  )
}


