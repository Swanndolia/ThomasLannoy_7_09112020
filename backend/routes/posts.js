const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const postCtrl = require("../controllers/posts");

router.get("/", postCtrl.getAllPosts);
router.post("/", multer, postCtrl.createPost);
router.get("/:id", postCtrl.getOnePost);
router.put("/:id", multer, postCtrl.modifyPost);
router.delete("/:id", postCtrl.deletePost);
router.post("/:id/like", postCtrl.likeDislikeOrCancel);
router.post("/:id/comment", postCtrl.commentPost);

module.exports = router;
