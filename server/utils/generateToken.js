const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const generateRefreshToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '15m' });

module.exports = { generateAccessToken, generateRefreshToken };