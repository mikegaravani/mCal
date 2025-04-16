import api from "./axios";

export const getNotes = () => api.get("/notes");

export const createNote = (data: {
  title: string;
  content: string;
  categories: string[];
  color: number;
  starred: boolean;
}) => api.post("/notes", data);

export const updateNote = (id: string, data: any) =>
  api.put(`/notes/${id}`, data);
