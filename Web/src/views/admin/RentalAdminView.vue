<template>
  <v-sheet border rounded>
    <v-data-table
      :headers="headers"
      :items="rentals"
      :hide-default-footer="rentals.length < 11"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="material-symbols:bike-lane-rounded"
              size="x-small"
              start
            ></v-icon>
            Gestion des locations
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Ajouter une location"
            border
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.rental_status="{ item }">
        <div class="d-flex align-center ga-2">
          <v-chip
            :color="rentalStatusColors[item.rental_status]"
            border="thin opacity-25"
          >
            {{ item.rental_status }}
          </v-chip>

          <v-btn
            v-if="item.rental_status === 'En cours'"
            @click.stop="completeRental(item)"
            color="green-darken-2"
            variant="tonal"
            size="x-small"
            icon
            rounded
            :loading="item.loading"
          >
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="top"
              >Marquer comme terminé</v-tooltip
            >
          </v-btn>
        </div>
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
            @click="remove(item.rental_id)"
          ></v-icon>
        </div>
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card
      :subtitle="`${isEditing ? 'Modifier' : 'Créer'} une location`"
      :title="`${isEditing ? 'Édition' : 'Nouvelle location'}`"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="record.account_id"
              label="ID Compte"
              type="number"
            >
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="record.bicycle_id"
              :items="bicycles"
              item-title="model"
              item-value="bicycle_id"
              label="Sélectionner un vélo"
              required
              multiple
            >
              <template v-slot:item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  {{ item.raw.brand }} - {{ item.raw.model }} ({{
                    item.raw.counter_km
                  }}km)</v-list-item
                >
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" md="6">
            <div
              class="startDate-input"
              ref="startDateTrigger"
              @click="toggleStartDatePicker"
            >
              <v-text-field
                :model-value="
                  record.start_date
                    ? new Date(record.start_date).toLocaleDateString('fr-FR')
                    : ''
                "
                label="Date de début"
                readonly
                prepend-inner-icon="mdi-calendar"
              ></v-text-field>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div
              class="endDate-input"
              ref="endDateTrigger"
              @click="toggleEndDatePicker"
            >
              <v-text-field
                :model-value="
                  record.end_date
                    ? new Date(record.end_date).toLocaleDateString('fr-FR')
                    : ''
                "
                label="Date de fin"
                readonly
                prepend-inner-icon="mdi-calendar"
              ></v-text-field>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.payment_status"
              label="Statut de paiement"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.rental_status"
              label="Statut de location"
            ></v-text-field>
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

    <div
      v-if="showStartDatePicker"
      ref="startDatePicker"
      :style="startDatePickerStyles"
      style="
        z-index: 1000;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      "
    >
      <v-date-picker
        v-model="record.start_date"
        color="primary"
        :min="new Date()"
        show-adjacent-months
      ></v-date-picker>
    </div>

    <div
      v-if="showEndDatePicker"
      ref="endDatePicker"
      :style="endDatePickerStyles"
      style="
        z-index: 1000;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      "
    >
      <v-date-picker
        v-model="record.end_date"
        color="primary"
        :min="new Date()"
        show-adjacent-months
      ></v-date-picker>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useFloating } from "@floating-ui/vue";

// Floating date picker pour lifetime
const startDateTrigger = ref(null);
const startDatePicker = ref(null);
const endDateTrigger = ref(null);
const endDatePicker = ref(null);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);
const dialog = ref(false);
const isEditing = ref(false);
const rentals = ref([]);
const record = ref(getEmptyRecord());
const bicycles = ref([]);

const { floatingStyles: startDatePickerStyles } = useFloating(
  startDateTrigger,
  startDatePicker,
  {
    placement: "bottom-start",
  },
);

const { floatingStyles: endDatePickerStyles } = useFloating(
  endDateTrigger,
  endDatePicker,
  {
    placement: "bottom-start",
  },
);

function toggleStartDatePicker() {
  showStartDatePicker.value = !showStartDatePicker.value;
}

function toggleEndDatePicker() {
  showEndDatePicker.value = !showEndDatePicker.value;
}

watch(
  () => record.value.start_date,
  () => {
    showStartDatePicker.value = false;
  },
);

watch(
  () => record.value.end_date,
  () => {
    showEndDatePicker.value = false;
  },
);

