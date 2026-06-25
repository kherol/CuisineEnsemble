# 🍲 CuisineEnsemble — Repas partagés

CuisineEnsemble est une application web permettant aux habitants d’un même quartier de proposer, organiser et rejoindre des repas communautaires.

L’objectif du projet est de réduire l’isolement alimentaire, favoriser les rencontres entre habitants, découvrir de nouvelles cuisines et partager les coûts liés à l’organisation des repas.

## 🌍 Application déployée

L’application est actuellement accessible à l’adresse suivante :

**http://13.38.177.215**

> Le site est pour le moment accessible en HTTP. La mise en place d’un nom de domaine et du HTTPS fait partie des prochaines améliorations.

---

## 🎯 Objectifs du projet

CuisineEnsemble permet :

* de proposer un repas avec un nombre de places limité ;
* d’indiquer le prix par personne ;
* de préciser le quartier et le lieu du repas ;
* de renseigner les allergies et régimes alimentaires ;
* de réserver une place à un repas ;
* de gérer les demandes de participation ;
* d’échanger dans un chat lié au repas ;
* de laisser un avis après la rencontre ;
* de signaler un utilisateur ou un repas ;
* d’administrer la plateforme.

---

## 👥 Rôles utilisateurs

### Utilisateur

Un utilisateur peut :

* créer un compte ;
* se connecter ;
* consulter les repas disponibles ;
* réserver une place ;
* consulter ses réservations ;
* proposer un repas ;
* gérer les repas qu’il organise ;
* échanger avec les participants ;
* modifier son profil ;
* laisser un avis.

### Hôte

L’hôte est un utilisateur qui propose un repas. Il peut :

* définir le nombre de places ;
* indiquer le prix par personne ;
* préciser les allergies et régimes acceptés ;
* accepter ou refuser les demandes ;
* suivre les participants ;
* accéder au chat du repas ;
* consulter les avis reçus.

### Administrateur

Un administrateur peut :

* consulter les utilisateurs ;
* bloquer ou réactiver un compte ;
* promouvoir un utilisateur en administrateur ;
* gérer les repas ;
* traiter les signalements ;
* consulter les statistiques de la plateforme.

Lors de l’inscription, tous les nouveaux comptes obtiennent automatiquement le rôle `user`. Seul un administrateur peut promouvoir un autre utilisateur.

---

## ✅ Fonctionnalités développées

* Inscription et connexion
* Authentification JWT
* Gestion du profil utilisateur
* Gestion des allergies et préférences alimentaires
* Création de repas
* Liste des repas disponibles
* Détail d’un repas
* Réservation d’une place
* Gestion des demandes de participation
* Mes repas
* Mes réservations
* Chat par repas
* Système d’avis
* Signalement d’un repas ou d’un utilisateur
* Dashboard utilisateur
* Dashboard administrateur
* Gestion des utilisateurs
* Gestion des repas
* Gestion des signalements
* Statistiques administrateur
* Monitoring avec Prometheus et Grafana
* Déploiement Docker sur AWS EC2

---

## 🧰 Stack technique

### Frontend

* React.js
* JavaScript ES6+
* Vite
* Bootstrap
* HTML5
* CSS3
* Progressive Web App

### Backend

* Python
* FastAPI
* API REST
* Authentification JWT
* SQLAlchemy ORM
* Pydantic
* Uvicorn

### Base de données

* PostgreSQL 16
* Alembic pour les migrations
* Sauvegardes avec `pg_dump`

### Infrastructure et DevOps

* Ubuntu Linux
* Docker
* Docker Compose
* Nginx Reverse Proxy
* AWS EC2
* Elastic IP
* Git et GitHub
* GitHub Actions
* Prometheus
* Grafana
* Kubernetes
* Ansible

---

## 🏗️ Architecture générale

```text
Utilisateur
    │
    ▼
Nginx — Port 80
    │
    ├── /       → Frontend React
    │
    └── /api/   → Backend FastAPI
                        │
                        ▼
                   PostgreSQL
```

Le monitoring est assuré par :

```text
FastAPI /metrics
       │
       ▼
  Prometheus
       │
       ▼
    Grafana
```

---

## 📁 Structure du projet

