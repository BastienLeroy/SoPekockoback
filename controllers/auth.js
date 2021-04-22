const bcrypt = require('bcrypt');// requete des differents module
const jwt = require('jsonwebtoken');
const User = require('../models/auth');


exports.signup = (req, res, next) => {
    console.log("req.body signup:", req.body);

    const password = req.body.password;

    bcrypt.hash(password, 10)// permet de crypté le MDP
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
              });
            user.save()// enregistre le MDP sur DB
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => {
                    res.status(400).json({ error })// renvoi une erreur si problème rencontrer
                });
            })
            .catch(error => {
                res.status(500).json({ error });// renvoi une erreur si problème rencontrer
                
            });
        };

exports.login = (req, res, next) => {
	User.findOne({user: req.body.user, email: req.body.email })//recupere et compare les mail utilisateur
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });//si mail non enregistrer dans DB alors rencois un message d'erreur
        }
        bcrypt.compare(req.body.password, user.password)//recupere et compare les MDP utilisateur
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });//si MDP non reconnu dans DB alors rencois un message d'erreur
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
            
        });
    })};
