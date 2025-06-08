import { runRemindersForEntireDay } from "./cron/runRemindersForEntireDay";
import { runOverdueTaskCheck } from "./cron/runOverdueTaskCheck";

let customTime: Date | null = null;
let systemTimeReference: Date = new Date();
let setTimeReference: number = Date.now();

export const timeMachineService = {
  getNow: (): Date => {
    if (!customTime) {
      return new Date();
    }
    const elapsed = Date.now() - setTimeReference;
    return new Date(customTime.getTime() + elapsed);
  },

  isModified: (): boolean => {
    return customTime !== null;
  },

  setCustomTime: (date: Date) => {
    customTime = date;
    systemTimeReference = new Date();
    setTimeReference = Date.now();

    console.log(`Custom time set to: ${customTime.toISOString()}`);
    runRemindersForEntireDay(customTime).catch(console.error);
    runOverdueTaskCheck().catch(console.error);
  },

  resetTime: () => {
    customTime = null;
    systemTimeReference = new Date();
    setTimeReference = Date.now();
  },
};
