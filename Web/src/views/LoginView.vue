<script setup>
import { useAuth } from "@/composables/useAuth";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { useRules } from "@/composables/useRules";

const { rules } = useRules();
const { email, password, login, error } = useAuth();
const router = useRouter();

function register() {
  router.push({ name: "register" });
}

watch(
  () => error.value,
  (newError) => {
    if (newError) {
      setTimeout(() => {
        error.value = false;
      }, 3000);
    }
  },
);
</script>

<template>
  <div class="login-view">
    <v-card>
      <v-card-title>Connexion</v-card-title>
      <v-card-subtitle>
        Bienvenue ! Veuillez vous connecter à votre compte.
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
            :rules="[rules.required]"
            :error-messages="error.password"
          ></v-text-field>
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
          <v-btn @click="login" color="primary" class="mr-4">Connexion</v-btn>
          <v-btn @click="register">Inscription</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.login-view {
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
