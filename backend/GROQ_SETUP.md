# Configuration Groq AI - Guide Rapide

## 🚀 Obtenir votre clé API Groq (GRATUIT)

1. **Aller sur**: https://console.groq.com/
2. **Créer un compte** (gratuit)
3. **Cliquer sur "API Keys"**
4. **Créer une nouvelle clé** → Copier la clé

## 📝 Configuration

1. Ouvrir `backend/.env`
2. Ajouter la ligne :
   ```
   GROQ_API_KEY=votre_cle_api_ici
   ```

## ✅ C'est tout !

Le système utilisera automatiquement Groq AI pour:
- Optimiser les mots-clés de recherche vidéo
- Trouver de meilleures vidéos de stock
- Améliorer la cohérence visuelle

**Limites GRATUITES** : 30 requêtes/minute (largement suffisant!)

Si la clé n'est pas configurée, le système utilisera un fallback basique.
