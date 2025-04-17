<!-- components/CartIcon.vue -->
<script setup>
import { ref } from "vue";
import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/vue";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();
const reference = ref(null);
const floating = ref(null);
const isOpen = ref(false);

const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  whileElementsMounted: autoUpdate,
  placement: "bottom-end",
  middleware: [offset(10), flip(), shift()],
});
</script>

<template>
  <div class="cart-icon">
    <button ref="reference" @click="isOpen = !isOpen">
      🛒
      <span class="badge">{{ cartStore.totalItems }}</span>
    </button>

    <div
      v-if="isOpen"
      ref="floating"
      class="cart-dropdown"
      :style="floatingStyles"
    >
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        Votre panier est vide
      </div>

      <div v-else>
        <div v-if="cartStore.items.length > 0" class="rental-period">
          <h3>Période de location :</h3>
          <p>
            {{ cartStore.startDate?.toLocaleDateString() }} -
            {{ cartStore.endDate?.toLocaleDateString() }}
          </p>
          <p>({{ cartStore.rentalDays }} jours)</p>
        </div>

        <!-- Afficher les items sans dates -->
        <div v-for="(item, index) in cartStore.items" :key="index">
          <h3>{{ item.model }} (x{{ item.quantity }})</h3>
          <p>{{ item.pricePerKm }}€/jour</p>
        </div>

        <div class="cart-total">Total: {{ cartStore.totalPrice }}€</div>

        <button @click="cartStore.checkout" class="checkout-btn">
          Commander
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-icon {
  position: relative;
  cursor: pointer;
}

.badge {
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8em;
}

.cart-dropdown {
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
}

.cart-item {
  border-bottom: 1px solid #eee;
  padding: 0.5rem 0;
}

.checkout-btn {
  background: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
}
</style>
