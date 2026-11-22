# Deploiement

## Backend sur Render

1. Importer le depot GitHub dans Render.
2. Utiliser `render.yaml` pour creer le service `mariage-backend`.
3. Configurer les variables:
   - `CLIENT_ORIGIN=https://<domaine-public>.vercel.app`
   - `ADMIN_ORIGIN=https://<domaine-admin>.vercel.app`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `ADMIN_EMAILS`
4. Deployer puis verifier `https://<service>.onrender.com/health`.

Plusieurs domaines peuvent etre separes par des virgules dans `CLIENT_ORIGIN` ou `ADMIN_ORIGIN`.

## Client public sur Vercel

Dans un nouveau projet Vercel:

- Root Directory: `client`
- Framework Preset: Next.js
- Variable: `NEXT_PUBLIC_API_URL=https://<service>.onrender.com`
- Variable: `NEXT_PUBLIC_SITE_URL=https://<domaine-public>.vercel.app`
- Variable: `NEXT_PUBLIC_ADMIN_URL=https://<domaine-admin>.vercel.app`

## Dashboard admin sur Vercel

Dans un deuxième projet Vercel :

- **Root Directory** : `dashboard-client`
- **Framework Preset** : Next.js
- Variables d'environnement :
  - `NEXT_PUBLIC_API_URL=https://<service>.onrender.com`
  - `NEXT_PUBLIC_CLIENT_URL=https://<domaine-public>.vercel.app`
  - `NEXT_PUBLIC_SITE_URL=https://<domaine-admin>.vercel.app`
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

> **Astuce pour la clé privée Firebase sur Render :**
> Collez directement la clé complète avec les en-têtes `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`. Le backend remplace automatiquement les `\n` par de vrais retours à la ligne.
