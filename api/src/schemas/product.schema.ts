import { z } from "zod";
import { Prisma } from "../../prisma/generated/prisma/client.ts";

// Schema de criação
export const createProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
});

// Schema de atualização
export const updateProductSchema = createProductSchema.partial();

// Schema de resposta
export const productResponseSchema = z.object({
  id_product: z.string(),
  name: z.string().min(3),
  price: z.number().positive(),
});

// List OUTPUT
export const productListResponse = z.array(productResponseSchema);

// Types derivados automaticamente
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProductListResponse = z.infer<typeof productListResponse>;
