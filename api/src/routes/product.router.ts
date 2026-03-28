import type { FastifyInstance } from "fastify";

import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProduct,
  handleListProducts,
  handleUpdateProduct,
} from "../controllers/product.controller.ts";
import {
  createProductSchema,
  productListResponse,
  productResponseSchema,
  updateProductSchema,
} from "../schemas/product.schema.ts";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const productRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/products",
    {
      schema: {
        tags: ["Product"],
        summary: "Create a new product",
        body: createProductSchema,
        response: { 201: productResponseSchema },
      },
    },
    handleCreateProduct,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/products",
    {
      schema: {
        tags: ["Product"],
        summary: "List all products",
        response: { 200: productListResponse },
      },
    },
    handleListProducts,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/products/:id",
    {
      schema: {
        tags: ["Product"],
        summary: "Get a product by id",
        params: z.object({ id: z.string() }),
        response: { 200: productResponseSchema },
      },
    },
    handleGetProduct,
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete(
    "/products/:id",
    {
      schema: {
        tags: ["Product"],
        summary: "Delete a product by id",
        params: z.object({ id: z.string() }),
        response: { 204: z.void()},
      },
    },
    handleDeleteProduct,
  );

  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/products/:id",
    {
      schema: {
        tags: ["Product"],
        summary: "Update a product by id",
        params: z.object({ id: z.string() }),
        body: updateProductSchema,
        response: { 200: productResponseSchema },
      },
    },
    handleUpdateProduct,
  );    
};
