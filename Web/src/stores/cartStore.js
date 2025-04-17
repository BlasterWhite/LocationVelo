import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
  }),
  actions: {
    addToCart(bicycle) {
      const exists = this.cart.find((item) => item.bicycle_id === bicycle.bicycle_id)
      if (!exists) {
        this.cart.push(bicycle)
      }
    },
    removeFromCart(id) {
      this.cart = this.cart.filter((item) => item.bicycle_id !== bicycle_id)
    },
    clearCart() {
      this.cart = []
    },
  },
})
