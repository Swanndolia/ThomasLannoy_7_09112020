const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../config/multer-config");

const postsCtrl = require("../controllers/posts.js");

// Get all the posts
router.get("/", auth, postsCtrl.getAllPosts);

// Create a new post
router.post("/", auth, multer, postsCtrl.createPost);

// Get all the post from one user
router.get("/:userId", auth, postsCtrl.getAllPostsFromUser);

// Get a post with it's ID
router.get("/:id", auth, postsCtrl.getOnePost);

// Modify a post with it's ID
router.put("/:id", auth, multer, postsCtrl.modifyPost);

// Delete a post with it's ID
router.delete("/:id", auth, postsCtrl.deletePost);

// React to a post with it's ID
router.post("/:id/react", postsCtrl.react);

module.exports = router;
