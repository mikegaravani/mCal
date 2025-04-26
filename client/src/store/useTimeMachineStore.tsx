import { create } from "zustand";
import { timeMachineApi } from "@/api/timeMachine";

interface TimeMachineState {
  systemTime: Date;
  customTime: Date | null;
  isModified: boolean;
  now: Date;
  setCustomTime: (date: Date) => void;
  resetTime: () => void;
  updateNow: () => void;
  syncTimeFromBackend: () => Promise<void>;
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

  syncTimeFromBackend: async () => {
    try {
      const serverNow = await timeMachineApi.getCurrentTime();
      set({
        systemTime: new Date(),
        customTime: serverNow,
        isModified: true,
        now: serverNow,
      });
    } catch (error) {
      console.error("Failed to sync time from backend:", error);
    }
  },
}));
