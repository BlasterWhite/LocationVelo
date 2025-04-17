import { defineStore } from "pinia";
import { useFetch } from "@/composables/useFetch";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    isCartOpen: false,
    startDate: null,
    endDate: null,
  }),
  actions: {
    setDates({ start, end }) {
      this.startDate = start;
      this.endDate = end;
    },

    addItem(bicycle) {
      if (!this.startDate || !this.endDate) {
        throw new Error("Veuillez sélectionner des dates de location");
      }

      console.log(JSON.stringify(bicycle));
      console.log(JSON.stringify(this.startDate));

      const existing = this.items.find(
        (item) => item.id === bicycle.bicycle_id,
      );
      existing
        ? existing.quantity++
        : this.items.push({ ...bicycle, quantity: 1 });
    },
    removeItem(index) {
      this.items.splice(index, 1);
    },
    clearCart() {
      this.items = [];
    },
    async checkout() {
      const payload = {
        items: this.items,
        total: this.totalPrice,
      };

      try {
        await useFetch().fetchData("/checkout", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        this.clearCart();
      } catch (error) {
        console.error("Checkout failed:", error);
      }
    },
  },
  getters: {
    rentalDays: (state) => {
      if (!state.startDate || !state.endDate) return 0;
      const diff = new Date(state.endDate) - new Date(state.startDate);
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    },

    totalPrice: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.pricePerKm * state.rentalDays * item.quantity,
        0,
      ),

    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    isEmpty: (state) => state.items.length === 0,
    isOpen: (state) => state.isCartOpen,
  },
});