```text
CuisineEnsemble/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── routers/
│   │   ├── admin_schemas.py
│   │   ├── database.py
│   │   ├── deps.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── seed_data.py
│   ├── migrations/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   └── nginx.conf
│
├── prometheus/
│   └── prometheus.yml
│
├── grafana/
│   ├── dashboards/
│   └── provisioning/
│
├── ansible/
├── k8s/
├── docs/
├── scripts/
├── .github/workflows/
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 🚀 Lancement local avec Docker

### 1. Cloner le dépôt

```bash
git clone https://github.com/kherol/CuisineEnsemble.git
cd CuisineEnsemble
```

### 2. Créer le fichier d’environnement

Sous Linux ou macOS :

```bash
cp .env.example .env
```

Sous Windows :

```bat
copy .env.example .env
```

Adapter ensuite les variables du fichier `.env`.

### 3. Lancer les services

```bash
docker compose up -d --build
```

### 4. Vérifier les conteneurs

```bash
docker compose ps
```

### 5. Accéder aux services

* Application : http://localhost
* Frontend Vite : http://localhost:5173
* API : http://localhost:8000
* Swagger : http://localhost/api/docs
* Prometheus : http://localhost:9090
* Grafana : http://localhost:3000

---

## 🧪 Vérifier l’API

```bash
curl http://localhost/api/health
```

Résultat attendu :

```json
{
  "status": "ok",
  "service": "cuisineensemble-api"
}
```

---

## 🗃️ Ajouter les données de démonstration

```bash
docker compose exec backend python -m app.seed_data
```

Le script ajoute des utilisateurs hôtes et plusieurs repas de démonstration.

---

## 🛠️ Lancement sans Docker

### Backend

```bash
cd backend
python -m venv .venv
```

Activation sous Linux ou macOS :

```bash
source .venv/bin/activate
```

Activation sous Windows :

```bat
.venv\Scripts\activate
```

Installation et lancement :

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔄 Migrations de la base de données

Depuis le dossier `backend` :

```bash
alembic revision --autogenerate -m "description_migration"
alembic upgrade head
```

Pour le développement, l’application peut également créer les tables automatiquement au démarrage.

---

## ☁️ Déploiement AWS

L’application est déployée sur une instance AWS EC2 Ubuntu avec Docker Compose.

Services actuellement utilisés :

* PostgreSQL
* FastAPI
* React
* Nginx
* Prometheus
* Grafana

Commande de déploiement :

```bash
cd /opt/CuisineEnsemble
git pull origin main
docker compose up -d --build
```

Vérification :

```bash
docker compose ps
curl http://127.0.0.1/api/health
```

---

## 📊 Monitoring

Prometheus collecte les métriques exposées par FastAPI.

Vérification de Prometheus :

```bash
curl http://127.0.0.1:9090/-/healthy
```

Vérification de Grafana :

```bash
curl http://127.0.0.1:3000/api/health
```

Pour accéder à Grafana et Prometheus sans exposer leurs ports sur Internet :

```bash
ssh -i cuisineensemble-key.pem \
  -L 3000:127.0.0.1:3000 \
  -L 9090:127.0.0.1:9090 \
  ubuntu@13.38.177.215
```

Puis ouvrir :

* Grafana : http://localhost:3000
* Prometheus : http://localhost:9090

---

## 💾 Sauvegarde PostgreSQL

Créer une sauvegarde :

```bash
docker compose exec -T db pg_dump \
  -U cuisine_user \
  -d cuisineensemble \
  --no-owner \
  --no-privileges \
  > cuisineensemble_backup.sql
```

Restaurer une sauvegarde :

```bash
docker compose exec -T db psql \
  -U cuisine_user \
  -d cuisineensemble \
  < cuisineensemble_backup.sql
```

Les fichiers `.sql` et `.env` sont exclus de Git pour protéger les données et les secrets.

---

## 🔐 Sécurité

Mesures déjà mises en place :

* authentification JWT ;
* mots de passe hachés ;
* rôles utilisateur et administrateur ;
* routes administrateur protégées ;
* PostgreSQL non exposé publiquement ;
* backend non exposé directement sur Internet ;
* Grafana et Prometheus accessibles via tunnel SSH ;
* secrets stockés dans `.env` ;
* groupe de sécurité AWS ;
* Elastic IP pour stabiliser l’adresse publique.

Améliorations prévues :

* nom de domaine ;
* certificat HTTPS ;
* redirection HTTP vers HTTPS ;
* sauvegardes automatiques ;
* limitation des tentatives de connexion ;
* rotation des logs ;
* alertes Grafana ;
* déploiement automatique avec GitHub Actions.

---

## 🧑‍💻 Travail collaboratif

Avant de commencer une modification :

```bash
git switch main
git pull origin main
git switch -c nom-de-la-branche
```

Après les modifications :

```bash
git add .
git commit -m "Description des modifications"
git push -u origin nom-de-la-branche
```

Créer ensuite une Pull Request vers `main`.

---

## 🛣️ Améliorations futures

* Nom de domaine personnalisé
* HTTPS avec certificat TLS
* Carte interactive des repas
* Notifications en temps réel
* Recherche par distance
* Paiement sécurisé
* Gestion avancée des contributions
* Alertes de monitoring
* Sauvegardes automatiques
* Tests backend et frontend
* Déploiement CI/CD complet
* Application mobile

---

## 👨‍🎓 Projet

Projet réalisé dans le cadre d’un travail académique autour du développement web, de l’architecture des systèmes d’information et du DevOps.
