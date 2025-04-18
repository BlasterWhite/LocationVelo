# README - Guide d'Utilisation

Ce guide explique comment lancer la base de données et exécuter l'application en mode développement ou production.

---

## Prérequis

- **Docker** : Installé sur votre machine. [Guide d'installation Docker](https://docs.docker.com/get-docker/)
- **Node.js** (v18+) et **npm** : Pour exécuter l'application. [Télécharger Node.js](https://nodejs.org/)

---

## Installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/BlasterWhite/LocationVelo.git
   cd LocationVelo
   ```

2. **Installer les dépendances**:
```bash
npm install
```

## Utilisation

1. **Lancement de la Base de Données (via Docker)**

Exécutez la commande suivante pour démarrer la base de données en arrière-plan :

```bash
docker compose up -d
```

## Vérification :
Assurez-vous que les conteneurs Docker sont actifs avec :

```bash
docker ps
```

2. **Lancement en Mode Développement**

Utilisez cette commande pour démarrer l'application avec un rechargement automatique :
```bash
npm run dev
```

L'application sera accessible sur http://localhost:5173.

3. **Lancement en Mode Production**

Pour une utilisation en production, exécutez :
```bash
npm run start
```

## Remarque :

Fichier d'environnement :
Créez un fichier .env à la racine du projet pour configurer les variables d'environnement (ex: DB_USER, PORT, etc).

Ports utilisés :
Vérifiez que les ports utilisés par l'application et la base de données ne sont pas bloqués.