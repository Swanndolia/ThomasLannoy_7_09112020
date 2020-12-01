module.exports = (sequelize, Sequelize) => {
  const Posts = sequelize.define("posts", {
    userId: {
      type: Sequelize.INTEGER,
      required: true,
      references: {
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
    Posts.belongsTo(models.users, { foreignKey: "userId" });
    Posts.hasMany(models.reacts, { foreignKey: "postId" }, { onDelete: "cascade" });
    Posts.hasMany(models.comments, { foreignKey: "postId" }, { onDelete: "cascade" });
  };
  return Posts;
};
