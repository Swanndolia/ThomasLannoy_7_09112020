module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    mail: {
      type: Sequelize.STRING,
      unique: true,
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
      defaultValue: "Ceci est une courte description par default, modifiez moi !",
    },
  });
  return Users;
};
