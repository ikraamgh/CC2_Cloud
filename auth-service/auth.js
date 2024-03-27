const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const Utilisateur = require('./model');

const app = express();
app.use(express.json())
require('dotenv').config();

router.post('/register', async (req, res) => {
    const { nom, email, login, mdp } = req.body;
    try {
        let utilisateur = await Utilisateur.findOne({ email });
        if (utilisateur) {
            return res.status(409).send("Cet e-mail est déjà utilisé.");
        }
        const hashedPassword = await bcrypt.hash(mdp, 10);
        utilisateur = new Utilisateur({ nom, email, login, mdp: hashedPassword });
        await utilisateur.save();
        res.status(201).send('success');
    } catch (error) {
        console.error('ERROR', error);
        res.status(400).send("Erreur de saisie");
    }
});

router.post('/login', async (req, res) => {
    try {
        const { login, mdp } = req.body;
        const utilisateur = await Utilisateur.findOne({ login });
        if (!utilisateur) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }
        const passwordMatch = await bcrypt.compare(mdp, utilisateur.mdp);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }
        const token = jwt.sign({ userId: utilisateur._id }, 'votre_secret');
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur serveur");
    }
});

router.get('/utilisateur/existe/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const utilisateur = await Utilisateur.findOne({ email });
        if (utilisateur) {
            return res.status(200).json({ exists: true });
        }
        res.status(404).json({ exists: false });
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;
