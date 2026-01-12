'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import AdminNavbar from '@/components/AdminNavbar'

type Category = {
  id: string
  nameFr: string
  nameAr?: string | null
  imageUrl?: string | null
  items: Item[]
}

type Item = {
  id: string
  nameFr: string
  nameAr?: string | null
  description?: string | null
  price: number
  imageUrl?: string | null
  isAvailable: boolean
  categoryId: string
}

export default function AdminMenuPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/menu/categories', {
        credentials: 'include', // Inclure les cookies
      })
      
      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}: Erreur lors du chargement`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // Si la réponse n'est pas du JSON, utiliser le message par défaut
        }
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      setCategories(data)
      setIsLoading(false)
      setError('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      setIsLoading(false)
      console.error('Erreur fetchCategories:', err)
    }
  }

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      const url = editingCategory
        ? `/api/admin/menu/categories/${editingCategory.id}`
        : '/api/admin/menu/categories'
      const method = editingCategory ? 'PATCH' : 'POST'

      const dataToSend = {
        ...categoryData,
        imageUrl: categoryData.imageUrl && categoryData.imageUrl.trim() !== '' ? categoryData.imageUrl : undefined,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMessage = data.error || data.message || 'Erreur lors de la sauvegarde'
        throw new Error(errorMessage)
      }

      await fetchCategories()
      setIsCategoryFormOpen(false)
      setEditingCategory(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      alert(errorMessage)
      console.error('Erreur handleSaveCategory:', err)
    }
  }

  const handleSaveItem = async (itemData: Partial<Item>) => {
    try {
      const url = editingItem
        ? `/api/admin/menu/items/${editingItem.id}`
        : '/api/admin/menu/items'
      const method = editingItem ? 'PATCH' : 'POST'

      // Préparer les données pour l'envoi
      const dataToSend = {
        ...itemData,
        imageUrl: itemData.imageUrl && itemData.imageUrl.trim() !== '' ? itemData.imageUrl : undefined,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMessage = data.error || data.message || 'Erreur lors de la sauvegarde'
        throw new Error(errorMessage)
      }

      await fetchCategories()
      setIsFormOpen(false)
      setEditingItem(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      alert(errorMessage)
      console.error('Erreur lors de la sauvegarde:', err)
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
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setError('')
                    setIsLoading(true)
                    fetchCategories()
                  }}
                  className="w-full bg-gold hover:bg-gold/90 text-black font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-primary">Gestion du Menu</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(null)
                    setIsCategoryFormOpen(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg"
                >
                  + Nouvelle catégorie
                </button>
                <button
                  onClick={() => {
                    setEditingItem(null)
                    setIsFormOpen(true)
                  }}
                  className="bg-gold hover:bg-gold/90 text-black font-bold px-6 py-2 rounded-lg"
                >
                  + Ajouter un article
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {category.imageUrl && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <ProductImage
                          src={category.imageUrl}
                          alt={category.nameFr}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold">
                        {category.nameFr}
                        {category.nameAr && (
                          <span className="text-gray-600 ml-2">({category.nameAr})</span>
                        )}
                      </h2>
                      {!category.imageUrl && (
                        <p className="text-sm text-gray-500">Aucune image</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCategory(category)
                      setIsCategoryFormOpen(true)
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Modifier la catégorie
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-full h-40">
                        <ProductImage
                          src={item.imageUrl}
                          alt={item.nameFr}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{item.nameFr}</h3>
                        {item.nameAr && (
                          <p className="text-sm text-gray-600">{item.nameAr}</p>
                        )}
                        <p className="text-gold font-bold mt-2">
                          {Number(item.price).toFixed(2)} DH
                        </p>
                        <button
                          onClick={() => {
                            setEditingItem(item)
                            setIsFormOpen(true)
                          }}
                          className="mt-2 text-sm text-primary hover:underline"
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Item Form Modal */}
      {isFormOpen && (
        <ItemFormModal
          item={editingItem}
          categories={categories}
          onClose={() => {
            setIsFormOpen(false)
            setEditingItem(null)
          }}
          onSave={handleSaveItem}
        />
      )}

      {/* Category Form Modal */}
      {isCategoryFormOpen && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setIsCategoryFormOpen(false)
            setEditingCategory(null)
          }}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  )
}

function ItemFormModal({
  item,
  categories,
  onClose,
  onSave,
}: {
  item: Item | null
  categories: Category[]
  onClose: () => void
  onSave: (data: Partial<Item>) => Promise<void>
}) {
  const [formData, setFormData] = useState({
    nameFr: item?.nameFr ?? '',
    nameAr: item?.nameAr ?? '',
    description: item?.description ?? '',
    price: item?.price ? Number(item.price).toString() : '',
    imageUrl: item?.imageUrl ?? '',
    categoryId: item?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    isAvailable: item?.isAvailable ?? true,
  })
  const [imagePreview, setImagePreview] = useState(item?.imageUrl || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError('')

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include', // Inclure les cookies pour l'authentification
        body: uploadFormData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de l\'upload')
      }

      const data = await response.json()
      setFormData({ ...formData, imageUrl: data.url })
      setImagePreview(data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Désactiver temporairement la validation HTML5 pour éviter les problèmes avec les champs cachés
    const form = e.currentTarget as HTMLFormElement
    const wasNoValidate = form.noValidate
    form.noValidate = true
    
    // Validation basique avec vérification de null/undefined
    const nameFr = (formData.nameFr ?? '').toString().trim()
    if (!nameFr) {
      alert('Le nom français est requis')
      const nameInput = form.querySelector('input[placeholder*="Chawarma"]') as HTMLInputElement
      nameInput?.focus()
      form.noValidate = wasNoValidate
      return
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Le prix doit être supérieur à 0')
      const priceInput = form.querySelector('input[type="number"]') as HTMLInputElement
      priceInput?.focus()
      form.noValidate = wasNoValidate
      return
    }
    
    if (!formData.categoryId || formData.categoryId.trim() === '') {
      alert('La catégorie est requise')
      const categorySelect = form.querySelector('select') as HTMLSelectElement
      categorySelect?.focus()
      form.noValidate = wasNoValidate
      return
    }

    setIsSaving(true)
    setUploadError('')

    try {
      const priceValue = parseFloat(formData.price)
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Le prix doit être un nombre valide supérieur à 0')
      }

      await onSave({
        nameFr: nameFr,
        nameAr: (formData.nameAr ?? '').toString().trim() || undefined,
        description: (formData.description ?? '').toString().trim() || undefined,
        price: priceValue,
        imageUrl: (formData.imageUrl ?? '').toString().trim() || undefined,
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setUploadError(errorMessage)
      alert(errorMessage)
    } finally {
      setIsSaving(false)
      form.noValidate = wasNoValidate
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {item ? 'Modifier l\'article' : 'Nouvel article'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload Section */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Image de l'article</label>
              
              {/* File Input */}
              <div className="mb-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                      <>
                        <svg className="w-8 h-8 mb-2 text-gold animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <p className="text-sm text-gray-600">Upload en cours...</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-500">JPG, PNG, WebP ou GIF (MAX. 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    name="imageFile"
                  />
                </label>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {uploadError}
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border-2 border-gold/30 shadow-md">
                  <ProductImage src={imagePreview} alt="Preview" className="w-full h-full" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, imageUrl: '' })
                      setImagePreview('')
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    title="Supprimer l'image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Alternative: URL Input (optionnel) */}
              <details className="mt-4">
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                  Ou utilisez une URL d'image
                </summary>
                <div className="mt-2">
                  <input
                    type="text"
                    name="imageUrlInput"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value })
                      setImagePreview(e.target.value)
                    }}
                    placeholder="https://example.com/image.jpg ou /assets/image.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vous pouvez utiliser une URL complète (https://...) ou un chemin relatif (/assets/...)
                  </p>
                </div>
              </details>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Catégorie *</label>
              {categories.length === 0 ? (
                <div className="w-full p-3 border border-red-300 rounded-lg bg-red-50 text-red-700">
                  Aucune catégorie disponible. Veuillez créer une catégorie d'abord.
                </div>
              ) : (
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold bg-white text-gray-900"
                >
                  {!formData.categoryId && (
                    <option value="" disabled>
                      Sélectionnez une catégorie
                    </option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="text-gray-900">
                      {cat.nameFr}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Form fields for ItemFormModal - need to add them */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nom (FR) *</label>
              <input
                type="text"
                value={formData.nameFr}
                onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold bg-white text-gray-900 placeholder-gray-400"
                placeholder="Ex: Chawarma Poulet"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nom (AR)</label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold font-arabic bg-white text-gray-900 placeholder-gray-400"
                placeholder="Ex: شاورما دجاج"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold bg-white text-gray-900 placeholder-gray-400"
                placeholder="Description de l'article..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Prix (DH) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold bg-white text-gray-900 placeholder-gray-400"
                placeholder="0.00"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isAvailable" className="text-gray-700">
                Disponible
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="flex-1 bg-gold hover:bg-gold/90 text-black font-bold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function CategoryFormModal({
  category,
  onClose,
  onSave,
}: {
  category: Category | null
  onClose: () => void
  onSave: (data: Partial<Category>) => Promise<void>
}) {
  const [formData, setFormData] = useState({
    nameFr: category?.nameFr ?? '',
    nameAr: category?.nameAr ?? '',
    imageUrl: category?.imageUrl ?? '',
  })
  const [imagePreview, setImagePreview] = useState(category?.imageUrl || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError('')

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include', // Inclure les cookies pour l'authentification
        body: uploadFormData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de l\'upload')
      }

      const data = await response.json()
      setFormData({ ...formData, imageUrl: data.url })
      setImagePreview(data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!formData.nameFr.trim()) {
        alert('Le nom français est requis')
        setIsSaving(false)
        return
      }

      await onSave(formData)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="category-nameFr" className="block text-sm font-medium text-gray-700 mb-1">
                Nom français *
              </label>
              <input
                type="text"
                id="category-nameFr"
                value={formData.nameFr}
                onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                placeholder="Ex: Entrées froides"
              />
            </div>

            <div>
              <label htmlFor="category-nameAr" className="block text-sm font-medium text-gray-700 mb-1">
                Nom arabe
              </label>
              <input
                type="text"
                id="category-nameAr"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                placeholder="Ex: مقبلات باردة"
              />
            </div>

            <div>
              <label htmlFor="category-image" className="block text-sm font-medium text-gray-700 mb-1">
                Image de la catégorie
              </label>
              
              {imagePreview && (
                <div className="mb-3">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                    <ProductImage
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('')
                        setFormData({ ...formData, imageUrl: '' })
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                id="category-image"
                name="category-image"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
              />
              
              {isUploading && (
                <p className="text-sm text-blue-600 mt-1">Upload en cours...</p>
              )}
              
              {uploadError && (
                <p className="text-sm text-red-600 mt-1">{uploadError}</p>
              )}

              <details className="mt-2">
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                  Ou entrer une URL d'image
                </summary>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value })
                    setImagePreview(e.target.value)
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                />
              </details>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="flex-1 px-4 py-2 bg-gold hover:bg-gold/90 text-black font-bold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

