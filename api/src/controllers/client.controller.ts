import type { FastifyReply, FastifyRequest } from "fastify";
import type { ClientListResponse, ClientResponse, CreateClientInput, UpdateClientInput } from "../schemas/client.schema.ts";
import { createClient, deleteClient, findClientById, listClients, updateClient } from "../services/client.service.ts";


export const handleCreateClient = async (
  request: FastifyRequest<{ Body: CreateClientInput }>,
  reply: FastifyReply,
): Promise<ClientResponse> => {
  const Client = await createClient(request.body);

  return reply.code(201).send(Client);
};

export const handleListClients = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ClientListResponse> => {
  const Clients = await listClients();

  return reply.code(200).send(Clients);
};

export const handleGetClient = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<ClientResponse> => {
  const id = request.params.id;

  const Client = await findClientById(id);

  return reply.code(200).send(Client);
};

export const handleDeleteClient = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = request.params.id;
  await deleteClient(id);

  return reply.code(204).send();
};

export const handleUpdateClient = async (
  request: FastifyRequest<{ Body: UpdateClientInput; Params: { id: string } }>,
  reply: FastifyReply,
): Promise<ClientResponse> => {
  const id = request.params.id;

  const Client = await updateClient(id, request.body);

  return reply.code(200).send(Client);
};
