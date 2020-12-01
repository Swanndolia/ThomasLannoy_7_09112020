const db = require("../models");

module.exports = (sequelize, Sequelize) => {
  const Posts = sequelize.define("posts", {
    userId: {
      type: Sequelize.STRING,
      required: true,
      reference: {
        model: "users",
        key: "id",
      },
    },
    content: {
      type: Sequelize.TEXT,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
  });
  Posts.associate = (models) => {
    Posts.hasMany(models.reacts, { foreignKey: "postId" }, { onDelete: "cascade" });
    Posts.hasMany(models.comments, { foreignKey: "postId" }, { onDelete: "cascade" });
  };
  return Posts;
};
