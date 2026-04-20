'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { EventClickArg } from '@fullcalendar/core'
import esLocale from '@fullcalendar/core/locales/es'
import { Plus, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEventStore } from '@/store/eventStore'
import { CalendarEvent, EventFormData } from '@/lib/validations/event'
import { EventModal } from '@/components/forms/EventModal'
import '../calendario/fullcalendar.css'

export default function AgendaPage() {
  const { events, setEvents, addEvent, updateEvent, removeEvent, isLoading, setLoading } =
    useEventStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const calendarRef = useRef<FullCalendar>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setEvents(data.map(toFCEvent))
    } catch {
      toast.error('Error al cargar eventos')
    } finally {
      setLoading(false)
    }
  }, [setEvents, setLoading])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const openEdit = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const openCreate = () => {
    setSelectedEvent(null)
    setModalOpen(true)
  }

  const handleEventClick = (info: EventClickArg) => {
    const ev = events.find((e) => e.id === info.event.id)
    if (ev) openEdit(ev)
  }

  const handleSave = async (data: EventFormData) => {
    setIsSubmitting(true)
    try {
      if (selectedEvent) {
        const res = await fetch(`/api/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error()
        const updated = await res.json()
        updateEvent(selectedEvent.id, toFCEvent(updated))
        toast.success('Evento actualizado')
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error()
        const created = await res.json()
        addEvent(toFCEvent(created))
        toast.success('Evento creado')
      }
      setModalOpen(false)
    } catch {
      toast.error('Error al guardar el evento')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/events/${selectedEvent.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      removeEvent(selectedEvent.id)
      setModalOpen(false)
      toast.success('Evento eliminado')
    } catch {
      toast.error('Error al eliminar el evento')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Agenda</h1>
          <p className="text-gray-400 text-sm mt-0.5">Vista de lista de todos tus eventos</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEvents}
            disabled={isLoading}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors disabled:opacity-50"
            title="Recargar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-pink-600/20"
          >
            <Plus className="w-4 h-4" />
            Nuevo evento
          </button>
        </div>
      </div>

      {/* Agenda card */}
      <div className="glass rounded-2xl p-4 sm:p-6 flex-1 min-h-0">
        <FullCalendar
          ref={calendarRef}
          plugins={[listPlugin, interactionPlugin]}
          initialView="listYear"
          locale={esLocale}
          initialDate={new Date()}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'listDay,listWeek,listMonth,listYear',
          }}
          buttonText={{
            today: 'Hoy',
            listDay: 'Día',
            listWeek: 'Semana',
            listMonth: 'Mes',
            listYear: 'Año',
          }}
          events={events.map((e) => ({
            id: e.id,
            title: e.title,
            start: e.start,
            end: e.end ?? undefined,
            allDay: e.allDay,
            backgroundColor: e.color,
            borderColor: e.color,
            extendedProps: {
              description: e.description,
              notes: e.notes,
            },
          }))}
          eventClick={handleEventClick}
          eventContent={(arg) => (
            <div className="flex items-center gap-2 px-1 w-full overflow-hidden">
              <span
                className="shrink-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: arg.event.backgroundColor }}
              />
              <span className="truncate text-sm font-medium">
                {arg.event.title}
              </span>
              {arg.event.extendedProps.description && (
                <span className="hidden sm:block truncate text-xs opacity-60 ml-1">
                  — {arg.event.extendedProps.description}
                </span>
              )}
            </div>
          )}
          noEventsContent={
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-gray-500 text-sm">No hay eventos en este período</p>
              <button
                onClick={openCreate}
                className="mt-3 text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors"
              >
                + Crear primer evento
              </button>
            </div>
          }
          height="100%"
          contentHeight="auto"
        />
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={selectedEvent ? handleDelete : undefined}
        event={selectedEvent}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

function toFCEvent(e: any): CalendarEvent {
  return {
    ...e,
    start: typeof e.start === 'string' ? e.start : new Date(e.start).toISOString(),
    end: e.end ? (typeof e.end === 'string' ? e.end : new Date(e.end).toISOString()) : null,
    createdAt: typeof e.createdAt === 'string' ? e.createdAt : new Date(e.createdAt).toISOString(),
    updatedAt: typeof e.updatedAt === 'string' ? e.updatedAt : new Date(e.updatedAt).toISOString(),
  }
}
