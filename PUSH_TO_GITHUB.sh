#!/bin/bash

# Script pour pousser le projet sur GitHub
# Usage: bash PUSH_TO_GITHUB.sh VOTRE_USERNAME

if [ -z "$1" ]; then
    echo "❌ Usage: bash PUSH_TO_GITHUB.sh VOTRE_USERNAME"
    echo ""
    echo "Exemple: bash PUSH_TO_GITHUB.sh elbakri88"
    exit 1
fi

USERNAME=$1
REPO_NAME="chawarma-ordering"

echo "🚀 Connexion au dépôt GitHub..."

# Vérifier si le remote existe déjà
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Le remote 'origin' existe déjà."
    echo "Voulez-vous le remplacer ? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        git remote remove origin
    else
        echo "❌ Annulé. Utilisez 'git remote set-url origin ...' manuellement."
        exit 1
    fi
fi

# Ajouter le remote
git remote add origin "https://github.com/${USERNAME}/${REPO_NAME}.git"

# Vérifier la branche
git branch -M main

# Pousser le code
echo "📤 Envoi du code sur GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Code poussé avec succès !"
    echo ""
    echo "🔗 Votre dépôt est maintenant disponible sur :"
    echo "   https://github.com/${USERNAME}/${REPO_NAME}"
    echo ""
    echo "📋 Prochaines étapes :"
    echo "1. Créez un compte Supabase : https://supabase.com"
    echo "2. Créez un projet Supabase"
    echo "3. Récupérez la connection string"
    echo "4. Déployez sur Vercel : https://vercel.com"
    echo ""
    echo "📖 Suivez le guide : DEPLOIEMENT_RAPIDE.md"
else
    echo "❌ Erreur lors du push. Vérifiez :"
    echo "   - Que le dépôt existe sur GitHub"
    echo "   - Que vous êtes authentifié (git config --global user.name)"
    echo "   - Que vous avez les permissions sur le dépôt"
fi
