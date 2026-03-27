import argon2 from "argon2";
import { COOKIE_OPTIONS } from "../../config/cookieConfig.js";
import User from "../../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id, user.name, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    // Determine redirect based on user role
    const redirectTo = user.role === "admin" ? "/admin/dashboard" : "/dashboard";

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { 
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        },
        redirectTo
      },
    });
  } catch (err) {
    next(err);
  }
};
