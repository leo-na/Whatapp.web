# Chat Web UI — Interface de messagerie web (Vanilla JS)

Chat Web UI est une **interface de messagerie web** inspirée des applications de chat modernes.  
Le projet a été conçu pour reproduire les **comportements essentiels d’un système de discussion**, tout en restant volontairement simple, léger et sans framework JavaScript.

L’objectif principal est de travailler la **gestion de l’état côté client**, la **structuration du code** et la **qualité de l’expérience utilisateur**, en utilisant uniquement des technologies web natives.

---

##  Objectifs du projet

- Concevoir une interface de messagerie claire et intuitive
- Comprendre la logique d’un système de chat côté front-end
- Gérer plusieurs conversations de manière dynamique
- Mettre en place une persistance des données côté navigateur
- Travailler un layout responsive proche d’une application réelle
- Approfondir JavaScript **sans framework**

---

##  Structure et logique

Le projet repose sur une architecture front simple mais organisée :

- Séparation claire entre **UI**, **logique métier** et **données**
- Gestion centralisée de l’état des conversations
- Manipulation du DOM optimisée
- Code lisible et facilement extensible

Les données sont stockées localement dans le navigateur grâce au **LocalStorage**, permettant de conserver les conversations entre les sessions.

---

##  Fonctionnalités

### Gestion des conversations
- Affichage d’une liste de discussions avec aperçu du dernier message
- Sélection d’une conversation active
- Création de nouvelles discussions
- Réinitialisation ou suppression du contenu d’une conversation
- Indication des messages non lus

### Messages
- Envoi de messages avec horodatage
- Différenciation visuelle entre messages entrants et sortants
- Défilement automatique vers le dernier message
- Simulation de réponses automatiques pour reproduire un échange réel

### État & persistance
- Sauvegarde automatique des conversations via LocalStorage
- Restauration complète de l’état au rechargement de la page
- Conservation de la conversation active

---

##  Interface & expérience utilisateur

- Layout en deux colonnes (liste des discussions / conversation active)
- Interface responsive adaptée aux écrans plus petits
- États visuels clairs pour la conversation sélectionnée
- Bouton d’envoi désactivé lorsque le champ de saisie est vide
- Expérience fluide proche d’une application de messagerie réelle

---

##  Technologies utilisées

- **HTML5**
- **CSS3** (Flexbox, responsive design)
- **JavaScript Vanilla**
- **LocalStorage**

 Aucun framework JavaScript n’a été utilisé volontairement.

---

##  Lancer le projet

Le projet fonctionne entièrement côté client.

```bash
# Ouvrir simplement index.html
