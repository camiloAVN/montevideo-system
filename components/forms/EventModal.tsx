'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Trash2, Calendar, Clock } from 'lucide-react'
import { eventSchema, EventFormData, CalendarEvent, EVENT_COLORS } from '@/lib/validations/event'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EventFormData) => Promise<void>
  onDelete?: () => Promise<void>
  event?: CalendarEvent | null
  defaultStart?: string
  defaultEnd?: string
  isSubmitting?: boolean
}

export function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  defaultStart,
  defaultEnd,
  isSubmitting = false,
}: EventModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      notes: '',
      start: defaultStart ?? '',
      end: defaultEnd ?? '',
      allDay: false,
      color: '#E91E63',
    },
  })

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description ?? '',
        notes: event.notes ?? '',
        start: toLocalInput(event.start, event.allDay),
        end: event.end ? toLocalInput(event.end, event.allDay) : '',
        allDay: event.allDay,
        color: event.color,
      })
    } else {
      reset({
        title: '',
        description: '',
        notes: '',
        start: defaultStart ?? '',
        end: defaultEnd ?? '',
        allDay: false,
        color: '#E91E63',
      })
    }
  }, [event, defaultStart, defaultEnd, reset])

  const selectedColor = watch('color')
  const allDay = watch('allDay')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Color strip */}
        <div className="h-1 w-full" style={{ backgroundColor: selectedColor }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-semibold text-gray-100">
              {event ? 'Editar evento' : 'Nuevo evento'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSave)} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <input
              {...register('title')}
              placeholder="Título del evento *"
              className="w-full px-0 py-1 bg-transparent border-0 border-b border-white/10 text-gray-100 text-base font-medium placeholder:text-gray-600 focus:outline-none focus:border-pink-600 transition-colors"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Color picker */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setValue('color', c.value)}
                  title={c.label}
                  className={cn(
                    'w-6 h-6 rounded-full transition-all duration-150',
                    selectedColor === c.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111111] scale-110'
                      : 'hover:scale-110'
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          {/* All day toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setValue('allDay', !allDay)}
              className={cn(
                'relative w-9 h-5 rounded-full transition-colors duration-200',
                allDay ? 'bg-pink-600' : 'bg-gray-700'
              )}
            >
              <span className={cn(
                'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                allDay ? 'translate-x-4' : 'translate-x-0'
              )} />
            </button>
            <span className="text-sm text-gray-400">Todo el día</span>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Inicio *
              </label>
              <input
                {...register('start')}
                type={allDay ? 'date' : 'datetime-local'}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-sm focus:outline-none focus:border-pink-600 transition-colors [color-scheme:dark]"
              />
              {errors.start && (
                <p className="text-red-400 text-xs mt-1">{errors.start.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Fin
              </label>
              <input
                {...register('end')}
                type={allDay ? 'date' : 'datetime-local'}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-sm focus:outline-none focus:border-pink-600 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Descripción</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Descripción breve del evento..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-sm placeholder:text-gray-600 focus:outline-none focus:border-pink-600 transition-colors resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Notas</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Notas adicionales, recordatorios, detalles importantes..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-sm placeholder:text-gray-600 focus:outline-none focus:border-pink-600 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            {event && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                {event ? 'Guardar cambios' : 'Crear evento'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Converts an ISO string to a local datetime-local or date input value
function toLocalInput(iso: string, allDay: boolean): string {
  const d = new Date(iso)
  if (allDay) {
    return d.toISOString().slice(0, 10)
  }
  // Format: YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
