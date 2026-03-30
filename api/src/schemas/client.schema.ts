import { z } from "zod";

// Schema de criação
export const createClientSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
});

// Schema de atualização
export const updateClientSchema = createClientSchema.partial();

// Schema de resposta
export const clientResponseSchema = z.object({
  id_client: z.string(),
  name: z.string().min(3),
  email: z.email(),
});

// List OUTPUT
export const clientListResponse = z.array(clientResponseSchema);

// Types derivados automaticamente
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientResponse = z.infer<typeof clientResponseSchema>;
export type ClientListResponse = z.infer<typeof clientListResponse>;
