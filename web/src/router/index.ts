import { createRouter, createWebHistory } from "vue-router";
import { ProductPage, ClientPage, OrderPage } from "../pages";
import DefaultLayout from "@/layouts/DefaultLayout.vue"


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: DefaultLayout,
            children: [
                {
                    path: "/",
                    name: "Produtos",
                    component: ProductPage
                },
                {
                    path: "/clientes",
                    name: "clientes",
                    component: ClientPage
                },
                {
                    path: "/pedidos",
                    name: "pedidos",
                    component: OrderPage
                }
            ]
        },
    ]
})

export default router