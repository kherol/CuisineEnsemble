# CuisineEnsemble — Repas partagés

CuisineEnsemble est une application web qui facilite l'organisation de repas communautaires entre habitants d'un même quartier. Le projet vise à réduire l'isolement alimentaire, favoriser la découverte culinaire et partager les coûts des repas.

## Stack mobilisée

### Frontend
- HTML5 / CSS3
- JavaScript ES6+
- React.js
- Bootstrap
- Progressive Web App

### Backend
- Python
- FastAPI
- API REST
- Authentification JWT
- SQLAlchemy ORM

### Base de données
- PostgreSQL
- Migrations prévues via Alembic

### Infrastructure & DevOps
- Linux / Bash
- Docker / Docker Compose
- Git / GitHub Actions CI/CD
- Nginx reverse proxy
- Prometheus / Grafana monitoring
- Kubernetes : manifests de base dans `k8s/`
- Ansible : playbook de déploiement dans `ansible/`

## Fonctionnalités MVP

- Inscription / connexion
- Profil utilisateur avec quartier, allergies et préférences alimentaires
- Création d'un repas par un hôte
- Liste des repas disponibles
- Détail d'un repas
- Réservation / participation
- Acceptation ou refus des participants par l'hôte
- Chat de groupe par repas
- Notation après repas
- Signalement simple
- Dashboard administrateur

## Lancement rapide avec Docker

```bash
cp .env.example .env
docker compose up --build
```

Puis ouvrir :

- Application : http://localhost
- API Swagger : http://localhost/api/docs
- Prometheus : http://localhost:9090
- Grafana : http://localhost:3000

Identifiants Grafana par défaut :

- user : `admin`
- password : `admin`

## Lancement en local sans Docker

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Migrations base de données

```bash
cd backend
alembic revision --autogenerate -m "init"
alembic upgrade head
```

Pour le développement rapide, l’API crée aussi les tables automatiquement au démarrage.

## Mettre le projet sur GitHub

```bash
git init
git add .
git commit -m "Initial commit - CuisineEnsemble"
git branch -M main
git remote add origin https://github.com/TON-UTILISATEUR/CuisineEnsemble.git
git push -u origin main
```

## Structure

```txt
CuisineEnsemble/
├── backend/          # API FastAPI
├── frontend/         # Application React
├── nginx/            # Reverse proxy
├── prometheus/       # Config monitoring
├── grafana/          # Datasource + dashboard
├── scripts/          # Scripts Linux / sauvegarde
├── ansible/          # Déploiement automatisé
├── k8s/              # Manifests Kubernetes
├── docs/             # Documentation projet
├── .github/workflows # CI/CD GitHub Actions
└── docker-compose.yml
```

## Comptes de test

Au démarrage, l'API crée automatiquement les tables. Tu peux créer tes comptes depuis l'interface ou Swagger.
Pour créer un administrateur, modifie directement le rôle en base ou utilise la route admin après avoir configuré ton premier utilisateur.
