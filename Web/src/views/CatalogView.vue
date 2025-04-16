<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useFetch } from "@/composables/useFetch";
import FiltersMenu from "@/components/FiltersMenu.vue";

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

const bicycles = ref([]);
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
</script>

<template>
  <div class="catalog-view">
    <main>
      <filters-menu
        :filter="filters"
        :filter-display-opt="filterDisplayOpt"
        v-model="filterData"
      ></filters-menu>
      <div></div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.catalog-view {
  margin: 120px 0 80px 0;
  main {
    width: 100%;
    display: flex;
    gap: 24px;
  }
}
</style>
