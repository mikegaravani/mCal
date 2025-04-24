import { create } from "zustand";
import { Event } from "@/components/Calendar/types/calendarType";

interface EventDialogState {
  isOpen: boolean;
  eventToEdit: Event | null;
  openDialog: (event: Event | null) => void;
  closeDialog: () => void;
}

export const useEventDialogStore = create<EventDialogState>((set) => ({
  isOpen: false,
  eventToEdit: null,
  openDialog: (event) => set({ isOpen: true, eventToEdit: event }),
  closeDialog: () => set({ isOpen: false, eventToEdit: null }),
}));
