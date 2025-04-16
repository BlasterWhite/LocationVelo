<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import { ref, computed } from "vue";
import { useFloating, arrow } from "@floating-ui/vue";

const authStore = useAuthStore();
const { token, isAuthenticated, user } = storeToRefs(authStore);

// Tooltip logic
const reference = ref(null);
const floating = ref(null);
const arrowRef = ref(null);
const showTooltip = ref(false);

const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  placement: "bottom",
  middleware: [
    arrow({ element: arrowRef }),
    // Optional offset if needed
    // offset(10)
  ],
});

const arrowStyles = computed(() => ({
  position: "absolute",
  left:
    middlewareData.value.arrow?.x != null
      ? `${middlewareData.value.arrow.x}px`
      : "",
  top:
    middlewareData.value.arrow?.y != null
      ? `${middlewareData.value.arrow.y}px`
      : "",
  background: "inherit",
}));

function toggleTooltip() {
  showTooltip.value = !showTooltip.value;
}

function logout() {
  authStore.logout();
}
</script>

<template>
  <h1>Hello</h1>
  <v-btn append-icon="$vuetify"> Button </v-btn>
  <div v-if="isAuthenticated">
    <p>Token: {{ token }}</p>
    <p>Authenticated: {{ isAuthenticated }}</p>
    <p>User: {{ JSON.stringify(user) }}</p>
    <v-btn @click="logout">Logout</v-btn>
  </div>
  <div v-else>
    <p>You are not authenticated.</p>
    <router-link to="/login">
      <v-btn>Login</v-btn>
    </router-link>
    <router-link to="/register">
      <v-btn>Register</v-btn>
    </router-link>
  </div>

  <!-- Tooltip trigger button -->
  <button ref="reference" @click="toggleTooltip">Button</button>

  <!-- Tooltip -->
  <div
    v-if="showTooltip"
    ref="floating"
    :style="floatingStyles"
    style="
      background: #000;
      color: white;
      padding: 8px;
      border-radius: 4px;
      position: absolute;
      font-size: 14px;
    "
  >
    Tooltip content
    <div
      ref="arrowRef"
      :style="arrowStyles"
      style="
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
        clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
      "
    ></div>
  </div>
</template>
