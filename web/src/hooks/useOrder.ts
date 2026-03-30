import { ref } from "vue"
import type { CreateOrderInput, CreateOrderItemInput, OrderItemListResponse, OrderListResponse, UpdateOrderInput, UpdateOrderItemInput } from "@/schemas/order.schema"
import { orderService } from "@/services/order.service"

export const useOrders = () => {
  const orders = ref<OrderListResponse>([])
  const itemsByOrder = ref<OrderItemListResponse>()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchOrders = async () => {
    loading.value = true
    try {
      const { data } = await orderService.list()
      orders.value = data
    } catch (e) {
      error.value = "Erro ao carregar produtos"
    } finally {
      loading.value = false
    }
  }

  const createOrder = async (payload: CreateOrderInput) => {
    loading.value = true
    try {
      await orderService.create(payload)
      await fetchOrders()
    } catch (e) {
      error.value = "Erro ao criar produto"
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateOrder = async (id: string, payload: UpdateOrderInput) => {
    loading.value = true
    try {
      await orderService.update(id, payload)
      await fetchOrders()
    } catch (e) {
      error.value = "Erro ao atualizar produto"
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteOrder = async (id: string) => {
    loading.value = true
    try {
      await orderService.remove(id)
      await fetchOrders()
    } catch (e) {
      error.value = "Erro ao deletar produto"
      throw e
    } finally {
      loading.value = false
    }
  }

  const getOrder = async (id: string) => {
    loading.value = true
    try {
      const response = await orderService.get(id)
      return response
    } catch (e) {
      error.value = "Erro ao carregar produtos"
    } finally {
      loading.value = false
    }
  }

  const listItems = async (id: string) => {
    loading.value = true
    try {
      const { data } = await orderService.listItems(id)
      itemsByOrder.value = data
    } catch (e) {
      error.value = "Erro ao carregar produtos"
    } finally {
      loading.value = false
    }
  }

  const addItem = async (id: string, data: CreateOrderItemInput) => {
    loading.value = true
    try {
      await orderService.addItem(id, data)
      await listItems(id)
    } catch (e) {
      error.value = "Erro ao carregar produtos"
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id: string) => {
    loading.value = true
    try {
      await orderService.removeItem(id)
      await listItems(id)
    } catch (e) {
      error.value = "Erro ao carregar produtos"
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id: string, data: UpdateOrderItemInput) => {
    loading.value = true
    try {
      await orderService.updateItem(id, data)
      await listItems(id)
    } catch (e) {
      error.value = "Erro ao carregar produtos"
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrder,
    listItems,
    addItem,
    deleteItem,
    updateItem
  }
}