<script setup>
const { email, password, error, login, socialLogin } = useAuth();
</script>

<template>
  <h1>Register</h1>
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
    <v-text-field
      v-model="confirmPassword"
      label="Confirm Password"
      outlined
      :rules="[confirmPasswordRules]"
      type="password"
    ></v-text-field>
    <v-btn @click="register">Register</v-btn>
    <v-btn @click="login">Login</v-btn>
  </v-form>
</template>
