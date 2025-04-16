import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AccountView from "../views/AccountView.vue";
import CatalogView from "../views/CatalogView.vue";
import DebugView from "../views/DebugView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
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
      path: "/account",
      name: "account",
      component: AccountView,
      meta: {
        requiresAuth: true,
      },
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

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login"); // Redirect to login if no token
  } else {
    next();
  }
});

export default router;
