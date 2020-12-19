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
      defaultValue: "https://www.centraltrials.com/wp-content/uploads/2016/11/User-Default.jpg",
    },
    about: {
      type: Sequelize.STRING,
      defaultValue: "Ceci est une courte description par default, modifiez moi !",
    },
    isOp:{
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  });
  return Users;
};
