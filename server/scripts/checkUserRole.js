#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
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

/**
 * Check user roles
 */
const checkUserRoles = async () => {
  try {
    console.log("\n=== User Roles Check ===\n");

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB\n");

    // Get all users
    const users = await User.find({}).select('name email role createdAt');
    
    if (users.length === 0) {
      console.log("No users found in database");
      process.exit(0);
    }

    console.log(`Found ${users.length} user(s):\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      console.log('');
    });

    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;
    
    console.log(`Summary: ${adminCount} admin(s), ${userCount} regular user(s)`);

    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    process.exit(1);
  }
};

// Run the script
checkUserRoles();
