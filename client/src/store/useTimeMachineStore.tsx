import { create } from "zustand";

interface TimeMachineState {
  systemTime: Date;
  customTime: Date | null;
  isModified: boolean;
  now: Date;
  setCustomTime: (date: Date) => void;
  resetTime: () => void;
  updateNow: () => void;
}

export const useTimeMachineStore = create<TimeMachineState>((set, get) => ({
  systemTime: new Date(),
  customTime: null,
  isModified: false,
  now: new Date(),

  setCustomTime: (date: Date) =>
    set({
      customTime: date,
      isModified: true,
      now: date,
    }),

  resetTime: () =>
    set({
      customTime: null,
      isModified: false,
      systemTime: new Date(),
      now: new Date(),
    }),

  updateNow: () => {
    const { customTime } = get();
    if (customTime) {
      set((state) => ({
        now: new Date(
          customTime.getTime() + (Date.now() - state.systemTime.getTime())
        ),
      }));
    } else {
      set({
        systemTime: new Date(),
        now: new Date(),
      });
    }
  },
}));
