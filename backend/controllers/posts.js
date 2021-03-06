const db = require("../models");
const jwt = require("jsonwebtoken");

exports.createPost = (req, res, next) => {
  if (req.body.imageUrl) {
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`;
  }
  db.posts
    .create(req.body)
    .then(() => res.status(201).json({ message: "Post créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next) => {
  db.posts
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.getAllPosts = (req, res, next) => {
  db.posts
    .findAll({
      include: [
        db.users,
        { model: db.reacts, include: [db.users] },
        { model: db.comments, include: [db.users, { model: db.replies, include: [db.users, db.reactsReply] }, db.reactsComment] },
      ],
      order: [["updatedAt", "DESC"]],
    })
    .then((posts) => {
      for (let i = 0; i < posts.length; i++) {
        posts[i].user.username = secureCrypt(posts[i].user.username);
        for (let k = 0; k < posts[i].comments.length; k++) {
          if (posts[i].comments[k]) {
            posts[i].comments[k].user.username = secureCrypt(posts[i].comments[k].user.username);
            for (let n = 0; n < posts[i].comments[k].replies.length; n++) {
              if (posts[i].comments[k].replies[n]) {
                posts[i].comments[k].replies[n].user.username = secureCrypt(posts[i].comments[k].replies[n].user.username);
                for (let r = 0; r < posts[i].comments[k].replies[n].reactsReplies.length; r++) {
                  if (posts[i].comments[k].replies[n].reactsReplies[r].react == 1) {
                    posts[i].comments[k].replies[n].likes++;
                  }
                  if (posts[i].comments[k].replies[n].reactsReplies[r].react == -1) {
                    posts[i].comments[k].replies[n].dislikes++;
                  }
                }
              }
            }
            for (let m = 0; m < posts[i].comments[k].reactsComments.length; m++) {
              if (posts[i].comments[k].reactsComments[m].react == 1) {
                posts[i].comments[k].likes++;
              }
              if (posts[i].comments[k].reactsComments[m].react == -1) {
                posts[i].comments[k].dislikes++;
              }
            }
          }
        }
        for (let j = 0; j < posts[i].reacts.length; j++) {
          if (posts[i].reacts[j].react == 1) {
            posts[i].likes++;
          }
          if (posts[i].reacts[j].react == -1) {
            posts[i].dislikes++;
          }
        }
      }
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};
exports.modifyPost = (req, res, next) => {
  db.posts
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((post) => {
      post.content = req.body.content;
      if (req.body.imageUrl) {
        post.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`;
      }
      const token = req.headers.authorization.split(" ")[1];
      if (
        jwt.verify(token, "txRcW5wXc0jlGKupdavvxTQ4Fd8P7Jzcqa4GmM6CJC5VYOySzdaoFc5Pg2mCb04dY9X6s16d65NiBxtGqagr6bd2UCa4721QgfIWMuBwMIWhzeY8Z3Y4s2DoSGXeNV2c")
          .isOp ||
        jwt.verify(token, "txRcW5wXc0jlGKupdavvxTQ4Fd8P7Jzcqa4GmM6CJC5VYOySzdaoFc5Pg2mCb04dY9X6s16d65NiBxtGqagr6bd2UCa4721QgfIWMuBwMIWhzeY8Z3Y4s2DoSGXeNV2c")
          .userId == post.userId
      ) {
        post.save();
        res.status(200).json(post.id + " has been modified");
      } else {
        res.status(401).json("Tentative de piratage détectée");
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(404).json({
        error: error,
      });
    });
};
exports.deletePost = (req, res, next) => {
  db.posts
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((post) => {
      const token = req.headers.authorization.split(" ")[1];
      if (
        jwt.verify(token, "txRcW5wXc0jlGKupdavvxTQ4Fd8P7Jzcqa4GmM6CJC5VYOySzdaoFc5Pg2mCb04dY9X6s16d65NiBxtGqagr6bd2UCa4721QgfIWMuBwMIWhzeY8Z3Y4s2DoSGXeNV2c")
          .isOp ||
        jwt.verify(token, "txRcW5wXc0jlGKupdavvxTQ4Fd8P7Jzcqa4GmM6CJC5VYOySzdaoFc5Pg2mCb04dY9X6s16d65NiBxtGqagr6bd2UCa4721QgfIWMuBwMIWhzeY8Z3Y4s2DoSGXeNV2c")
          .userId == post.userId
      ) {
        post.destroy();
        res.status(200).json(post.id + " has been deleted");
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

exports.react = (req, res, next) => {
  db.reacts
    .findOne({
      where: {
        postId: req.params.id,
        userId: req.body.userId,
      },
    })
    .then((react) => {
      if (react != null) {
        if (react.react == req.body.react) {
          db.reacts
            .destroy({ where: { postId: req.params.id, userId: req.body.userId } })
            .then(() => res.status(201).json({ message: "reaction supprimée avec succès ! " }))
            .catch((error) => {
              console.log(error);
              res.status(400).json({ error: error });
            });
        } else {
          db.reacts
            .update({ react: req.body.react }, { where: { postId: req.params.id, userId: req.body.userId } })
            .then(() => res.status(201).json({ message: "reaction modifiée avec succès ! ", react: req.body.react }))
            .catch((error) => {
              console.log(error);
              res.status(400).json({ error: error });
            });
        }
      } else {
        db.reacts
          .create({ postId: req.params.id, react: req.body.react, userId: req.body.userId })
          .then(() => res.status(201).json({ message: "reaction ajoutée avec succès !", react: req.body.react }))
          .catch((error) => {
            console.log(error);
            res.status(400).json({ error: error });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllPostsFromUser = (req, res, next) => {
  db.posts
    .findAll({
      where: { userId: req.params.userId },
      include: [
        db.users,
        { model: db.reacts, include: [db.users] },
        { model: db.comments, include: [db.users, { model: db.replies, include: [db.users, db.reactsReply] }, db.reactsComment] },
      ],
      order: [["updatedAt", "DESC"]],
    })
    .then((posts) => {
      for (let i = 0; i < posts.length; i++) {
        posts[i].user.username = secureCrypt(posts[i].user.username);
        for (let k = 0; k < posts[i].comments.length; k++) {
          if (posts[i].comments[k]) {
            posts[i].comments[k].user.username = secureCrypt(posts[i].comments[k].user.username);
            for (let n = 0; n < posts[i].comments[k].replies.length; n++) {
              if (posts[i].comments[k].replies[n]) {
                posts[i].comments[k].replies[n].user.username = secureCrypt(posts[i].comments[k].replies[n].user.username);
                for (let r = 0; r < posts[i].comments[k].replies[n].reactsReplies.length; r++) {
                  if (posts[i].comments[k].replies[n].reactsReplies[r].react == 1) {
                    posts[i].comments[k].replies[n].likes++;
                  }
                  if (posts[i].comments[k].replies[n].reactsReplies[r].react == -1) {
                    posts[i].comments[k].replies[n].dislikes++;
                  }
                }
              }
            }
            for (let m = 0; m < posts[i].comments[k].reactsComments.length; m++) {
              if (posts[i].comments[k].reactsComments[m].react == 1) {
                posts[i].comments[k].likes++;
              }
              if (posts[i].comments[k].reactsComments[m].react == -1) {
                posts[i].comments[k].dislikes++;
              }
            }
          }
        }
        for (let j = 0; j < posts[i].reacts.length; j++) {
          if (posts[i].reacts[j].react == 1) {
            posts[i].likes++;
          }
          if (posts[i].reacts[j].react == -1) {
            posts[i].dislikes++;
          }
        }
      }
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
};
