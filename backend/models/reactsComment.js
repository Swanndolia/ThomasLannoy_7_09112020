module.exports = (sequelize, Sequelize) => {
  const ReactsComment = sequelize.define("reactsComment", {
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
    react: {
      type: Sequelize.INTEGER,
    },
  });
  return ReactsComment;
};
