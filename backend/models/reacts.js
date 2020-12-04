module.exports = (sequelize, Sequelize) => {
  const Reacts = sequelize.define("reacts", {
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    postId: {
      type: Sequelize.INTEGER,
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
