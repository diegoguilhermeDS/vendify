<!-- web/src/layouts/DefaultLayout.vue -->
<script setup lang="ts">
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from '../components/ui/sidebar'

import { Package, Users, ShoppingCart } from 'lucide-vue-next'

</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <div class="flex justify-center border-b">
        <img src="../assets/logo2.png" alt="logo" class="h-30"/>
      </div>

      <nav class="space-y-1 px-2">
        <a href="/" class="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted">
          <Package class="h-4 w-4" />
          Produtos
        </a>
        <a href="/clientes" class="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted">
          <Users class="h-4 w-4" />
          Clientes
        </a>
        <a href="/pedidos" class="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted">
          <ShoppingCart class="h-4 w-4" />
          Pedidos
        </a>
      </nav>
    </Sidebar>

    <SidebarInset>
      <header class="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <span class="font-medium">Sistema de Pedidos</span>
      </header>

      <main class="p-4">
        <router-view />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>