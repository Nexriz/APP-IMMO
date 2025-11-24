## Présentation

Projet d'application Web de gestion d'annonces immobilières utilisant Typescript. L'application est un site Web de gestion d'annonces immobilières intégrant :
- un backend géré par Next.js (App Router)
- un modèle de données géré par Prisma connecté à une base SQL
- une authentification complète via NextAuth (email / mot de passe)
- une interface utilisateur dynamique et réactive

Sur ce site, il sera possible de publier, consulter ou gérer des annonces selon les rôles utilisateurs : 
- **Visiteur (non connecté)**
  - Peut consulter les annonces publiées.
  - Ne peut pas poser de question ni créer d’annonce.
- **Utilisateur connecté (client)**
  - Peut poser des questions sur une annonce.
  - Peut enregistrer des annonces comme “favoris”.
- **Agent immobilier**
  - Peut créer, modifier ou supprimer ses annonces.
  - Peut répondre aux questions posées par les utilisateurs.
  - Peut choisir de publier ou dépublier une annonce.
- **Admin**
   - Possiblité de modifier les rôles des utilisateurs
   - Vois tout les annonces publier sur le site
   - Peut supprimer n'importe quel annonce
   - Accès à tout sur le site

# Fonctionnalités
- **Authentification :** Connexion via NextAuth (Email/Password)
- **Gestion de rôles :** User, Agent, Admin
- **CRUD Annonces :** Création, Lecture, Modification, Suppression
- **Gallerie Photos :** Upload plusieurs images, affichage en gallerie, drag and drop
- **Question/Réponse :** Système de Question/Réponse sur une annonce
- **Notification :** Système de notification lors d'une réponse d'un agent sur une annonce
- **Road Protection :**  middleware (certaine pages ne sont pas accessible selon le rôle)

  #Installation

  Après avoir cloner le projet il va vous falloir installez les dépendances du projet pour cela taper la commande suivante dans le dossier à la racine du projet :
  
  ```npm install```

  Après avoir installer les dépendances, configurer vos variables d'environement dans un .env. 3 variables sont nécessaire afin de faire fonctionner le projet :
  - DATABASE_URL="url database" (Connexion Base de données)
  - AUTH_SECRET="secret" (générer par openssl rand -base64 32)
 

  Ensuite configurer les tables pour la base de données via Prisma en lancant une migration comme ceci :
  ``` npx prisma migrate dev --name init```

  Après ceci vous avez enfin terminé, il suffit de lancer la commande pour lancer le serveur :
    ``` npm run dev```

# Structure

```
.
├── src // Dossier contenant les sources
│   ├── app // Dossier contenant les pages et routes
│   |   ├── api  //Dossier contenant toutes les API pour les pages
│   |   ├── annonces
│   │       ├── page.tsx            → Liste des annonces
│   │       ├── [id]/page.tsx       → Détail d’une annonce
│   │       ├── new/page.tsx        → Création d’une annonce (agents)
│   │       └── edit/[id]/page.tsx  → Modification d’une annonce
│   ├── login/page.tsx          → Connexion
│   ├── register/page.tsx       → Inscription
│   └── layout.tsx, page.tsx    → Structure globale du site
│   ├── prisma // Dossier contenant le schéma de la base de données
|       └── schema.prisma           → Modèle de données
│   |
|   ├── __tests__ // Dossier contenant les tests
│   │ 
│   ├── components // Dossier contenant les composants de l'interface (header, AnnonceForm, ImageGallery, etc...)
│   │  
|   ├── actions // Dossier contenant la logique backend
│   │
|   ├── lib // Dossier contenant la logique pour s'authentifier et pour prisma
│   |    └── prisma.ts               → Initialisation du client Prisma
|   |
|   ├── public // Dossier contenant les images de tests
|   │
|   └── scripts // Dossier contenant le script d'insertion dans la base données
│ 
├── public // Dossier stockant les images upload
└── node_modules // Dossier contenant les dépendances
```

# Script 

Pour pouvoir lancer le script, utiliser la commande : 
``` npm run seed```

Cela lancera le script qui insèrera des utilisateurs et des annonces immobilières dans la base de données ( votre base de données doit être lancer pour que cela fonctionne). 

N'oubliez pas de lancer la base données après avoir fait la migration avec ```npx prisma studio``` et vous devez être dans le dossier src/ avant de lancer la commande.

# Tests

Pour pouvoir lancer les tests, utiliser la commande : 
``` npm run test```

TODO
