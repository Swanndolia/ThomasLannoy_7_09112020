const db = require("../models");

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
  .findAll({ include: [db.users, db.comments, db.reacts] })
    .then((posts) => {
      console.log(posts)
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        error: error,
      });
    });
};
exports.modifyPost = (req, res, next) => {};
exports.deletePost = (req, res, next) => {};

exports.react = (req, res, next) => {
  db.reacts
    .findOne({
      where: {
        postId: req.params.id,
        userId: req.body.userId,
      },
    })
    .then((react) => {
      if (req.body.like == 1) {
        if (react) {
          //check if it was a like and remove it or change like to dislike
        } else {
          db.reacts
            .update({ where: { id: req.params.id } }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, id: req.params.id })
            .then(() => res.status(201).json({ message: "Like retiré avec succès !" }))
            .catch((error) => {
              res.status(400).json({ error: error });
            });
        }
      } else {
        if (like) {
          //check if it was a dislike and remove it or change dislike to like
        } else {
        }
      }
    });
};

exports.getAllPostsFromUser = (req, res, next) => {
  db.posts
    .findAll({ where: { userId: req.params.userId } })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
