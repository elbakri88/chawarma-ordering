#!/bin/bash

# Script pour préparer le projet pour le déploiement
# Usage: bash prepare-deployment.sh

echo "🚀 Préparation du projet pour le déploiement..."

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installez Git d'abord."
    exit 1
fi

# Initialiser Git si ce n'est pas déjà fait
if [ ! -d ".git" ]; then
    echo "📦 Initialisation de Git..."
    git init
    echo "✅ Git initialisé"
else
    echo "✅ Git déjà initialisé"
fi

# Créer .env.example si il n'existe pas
if [ ! -f ".env.example" ]; then
    echo "📝 Création de .env.example..."
    cat > .env.example << EOF
# Database Connection String
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# JWT Secret pour l'authentification admin
JWT_SECRET="changez-moi-par-une-cle-secrete-tres-longue-et-aleatoire"

# Node Environment
NODE_ENV="production"
EOF
    echo "✅ .env.example créé"
else
    echo "✅ .env.example existe déjà"
fi

# Vérifier que .env est dans .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo "📝 Ajout de .env au .gitignore..."
    echo "" >> .gitignore
    echo "# local env files" >> .gitignore
    echo ".env" >> .gitignore
    echo "✅ .env ajouté au .gitignore"
else
    echo "✅ .env est déjà dans .gitignore"
fi

# Ajouter tous les fichiers
echo "📦 Ajout des fichiers à Git..."
git add .

# Créer le commit initial
echo "💾 Création du commit initial..."
git commit -m "Initial commit: Application de commande en ligne pour restaurant" || echo "⚠️  Aucun changement à commiter"

echo ""
echo "✅ Projet préparé pour le déploiement !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Créez un dépôt sur GitHub : https://github.com/new"
echo "2. Connectez votre projet :"
echo "   git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Suivez le guide : DEPLOIEMENT_RAPIDE.md"
