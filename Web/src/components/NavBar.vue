<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
const authStore = useAuthStore();
import { useFloating } from "@floating-ui/vue";

const { isAuthenticated, user } = storeToRefs(authStore);

const userIcon = ref(null);
const floatingMenu = ref(null);
const showFloatingMenu = ref(false);
const { floatingStyles: floatingMenuStyle } = useFloating(
  userIcon,
  floatingMenu,
  {
    placement: "bottom-left",
  },
);

const isAdmin = computed(() => {
  return user.value && user.value.account_role === "admin";
});
</script>

<template>
  <div class="navbar">
    <div class="left">
      <router-link to="/" class="logo">
        <p class="logo-text">
          <span class="first-part">Easy</span>
          <span class="second-part">Rent</span>
        </p>
      </router-link>
    </div>
    <div class="center">
      <router-link to="/">Accueil</router-link>
      <router-link to="/catalog">Catalogue</router-link>
      <router-link to="/assistance">Assistance</router-link>
      <router-link to="/about">A propos</router-link>
    </div>
    <div class="right">
      <v-icon
        ref="userIcon"
        @click="showFloatingMenu = !showFloatingMenu"
        icon="mdi mdi-account-circle-outline"
        size="x-large"
      ></v-icon>
    </div>
  </div>
  <div
    v-if="showFloatingMenu"
    ref="floatingMenu"
    class="floating-menu"
    :style="floatingMenuStyle"
    style="z-index: 999"
  >
    <v-list v-if="isAuthenticated">
      <router-link to="/account">
        <v-list-item @click="showFloatingMenu = false">
          <v-list-item-title>Mon Compte</v-list-item-title>
        </v-list-item>
      </router-link>

      <router-link to="/booking">
        <v-list-item @click="showFloatingMenu = false">
          <v-list-item-title>Mes Réservations</v-list-item-title>
        </v-list-item>
      </router-link>

      <router-link v-if="isAdmin" to="/admin">
        <v-list-item @click="showFloatingMenu = false">
          <v-list-item-title>Gestion</v-list-item-title>
        </v-list-item>
      </router-link>

      <v-list-item @click="showFloatingMenu = false">
        <v-list-item-title @click="authStore.logout()">
          Déconnexion
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <router-link to="/login">
        <v-list-item @click="showFloatingMenu = false">
          <v-list-item-title>Connexion </v-list-item-title>
        </v-list-item></router-link
      >
      <router-link to="/register">
        <v-list-item @click="showFloatingMenu = false">
          <v-list-item-title>Inscription </v-list-item-title>
        </v-list-item></router-link
      >
    </v-list>
  </div>
</template>

<style scoped lang="scss">
@use "vuetify/settings" as vuetify;

.navbar {
  position: fixed;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 20px;
  z-index: 100;
  height: 80px;
  width: 1240px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 150px;

  .left {
    flex: 1;

    p.logo-text {
      font-size: 48px;
      font-weight: 800;

      .first-part {
        color: #000;
        font-weight: inherit;
      }

      .second-part {
        color: rgb(var(--v-theme-primary));
        font-weight: inherit;
      }
    }
  }

  .center {
    flex: 2;
    display: flex;
    justify-content: center;
    gap: 24px;

    a {
      text-decoration: none;
      color: #000;
      font-weight: 600;
      font-size: 24px;

      &::after {
        content: "";
        display: block;
        width: 0;
        height: 2px;
        background: rgb(var(--v-theme-primary));
        transition: width 0.3s;
      }

      &:hover {
        &::after {
          width: 100%;
        }
      }

      &.router-link-active {
        color: rgb(var(--v-theme-primary));
      }
    }
  }

  .right {
    flex: 1;
    text-align: right;

    .logout-icon {
      cursor: pointer;
      font-size: 24px;
    }
  }
}

a {
  text-decoration: none;
  color: #000;
}
</style>
