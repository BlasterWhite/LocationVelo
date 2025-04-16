<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import bicycleCard from "../components/BicycleCard.vue";


const route = useRoute();
route.query.startDate = route.query.startDate
  ? new Date(route.query.startDate)
  : null;


const bicycleCards = [
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Vs5jCqhcsLhKw82wCe1t5kldS1Gq4DlKaQ&s",
    title: "VTC AE",
    quantity: 1,
    brand: "ADVANCED",
    model: "TREKKING PRO WAVE",
    power: 70,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Vs5jCqhcsLhKw82wCe1t5kldS1Gq4DlKaQ&s",
    title: "VTC AE",
    quantity: 1,
    brand: "ADVANCED",
    model: "TREKKING PRO WAVE",
    power: 70,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Vs5jCqhcsLhKw82wCe1t5kldS1Gq4DlKaQ&s",
    title: "VTC AE",
    quantity: 1,
    brand: "ADVANCED",
    model: "TREKKING PRO WAVE",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Vs5jCqhcsLhKw82wCe1t5kldS1Gq4DlKaQ&s",
    title: "VTC AE",
    quantity: 1,
    brand: "ADVANCED",
    model: "TREKKING PRO WAVE",
    power: 70,
  }
  ,
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Vs5jCqhcsLhKw82wCe1t5kldS1Gq4DlKaQ&s",
    title: "VTC AE",
    quantity: 1,
    brand: "ADVANCED",
    model: "TREKKING PRO WAVE",
    power: 70,
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Vs5jCqhcsLhKw82wCe1t5kldS1Gq4DlKaQ&s",
    title: "VTC AE",
    quantity: 1,
    brand: "ADVANCED",
    model: "TREKKING PRO WAVE",
    power: 70,
  },
];

const startDate = ref(
  route.query.startDate ? new Date(route.query.startDate) : null,
);
const endDate = ref(route.query.endDate ? new Date(route.query.endDate) : null);
</script>

<template>
  <div class="catalog-view">
    <p>
      Start Date:
      {{ startDate ? startDate.toLocaleDateString() : "Not selected" }} <br />
      End Date: {{ endDate ? endDate.toLocaleDateString() : "Not selected" }}
    </p>
    <div class="bicycle-cards">
      <bicycle-card
        v-for="(bicycleCard, index) in bicycleCards"
        :key="index"
        :image="bicycleCard.image"
        :title="bicycleCard.title"
        :quantity="bicycleCard.quantity"
        :brand="bicycleCard.brand"
        :model="bicycleCard.model"
        :power="bicycleCard.power"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .bicycle-cards {
    padding: 16px 0;
    width: 75%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 32px;
    height: 80vh;
    overflow-y: auto;
  }
</style>