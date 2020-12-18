const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../config/multer-config");

const replyCtrl = require("../controllers/replies.js");

router.post("/:id", auth, multer, replyCtrl.replyComment);
router.post("/:replyId/react", replyCtrl.reactToReply);
router.delete("/:replyId", auth, replyCtrl.deleteReply);
router.put("/:replyId", auth, multer, replyCtrl.modifyReply);

module.exports = router;
