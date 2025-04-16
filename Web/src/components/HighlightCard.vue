<script setup>
const props = defineProps({
  icon: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});
const emit = defineEmits(["click"]);
const handleClick = () => {
  emit("click");
};
</script>

<template>
  <div class="highlight-card" @click="handleClick">
    <v-icon v-if="icon" :icon="icon" size="x-large"></v-icon>
    <h4 v-if="title">{{ title }}</h4>
    <p v-if="description">{{ description }}</p>
  </div>
</template>

<style scoped lang="scss">
.highlight-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  width: 250px;
  border-radius: 16px;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }

  h4 {
    margin-top: 10px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }

  p {
    margin-top: 5px;
    font-size: 16px;
    text-align: center;
  }
}
</style>
