<script setup>
import { useCartStore } from "@/stores/cartStore";
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  pricePerKm: {
    type: Number,
    required: false,
  },
  power: {
    type: Boolean,
    required: false,
  },
  startDate: Date,
  endDate: Date,
});

const cartStore = useCartStore();

const addToCart = () => {
  try {
    cartStore.addItem(props);
  } catch (error) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="card">
    <img :src="image" alt="Bicycle image" />
    <h4>{{ title }}</h4>
    <h4 v-if="quantity <= 1" class="quantity">{{ quantity }} disponible</h4>
    <h4 v-if="quantity > 1" class="quantity">{{ quantity }} disponibles</h4>
    <div class="detail-list">
      <div class="detail"><span class="label">Marque :</span> {{ brand }}</div>
      <div class="detail"><span class="label">Modèle :</span> {{ model }}</div>
      <div class="detail">
        <span class="label">Prix par journée :</span> {{ pricePerKm }}€
      </div>
      <div v-if="power" class="detail">
        <span class="label">Assistance électrique :</span> Oui
      </div>
      <button @click="addToCart">Ajouter au panier</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 555px;
  border-radius: 16px;
  box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.25);
  gap: 10px;
  padding-top: 64px;
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 250px;
    border-radius: 16px 16px 0 0;
    object-fit: cover;
    padding: 16px;
  }

  h4 {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }

  .quantity {
    background-color: #0b8240;
    color: #fff;
    text-align: center;
    width: 50%;
    align-self: flex-end;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  .detail-list {
    padding: 16px;
  }

  .label {
    font-size: 16px;
    font-weight: 600;
  }

  &:hover {
    scale: 1.05;
  }
}
</style>
