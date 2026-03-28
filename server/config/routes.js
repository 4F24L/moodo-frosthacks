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
    res.status(200).json({ 
      success: true, 
      message: "Server is running",
      timestamp: new Date().toISOString()
    });
  });

  // Warmup endpoint to prevent cold starts
  app.get("/api/warmup", async (_req, res) => {
    try {
      const results = {
        backend: { status: "warmed", message: "Backend service ready" },
        aiService: { status: "pending", message: "Not checked" },
        database: "disconnected"
      };

      // Check database connection
      const mongoose = await import("mongoose");
      results.database = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
      
      // Warmup AI service
      try {
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL;
        if (AI_SERVICE_URL) {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          
          const aiResponse = await fetch(`${AI_SERVICE_URL}/warmup`, {
            method: 'GET',
            signal: controller.signal
          });
          
          clearTimeout(timeout);
          
          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            results.aiService = {
              status: "warmed",
              message: "AI service ready",
              details: aiData
            };
          } else {
            results.aiService = {
              status: "error",
              message: `AI service returned status ${aiResponse.status}`
            };
          }
        } else {
          results.aiService = {
            status: "skipped",
            message: "AI_SERVICE_URL not configured"
          };
        }
      } catch (aiError) {
        results.aiService = {
          status: "error",
          message: aiError.name === 'AbortError' ? 'AI service timeout' : aiError.message
        };
      }
      
      res.status(200).json({ 
        success: true, 
        status: "warmed",
        message: "Services warmup complete",
        services: results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        status: "error",
        message: error.message 
      });
    }
  });
};
