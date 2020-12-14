module.exports = (sequelize, Sequelize) => {
  const Reacts = sequelize.define("reacts", {
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
    react: {
      type: Sequelize.INTEGER,
    },
  });
  return Reacts;
};
