import { prisma } from "../db/prisma.ts";
import { Prisma } from "../../prisma/generated/prisma/client.ts";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema.ts";
import { ConflictError, NotFoundError } from "../erros/app-errors.ts";

export const createProduct = async (payload: CreateProductInput) => {
  try {
    return await prisma.product.create({
      data: { ...payload },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Product already exists.");
    }

    throw error;
  }
};

export const listProducts = async () => {
  return await prisma.product.findMany();
};

export const findProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id_product: id,
    },
  });

  if (!product) throw new NotFoundError("Product not found.");

  return product;
};

export const deleteProduct = async (id: string) => {
  await findProductById(id);

  return await prisma.product.delete({
    where: {
      id_product: id,
    },
  });
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductInput,
) => {
  await findProductById(id);

  return await prisma.product.update({
    where: {
      id_product: id,
    },
    data: payload as Prisma.ProductUpdateInput,
  });
};
