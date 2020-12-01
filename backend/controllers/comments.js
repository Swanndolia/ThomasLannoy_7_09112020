const db = require("../models");

exports.commentPost = (req, res, next) => {
    if (req.body.imageUrl) {
      req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`;
    }
    db.comments
      .create({ content: req.body.content, imageUrl:req.body.imageUrl, userId: req.body.userId, postId: req.params.id })
      .then(() => res.status(201).json({ message: "Vous avez commenté ce post" }))
      .catch((error) => {
        res.status(400).json({ error: error });
      });
  };

exports.reactToComment = (req, res, next) => {
    db.posts
      .findOne({
        id: req.params.id,
      })
      .then((post) => {
        if (req.body.like == 1) {
          res.status(201).json({ message: "Like ajouté avec succès !" });
        }
        if (req.body.like == -1) {
          res.status(201).json({ message: "Dislike ajouté avec succès !" });
        }
      });
  };