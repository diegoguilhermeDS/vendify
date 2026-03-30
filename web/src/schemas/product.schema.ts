import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

// Schema de criação
const createProductSchemaBase = z.object({
  name: z
    .string({ required_error: "Nome obrigatório" })
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  price: z.coerce
    .number({
      required_error: "Preço obrigatório",
      invalid_type_error: "Preço obrigatório",
    })
    .min(0.01, "Preço deve ser maior que zero"),
});

// Schema de atualização
const updateProductSchemaBase = createProductSchemaBase.partial();

// Schema de resposta
export const productResponseSchema = z.object({
  id_product: z.string(),
  name: z.string().min(3),
  price: z.number().positive(),
});

// List OUTPUT
export const createProductSchema = toTypedSchema(createProductSchemaBase);
export const updateProductSchema = toTypedSchema(updateProductSchemaBase);
export const productListResponse = z.array(productResponseSchema);

// Types derivados automaticamente
export type CreateProductInput = z.infer<typeof createProductSchemaBase>;
export type UpdateProductInput = z.infer<typeof updateProductSchemaBase>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProductListResponse = z.infer<typeof productListResponse>;
