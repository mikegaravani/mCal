import { create } from "zustand";
import { Event } from "@/components/Calendar/types/calendarType";
import { getEvents } from "@/api/calendar";

interface EventStore {
  events: Event[];
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  fetchEvents: async () => {
    try {
      const res = await getEvents();
      const events: Event[] = res.data.map((e: any) => ({
        ...e,
        id: e._id,
        type: "event",
      }));
      set({ events });
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  },
}));
