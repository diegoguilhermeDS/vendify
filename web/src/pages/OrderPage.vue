<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

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
  createOrderSchema,
  updateOrderSchema,
  type OrderResponse,
  type CreateOrderInput,
  type UpdateOrderInput,
  type OrderResponseWithItens,
} from "../schemas/order.schema";
import { useOrders, useClients, useProducts } from "../hooks";
import { Label } from "../components/ui/label";

const dialogOpen = ref(false);
const dialogEditOpen = ref(false);
const selectedOrder = ref<OrderResponse | null>(null);
const search = ref("");
const formRef = ref<any>(null);
const editFormRef = ref<any>(null);

const { orders, fetchOrders, createOrder, updateOrder, deleteOrder, getOrder } =
  useOrders();
const { clients, fetchClients } = useClients();
const { products, fetchProducts } = useProducts();

onMounted(() => {
  fetchOrders();
  fetchClients();
  fetchProducts();
});

// estado local dos itens para calcular totais
const items = reactive([{ id_product: "", quantity: 1, price: 0, total: 0 }]);
const editItems = reactive([
  { id_product: "", quantity: 1, price: 0, total: 0 },
]);

const addItem = () => {
  items.push({ id_product: "", quantity: 1, price: 0, total: 0 });
};

const removeItem = (index: number) => {
  items.splice(index, 1);
};

const onProductChange = (index: number, id_product: string) => {
  const product = products.value.find((p) => p.id_product === id_product);
  if (!product) return;
  items[index].price = product.price;
  items[index].total = product.price * items[index].quantity;
  formRef.value?.setFieldValue(`itens[${index}].price`, product.price);
};

const onQuantityChange = (index: number, quantity: number) => {
  items[index].quantity = quantity;
  items[index].total = items[index].price * quantity;
  formRef.value?.setFieldValue(`itens[${index}].price`, items[index].price);
};

const onSubmit = async (values: CreateOrderInput) => {
  console.log(values);

  const payload = {
    ...values,
    itens: values.itens.map((item: any, i: number) => ({
      ...item,
      price:
        products.value.find((p) => p.id_product === item.id_product)!.price *
        item.quantity,
    })),
  };
  await createOrder(payload);
  dialogOpen.value = false;
};

const addEditItem = () => {
  editItems.push({ id_product: "", quantity: 1, price: 0, total: 0 });
};

const removeEditItem = (index: number) => {
  editItems.splice(index, 1);
};

const onEditProductChange = (index: number, id_product: string) => {
  const product = products.value.find((p) => p.id_product === id_product);
  if (!product) return;
  editItems[index].price = product.price;
  editItems[index].total = product.price * editItems[index].quantity;
  editFormRef.value?.setFieldValue(`itens[${index}].price`, product.price);
};

const onEditQuantityChange = (index: number, quantity: number) => {
  editItems[index].quantity = quantity;
  editItems[index].total = editItems[index].price * quantity;
  editFormRef.value?.setFieldValue(
    `itens[${index}].price`,
    editItems[index].price,
  );
};

const onEdit = async (values: UpdateOrderInput) => {
  const payload = {
    ...values,
    itens: values.itens.map((item: any, i: number) => ({
      ...item,
      price: editItems[i].price,
    })),
  };
  await updateOrder(selectedOrder.value!.id_order, payload);
  dialogEditOpen.value = false;
  selectedOrder.value = null;
};

const onDelete = async (id: string) => {
  await deleteOrder(id);
};

const openEditDialog = async (order: OrderResponse) => {
  selectedOrder.value = order;
  dialogEditOpen.value = true;
  const orderDetails: OrderResponseWithItens | undefined = await getOrder(
    order.id_order,
  );
  if (!orderDetails) return;

  console.log(orderDetails, "orderDetails");
  console.log(order, "order");
  editItems.splice(
    0,
    editItems.length,
    ...orderDetails.itens.map((i) => ({
      id_product: i.id_product,
      quantity: i.quantity,
      price: i.price,
      total: i.price * i.quantity,
    })),
  );
};

