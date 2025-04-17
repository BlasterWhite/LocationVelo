<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useFetch } from "@/composables/useFetch";
import { useCartStore } from '@/stores/cartStore';
import { storeToRefs } from 'pinia';
import FiltersMenu from "@/components/FiltersMenu.vue";
import bicycleCard from "../components/BicycleCard.vue";

const cartStore = useCartStore();
const { cart } = storeToRefs(cartStore);

const bookingDialog = ref(false);
const bicycleSelected = ref({});
const tableBicyclesSelected = ref([]);

const showSnackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('info');

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
    bicyclesData.value = data;
    calculateBicycles();
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
  priceRange: [0, 35],
  electricAssistance: false,
  brandSelected: [],
  modelSelected: [],
  typeSelected: [],
  statusSelected: [],
});

const bicycles = ref([]);
function calculateBicycles() {
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

function toggleDialog(bicycle) {
  bookingDialog.value = !bookingDialog.value;
  bicycleSelected.value = bicycle;
  tableBicyclesSelected.value = bicyclesData.value.filter((bicycle) => bicycle.brand===bicycleSelected.value.brand && bicycle.model===bicycleSelected.value.model);
}

function addBicycleToCart(addedBicycle) {
  const alreadyInCart = cartStore.cart.some((item) => item.bicycle_id === addedBicycle.bicycle_id);

  if(alreadyInCart) {
    snackbarMessage.value = 'Ce vélo est déjà dans le panier.';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  snackbarMessage.value = 'Vélo ajouté au panier.'
  snackbarColor.value = 'success';
  showSnackbar.value = true;
  cartStore.addToCart(addedBicycle);
}

watch(
  () => filterData.value,
  (newValue) => {
    calculateBicycles();
  },
  { deep: true },
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
      <div class="bicycles-list">
        <bicycle-card
          v-for="(bicycleCard, index) in bicycles"
          :key="index"
          :image="bicycleCard.image"
          :title="bicycleCard.model"
          :quantity="bicycleCard.quantity"
          :brand="bicycleCard.brand"
          :model="bicycleCard.model"
          :price-per-km="bicycleCard.price_per_day"
          :power="bicycleCard.electric_assistance"
          @click="toggleDialog(bicycleCard)"
        />
      </div>
    </main>
    <v-dialog v-model="bookingDialog" max-width="600">
      <v-card title="Réserver un vélo">
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div><strong>Marque :</strong> {{ bicycleSelected.brand }}</div>
              <div><strong>Modèle :</strong> {{ bicycleSelected.model }}</div>
              <div><strong>Type :</strong> {{ bicycleSelected.bicycle_type }}</div>
              <div><strong>Assistance électrique :</strong> {{ bicycleSelected.electric_assistance?'Oui':'Non' }}</div>
              <div><strong>Prix (par jour) :</strong> {{ bicycleSelected.price_per_day }}€</div>
              <div><strong>Cycle de révision :</strong> {{ bicycleSelected.revision_cycle }} km</div>
            </v-col>
            <v-col cols="6">
              <v-img
                :src="bicycleSelected.image"
                height="200"
                contain
                
              ></v-img>
            </v-col>
          </v-row>
          <v-table class="mt-4">
            <thead>
              <tr>
                <th>Compteur</th>
                <th>Dernière révision</th>
                <th>Durée de vie</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(bicycle, index) in tableBicyclesSelected"
                :key="index"
              >
                <td>{{ bicycle.counter_km }} km</td>
                <td>{{ bicycle.last_km_service }} km</td>
                <td>{{ new Date(bicycle.lifetime).getFullYear() }}</td>
                <td>
                  <v-btn
                    icon="mdi-plus"
                    size="small"
                    variant="text"
                    @click="addBicycleToCart(bicycle)"
                  ></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="showSnackbar"
      timeout="2500"
      :color="snackbarColor"
      location="bottom right"
    >
      {{ snackbarMessage }}
    </v-snackbar>
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
