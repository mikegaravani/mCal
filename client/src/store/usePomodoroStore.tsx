// Pomodoro store for starting a pomodoro from the homepage dashboard
import { create } from "zustand";

interface PomodoroState {
  pomodoroMinutes: number;
  breakMinutes: number;
  startFromDashboard: boolean;
  setPomodoroMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  setStartFromDashboard: (start: boolean) => void;
}

export const usePomodoroStore = create<PomodoroState>((set) => ({
  pomodoroMinutes: 30,
  breakMinutes: 5,
  startFromDashboard: false,
  setPomodoroMinutes: (minutes) => set({ pomodoroMinutes: minutes }),
  setBreakMinutes: (minutes) => set({ breakMinutes: minutes }),
  setStartFromDashboard: (start) => set({ startFromDashboard: start }),
}));
