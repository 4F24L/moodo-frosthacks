import authRoutes from "../routes/authRoutes.js";
import moodRoutes from "../routes/moodRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";

export const configureRoutes = (app) => {
  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/mood", moodRoutes);
  app.use("/api/admin", adminRoutes);

  // Health check
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
  });
};
