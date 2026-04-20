import { z } from 'zod'

export const cateringSupplierSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  nit: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
})

export type CateringSupplierFormData = z.infer<typeof cateringSupplierSchema>

export type CateringSupplier = {
  id: string
  name: string
  nit: string | null
  contactName: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
  website: string | null
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
