import { api } from "../api";
import type { CreateProductInput, UpdateProductInput } from "@/schemas/product.schema";

export const productService = {
  create(data: CreateProductInput) {
    return api.post("/products", data);
  },
  update(id: string, data: UpdateProductInput) {
    return api.put(`/products/${id}`, data);
  },
  remove(id: string) {
    return api.delete(`/products/${id}`);
  },
  list() {
    return api.get("/products");
  },
};
