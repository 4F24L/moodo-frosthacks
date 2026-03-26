import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { xss } from "express-xss-sanitizer";

import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// security middleware
app.use(helmet());
app.use(xss());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later." },
  })
);

// body & cookie parsing
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));

// routes
app.use("/api/auth", authRoutes);

// health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// global error handler
app.use(errorHandler);

export default app;
