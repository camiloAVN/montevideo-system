import { z } from 'zod'

export const CATERING_ITEM_CATEGORIES = [
  'Bebidas no alcohólicas',
  'Bebidas alcohólicas',
  'Snacks / Pasabocas',
  'Dulces / Confitería',
  'Panadería / Repostería',
  'Comida rápida',
  'Comida preparada',
  'Refrigerados',
  'Frutas / Saludables',
  'Salsas y acompañamientos',
  'Desechables',
] as const

export type CateringItemCategory = typeof CATERING_ITEM_CATEGORIES[number]

export const cateringItemSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  unitCost: z.number().min(0, 'El costo no puede ser negativo').optional().nullable(),
  markupPercent: z.number().min(0, 'El porcentaje no puede ser negativo').optional().nullable(),
  markupAmount: z.number().min(0, 'La ganancia no puede ser negativa').optional().nullable(),
  total: z.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export type CateringItemFormData = z.infer<typeof cateringItemSchema>

export type CateringItem = {
  id: string
  name: string
  description: string | null
  category: string | null
  supplierId: string | null
  unitCost: number | null
  markupPercent: number | null
  markupAmount: number | null
  total: number | null
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  supplier?: { id: string; name: string } | null
}
