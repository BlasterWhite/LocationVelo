import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import CatalogView from "../views/CatalogView.vue";
import DebugView from "../views/DebugView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: CatalogView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/catalog",
      name: "catalog",
      component: CatalogView,
    },
    {
      path: "/debug",
      name: "debug",
      component: DebugView,
    },
  ],
});

export default router;
