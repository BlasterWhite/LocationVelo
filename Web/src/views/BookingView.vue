<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import { ref, computed } from "vue";
import { useFetch } from "@/composables/useFetch";

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const { fetchData } = useFetch();

const dialog = ref(false);
const rating = ref(0);
const comment = ref("");
const selectedRental = ref(null);

async function getBooking() {
  const booking = await useFetch().fetchData("/rentals/account");
  return booking;
}

const booking = ref([]);
getBooking()
  .then((response) => {
    booking.value = response;
  })
  .catch((error) => {
    console.error("Error fetching booking data:", error);
  });

const statusColors = {
  Payé: "success",
  "Non payé": "error",
  "En cours": "warning",
  Terminé: "info",
  Annulé: "error",
};

const headers = [
  {
    title: "Date de début",
    key: "start_date",
    align: "center",
  },
  {
    title: "Date de fin",
    key: "end_date",
    align: "center",
  },
  {
    title: "Nombre de vélos",
    key: "bicycles",
    align: "center",
  },
  {
    title: "Status de paiement",
    key: "payment_status",
    align: "center",
  },
  {
    title: "Statut de réservation",
    key: "rental_status",
    align: "center",
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
  },
];

const submitReview = async () => {

  if (rating.value === 0) {
    return;
  }

  const payload = {
    rate: rating.value,
    description: comment.value,
    rental_id: selectedRental.value.rental_id,
    date_review: reviewDate.value,
  };

  try {
    if (!!reviewId.value) {
      await fetchData(`/reviews/${reviewId.value}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await fetchData("/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    dialog.value = false;
    booking.value = await getBooking();
  } catch (error) {
    console.error("Erreur lors de l'envoi:", error);
  }
};

const reviewDate = ref(new Date().toISOString().split("T")[0]);
const reviewId = ref(null);
const openReviewModal = (item) => {
  selectedRental.value = item;
  rating.value = item.review[0].rate || 0;
  comment.value = item.review[0].description || "";
  reviewId.value = item.review[0].review_id || null;
  dialog.value = true;
};
</script>

<template>
  <div class="booking-view">
    <h1>Mes réservations</h1>
    <div v-if="isAuthenticated">
      <v-data-table :headers="headers" :items="booking">
        <template v-slot:item.end_date="{ value }">
          {{ new Date(value).toLocaleDateString("fr-FR") }}
        </template>

        <template v-slot:item.start_date="{ value }">
          {{ new Date(value).toLocaleDateString("fr-FR") }}
        </template>

        <template v-slot:item.bicycles="{ item }">
          {{ item.bicycles.length }} vélo(s)
          <v-list>
            <v-list-item-group>
              <v-list-item
                v-for="(bicycle, index) in item.bicycles"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title>* {{ bicycle.model }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </template>

        <template v-slot:item.payment_status="{ item }">
          <v-chip :color="statusColors[item.payment_status]" dark>
            {{ item.payment_status }}
          </v-chip>
        </template>

        <template v-slot:item.rental_status="{ item }">
          <v-chip :color="statusColors[item.rental_status]" dark>
            {{ item.rental_status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="
              item.payment_status === 'Payé' && item.rental_status === 'Terminé'
            "
            color="primary"
            small
            @click="openReviewModal(item)"
          >
            Noter la location
          </v-btn>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title class="headline">
            Donnez votre avis sur la location #{{ selectedRental?.rental_id }}
          </v-card-title>

          <v-card-text>
            <div class="text-center mb-4">
              <div class="text-h6">Notez votre expérience</div>
              <div class="d-flex justify-center my-4">
                <v-btn
                  v-for="n in 5"
                  :key="n"
                  icon
                  flat
                  @mouseover="rating = n"
                  @mouseleave="rating = rating"
                  @click="rating = n"
                >
                  <v-icon :color="n <= rating ? 'amber' : 'grey'">
                    {{ n <= rating ? "mdi-star" : "mdi-star-outline" }}
                  </v-icon>
                </v-btn>
              </div>

              <v-textarea
                v-model="comment"
                label="Commentaire (facultatif)"
                outlined
                rows="3"
              ></v-textarea>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="dialog = false"> Annuler </v-btn>
            <v-btn color="primary" @click="submitReview"> Envoyer </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
.booking-view {
  padding: 120px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>
