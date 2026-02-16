// controllers/UtilisateurController.js

import Utilisateur from '../models/Utilisateur.js'
import Role from '../models/Role.js'
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken' 
import dotenv from 'dotenv'

dotenv.config() 
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_par_defaut' 

// =========================================================
// 1. LECTURE (READ) - LISTE
// =========================================================

// AFFICHER LA LISTE (GET /utilisateurs)
export const getAllUtilisateurs = async (req, res) => {
    try {
        const result = await Utilisateur.findAll({
            attributes: { exclude: ['motDePasse'] }, 
            include: [Role]
        }) 
        // Affiche la vue 'list.ejs' avec les données
        res.render('utilisateurs/list', { users: result }) 
    } catch (error) {
        res.status(500).send("Erreur : " + error.message) 
    }
}

// =========================================================
// 2. AJOUT (CREATE)
// =========================================================

// AFFICHER LE FORMULAIRE D'AJOUT (GET /utilisateurs/ajouter)
export const renderAddForm = async (req, res) => {
    try {
        // On a besoin de la liste des rôles pour le menu déroulant
        const roles = await Role.findAll();
        res.render('utilisateurs/add', { roles: roles });
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
}

// TRAITER LE FORMULAIRE D'AJOUT (POST /utilisateurs/ajouter)
export const addUtilisateur = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.motDePasse, salt);
        
        const newUser = { 
            nom: req.body.nom, 
            prenom: req.body.prenom,
            email: req.body.email,
            motDePasse: hashedPassword,
            roleId: req.body.roleId 
        }

        await Utilisateur.create(newUser) 
        // Une fois créé, on retourne à la liste
        res.redirect('/utilisateurs');

    } catch (error) {
        res.status(400).send("Erreur lors de l'ajout : " + error.message) 
    }
}

// =========================================================
// 3. MODIFICATION (UPDATE)
// =========================================================

// AFFICHER LE FORMULAIRE DE MODIFICATION (GET /utilisateurs/edit/:id)
export const renderEditForm = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Utilisateur.findByPk(id);
        const roles = await Role.findAll();

        if (!user) {
            return res.status(404).send("Utilisateur non trouvé");
        }
        res.render('utilisateurs/edit', { user: user, roles: roles });
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
}

// TRAITER LE FORMULAIRE DE MODIFICATION (POST /utilisateurs/edit/:id)
export const updateUtilisateur = async (req, res) => {
    const { id } = req.params
    
    let updatedData = { 
        nom: req.body.nom, 
        prenom: req.body.prenom,
        email: req.body.email,
        roleId: req.body.roleId
    }

    // On ne hache le mot de passe que s'il a été modifié (champ non vide)
    if (req.body.motDePasse) { 
        const salt = await bcrypt.genSalt(10);
        updatedData.motDePasse = await bcrypt.hash(req.body.motDePasse, salt);
    }
    
    try {
        await Utilisateur.update(updatedData, { where: { id } }) 
        // Une fois modifié, on retourne à la liste
        res.redirect('/utilisateurs');
    } catch (error) {
        res.status(400).send("Erreur lors de la mise à jour : " + error.message)
    }
}

// =========================================================
// 4. SUPPRESSION (DELETE)
// =========================================================

// SUPPRIMER UN UTILISATEUR (GET /utilisateurs/delete/:id)
export const deleteUtilisateur = async (req, res) => {
    const { id } = req.params
    try {
        await Utilisateur.destroy({ where: { id }}) 
        // Une fois supprimé, on recharge la liste
        res.redirect('/utilisateurs');
    } catch (error) {
        res.status(400).send("Erreur lors de la suppression : " + error.message) 
    }
}

// =========================================================
// 5. AUTHENTIFICATION (LOGIN)
// =========================================================

// AFFICHER LE FORMULAIRE DE LOGIN (GET /login)
export const renderLogin = (req, res) => {
    res.render('login'); // Affiche views/login.ejs
}

// TRAITER LE LOGIN (POST /login)
export const loginUtilisateur = async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        // 1. Chercher l'utilisateur par son email
        const utilisateur = await Utilisateur.findOne({ where: { email } });
        
        // Si pas trouvé -> On réaffiche la page login avec une erreur
        if (!utilisateur) {
            return res.render('login', { error: 'Email introuvable.' });
        }
        
        // 2. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
        
        if (!isMatch) {
            return res.render('login', { error: 'Mot de passe incorrect.' });
        }

        // 3. ENREGISTRER DANS LA SESSION
        // C'est ce qui permet au site de se "souvenir" que tu es connecté
        req.session.user = {
            id: utilisateur.id,
            email: utilisateur.email,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            roleId: utilisateur.roleId
        };

        // 4. Succès -> Redirection vers l'accueil
        console.log(`Utilisateur ${email} connecté avec succès !`);
        res.redirect('/'); 

    } catch (error) {
        res.render('login', { error: "Erreur technique : " + error.message });
    }
}