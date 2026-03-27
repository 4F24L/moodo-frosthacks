import argon2 from "argon2";
import { COOKIE_OPTIONS } from "../../config/cookieConfig.js";
import User from "../../models/User.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await argon2.hash(password);
    const user = await User.create({ name, email, password: hashedPassword });

    const accessToken = generateAccessToken(user._id, user.name, user.email);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};
