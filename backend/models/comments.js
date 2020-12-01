module.exports = (sequelize, Sequelize) => {
  const Comments = sequelize.define("Comments", {
    content: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
      required: true,
      reference: {
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
  });
  Comments.associate = (models) => {
    Comments.belongsTo(models.users, { foreignKey: "userId" });
    Comments.belongsTo(models.posts, { foreignKey: "postId" });
  };
  return Comments;
};
