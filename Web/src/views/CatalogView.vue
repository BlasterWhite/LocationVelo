<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useFetch } from "@/composables/useFetch";
import { useCartStore } from "@/stores/cartStore";
import { storeToRefs } from "pinia";
import FiltersMenu from "@/components/FiltersMenu.vue";
import bicycleCard from "../components/BicycleCard.vue";
import CartIcon from "../components/CartIcon.vue";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();

const cartStore = useCartStore();
const { cart } = storeToRefs(cartStore);

const bookingDialog = ref(false);
const bicycleSelected = ref({});
const tableBicyclesSelected = ref([]);

// Message d'alerte pour l'ajout dans le panier
const showSnackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("info");

// Ouverture du panier
const showCart = ref(false);

const openDetails = ref({});

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

function toggleDialog(bicycle) {
  bookingDialog.value = !bookingDialog.value;
  bicycleSelected.value = bicycle;
  tableBicyclesSelected.value = bicyclesData.value.filter(
    (bicycle) =>
      bicycle.brand === bicycleSelected.value.brand &&
      bicycle.model === bicycleSelected.value.model,
  );
}

function addBicycleToCart(addedBicycle) {
  const alreadyInCart = cartStore.cart.some(
    (item) => item.bicycle_id === addedBicycle.bicycle_id,
  );

  if (alreadyInCart) {
    snackbarMessage.value = "Ce vélo est déjà dans le panier.";
    snackbarColor.value = "error";
    showSnackbar.value = true;
    return;
  }

  snackbarMessage.value = "Vélo ajouté au panier.";
  snackbarColor.value = "success";
  showSnackbar.value = true;
  cartStore.addToCart(addedBicycle);
}

function removeBicycleFromCart(bicycle_id) {
  cartStore.removeFromCart(bicycle_id);
}

function toggleDetails(groupKey) {
  openDetails.value[groupKey] = !openDetails.value[groupKey];
}

const groupedCart = computed(() => {
  const groups = {};

  cart.value.forEach((item) => {
    const key = item.model;
    if (!groups[key]) {
      groups[key] = {
        ...item,
        quantity: 1,
      };
    } else {
      groups[key].quantity++;
    }
  });

  return Object.values(groups);
});

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
      <div class="d-flex flex-column">
        <v-btn
          color="primary"
          @click="showCart = true"
          class="align-self-end mr-16 mb-8"
          >Voir le panier ({{ cart.length }})</v-btn
        >
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
      </div>
    </main>
    <v-dialog v-model="bookingDialog" max-width="600">
      <v-card title="Réserver un vélo">
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div><strong>Marque :</strong> {{ bicycleSelected.brand }}</div>
              <div><strong>Modèle :</strong> {{ bicycleSelected.model }}</div>
              <div>
                <strong>Type :</strong> {{ bicycleSelected.bicycle_type }}
              </div>
              <div>
                <strong>Assistance électrique :</strong>
                {{ bicycleSelected.electric_assistance ? "Oui" : "Non" }}
              </div>
              <div>
                <strong>Prix (par jour) :</strong>
                {{ bicycleSelected.price_per_day }}€
              </div>
              <div>
                <strong>Cycle de révision :</strong>
                {{ bicycleSelected.revision_cycle }} km
              </div>
            </v-col>
            <v-col cols="6">
              <v-img :src="bicycleSelected.image" height="200" contain></v-img>
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
    <v-dialog v-model="showCart" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-between align-center">
          <span>Panier</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <div v-if="cart.length === 0">Le panier est vide.</div>

          <v-list v-else>
            <v-list-item
              v-for="(group, index) in groupedCart"
              :key="index"
              class="d-flex align-center"
            >
              <div
                class="d-flex align-center justify-between"
                style="width: 100%; gap: 16px"
              >
                <v-img
                  :src="group.image"
                  alt="Vélo"
                  width="120"
                  height="80"
                  cover
                />

                <div class="d-flex flex-column justify-center flex-grow-1">
                  <div>
                    <strong
                      >{{ group.bicycle_type }} {{ group.brand }}
                      {{ group.model }}</strong
                    >
                    <span v-if="group.quantity > 1">x{{ group.quantity }}</span>
                  </div>
                  <div>
                    {{
                      group.electric_assistance
                        ? "Avec assistance électrique"
                        : ""
                    }}
                  </div>
                  <div>{{ group.price_per_day }}€/jour</div>

                  <!-- Détails des vélos identiques -->
                  <div class="mt-2">
                    <v-btn
                      size="x-small"
                      variant="text"
                      @click="toggleDetails(index)"
                    >
                      <v-icon
                        start
                        :icon="
                          openDetails[index]
                            ? 'mdi-chevron-up'
                            : 'mdi-chevron-down'
                        "
                      />
                      {{
                        openDetails[index]
                          ? "Masquer les détails"
                          : "Voir les détails"
                      }}
                    </v-btn>

                    <v-expand-transition>
                      <div v-show="openDetails[index]" class="mt-2 pl-4">
                        <ul style="list-style: none; padding: 0; margin: 0">
                          <li
                            v-for="(bicycle, index) in cart.filter(
                              (item) =>
                                item.model === group.model &&
                                item.brand === group.brand,
                            )"
                            :key="index"
                            class="mb-1 text-caption"
                          >
                            <span>
                              • {{ bicycle.counter_km }} km, dernière révision à
                              {{ bicycle.last_km_service }} km, durée de vie:
                              {{ new Date(bicycle.lifetime).getFullYear() }}
                            </span>
                            <span>
                              <v-btn
                                v-if="group.quantity > 1"
                                icon
                                variant="text"
                                @click="
                                  removeBicycleFromCart(bicycle.bicycle_id)
                                "
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </v-expand-transition>
                  </div>
                </div>

                <v-btn
                  v-if="group.quantity === 1"
                  icon
                  variant="text"
                  @click="removeBicycleFromCart(group.bicycle_id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Prix total -->
        <v-card-text class="text-right">
          <strong>Total :</strong>
          {{
            groupedCart
              .reduce(
                (total, item) => total + item.price_per_day * item.quantity,
                0,
              )
              .toFixed(2)
          }}
          €
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            variant="text"
            @click="cartStore.clearCart()"
            v-if="cart.length > 0"
          >
            Vider le panier
          </v-btn>
          <v-btn
            color="primary"
            @click="showCart = false"
            :disabled="cart.length === 0"
          >
            Réserver
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
