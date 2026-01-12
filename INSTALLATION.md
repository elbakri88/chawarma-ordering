# Guide d'Installation Rapide

## 1. Installation des dépendances

```bash
npm install
```

## 2. Configuration de la base de données

Créez un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chawarma?schema=public"
JWT_SECRET="changez-moi-en-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Options de base de données :**
- PostgreSQL local
- Supabase (gratuit) : https://supabase.com
- Railway (gratuit) : https://railway.app
- Neon (gratuit) : https://neon.tech

## 3. Initialisation de la base de données

```bash
# Créer les tables
npx prisma db push

# Générer le client Prisma
npx prisma generate

# Charger le menu et créer l'admin
npm run db:seed
```

## 4. Lancer l'application

```bash
npm run dev
```

## 5. Accès

- **Menu client** : http://localhost:3000/r/zen-acham
- **Admin login** : http://localhost:3000/admin/login
  - Email: `admin@zenacham.com`
  - Password: `admin123`
- **QR Code** : http://localhost:3000/admin/qr

## Dépannage

### Erreur "Prisma Client not generated"
```bash
npx prisma generate
```

### Erreur de connexion à la base de données
Vérifiez votre `DATABASE_URL` dans `.env`

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```










