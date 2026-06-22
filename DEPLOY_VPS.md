# Déploiement CuisineEnsemble avec la configuration unique

Les mêmes fichiers sont utilisés en local et sur le VPS :

- `docker-compose.yml`
- `frontend/Dockerfile`
- `nginx/nginx.conf`
- `.env.example`

Seul le contenu du fichier `.env` change selon la machine.

## Local

```bash
cp .env.example .env
# Laisser ENVIRONMENT=development
docker compose up -d --build
```

Accès :

- Site : http://localhost
- API directe : http://localhost:8000/api/health
- Vite direct : http://localhost:5173
- Grafana : http://localhost:3000
- Prometheus : http://localhost:9090

## VPS

```bash
git clone https://github.com/kherol/CuisineEnsemble.git
cd CuisineEnsemble
cp .env.example .env
nano .env
```

Valeurs à modifier au minimum :

```env
ENVIRONMENT=production
SECRET_KEY=une-cle-longue-et-aleatoire
POSTGRES_PASSWORD=un-mot-de-passe-fort
DATABASE_URL=postgresql+psycopg2://cuisine_user:un-mot-de-passe-fort@db:5432/cuisineensemble
BACKEND_CORS_ORIGINS=http://IP_DU_VPS
GRAFANA_ADMIN_PASSWORD=un-autre-mot-de-passe-fort
```

Lancement :

```bash
docker compose up -d --build
docker compose ps
curl http://127.0.0.1/api/health
```

Seul le port 80 est exposé publiquement. Les ports PostgreSQL, FastAPI, Vite, Grafana et Prometheus sont liés à `127.0.0.1`.

## Mise à jour

```bash
git pull origin main
docker compose up -d --build
docker image prune -f
```
