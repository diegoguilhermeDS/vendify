<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

// Import Components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";

import ConfirmDelete from "../components/ConfirmDelete.vue";

// Import Schemas and Hooks
import {
  createClientSchema,
  updateClientSchema,
  type ClientResponse,
  type CreateClientInput,
  type UpdateClientInput,
} from "../schemas/client.schema";
import { useClients } from "../hooks/useClient";

const dialogOpen = ref(false);
const dialogEditOpen = ref(false);
const selectedClient = ref<ClientResponse | null>(null);
const search = ref("");

const { clients, fetchClients, createClient, updateClient, deleteClient } =
  useClients();

onMounted(fetchClients);

const onSubmit = async (values: CreateClientInput) => {
  await createClient(values);

  dialogOpen.value = false;
};

const onEdit = async (values: UpdateClientInput) => {
  await updateClient(selectedClient.value!.id_client, values);
  dialogEditOpen.value = false;
  selectedClient.value = null;
};

const onDelete = async (id: string) => {
  await deleteClient(id);
};

const openEditDialog = async (client: ClientResponse) => {
  selectedClient.value = client;
  dialogEditOpen.value = true;
};

const filteredClient = computed(() =>
  clients.value.filter((client) =>
    client.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
);
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Clientes</h1>
        <p class="text-sm text-muted-foreground">
          Gerencie os clientes cadastrados no sistema
        </p>
      </div>

      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button class="cursor-pointer">Novo Cliente</Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para criar um novo cliente.
            </DialogDescription>
          </DialogHeader>

          <!-- Usar <form> nativo com @submit.prevent para o vee-validate funcionar corretamente -->
          <Form
            @submit="onSubmit"
            :validation-schema="createClientSchema"
            class="grid gap-4 py-4"
          >
            <FormField name="name" v-slot="{ field, errors }">
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome do cliente"
                    v-bind="field"
                  />
                </FormControl>
                <FormMessage>{{ errors[0] }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField name="email" v-slot="{ field, errors }">
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    v-bind="field"
                  />
                </FormControl>
                <FormMessage>{{ errors[0] }}</FormMessage>
              </FormItem>
            </FormField>

            <DialogFooter>
              <DialogClose as-child>
                <Button class="cursor-pointer" type="button" variant="outline"> Cancelar </Button>
              </DialogClose>
              <Button class="cursor-pointer" type="submit">Salvar</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Table Card -->
    <Dialog v-model:open="dialogEditOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize os dados do cliente selecionado.
          </DialogDescription>
        </DialogHeader>

        <Form
          v-if="selectedClient"
          @submit="onEdit"
          :validation-schema="updateClientSchema"
          :initial-values="
            selectedClient
              ? { name: selectedClient.name, email: selectedClient.email }
              : {}
          "
          class="grid gap-4 py-4"
        >
          <FormField name="name" v-slot="{ field, errors }">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome do cliente"
                  :value="selectedClient?.name"
                  @change="selectedClient.name = $event.target.value"
                  v-bind="field"
                />
              </FormControl>
              <FormMessage>{{ errors[0] }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField name="email" v-slot="{ field, errors }">
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  :value="selectedClient?.email"
                  @change="selectedClient.email = $event.target.value"
                  v-bind="field"
                />
              </FormControl>
              <FormMessage>{{ errors[0] }}</FormMessage>
            </FormItem>
          </FormField>

          <DialogFooter>
            <DialogClose as-child>
              <Button
                class="cursor-pointer"
                type="button"
                variant="outline"
                @click="dialogEditOpen = false"
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button class="cursor-pointer" type="submit">Salvar alterações</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <CardTitle>Lista de Clientes</CardTitle>
        <div class="w-72">
          <Input v-model="search" placeholder="Buscar cliente..." />
        </div>
      </CardHeader>

      <CardContent>
        <div class="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead class="w-30 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="client in filteredClient"
                :key="client.id_client"
              >
                <TableCell>{{ client.name }}</TableCell>
                <TableCell>{{ client.email }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button
                      class="cursor-pointer"
                      variant="outline"
                      size="sm"
                      @click="openEditDialog(client)"
                    >
                      Editar
                    </Button>

                    <ConfirmDelete
                      description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
                      :confirm-delete-label="() => onDelete(client.id_client)"
                    />
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredClient.length === 0">
                <TableCell
                  colspan="3"
                  class="h-24 text-center text-muted-foreground"
                >
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
