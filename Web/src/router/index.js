import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AccountView from "../views/AccountView.vue";
import CatalogView from "../views/CatalogView.vue";
import AboutView from "../views/AboutView.vue";
import DebugView from "../views/DebugView.vue";
import AssistanceView from "../views/AssistanceView.vue";
import AdminView from "../views/AdminView.vue";
import AdminBicyclesView from "../views/admin/BicycleAdminView.vue";
import AdminAccountView from "../views/admin/AccountAdminView.vue";
import NewsletterAdminView from "../views/admin/NewsletterAdminView.vue";

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
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/assistance",
      name: "assistance",
      component: AssistanceView,
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "bicycles",
          name: "admin-bicycles",
          component: AdminBicyclesView,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "users",
          name: "admin-users",
          component: AdminAccountView,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "locations",
          name: "admin-locations",
          component: AdminBicyclesView,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "newsletter",
          name: "admin-newsletter",
          component: NewsletterAdminView,
          meta: {
            requiresAuth: true,
          },
        },
      ],
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
