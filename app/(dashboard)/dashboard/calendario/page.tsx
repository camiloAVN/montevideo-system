'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction'
import { EventClickArg, EventDropArg } from '@fullcalendar/core'
import esLocale from '@fullcalendar/core/locales/es'
import { Plus, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEventStore } from '@/store/eventStore'
import { CalendarEvent, EventFormData } from '@/lib/validations/event'
import { EventModal } from '@/components/forms/EventModal'
import './fullcalendar.css'

export default function CalendarioPage() {
  const { events, setEvents, addEvent, updateEvent, removeEvent, isLoading, setLoading } =
    useEventStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [defaultStart, setDefaultStart] = useState<string>('')
  const [defaultEnd, setDefaultEnd] = useState<string>('')
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

  const openCreate = (start = '', end = '') => {
    setSelectedEvent(null)
    setDefaultStart(start)
    setDefaultEnd(end)
    setModalOpen(true)
  }

  const openEdit = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const handleEventClick = (info: EventClickArg) => {
    const ev = events.find((e) => e.id === info.event.id)
    if (ev) openEdit(ev)
  }

  const handleDateClick = (info: DateClickArg) => {
    const start = info.allDay
      ? info.dateStr
      : info.dateStr.slice(0, 16)
    openCreate(start)
  }

  const handleSelect = (info: { startStr: string; endStr: string; allDay: boolean }) => {
    openCreate(
      info.allDay ? info.startStr : info.startStr.slice(0, 16),
      info.allDay ? info.endStr : info.endStr.slice(0, 16)
    )
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

  const handleEventDrop = async (info: EventDropArg) => {
    const ev = events.find((e) => e.id === info.event.id)
    if (!ev) return
    try {
      const updated: EventFormData = {
        title: info.event.title,
        description: ev.description ?? '',
        notes: ev.notes ?? '',
        start: info.event.startStr.slice(0, 16),
        end: info.event.endStr ? info.event.endStr.slice(0, 16) : '',
        allDay: info.event.allDay,
        color: ev.color,
      }
      const res = await fetch(`/api/events/${ev.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      updateEvent(ev.id, toFCEvent(data))
    } catch {
      info.revert()
      toast.error('Error al mover el evento')
    }
  }

  const handleEventResize = async (info: EventResizeDoneArg) => {
    const ev = events.find((e) => e.id === info.event.id)
    if (!ev) return
    try {
      const updated: EventFormData = {
        title: info.event.title,
        description: ev.description ?? '',
        notes: ev.notes ?? '',
        start: info.event.startStr.slice(0, 16),
        end: info.event.endStr ? info.event.endStr.slice(0, 16) : '',
        allDay: info.event.allDay,
        color: ev.color,
      }
      const res = await fetch(`/api/events/${ev.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      updateEvent(ev.id, toFCEvent(data))
    } catch {
      info.revert()
      toast.error('Error al redimensionar el evento')
    }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Calendario</h1>
          <p className="text-gray-400 text-sm mt-0.5">Gestiona tus eventos y recordatorios</p>
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
            onClick={() => openCreate()}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-pink-600/20"
          >
            <Plus className="w-4 h-4" />
            Nuevo evento
          </button>
        </div>
      </div>

      {/* Calendar card */}
      <div className="glass rounded-2xl p-4 sm:p-6 flex-1 min-h-0">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          }}
          events={events.map((e) => ({
            id: e.id,
            title: e.title,
            start: e.start,
            end: e.end ?? undefined,
            allDay: e.allDay,
            backgroundColor: e.color,
            borderColor: e.color,
          }))}
          selectable
          selectMirror
          editable
          droppable
          dayMaxEvents={3}
          weekends
          nowIndicator
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          select={handleSelect}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
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
        defaultStart={defaultStart}
        defaultEnd={defaultEnd}
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
