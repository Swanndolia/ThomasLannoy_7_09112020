const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Create and Save a new db.users
exports.signup = (req, res, next) => {
  mailBody = req.body.mail.split("@");
  bcrypt
    .hash(req.body.pass, 10)
    .then((hash) => {
      const user = {
        mail: secureCrypt(mailBody[0]) + "@" + mailBody[1],
        pass: hash,
        username: secureCrypt(req.body.username),
      };
      db.users
        .create(user)
        .then((user) => {
          res.status(201).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the db.users.",
          });
        });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
  //si l'utilisateur a utilisé son email
  if (req.body.username.includes("@")) {
    userBody = req.body.username.split("@");
    db.users
      .findOne({ where: { mail: secureCrypt(userBody[0]) + "@" + userBody[1] } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(req.body.pass, user.pass)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user.id,
              token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } //si l'utilisateur a utilisé son username
  else {
    db.users
      .findOne({ where: { username: secureCrypt(req.body.username) } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(req.body.pass, user.pass)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user.id,
              token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.getOneUser = (req, res, next) => {
  db.users
    .findOne({
      where: {
        id: req.params.id,
      },
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
  if (req.body.imageUrl) {
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  db.users
    .update({ username: req.body.username, about: req.body.about, imageUrl: req.body.imageUrl }, { where: { id: req.params.id } })
    .then(() => res.status(200).json({ message: "db.users et infos des posts modifiées !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllUsers = (req, res, next) => {
  db.users
    .findAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Delete a db.users with the specified id in the request
exports.deleteUser = (req, res, next) => {
  db.users
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((user) => {
      user.destroy();
      res.status(200).json(user.id + " has been deleted");
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
