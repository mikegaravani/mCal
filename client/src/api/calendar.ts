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

export const createTask = (taskData: {
  title: string;
  description?: string;
  categories?: string[];
  dueDate?: Date;
  isCompleted: boolean;
}) => api.post("/tasks", taskData);

export const updateEvent = (
  id: string,
  data: Partial<{
    title: string;
    startTime: Date;
    endTime: Date;
    isAllDay: boolean;
    description?: string;
    location?: string;
  }>
) => api.put(`/events/${id}`, data);

export const updateTask = (
  id: string,
  data: Partial<{
    title: string;
    description?: string;
    dueDate?: Date;
    isCompleted: boolean;
    categories?: string[];
    priority?: number;
  }>
) => api.put(`/tasks/${id}`, data);

export const deleteEvent = (id: string) => api.delete(`/events/${id}`);
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);
