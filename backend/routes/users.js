const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../config/multer-config");

const usersCtrl = require("../controllers/users.controller.js");

// Create a new User
router.post("/signup", usersCtrl.signup);

// Login with existing user
router.post("/login", usersCtrl.login);

// Retrieve all Users
router.get("/", auth, usersCtrl.getAllUsers);

// Retrieve a single User with id
router.get("/:id", auth, usersCtrl.getOneUser);

// Update a User with id
router.put("/:id", auth, multer, usersCtrl.modifyUser);

// Delete a User with id
router.delete("/:id", auth, usersCtrl.deleteUser);

module.exports = router;
