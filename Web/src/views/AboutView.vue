<script setup></script>

<template>
  <div class="background-container">
    <h2><strong> A propos de nous</strong></h2>

    <div class="highlights">
      <p>
        EasyRent est une entreprise née en 2025 de l’initiative de trois
        passionnés de vélo, animés par une même envie : rendre le cyclisme
        accessible à tous et encourager une mobilité douce, pratique et durable.
      </p>
      <br />
      <p>
        Notre mission est simple : vous proposer des vélos de qualité à la
        location, adaptés à vos besoins, pour vos trajets quotidiens, vos
        balades du week-end ou vos aventures plus longues. Que vous soyez un
        cycliste occasionnel ou un amateur confirmé, nous mettons un point
        d’honneur à vous fournir des vélos parfaitement entretenus, confortables
        et fiables.
      </p>
      <br />
      <p>
        Rejoignez l’aventure EasyRent et pédalons ensemble vers un avenir plus
        vert !
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.background-container {
  color: #f0f0f0;
  font-size: 3em;
  background-color: #f0f0f0;
  background-image: url("./about_bg.png");
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 180px 0 80px 0;
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;

  .highlights {
    justify-content: left;
    padding: 32px 24px;
    width: 1000px;
    border-radius: 16px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition: transform 0.3s;
    font-size: 25px;
  }
}
</style>
