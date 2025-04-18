# API

```
EasyRent-API/
│
├── src/
│   ├── controllers/       # Interface d’entrée, gère les requêtes et les réponses HTTP
│   ├── routes/            # Définition des endpoints de l'API
│   ├── services/          # Logique métier (cas d’usage)
│   ├── models/            # Représentation des données (DTO ou ORM)
│   ├── middleware/        # Middleware personnalisés (authentification, erreurs, etc.)
│   ├── utils/             # Fonctions utilitaires
│   └── app.js             # Configuration de l’application Express
│
├── config/                # Fichiers de configuration (connexion BDD, .env, etc.)
├── .env                   # Variables d’environnement
├── package.json
└── server.js              # Point d’entrée du serveur

```
