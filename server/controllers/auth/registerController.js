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

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, email, and password are required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: "Name must be at least 2 characters long" 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await argon2.hash(password);
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      password: hashedPassword 
    });

    const accessToken = generateAccessToken(user._id, user.name, user.email, user.role);
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
