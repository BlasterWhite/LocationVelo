<template>
  <v-sheet border rounded>
    <v-data-table
      :headers="headers"
      :items="users"
      :hide-default-footer="users.length < 11"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-account-group"
              size="x-small"
              start
            ></v-icon>
            Gestion des utilisateurs
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Ajouter un utilisateur"
            border
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.account_role="{ value }">
        <v-chip :color="roleColors[value]" border="thin opacity-25">
          {{ value }}
        </v-chip>
      </template>

      <template v-slot:item.subscribe="{ value }">
        <v-icon
          :color="value ? 'green' : 'red'"
          :icon="value ? 'mdi-check-circle' : 'mdi-close-circle'"
        ></v-icon>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="edit(item)"
          ></v-icon>
          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.account_id)"
          ></v-icon>
        </div>
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card
      :subtitle="`${isEditing ? 'Modifier' : 'Créer'} un utilisateur`"
      :title="`${isEditing ? 'Édition' : 'Nouvel utilisateur'}`"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.first_name"
              label="Prénom"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.last_name"
              label="Nom"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="record.email"
              label="Email"
              type="email"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.phone"
              label="Téléphone"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="record.account_role"
              :items="roles"
              label="Rôle"
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="record.address"
              label="Adresse"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.password"
              label="Mot de passe"
              type="password"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.passwordConfirm"
              label="Confirmer le mot de passe"
              type="password"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-checkbox
              v-model="record.subscribe"
              label="Abonné à la newsletter"
            ></v-checkbox>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Annuler" variant="plain" @click="dialog = false"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="Enregistrer" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useRules } from "@/composables/useRules";

const { fetchData } = useFetch();
const { rules } = useRules();

const dialog = ref(false);
const isEditing = ref(false);
const users = ref([]);
const record = ref(getEmptyRecord());

const roles = ["client", "admin", "manager"];
const roleColors = {
  client: "blue",
  admin: "red",
  manager: "orange",
};

const headers = [
  { title: "ID", key: "account_id" },
  { title: "Prénom", key: "first_name" },
  { title: "Nom", key: "last_name" },
  { title: "Email", key: "email" },
  { title: "Téléphone", key: "phone" },
  { title: "Adresse", key: "address" },
  { title: "Rôle", key: "account_role" },
  { title: "Abonné", key: "subscribe" },
  { title: "Actions", key: "actions", align: "end" },
];

// Chargement initial des données
loadUsers();

async function loadUsers() {
  try {
    const data = await fetchData("/accounts");
    users.value = data;
  } catch (error) {
    console.error("Erreur de chargement:", error);
  }
}

function add() {
  isEditing.value = false;
  record.value = getEmptyRecord();
  dialog.value = true;
}

function edit(item) {
  isEditing.value = true;
  record.value = { ...item };
  dialog.value = true;
}

async function save() {
  try {
    if (isEditing.value) {
      await fetchData(`/accounts/${record.value.account_id}`, {
        method: "PUT",
        body: JSON.stringify(record.value),
      });
    } else {
      await fetchData("/accounts", {
        method: "POST",
        body: JSON.stringify(record.value),
      });
    }
    await loadUsers();
    dialog.value = false;
  } catch (error) {
    console.error("Erreur de sauvegarde:", error);
  }
}

async function remove(id) {
  if (confirm("Confirmer la suppression ?")) {
    try {
      await fetchData(`/accounts/${id}`, {
        method: "DELETE",
      });
      await loadUsers(); // FIXME: reload the list
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  }
}

function getEmptyRecord() {
  return {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    account_role: "client",
    subscribe: false,
  };
}
</script>
