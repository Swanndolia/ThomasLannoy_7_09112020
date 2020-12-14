const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../config/multer-config");

const commentsCtrl = require("../controllers/comments.js");

router.post("/:id", auth, multer, commentsCtrl.commentPost);

router.post("/:id/:commentId/react", auth, commentsCtrl.reactToComment);

router.delete("/:commentId", auth, commentsCtrl.deleteComment);

router.put("/:commentId", auth, multer, commentsCtrl.modifyComment);

module.exports = router;
