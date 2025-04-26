import api from "./axios";

export const timeMachineApi = {
  getCurrentTime: async (): Promise<{ now: Date; isModified: boolean }> => {
    const res = await api.get("/time-machine");
    return {
      now: new Date(res.data.now),
      isModified: res.data.isModified,
    };
  },

  setCustomTime: async (customTime: Date): Promise<void> => {
    await api.post("/time-machine", { customTime });
  },

  resetTime: async (): Promise<void> => {
    await api.post("/time-machine/reset");
  },
};
