module.exports = (sequelize, Sequelize) => {
  const Comments = sequelize.define("Comments", {
    userId: {
      type: Sequelize.INTEGER,
      required: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    postId: {
      type: Sequelize.INTEGER,
      required: true,
      references: {
        model: "posts",
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
  Comments.associate = (models) => {
    Comments.belongsTo(models.users, { foreignKey: "userId" });
    Comments.belongsTo(models.posts, { foreignKey: "postId" });
  };
  return Comments;
};
