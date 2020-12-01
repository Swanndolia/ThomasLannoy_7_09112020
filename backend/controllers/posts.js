const db = require("../models");
const Op = db.Sequelize.Op;

exports.createPost = (req, res, next) => {
  if (req.body.imageUrl) {
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`;
  }
  db.posts.create(req.body)
    .then(() => res.status(201).json({ message: "Post créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next) => {
  db.posts.findOne({
    id: req.params.id,
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

exports.commentPost = (req, res, next) => {
  db.posts.findOne({
    id: req.params.id,
  })
    .then((post) => {
      req.body._id = post.comments.length.toString();
      req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`;
      db.posts.updateOne({ _id: req.params.id }, { $push: { comments: req.body }, _id: req.params.id })
        .then(() => res.status(201).json({ message: "Vous avez commenté ce post" }))
        .catch((error) => {
          res.status(400).json({ error: error });
        });
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.reactToComment = (req, res, next) => {
  db.posts.findOne({
    id: req.params.id,
  }).then((post) => {
    if (req.body.like == 1) {
      console.log(post.comments[req.params.commentId]);
      res.status(201).json({ message: "Like ajouté avec succès !" });
    }
    if (req.body.like == -1) {
      console.log(post.comments[req.params.commentId]);
      res.status(201).json({ message: "Dislike ajouté avec succès !" });
    }
  });
};

exports.getAllPosts = (req, res, next) => {
  db.posts.findAll()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
exports.modifyPost = (req, res, next) => {};
exports.deletePost = (req, res, next) => {};

exports.react = (req, res, next) => {
  console.log(req.body);
  db.reacts
    .findOne({
      where: {
        postId: req.params.id,
        userId: req.body.userId,
      },
    })
    .then((react) => {
      if (req.body.like == 1) {
        if (like) {
          //check if it was a like and remove it or change like to dislike
        } else {
          db.posts.updateOne({ id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, id: req.params.id })
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
  db.posts.findAll({ where: { userId: req.params.userId } })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
