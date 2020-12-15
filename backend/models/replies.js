module.exports = (sequelize, Sequelize) => {
    const Replies = sequelize.define("replies", {
      userId: {
        type: Sequelize.INTEGER,
        required: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      commentId: {
        type: Sequelize.INTEGER,
        required: true,
        references: {
          model: "comments",
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
    return Replies;
  };
  