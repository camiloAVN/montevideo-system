import { z } from 'zod'

export const DEFAULT_PERSONAL_CATEGORIES = [
  'Productor general',
  'Riggers',
  'Eléctrico',
  'Operador de iluminación',
  'Auxiliar de iluminación',
  'Ingeniero de audio',
  'Camarógrafos',
  'Rodies',
  'Auxiliar de contenidos de video',
  'Ingeniero audio monitores',
  'Productor master de cámara',
] as const

export const personalCategorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  isActive: z.boolean().optional(),
})

export type PersonalCategoryFormData = z.infer<typeof personalCategorySchema>

export type PersonalCategory = {
  id: string
  name: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: { staff: number }
}

const coercedDecimal = z
  .union([z.number(), z.string(), z.null()])
  .transform(v => (v === null || v === '' ? null : Number(v) || null))
  .nullable()
  .optional()

export const personalStaffSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  shiftRate: coercedDecimal,
  categoryId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export type PersonalStaffFormData = z.infer<typeof personalStaffSchema>

export type PersonalStaff = {
  id: string
  name: string
  shiftRate: number | string | null
  categoryId: string | null
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: PersonalCategory | null
}
