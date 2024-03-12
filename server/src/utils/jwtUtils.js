const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt");

function generateToken(payload) {
  return jwt.sign(payload, jwtConfig.secret);
}

function verifyToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}

module.exports = {
  generateToken,
  verifyToken,
};
