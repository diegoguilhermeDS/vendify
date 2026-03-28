import { beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app.js";
import type { FastifyInstance } from "fastify";
import { prisma } from "../src/db/prisma.ts";

let server: FastifyInstance;

export const getApp = async () => {
  if (!server) {
    server = await buildApp();
  }
  return { testServer: server };
};

beforeAll(async () => {
  await clearDb();
  await getApp();
  console.log("\n✅ Ambiente de teste preparado\n");
});

afterAll(async () => {
  await server.close();
  await clearDb();
  console.log("\n✅ Ambiente de teste finalizado\n");
});

export const clearDb = async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.client.deleteMany();
};
