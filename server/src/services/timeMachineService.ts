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

  setCustomTime: (date: Date) => {
    customTime = date;
    systemTimeReference = new Date();
    setTimeReference = Date.now();
  },

  resetTime: () => {
    customTime = null;
    systemTimeReference = new Date();
    setTimeReference = Date.now();
  },
};
