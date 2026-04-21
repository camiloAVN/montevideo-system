import { z } from 'zod'
export { CATERING_MENU_TYPES } from './catering-menu-items'
export type { CateringMenuType } from './catering-menu-items'

export const cateringMenuCustomSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  menuType: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  plateCount: z.number().int().min(1).optional().nullable(),
  costMode: z.enum(['PER_PLATE', 'PACKAGE']).optional(),
  plateCost: z.number().min(0).optional().nullable(),
  packageCost: z.number().min(0).optional().nullable(),
  markupPercent: z.number().min(0).optional().nullable(),
  markupAmount: z.number().min(0).optional().nullable(),
  total: z.number().min(0).optional().nullable(),
  isActive: z.boolean().optional(),
})

export type CateringMenuCustomFormData = z.infer<typeof cateringMenuCustomSchema>

export type CateringMenuCustom = {
  id: string
  name: string
  menuType: string | null
  description: string | null
  supplierId: string | null
  plateCount: number | null
  costMode: string
  plateCost: number | null
  packageCost: number | null
  markupPercent: number | null
  markupAmount: number | null
  total: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  supplier?: { id: string; name: string } | null
}
