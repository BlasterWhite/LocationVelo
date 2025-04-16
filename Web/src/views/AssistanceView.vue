<script setup>

</script>

<template>
    <div class="assistance-view"> 
        <div class="left_side">
        </div>

        <div class="right_side">
            <h1> <v-icon icon="mdi mdi-headset" size="large"></v-icon><strong> Assistance </strong></h1>
            <br>
            <p>Vous avez besoin d'aide ? Contactez nous !</p>
            <p>+33 (0)2 96 12 64 56 </p>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.assistance-view {
  display: flex;
  height: 100vh;
}
.left_side,
.right_side {
  flex: 1;
  padding: 7rem;
  overflow: auto;
}

.left_side {
  background-image: url("./assistance_bg.png");
  background-size: cover;
  background-color: #f0f0f0;
}

.right_side {

  background-color: #f0f0f0;
}
</style>

