module.exports = (sequelize, Sequelize) => {
    const ReactsReply = sequelize.define("reactsReply", {
      userId: {
        type: Sequelize.INTEGER,
        required: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      replyId: {
        type: Sequelize.INTEGER,
        required: true,
        references: {
          model: "replies",
          key: "id",
        },
      },
      react: {
        type: Sequelize.INTEGER,
      },
    });
    return ReactsReply;
  };
  