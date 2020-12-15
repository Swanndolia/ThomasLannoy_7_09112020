const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const session = require("express-session");
const db = require("./models/index");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const repliesRoutes= require("./routes/replies");
const path = require("path");
require("./middleware/secure-crypt.js")();

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(helmet());

app.set("trust proxy", 1);
app.use(
  session({
    secret: "s3Cur3",
    name: "sessionId",
    resave: false,
    saveUninitialized: true,
  })
);

db.sequelize.sync().then(() => {
  console.log("synced db.");
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/replies", repliesRoutes);

module.exports = app;
