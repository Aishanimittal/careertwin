import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, hashPassword } from "./auth";
import { spawn } from "child_process";
import path from "path";
import { db } from "./db";
import { careers, roadmaps } from "@shared/schema";
import { eq } from "drizzle-orm";

// Helper to run the Python ML script
async function runMLPrediction(cgpa: number, skills: string[], interests: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [path.join(process.cwd(), 'ml_predict.py')]);
    
    let resultData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}: ${errorData}`);
        reject(new Error(`ML Prediction failed: ${errorData}`));
      } else {
        try {
          resolve(JSON.parse(resultData));
        } catch (e) {
          reject(new Error("Failed to parse ML output"));
        }
      }
    });

    // Send input data
    pythonProcess.stdin.write(JSON.stringify({ cgpa, skills, interests }));
    pythonProcess.stdin.end();
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Authentication
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const hashedPassword = await hashPassword(input.password);
      const user = await storage.createUser({
        username: input.username,
        password: hashedPassword,
        name: input.name,
      });
      
      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed after registration" });
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, (req, res, next) => {
    const passport = require("passport");
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Unauthorized" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    res.status(200).json(req.user);
  });

  // User Profile
  app.put(api.users.updateProfile.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.users.updateProfile.input.parse(req.body);
      const userId = Number(req.params.id);
      
      if (req.user.id !== userId) return res.status(401).json({ message: "Unauthorized" });
      
      const user = await storage.updateUser(userId, input);
      res.status(200).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Skills
  app.get(api.skills.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const skills = await storage.getSkills(req.user.id);
    res.status(200).json(skills);
  });

  app.post(api.skills.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.skills.create.input.parse(req.body);
      const skill = await storage.createSkill({
        ...input,
        userId: req.user.id
      });
      res.status(201).json(skill);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.skills.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteSkill(Number(req.params.id), req.user.id);
    res.status(204).send();
  });

  // Predictions (ML Endpoint)
  app.post(api.predictions.predict.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.predictions.predict.input.parse(req.body);
      
      // Run Python ML Prediction
      const mlResult = await runMLPrediction(input.cgpa, input.skills, input.interests);
      
      // Upsert Career
      let career = await storage.getCareerByName(mlResult.career);
      if (!career) {
        career = await storage.createCareer({
          careerName: mlResult.career,
          domain: mlResult.domain,
          avgSalaryEntry: mlResult.avgSalaryEntry,
          growthRate: mlResult.growthRate
        });
      }
      
      // Upsert Roadmap
      let roadmap = await storage.getRoadmapByCareerId(career.id);
      if (!roadmap) {
        roadmap = await storage.createRoadmap({
          careerId: career.id,
          courses: mlResult.roadmap.courses,
          certifications: mlResult.roadmap.certifications,
          projects: mlResult.roadmap.projects,
          learningPath: mlResult.roadmap.learningPath
        });
      }
      
      // Save Prediction
      const prediction = await storage.createPrediction({
        userId: req.user.id,
        careerId: career.id,
        confidence: mlResult.confidence,
        gaps: mlResult.gaps,
        matchingSkills: mlResult.matchingSkills,
        progression: mlResult.progression
      });
      
      res.status(200).json({ prediction, career, roadmap });
    } catch (err) {
      console.error("Prediction Error:", err);
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Failed to generate prediction" });
    }
  });

  app.get(api.predictions.history.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const predictions = await storage.getPredictions(req.user.id);
    const history = [];
    
    for (const pred of predictions) {
      const career = await db.select().from(careers).where(eq(careers.id, pred.careerId)).then(r => r[0]);
      const roadmap = await db.select().from(roadmaps).where(eq(roadmaps.careerId, pred.careerId)).then(r => r[0]);
      
      if (career && roadmap) {
        history.push({
          prediction: pred,
          career: career,
          roadmap: roadmap
        });
      }
    }
    
    res.status(200).json(history);
  });

  return httpServer;
}