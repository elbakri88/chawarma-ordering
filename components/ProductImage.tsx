'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  fallback?: string
}

export default function ProductImage({
  src,
  alt,
  className = '',
  fallback = '/assets/fallback-food.png',
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback)
      setHasError(true)
    }
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  // Premium fallback when image fails
  const renderPremiumFallback = () => (
    <div className="absolute inset-0 image-fallback-premium flex items-center justify-center">
      <div className="relative z-10 text-center px-4">
        <div className="mb-3 relative inline-block">
          <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl"></div>
          <svg
            className="w-16 h-16 text-gold/40 relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="text-xs text-gold/30 font-medium mt-2 uppercase tracking-wider">
          Image
        </div>
      </div>
    </div>
  )

  return (
    <div className={`relative overflow-hidden bg-black/60 ${className}`}>
      {/* Loading skeleton - premium style */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent animate-shimmer"></div>
        </div>
      )}
      
      {/* Image */}
      {!hasError && (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {/* Premium fallback when error or no image */}
      {hasError && renderPremiumFallback()}
    </div>
  )
}

