import type { CreateOrderInput, CreateOrderItemInput, OrderResponseWithItens, UpdateOrderInput, UpdateOrderItemInput } from "@/schemas/order.schema";
import { api } from "../api";

export const orderService = {
  create(data: CreateOrderInput) {
    return api.post("/orders", data);
  },
  update(id: string, data: UpdateOrderInput) {
    return api.put(`/orders/${id}`, data);
  },
  remove(id: string) {
    return api.delete(`/orders/${id}`);
  },
  list() {
    return api.get("/orders");
  },

  get(id: string): Promise<OrderResponseWithItens> {
    return api.get(`/orders/${id}`);
  },

  listItems(id: string) {
    return api.get(`/orders/${id}/items`);
  },

  addItem(id: string, data: CreateOrderItemInput) {
    return api.post(`/orders/${id}/items`, data);
  },

  removeItem(id: string) {
    return api.delete(`/orders/items/${id}`);
  },

  updateItem(id: string, data: UpdateOrderItemInput) {
    return api.put(`/orders/items/${id}`, data);
  },
};
