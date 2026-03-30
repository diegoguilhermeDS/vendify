import { ref } from "vue"
import { productService } from "../services/product.service"
import type { CreateProductInput, ProductListResponse, UpdateProductInput } from "@/schemas/product.schema";

export const useProducts = () => {
  const products = ref<ProductListResponse>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    loading.value = true
    try {
      const { data } = await productService.list()
      products.value = data
    } catch (e) {
      error.value = "Erro ao carregar produtos"
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (payload: CreateProductInput) => {
    loading.value = true
    try {
      await productService.create(payload)
      await fetchProducts()
    } catch (e) {
      error.value = "Erro ao criar produto"
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: string, payload: UpdateProductInput) => {
    loading.value = true
    try {
      await productService.update(id, payload)
      await fetchProducts()
    } catch (e) {
      error.value = "Erro ao atualizar produto"
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    loading.value = true
    try {
      await productService.remove(id)
      await fetchProducts()
    } catch (e) {
      error.value = "Erro ao deletar produto"
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}