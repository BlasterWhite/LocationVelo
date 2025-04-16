<script setup>
import { storeToRefs } from "pinia";

import { useAuthStore } from "../stores/authStore";
const authStore = useAuthStore(); // Initialize the store

const { token, isAuthenticated, user } = storeToRefs(authStore); // Destructure reactive store values

function logout() {
  authStore.logout();
}
</script>

<template>
  <h1>Hello</h1>
  <v-btn append-icon="$vuetify"> Button </v-btn>
  <div v-if="isAuthenticated">
    <p>Token: {{ token }}</p>
    <p>Authenticated: {{ isAuthenticated }}</p>
    <p>User: {{ JSON.stringify(user) }}</p>
    <v-btn @click="logout">Logout</v-btn>
  </div>
  <div v-else>
    <p>You are not authenticated.</p>
    <router-link to="/login">
      <v-btn>Login</v-btn>
    </router-link>
    <router-link to="/register">
      <v-btn>Register</v-btn>
    </router-link>
  </div>
</template>
