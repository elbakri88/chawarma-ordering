'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur de connexion')
      }

      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black syrian-pattern flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl rounded-2xl max-w-md w-full p-8 border-2 border-gold/30 shadow-gold-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gold-gradient mb-2">Administration</h1>
          <p className="text-gold-light">Connexion à l'espace admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gold font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-black/40 border border-gold/20 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-400"
              placeholder="admin@zenacham.com"
            />
          </div>

          <div>
            <label className="block text-gold font-semibold mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-black/40 border border-gold/20 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold-gradient hover:shadow-gold-lg text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gold-light">
          <p>Email: admin@zenacham.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}



