// index.js
import { getDashboard } from './controllers/HomeController.js'; // Import du contrôleur Dashboard
import express from 'express'
import connexion from './connexion.js' 
import session from 'express-session';

// Importation des modèles
import Role from './models/Role.js' 
import Utilisateur from './models/Utilisateur.js' 
import Categorie from './models/Categorie.js' 
import Fournisseur from './models/Fournisseur.js' 
import Produit from './models/Produit.js' 
import HistoriqueStock from './models/HistoriqueStock.js'

// Importation des routeurs API
import fournisseurRoutes from './routes/fournisseurRoutes.js'
import categorieRoutes from './routes/categorieRoutes.js'
import produitRoutes from './routes/produitRoutes.js'
import historiqueStockRoutes from './routes/historiqueStockRoutes.js'
import utilisateurRoutes from './routes/utilisateurRoutes.js'

// Import des fonctions de Login depuis le contrôleur
import { renderLogin, loginUtilisateur } from './controllers/UtilisateurController.js'

const app = express()

// ----------------------------------------------------
// --- Configuration pour le FRONTEND (EJS) ---
// ----------------------------------------------------

app.set('view engine', 'ejs');
app.set('views', './views'); 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 
app.use(session({
    secret: 'mon_secret_12345', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Middleware pour rendre l'utilisateur disponible dans toutes les pages
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(express.json()) 

// Routes API
app.use('/api/fournisseurs', fournisseurRoutes)
app.use('/api/categories', categorieRoutes)
app.use('/api/stock/historique', historiqueStockRoutes)

// Routes Frontend
app.use('/produits', produitRoutes) 
app.use('/utilisateurs', utilisateurRoutes)

// Routes d'Authentification
app.get('/login', renderLogin);       
app.post('/login', loginUtilisateur); 

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// --- CORRECTION ICI : On utilise le contrôleur getDashboard ---
app.get('/', getDashboard);

// ----------------------------------------------------

const startDB = async () => {
    try {
        await connexion.authenticate()
        console.log('Connexion à la base de données réussie !')

        await connexion.sync({ alter: true }) 
        console.log('Toutes les tables sont synchronisées.')

        // 1. CRÉATION DES RÔLES
        const roleCount = await Role.count();
        if (roleCount === 0) {
            await Role.bulkCreate([{ nom: 'Admin' }, { nom: 'Utilisateur' }]);
            console.log('✅ Rôles créés !');
        }

        // 2. CRÉATION DES CATÉGORIES
        const catCount = await Categorie.count();
        if (catCount === 0) {
            await Categorie.bulkCreate([{ nom: 'Informatique' }, { nom: 'Bureautique' }]);
            console.log('✅ Catégories créées !');
        }

        // 3. CRÉATION D'UN FOURNISSEUR
        const fourCount = await Fournisseur.count();
        if (fourCount === 0) {
            await Fournisseur.create({ nom: 'Fournisseur Général', email: 'contact@test.com' });
            console.log('✅ Fournisseur créé !');
        }

        const PORT = process.env.PORT || 5000 
        app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`))
    } catch (error) {
        console.error('Erreur :', error.message)
    }
}

startDB()