import express from 'express'
import { 
    getAllProduits, 
    renderAddProduit, 
    addProduit, 
    renderEditProduit, 
    updateProduit, 
    deleteProduit 
} from '../controllers/ProduitController.js'

// --- CORRECTION ICI : On importe isLogged, pas authentification ---
import { isLogged } from '../middleware/auth.js';

const router = express.Router()

// On protège les routes avec isLogged
router.get('/', isLogged, getAllProduits)

router.get('/ajouter', isLogged, renderAddProduit)
router.post('/ajouter', isLogged, addProduit)

router.get('/edit/:id', isLogged, renderEditProduit)
router.post('/edit/:id', isLogged, updateProduit)

router.get('/delete/:id', isLogged, deleteProduit)

export default router