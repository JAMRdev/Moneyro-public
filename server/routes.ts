import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    res.json({ message: "Server is running", status: "healthy" });
  });

  // Simple auth endpoint for compatibility
  app.post("/api/auth/login", async (req, res) => {
    res.json({ 
      success: true, 
      message: "Authentication handled by Supabase client" 
    });
  });

  app.post("/api/auth/logout", async (req, res) => {
    res.json({ 
      success: true, 
      message: "Logout handled by Supabase client" 
    });
  });

  // Catch-all for API routes - redirect to Supabase
  app.use("/api/*", (req, res) => {
    res.status(404).json({ 
      error: "API endpoints are handled by Supabase client-side",
      message: "This endpoint should be accessed through Supabase client"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}