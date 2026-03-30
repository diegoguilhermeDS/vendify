import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

// Schema de criação
export const createClientSchemaBase = z.object({
  name: z.string({ required_error: "Nome obrigátorio"}).min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string({ required_error: "Email obrigatório"}).email("Email inválido"),
});

// Schema de atualização
export const updateClientSchemaBase = createClientSchemaBase.partial();

// Schema de resposta
export const clientResponseSchema = z.object({
  id_client: z.string(),
  name: z.string().min(3),
  email: z.string().email(),
});

// List OUTPUT
export const clientListResponse = z.array(clientResponseSchema);
export const createClientSchema = toTypedSchema(createClientSchemaBase);
export const updateClientSchema = toTypedSchema(updateClientSchemaBase);

// Types derivados automaticamente
export type CreateClientInput = z.infer<typeof createClientSchemaBase>;
export type UpdateClientInput = z.infer<typeof updateClientSchemaBase>;
export type ClientResponse = z.infer<typeof clientResponseSchema>;
export type ClientListResponse = z.infer<typeof clientListResponse>;
