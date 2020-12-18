const db = require("../models");

exports.commentPost = (req, res, next) => {
  if (req.body.imageUrl) {
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`;
  }
  db.comments
    .create({ content: req.body.content, imageUrl: req.body.imageUrl, userId: req.body.userId, postId: req.params.id })
    .then(() => res.status(201).json({ message: "Vous avez commenté ce post" }))
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.reactToComment = (req, res, next) => {
  db.reactsComment
    .findOne({
      where: {
        commentId: req.params.commentId,
        userId: req.body.userId,
      },
    })
    .then((react) => {
      if (react != null) {
        if (react.react == req.body.react) {
          db.reactsComment
            .destroy({ where: { commentId: req.params.commentId, userId: req.body.userId } })
            .then(() => res.status(201).json({ message: "reaction supprimée avec succès ! " }))
            .catch((error) => {
              console.log(error);
              res.status(400).json({ error: error });
            });
        } else {
          db.reactsComment
            .update({ react: req.body.react }, { where: { commentId: req.params.commentId, userId: req.body.userId } })
            .then(() => res.status(201).json({ message: "reaction modifiée avec succès ! ", react: req.body.react }))
            .catch((error) => {
              console.log(error);
              res.status(400).json({ error: error });
            });
        }
      } else {
        db.reactsComment
          .create({ commentId: req.params.commentId, react: req.body.react, userId: req.body.userId })
          .then(() => res.status(201).json({ message: "reaction ajoutée avec succès !", react: req.body.react }))
          .catch((error) => {
            res.status(400).json({ error: error });
          });
      }
    });
};

exports.modifyComment = (req, res, next) => {
  db.comments
    .findOne({
      where: {
        id: req.params.commentId,
      },
    })
    .then((comment) => {
      comment.content = req.body.content;
      if (req.body.imageUrl) {
        comment.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`;
      }
      if (
        jwt.verify(token, "txRcW5wXc0jlGKupdavvxTQ4Fd8P7Jzcqa4GmM6CJC5VYOySzdaoFc5Pg2mCb04dY9X6s16d65NiBxtGqagr6bd2UCa4721QgfIWMuBwMIWhzeY8Z3Y4s2DoSGXeNV2c")
          .isOp ||
        jwt.verify(token, "txRcW5wXc0jlGKupdavvxTQ4Fd8P7Jzcqa4GmM6CJC5VYOySzdaoFc5Pg2mCb04dY9X6s16d65NiBxtGqagr6bd2UCa4721QgfIWMuBwMIWhzeY8Z3Y4s2DoSGXeNV2c")
          .userId == comment.userId
      ) {
        comment.save();
        res.status(200).json(comment.id + " has been modified");
      } else {
        res.status(401).json("Tentative de piratage détectée");
      }
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.deleteComment = (req, res, next) => {
  db.comments
    .findOne({
      where: {
        id: req.params.commentId,
      },
    })
    .then((comment) => {
      if (
        jwt.verify(token, "txRcW5wXc0jlGKupdavvxTQ4Fd8P7Jzcqa4GmM6CJC5VYOySzdaoFc5Pg2mCb04dY9X6s16d65NiBxtGqagr6bd2UCa4721QgfIWMuBwMIWhzeY8Z3Y4s2DoSGXeNV2c")
          .isOp ||
        jwt.verify(token, "txRcW5wXc0jlGKupdavvxTQ4Fd8P7Jzcqa4GmM6CJC5VYOySzdaoFc5Pg2mCb04dY9X6s16d65NiBxtGqagr6bd2UCa4721QgfIWMuBwMIWhzeY8Z3Y4s2DoSGXeNV2c")
          .userId == comment.userId
      ) {
        comment.destroy();
        res.status(200).json(comment.id + " has been deleted");
      } else {
        res.status(401).json("Tentative de piratage détectée");
      }
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
