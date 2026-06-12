# Sécurité — CuisineEnsemble

## Points à respecter

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Routes privées protégées
- Rôles utilisateur/admin
- Validation des données côté backend
- CORS limité aux domaines autorisés
- HTTPS obligatoire en production
- Ne jamais stocker de secret dans Git

## Sécurité alimentaire

Les allergies et régimes sont déclarés par les utilisateurs. L’application doit afficher un avertissement clair :

> Les informations sur les allergènes sont déclarées par l’hôte. Les participants doivent vérifier directement avec l’hôte avant le repas.

## OWASP

À surveiller :

- Injection SQL : utiliser ORM SQLAlchemy
- XSS : échapper les contenus affichés
- Authentification cassée : sécuriser tokens et mots de passe
- Contrôle d’accès : vérifier hôte/admin/participant
- Données sensibles : ne pas exposer hash ou secrets
