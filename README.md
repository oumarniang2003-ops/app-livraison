# Yeggo — Livraison de colis à Dakar

MVP : client crée une demande de livraison, l'admin assigne un livreur de la petite équipe dédiée, le livreur met à jour le statut et partage sa position en direct, le client suit en temps réel.

## Mise en route

1. Créer une base Postgres (Neon recommandé, comme pour Bacversite) et copier son URL de connexion.
2. Copier `.env.local.example` en `.env.local` et remplir `DATABASE_URL` et `JWT_SECRET` (une chaîne aléatoire longue).
3. Exécuter le schéma sur la base : `psql "$DATABASE_URL" -f db/schema.sql` (ou coller le contenu dans la console SQL de Neon).
4. Installer les dépendances : `npm install`
5. Créer le premier compte admin : `node --env-file=.env.local scripts/creer-admin.mjs`
6. Lancer le serveur : `npm run dev`, puis ouvrir http://localhost:3000

## Comptes et rôles

- **Client** : s'inscrit lui-même sur `/inscription`. Crée des demandes de livraison sur `/app`.
- **Livreur** : compte créé par l'admin sur `/admin/livreurs`. Gère ses courses sur `/livreur`.
- **Admin** : créé via le script `creer-admin.mjs`. Assigne les livreurs et gère l'équipe sur `/admin`.

## Ce qui est fait (MVP)

- Auth par téléphone + mot de passe (cookie JWT)
- Création de demande de livraison par le client
- Assignation manuelle d'un livreur par l'admin, avec prix
- Progression du statut par le livreur (récupéré → en livraison → livré)
- Partage de position GPS du livreur pendant la course (geolocation navigateur)
- Suivi temps réel côté client (rafraîchissement automatique toutes les 5s)
- Historique des statuts par livraison
- Carte de suivi en direct (Leaflet + OpenStreetMap, gratuit, sans compte ni carte bancaire) : position du livreur, départ, arrivée
- Géocodage automatique des adresses saisies (via Nominatim/OpenStreetMap) pour les placer sur la carte

## Pas encore fait (prochaines étapes)

- Paiement Wave / Orange Money intégré (pour l'instant : cash ou paiement manuel hors app)
- Calcul automatique du prix selon la distance
- Notifications (SMS/push) au client et au livreur
- Système d'adressage/repères propre à Dakar
