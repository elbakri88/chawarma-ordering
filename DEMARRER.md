# 🚀 Commandes pour Démarrer l'Application

## 📋 Étape par Étape

### 1. Vérifier que PostgreSQL est démarré
```bash
brew services start postgresql@15
```

### 2. Aller dans le dossier du projet
```bash
cd /Users/abdellatifelbakri/Documents/chawarma
```

### 3. Vérifier les variables d'environnement
Assurez-vous que le fichier `.env` existe et contient :
```env
DATABASE_URL="postgresql://abdellatifelbakri@localhost:5432/chawarma?schema=public"
JWT_SECRET="dev-secret-key-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Installer les dépendances (si pas déjà fait)
```bash
npm install
```

### 5. Générer le client Prisma (si nécessaire)
```bash
npx prisma generate
```

### 6. Vérifier/créer la base de données
```bash
npx prisma db push
```

### 7. Charger les données initiales (menu + admin)
```bash
npm run db:seed
```

### 8. Démarrer le serveur de développement
```bash
npm run dev
```

## 🎯 Commande Rapide (Tout en Une)

Si tout est déjà installé et configuré :
```bash
cd /Users/abdellatifelbakri/Documents/chawarma && npm run dev
```

## 🌐 Accès après Démarrage

Une fois le serveur démarré, vous verrez :
```
✓ Ready in Xs
○ Local:        http://localhost:3000
```

### URLs disponibles :
- **Menu client** : http://localhost:3000/r/zen-acham
- **Admin login** : http://localhost:3000/admin/login
  - Email: `admin@zenacham.com`
  - Password: `admin123`
- **Dashboard admin** : http://localhost:3000/admin/dashboard
- **Gestion menu** : http://localhost:3000/admin/menu
- **QR Code** : http://localhost:3000/admin/qr

## ⚙️ Commandes Utiles

### Arrêter le serveur
Appuyez sur `Ctrl + C` dans le terminal

### Vérifier si le port 3000 est utilisé
```bash
lsof -ti:3000
```

### Tuer un processus sur le port 3000
```bash
lsof -ti:3000 | xargs kill -9
```

### Voir les logs en temps réel
Le serveur affiche les logs automatiquement dans le terminal

## 🔧 Dépannage

### Erreur "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Erreur de base de données
```bash
brew services restart postgresql@15
npx prisma db push
```

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Rebuild complet
```bash
rm -rf .next node_modules package-lock.json
npm install
npx prisma generate
npm run dev
```


