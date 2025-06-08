import api from "./axios";

export const verifyPassword = (password: string) =>
  api.post("/admin/verify-password", { password });
