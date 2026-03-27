import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { generateAccessToken } from "../../utils/generateToken.js";

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findOne({ _id: decoded.id, refreshToken: token });
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Refresh token mismatch" });
    }

    const accessToken = generateAccessToken(user._id, user.name, user.email);

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: { user: req.user },
  });
};
