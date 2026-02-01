# VulnBlog - Application Vulnérable pour Démo Sécurité Supabase

⚠️ **ATTENTION: Cette application contient des failles de sécurité VOLONTAIRES !**
Ne JAMAIS déployer en production. Usage strictement éducatif.

## 🎯 Objectif

Application volontairement vulnérable pour démontrer les **Supabase Pentest Skills** :

👉 **https://github.com/yoanbernabeu/supabase-pentest-skills**

Ces skills permettent d'automatiser les audits de sécurité Supabase directement depuis **Claude Code**. Cette application sert de cible de test pour la vidéo YouTube montrant comment détecter et exploiter les failles de sécurité courantes dans les projets Supabase.

## 🔴 Failles Volontaires Intégrées

### Niveau 1 - Exploitable SANS compte (role anon)
| # | Faille | Impact |
|---|--------|--------|
| 1 | UPDATE articles sans auth | Défacement possible |
| 2 | DELETE articles sans auth | Destruction de données |
| 3 | Lecture articles non publiés | Fuite d'informations |

### Niveau 2 - Autres vulnérabilités
| # | Faille | Impact |
|---|--------|--------|
| 4 | Bucket avatars public | Fichiers accessibles |
| 5 | Énumération d'utilisateurs | Discovery d'emails |
| 6 | Realtime non authentifié | Espionnage en temps réel |
| 7 | Mots de passe faibles | Comptes compromis |

### Niveau 3 - APOTHÉOSE (Signup = Full Access)
| # | Faille | Impact |
|---|--------|--------|
| 8 | Signup ouvert | Création compte en 10 sec |
| 9 | Policies profiles permissives | DATA BREACH complet (tous les emails exposés) |

## 🚀 Installation

### Prérequis
- Node.js 18+
- Un projet Supabase (https://supabase.com)

### Étapes

1. **Cloner et installer les dépendances**
```bash
git clone <repo>
cd SupatestVibeDemo
npm install
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs Supabase (URL et anon key)
```

3. **Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur http://localhost:5173

## 📁 Structure du Projet

```
SupatestVibeDemo/
├── src/
│   ├── App.tsx              # Routing et layout
│   ├── main.tsx             # Point d'entrée
│   ├── lib/
│   │   └── supabase.ts      # Client Supabase
│   ├── components/
│   │   ├── Auth.tsx         # Login/Signup
│   │   ├── ArticleList.tsx  # Liste des articles
│   │   ├── ArticleForm.tsx  # Création d'article
│   │   └── Profile.tsx      # Profil utilisateur
│   └── pages/
│       ├── Home.tsx         # Page d'accueil
│       ├── Dashboard.tsx    # Tableau de bord
│       └── ArticlePage.tsx  # Page article
├── supabase/
│   └── migrations/
│       └── 20250201000000_initial_vulnblog.sql  # Schema avec failles cachées
├── scripts/                 # Scripts de démo
├── .github/workflows/       # GitHub Actions (deploy to Pages)
├── .env.example             # Template variables d'environnement
└── package.json
```

## ⚠️ Avertissement Légal

Cette application est fournie uniquement à des fins éducatives et de démonstration. L'exploitation de failles de sécurité sur des systèmes sans autorisation est illégale. Utilisez ces connaissances de manière responsable et éthique.

## 📜 Licence

MIT - Usage éducatif uniquement
