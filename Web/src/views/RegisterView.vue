<script setup>
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";
import { useRules } from "@/composables/useRules";

const { rules } = useRules();
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

const login = () => {
  router.push({ name: "login" });
};
</script>

<template>
  <div class="register-view">
    <v-card>
      <v-card-title>Inscription</v-card-title>
      <v-card-subtitle>
        Bienvenue ! Veuillez vous inscrire pour créer un compte.
      </v-card-subtitle>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            label="Mail"
            type="email"
            :rules="[rules.required, rules.email]"
            :error-messages="error.email"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Mot de passe"
            type="password"
            :rules="[rules.required, rules.password]"
            :error-messages="error.password"
          ></v-text-field>
          <v-text-field
            v-model="passwordConfirm"
            label="Confirmer le mot de passe"
            type="password"
            :rules="[rules.required, rules.password]"
            :error-messages="error.passwordConfirm"
          ></v-text-field>
          <v-text-field
            v-model="firstName"
            label="Prénom"
            :rules="[rules.required]"
            :error-messages="error.firstName"
          ></v-text-field>
          <v-text-field
            v-model="lastName"
            label="Nom"
            :rules="[rules.required]"
            :error-messages="error.lastName"
          ></v-text-field>
          <v-text-field
            v-model="phone"
            label="Téléphone"
            :rules="[rules.required]"
            :error-messages="error.phone"
          ></v-text-field>
          <v-text-field
            v-model="address"
            label="Adresse"
            :rules="[rules.required]"
            :error-messages="error.address"
          ></v-text-field>
          <v-checkbox
            v-model="newsLetter"
            label="S'inscrire à la newsletter"
            color="primary"
          ></v-checkbox>

          <v-alert
            v-if="error"
            type="error"
            dismissible
            :value="true"
            class="mb-4"
            :style="{ maxWidth: '400px', margin: '0 auto' }"
          >
            {{ error }}
          </v-alert>
          <v-btn @click="register" color="primary" class="mr-4"
            >Inscription</v-btn
          >
          <v-btn @click="login">Connexion</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.register-view {
  padding-top: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  .v-card {
    width: 400px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #fff;
  }
}
</style>
