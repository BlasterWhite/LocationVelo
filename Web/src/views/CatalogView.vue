<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
route.query.startDate = route.query.startDate
  ? new Date(route.query.startDate)
  : null;

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
  </div>
</template>
