module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    mail: {
      type: Sequelize.STRING,
    },
    pass: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    imageUrl: {
      type: Sequelize.STRING,
      defaultValue: "https://picsum.photos/200/300",
    },
    about: {
      type: Sequelize.STRING,
    },
  });
  return User;
};
