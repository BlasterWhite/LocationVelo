<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useFetch } from "@/composables/useFetch";
import FiltersMenu from "@/components/FiltersMenu.vue";
import bicycleCard from "../components/BicycleCard.vue";

const route = useRoute();
route.query.startDate = route.query.startDate
  ? new Date(route.query.startDate)
  : null;

async function getFilters() {
  const filters = await useFetch().fetchData("/filters");
  return filters;
}

const filters = ref(null);
getFilters()
  .then((data) => {
    filters.value = data;
  })
  .catch((error) => {
    console.error("Error fetching filters:", error);
  });

const bicyclesData = ref([]);
useFetch()
  .fetchData("/bicycles")
  .then((data) => {
    bicycles.value = data;
  })
  .catch((error) => {
    console.error("Error fetching bicycles:", error);
  });

const startDate = ref(
  route.query.startDate ? new Date(route.query.startDate) : null,
);
const endDate = ref(route.query.endDate ? new Date(route.query.endDate) : null);

const filterDisplayOpt = ref({
  search: true,
  price: true,
  brand: true,
  model: true,
  type: true,
  status: true,
  electric: true,
});

const filterData = ref({
  searchText: "",
  priceRange: [0, 30],
  electricAssistance: true,
  brandSelected: [],
  modelSelected: [],
  typeSelected: [],
  statusSelected: [],
});

const bicycles = ref([]);
function calculateBicycles() {
  // Reduce array on Model
  bicycles.value = bicyclesData.value.reduce((acc, bicycle) => {
    const model = bicycle.model;
    if (!acc[model]) {
      acc[model] = {
        ...bicycle,
        quantity: 1,
      };
    } else {
      acc[model].quantity++;
    }
    return acc;
  }, {});
}
</script>

<template>
  <div class="catalog-view">
    <main>
      <filters-menu
        :filter="filters"
        :filter-display-opt="filterDisplayOpt"
        v-model="filterData"
      ></filters-menu>
      <div class="bicycles-list">
        <bicycle-card
          v-for="(bicycleCard, index) in bicycles"
          :key="index"
          :image="bicycleCard.image"
          :title="bicycleCard.title"
          :quantity="bicycleCard.quantity"
          :brand="bicycleCard.brand"
          :model="bicycleCard.model"
          :power="bicycleCard.electric_assistance"
        />
      </div>
    </main>
    <p>
      Start Date:
      {{ startDate ? startDate.toLocaleDateString() : "Not selected" }} <br />
      End Date: {{ endDate ? endDate.toLocaleDateString() : "Not selected" }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.catalog-view {
  margin: 120px 0 80px 0;
  main {
    width: 100%;
    display: flex;
    gap: 24px;

    .bicycles-list {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      width: 100%;
    }
  }
}
</style>
