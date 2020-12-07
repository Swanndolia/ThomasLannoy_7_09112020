const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../config/multer-config");

const usersCtrl = require("../controllers/users.js");

router.post("/signup", usersCtrl.signup);
router.post("/login", usersCtrl.login);
router.get("/", auth, usersCtrl.getAllUsers);
router.get("/:id", auth, usersCtrl.getOneUser);
router.put("/:id", auth, multer, usersCtrl.modifyUser);
router.delete("/:id", auth, usersCtrl.deleteUser);

module.exports = router;
