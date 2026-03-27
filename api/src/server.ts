import Fastify from "fastify";
import { productRoutes } from "./routes/product.router.ts";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./utils/error-handler.ts";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { clientRoutes } from "./routes/client.router.ts";
import { orderRoutes } from "./routes/order.router.ts";

const server = Fastify({
  logger: true,
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

await server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

server.register(productRoutes, { prefix: "/api" });
server.register(clientRoutes, { prefix: "/api" });
server.register(orderRoutes, { prefix: "/api" });

server.listen(
  {
    port: 3333,
    host: "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
    console.log(`Docs at ${address}/docs`);
  },
);
