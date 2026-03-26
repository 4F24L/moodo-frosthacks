import argon2 from "argon2";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await argon2.hash(password);
    const user = await User.create({ name, email, password: hashedPassword });

    const accessToken = generateAccessToken(user._id);
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

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch {
      return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findOne({ _id: decoded.id, refreshToken: token });
    if (!user) {
      return res.status(403).json({ success: false, message: "Refresh token mismatch" });
    }

    const accessToken = generateAccessToken(user._id);

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
