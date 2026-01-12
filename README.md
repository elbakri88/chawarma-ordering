# Chawarma Ordering System - MVP

Application web mobile-first pour la commande en ligne d'un restaurant de chawarma. Les clients peuvent préparer leur commande avant d'arriver via un QR code ou un lien Instagram.

## 🚀 Stack Technique

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod
- **Authentication**: JWT (cookies)

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL (ou compte Supabase)
- npm ou yarn

## 🛠️ Installation

1. **Cloner et installer les dépendances**

```bash
npm install
```

2. **Configurer la base de données**

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chawarma?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Initialiser la base de données**

```bash
# Créer les tables
npx prisma db push

# Générer le client Prisma
npx prisma generate

# Charger les données initiales (menu + admin)
npm run db:seed
```

4. **Lancer l'application**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📱 Accès

### Client
- **Menu**: `http://localhost:3000/r/zen-acham`
- **QR Code**: `http://localhost:3000/admin/qr` (à imprimer)

### Admin
- **Login**: `http://localhost:3000/admin/login`
  - Email: `admin@zenacham.com`
  - Password: `admin123`
- **Dashboard**: `http://localhost:3000/admin/dashboard`

## 🗂️ Structure du Projet

```
chawarma/
├── app/
│   ├── admin/              # Panneau d'administration
│   │   ├── login/         # Page de connexion
│   │   ├── dashboard/     # Gestion des commandes
│   │   └── qr/            # Génération QR code
│   ├── api/               # Routes API
│   │   ├── orders/        # Création de commandes
│   │   ├── auth/          # Authentification admin
│   │   └── admin/         # Routes admin (protégées)
│   ├── r/[slug]/          # Menu client (par slug restaurant)
│   │   ├── MenuClient.tsx
│   │   ├── ItemModal.tsx
│   │   ├── Cart.tsx
│   │   └── order/[orderId]/ # Confirmation commande
│   └── layout.tsx
├── lib/
│   ├── prisma.ts          # Client Prisma
│   ├── utils.ts           # Utilitaires
│   └── validations.ts     # Schémas Zod
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   └── seed.ts            # Données initiales
└── package.json
```

## 🗄️ Modèle de Données

- **Restaurant**: Informations du restaurant (slug, nom, ville, devise, horaires)
- **Category**: Catégories du menu (Entrées, Grillades, etc.)
- **Item**: Articles du menu (produits)
- **Modifier**: Modificateurs (taille, sauces, suppléments, etc.)
- **ModifierOption**: Options de modificateurs (avec prix)
- **Order**: Commandes clients
- **OrderItem**: Articles d'une commande (avec prix figés)
- **OrderItemModifier**: Modificateurs sélectionnés (avec prix figés)
- **Admin**: Comptes administrateurs

## ✨ Fonctionnalités

### Client
- ✅ Parcours complet: Menu → Personnalisation → Panier → Checkout → Confirmation
- ✅ Personnalisation des articles (modificateurs, notes)
- ✅ Choix "Sur place" / "À emporter" avec créneaux horaires
- ✅ Design mobile-first avec thème restaurant (or/marron)

### Admin
- ✅ Authentification sécurisée
- ✅ Visualisation des commandes en temps réel (rafraîchissement auto)
- ✅ Changement de statut des commandes (Nouvelle → En préparation → Prête → Servie)
- ✅ Génération QR code pour accès rapide

### API
- ✅ Validation stricte avec Zod
- ✅ Gestion d'erreurs propre
- ✅ Protection des routes admin (JWT)

## 🧪 Checklist de Test Manuel

### 1. Parcours Client Complet
- [ ] Accéder à `/r/zen-acham`
- [ ] Voir toutes les catégories et articles
- [ ] Cliquer sur un article → modal s'ouvre
- [ ] Sélectionner des modificateurs (si disponibles)
- [ ] Ajouter des notes
- [ ] Modifier la quantité
- [ ] Ajouter au panier
- [ ] Voir le panier (bouton fixe en bas)
- [ ] Modifier quantité dans le panier
- [ ] Retirer un article du panier
- [ ] Remplir le formulaire (nom, téléphone)
- [ ] Choisir "Sur place" ou "À emporter"
- [ ] Si "À emporter", sélectionner une heure
- [ ] Valider la commande
- [ ] Voir la page de confirmation avec numéro de commande

### 2. QR Code
- [ ] Accéder à `/admin/qr`
- [ ] Voir le QR code généré
- [ ] Scanner le QR code avec un téléphone
- [ ] Vérifier que ça redirige vers `/r/zen-acham`

### 3. Admin - Authentification
- [ ] Accéder à `/admin/login`
- [ ] Tenter connexion avec mauvais identifiants → erreur
- [ ] Se connecter avec `admin@zenacham.com` / `admin123`
- [ ] Être redirigé vers `/admin/dashboard`

### 4. Admin - Gestion Commandes
- [ ] Voir le dashboard avec statistiques
- [ ] Voir les commandes groupées par statut
- [ ] Passer une commande "Nouvelle" → "En préparation"
- [ ] Passer une commande "En préparation" → "Prête"
- [ ] Passer une commande "Prête" → "Servie"
- [ ] Vérifier le rafraîchissement automatique (toutes les 5s)

### 5. Validation et Erreurs
- [ ] Tenter de commander avec panier vide → erreur
- [ ] Tenter de commander sans nom → erreur
- [ ] Tenter de commander sans téléphone → erreur
- [ ] Vérifier que les prix sont corrects dans le panier
- [ ] Vérifier que le total est correct

### 6. Responsive Design
- [ ] Tester sur mobile (viewport étroit)
- [ ] Tester sur tablette
- [ ] Tester sur desktop
- [ ] Vérifier que le panier fixe en bas fonctionne bien

### 7. Base de Données
- [ ] Vérifier que les commandes sont bien sauvegardées
- [ ] Vérifier que les prix sont figés au moment de la commande
- [ ] Vérifier que les modificateurs sont bien associés

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build
npm start

# Base de données
npm run db:push          # Appliquer le schéma
npm run db:migrate       # Créer une migration
npm run db:seed          # Charger les données
npm run db:studio        # Ouvrir Prisma Studio (GUI)

# Linting
npm run lint
```

## 📝 Notes

- Le mot de passe admin par défaut est `admin123` (à changer en production!)
- Le JWT_SECRET doit être changé en production
- Les images des articles ne sont pas gérées dans cette version MVP
- Les modificateurs ne sont pas encore créés dans le seed (structure prête)
- Le rafraîchissement automatique du dashboard est configuré à 5 secondes

## 🚀 Déploiement

Pour déployer en production:

1. Configurer une base PostgreSQL (Supabase, Railway, etc.)
2. Mettre à jour `DATABASE_URL` dans les variables d'environnement
3. Changer `JWT_SECRET` pour une valeur sécurisée
4. Build: `npm run build`
5. Déployer sur Vercel, Railway, ou votre plateforme préférée

## 📄 Licence

Projet privé - Tous droits réservés










