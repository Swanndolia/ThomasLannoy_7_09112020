const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signup = (req, res, next) => {
  mailBody = req.body.mail.split("@");
  bcrypt
    .hash(req.body.pass, 10)
    .then((hash) => {
      const user = new User({
        mail: secureCrypt(mailBody[0]) + "@" + mailBody[1],
        pass: hash,
        username: secureCrypt(req.body.username),
      });
      user
        .save()
        .then(() =>
          res.status(201).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
          })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  //si l'utilisateur a utilisé son email
  if (req.body.username.includes("@")) {
    userBody = req.body.username.split("@");
    User.findOne({ mail: secureCrypt(userBody[0]) + "@" + userBody[1] })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(req.body.pass, user.pass)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } //si l'utilisateur a utilisé son username
  else {
    User.findOne({ username: secureCrypt(req.body.username) })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(req.body.pass, user.pass)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.getOneUser = (req, res, next) => {
  User.findOne({
    _id: req.params.id,
  })
    .then((user) => {
      user.username = secureCrypt(user.username);
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifyUser = (req, res, next) => {
  req.body.username = secureCrypt(req.body.username);
  const userObject = req.file
    ? {
        username: req.body.username,
        about: req.body.about,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  User.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "User modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
