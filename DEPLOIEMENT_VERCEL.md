# 🚀 Guide de Déploiement sur Vercel avec GitHub

Ce guide vous aidera à déployer votre application de commande en ligne sur Vercel avec GitHub.

## 📋 Prérequis

1. Un compte GitHub (gratuit) : https://github.com
2. Un compte Vercel (gratuit) : https://vercel.com
3. Une base de données PostgreSQL (nous utiliserons Supabase - gratuit)

---

## Étape 1 : Préparer le projet pour GitHub

### 1.1 Créer un fichier `.env.example`

Créez un fichier `.env.example` avec les variables d'environnement nécessaires :

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# JWT Secret (générez une clé aléatoire)
JWT_SECRET="votre-cle-secrete-tres-longue-et-aleatoire"

# Node Environment
NODE_ENV="production"
```

### 1.2 Vérifier le `.gitignore`

Assurez-vous que `.env` est dans `.gitignore` (déjà fait ✅)

### 1.3 Initialiser Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit: Application de commande en ligne"
```

---

## Étape 2 : Créer le dépôt GitHub

### 2.1 Créer un nouveau dépôt sur GitHub

1. Allez sur https://github.com/new
2. Nommez votre dépôt (ex: `chawarma-ordering`)
3. Choisissez **Public** ou **Private**
4. **NE cochez PAS** "Initialize with README"
5. Cliquez sur **Create repository**

### 2.2 Connecter votre projet local à GitHub

```bash
# Remplacez YOUR_USERNAME et YOUR_REPO_NAME
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Étape 3 : Configurer Supabase (Base de données PostgreSQL)

### 3.1 Créer un compte Supabase

1. Allez sur https://supabase.com
2. Cliquez sur **Start your project**
3. Connectez-vous avec GitHub
4. Créez un nouveau projet

### 3.2 Créer le projet Supabase

- **Name** : `chawarma-ordering` (ou votre choix)
- **Database Password** : Choisissez un mot de passe fort (⚠️ **SAVEZ-LE**)
- **Region** : Choisissez la région la plus proche
- Cliquez sur **Create new project**

### 3.3 Récupérer la connection string

1. Dans votre projet Supabase, allez dans **Settings** → **Database**
2. Trouvez **Connection string** → **URI**
3. Copiez la chaîne (elle ressemble à : `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
4. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

---

## Étape 4 : Configurer Vercel

### 4.1 Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **Sign Up**
3. Connectez-vous avec **GitHub**
4. Autorisez Vercel à accéder à vos dépôts

### 4.2 Importer votre projet

1. Dans le dashboard Vercel, cliquez sur **Add New...** → **Project**
2. Sélectionnez votre dépôt GitHub (`chawarma-ordering`)
3. Cliquez sur **Import**

### 4.3 Configurer les variables d'environnement

Dans la section **Environment Variables**, ajoutez :

#### Variables à ajouter :

1. **`DATABASE_URL`**
   - Valeur : La connection string Supabase que vous avez copiée
   - Exemple : `postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres`

2. **`JWT_SECRET`**
   - Générez une clé aléatoire :
     ```bash
     # Sur Mac/Linux
     openssl rand -base64 32
     # Ou utilisez un générateur en ligne : https://randomkeygen.com
     ```
   - Valeur : Une chaîne aléatoire longue (ex: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

3. **`NODE_ENV`**
   - Valeur : `production`

### 4.4 Configurer le build

Vercel détecte automatiquement Next.js, mais vérifiez :

- **Framework Preset** : Next.js
- **Build Command** : `prisma generate && next build` (déjà dans package.json ✅)
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install` (par défaut)

### 4.5 Déployer

1. Cliquez sur **Deploy**
2. Attendez que le build se termine (2-5 minutes)

---

## Étape 5 : Configurer la base de données après le déploiement

### 5.1 Exécuter les migrations Prisma

Une fois le déploiement terminé, vous devez exécuter les migrations :

**Option A : Via Vercel CLI (Recommandé)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Exécuter les migrations
npx prisma migrate deploy
```

**Option B : Via Supabase SQL Editor**

1. Allez dans Supabase → **SQL Editor**
2. Exécutez les commandes SQL générées par Prisma
3. Ou utilisez `prisma db push` en local avec la DATABASE_URL de production

**Option C : Via script de déploiement**

Créez un script dans `package.json` :

```json
"scripts": {
  "postinstall": "prisma generate",
  "vercel-build": "prisma generate && prisma migrate deploy && next build"
}
```

### 5.2 Exécuter le seed (données initiales)

```bash
# En local avec la DATABASE_URL de production
DATABASE_URL="votre-connection-string-supabase" npm run db:seed
```

Ou créez un script Vercel pour le faire automatiquement.

---

## Étape 6 : Vérifier le déploiement

### 6.1 Tester l'application

1. Vercel vous donnera une URL (ex: `https://chawarma-ordering.vercel.app`)
2. Visitez l'URL
3. Testez les fonctionnalités :
   - Page principale : `https://votre-app.vercel.app/r/zen-acham`
   - Admin login : `https://votre-app.vercel.app/admin/login`

### 6.2 Vérifier les logs

- Dans Vercel → **Deployments** → Cliquez sur votre déploiement → **Logs**
- Vérifiez qu'il n'y a pas d'erreurs

---

## 🔧 Configuration supplémentaire

### Ajouter un domaine personnalisé (optionnel)

1. Dans Vercel → **Settings** → **Domains**
2. Ajoutez votre domaine
3. Suivez les instructions DNS

### Variables d'environnement par environnement

Vous pouvez avoir différentes variables pour :
- **Production** : Variables de production
- **Preview** : Variables de test
- **Development** : Variables locales

---

## 🐛 Dépannage

### Erreur : "Prisma Client not generated"

**Solution** : Ajoutez dans `package.json` :
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Erreur : "Database connection failed"

**Vérifiez** :
1. La `DATABASE_URL` est correcte dans Vercel
2. Le mot de passe Supabase est correct
3. Les paramètres de sécurité Supabase autorisent les connexions externes

### Erreur : "Module not found"

**Solution** : Vérifiez que toutes les dépendances sont dans `package.json` et non dans `devDependencies` si elles sont utilisées en production.

---

## 📝 Checklist de déploiement

- [ ] Projet Git initialisé et poussé sur GitHub
- [ ] Dépôt GitHub créé et connecté
- [ ] Compte Supabase créé et projet configuré
- [ ] Base de données PostgreSQL créée
- [ ] Connection string Supabase récupérée
- [ ] Compte Vercel créé et connecté à GitHub
- [ ] Projet importé dans Vercel
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Build réussi sur Vercel
- [ ] Migrations Prisma exécutées
- [ ] Seed de la base de données exécuté
- [ ] Application testée et fonctionnelle
- [ ] URL de production partagée avec le restaurant

---

## 🎉 Félicitations !

Votre application est maintenant en ligne ! Partagez le lien avec le restaurant :

**URL publique** : `https://votre-app.vercel.app/r/zen-acham`
**Admin** : `https://votre-app.vercel.app/admin/login`

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel
2. Vérifiez les logs Supabase
3. Consultez la documentation :
   - Vercel : https://vercel.com/docs
   - Supabase : https://supabase.com/docs
   - Prisma : https://www.prisma.io/docs
