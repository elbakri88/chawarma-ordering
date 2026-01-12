'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminNavbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Tableau de bord', icon: '📊' },
    { href: '/admin/menu', label: 'Gestion du Menu', icon: '🍽️' },
    { href: '/admin/qr', label: 'QR Code', icon: '📱' },
  ]

  return (
    <nav className="bg-black border-b border-gold/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et Titre */}
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/zen-acham-logo.svg"
                  alt="ZEN ACHAM Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gold-gradient">ZEN ACHAM</h1>
                <p className="text-xs text-gold-300">Administration</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'text-gold-300 hover:text-gold hover:bg-gold/10'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                const menu = document.getElementById('mobile-menu')
                menu?.classList.toggle('hidden')
              }}
              className="text-gold-300 hover:text-gold p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden md:hidden border-t border-gold/20 bg-black/95">
        <div className="px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                const menu = document.getElementById('mobile-menu')
                menu?.classList.add('hidden')
              }}
              className={`block px-4 py-2 rounded-lg font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'text-gold-300 hover:text-gold hover:bg-gold/10'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

