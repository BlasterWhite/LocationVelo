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

const showEditModal = ref(false);

function logout() {
  router.push({ name: "login" });
  authStore.logout();
}

function deleteAccount() {
  authStore.deleteAccount();
  router.push({ name: "login" });
}

const editFirstName = ref(user.value.first_name);
const editLastName = ref(user.value.last_name);
const editEmail = ref(user.value.email);
const editPhone = ref(user.value.phone);
const editAddress = ref(user.value.address);
const editNewsLetter = ref(user.value.newsLetter);

function resetEditFields() {
  editFirstName.value = user.value.first_name;
  editLastName.value = user.value.last_name;
  editEmail.value = user.value.email;
  editPhone.value = user.value.phone;
  editAddress.value = user.value.address;
  editNewsLetter.value = user.value.newsLetter;
  showEditModal.value = false;
}

function saveChanges() {
  authStore.updateUser({
    first_name: editFirstName.value,
    last_name: editLastName.value,
    email: editEmail.value,
    phone: editPhone.value,
    address: editAddress.value,
    subscribe: editNewsLetter.value,
  });
  showEditModal.value = false;
}
</script>

<template>
  <div class="account-view">
    <v-card v-if="user">
      <v-card-title>Mon Compte</v-card-title>
      <v-card-subtitle>
        Bienvenue, {{ user.first_name }} {{ user.last_name }} !
      </v-card-subtitle>
      <v-card-text>
        <p>Email: {{ user.email }}</p>
        <p>Téléphone: {{ user.phone }}</p>
        <p>Adresse: {{ user.address }}</p>
        <p>Newsletter: {{ user.newsLetter ? "Oui" : "Non" }}</p>
      </v-card-text>
      <v-btn @click="showEditModal = true" color="primary" class="mr-4">
        <v-icon left>mdi-account-edit</v-icon>
        Modifier le compte
      </v-btn>
      <v-btn @click="logout" color="error" class="mr-4">
        <v-icon left>mdi-logout</v-icon>
        Déconnexion
      </v-btn>
      <v-btn @click="deleteAccount" color="error">
        <v-icon left>mdi-delete</v-icon>
        Supprimer le compte
      </v-btn>
    </v-card>
    <h2 v-else>Veuillez vous connecter pour accéder à votre compte.</h2>
    <v-dialog
      v-model="showEditModal"
      max-width="600px"
      transition="scale-transition"
      persistent
      :style="{ zIndex: 9999 }"
    >
      <v-card>
        <v-card-title>Modifier le compte</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="editFirstName"
              label="Prénom"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="editLastName"
              label="Nom"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="editEmail"
              label="Email"
              type="email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
            <v-text-field
              v-model="editPhone"
              label="Téléphone"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="editAddress"
              label="Adresse"
              :rules="[rules.required]"
            ></v-text-field>
            <v-checkbox
              v-model="editNewsLetter"
              label="S'inscrire à la newsletter"
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="resetEditFields" color="secondary">Annuler</v-btn>
          <v-btn @click="saveChanges" color="primary">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.account-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding-top: 120px;
  background-color: #f5f5f5;

  .v-card {
    max-width: 1240px;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
  }
}
</style>
