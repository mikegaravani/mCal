// Pomodoro store for starting a pomodoro from the homepage dashboard
import { create } from "zustand";

interface PomodoroState {
  pomodoroMinutes: number;
  breakMinutes: number;
  setPomodoroMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
}

export const usePomodoroStore = create<PomodoroState>((set) => ({
  pomodoroMinutes: 30,
  breakMinutes: 5,
  setPomodoroMinutes: (minutes) => set({ pomodoroMinutes: minutes }),
  setBreakMinutes: (minutes) => set({ breakMinutes: minutes }),
}));
