import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { clearDb, getApp } from "../setup.js";
import {
  validProduct,
  invalidClients,
  validClient,
  validClient2,
} from "../test.mocks.ts";
import type { FastifyInstance } from "fastify";
import type { ClientResponse } from "../../src/schemas/client.schema.ts";

const createClient = (server: FastifyInstance) =>
  server
    .inject({ method: "POST", url: "/api/clients", payload: validClient })
    .then((res) => res.json());

describe("Clients Routes", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    const { testServer } = await getApp();
    server = testServer;
  });

  beforeEach(async () => {
    await clearDb();
  });

  describe("POST /api/clients", () => {
    it("You must create a client with valid data.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/clients",
        payload: validClient,
      });

      expect(response.statusCode).toBe(201);
    });

    it("You should reject clients empty a name.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/clients",
        payload: invalidClients.emptyName,
      });

      expect(response.statusCode).toBe(400);
    });

    it("You should reject clients empty a email.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/clients",
        payload: invalidClients.emptyEmail,
      });

      expect(response.statusCode).toBe(400);
    });

    it("You should reject clients without a name.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/clients",
        payload: invalidClients.missingName,
      });

      expect(response.statusCode).toBe(400);
    });

    it("You should reject clients without a email.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/clients",
        payload: invalidClients.missingEmail,
      });

      expect(response.statusCode).toBe(400);
    });

    it("You should reject clients with a invalid email.", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/api/clients",
        payload: invalidClients.invalidEmail,
      });

      expect(response.statusCode).toBe(400);
    });

    it("You should reject clients that already exist.", async () => {
      await createClient(server);

      const response2 = await server.inject({
        method: "POST",
        url: "/api/clients",
        payload: validClient,
      });

      expect(response2.statusCode).toBe(409);
      expect(response2.json().error).toBe("Client already exists.");
    });
  });

  describe("GET /api/clients", () => {
    it("You should return an empty list when there are no clients", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/api/clients",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual([]);
    });

    it("You should return all clients", async () => {
      await createClient(server);

      const response = await server.inject({
        method: "GET",
        url: "/api/clients",
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /api/clients/:id", () => {
    it("You should return a client", async () => {
      const client = await createClient(server);

      const response = await server.inject({
        method: "GET",
        url: `/api/clients/${client.id_client}`,
      });

      expect(response.statusCode).toBe(200);
    });

    it("should return 404 if client not found", async () => {
      const response = await server.inject({
        method: "GET",
        url: `/api/clients/00000000000-000000-00000`,
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("PUT /api/clients/:id", () => {
    it("You should update a client", async () => {
      const client = await createClient(server);

      const response = await server.inject({
        method: "PUT",
        url: `/api/clients/${client.id_client}`,
        payload: { name: "Pedro Silva" },
      });

      expect(response.statusCode).toBe(200);
    });

    it("You should reject update client with existing email", async () => {
      const client = await createClient(server);
      await server.inject({
        method: "POST",
        url: "/api/clients",
        payload: validClient2,
      });

      const response = await server.inject({
        method: "PUT",
        url: `/api/clients/${client.id_client}`,
        payload: { email: "maria.oliveira@example.com" },
      });

      expect(response.statusCode).toBe(422);
      expect(response.json().error).contains("Client already exists.");
    });
  });

  describe("DELETE /api/clients/:id", () => {
    let clie: ClientResponse;

    it("You should reject delete a client", async () => {
      const client = await createClient(server);

      const productResponse = await server.inject({
        method: "POST",
        url: "/api/products",
        payload: validProduct,
      });

      const orderResponse = await server.inject({
        method: "POST",
        url: "/api/orders",
        payload: {
          id_client: client.id_client,
          itens: [
            {
              id_product: productResponse.json().id_product,
              quantity: 1,
            },
          ],
        },
      });

      if (
        orderResponse.statusCode == 201 &&
        productResponse.statusCode == 201
      ) {
        const response = await server.inject({
          method: "DELETE",
          url: `/api/clients/${client.id_client}`,
        });

        expect(response.statusCode).toBe(409);
        expect(response.json().error).toBe(
          "Not possible to delete a client with orders.",
        );

        clie = client;
      }

      await server.inject({
        method: "DELETE",
        url: `/api/orders/${orderResponse.json().id_order}`,
      });

      await server.inject({
        method: "DELETE",
        url: `/api/products/${productResponse.json().id_product}`,
      });
    });

    it("You should delete a client", async () => {
      if (!clie) return;

      const response = await server.inject({
        method: "DELETE",
        url: `/api/clients/${clie.id_client}`,
      });

      expect(response.statusCode).toBe(204);
    });
  });
});
