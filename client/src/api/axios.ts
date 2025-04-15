// src/api/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally add interceptors here for auth

export default instance;
