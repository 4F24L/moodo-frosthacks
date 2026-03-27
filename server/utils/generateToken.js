import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, name, email, role = "user") =>
  jwt.sign({ id: userId, name, email, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
