import { create } from "zustand";

interface TaskDialogState {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useTaskDialogStore = create<TaskDialogState>((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));
