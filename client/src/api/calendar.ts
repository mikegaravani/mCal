import api from "./axios";

export const getEvents = () => api.get("/events");

export const getTasks = () => api.get("/tasks");
