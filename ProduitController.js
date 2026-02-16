// controllers/ProduitController.js

import Produit from '../models/Produit.js'
// Importez les modèles liés pour l'inclusion dans les requêtes et les formulaires
import Categorie from '../models/Categorie.js'
import Fournisseur from '../models/Fournisseur.js'

// =========================================================
// 1. LECTURE (READ) - LISTE
// =========================================================
export const getAllProduits = async (req, res) => {
    try {
        // Option 'include' pour afficher les détails de la Catégorie et du Fournisseur
        const result = await Produit.findAll({
            include: [Categorie, Fournisseur]
        }) 
        // MODIFICATION : On affiche la vue 'produits/list.ejs'
        res.render('produits/list', { produits: result }) 
    } catch (error) {
        res.status(500).send("Erreur : " + error.message) 
    }
}

// =========================================================
// 2. AJOUT (CREATE)
// =========================================================

// NOUVEAU : Afficher le formulaire d'ajout
export const renderAddProduit = async (req, res) => {
    try {
        // On récupère les catégories et fournisseurs pour les listes déroulantes
        const categories = await Categorie.findAll();
        const fournisseurs = await Fournisseur.findAll();
        
        res.render('produits/add', { 
            categories: categories,
            fournisseurs: fournisseurs
        });
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
}

// Traiter l'ajout
export const addProduit = async (req, res) => {
    const newProduit = { 
        nom: req.body.nom, 
        quantite: req.body.quantite || 0, // Par défaut à 0
        prix: req.body.prix,
        categorieId: req.body.categorieId,
        fournisseurId: req.body.fournisseurId,
    }

    try {
        await Produit.create(newProduit) 
        // MODIFICATION : Redirection vers la liste
        res.redirect('/produits');
    } catch (error) {
        res.status(400).send("Erreur lors de l'ajout : " + error.message) 
    }
}

// =========================================================
// 3. MODIFICATION (UPDATE)
// =========================================================

// NOUVEAU : Afficher le formulaire de modification
export const renderEditProduit = async (req, res) => {
    const { id } = req.params;
    try {
        const produit = await Produit.findByPk(id);
        const categories = await Categorie.findAll();
        const fournisseurs = await Fournisseur.findAll();

        if (!produit) return res.status(404).send("Produit introuvable");

        res.render('produits/edit', { 
            produit: produit,
            categories: categories,
            fournisseurs: fournisseurs
        });
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
}

// Traiter la modification
export const updateProduit = async (req, res) => {
    const { id } = req.params
    const updatedData = { 
        nom: req.body.nom, 
        quantite: req.body.quantite,
        prix: req.body.prix,
        categorieId: req.body.categorieId,
        fournisseurId: req.body.fournisseurId,
    }

    try {
        await Produit.update(updatedData, { where: { id } }) 
        // MODIFICATION : Redirection vers la liste
        res.redirect('/produits');
    } catch (error) {
        res.status(400).send("Erreur lors de la modification : " + error.message)
    }
}

// =========================================================
// 4. SUPPRESSION (DELETE)
// =========================================================
export const deleteProduit = async (req, res) => {
    const { id } = req.params
    try {
        await Produit.destroy({ where: { id }}) 
        // MODIFICATION : Redirection vers la liste
        res.redirect('/produits');
    } catch (error) {
        res.status(400).send("Erreur lors de la suppression : " + error.message) 
    }
}