@echo off
setlocal

echo Suppression des anciens doublons de production...

if exist docker-compose.prod.yml del /Q docker-compose.prod.yml
if exist .env.production.example del /Q .env.production.example
if exist frontend\Dockerfile.prod del /Q frontend\Dockerfile.prod
if exist frontend\nginx.prod.conf del /Q frontend\nginx.prod.conf
if exist nginx\nginx.prod.conf del /Q nginx\nginx.prod.conf
if exist backend\app\routers\admin_schemas.py del /Q backend\app\routers\admin_schemas.py

echo Nettoyage termine.
echo Le dossier php-alternative n'a pas ete supprime automatiquement.
endlocal
