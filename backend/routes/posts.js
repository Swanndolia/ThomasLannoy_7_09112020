const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../config/multer-config");

const postsCtrl = require("../controllers/posts.js");

router.get("/", auth, postsCtrl.getAllPosts);
router.post("/", auth, multer, postsCtrl.createPost);
router.get("/:userId", auth, postsCtrl.getAllPostsFromUser);
router.get("/:id", auth, postsCtrl.getOnePost);
router.put("/:id", auth, multer, postsCtrl.modifyPost);
router.delete("/:id", auth, postsCtrl.deletePost);
router.post("/:id/react", auth, postsCtrl.react);

module.exports = router;
