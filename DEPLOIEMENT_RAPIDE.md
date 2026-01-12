# ⚡ Déploiement Rapide - Guide Express

## 🎯 Objectif
Déployer votre application en **15 minutes** sur Vercel avec GitHub.

---

## 📦 Étape 1 : GitHub (5 min)

### 1.1 Créer le dépôt
```bash
# Si Git n'est pas initialisé
git init
git add .
git commit -m "Initial commit"

# Créer le dépôt sur GitHub.com (via l'interface web)
# Puis connecter :
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Étape 2 : Supabase (5 min)

1. **Créer un compte** : https://supabase.com → Sign Up avec GitHub
2. **Créer un projet** :
   - Name: `chawarma-ordering`
   - Password: ⚠️ **SAVEZ-LE** (ex: `MonMotDePasse123!`)
   - Region: Choisissez la plus proche
3. **Récupérer la connection string** :
   - Settings → Database → Connection string → URI
   - Copiez : `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`
   - Remplacez `[YOUR-PASSWORD]` par votre mot de passe

---

## 🚀 Étape 3 : Vercel (5 min)

### 3.1 Importer le projet
1. Allez sur https://vercel.com → Sign Up avec GitHub
2. **Add New Project** → Sélectionnez votre repo → **Import**

### 3.2 Variables d'environnement
Dans **Environment Variables**, ajoutez :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | La connection string Supabase (avec le mot de passe) |
| `JWT_SECRET` | Générez avec : `openssl rand -base64 32` |
| `NODE_ENV` | `production` |

### 3.3 Déployer
- Cliquez sur **Deploy**
- Attendez 2-5 minutes

---

## 🔧 Étape 4 : Configurer la base de données

### Option A : Via Vercel CLI (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet (choisissez votre projet)
vercel link

# Exécuter les migrations
npx prisma migrate deploy

# Seed la base de données
npx prisma db seed
```

### Option B : Via Supabase SQL Editor

1. Allez dans Supabase → **SQL Editor**
2. Créez les tables manuellement ou utilisez Prisma Studio en local avec la DATABASE_URL de production

---

## ✅ Vérification

1. **URL de production** : `https://votre-app.vercel.app`
2. **Page restaurant** : `https://votre-app.vercel.app/r/zen-acham`
3. **Admin** : `https://votre-app.vercel.app/admin/login`

**Identifiants admin par défaut** (depuis le seed) :
- Email : `admin@zenacham.com`
- Password : `admin123` (changez-le après la première connexion !)

---

## 🎉 C'est fait !

Votre application est en ligne ! Partagez le lien avec le restaurant.

---

## 🆘 Problèmes courants

### Erreur "Prisma Client not generated"
→ Vérifiez que `postinstall` est dans package.json ✅ (déjà fait)

### Erreur "Database connection failed"
→ Vérifiez la DATABASE_URL dans Vercel (le mot de passe doit être correct)

### Erreur "Module not found"
→ Vérifiez que toutes les dépendances sont dans `dependencies` et non `devDependencies`

---

## 📝 Checklist

- [ ] Dépôt GitHub créé et code poussé
- [ ] Projet Supabase créé
- [ ] Connection string récupérée
- [ ] Projet Vercel créé et connecté
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Migrations exécutées
- [ ] Seed exécuté
- [ ] Application testée

---

**Besoin d'aide ?** Consultez `DEPLOIEMENT_VERCEL.md` pour le guide détaillé.
