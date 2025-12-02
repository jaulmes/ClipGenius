# AI Video Clipper - Guide d'Installation et de Déploiement

Ce projet est une application full-stack qui transforme de longues vidéos YouTube en clips courts et viraux. Il est composé d'un frontend en React et d'un backend en Node.js.

---

## Architecture

Le projet est structuré en monorepo :
-   `frontend/` : L'interface utilisateur en React (Vite).
-   `backend/` : Le serveur Node.js (Express) qui gère le traitement vidéo.

---

## 1. Prérequis (Indispensable)

Assurez-vous d'avoir installé tous les logiciels suivants :

-   **Node.js** : Version 18.x ou supérieure.
-   **npm** : Inclus avec Node.js.
-   **Python** : Version 3.9 ou supérieure.
-   **pip** : L'installeur de paquets Python.
-   **FFmpeg** : L'outil de traitement vidéo.
    -   **Sur Ubuntu/Debian :** `sudo apt update && sudo apt install ffmpeg`
    -   **Sur Windows/macOS :** Téléchargez-le depuis le [site officiel](https://ffmpeg.org/download.html) et assurez-vous que l'exécutable `ffmpeg` est accessible dans votre PATH.

---

## 2. Configuration Initiale

1.  **Clonez le projet :**
    ```bash
    git clone <URL_DU_REPOSITORY>
    cd <NOM_DU_PROJET>
    ```

2.  **Configurez le Backend :**
    -   Naviguez dans le dossier backend : `cd backend`
    -   Créez votre fichier d'environnement en copiant l'exemple :
        ```bash
        cp .env.example .env
        ```
    -   Ouvrez le fichier `.env` et ajoutez votre clé API AssemblyAI :
        ```
        ASSEMBLYAI_API_KEY="VOTRE_CLÉ_API_ICI"
        ```
        *(Si vous n'utilisez que la transcription locale, cette étape est optionnelle.)*

3.  **Installez les dépendances Python :**
    -   Depuis la racine du dossier `backend/`, installez la bibliothèque Whisper :
        ```bash
        pip install openai-whisper
        ```
        *(Cette installation peut être longue et télécharger de grosses dépendances comme PyTorch.)*

---

## 3. Lancement en Local (Développement)

Pour faire fonctionner l'application, vous devez lancer le backend ET le frontend en parallèle. **Ouvrez deux terminaux séparés.**

### Terminal 1 : Lancer le Backend

1.  Naviguez dans le dossier backend :
    ```bash
    cd backend
    ```
2.  Installez les dépendances Node.js :
    ```bash
    npm install
    ```
3.  Démarrez le serveur :
    ```bash
    npm start
    ```
    Le serveur devrait démarrer et afficher : `Backend server listening at http://localhost:3001`.

### Terminal 2 : Lancer le Frontend

1.  Naviguez dans le dossier frontend :
    ```bash
    cd frontend
    ```
2.  Installez les dépendances Node.js :
    ```bash
    npm install
    ```
3.  Démarrez le serveur de développement :
    ```bash
    npm run dev
    ```
    Le serveur devrait démarrer et vous donner une URL, généralement `http://localhost:5173`.

### Accéder à l'application

Ouvrez votre navigateur et allez à l'URL fournie par le serveur frontend (ex: `http://localhost:5173`). L'application est maintenant pleinement fonctionnelle et connectée au backend local.

---

## 4. Déploiement en Production

Le déploiement en production est un processus avancé. Voici les grandes lignes :

1.  **Backend :** Vous devrez déployer le serveur Node.js sur une plateforme comme Heroku, Render, ou un VPS. Assurez-vous que toutes les dépendances système (FFmpeg, Python, Whisper) y sont installées. Configurez les variables d'environnement (`ASSEMBLYAI_API_KEY`, etc.) sur la plateforme d'hébergement.

2.  **Frontend :**
    -   Dans le code du frontend (par exemple, dans `frontend/src/store/useVideoStore.js`), changez l'URL de l'API `http://localhost:3001` par l'URL publique de votre backend déployé.
    -   Construisez la version statique de l'application :
        ```bash
        cd frontend
        npm run build
        ```
    -   Déployez le contenu du dossier `frontend/dist` sur un service d'hébergement statique comme Vercel ou Netlify.

Il est crucial de bien configurer le CORS sur le serveur backend pour autoriser les requêtes provenant de l'URL de votre frontend.
