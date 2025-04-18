<script setup>
import { ref, defineProps, watch } from "vue";
import { useFloating } from "@floating-ui/vue";

const props = defineProps({
  filter: {
    type: Object,
    require: true,
  },
  filterDisplayOpt: {
    type: Object,
    require: true,
    defaut: () => ({
      search: true,
      date: true,
      price: true,
      brand: true,
      model: true,
      type: true,
      status: true,
      electric: true,
    }),
  },
  modelValue: {
    type: Object,
    require: true,
    defaut: () => ({
      searchText: "",
      startDate: new Date(),
      endDate: new Date(),
      priceRangeStart: 0,
      priceRangeEnd: 30,
      priceRange: [0, 30],
      electricAssistance: true,
      brancdSelected: [],
      modelSelected: [],
      typeSelected: [],
      statusSelected: [],
    }),
  },
});

const emits = defineEmits(["update:modelValue"]);

// Ajout des dates
const dateStart = ref(new Date());
const dateEnd = ref(new Date());

// Gestion de l'affichage des pickers
const dateStartTrigger = ref(null);
const dateStartPicker = ref(null);
const showDateStartPicker = ref(false);
const { floatingStyles: dateStartPickerStyles } = useFloating(
  dateStartTrigger,
  dateStartPicker,
  { placement: "bottom-start" },
);
function toggleDateStartPicker() {
  showDateEndPicker.value = false;
  showDateStartPicker.value = !showDateStartPicker.value;
}

const dateEndTrigger = ref(null);
const dateEndPicker = ref(null);
const showDateEndPicker = ref(false);
const { floatingStyles: dateEndPickerStyles } = useFloating(
  dateEndTrigger,
  dateEndPicker,
  { placement: "bottom-start" },
);

function toggleDateEndPicker() {
  showDateStartPicker.value = false;
  showDateEndPicker.value = !showDateEndPicker.value;
}

// Watchers pour synchroniser les dates
watch(
  () => props.modelValue.startDate,
  (newVal) => {
    showDateStartPicker.value = false;
    if (newVal > dateEnd.value) {
      dateEnd.value = new Date(newVal);
      dateEnd.value.setDate(newVal.getDate() + 1);
    }
    emits("update:modelValue", {
      ...props.modelValue,
      startDate: newVal,
      endDate: dateEnd.value,
    });
  },
);

watch(dateEnd, (newVal) => {
  showDateEndPicker.value = false;
  emits("update:modelValue", { ...props.modelValue, endDate: newVal });
});
</script>

<template>
  <div class="filters-menu">
    <v-text-field
      v-if="filterDisplayOpt?.search || false"
      v-model="props.modelValue.searchText"
      prepend-inner-icon="mdi-magnify"
      placeholder="Rechercher"
      outlined
    ></v-text-field>

    <div v-if="filterDisplayOpt?.date || false" class="date-pickers">
      <!-- Champ de début -->
      <div
        class="date-input"
        ref="dateStartTrigger"
        @click="toggleDateStartPicker"
      >
        <v-icon icon="mdi-calendar" />
        {{ props.modelValue.startDate.toLocaleDateString("fr-FR") }}
      </div>

      <!-- Champ de fin -->
      <div
        class="date-input"
        ref="dateEndTrigger"
        @click="toggleDateEndPicker"
      >
        <v-icon icon="mdi-calendar" />
        {{ props.modelValue.endDate.toLocaleDateString("fr-FR") }}
      </div>

      <!-- Picker flottant début -->
      <div
        v-if="showDateStartPicker"
        ref="dateStartPicker"
        :style="dateStartPickerStyles"
        class="date-picker-container"
      >
        <v-date-picker
          v-model="props.modelValue.startDate"
          color="primary"
          :min="new Date()"
        />
      </div>

      <!-- Picker flottant fin -->
      <div
        v-if="showDateEndPicker"
        ref="dateEndPicker"
        :style="dateEndPickerStyles"
        class="date-picker-container"
      >
        <v-date-picker
          v-model="props.modelValue.endDate"
          color="primary"
          :min="new Date()"
        />
      </div>
    </div>

    <v-range-slider
      v-if="filterDisplayOpt?.price || false"
      v-model="props.modelValue.priceRange"
      :max="filter?.pricing[0]?.max_price"
      :min="filter?.pricing[0]?.min_price"
      :step="1"
      colors="primary"
      label="Prix/jour"
      thumb-label="always"
      thumb-label-formatter="(value) => value + '€'"
    ></v-range-slider>

    <v-expansion-panels variant="accordion" flat>
      <v-expansion-panel v-if="filterDisplayOpt?.brand || false">
        <v-expansion-panel-title> Marque </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox
            v-for="(brand, index) in filter?.brands"
            :key="index"
            v-model="props.modelValue.brandSelected"
            :label="brand"
            :value="brand"
            color="primary"
            hide-details
            class="mt-4"
          ></v-checkbox>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel v-if="filterDisplayOpt?.model || false">
        <v-expansion-panel-title> Modèle </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox
            v-for="(model, index) in filter?.models"
            :key="index"
            v-model="props.modelValue.modelSelected"
            :label="model"
            :value="model"
            color="primary"
            hide-details
            class="mt-4"
          ></v-checkbox>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel v-if="filterDisplayOpt?.type || false">
        <v-expansion-panel-title> Type </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox
            v-for="(type, index) in filter?.types"
            :key="index"
            v-model="props.modelValue.typeSelected"
            :label="type"
            :value="type"
            color="primary"
            hide-details
            class="mt-4"
          ></v-checkbox>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel v-if="filterDisplayOpt?.status || false">
        <v-expansion-panel-title> Statue </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox
            v-for="(status, index) in filter?.statuses"
            :key="index"
            v-model="props.modelValue.statusSelected"
            :label="status"
            :value="status"
            color="primary"
            hide-details
            class="mt-4"
          ></v-checkbox>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-checkbox
      v-if="filterDisplayOpt?.electric || false"
      v-model="props.modelValue.electricAssistance"
      label="Assistance électrique"
      color="primary"
      hide-details
      class="mt-4"
      style="width: 100%"
    ></v-checkbox>
  </div>
</template>

<style scoped lang="scss">
.filters-menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 350px;
  padding: 16px;
  height: fit-content;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  & > * {
    margin: 0;
    flex-grow: 0;
  }
}

.date-pickers {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.date-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.date-picker-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.date-pickers {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.date-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.date-picker-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

</style>
