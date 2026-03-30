import { api } from "../api";
import type {
  CreateClientInput,
  UpdateClientInput,
} from "@/schemas/client.schema";

export const clientService = {
  create(data: CreateClientInput) {
    return api.post("/clients", data);
  },
  update(id: string, data: UpdateClientInput) {
    return api.put(`/clients/${id}`, data);
  },
  remove(id: string) {
    return api.delete(`/clients/${id}`);
  },
  list() {
    return api.get("/clients");
  },
};
