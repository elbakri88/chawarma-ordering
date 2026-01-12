# Commandes Utiles

## Développement

```bash
# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Démarrer en mode production
npm start
```

## Base de Données

```bash
# Appliquer le schéma à la base de données (sans migration)
npx prisma db push

# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations
npx prisma migrate deploy

# Générer le client Prisma (après modification du schema)
npx prisma generate

# Charger les données initiales (menu + admin)
npm run db:seed

# Ouvrir Prisma Studio (GUI pour voir/modifier la DB)
npm run db:studio
```

## Linting

```bash
# Vérifier le code
npm run lint
```

## Variables d'environnement

Créez un fichier `.env` avec :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chawarma?schema=public"
JWT_SECRET="votre-secret-jwt"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Accès Rapide

- **Menu client** : http://localhost:3000/r/zen-acham
- **Admin** : http://localhost:3000/admin/login
- **QR Code** : http://localhost:3000/admin/qr

## Compte Admin par défaut

- Email: `admin@zenacham.com`
- Password: `admin123`

⚠️ **Changez le mot de passe en production !**










