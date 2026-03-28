import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { Prisma } from "../../prisma/generated/prisma/client.js";
import { ConflictError, NotFoundError } from "../erros/app-errors.ts";

export const errorHandler = (fastify: FastifyInstance) => {
  fastify.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof NotFoundError) {
        return reply.code(404).send({ error: error.message });
      }

      if (error instanceof ConflictError) {
        return reply.code(409).send({ error: error.message });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          const modelName = error.meta?.modelName as string;

          if (modelName?.includes("Client")) {
            return reply.code(422).send({ error: "Client already exists." });
          }

          if (modelName?.includes("Product")) {
            return reply
              .code(422)
              .send({ error: "Product already exists." });
          }

          return reply
            .code(422)
            .send({ error: "Registro já existe.", model: modelName });
        }
        if (error.code === "P2025") {
          return reply.code(404).send({ error: "Registro não encontrado." });
        }
        if (error.code === "P2003") {
          return reply.code(404).send({
            error: "Referência inválida: registro relacionado não existe.",
          });
        }
      }

      if (error.validation) {
        return reply.code(400).send({ error: error.message });
      }

      return reply.code(500).send({ error: "Internal server error." });
    },
  );
};
