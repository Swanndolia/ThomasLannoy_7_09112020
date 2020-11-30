module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    userId: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.STRING,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    userImageUrl: {
      type: Sequelize.STRING,
    },
    likes: {
      type: Sequelize.STRING,
      defaultValue: "0",
    },
    dislikes: {
      type: Sequelize.STRING,
      defaultValue: "0",
    } /*
    usersLiked: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    usersDisliked: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    }, 
    comments: {
      type: Sequelize.ARRAY(Sequelize.JSON),
    },*/,
  });
  return Post;
};
