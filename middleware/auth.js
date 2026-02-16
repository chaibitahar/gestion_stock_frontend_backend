// middleware/auth.js

export const isLogged = (req, res, next) => {
    // Si l'utilisateur est connecté (il a une session), on le laisse passer
    if (req.session.user) {
        return next();
    }
    
    // Sinon, on le renvoie vers la page de connexion
    res.redirect('/login');
}