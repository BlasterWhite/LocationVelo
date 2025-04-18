# README - Guide d'Utilisation

Ce guide explique comment lancer la base de données et exécuter l'application en mode développement ou production.

---

## Prérequis

- **Docker** : Installé sur votre machine. [Guide d'installation Docker](https://docs.docker.com/get-docker/)
- **Node.js** (v18+) et **npm** : Pour exécuter l'application. [Télécharger Node.js](https://nodejs.org/)
- **Postgresql** pour la base de données [Télécharger Postgresql](https://www.postgresql.org/download/)

---

## Installation

1. **Cloner le dépôt** :

```bash
git clone https://github.com/BlasterWhite/LocationVelo.git
cd LocationVelo
```

2. **Installer les dépendances**:

```bash
# Frontend (Web)
cd Web
npm install

# Backend (API)
cd ../Api
npm install

# Retour à la racine
cd ..
```

---

## Utilisation

1. **Configuration de l'environnement**

   - Créez vos fichiers `.env` en copiant les modèles :

   ```bash
   cp Web/.env.example Web/.env
   cp Api/.env.example Api/.env
   ```

   - Adaptez les variables dans chaque fichier `.env` selon vos besoins

2. **Lancement de la Base de Données (via Docker)**

```bash
docker compose up -d
```

**Vérification** :

```bash
docker ps
```

3. **Lancement en Mode Développement**

Frontend (Web) :

```bash
cd Web
npm run dev
```

Backend (API) :

```bash
cd ../Api
npm run dev
```

L'application sera accessible sur http://localhost:5173.

4. **Lancement en Mode Production**

Frontend :

```bash
cd Web
npm run dev
```

Backend :

```bash
cd ../Api
npm run start
```

5. **Tests API avec Postman**

   - Un jeu de test complet est disponible dans le dossier Postman à la racine du projet

   - Importez la collection dans Postman :

     1. Ouvrez Postman

     2. Cliquez sur "Import" > "File"

     3. Sélectionnez un fichier

   - Les tests couvrent les principales fonctionnalités de l'API

---

## Remarques

- **Fichiers d'environnement** :

  - Les fichiers `.env` doivent être créés dans les dossiers Web et API
  - Utilisez les fichiers `.env.example` comme modèle pour chaque service

- **Ports utilisés** :

  - Frontend : 5173 (dev) / 4173 (build preview)
  - Backend : 3000 par défaut
  - Base de données : 5432

- **Dépendances** :

  - Les dépendances doivent être installées séparément dans chaque dossier (Web et API)

- **Collection Postman** :

  - Les requêtes utilisent les variables d'environnement de l'API
  - Adaptez les valeurs de test selon votre configuration
  - Les exemples incluent des données de test prédéfinies
