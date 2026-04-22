import { z } from 'zod'
export { CATERING_STAFF_ROLES } from './catering-staff-freelance'
export type { CateringStaffRole } from './catering-staff-freelance'

export const cateringStaffCompanySchema = z.object({
  name: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  staffCount: z.number().int().min(1).optional().nullable(),
  costMode: z.enum(['PER_HOUR', 'PER_SHIFT']).optional(),
  costPerHour: z.number().min(0).optional().nullable(),
  costPerShift: z.number().min(0).optional().nullable(),
  markupPercent: z.number().min(0).optional().nullable(),
  markupAmount: z.number().min(0).optional().nullable(),
  total: z.number().min(0).optional().nullable(),
  isActive: z.boolean().optional(),
})

export type CateringStaffCompanyFormData = z.infer<typeof cateringStaffCompanySchema>

export type CateringStaffCompany = {
  id: string
  name: string | null
  supplierId: string | null
  role: string | null
  staffCount: number | null
  costMode: string
  costPerHour: number | null
  costPerShift: number | null
  markupPercent: number | null
  markupAmount: number | null
  total: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  supplier?: { id: string; name: string } | null
}
