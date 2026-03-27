import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import {
  orderResponseSchema,
  createOrderSchema,
  updateOrderSchema,
  orderItemListSchema,
  orderListResponse,
  createOrderItemSchema,
  updateOrderItemSchema,
  orderItemSchema,
} from "../schemas/order.schema.ts";
import {
  handleAddOrderItem,
  handleCreateOrder,
  handleDeleteOrder,
  handleDeleteOrderItem,
  handleGetOrder,
  handleListOrderItems,
  handleListOrders,
  handleUpdateOrder,
  handleUpdateOrderItem,
} from "../controllers/order.controller.ts";

export const orderRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/orders",
    {
      schema: {
        tags: ["Order"],
        summary: "Create a new order",
        body: createOrderSchema,
        response: { 201: orderResponseSchema },
      },
    },
    handleCreateOrder,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/orders",
    {
      schema: {
        tags: ["Order"],
        summary: "List all orders",
        response: { 200: orderListResponse },
      },
    },
    handleListOrders,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/orders/:id",
    {
      schema: {
        tags: ["Order"],
        summary: "Get a Order by id",
        params: z.object({ id: z.string() }),
        response: { 200: orderResponseSchema },
      },
    },
    handleGetOrder,
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete(
    "/orders/:id",
    {
      schema: {
        tags: ["Order"],
        summary: "Delete a order by id",
        params: z.object({ id: z.string() }),
        response: { 204: z.void() },
      },
    },
    handleDeleteOrder,
  );

  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/orders/:id",
    {
      schema: {
        tags: ["Order"],
        summary: "Update a order by id",
        params: z.object({ id: z.string() }),
        body: updateOrderSchema,
        response: { 200: orderResponseSchema },
      },
    },
    handleUpdateOrder,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/orders/:id/Items",
    {
      schema: {
        tags: ["Order"],
        summary: "List all Items of a order by id",
        params: z.object({ id: z.string() }),
        response: { 200: orderItemListSchema },
      },
    },
    handleListOrderItems,
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/orders/:id/Items",
    {
      schema: {
        tags: ["Order"],
        summary: "Add Items to a order by id",
        params: z.object({ id: z.string() }),
        body: z.array(createOrderItemSchema),
        response: { 201: orderItemListSchema },
      },
    },
    handleAddOrderItem,
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete(
    "/orders/Items/:id_item",
    {
      schema: {
        tags: ["Order"],
        summary: "Delete a Item of a order by id",
        params: z.object({ id: z.string() }),
        response: { 204: z.void() },
      },
    },
    handleDeleteOrderItem,
  );

  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/orders/Items/:id_item",
    {
      schema: {
        tags: ["Order"],
        summary: "Update a Item of a order by id",
        params: z.object({ id: z.string() }),
        body: updateOrderItemSchema,
        response: { 200: orderItemSchema },
      },
    },
    handleUpdateOrderItem,
  );
};
