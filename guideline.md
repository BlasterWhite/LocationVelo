# LocationVelo

## 🧠 **Code Quality Guidelines – Vue.js + Node.js + PostgreSQL**

### 📁 Structure du Projet

**Frontend (Vue.js)** :

```
/src
  /components       -> Composants Vue réutilisables
  /views            -> Pages principales
  /assets           -> Fichiers statiques
  /store            -> (Pinia) pour gestion d'état
  /router           -> Configuration des routes
```

**Backend (Node.js + Express)** :

```
/src
  /controllers      -> Logique métier
  /routes           -> Définition des endpoints
  /models           -> Requêtes SQL
  /middlewares      -> Middlewares Express (auth, validation, etc.)
  /utils            -> Fonctions utilitaires
  /config           -> Configuration (env, db, etc.)
```

---

## 🔤 **Conventions de nommage**

### ✅ Variables, Fonctions, Constantes

- **camelCase** pour les variables, fonctions et paramètres  
  ➤ `const userList = []`  
  ➤ `function fetchUserById(id) {}`

- **UPPER_CASE_SNAKE** pour les constantes globales  
  ➤ `const MAX_RETRIES = 5;`

- **Pas de noms en français** : toutes les variables/fonctions doivent être **en anglais**

---

## 📦 **Composants Vue.js**

- **Nom des fichiers** : `PascalCase.vue` (ex: `UserProfile.vue`)
- **Nom des composants** : également en PascalCase

  ```vue
  <template>
    <UserCard :user="user" />
  </template>
  ```

- **Props** : camelCase côté JS / kebab-case dans le template HTML

  ```vue
  props: { userId: Number }
  <!-- usage -->
  <UserCard user-id="123" />
  ```

- **Dossier par composant si nécessaire** :
  ```
  /UserCard
    ├─ index.vue
    ├─ UserCard.scss
  ```

---

## 📑 **Commentaires & Documentation**

### 🧾 JSDoc obligatoire :

Exemple :

```js
/**
 * Fetch a user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} user data
 */
async function fetchUserById(id) { ... }
```

---

## 🧼 **Bonnes pratiques générales**

- **1 fonction = 1 responsabilité**
- Limitez les fonctions à ~50 lignes
- Utilisez **async/await**, évitez les callbacks imbriqués
- **Sanitisez les entrées** utilisateur (surtout côté Node.js)

---

## 🛠️ **Outils recommandés**

### 🔍 Lint & Format

- **ESLint** avec un preset comme Airbnb ou StandardJS
- **Prettier** pour formatage automatique (intégré dans votre IDE)

### 🌐 API

- Utiliser **Express**
- Ajoutez une **validation des requêtes** via `zod` ou `express-validator`
- Documenter les endpoints avec **Swagger** ou **Redoc**

---

## 🗃️ **Base de données PostgreSQL**

- Les noms de tables : **snake_case**
- Les champs : **snake_case**
- Relations claires avec foreign keys et index

---

## 🛡️ Sécurité

- **.env** pour variables sensibles
- Ne jamais **commiter des secrets**
- Utiliser `cors` et limiter le rate API
- Hasher les mots de passe (`bcrypt`)
