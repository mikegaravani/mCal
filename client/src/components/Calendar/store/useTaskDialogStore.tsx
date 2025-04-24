import { create } from "zustand";
import { Task } from "@/components/Calendar/types/calendarType";

interface TaskDialogState {
  isOpen: boolean;
  taskToEdit: Task | null;
  openDialog: (task: Task | null) => void;
  closeDialog: () => void;
}

export const useTaskDialogStore = create<TaskDialogState>((set) => ({
  isOpen: false,
  taskToEdit: null,
  openDialog: (task) => set({ isOpen: true, taskToEdit: task }),
  closeDialog: () => set({ isOpen: false, taskToEdit: null }),
}));
