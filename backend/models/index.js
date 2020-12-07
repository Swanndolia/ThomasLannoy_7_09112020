const dbConfig = require("../config/db.config.js");
require("../middleware/secure-crypt.js")();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, secureCrypt(dbConfig.USER), secureCrypt(dbConfig.PASSWORD), {
  host: secureCrypt(dbConfig.HOST),
  dialect: dbConfig.dialect,
  dialectOptions: {
    timezone: "Etc/GMT0",
  },
  logging: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.js")(sequelize, Sequelize);
db.posts = require("./posts.js")(sequelize, Sequelize);
db.comments = require("./comments.js")(sequelize, Sequelize);
db.reacts = require("./reacts.js")(sequelize, Sequelize);

db.users.hasMany(db.posts, { foreignKey: "userId" }, { onDelete: "cascade" });
db.users.hasMany(db.comments, { foreignKey: "userId" }, { onDelete: "cascade" });
db.users.hasMany(db.reacts, { foreignKey: "userId" }, { onDelete: "cascade" });
db.reacts.belongsTo(db.users, { foreignKey: "userId" });
db.reacts.belongsTo(db.posts, { foreignKey: "postId" });
db.posts.belongsTo(db.users, { foreignKey: "userId" });
db.posts.hasMany(db.reacts, { foreignKey: "postId" }, { onDelete: "cascade" });
db.posts.hasMany(db.comments, { foreignKey: "postId" }, { onDelete: "cascade" });
db.comments.belongsTo(db.users, { foreignKey: "userId" });
db.comments.belongsTo(db.posts, { foreignKey: "postId" });

module.exports = db;
