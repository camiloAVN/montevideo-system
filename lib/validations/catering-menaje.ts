import { z } from 'zod'

export const CATERING_MENAJE_CATEGORIES = [
  'Vajilla',
  'Cubertería',
  'Cristalería',
  'Bar',
  'Buffet',
  'Cocina',
  'Mantelería/Textiles',
  'Mobiliario',
  'Desechables',
  'Decoración',
  'Equipos eléctricos',
  'Transporte/Almacenamiento',
  'Higiene/Limpieza',
] as const

export type CateringMenajeCategory = (typeof CATERING_MENAJE_CATEGORIES)[number]

export const COST_MODES = ['UNIT', 'PACKAGE'] as const
export type CostMode = (typeof COST_MODES)[number]

export const cateringMenajeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  totalQuantity: z.number().int().min(0, 'La cantidad no puede ser negativa').optional(),
  costMode: z.enum(['UNIT', 'PACKAGE']).optional(),
  unitCost: z.number().min(0, 'El costo no puede ser negativo').optional().nullable(),
  packageCost: z.number().min(0, 'El costo no puede ser negativo').optional().nullable(),
  replacementCost: z.number().min(0, 'El costo no puede ser negativo').optional().nullable(),
  markupPercent: z.number().min(0).optional().nullable(),
  markupAmount: z.number().min(0).optional().nullable(),
  total: z.number().min(0).optional().nullable(),
  isActive: z.boolean().optional(),
})

export type CateringMenajeFormData = z.infer<typeof cateringMenajeSchema>

export type CateringMenaje = {
  id: string
  name: string
  description: string | null
  category: string | null
  supplierId: string | null
  totalQuantity: number
  costMode: string
  unitCost: number | null
  packageCost: number | null
  replacementCost: number | null
  markupPercent: number | null
  markupAmount: number | null
  total: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  supplier?: { id: string; name: string } | null
}
