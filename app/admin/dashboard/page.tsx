'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import AdminNavbar from '@/components/AdminNavbar'

type Order = {
  id: string
  customerName: string
  customerPhone: string
  orderType: 'DINE_IN' | 'TAKEAWAY'
  status: 'NEW' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED'
  totalAmount: number
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    item: {
      nameFr: string
    }
  }>
}

const statusLabels = {
  NEW: 'Nouvelle',
  PREPARING: 'En préparation',
  READY: 'Prête',
  SERVED: 'Servie',
  CANCELLED: 'Annulée',
}

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-yellow-100 text-yellow-800',
  READY: 'bg-green-100 text-green-800',
  SERVED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'ALL'>('ALL')

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders', {
        credentials: 'include', // Inclure les cookies
      })
      
      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}: Erreur lors du chargement des commandes`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // Si la réponse n'est pas du JSON, utiliser le message par défaut
        }
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      setOrders(data)
      setIsLoading(false)
      setError('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      setIsLoading(false)
      console.error('Erreur fetchOrders:', err)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      await fetchOrders()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl">Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  const ordersByStatus: Record<Order['status'], Order[]> = {
    NEW: orders.filter((o) => o.status === 'NEW'),
    PREPARING: orders.filter((o) => o.status === 'PREPARING'),
    READY: orders.filter((o) => o.status === 'READY'),
    SERVED: orders.filter((o) => o.status === 'SERVED'),
    CANCELLED: orders.filter((o) => o.status === 'CANCELLED'),
  }

  // Déterminer quels statuts afficher selon le filtre
  const statusesToShow: Order['status'][] = selectedStatus === 'ALL' 
    ? ['NEW', 'PREPARING', 'READY', 'SERVED'] 
    : [selectedStatus]

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-primary">Tableau de bord</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => setSelectedStatus(selectedStatus === 'NEW' ? 'ALL' : 'NEW')}
                className={`p-4 rounded-lg transition-all hover:scale-105 cursor-pointer ${
                  selectedStatus === 'NEW'
                    ? 'bg-blue-200 border-2 border-blue-500 shadow-lg'
                    : 'bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <p className="text-sm text-gray-600">Nouvelles</p>
                <p className="text-2xl font-bold text-blue-600">{ordersByStatus.NEW.length}</p>
              </button>
              <button
                onClick={() => setSelectedStatus(selectedStatus === 'PREPARING' ? 'ALL' : 'PREPARING')}
                className={`p-4 rounded-lg transition-all hover:scale-105 cursor-pointer ${
                  selectedStatus === 'PREPARING'
                    ? 'bg-yellow-200 border-2 border-yellow-500 shadow-lg'
                    : 'bg-yellow-50 hover:bg-yellow-100'
                }`}
              >
                <p className="text-sm text-gray-600">En préparation</p>
                <p className="text-2xl font-bold text-yellow-600">{ordersByStatus.PREPARING.length}</p>
              </button>
              <button
                onClick={() => setSelectedStatus(selectedStatus === 'READY' ? 'ALL' : 'READY')}
                className={`p-4 rounded-lg transition-all hover:scale-105 cursor-pointer ${
                  selectedStatus === 'READY'
                    ? 'bg-green-200 border-2 border-green-500 shadow-lg'
                    : 'bg-green-50 hover:bg-green-100'
                }`}
              >
                <p className="text-sm text-gray-600">Prêtes</p>
                <p className="text-2xl font-bold text-green-600">{ordersByStatus.READY.length}</p>
              </button>
              <button
                onClick={() => setSelectedStatus(selectedStatus === 'SERVED' ? 'ALL' : 'SERVED')}
                className={`p-4 rounded-lg transition-all hover:scale-105 cursor-pointer ${
                  selectedStatus === 'SERVED'
                    ? 'bg-gray-200 border-2 border-gray-500 shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <p className="text-sm text-gray-600">Servies</p>
                <p className="text-2xl font-bold text-gray-600">{ordersByStatus.SERVED.length}</p>
              </button>
            </div>
            
            {/* Indicateur de filtre actif */}
            {selectedStatus !== 'ALL' && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Affichage: <span className="font-semibold text-primary">{statusLabels[selectedStatus]}</span>
                </p>
                <button
                  onClick={() => setSelectedStatus('ALL')}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Afficher toutes les commandes
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
          {statusesToShow.map((status) => (
            <div key={status} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{statusLabels[status]}</h2>
              <div className="space-y-4">
                {ordersByStatus[status].map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-lg">{order.customerName}</p>
                        <p className="text-gray-600">{order.customerPhone}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                        <p className="text-lg font-bold text-primary mt-2">
                          {formatPrice(order.totalAmount, 'DH')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 mb-3">
                      <p className="text-sm text-gray-600">
                        {order.orderType === 'DINE_IN' ? 'Sur place' : 'À emporter'}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {order.items.map((item) => `${item.item.nameFr} × ${item.quantity}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {status === 'NEW' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          En préparation
                        </button>
                      )}
                      {status === 'PREPARING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'READY')}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Prête
                        </button>
                      )}
                      {status === 'READY' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'SERVED')}
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Servie
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {ordersByStatus[status].length === 0 && (
                  <p className="text-gray-500 text-center py-4">Aucune commande</p>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}

