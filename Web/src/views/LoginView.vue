<script setup>
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";
const { email, password, login, error } = useAuth();
const router = useRouter();

function register() {
  router.push({ name: "register" });
}
</script>

<template>
  <h1>Login</h1>
  <v-form>
    <v-text-field
      v-model="email"
      label="Email"
      outlined
      :rules="[emailRules]"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      outlined
      :rules="[passwordRules]"
      type="password"
    ></v-text-field>
    <p class="error">{{ error }}</p>
    <v-btn @click="login">Login</v-btn>
    <v-btn @click="register">Register</v-btn>
  </v-form>
</template>
