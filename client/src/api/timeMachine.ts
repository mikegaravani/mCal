import api from "./axios";

export const timeMachineApi = {
  getCurrentTime: async (): Promise<Date> => {
    const res = await api.get("/time-machine");
    return new Date(res.data.now);
  },

  setCustomTime: async (customTime: Date): Promise<void> => {
    await api.post("/time-machine", { customTime });
  },

  resetTime: async (): Promise<void> => {
    await api.post("/time-machine/reset");
  },
};
