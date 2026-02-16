// routes/fournisseurRoutes.js

import express from 'express'
import { 
    getAllFournisseurs, 
    getFournisseurById, 
    addFournisseur, 
    updateFournisseur, 
    deleteFournisseur 
} from '../controllers/FournisseurController.js'

// 1. On importe le middleware de sécurité (Session)
import { isLogged } from '../middleware/auth.js'; 

const router = express.Router()

// 2. On protège toutes les routes avec isLogged

// Route principale /api/fournisseurs
router.route('/')
    .get(isLogged, getAllFournisseurs)  // Protégé
    .post(isLogged, addFournisseur)     // Protégé

// Route par ID /api/fournisseurs/:id
router.route('/:id')
    .get(isLogged, getFournisseurById)  // Protégé
    .put(isLogged, updateFournisseur)   // Protégé
    .delete(isLogged, deleteFournisseur)// Protégé

export default router