import api from "./axios";

export const registerUser = (data: {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  birthDate?: string;
  location?: string;
}) => api.post("/auth/register", data);

export const loginUser = (data: { username: string; password: string }) =>
  api.post("/auth/login", data);

export const fetchUser = (id: string) => api.get(`/auth/user/${id}`);

export const fetchMe = () => api.get("/auth/me");
