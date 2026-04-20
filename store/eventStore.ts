import { create } from 'zustand'
import { CalendarEvent } from '@/lib/validations/event'

interface EventStore {
  events: CalendarEvent[]
  isLoading: boolean
  error: string | null
  setEvents: (events: CalendarEvent[]) => void
  addEvent: (event: CalendarEvent) => void
  updateEvent: (id: string, event: CalendarEvent) => void
  removeEvent: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  isLoading: false,
  error: null,
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, event) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? event : e)),
    })),
  removeEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
