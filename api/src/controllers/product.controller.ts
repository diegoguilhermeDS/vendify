import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createProduct,
  deleteProduct,
  findProductById,
  listProducts,
  updateProduct,
} from "../services/product.service.ts";
import {
  type CreateProductInput,
  type ProductListResponse,
  type ProductResponse,
  type UpdateProductInput,
} from "../schemas/product.schema.ts";

export const handleCreateProduct = async (
  request: FastifyRequest<{ Body: CreateProductInput }>,
  reply: FastifyReply,
): Promise<ProductResponse> => {
  const product = await createProduct(request.body);

  return reply.code(201).send(product);
};

export const handleListProducts = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ProductListResponse> => {
  const products = await listProducts();

  return reply.code(200).send(products);
};

export const handleGetProduct = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<ProductResponse> => {
  const id = request.params.id;

  const product = await findProductById(id);

  return reply.code(200).send(product);
};

export const handleDeleteProduct = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = request.params.id;
  await deleteProduct(id);

  return reply.code(204).send();
};

export const handleUpdateProduct = async (
  request: FastifyRequest<{ Body: UpdateProductInput; Params: { id: string } }>,
  reply: FastifyReply,
): Promise<ProductResponse> => {
  const id = request.params.id;

  const product = await updateProduct(id, request.body);

  return reply.code(200).send(product);
};
