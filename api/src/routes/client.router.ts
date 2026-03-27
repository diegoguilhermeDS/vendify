import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  clientResponseSchema,
  createClientSchema,
  updateClientSchema,
} from "../schemas/client.schema.ts";
import {
  handleCreateClient,
  handleDeleteClient,
  handleGetClient,
  handleListClients,
  handleUpdateClient,
} from "../controllers/client.controller.ts";
import z from "zod";

export const clientRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/clients",
    {
      schema: {
        tags: ["Client"],
        summary: "Create a new client",
        body: createClientSchema,
        response: { 201: clientResponseSchema },
      },
    },
    handleCreateClient,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/clients",
    {
      schema: {
        tags: ["Client"],
        summary: "List all clients",
        response: { 200: clientResponseSchema.array() },
      },
    },
    handleListClients,
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/clients/:id",
    {
      schema: {
        tags: ["Client"],
        summary: "Get a client by id",
        params: z.object({ id: z.string() }),
        response: { 200: clientResponseSchema },
      },
    },
    handleGetClient,
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete(
    "/clients/:id",
    {
      schema: {
        tags: ["Client"],
        summary: "Delete a client by id",
        params: z.object({ id: z.string() }),
        response: { 204: z.void() },
      },
    },
    handleDeleteClient,
  );

  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/clients/:id",
    {
      schema: {
        tags: ["Client"],
        summary: "Update a client by id",
        params: z.object({ id: z.string() }),
        body: updateClientSchema,
        response: { 200: clientResponseSchema },
      },
    },
    handleUpdateClient,
  );
};
