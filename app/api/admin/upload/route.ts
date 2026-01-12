import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    // Note: Pour le MVP, l'authentification est simplifiée comme les autres routes admin
    // Si vous voulez ajouter l'authentification plus tard, vous pouvez utiliser getAdminFromRequest

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      )
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximale: 5MB' },
        { status: 400 }
      )
    }

    // Créer le nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${timestamp}-${randomString}.${fileExtension}`

    // Chemin du dossier public/assets
    const publicDir = join(process.cwd(), 'public', 'assets')
    
    // Créer le dossier s'il n'existe pas
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    // Chemin complet du fichier
    const filePath = join(publicDir, fileName)

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Retourner l'URL relative
    const imageUrl = `/assets/${fileName}`

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: 'Image uploadée avec succès',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    )
  }
}

