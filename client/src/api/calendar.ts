import api from "./axios";

export const getEvents = () => api.get("/events");
export const getTasks = () => api.get("/tasks");

export const createEvent = (eventData: {
  title: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  description?: string;
  location?: string;
}) => api.post("/events", eventData);

export const updateTask = (
  id: string,
  data: Partial<{ isCompleted: boolean }>
) => api.put(`/tasks/${id}`, data);
