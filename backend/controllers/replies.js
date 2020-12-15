const db = require("../models");

exports.replyComment = (req, res, next) => {
  if (req.body.imageUrl) {
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`;
  }
  db.replies
    .create({ content: req.body.content, imageUrl: req.body.imageUrl, userId: req.body.userId, commentId: req.params.id })
    .then(() => res.status(201).json({ message: "Vous avez replyé ce comment" }))
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.reactToReply = (req, res, next) => {
  db.reactsReply
    .findOne({
      where: {
        replyId: req.params.replyId,
        userId: req.body.userId,
      },
    })
    .then((react) => {
      if (react != null) {
        if (react.react == req.body.react) {
          db.reactsReply
            .destroy({ where: { replyId: req.params.replyId, userId: req.body.userId } })
            .then(() => res.status(201).json({ message: "reaction supprimée avec succès ! " }))
            .catch((error) => {
              console.log(error);
              res.status(400).json({ error: error });
            });
        } else {
          db.reactsReply
            .update({ react: req.body.react }, { where: { replyId: req.params.replyId, userId: req.body.userId } })
            .then(() => res.status(201).json({ message: "reaction modifiée avec succès ! ", react: req.body.react }))
            .catch((error) => {
              console.log(error);
              res.status(400).json({ error: error });
            });
        }
      } else {
        db.reactsReply
          .create({ replyId: req.params.replyId, react: req.body.react, userId: req.body.userId })
          .then(() => res.status(201).json({ message: "reaction ajoutée avec succès !", react: req.body.react }))
          .catch((error) => {
            res.status(400).json({ error: error });
          });
      }
    });
};

exports.modifyReply = (req, res, next) => {
  db.replies
    .findOne({
      where: {
        id: req.params.replyId,
      },
    })
    .then((reply) => {
      reply.content = req.body.content;
      if (req.body.imageUrl) {
        reply.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`;
      }
      reply.save();
      res.status(200).json(reply.id + " has been modified");
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.deleteReply = (req, res, next) => {
  db.replies
    .findOne({
      where: {
        id: req.params.replyId,
      },
    })
    .then((reply) => {
      reply.destroy();
      res.status(200).json(reply.id + " has been deleted");
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
