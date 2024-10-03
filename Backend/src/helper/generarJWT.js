const jwt = require("jsonwebtoken");

exports.generarJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d", });
};
