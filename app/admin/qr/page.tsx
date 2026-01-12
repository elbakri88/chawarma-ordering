'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import AdminNavbar from '@/components/AdminNavbar'

export default function QRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [restaurantSlug, setRestaurantSlug] = useState('zen-acham')

  useEffect(() => {
    const generateQR = async () => {
      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${restaurantSlug}`
      try {
        const qr = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#8B4513',
            light: '#FFFFFF',
          },
        })
        setQrCodeUrl(qr)
      } catch (err) {
        console.error('Error generating QR code:', err)
      }
    }
    generateQR()
  }, [restaurantSlug])

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-primary mb-4 text-center">QR Code à imprimer</h1>
        <div className="flex flex-col items-center space-y-4">
          {qrCodeUrl && (
            <div className="border-4 border-gold p-4 bg-white">
              <img src={qrCodeUrl} alt="QR Code" className="w-full" />
            </div>
          )}
          <div className="text-center">
            <p className="text-gray-600 mb-2">URL du restaurant:</p>
            <p className="text-sm text-primary font-mono break-all">
              {typeof window !== 'undefined' ? window.location.origin : ''}/r/{restaurantSlug}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-gold text-primary-dark font-bold rounded hover:bg-gold/90"
          >
            Imprimer
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}





