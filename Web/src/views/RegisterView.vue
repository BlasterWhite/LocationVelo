<script setup>
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";
const {
  email,
  password,
  passwordConfirm,
  firstName,
  lastName,
  phone,
  address,
  newsLetter,
  register,
  error,
} = useAuth();
const router = useRouter();

const rules = {
  required: (value) => !!value || "Ce champ est requis",
  email: (value) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value) ||
    "L'adresse e-mail doit être valide",
  password: (value) =>
    value.length >= 6 || "Le mot de passe doit contenir au moins 6 caractères",
  confirmPassword: (value) =>
    value === password.value || "Les mots de passe ne correspondent pas",
};

const login = () => {
  router.push({ name: "login" });
};
</script>

<template>
  <h1>Register</h1>
  <v-form>
    <v-text-field
      v-model="email"
      label="Address Email"
      outlined
      :rules="[rules.required, rules.email]"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Mot de passe"
      outlined
      :rules="[rules.required, rules.password]"
      type="password"
    ></v-text-field>
    <v-text-field
      v-model="passwordConfirm"
      label="Confirmer le mot de passe"
      outlined
      :rules="[rules.required, rules.confirmPassword]"
      type="password"
    ></v-text-field>
    <v-text-field
      v-model="firstName"
      label="Prénom"
      outlined
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      v-model="lastName"
      label="Nom"
      outlined
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field v-model="phone" label="Téléphone" outlined></v-text-field>
    <v-text-field v-model="address" label="Adresse" outlined></v-text-field>
    <v-checkbox
      v-model="newsLetter"
      label="S'inscrire à la newsletter"
    ></v-checkbox>
    <p class="error">{{ error }}</p>
    <v-btn @click="register">Register</v-btn>
    <v-btn @click="login">Login</v-btn>
  </v-form>
</template>
