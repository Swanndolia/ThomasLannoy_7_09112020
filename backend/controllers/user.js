const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

function rot13(str) {
  const input = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const output = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm";
  const index = (x) => input.indexOf(x);
  const translate = (x) => (index(x) > -1 ? output[index(x)] : x);
  return str.split("").map(translate).join("");
}

exports.signup = (req, res, next) => {
  emailBody = req.body.email.split("@");
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: rot13(emailBody[0]) + "@" + emailBody[1],
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  emailBody = req.body.email.split("@");
  User.findOne({ email: rot13(emailBody[0]) + "@" + emailBody[1] })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
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
};
