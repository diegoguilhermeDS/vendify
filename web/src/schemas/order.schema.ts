import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { clientResponseSchema } from "./client.schema.ts";
import { productResponseSchema } from "./product.schema.ts";

// Schemas de itens de pedido
export const createOrderItemSchema = z.object({
  id_product: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

export const updateOrderItemSchema = createOrderItemSchema.partial();

export const orderItemSchema = z.object({
  id_product: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

export const orderItemListSchema = z.array(orderItemSchema);

// Schema de criação
export const createOrderSchemaBase = z.object({
  id_client: z.string(),
  itens: z.array(createOrderItemSchema).min(1),
});

export const updateOrderSchemaBase = createOrderSchemaBase
  .partial()
  .omit({
    itens: true,
  })
  .extend({
    itens: z.array(updateOrderItemSchema),
  });

// Schema de resposta
export const orderResponseSchema = z.object({
  id_order: z.string(),
  data: z.date(),
  id_client: z.string(),
  client: clientResponseSchema,
  quantityItems: z.number().positive(),
  // itens: z.array(orderItemSchema),
});

export const orderResponseSchemaWithItens = orderResponseSchema.extend({
  itens: z.array(
    orderItemSchema.extend({
      product: productResponseSchema,
      id_product: z.string(),
    }),
  ),
}).omit({ quantityItems: true });

// List OUTPUT
export const orderListResponse = z.array(orderResponseSchema);
export const createOrderSchema = toTypedSchema(createOrderSchemaBase);
export const updateOrderSchema = toTypedSchema(updateOrderSchemaBase);

// Types derivados automaticamente
export type CreateOrderInput = z.infer<typeof createOrderSchemaBase>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchemaBase>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type OrderResponseWithItens = z.infer<
  typeof orderResponseSchemaWithItens
>;
export type OrderListResponse = z.infer<typeof orderListResponse>;

export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderItemInput = z.infer<typeof updateOrderItemSchema>;
export type OrderItemResponse = z.infer<typeof orderItemSchema>;
export type OrderItemListResponse = z.infer<typeof orderItemListSchema>;
