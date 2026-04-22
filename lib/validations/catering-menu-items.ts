import { z } from 'zod'

export const CATERING_MENU_TYPES = [
  'Desayuno',
  'Almuerzo',
  'Cena',
  'Coffee Break / Refrigerios',
  'Cóctel',
  'Pasabocas',
  'Postres',
  'Estaciones especiales',
  'Mesa dulce',
  'Hidratación',
  'Saludables',
] as const

export type CateringMenuType = (typeof CATERING_MENU_TYPES)[number]

export const cateringMenuFromItemsSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  menuType: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  useCustomTotal: z.boolean().optional(),
  customTotal: z.number().min(0).optional().nullable(),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .optional(),
})

export type CateringMenuFromItemsFormData = z.infer<typeof cateringMenuFromItemsSchema>

export type CateringMenuFromItemsRelation = {
  id: string
  menuId: string
  itemId: string
  quantity: number
  item: {
    id: string
    name: string
    category: string | null
    total: number | null
    unitCost: number | null
  }
}

export type CateringMenuFromItems = {
  id: string
  name: string
  menuType: string | null
  description: string | null
  computedTotal: number | null
  customTotal: number | null
  useCustomTotal: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  menuItems: CateringMenuFromItemsRelation[]
}
