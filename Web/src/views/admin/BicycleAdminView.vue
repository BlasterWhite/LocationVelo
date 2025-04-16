<template>
  <v-sheet border rounded>
    <v-data-table
      :headers="headers"
      :items="bicycles"
      :hide-default-footer="bicycles.length < 11"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-bike"
              size="x-small"
              start
            ></v-icon>
            Gestion de la flotte
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Ajouter un vélo"
            border
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.status="{ value }">
        <v-chip :color="statusColors[value]" border="thin opacity-25">
          {{ value }}
        </v-chip>
      </template>

      <template v-slot:item.electric_assistance="{ value }">
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
            @click="remove(item.bicycle_id)"
          ></v-icon>
        </div>
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card
      :subtitle="`${isEditing ? 'Modifier' : 'Créer'} un vélo`"
      :title="`${isEditing ? 'Édition' : 'Nouveau vélo'}`"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="record.model" label="Modèle"></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="record.image"
              label="URL de l'image"
              placeholder="https://example.com/image.jpg"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <div
              class="lifetime-input"
              ref="lifetimeTrigger"
              @click="toggleLifetimePicker"
            >
              <v-text-field
                :model-value="
                  record.lifetime
                    ? new Date(record.lifetime).toLocaleDateString('fr-FR')
                    : ''
                "
                label="Date d'expiration"
                readonly
                prepend-inner-icon="mdi-calendar"
              ></v-text-field>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.price_per_day"
              label="Prix/jour (€)"
              type="number"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.bicycle_type"
              label="Type"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.revision_cycle"
              label="Cycle de révision (km)"
              type="number"
              :min="1"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.counter_km"
              label="KM total"
              type="number"
              :min="0"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="record.last_km_service"
              label="Dernière révision (km)"
              type="number"
              :min="0"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="record.brand" label="Marque"></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-checkbox
              v-model="record.electric_assistance"
              label="Assistance électrique"
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

    <div
      v-if="showLifetimePicker"
      ref="lifetimePicker"
      :style="lifetimePickerStyles"
      style="
        z-index: 1000;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      "
    >
      <v-date-picker
        v-model="record.lifetime"
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
const lifetimeTrigger = ref(null);
const lifetimePicker = ref(null);
const showLifetimePicker = ref(false);
const dialog = ref(false);
const isEditing = ref(false);
const bicycles = ref([]);
const record = ref(getEmptyRecord());

const { floatingStyles: lifetimePickerStyles } = useFloating(
  lifetimeTrigger,
  lifetimePicker,
  {
    placement: "bottom-start",
  },
);

function toggleLifetimePicker() {
  showLifetimePicker.value = !showLifetimePicker.value;
}

watch(
  () => record.value.lifetime,
  () => {
    showLifetimePicker.value = false;
  },
);

const { fetchData } = useFetch();

const statusColors = {
  Disponible: "green",
  Réservé: "red",
  Maintenance: "orange",
  "Hors service": "grey",
};

const headers = [
  { title: "ID", key: "bicycle_id" },
  { title: "Type", key: "bicycle_type" },
  { title: "Marque", key: "brand" },
  { title: "Modèle", key: "model" },
  { title: "Prix/jour", key: "price_per_day" },
  { title: "Statut", key: "status" },
  { title: "Électrique", key: "electric_assistance" },
  { title: "Cycle révision", key: "revision_cycle" },
  { title: "KM total", key: "counter_km" },
  { title: "Dernière révision", key: "last_km_service" },
  {
    title: "Expiration",
    key: "lifetime",
    format: (v) => new Date(v).toLocaleDateString("fr-FR"),
  },
  { title: "Actions", key: "actions", align: "end" },
];

// Chargement initial des données
loadBicycles();

async function loadBicycles() {
  try {
    const data = await fetchData("/bicycles");
    bicycles.value = data;
  } catch (error) {
    console.error("Erreur de chargement:", error);
  }
}

function add() {
  // OUvre la modal et clear le les champs
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
      await fetchData(`/bicycles/${record.value.bicycle_id}`, {
        method: "PUT",
        body: JSON.stringify(record.value),
      });
    } else {
      await fetchData("/bicycles", {
        method: "POST",
        body: JSON.stringify(record.value),
      });
    }
    await loadBicycles();
    dialog.value = false;
  } catch (error) {
    console.error("Erreur de sauvegarde:", error);
  }
}

async function remove(id) {
  if (confirm("Confirmer la suppression ?")) {
    try {
      await fetchData(`/bicycles/${id}`, {
        method: "DELETE",
      });
      await loadBicycles();
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  }
}

function getEmptyRecord() {
  return {
    bicycle_type: "VTT",
    brand: "",
    model: "",
    price_per_day: "0",
    image: "",
    revision_cycle: "0",
    counter_km: "0",
    lifetime: null,
    last_km_service: "0",
    status: "Disponible",
    electric_assistance: false,
  };
}
</script>

<style scoped lang="scss">
.lifetime-input {
  cursor: pointer;
  .v-input__control {
    pointer-events: none;
  }
}
</style>
