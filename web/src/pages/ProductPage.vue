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
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type ProductResponse,
  type UpdateProductInput,
} from "../schemas/product.schema";
import { useProducts } from "../hooks/useProduct";

const dialogOpen = ref(false);
const dialogEditOpen = ref(false);
const selectedProduct = ref<ProductResponse | null>(null);
const search = ref("");

const { products, fetchProducts, createProduct, updateProduct, deleteProduct } =
  useProducts();

onMounted(fetchProducts);

const onSubmit = async (values: CreateProductInput) => {
  await createProduct(values);

  dialogOpen.value = false;
};

const onEdit = async (values: UpdateProductInput) => {
  await updateProduct(selectedProduct.value!.id_product, values);
  dialogEditOpen.value = false;
  selectedProduct.value = null;
};

const onDelete = async (id: string) => {
  await deleteProduct(id);
};

const openEditDialog = async (product: ProductResponse) => {
  selectedProduct.value = product;
  dialogEditOpen.value = true;
};

const filteredProducts = computed(() =>
  products.value.filter((product) =>
    product.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
);
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Produtos</h1>
        <p class="text-sm text-muted-foreground">
          Gerencie os produtos cadastrados no sistema
        </p>
      </div>

      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button class="cursor-pointer">Novo Produto</Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para criar um novo produto.
            </DialogDescription>
          </DialogHeader>

          <!-- Usar <form> nativo com @submit.prevent para o vee-validate funcionar corretamente -->
          <Form
            @submit="onSubmit"
            :validation-schema="createProductSchema"
            class="grid gap-4 py-4"
          >
            <FormField name="name" v-slot="{ field, errors }">
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome do produto"
                    v-bind="field"
                  />
                </FormControl>
                <FormMessage>{{ errors[0] }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField name="price" v-slot="{ field, errors }">
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
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
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Atualize os dados do produto selecionado.
          </DialogDescription>
        </DialogHeader>

        <Form
          v-if="selectedProduct"
          @submit="onEdit"
          :validation-schema="updateProductSchema"
          :initial-values="
            selectedProduct
              ? { name: selectedProduct.name, price: selectedProduct.price }
              : {}
          "
          class="grid gap-4 py-4"
        >
          <FormField name="name" v-slot="{ field, errors }">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome do produto"
                  :value="selectedProduct?.name"
                  @change="selectedProduct.name = $event.target.value"
                  v-bind="field"
                />
              </FormControl>
              <FormMessage>{{ errors[0] }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField name="price" v-slot="{ field, errors }">
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  :value="selectedProduct?.price"
                  @change="selectedProduct.price = Number($event.target.value)"
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
        <CardTitle>Lista de Produtos</CardTitle>
        <div class="w-72">
          <Input v-model="search" placeholder="Buscar produto..." />
        </div>
      </CardHeader>

      <CardContent>
        <div class="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead class="w-30 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="product in filteredProducts"
                :key="product.id_product"
              >
                <TableCell>{{ product.name }}</TableCell>
                <TableCell>{{
                  product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button
                      class="cursor-pointer"
                      variant="outline"
                      size="sm"
                      @click="openEditDialog(product)"
                    >
                      Editar
                    </Button>

                    <ConfirmDelete
                      description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
                      :confirm-delete-label="() => onDelete(product.id_product)"
                    />
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredProducts.length === 0">
                <TableCell
                  colspan="3"
                  class="h-24 text-center text-muted-foreground"
                >
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
