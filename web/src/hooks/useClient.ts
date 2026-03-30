import type { ClientListResponse, CreateClientInput, UpdateClientInput } from "@/schemas/client.schema"
import { clientService } from "@/services/client.service"
import { ref } from "vue"

export const useClients = () => {
  const clients = ref<ClientListResponse>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchClients = async () => {
    loading.value = true
    try {
      const { data } = await clientService.list()
      clients.value = data
    } catch (e) {
      error.value = "Erro ao carregar produtos"
    } finally {
      loading.value = false
    }
  }

  const createClient = async (payload: CreateClientInput) => {
    loading.value = true
    try {
      await clientService.create(payload)
      await fetchClients()
    } catch (e) {
      error.value = "Erro ao criar produto"
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateClient = async (id: string, payload: UpdateClientInput) => {
    loading.value = true
    try {
      await clientService.update(id, payload)
      await fetchClients()
    } catch (e) {
      error.value = "Erro ao atualizar produto"
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteClient = async (id: string) => {
    loading.value = true
    try {
      await clientService.remove(id)
      await fetchClients()
    } catch (e) {
      error.value = "Erro ao deletar produto"
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  }
}