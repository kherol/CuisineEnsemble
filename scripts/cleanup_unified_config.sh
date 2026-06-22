#!/usr/bin/env sh
set -eu

rm -f docker-compose.prod.yml
rm -f .env.production.example
rm -f frontend/Dockerfile.prod
rm -f frontend/nginx.prod.conf
rm -f nginx/nginx.prod.conf
rm -f backend/app/routers/admin_schemas.py

echo "Nettoyage terminé. Le dossier php-alternative n'a pas été supprimé automatiquement."
