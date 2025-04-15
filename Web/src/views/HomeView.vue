<script setup>
import { ref, computed, watch } from "vue";
import highlightCard from "../components/HighlightCard.vue";
import userRating from "../components/UserRating.vue";
import { useFloating } from "@floating-ui/vue";
import { useRouter } from "vue-router";

const router = useRouter();

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
  {
    name: "Alice B.",
    note: 3,
    date: new Date("2024-04-12"),
    description:
      "Pas mal, mais peut mieux faire. Le vélo était en bon état, mais j'ai eu quelques problèmes avec la réservation en ligne. Sinon, le personnel était sympa et serviable.",
  },
];

const dateStart = ref(new Date());
const dateEnd = ref(new Date());
dateEnd.value.setDate(dateEnd.value.getDate() + 1);

const dateStartFormatted = computed(() => {
  return dateStart.value.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
});

const dateEndFormatted = computed(() => {
  return dateEnd.value.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
});

// Date start picker floating
const dateStartTrigger = ref(null);
const dateStartPicker = ref(null);
const showDateStartPicker = ref(false);

const { floatingStyles: dateStartPickerStyles } = useFloating(
  dateStartTrigger,
  dateStartPicker,
  {
    placement: "bottom-center",
  },
);

function toggleDateStartPicker() {
  showDateEndPicker.value = false;
  showDateStartPicker.value = !showDateStartPicker.value;
}

watch(dateStart, (newValue) => {
  if (newValue > dateEnd.value) {
    // Set dateEnd to the next day of dateStart
    dateEnd.value = new Date(newValue);
    dateEnd.value.setDate(dateEnd.value.getDate() + 1);
  }
  showDateStartPicker.value = false;
});
// Date end picker floating
const dateEndTrigger = ref(null);
const dateEndPicker = ref(null);
const showDateEndPicker = ref(false);
const { floatingStyles: dateEndPickerStyles } = useFloating(
  dateEndTrigger,
  dateEndPicker,
  {
    placement: "bottom-center",
  },
);
function toggleDateEndPicker() {
  showDateStartPicker.value = false;
  showDateEndPicker.value = !showDateEndPicker.value;
}
watch(dateEnd, (newValue) => {
  if (newValue < dateStart.value) {
    // Set dateStart to the previous day of dateEnd
    dateStart.value = new Date(newValue);
    dateStart.value.setDate(dateStart.value.getDate() - 1);
  }
  showDateEndPicker.value = false;
});

function navigateToSearch() {
  const query = {};
  if (dateStart.value) {
    query.startDate = dateStart.value.toISOString();
  }
  if (dateEnd.value) {
    query.endDate = dateEnd.value.toISOString();
  }
  router.push({
    name: "catalog",
    query,
  });
}
</script>

<template>
  <div class="home-view">
    <h1>Explorer la <span class="text-primary">nature</span></h1>
    <div class="dates-picker">
      <div
        class="date-start"
        ref="dateStartTrigger"
        @click="toggleDateStartPicker"
      >
        <v-icon icon="mdi mdi-calendar-badge" size="x-large"></v-icon>
        {{ dateStartFormatted }}
      </div>
      <div class="date-end" ref="dateEndTrigger" @click="toggleDateEndPicker">
        <v-icon icon="mdi mdi-calendar-badge" size="x-large"></v-icon>
        {{ dateEndFormatted }}
      </div>
      <div class="search-action" @click="navigateToSearch">
        <v-icon icon="mdi mdi-magnify" size="x-large"></v-icon>
        Rechercher
      </div>
    </div>

    <div
      v-if="showDateStartPicker"
      ref="dateStartPicker"
      :style="dateStartPickerStyles"
      style="background: transparent; z-index: 1000"
    >
      <v-date-picker
        v-model="dateStart"
        :min="new Date()"
        color="primary"
        show-adjacent-months
      ></v-date-picker>
    </div>
    <div
      v-if="showDateEndPicker"
      ref="dateEndPicker"
      :style="dateEndPickerStyles"
      style="background: transparent; z-index: 1000"
    >
      <v-date-picker
        v-model="dateEnd"
        :min="new Date()"
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
  padding: 180px 0 80px 0;
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  text-align: center;

  h1 {
    font-size: 96px;
    color: #fff;
    font-weight: 700;
    span {
      font-weight: 700;
      color: rgb(var(--v-theme-primary));
    }
  }

  .dates-picker {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    overflow: hidden;

    .date-start,
    .date-end {
      user-select: none;
      cursor: pointer;
      background-color: #fff;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      color: #333;
    }

    .date-start {
      border-right: 1px solid #ce787823;
    }

    .search-action {
      background-color: rgb(var(--v-theme-primary));
      color: #fff;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }

  .date-start {
    position: relative;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f5f5f5;
    }
  }

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
