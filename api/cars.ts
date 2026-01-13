// src/api/cars.ts
import api from "./axios";

export const getMyCars = async () => {
  const res = await api.get("/cars/my");
  return res.data;
};

export const getAllCars = async () => {
  const res = await api.get("/cars");
  return res.data;
};

export const createCar = async (data: {
  brand: string;
  model: string;
  year: number;
  plate: string;
}) => {
  const payload = { ...data, plateNumber: data.plate };
  delete (payload as any).plate;

  const res = await api.post("/cars", payload);
  return res.data;
};

export const updateCarStatus = async (id: number, status: string) => {
  const res = await api.put(`/cars/${id}/status`, { status });
  return res.data;
};

export const deleteCar = async (id: number) => {
  const res = await api.delete(`/cars/${id}`);
  return res.data;
};

