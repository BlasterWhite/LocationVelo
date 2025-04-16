<script setup>
import { ref, defineProps } from "vue";

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

const searchText = ref("");
const priceRangeStart = ref(0);
const priceRangeEnd = ref(0);
const electricAssistance = ref(true);
const brancdSelected = ref([]);
const modelSelected = ref([]);
const typeSelected = ref([]);
const statusSelected = ref([]);
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
</style>
