import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  OrderListResponse,
  OrderResponse,
  CreateOrderInput,
  UpdateOrderInput,
  OrderItemListResponse,
  CreateOrderItemInput,
  UpdateOrderItemInput,
  OrderItemResponse,
} from "../schemas/order.schema.ts";
import {
  addItemsToOrder,
  createOrder,
  deleteOrder,
  deleteOrderItem,
  findOrderById,
  listItensByOrderId,
  listOrders,
  updateOrder,
  updateOrderItem,
} from "../services/order.service.ts";

export const handleCreateOrder = async (
  request: FastifyRequest<{ Body: CreateOrderInput }>,
  reply: FastifyReply,
): Promise<OrderResponse> => {
  const order = await createOrder(request.body);

  return reply.code(201).send(order);
};

export const handleListOrders = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<OrderListResponse> => {
  const orders = await listOrders();

  return reply.code(200).send(orders);
};

export const handleGetOrder = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<OrderResponse> => {
  const id = request.params.id;

  const order = await findOrderById(id);

  return reply.code(200).send(order);
};

export const handleDeleteOrder = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = request.params.id;
  await deleteOrder(id);

  return reply.code(204).send();
};

export const handleUpdateOrder = async (
  request: FastifyRequest<{ Body: UpdateOrderInput; Params: { id: string } }>,
  reply: FastifyReply,
): Promise<OrderResponse> => {
  const id = request.params.id;

  const order = await updateOrder(id, request.body);

  return reply.code(200).send(order);
};

export const handleListOrderItems = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<OrderItemListResponse> => {
  const id = request.params.id;

  const orderItems = await listItensByOrderId(id);

  return reply.code(200).send(orderItems);
};

export const handleAddOrderItem = async (
  request: FastifyRequest<{
    Body: CreateOrderItemInput[];
    Params: { id: string };
  }>,
  reply: FastifyReply,
): Promise<OrderItemListResponse> => {
  const id = request.params.id;

  const orderItems = await addItemsToOrder(id, request.body);

  return reply.code(201).send(orderItems);
};

export const handleUpdateOrderItem = async (
  request: FastifyRequest<{
    Body: UpdateOrderItemInput;
    Params: { id: string };
  }>,
  reply: FastifyReply,
): Promise<OrderItemResponse> => {
  const id = request.params.id;

  const orderItems = await updateOrderItem(id, request.body);

  return reply.code(200).send(orderItems);
};

export const handleDeleteOrderItem = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = request.params.id;

  await deleteOrderItem(id);

  return reply.code(204).send();
};
