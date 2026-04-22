import { z } from 'zod'

export const CATERING_STAFF_ROLES = [
  'Mesero',
  'Bartender',
  'Personal de bar',
  'Personal de cocina',
  'Logístico',
  'Transporte',
  'Higiene y apoyo',
  'Coordinación/Producción',
] as const

export type CateringStaffRole = typeof CATERING_STAFF_ROLES[number]

export const cateringStaffFreelanceSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  documentNumber: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  city: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  ratePerShift: z.number().min(0).optional().nullable(),
  ratePerHour: z.number().min(0).optional().nullable(),
  nightSurchargePercent: z.number().min(0).max(100).optional().nullable(),
  travelAllowance: z.number().min(0).optional().nullable(),
  hasSocialSecurity: z.boolean().optional(),
  hasFoodHandlingCert: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export type CateringStaffFreelanceFormData = z.infer<typeof cateringStaffFreelanceSchema>

export type CateringStaffFreelance = {
  id: string
  fullName: string
  documentNumber: string | null
  phone: string | null
  email: string | null
  city: string | null
  role: string | null
  ratePerShift: number | null
  ratePerHour: number | null
  nightSurchargePercent: number | null
  travelAllowance: number | null
  hasSocialSecurity: boolean
  hasFoodHandlingCert: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}
