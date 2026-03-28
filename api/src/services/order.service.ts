import { Prisma } from "../../prisma/generated/prisma/client.ts";
import { prisma } from "../db/prisma.ts";
import { ConflictError, NotFoundError } from "../erros/app-errors.ts";
import type {
  CreateOrderInput,
  CreateOrderItemInput,
  UpdateOrderInput,
  UpdateOrderItemInput,
} from "../schemas/order.schema.ts";

export const createOrder = async (payload: CreateOrderInput) => {
  try {
    const order = await prisma.order.create({
      data: {
        id_client: payload.id_client,
        itens: {
          createMany: {
            data: payload.itens,
          },
        },
      },
      include: {
        itens: true,
      },
    });

    return {
      ...order,
      itens: order.itens.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Order already exists.");
    }

    throw error;
  }
};

export const listOrders = async () => {
  return await prisma.order.findMany();
};

export const findOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id_order: id,
    },
    include: {
      itens: {
        include: {
          product: true,
        },
      },
      client: true,
    },
  });

  if (!order) throw new NotFoundError("Order not found.");

  return {
    ...order,
    itens: order.itens.map((item) => ({
      ...item,
      price: Number(item.price),
      product: { ...item.product, price: Number(item.product.price) },
    })),
  };
};

export const getOrNotFoundOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id_order: id,
    },
  });

  if (!order) throw new NotFoundError("Order not found.");

  return order;
};

export const getOrNotFoundOrderItemById = async (id_order_item: string) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: {
      id_order_item: id_order_item,
    },
  });

  if (!orderItem) throw new NotFoundError("Order not found.");

  return orderItem;
};

export const deleteOrder = async (id: string) => {
  await getOrNotFoundOrderById(id);

  return await prisma.$transaction(async (tx) => {
    await tx.orderItem.deleteMany({
      where: {
        id_order: id,
      },
    });

    return await tx.order.delete({
      where: {
        id_order: id,
      },
    });
  });
};

export const updateOrder = async (id: string, payload: UpdateOrderInput) => {
  await getOrNotFoundOrderById(id);

  const order = await prisma.order.update({
    where: { id_order: id },
    data: {
      ...(payload.id_client && { id_client: payload.id_client }),
      ...(payload.itens && {
        itens: {
          deleteMany: {},
          createMany: {
            data: payload.itens.map((item) => ({
              id_product: item.id_product!,
              quantity: item.quantity!,
              price: item.price!,
            })),
          },
        },
      }),
    },
  });

  return order;
};

export const listItensByOrderId = async (id: string) => {
  await getOrNotFoundOrderById(id);

  return await prisma.orderItem.findMany({
    where: {
      id_order: id,
    },
    include: {
      product: true,
    },
  });
};

export const addItemsToOrder = async (
  id_order: string,
  payload: CreateOrderItemInput[],
) => {
  await getOrNotFoundOrderById(id_order);

  const newItens = payload.map((item) => ({ ...item, id_order: id_order }));
  return await prisma.orderItem.createMany({
    data: newItens,
  });
};

export const updateOrderItem = async (
  id_order_item: string,
  payload: UpdateOrderItemInput,
) => {
  await getOrNotFoundOrderItemById(id_order_item);

  return await prisma.orderItem.update({
    where: {
      id_order_item: id_order_item,
    },
    data: payload as Prisma.OrderItemUpdateInput,
  });
};

export const deleteOrderItem = async (id_order_item: string) => {
  await getOrNotFoundOrderItemById(id_order_item);

  return await prisma.orderItem.delete({
    where: {
      id_order_item: id_order_item,
    },
  });
};
