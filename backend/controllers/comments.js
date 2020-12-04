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

  };