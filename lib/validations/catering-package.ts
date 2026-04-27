import { z } from 'zod'

export const PACKAGE_TYPES = [
  'Empresarial',
  'Social',
  'Gourmet',
  'Económico',
  'Buffet',
  'Cóctel',
  'Coffee Break',
  'Personalizado',
] as const

export type PackageType = (typeof PACKAGE_TYPES)[number]

// z.coerce.number() handles Prisma Decimal → string serialization
const coercedNum = z.union([z.number(), z.string()]).transform(v => Number(v) || 0)
const coercedNumNullable = z.union([z.number(), z.string(), z.null()]).transform(v => v === null ? null : Number(v) || 0).nullable()

export const packageItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  unitCost: coercedNumNullable.optional(),
  subtotal: coercedNumNullable.optional(),
})

export const packageMenajeSchema = z.object({
  menajeId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  unitCost: coercedNumNullable.optional(),
  subtotal: coercedNumNullable.optional(),
})

export const packageMenuSchema = z.object({
  menuType: z.enum(['CUSTOM', 'FROM_ITEMS']),
  menuId: z.string().min(1),
  menuName: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  unitCost: coercedNumNullable.optional(),
  subtotal: coercedNumNullable.optional(),
})

export const packageStaffSchema = z.object({
  staffType: z.enum(['FREELANCE', 'COMPANY']),
  staffId: z.string().min(1),
  staffName: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  unitCost: coercedNumNullable.optional(),
  subtotal: coercedNumNullable.optional(),
})

export const cateringPackageSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  computedTotal: coercedNumNullable.optional(),
  customTotal: coercedNumNullable.optional(),
  useCustomTotal: z.boolean().optional(),
  isActive: z.boolean().optional(),
  items: z.array(packageItemSchema).optional(),
  menaje: z.array(packageMenajeSchema).optional(),
  menus: z.array(packageMenuSchema).optional(),
  staff: z.array(packageStaffSchema).optional(),
})

export type CateringPackageFormData = z.infer<typeof cateringPackageSchema>

export type CateringPackageItemEntry = {
  id: string
  packageId: string
  itemId: string
  quantity: number
  unitCost: number | null
  subtotal: number | null
  item: { id: string; name: string; category: string | null; total: number | null }
}

export type CateringPackageMenajeEntry = {
  id: string
  packageId: string
  menajeId: string
  quantity: number
  unitCost: number | null
  subtotal: number | null
  menaje: { id: string; name: string; category: string | null; total: number | null }
}

export type CateringPackageMenuEntry = {
  id: string
  packageId: string
  menuType: string
  menuId: string
  menuName: string
  quantity: number
  unitCost: number | null
  subtotal: number | null
}

export type CateringPackageStaffEntry = {
  id: string
  packageId: string
  staffType: string
  staffId: string
  staffName: string
  quantity: number
  unitCost: number | null
  subtotal: number | null
}

export type CateringPackage = {
  id: string
  name: string
  description: string | null
  type: string | null
  computedTotal: number | null
  customTotal: number | null
  useCustomTotal: boolean
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  items: CateringPackageItemEntry[]
  menaje: CateringPackageMenajeEntry[]
  menus: CateringPackageMenuEntry[]
  staff: CateringPackageStaffEntry[]
}
