#!/usr/bin/env node

import mongoose from "mongoose";
import argon2 from "argon2";
import dotenv from "dotenv";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

// User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompt user for input
 */
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Add admin user
 */
const addAdmin = async () => {
  try {
    console.log("\n=== Add Admin User ===\n");

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB\n");

    // Get admin details from user
    let name = await prompt("Enter admin name: ");
    while (!name) {
      console.log("⚠ Name cannot be empty");
      name = await prompt("Enter admin name: ");
    }

    let email = await prompt("Enter admin email: ");
    while (!email || !isValidEmail(email)) {
      console.log("⚠ Please enter a valid email address");
      email = await prompt("Enter admin email: ");
    }

    let password = await prompt("Enter admin password (min 6 characters): ");
    while (!password || password.length < 6) {
      console.log("⚠ Password must be at least 6 characters");
      password = await prompt("Enter admin password (min 6 characters): ");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("\n⚠ User with this email already exists");
      
      const updateRole = await prompt("Update to admin role? (y/n): ");
      if (updateRole.toLowerCase() === "y" || updateRole.toLowerCase() === "yes") {
        if (existingUser.role === "admin") {
          console.log("✓ User is already an admin");
        } else {
          existingUser.role = "admin";
          await existingUser.save();
          console.log("✓ User role updated to admin");
        }
      }
      
      rl.close();
      process.exit(0);
    }

    // Hash password
    console.log("\nCreating admin user...");
    const hashedPassword = await argon2.hash(password);

    // Create admin user
    const admin = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("\n✓ Admin user created successfully!");
    console.log("\nCredentials:");
    console.log("  Name:", name);
    console.log("  Email:", email);
    console.log("  Role: admin");
    console.log("\n⚠ Keep these credentials secure!");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    rl.close();
    process.exit(1);
  }
};

// Handle Ctrl+C
rl.on("SIGINT", () => {
  console.log("\n\n✗ Operation cancelled");
  rl.close();
  process.exit(0);
});

// Run the script
addAdmin();
