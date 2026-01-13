// src/api/auth.ts
import api from "./axios";

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data; // { token, roles }
};

export const register = async (data: { email: string; password: string; name: string }) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const saveAuth = (token: string, roles: string[]) => {
  localStorage.setItem("token", token);
  localStorage.setItem("roles", JSON.stringify(roles));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
  window.location.href = "/login";
};