const filteredOrder = computed(() =>
  orders.value.filter((order) =>
    order.id_order.toLowerCase().includes(search.value.toLowerCase()),
  ),
);
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Pedidos</h1>
        <p class="text-sm text-muted-foreground">
          Gerencie os pedidos cadastrados no sistema
        </p>
      </div>

      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button class="cursor-pointer">Novo Pedido</Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para criar um novo pedido.
            </DialogDescription>
          </DialogHeader>

          <!-- Usar <form> nativo com @submit.prevent para o vee-validate funcionar corretamente -->
          <Form
            ref="formRef"
            @submit="onSubmit"
            :validation-schema="createOrderSchema"
            class="grid gap-4 py-4"
          >
            <!-- Cliente -->
            <FormField name="id_client" v-slot="{ field, errors }">
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <select
                    v-bind="field"
                    class="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Selecione um cliente</option>
                    <option
                      v-for="client in clients"
                      :key="client.id_client"
                      :value="client.id_client"
                    >
                      {{ client.name }}
                    </option>
                  </select>
                </FormControl>
                <FormMessage>{{ errors[0] }}</FormMessage>
              </FormItem>
            </FormField>

            <!-- Itens -->
            <div class="space-y-3 overflow-y-scroll h-80">
              <div class="flex items-center justify-between">
                <span>Itens do Pedido</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  @click="addItem"
                >
                  + Adicionar Item
                </Button>
              </div>

              <div
                v-for="(item, index) in items"
                :key="index"
                class="border rounded-md p-3 grid gap-2"
              >
                <!-- Produto -->
                <FormField
                  :name="`itens[${index}].id_product`"
                  v-slot="{ field, errors }"
                >
                  <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <FormControl>
                      <select
                        v-bind="field"
                        class="w-full border rounded-md px-3 py-2 text-sm"
                        @change="
                          onProductChange(
                            index,
                            ($event.target as HTMLSelectElement).value,
                          )
                        "
                      >
                        <option value="" disabled>Selecione um produto</option>
                        <option
                          v-for="product in products"
                          :key="product.id_product"
                          :value="product.id_product"
                        >
                          {{ product.name }} —
                          {{
                            product.price.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          }}
                        </option>
                      </select>
                    </FormControl>
                    <FormMessage>{{ errors[0] }}</FormMessage>
                  </FormItem>
                </FormField>

                <!-- Quantidade -->
                <FormField
                  :name="`itens[${index}].quantity`"
                  v-slot="{ field, errors }"
                >
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        v-bind="field"
                        @input="
                          onQuantityChange(
                            index,
                            Number(($event.target as HTMLInputElement).value),
                          )
                        "
                      />
                    </FormControl>
                    <FormMessage>{{ errors[0] }}</FormMessage>
                  </FormItem>
                </FormField>

                <!-- Preço calculado (disabled) -->
                <div class="grid gap-2">
                  <label class="text-sm font-medium leading-none"
                    >Total do Item</label
                  >
                  <Input
                    disabled
                    :value="
                      item.total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                    "
                  />
                </div>

                <!-- Registra o valor no vee-validate sem aparecer -->
                <!-- <FormField :name="`itens[${index}].price`" v-slot="{ field }">
                    <input type="hidden" v-bind="field" :value="item.price" @change="field.onChange(item.price)" />
                </FormField> -->

                <Button
                  v-if="items.length > 1"
                  type="button"
                  size="sm"
                  variant="destructive"
                  @click="removeItem(index)"
                >
                  Remover
                </Button>
              </div>
            </div>

            <DialogFooter>
              <DialogClose as-child>
                <Button class="cursor-pointer" type="button" variant="outline">
                  Cancelar
                </Button>
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
          <DialogTitle>Editar Pedido</DialogTitle>
          <DialogDescription>
            Atualize os dados do pedido selecionado.
          </DialogDescription>
        </DialogHeader>

        <Form
          v-if="dialogEditOpen"
          ref="editFormRef"
          @submit="onEdit"
          :validation-schema="updateOrderSchema"
          :initial-values="
            selectedOrder
              ? {
                  id_client: selectedOrder.id_client,
                  itens: editItems.map((i) => ({
                    id_product: i.id_product,
                    quantity: i.quantity,
                    price: i.price,
                  })),
                }
              : {}
          "
          class="grid gap-4 py-4"
        >
          <!-- Cliente -->
          <FormField name="id_client" v-slot="{ field, errors }">
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <select
                  v-bind="field"
                  class="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="" disabled>Selecione um cliente</option>
                  <option
                    v-for="client in clients"
                    :key="client.id_client"
                    :value="client.id_client"
                  >
                    {{ client.name }}
                  </option>
                </select>
              </FormControl>
              <FormMessage>{{ errors[0] }}</FormMessage>
            </FormItem>
          </FormField>

          <!-- Itens -->
          <div class="space-y-3 overflow-y-scroll h-80">
            <div class="flex items-center justify-between">
              <span>Itens do Pedido</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                @click="addEditItem"
              >
                + Adicionar Item
              </Button>
            </div>

            <div
              v-for="(item, index) in editItems"
              :key="index"
              class="border rounded-md p-3 grid gap-2"
            >
              <!-- Produto -->
              <FormField
                :name="`itens[${index}].id_product`"
                v-slot="{ field, errors }"
              >
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <FormControl>
                    <select
                      v-bind="field"
                      class="w-full border rounded-md px-3 py-2 text-sm"
                      @change="
                        onEditProductChange(
                          index,
                          ($event.target as HTMLSelectElement).value,
                        )
                      "
                    >
                      <option value="" disabled>Selecione um produto</option>
                      <option
                        v-for="product in products"
                        :key="product.id_product"
                        :value="product.id_product"
                      >
                        {{ product.name }} —
                        {{
                          product.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        }}
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage>{{ errors[0] }}</FormMessage>
                </FormItem>
              </FormField>

              <!-- Quantidade -->
              <FormField
                :name="`itens[${index}].quantity`"
                v-slot="{ field, errors }"
              >
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      v-bind="field"
                      @input="
                        onEditQuantityChange(
                          index,
                          Number(($event.target as HTMLInputElement).value),
                        )
                      "
                    />
                  </FormControl>
                  <FormMessage>{{ errors[0] }}</FormMessage>
                </FormItem>
              </FormField>

              <!-- Total visual -->
              <div class="grid gap-2">
                <label class="text-sm font-medium leading-none"
                  >Total do Item</label
                >
                <Input
                  disabled
                  :value="
                    item.total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                  "
                />
              </div>

              <Button
                v-if="editItems.length > 1"
                type="button"
                size="sm"
                variant="destructive"
                @click="removeEditItem(index)"
              >
                Remover
              </Button>
            </div>
          </div>

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
            <Button class="cursor-pointer" type="submit"
              >Salvar alterações</Button
            >
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <CardTitle>Lista de Pedidos</CardTitle>
        <div class="w-72">
          <Input v-model="search" placeholder="Buscar pedido... digite o ID" />
        </div>
      </CardHeader>

      <CardContent>
        <div class="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Total de items</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead class="w-60 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow v-for="order in filteredOrder" :key="order.id_order">
                <TableCell>
                  <Button class="cursor-pointer" variant="ghost">
                    {{ order.id_order }}
                  </Button>
                </TableCell>
                <TableCell>{{ order.data }}</TableCell>
                <TableCell>{{ order.quantityItems }}</TableCell>
                <TableCell>{{ order.client.name }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button
                      class="cursor-pointer"
                      variant="outline"
                      size="sm"
                      @click="openEditDialog(order)"
                    >
                      Editar
                    </Button>

                    <ConfirmDelete
                      description="Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita."
                      :confirm-delete-label="() => onDelete(order.id_order)"
                    />
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredOrder.length === 0">
                <TableCell
                  colspan="5"
                  class="h-24 text-center text-muted-foreground"
                >
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
