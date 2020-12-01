const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../config/multer-config");

const commentsCtrl = require("../controllers/comments.js");

router.post("/:id", auth, multer, commentsCtrl.commentPost); 

// React to a post comment with the post and comment ID
router.post("/:id/:commentId/react", auth, commentsCtrl.reactToComment);

module.exports = router;