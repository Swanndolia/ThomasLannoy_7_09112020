const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  mail: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  username: { type: String, required: true },
  imageUrl: { type: String, default: "https://picsum.photos/300/200?random"},
  about: { type: String, default: "Ceci est une courte description assignée par default, cliquez sur \"edit\" pour la modifier "},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
