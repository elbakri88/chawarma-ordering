# 📋 Commandes pour Déployer sur Vercel

## ✅ Étape 1 : Votre projet est déjà préparé !

Le projet a été initialisé avec Git. Vous pouvez maintenant le pousser sur GitHub.

---

## 🔗 Étape 2 : Créer le dépôt GitHub

### Option A : Via l'interface web (Recommandé)

1. Allez sur **https://github.com/new**
2. Nommez votre dépôt (ex: `chawarma-ordering`)
3. Choisissez **Public** ou **Private**
4. **NE cochez PAS** "Initialize with README"
5. Cliquez sur **Create repository**

### Option B : Via GitHub CLI (si installé)

```bash
gh repo create chawarma-ordering --public --source=. --remote=origin --push
```

---

## 📤 Étape 3 : Connecter et pousser le code

```bash
# Remplacez YOUR_USERNAME et YOUR_REPO_NAME par vos valeurs
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Exemple :**
```bash
git remote add origin https://github.com/abdellatifelbakri/chawarma-ordering.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Étape 4 : Créer Supabase (Base de données)

1. **Créer un compte** : https://supabase.com → **Start your project**
2. **Connectez-vous avec GitHub**
3. **Créer un nouveau projet** :
   - Name: `chawarma-ordering`
   - Database Password: ⚠️ **CHOISISSEZ UN MOT DE PASSE FORT ET SAUVEZ-LE**
   - Region: Choisissez la région la plus proche (ex: `West Europe (Paris)`)
   - Cliquez sur **Create new project**
4. **Attendez 2-3 minutes** que le projet soit créé
5. **Récupérer la connection string** :
   - Allez dans **Settings** → **Database**
   - Trouvez **Connection string** → **URI**
   - Copiez la chaîne (ex: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
   - **Remplacez `[YOUR-PASSWORD]` par votre mot de passe** dans la chaîne

---

## 🚀 Étape 5 : Déployer sur Vercel

### 5.1 Créer un compte Vercel

1. Allez sur **https://vercel.com**
2. Cliquez sur **Sign Up**
3. **Connectez-vous avec GitHub**
4. Autorisez Vercel à accéder à vos dépôts

### 5.2 Importer le projet

1. Dans le dashboard Vercel, cliquez sur **Add New...** → **Project**
2. Sélectionnez votre dépôt (`chawarma-ordering`)
3. Cliquez sur **Import**

### 5.3 Configurer les variables d'environnement

Dans la section **Environment Variables**, ajoutez ces 3 variables :

| Variable | Valeur | Comment obtenir |
|----------|--------|-----------------|
| `DATABASE_URL` | La connection string Supabase (avec le mot de passe) | Copiée depuis Supabase |
| `JWT_SECRET` | Une clé aléatoire | Générer avec : `openssl rand -base64 32` |
| `NODE_ENV` | `production` | Texte simple |

**Pour générer JWT_SECRET :**
```bash
openssl rand -base64 32
```

### 5.4 Déployer

1. Cliquez sur **Deploy**
2. Attendez 2-5 minutes que le build se termine
3. ✅ Votre application sera en ligne !

---

## 🔧 Étape 6 : Configurer la base de données

Une fois le déploiement terminé, vous devez créer les tables dans Supabase.

### Option A : Via Vercel CLI (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet (choisissez votre projet dans la liste)
vercel link

# Exécuter les migrations
npx prisma migrate deploy

# Seed la base de données (données initiales)
npx prisma db seed
```

### Option B : Via Prisma en local

```bash
# Créer un fichier .env.production avec votre DATABASE_URL de Supabase
echo 'DATABASE_URL="votre-connection-string-supabase"' > .env.production

# Exécuter les migrations
npx prisma migrate deploy

# Seed
npm run db:seed
```

---

## ✅ Étape 7 : Tester votre application

Une fois tout configuré, votre application sera accessible sur :

- **URL de production** : `https://votre-app.vercel.app`
- **Page restaurant** : `https://votre-app.vercel.app/r/zen-acham`
- **Admin login** : `https://votre-app.vercel.app/admin/login`

**Identifiants admin par défaut :**
- Email: `admin@zenacham.com`
- Password: `admin123`

⚠️ **Changez le mot de passe admin après la première connexion !**

---

## 🎉 Félicitations !

Votre application est maintenant en ligne ! Partagez le lien avec le restaurant.

---

## 🆘 Problèmes courants

### Erreur "Prisma Client not generated"
→ Vérifiez que `postinstall` est dans package.json ✅ (déjà fait)

### Erreur "Database connection failed"
→ Vérifiez que la DATABASE_URL dans Vercel est correcte (avec le mot de passe)

### Erreur "Module not found"
→ Vérifiez que toutes les dépendances sont dans `dependencies` et non `devDependencies`

### Les migrations ne fonctionnent pas
→ Utilisez `npx prisma db push` au lieu de `migrate deploy` pour le MVP

---

## 📞 Besoin d'aide ?

Consultez les guides détaillés :
- **Guide rapide** : `DEPLOIEMENT_RAPIDE.md`
- **Guide complet** : `DEPLOIEMENT_VERCEL.md`
