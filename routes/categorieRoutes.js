// routes/categorieRoutes.js

import express from 'express'
import { 
    getAllCategories, 
    getCategorieById, 
    addCategorie, 
    updateCategorie, 
    deleteCategorie 
} from '../controllers/CategorieController.js'

// 1. On importe le middleware de sécurité (Session)
import { isLogged } from '../middleware/auth.js';

const router = express.Router()

// 2. On protège toutes les routes avec isLogged

router.route('/')
    .get(isLogged, getAllCategories)  // GET /api/categories (Protégé)
    .post(isLogged, addCategorie)     // POST /api/categories (Protégé)

router.route('/:id')
    .get(isLogged, getCategorieById)  // GET /api/categories/:id (Protégé)
    .put(isLogged, updateCategorie)   // PUT /api/categories/:id (Protégé)
    .delete(isLogged, deleteCategorie)// DELETE /api/categories/:id (Protégé)

export default router