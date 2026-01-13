import api from "./axios";

export const getAllCustomers = async () => {
  return (await api.get("/users")).data;
};

export const deleteCustomer = async (id: number) => {
  return (await api.delete(`/users/${id}`)).data;
};



