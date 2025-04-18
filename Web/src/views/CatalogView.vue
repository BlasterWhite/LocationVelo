<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useFetch } from "@/composables/useFetch";
import FiltersMenu from "@/components/FiltersMenu.vue";
import bicycleCard from "../components/BicycleCard.vue";
import CartIcon from "../components/CartIcon.vue";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();

const route = useRoute();
route.query.startDate = route.query.startDate
  ? new Date(route.query.startDate)
  : null;

const startDate = ref(
  route.query.startDate ? new Date(route.query.startDate) : new Date(),
);
const endDate = ref(
  route.query.endDate
    ? new Date(route.query.endDate)
    : new Date(startDate.value.getTime() + 24 * 60 * 60 * 1000),
);

async function getFilters() {
  const filters = await useFetch().fetchData("/filters");
  return filters;
}

async function getBicycles() {
  if (startDate.value && endDate.value) {
    const startDateString = startDate.value.toISOString().split("T")[0];
    const endDateString = endDate.value.toISOString().split("T")[0];
    const bicycles = await useFetch().fetchData(
      `/bicycles/${startDateString}/${endDateString}`,
    );
    return bicycles;
  } else {
    const bicycles = await useFetch().fetchData("/bicycles");
    return bicycles;
  }
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
getBicycles()
  .then((data) => {
    bicyclesData.value = data;
    bicycles.value = data;
    calculateBicycles();
  })
  .catch((error) => {
    console.error("Error fetching bicycles:", error);
  });

const filterDisplayOpt = ref({
  search: true,
  date: true,
  price: true,
  brand: true,
  model: true,
  type: true,
  status: true,
  electric: true,
});

const filterData = ref({
  searchText: "",
  startDate: startDate.value,
  endDate: endDate.value,
  priceRange: [0, 35],
  electricAssistance: false,
  brandSelected: [],
  modelSelected: [],
  typeSelected: [],
  statusSelected: [],
});

const bicycles = ref([]);
async function calculateBicycles() {
  await getBicycles();
  // Reduce array on Model
  let localBicycle = bicyclesData.value.reduce((acc, bicycle) => {
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

  // Price Filter
  localBicycle = Object.values(localBicycle).filter((bicycle) => {
    return (
      bicycle.price_per_day >= filterData.value.priceRange[0] &&
      bicycle.price_per_day <= filterData.value.priceRange[1]
    );
  });

  // Search Filter
  localBicycle = localBicycle.filter((bicycle) => {
    return (
      bicycle.brand
        .toLowerCase()
        .includes(filterData.value.searchText.toLowerCase()) ||
      bicycle.model
        .toLowerCase()
        .includes(filterData.value.searchText.toLowerCase())
    );
  });

  // Electric Filter
  if (!!filterData.value.electricAssistance)
    localBicycle = localBicycle.filter((bicycle) => {
      return !!bicycle.electric_assistance;
    });

  // Brand Filter
  if (filterData.value.brandSelected.length > 0)
    localBicycle = localBicycle.filter((bicycle) => {
      return filterData.value.brandSelected.includes(bicycle.brand);
    });

  // Model Filter
  if (filterData.value.modelSelected.length > 0)
    localBicycle = localBicycle.filter((bicycle) => {
      return filterData.value.modelSelected.includes(bicycle.model);
    });

  // Type Filter
  if (filterData.value.typeSelected.length > 0)
    localBicycle = localBicycle.filter((bicycle) => {
      return filterData.value.typeSelected.includes(bicycle.bicycle_type);
    });

  // Status Filter
  if (filterData.value.statusSelected.length > 0)
    localBicycle = localBicycle.filter((bicycle) => {
      return filterData.value.statusSelected.includes(bicycle.status);
    });

  bicycles.value = localBicycle;
}

watch(
  () => filterData.value,
  (newVal) => {
    cartStore.setDates({
      start: newVal.startDate,
      end: newVal.endDate,
    });
    calculateBicycles();
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="catalog-view">
    <main>
      <filters-menu
        :filter="filters"
        :filter-display-opt="filterDisplayOpt"
        v-model="filterData"
      ></filters-menu>
      <div class="cart-icon">
        <cart-icon />
      </div>
      <div class="bicycles-list" :key="bicycles">
        <bicycle-card
          v-for="(bicycleCard, index) in bicycles"
          :key="index"
          :image="bicycleCard.image"
          :title="bicycleCard.model"
          :start-date="startDate"
          :end-date="endDate"
          :quantity="bicycleCard.quantity"
          :brand="bicycleCard.brand"
          :model="bicycleCard.model"
          :price-per-km="bicycleCard.price_per_day"
          :power="bicycleCard.electric_assistance"
        />
      </div>
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

    .bicycles-list {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      width: 100%;
    }
  }

  .cart-icon {
    position: fixed;
    top: 35px;
    right: 35px;
    z-index: 1000;
  }
}
</style>
