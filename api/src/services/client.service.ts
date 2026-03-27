import { Prisma } from "../../prisma/generated/prisma/client.ts";
import { prisma } from "../db/prisma.ts";
import { ConflictError, NotFoundError } from "../erros/app-errors.ts";
import type {
  CreateClientInput,
  UpdateClientInput,
} from "../schemas/client.schema.ts";

export const createClient = async (payload: CreateClientInput) => {
  try {
    return await prisma.client.create({
      data: { ...payload },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Client already exists.");
    }

    throw error;
  }
};

export const listClients = async () => {
  return await prisma.client.findMany();
};

export const findClientById = async (id: string) => {
  const client = await prisma.client.findUnique({
    where: {
      id_client: id,
    },
  });

  if (!client) throw new NotFoundError("Client not found.");

  return client;
};

export const deleteClient = async (id: string) => {
  await findClientById(id);

  const hasOrders = await prisma.order.findFirst({
    where: {
      id_client: id,
    },
  });

  if (hasOrders) {
    throw new ConflictError(
      "Não é possível excluir o cliente, pois existem pedidos vinculados.",
    );
  }

  return await prisma.client.delete({
    where: {
      id_client: id,
    },
  });
};

export const updateClient = async (id: string, payload: UpdateClientInput) => {
  await findClientById(id);

  return await prisma.client.update({
    where: {
      id_client: id,
    },
    data: payload as Prisma.ClientUpdateInput,
  });
};
