// src/api/repairs.ts
import api from "./axios";

// GET repair orders of logged-in user (CLIENT)
export const getMyOrders = async () => {
  return (await api.get("/repair-orders/my")).data;
};

// GET order by ID
export const getOrderById = async (id: number) => {
  return (await api.get(`/repair-orders/${id}`)).data;
};

// GET orders of a specific car
export const getOrdersByCar = async (carId: number) => {
  return (await api.get(`/repair-orders/car/${carId}`)).data;
};

// ADMIN: get all repair orders
export const getAllOrders = async () => {
  return (await api.get("/repair-orders")).data;
};

// Create order for a car
export const createOrder = async (carId: number, dto: any) => {
  return (await api.post(`/repair-orders/car/${carId}`, dto)).data;
};

// Update order (admin)
export const updateOrder = async (id: number, dto: any) => {
  return (await api.put(`/repair-orders/${id}`, dto)).data;
};

// Close order (admin)
export const closeOrder = async (id: number) => {
  return (await api.put(`/repair-orders/${id}/close`)).data;
};

//Delete order (admin)
export const deleteOrder = async (id: number) => {
  return (await api.delete(`/repair-orders/${id}`)).data;
};

// Notes
export const getOrderNotes = async (id: number) => {
  return (await api.get(`/repair-orders/${id}/notes`)).data;
};

export const addOrderNote = async (id: number, dto: { text: string }) => {
  return (await api.post(`/repair-orders/${id}/notes`, dto)).data;
};

// ADMIN: Repair order details 
export const getOrderDetails = async (id: number) => {
  return (await api.get(`/repair-orders/${id}/details`)).data;
};






