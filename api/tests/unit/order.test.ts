import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { clearDb, getApp } from "../setup.js";
import {
  validProduct,
  invalidClients,
  validClient2,
  validClient,
  validClient3,
  validClient4,
} from "../test.mocks.ts";
import type { FastifyInstance } from "fastify";
import type { ClientResponse } from "../../src/schemas/client.schema.ts";
import type { ProductResponse } from "../../src/schemas/product.schema.ts";
import type { OrderResponse } from "../../src/schemas/order.schema.ts";

const createClient = (server: FastifyInstance) =>
  server
    .inject({ method: "POST", url: "/api/clients", payload: validClient })
    .then((res) => res.json());

const createProduct = (server: FastifyInstance) =>
  server
    .inject({ method: "POST", url: "/api/products", payload: validProduct })
    .then((res) => res.json());

const createOrder = (
  server: FastifyInstance,
  id_client: string,
  items: { id_product: string; quantity: number; price: number }[],
) =>
  server
    .inject({
      method: "POST",
      url: "/api/orders",
      payload: { id_client, itens: items },
    })
    .then((res) => res.json());

describe("Orders Routes", () => {
  let server: FastifyInstance;
  let client: ClientResponse;
  let product: ProductResponse;

  beforeAll(async () => {
    const { testServer } = await getApp();
    server = testServer;
  });

  beforeEach(async () => {
    await clearDb();
    client = await createClient(server);
    product = await createProduct(server);
  });

  describe("POST /api/orders", () => {
    it("should create an order with valid data", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: {
          id_client: client.id_client,
          itens: [
            {
              id_product: product.id_product,
              quantity: 3,
              price: product.price * 3,
            },
          ],
        },
      });

      expect(response.statusCode).toBe(201);
    });

    it("should reject an order with no items", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: { id_client: client.id_client, itens: [] },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject an order without id_client", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: {
          itens: [{ id_product: product.id_product, quantity: 1, price: product.price }],
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject an order item with negative quantity", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: {
          id_client: client.id_client,
          itens: [{ id_product: product.id_product, quantity: -1, price: product.price }],
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject an order item with zero quantity", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: {
          id_client: client.id_client,
          itens: [{ id_product: product.id_product, quantity: 0, price: product.price }],
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject an order item without quantity", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: {
          id_client: client.id_client,
          itens: [{ id_product: product.id_product, price: product.price }],
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject an order item without id_product", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: {
          id_client: client.id_client,
          itens: [{ quantity: 1, price: product.price }],
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should reject an order referencing a non-existent client", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: {
          id_client: "00000000-0000-0000-0000-000000000000",
          itens: [{ id_product: product.id_product, quantity: 1, price: product.price }],
        },
      });
      
      expect(response.statusCode).toBe(404);
    });

    it("should reject an order item referencing a non-existent product", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: {
          id_client: client.id_client,
          itens: [
            {
              id_product: "00000000-0000-0000-0000-000000000000",
              quantity: 1,
              price: 10,
            },
          ],
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("GET /api/orders", () => {
    it("should return an empty list when there are no orders", async () => {
      const response = await server.inject({ method: "GET", url: "/api/orders" });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual([]);
    });

    it("should return all orders", async () => {
      await createOrder(server, client.id_client, [
        { id_product: product.id_product, quantity: 2, price: product.price * 2 },
      ]);

      const response = await server.inject({ method: "GET", url: "/api/orders" });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(1);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return a single order with its items", async () => {
      const order = await createOrder(server, client.id_client, [
        { id_product: product.id_product, quantity: 3, price: product.price * 3 },
      ]);

      const response = await server.inject({
        method: "GET",
        url: `/api/orders/${order.id_order}`,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.id_order).toBe(order.id_order);
    });

    it("should return 404 for a non-existent order", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/api/orders/00000000-0000-0000-0000-000000000000",
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("PUT /api/orders/:id", () => {
    it("should update an existing order's items", async () => {
      const order = await createOrder(server, client.id_client, [
        { id_product: product.id_product, quantity: 3, price: product.price * 3 },
      ]);

      const response = await server.inject({
        method: "PUT",
        url: `/api/orders/${order.id_order}`,
        payload: {
          itens: [
            { id_product: product.id_product, quantity: 5, price: product.price * 5 },
          ],
        },
      });

      console.log(response.json());
      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.id_order).toBe(order.id_order);
    });

    it("should return 404 when updating a non-existent order", async () => {
      const response = await server.inject({
        method: "PUT",
        url: "/api/orders/00000000-0000-0000-0000-000000000000",
        payload: {
          itens: [{ id_product: product.id_product, quantity: 1, price: product.price }],
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/orders/:id", () => {
    it("should delete an existing order", async () => {
      const order = await createOrder(server, client.id_client, [
        { id_product: product.id_product, quantity: 2, price: product.price * 2 },
      ]);

      const response = await server.inject({
        method: "DELETE",
        url: `/api/orders/${order.id_order}`,
      });

      expect(response.statusCode).toBe(204);
    });

    it("should return 404 when deleting a non-existent order", async () => {
      const response = await server.inject({
        method: "DELETE",
        url: "/api/orders/00000000-0000-0000-0000-000000000000",
      });

      expect(response.statusCode).toBe(404);
    });

    it("should not find the order after deletion", async () => {
      const order = await createOrder(server, client.id_client, [
        { id_product: product.id_product, quantity: 1, price: product.price },
      ]);

      await server.inject({ method: "DELETE", url: `/api/orders/${order.id_order}` });

      const response = await server.inject({
        method: "GET",
        url: `/api/orders/${order.id_order}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
