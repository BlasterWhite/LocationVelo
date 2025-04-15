<script setup>
import { computed } from "vue";
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  note: {
    type: Number,
    required: true,
  },
  date: {
    type: [Date, String, Number],
    required: true,
    default: () => Date.now(),
  },
  description: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["click"]);
const handleClick = () => {
  emit("click");
};

const dateStringDisplay = computed(() => {
  const date = new Date(props.date);

  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>

<template>
  <div class="user-rating">
    <div class="user-rating-header">
      <h4>{{ name }}</h4>
    </div>
    <div class="user-rating-body">
      <v-icon
        :color="note >= 1 ? '#FCBF29' : '#A3A3A5'"
        icon="mdi mdi-star"
      ></v-icon>
      <v-icon
        :color="note >= 2 ? '#FCBF29' : '#A3A3A5'"
        icon="mdi mdi-star"
      ></v-icon>
      <v-icon
        :color="note >= 3 ? '#FCBF29' : '#A3A3A5'"
        icon="mdi mdi-star"
      ></v-icon>
      <v-icon
        :color="note >= 4 ? '#FCBF29' : '#A3A3A5'"
        icon="mdi mdi-star"
      ></v-icon>
      <v-icon
        :color="note >= 5 ? '#FCBF29' : '#A3A3A5'"
        icon="mdi mdi-star"
      ></v-icon>
    </div>
    <p class="date">{{ dateStringDisplay }}</p>
    <p class="user-rating-description">{{ description }}</p>
  </div>
</template>

<style scoped lang="scss">
.user-rating {
  width: 250px;
  padding: 16px;
  border-radius: 16px;
  background-color: #fff;

  h4 {
    font-size: 24px;
    font-weight: bold;
  }

  .date {
    font-size: 12px;
    text-align: right;
    color: #a3a3a5;
  }

  .user-rating-body {
    display: flex;
    gap: 4px;
    margin: 8px 0;
  }

  .user-rating-description {
    font-size: 12px;
    color: #000;
    text-align: justify;
  }
}
</style>
