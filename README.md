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
cd ../API
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
   cp API/.env.example API/.env
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
cd ../API
npm run dev
```

L'application sera accessible sur http://localhost:5173.

4. **Lancement en Mode Production**

Frontend :
```bash
cd Web
npm run start
```

Backend :
```bash
cd ../API
npm run start
```

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
