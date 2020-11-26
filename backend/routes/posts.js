const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const postCtrl = require("../controllers/posts");

router.get("/", auth, postCtrl.getAllPosts);
router.post("/", auth, multer, postCtrl.createPost);
router.get("/:userId", auth, postCtrl.getAllPostsFromUser);
router.get("/:id", auth, postCtrl.getOnePost);
router.put("/:id", auth, multer, postCtrl.modifyPost);
router.delete("/:id", auth, postCtrl.deletePost);
router.post("/:id/react", auth, postCtrl.react);
router.post("/:id/:commentId/react", auth, postCtrl.reactToComment);
router.post("/:id/comment", auth, multer, postCtrl.commentPost); 

module.exports = router;
