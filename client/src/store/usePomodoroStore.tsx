// Pomodoro store for starting a pomodoro from the homepage dashboard
import { create } from "zustand";

interface StudyPlanSession {
  focusTime: number;
  breakTime: number;
  cycles: number;
}

interface PomodoroState {
  pomodoroMinutes: number;
  breakMinutes: number;
  startFromDashboard: boolean;

  studyPlanSession: StudyPlanSession | null;

  setPomodoroMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  setStartFromDashboard: (start: boolean) => void;

  setStudyPlanSession: (session: StudyPlanSession) => void;
  clearStudyPlanSession: () => void;
}

export const usePomodoroStore = create<PomodoroState>((set) => ({
  pomodoroMinutes: 30,
  breakMinutes: 5,
  startFromDashboard: false,

  studyPlanSession: null,

  setPomodoroMinutes: (minutes) => set({ pomodoroMinutes: minutes }),
  setBreakMinutes: (minutes) => set({ breakMinutes: minutes }),
  setStartFromDashboard: (start) => set({ startFromDashboard: start }),

  setStudyPlanSession: (session) => set({ studyPlanSession: session }),
  clearStudyPlanSession: () => set({ studyPlanSession: null }),
}));
