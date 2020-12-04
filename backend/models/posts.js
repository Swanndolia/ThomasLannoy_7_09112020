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
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    dislikes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    content: {
      type: Sequelize.TEXT,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
  });
  return Posts;
};
