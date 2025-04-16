import api from "./axios";

export const getNotes = () => api.get("/notes");
