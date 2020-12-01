module.exports = (sequelize, Sequelize) => {
  const Reacts = sequelize.define("Reacts", {
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
      default: 0,
    },
  });
  Reacts.associate = (models) => {
    Reacts.belongsTo(models.users, { foreignKey: "userId" });
    Reacts.belongsTo(models.posts, { foreignKey: "postId" });
  };
  return Reacts;
};
