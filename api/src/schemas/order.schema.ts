import { z } from "zod";

// Schemas de itens de pedido
export const createOrderItemSchema = z.object({
  id_product: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
})

export const updateOrderItemSchema = createOrderItemSchema.partial();

export const orderItemSchema = z.object({
  id_product: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

export const orderItemListSchema = z.array(orderItemSchema);

// Schema de criação
export const createOrderSchema = z.object({
  id_client: z.string(),
  itens: z.array(createOrderItemSchema),
});

// Schema de atualização
// TO-DO: improve this schema
export const updateOrderSchema = createOrderSchema.omit({ itens: true }).partial();

// Schema de resposta
export const orderResponseSchema = z.object({
  id_order: z.string(),
  data: z.string().min(3),
  id_client: z.string(),
  itens: z.array(orderItemSchema),
});

// List OUTPUT
export const orderListResponse = z.array(orderResponseSchema);



// Types derivados automaticamente
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type OrderListResponse = z.infer<typeof orderListResponse>;

export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderItemInput = z.infer<typeof updateOrderItemSchema>;
export type OrderItemResponse = z.infer<typeof orderItemSchema>;
export type OrderItemListResponse = z.infer<typeof orderItemListSchema>;