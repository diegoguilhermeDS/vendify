import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { clearDb, getApp } from "../setup.js";
import { validProduct, invalidProducts } from "../test.mocks.ts";
import type { FastifyInstance } from "fastify";
import type { ProductResponse } from "../../src/schemas/product.schema.ts";

const createProduct = (server: FastifyInstance) =>
  server
    .inject({ method: "POST", url: "/api/products", payload: validProduct })
    .then((res) => res.json());

describe("Products Routes", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    const { testServer } = await getApp();
    server = testServer;
  });

  beforeEach(async () => {
    await clearDb();
  });

  describe("POST /api/products", () => {
    it("You must create a product with valid data.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/products",
        payload: validProduct,
      });

      expect(response.statusCode).toBe(201);
    });

    it("You should reject products empty name.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/products",
        payload: invalidProducts.emptyName,
      });

      expect(response.statusCode).toBe(400);
    });

    it("You should reject products with a negative price.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/products",
        payload: invalidProducts.negativoPrice,
      });

      expect(response.statusCode).toBe(400);
    });

    it("You should reject products without a price.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/products",
        payload: invalidProducts.missingPrice,
      });

      expect(response.statusCode).toBe(400);
    });

    it("You should reject products without a name.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/products",
        payload: invalidProducts.missingName,
      });

      expect(response.statusCode).toBe(400);
    });

    it("You should reject products that already exist.", async () => {
      await createProduct(server);
      
      const response2 = await server.inject({
        method: "POST",
        url: "/api/products",
        payload: validProduct,
      });

      expect(response2.statusCode).toBe(409);
      expect(response2.json().error).toBe("Product already exists.");
    });
  });

  describe("GET /api/products", () => {
    it("should return an empty list when there are no products", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/api/products",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(expect.arrayContaining([]));
    });

    it("You should return all products", async () => {
      await createProduct(server);

      const response = await server.inject({
        method: "GET",
        url: "/api/products",
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /api/products/:id", () => {
    it("You should return a product", async () => {
      const product = await createProduct(server);

      const response = await server.inject({
        method: "GET",
        url: `/api/products/${product.id_product}`,
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT /api/products/:id", () => {
    let product: ProductResponse;
    it("You should update a product", async () => {
      product = await createProduct(server);

      const response = await server.inject({
        method: "PUT",
        url: `/api/products/${product.id_product}`,
        payload: { price: 1450 },
      });

      expect(response.statusCode).toBe(200);
    });

    it("You should reject update product with existing name", async () => {
      if (!product) return;

      const response = await server.inject({
        method: "PUT",
        url: `/api/products/${product.id_product}`,
        payload: { name: "Notebook Dell XPS 13" },
      });

      expect(response.statusCode).toBe(422);
      expect(response.json().error).contains("Product already exists.");
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("You should delete a product", async () => {
      const product = await createProduct(server);

      const response = await server.inject({
        method: "DELETE",
        url: `/api/products/${product.id_product}`,
      });

      expect(response.statusCode).toBe(204);
    });
  });
});
