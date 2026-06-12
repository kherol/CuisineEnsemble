#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
CONTAINER="${POSTGRES_CONTAINER:-cuisineensemble-db}"
DB_NAME="${POSTGRES_DB:-cuisineensemble}"
DB_USER="${POSTGRES_USER:-cuisine_user}"
DATE=$(date +"%Y%m%d_%H%M%S")

mkdir -p "$BACKUP_DIR"
docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/cuisineensemble_$DATE.sql"

echo "Sauvegarde créée : $BACKUP_DIR/cuisineensemble_$DATE.sql"
