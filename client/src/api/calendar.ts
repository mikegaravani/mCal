import api from "./axios";

export const getEvents = () => api.get("/events");
export const getTasks = () => api.get("/tasks");

export const updateTask = (
  id: string,
  data: Partial<{ isCompleted: boolean }>
) => api.put(`/tasks/${id}`, data);
