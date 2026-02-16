// routes/historiqueStockRoutes.js

import express from 'express'

// --- CORRECTION : On importe isLogged au lieu de authentification ---
import { isLogged } from '../middleware/auth.js'

import { 
    getAllHistorique, 
    addMouvementStock, 
    getHistoriqueByProduit
} from '../controllers/HistoriqueStockController.js'

const router = express.Router()

router.route('/')
    // On remplace authentification par isLogged partout
    .get(isLogged, getAllHistorique)       // GET /api/stock/historique
    .post(isLogged, addMouvementStock)     // POST /api/stock/historique
    
router.route('/produit/:idProduit')
    .get(isLogged, getHistoriqueByProduit) // GET /api/stock/historique/produit/:idProduit
    .post(isLogged, addMouvementStock)

export default router