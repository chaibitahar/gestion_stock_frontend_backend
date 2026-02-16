  Projet : Système de Gestion de Stock
  Description
Ce projet est une application web complète (Fullstack) permettant de gérer un inventaire de produits. Il permet de suivre les quantités en stock, d'ajouter de nouveaux articles et de mettre à jour les informations en temps réel.

 Technologies Utilisées

Backend : Node.js et Express.js.


Base de données : MySQL avec l'ORM Sequelize.
+1


Frontend :  EJS et Vue.js.


Tests API : Postman.


Gestion de versions : GitHub
-Installer les dépendances :npm install
-Configurer l'environnement :
Crée un fichier .env à la racine et ajoute tes accès MySQL:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=express_orm
DB_DIALECT=mysql
-Structure de la Base de Données
Le projet utilise une architecture MVC. Les tables principales sont :
categorie:id ,nom
Produits : id, nom,description, quantite, prix.
Utilisateurs & Rôles : Pour l'authentification et l'autorisation.
fournisseur:id,nom,email
historique_stock:id,quantitedechange
