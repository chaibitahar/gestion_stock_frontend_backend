// controllers/HistoriqueStockController.js

import HistoriqueStock from '../models/HistoriqueStock.js'
import Produit from '../models/Produit.js' 
import Utilisateur from '../models/Utilisateur.js' 

// --- 1. READ (All) : Récupérer tout l'historique (GET) ---
// 🔑 FIX: Ajout du mot-clé 'export'
export const getAllHistorique = async (req, res) => {
    try {
        const result = await HistoriqueStock.findAll({
            // Inclure les détails du Produit et de l'Utilisateur
            include: [Produit, Utilisateur]
        }) 
        res.status(200).json({ data: result }) 
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
}

// --- 2. CREATE : Enregistrer un nouveau mouvement de stock (POST) ---
// 🔑 FIX: Ajout du mot-clé 'export'
export const addMouvementStock = async (req, res) => {
    // 1. 🔑 SÉCURITÉ : On prend l'ID utilisateur du jeton JWT (req.utilisateur est rempli par le middleware 'authentification')
    const utilisateurId = req.utilisateur.id; 

    // 2. CORRECTION : On prend uniquement les données non sécurisées du corps
    // L'utilisateur ne peut plus envoyer son propre ID utilisateur dans le corps (sécurité)
    const { produitId, quantiteChangee } = req.body

    // Validation minimale (ne vérifie plus utilisateurId dans le corps)
    if (!produitId || !quantiteChangee) {
        return res.status(400).json({ message: 'produitId et quantiteChangee sont requis.' })
    }

    const mouvement = parseInt(quantiteChangee)

    try {
        // 1. Enregistrer le mouvement dans l'historique
        const mouvementEnregistre = await HistoriqueStock.create({
            produitId,
            quantiteChangee: mouvement,
            utilisateurId // Utilise l'ID sécurisé du jeton!
        })
        
        // 2. Mettre à jour la quantité du produit
        const produit = await Produit.findByPk(produitId)
        
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé pour la mise à jour du stock.' })
        }

        const nouvelleQuantite = produit.quantite + mouvement
        
        await Produit.update(
            { quantite: nouvelleQuantite }, 
            { where: { id: produitId } }
        )

        res.status(201).json({ 
            data: mouvementEnregistre, 
            message: `Mouvement enregistré. Nouveau stock du produit ${produitId}: ${nouvelleQuantite}`
        }) 

    } catch (error) {
        res.status(400).json({ message: error.message }) 
    }
}

// --- 3. READ (By Product) : Récupérer l'historique d'un produit (GET /produit/:id) ---
// 🔑 FIX: Ajout du mot-clé 'export'
export const getHistoriqueByProduit = async (req, res) => {
    const { idProduit } = req.params 

    if (!idProduit) return res.status(400).json({ message: 'L\'ID du produit est requis.'}) 

    try {
        const result = await HistoriqueStock.findAll({
            where: { produitId: idProduit },
            include: [Produit, Utilisateur],
            order: [['date', 'DESC']] // Afficher le plus récent en premier
        }) 
        
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}