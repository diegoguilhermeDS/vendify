import { createRouter, createWebHistory } from "vue-router";
import HelloWord from "../pages/HelloWord.vue";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HelloWord
        },
        {
            path: "/produtos",
            name: "produtos",
            component: HelloWord
        },
        {
            path: "/clientes",
            name: "clientes",
            component: HelloWord
        },
        {
            path: "/pedidos",
            name: "pedidos",
            component: HelloWord
        }
    ]
})

export default router