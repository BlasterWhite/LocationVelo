<script setup>
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
    power: {
        type: Number,
        required: false,
    },
});
</script>

<template>
    <div class="card">
        <img :src=image alt="Bicycle image">
        <h4>{{ title }}</h4>
        <h4 v-if="quantity <= 1" class="quantity">{{ quantity }} disponible</h4>
        <h4 v-if="quantity > 1" class="quantity">{{ quantity }} disponibles</h4>
        <div class="detail-list">
            <div class="detail">
                <span class="label">Marque :</span> {{ brand }}
            </div>
            <div class="detail">
                <span class="label">Modèle :</span> {{ model }}
            </div>
            <div v-if="power" class="detail">
                <span class="label">Puissance :</span> {{ power }} Wh
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
.card {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    width: 350px;
    border-radius: 16px;
    box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.25);
    gap: 10px;
    padding-top: 64px;

    img {
        width: 100%;
        height: auto;
        padding: 16px;
    }

    h4 {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
    }
    
    .quantity {
        background-color: #0B8240;
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
}
</style>
