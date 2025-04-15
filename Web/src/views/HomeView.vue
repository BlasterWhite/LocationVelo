<script setup>
import highlightCard from "../components/HighlightCard.vue";
import userRating from "../components/UserRating.vue";

const cards = [
  {
    icon: "mdi mdi-bike",
    title: "Large gamme de produits",
    description:
      "Nous avons une large gamme de produits pour répondre à tous vos besoins../.",
  },
  {
    icon: "mdi mdi-wrench-outline",
    title: "Maintenance régulière",
    description:
      "Nous avons une large gamme de produits pour répondre à tous vos besoins../.",
  },
  {
    icon: "mdi mdi-headset",
    title: "Assistance tous risques",
    description:
      "Nous avons une large gamme de produits pour répondre à tous vos besoins../.",
  },
];

const ratings = [
  {
    name: "John D.",
    note: 4,
    date: Date.now(),
    description:
      "Super expérience, je recommande ! On a passé un super moment avec toute la famille. Même le petit dernier a adoré ! Dommage qu'il n'y ait pas de location de trottinette électrique !",
  },
  {
    name: "Jane S.",
    note: 5,
    date: new Date("2024-04-14"),
    description:
      "Un service impeccable, merci ! J'ai réservé un vélo pour une journée et tout s'est très bien passé. Le personnel était très sympathique et serviable. Je recommande vivement, moi et Hervé avons adoré !",
  },
];
</script>

<template>
  <div class="home-view">
    <h1>Explorer la <span class="text-primary">nature</span></h1>
    <div class="dates-picker">
      <div class="date-start">
        <v-icon icon="mdi mdi-calendar-badge" size="x-large"></v-icon>
        14/04/2024
      </div>
      <div class="date-end">
        <v-icon icon="mdi mdi-calendar-badge" size="x-large"></v-icon>
        14/04/2024
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi mdi-magnify"
        @click="$router.push('/catalogue')"
        >Explorer</v-btn
      >
      <v-date-picker
        v-if="false"
        color="primary"
        show-adjacent-months
      ></v-date-picker>
    </div>
    <div class="highlights">
      <highlight-card
        v-for="(card, index) in cards"
        :key="index"
        :icon="card.icon"
        :title="card.title"
        :description="card.description"
      />
    </div>

    <div class="ratings">
      <user-rating
        v-for="(rating, index) in ratings"
        :key="index"
        :name="rating.name"
        :note="rating.note"
        :date="rating.date"
        :description="rating.description"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  background-color: #f0f0f0;
  background-image: url("./home_bg.jpg");
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .highlights {
    display: flex;
    justify-content: center;
    gap: 56px;
    width: 100%;
    margin-top: 20px;

    highlight-card {
      flex: 1;
      margin: 0 10px;
    }
  }

  .ratings {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    gap: 56px;
    max-width: 1240px;
    border-radius: 16px;
    margin-top: 20px;
    background: #fff;
  }
}
</style>
