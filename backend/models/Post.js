const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  userImageUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  content: { type: String },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
  comments: { type: [Object] },
});

module.exports = mongoose.model("Post", postSchema);