const { fetchData } = useFetch();

const rentalStatusColors = {
  Terminé: "green",
  Annulé: "red",
  "En cours": "orange",
};

const headers = [
  { title: "ID Location", key: "rental_id" },
  { title: "ID Compte", key: "account_id" },
  { title: "Statut de paiement", key: "payment_status" },
  { title: "Statut de location", key: "rental_status" },
  {
    title: "Date de début",
    key: "start_date",
    format: (v) => new Date(v).toLocaleDateString("fr-FR"),
  },
  {
    title: "Date de fin",
    key: "end_date",
    format: (v) => new Date(v).toLocaleDateString("fr-FR"),
  },
  { title: "Actions", key: "actions", align: "end" },
];

// Chargement initial des données
loadBicycles();
loadRentals();

async function loadRentals() {
  try {
    const data = await fetchData("/rentals");
    rentals.value = data;
  } catch (error) {
    console.error("Erreur de chargement:", error);
  }
}

async function loadBicycles() {
  try {
    const data = await fetchData("/bicycles/");
    bicycles.value = data;
  } catch (error) {
    console.error("Erreur de chargement des vélos:", error);
  }
}

function add() {
  // Ouvre la modal et efface les champs
  isEditing.value = false;
  record.value = getEmptyRecord();
  dialog.value = true;
}

function edit(item) {
  // Ouvre la modal et remplit les champs avec les données de l'élément sélectionné
  isEditing.value = true;
  record.value = { ...item };
  dialog.value = true;
}

async function save() {
  try {
    if (isEditing.value) {
      console.log("send PUT");
      await fetchData(`/rentals/${record.value.rental_id}`, {
        method: "PUT",
        body: JSON.stringify(record.value),
      });
      console.log("valid PUT");

      console.log("send DELETE");
      // Supprimer toute les rental association
      await fetchData(`/rentals/associate/${record.value.rental_id}`, {
        method: "DELETE",
      });
      console.log("valid DELETE");

      console.log("send POST");

      // Créer les nouvelles rentals association (ForEach(record.bike_id, record.rental.id))
      record.value.bicycle_id.forEach(async (bikeId) => {
        await fetchData("/rentals/associate", {
          method: "POST",
          body: JSON.stringify({
            bicycle_id: bikeId,
            rental_id: record.value.rental_id,
          }),
        });
      });
      console.log("valid POST");
    } else {
      await fetchData("/rentals", {
        method: "POST",
        body: JSON.stringify(record.value),
      });

      await fetchData(`/rentals/associate/${record.value.rental_id}`, {
        method: "DELETE",
      });

      console.log(record.value.bicycle_id);
      record.value.bicycle_id.forEach(async (bikeId) => {
        await fetchData("/rentals/associate", {
          method: "POST",
          body: JSON.stringify({
            bicycle_id: bikeId,
            rental_id: record.value.rental_id,
          }),
        });
      });
    }
    await loadRentals();
    dialog.value = false;
  } catch (error) {
    console.error("Erreur de sauvegarde:", error);
  }
}

async function remove(id) {
  if (confirm("Confirmer la suppression ?")) {
    try {
      await fetchData(`/rentals/${id}`, {
        method: "DELETE",
      });
      await loadRentals();
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  }
}

function getEmptyRecord() {
  return {
    bicycle_id: null,
    account_id: null,
    start_date: null,
    end_date: null,
    payment_status: "Non payé",
    rental_status: "En cours",
  };
}

async function completeRental(item) {
  try {
    const updatedItem = {
      ...item,
      rental_status: "Terminé",
    };

    // 1. Mise à jour via l'API
    const result = await fetchData(`/rentals/${item.rental_id}`, {
      method: "PUT",
      body: JSON.stringify(updatedItem),
    });

    // 2. Mise à jour locale immédiate
    const index = rentals.value.findIndex(
      (r) => r.rental_id === item.rental_id,
    );
    if (index !== -1) {
      rentals.value[index] = { ...updatedItem, ...result };
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Échec de la mise à jour");
  }
}
</script>

<style scoped lang="scss">
.endDate-input,
.startDate-input {
  cursor: pointer;
  .v-input__control {
    pointer-events: none;
  }
}
</style>
