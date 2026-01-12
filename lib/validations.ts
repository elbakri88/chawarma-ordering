import { z } from 'zod'

export const orderSchema = z.object({
  restaurantId: z.string().min(1, 'Le restaurant est requis'),
  customerName: z.string().min(1, 'Le nom est requis'),
  customerPhone: z.string().min(1, 'Le téléphone est requis'),
  orderType: z.enum(['DINE_IN', 'TAKEAWAY']),
  pickupTime: z.string().optional(),
  items: z.array(
    z.object({
      itemId: z.string(),
      quantity: z.number().int().positive(),
      modifiers: z.array(
        z.object({
          modifierOptionId: z.string(),
          quantity: z.number().int().positive().default(1),
        })
      ).optional(),
      notes: z.string().optional(),
    })
  ).min(1, 'Le panier ne peut pas être vide'),
})

export const adminLoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

export const categorySchema = z.object({
  nameFr: z.string().min(1, 'Le nom français est requis'),
  nameAr: z.string().optional().nullable(),
  imageUrl: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === '' || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
      { message: 'L\'URL de l\'image doit être valide (commence par /, http:// ou https://)' }
    )
    .transform((val) => (val && val.trim() !== '' ? val : undefined)),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export const itemSchema = z.object({
  nameFr: z.string().min(1, 'Le nom français est requis'),
  nameAr: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().positive('Le prix doit être positif'),
  imageUrl: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === '' || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
      { message: 'L\'URL de l\'image doit être valide (commence par /, http:// ou https://)' }
    )
    .transform((val) => (val && val.trim() !== '' ? val : undefined)),
  isAvailable: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  categoryId: z.string().min(1, 'La catégorie est requise'),
})

export const modifierSchema = z.object({
  nameFr: z.string().min(1, 'Le nom français est requis'),
  nameAr: z.string().optional(),
  type: z.enum(['SIZE', 'SAUCE', 'SUPPLEMENT', 'DRINK', 'COOKING', 'NOTE']),
  isRequired: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  itemId: z.string().min(1, 'L\'item est requis'),
})

export const modifierOptionSchema = z.object({
  nameFr: z.string().min(1, 'Le nom français est requis'),
  nameAr: z.string().optional(),
  price: z.number().default(0),
  isAvailable: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  modifierId: z.string().min(1, 'Le modificateur est requis'),
})

export const orderStatusSchema = z.enum(['NEW', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'])

