// src/api/repairTasks.ts
import api from "./axios";

export const getTasks = async () => {
  return (await api.get("/tasks")).data;
};

export const createTask = async (dto: any) => {
  return (await api.post("/tasks", dto)).data;
};

export const updateTask = async (id: number, dto: any) => {
  return (await api.put(`/tasks/${id}`, dto)).data;
};

export const deleteTask = async (id: number) => {
  return (await api.delete(`/tasks/${id}`)).data;
};

