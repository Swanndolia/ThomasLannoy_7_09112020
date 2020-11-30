const db = require("../models");
const User = db.users;
const Post = db.posts;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.signup = (req, res) => {
  mailBody = req.body.mail.split("@");
  bcrypt
    .hash(req.body.pass, 10)
    .then((hash) => {
      const user = {
        mail: secureCrypt(mailBody[0]) + "@" + mailBody[1],
        pass: hash,
        username: secureCrypt(req.body.username),
      };
      User.create(user)
        .then(() => {
          res.status(201).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the User.",
          });
        });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.login = (req, res) => {
  //si l'utilisateur a utilisé son email
  if (req.body.username.includes("@")) {
    userBody = req.body.username.split("@");
    User.findOne({ where: { mail: secureCrypt(userBody[0]) + "@" + userBody[1] } })
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
    User.findOne({ where: { username: secureCrypt(req.body.username) } })
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
            res.status(201).json({
              userId: user.id,
              token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
            });
            console.log(res.locals);
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.getOneUser = (req, res) => {
  User.findOne({
    id: req.params.id,
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

exports.modifyUser = (req, res) => {
  req.body.username = secureCrypt(req.body.username);
  if (req.body.imageUrl) {
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  User.update({ username: req.body.username, about: req.body.about, imageUrl: req.body.imageUrl }, { where: { id: req.params.id } })
    .then()
    .catch((error) => res.status(400).json({ error }));
  Post.findAll({ userId: req.params.id })
    .then((posts) => {
      if (posts[0]) {
        if (!req.body.imageUrl) {
          req.body.imageUrl = posts[0].userImageUrl;
        } else {
          req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        }
        Post.update({ username: secureCrypt(req.body.username), userImageUrl: req.body.imageUrl }, { where: { userId: req.params.id } })
          .then(() => res.status(200).json({ message: "User et infos des posts modifiées !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllUsers = (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Delete a User with the specified id in the request
exports.deleteUser = (req, res) => {};
