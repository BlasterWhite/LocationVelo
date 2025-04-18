<script setup></script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <!-- Section À propos -->
      <div class="footer-section">
        <h3>À propos</h3>
        <p>
          Nous sommes une entreprise de location de vélos qui propose différents
          modèles et marques pour tous les âges.
        </p>
      </div>

      <!-- Section Liens rapides -->
      <div class="footer-section">
        <h3>Liens rapides</h3>
        <ul>
          <!-- Remplacez les <router-link> si vous utilisez Vue Router -->
          <li><a href="#">Accueil</a></li>
          <li><a href="#">Catalogue</a></li>
        </ul>
      </div>

      <!-- Section Contact -->
      <div class="footer-section">
        <h3>Contact</h3>
        <address>
          8 rue de Kerampont <br />
          CS 83718 <br />
          22300 LANNION CEDEX <br />
          FRANCE <br /><br />
          +33 (0)2 96 12 64 56
        </address>
      </div>

      <!-- Section Suivez-nous -->
      <div class="footer-section">
        <h3>Suivez-nous sur</h3>
        <div class="social-icons">
          <!-- Remplacez les liens # par vos véritables URLs de réseaux sociaux -->
          <a href="#" aria-label="X (Twitter)">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
/* ----- Container principal du footer ----- */
.app-footer {
  background-color: #2e7d32; /* Couleur verte, ajustez si nécessaire */
  color: #ffffff;
  padding: 2rem;
  font-family: sans-serif;
}

/* ----- Contenu interne du footer (organisation des sections) ----- */
.footer-content {
  display: flex;
  flex-wrap: wrap; /* Pour gérer l'affichage responsive */
  justify-content: space-between;
  max-width: 1200px; /* Largeur max si souhaité */
  margin: 0 auto; /* Centrer horizontalement */
  gap: 2rem; /* Espacement entre sections */
}

/* ----- Chaque section du footer (À propos, Liens rapides, etc.) ----- */
.footer-section {
  flex: 1 1 200px; /* Largeur minimale 200px, puis s'étire */
  min-width: 200px;
}

/* Titre de section */
.footer-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

/* Paragraphes, adresses, etc. */
.footer-section p,
.footer-section address {
  line-height: 1.4;
  margin: 0;
}

/* Listes de liens */
.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  text-decoration: none;
  color: #ffffff; /* Ou #fff */
  transition: color 0.2s ease-in-out;
}

.footer-section a:hover {
  color: #bbf7d0; /* Vert clair au survol (à ajuster) */
}

/* ----- Icônes sociales ----- */
.social-icons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.social-icons a {
  color: #ffffff;
  font-size: 1.2rem;
  transition: color 0.2s ease-in-out;
}

.social-icons a:hover {
  color: #bbf7d0; /* Vert clair au survol (à ajuster) */
}
</style>
