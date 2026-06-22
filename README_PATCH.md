# Patch de configuration unique

Copier le contenu de ce dossier à la racine du projet CuisineEnsemble en acceptant le remplacement des fichiers.

Sous Windows, exécuter ensuite :

```bat
scripts\cleanup_unified_config.bat
copy .env.example .env
```

Ne remplace pas un `.env` déjà configuré sans sauvegarder ses valeurs.

Puis reconstruire :

```bat
docker compose down
docker compose up -d --build
docker compose ps
curl http://localhost/api/health
```
