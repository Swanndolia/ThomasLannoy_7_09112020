const Post = require("../models/Post");

exports.createPost = (req, res, next) => {
  const postObject = req.body;
  const date = new Date();
  const post = new Post({
    ...postObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.body.imageUrl}`,
    createdAt: date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes(),
  });
  post
    .save()
    .then(() => res.status(201).json({ message: "Post créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id,
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
  Post.find()
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
exports.likeDislikeOrCancel = (req, res, next) => {};
exports.commentPost = (req, res, next) => {};
exports.getAllPostsFromUser = (req, res, next) => {
  Post.find({ userId: req.params.userId })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
