<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useRules } from "@/composables/useRules";

const { rules } = useRules();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const router = useRouter();

function test() {
  router.push({ name: "admin-bicycles" });
}
</script>

<template>
  <div class="admin-view">
    <div class="actions">
      <router-link to="/admin/bicycles">
        <v-btn>Gestion de la flotte de vélo</v-btn>
      </router-link>
      <router-link to="/admin/users">
        <v-btn>Gestion des utilisateurs</v-btn>
      </router-link>
      <router-link to="/admin/locations">
        <v-btn>Gestion des locations</v-btn>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.admin-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 120px 60px 0 60px;
  background-color: #f5f5f5;

  .actions {
    display: flex;
    gap: 24px;
    margin-bottom: 20px;
  }
}
</style>
