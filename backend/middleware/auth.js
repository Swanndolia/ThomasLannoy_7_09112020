const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      "txRcW5wXc0jlGKupdavvxTQ4Fd8P7Jzcqa4GmM6CJC5VYOySzdaoFc5Pg2mCb04dY9X6s16d65NiBxtGqagr6bd2UCa4721QgfIWMuBwMIWhzeY8Z3Y4s2DoSGXeNV2c"
    );
    const userId = decodedToken.userId;
    if ((req.body.userId && req.body.userId != userId)) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
