module.exports = (sequelize, Sequelize) => {
  const Comments = sequelize.define("comments", {
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
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    dislikes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
  return Comments;
};
