import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().max(1000).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  start: z.string().min(1, 'La fecha de inicio es requerida'),
  end: z.string().optional().nullable(),
  allDay: z.boolean(),
  color: z.string(),
})

export type EventFormData = z.infer<typeof eventSchema>

export type CalendarEvent = {
  id: string
  title: string
  description: string | null
  notes: string | null
  start: string
  end: string | null
  allDay: boolean
  color: string
  createdAt: string
  updatedAt: string
  createdById: string | null
  createdBy?: { id: string; name: string | null; email: string } | null
}

export const EVENT_COLORS = [
  { label: 'Rosa',     value: '#E91E63' },
  { label: 'Violeta',  value: '#7C3AED' },
  { label: 'Azul',     value: '#2563EB' },
  { label: 'Celeste',  value: '#0891B2' },
  { label: 'Verde',    value: '#059669' },
  { label: 'Naranja',  value: '#EA580C' },
  { label: 'Rojo',     value: '#DC2626' },
  { label: 'Gris',     value: '#6B7280' },
]
