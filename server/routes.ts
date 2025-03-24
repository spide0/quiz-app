import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Statuses route
  app.get("/api/statuses", async (_req, res) => {
    try {
      const statuses = await storage.getStatuses();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statuses" });
    }
  });

  // Languages route
  app.get("/api/languages", async (_req, res) => {
    try {
      const languages = await storage.getLanguages();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });
  
  // Quiz routes
  app.get("/api/quizzes", async (_req, res) => {
    try {
      const quizzes = await storage.getQuizzes();
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });
  
  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.getQuizById(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });
  
  app.get("/api/user/quizzes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const quizzes = await storage.getQuizzesByUser(req.user.id);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user quizzes" });
    }
  });
  
  app.post("/api/quizzes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const quiz = await storage.createQuiz({
        ...req.body,
        createdBy: req.user.id,
      });
      res.status(201).json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });
  
  // Quiz results routes
  app.get("/api/user/results", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const results = await storage.getQuizResults(req.user.id);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });
  
  app.post("/api/quiz-results", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const result = await storage.createQuizResult({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to save quiz result" });
    }
  });
  
  const httpServer = createServer(app);

  return httpServer;
}
