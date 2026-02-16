// controllers/HomeController.js

import Produit from '../models/Produit.js';
import Utilisateur from '../models/Utilisateur.js';

export const getDashboard = async (req, res) => {
    try {
        // Si l'utilisateur n'est pas connecté, on affiche juste la page simple sans charger les données
        if (!req.session.user) {
            return res.render('index', { user: null });
        }

        // --- 1. Récupérer les données ---
        const userCount = await Utilisateur.count();
        const productCount = await Produit.count();
        const produits = await Produit.findAll();

        // --- 2. Calculs (Valeur du stock & Ruptures) ---
        let stockValue = 0;
        let lowStockCount = 0;

        produits.forEach(prod => {
            // Calcul de la valeur totale (Prix * Quantité)
            stockValue += (prod.prix * prod.quantite);

            // Vérification stock faible (5 ou moins)
            if (prod.quantite <= 5) {
                lowStockCount++;
            }
        });

        // --- 3. Envoyer à la vue ---
        res.render('index', {
            nbUtilisateurs: userCount,
            nbProduits: productCount,
            valeurStock: stockValue.toFixed(2), // 2 chiffres après la virgule
            alerteStock: lowStockCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur dashboard");
    }
};