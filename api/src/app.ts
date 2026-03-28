import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { clientRoutes } from "./routes/client.router.ts";
import { orderRoutes } from "./routes/order.router.ts";
import { productRoutes } from "./routes/product.router.ts";
import { errorHandler } from "./utils/error-handler.ts";

export const buildApp = async () => {
  const server = Fastify({
    logger: false,
  });

  errorHandler(server);
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await server.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Vendify API",
        version: "1.0.0",
        description: "Vendify API documentation",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.get("/health", async () => ({ status: "ok" }));
  await server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });
  server.register(productRoutes, { prefix: "/api" });
  server.register(clientRoutes, { prefix: "/api" });
  server.register(orderRoutes, { prefix: "/api" });

  return server;
};
