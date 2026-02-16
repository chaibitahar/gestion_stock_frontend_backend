import express from 'express'
import { 
    getAllUtilisateurs, 
    renderAddForm, 
    addUtilisateur, 
    renderEditForm, 
    updateUtilisateur, 
    deleteUtilisateur 
} from '../controllers/UtilisateurController.js'

// --- CORRECTION ICI : On importe isLogged ---
import { isLogged } from '../middleware/auth.js';

const router = express.Router()

// On protège les routes avec isLogged
router.get('/', isLogged, getAllUtilisateurs)

router.get('/ajouter', isLogged, renderAddForm)
router.post('/ajouter', isLogged, addUtilisateur)

router.get('/edit/:id', isLogged, renderEditForm)
router.post('/edit/:id', isLogged, updateUtilisateur)

router.get('/delete/:id', isLogged, deleteUtilisateur)

export default router