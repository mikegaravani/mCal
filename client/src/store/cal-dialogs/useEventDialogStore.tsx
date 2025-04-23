import { create } from "zustand";

interface EventDialogState {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useEventDialogStore = create<EventDialogState>((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));
