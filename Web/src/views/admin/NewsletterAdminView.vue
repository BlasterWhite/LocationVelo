<template>
  <div class="newsletter-view">
    <h2>Envoi de newsletter</h2>
    <v-textarea
      v-model="newsletterContent"
      label="Contenu de la newsletter"
      rows="10"
      outlined
      auto-grow
      clearable
    ></v-textarea>
    <v-btn @click="sendNewsletter" color="primary">Envoyer</v-btn>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useFetch } from "@/composables/useFetch";

const newsletterContent = ref("");
const { fetchData } = useFetch();

const sendNewsletter = async () => {
  try {
    const response = await fetchData("/newsletter", {
      method: "POST",
      body: JSON.stringify({ content: newsletterContent.value }),
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
};
</script>

<style scoped lang="scss">
.lifetime-input {
  cursor: pointer;
  .v-input__control {
    pointer-events: none;
  }
}
</style>
