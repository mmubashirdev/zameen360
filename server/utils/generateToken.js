const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const generateRefreshToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });

module.exports = { generateAccessToken, generateRefreshToken };