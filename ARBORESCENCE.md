# Arborescence du Projet

```
chawarma/
├── .env.example                    # Template variables d'environnement
├── .gitignore                      # Fichiers ignorés par Git
├── ARBORESCENCE.md                  # Ce fichier
├── README.md                        # Documentation principale
├── next.config.js                   # Configuration Next.js
├── package.json                     # Dépendances npm
├── postcss.config.js                # Configuration PostCSS
├── tailwind.config.ts               # Configuration Tailwind CSS
├── tsconfig.json                    # Configuration TypeScript
│
├── app/                             # App Router Next.js
│   ├── admin/                       # Panneau d'administration
│   │   ├── dashboard/               # Dashboard gestion commandes
│   │   │   └── page.tsx
│   │   ├── login/                   # Page de connexion admin
│   │   │   └── page.tsx
│   │   └── qr/                      # Génération QR code
│   │       └── page.tsx
│   │
│   ├── api/                         # Routes API
│   │   ├── admin/                   # Routes admin (protégées)
│   │   │   ├── menu/
│   │   │   │   ├── categories/
│   │   │   │   │   └── route.ts     # CRUD catégories
│   │   │   │   └── items/
│   │   │   │       └── route.ts      # CRUD items
│   │   │   └── orders/
│   │   │       ├── [orderId]/
│   │   │       │   └── route.ts      # Mise à jour statut commande
│   │   │       └── route.ts          # Liste commandes
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.ts          # Authentification admin
│   │   └── orders/
│   │       └── route.ts             # Création commande client
│   │
│   ├── r/                            # Routes restaurant (client)
│   │   └── [slug]/                   # Menu par slug restaurant
│   │       ├── MenuClient.tsx        # Composant principal menu
│   │       ├── ItemModal.tsx         # Modal personnalisation article
│   │       ├── Cart.tsx              # Panier et checkout
│   │       ├── page.tsx              # Page menu (serveur)
│   │       └── order/
│   │           └── [orderId]/
│   │               └── page.tsx     # Confirmation commande
│   │
│   ├── globals.css                   # Styles globaux
│   ├── layout.tsx                    # Layout racine
│   └── page.tsx                      # Redirection vers restaurant
│
├── lib/                              # Utilitaires et helpers
│   ├── prisma.ts                     # Client Prisma singleton
│   ├── utils.ts                      # Fonctions utilitaires (cn, formatPrice)
│   └── validations.ts                # Schémas Zod
│
└── prisma/                           # Prisma ORM
    ├── schema.prisma                 # Schéma base de données
    └── seed.ts                       # Script de seed (menu + admin)
```

## Fichiers Principaux

### Frontend Client
- `app/r/[slug]/MenuClient.tsx` - Affichage menu, gestion panier
- `app/r/[slug]/ItemModal.tsx` - Modal personnalisation article
- `app/r/[slug]/Cart.tsx` - Panier et formulaire checkout
- `app/r/[slug]/order/[orderId]/page.tsx` - Page confirmation

### Backend API
- `app/api/orders/route.ts` - POST création commande
- `app/api/auth/login/route.ts` - POST authentification admin
- `app/api/admin/orders/route.ts` - GET liste commandes
- `app/api/admin/orders/[orderId]/route.ts` - PATCH mise à jour statut
- `app/api/admin/menu/categories/route.ts` - CRUD catégories
- `app/api/admin/menu/items/route.ts` - CRUD items

### Admin
- `app/admin/login/page.tsx` - Page connexion
- `app/admin/dashboard/page.tsx` - Dashboard commandes
- `app/admin/qr/page.tsx` - Génération QR code

### Base de Données
- `prisma/schema.prisma` - Modèles Prisma
- `prisma/seed.ts` - Données initiales (menu complet)

### Configuration
- `lib/validations.ts` - Schémas Zod pour validation
- `lib/prisma.ts` - Client Prisma configuré
- `lib/utils.ts` - Utilitaires (formatage prix, etc.)










