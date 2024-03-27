const mongoose = require('mongoose');

const Utilisateur = new mongoose.Schema({
    nom : String,
    email : String,
    login : String,
    mdp : String,
});

module.exports = mongoose.model('Utilisateur', Utilisateur);