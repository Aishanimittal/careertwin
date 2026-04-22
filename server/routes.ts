import "dotenv/config";
import type { Express, Request } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import type { User as SelectUser } from "@shared/schema";
import { z } from "zod";
import { setupAuth, hashPassword } from "./auth";
import passport from "passport";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

type MLPrediction = {
  career: string;
  domain: string;
  avgSalaryEntry: string;
  growthRate: string;
  confidence: number;
  gaps: string[];
  matchingSkills: string[];
  progression: { level: string; years: string; salary: string }[];
  roadmap: {
    courses: string[];
    certifications: string[];
    projects: string[];
    learningPath: string;
  };
};

type CareerProfile = {
  career: string;
  domain: string;
  avgSalaryEntry: string;
  growthRate: string;
  requiredSkills: string[];
  keywordHints: string[];
  roadmap: MLPrediction["roadmap"];
  progression: MLPrediction["progression"];
};

const CAREER_PROFILES: CareerProfile[] = [
  {
    career: "Data Scientist",
    domain: "Data & AI",
    avgSalaryEntry: "$80k-$110k",
    growthRate: "High",
    requiredSkills: ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
    keywordHints: ["ai", "ml", "data", "analytics", "prediction"],
    roadmap: {
      courses: ["Python for Data Science", "Applied Statistics", "ML Model Building"],
      certifications: ["Google Data Analytics", "Azure AI Fundamentals"],
      projects: ["Churn Prediction", "Recommendation System", "Forecasting Dashboard"],
      learningPath: "Data Foundations -> Modeling -> MLOps Basics -> Portfolio Projects",
    },
    progression: [
      { level: "Junior Data Scientist", years: "0-2 years", salary: "$70k-$95k" },
      { level: "Mid Data Scientist", years: "2-5 years", salary: "$95k-$135k" },
      { level: "Senior Data Scientist", years: "5+ years", salary: "$135k-$190k" },
    ],
  },
  {
    career: "Frontend Developer",
    domain: "Web Engineering",
    avgSalaryEntry: "$65k-$90k",
    growthRate: "Medium",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    keywordHints: ["ui", "ux", "frontend", "design", "web"],
    roadmap: {
      courses: ["Modern JavaScript", "React Deep Dive", "Frontend Performance"],
      certifications: ["Meta Front-End Developer", "Google UX Design"],
      projects: ["Design System", "E-commerce UI", "Accessible Dashboard"],
      learningPath: "Web Basics -> Framework Mastery -> UX & Performance -> Production Apps",
    },
    progression: [
      { level: "Junior Frontend Developer", years: "0-2 years", salary: "$60k-$80k" },
      { level: "Mid Frontend Developer", years: "2-5 years", salary: "$80k-$115k" },
      { level: "Senior Frontend Developer", years: "5+ years", salary: "$115k-$160k" },
    ],
  },
  {
    career: "Backend Developer",
    domain: "Platform Engineering",
    avgSalaryEntry: "$70k-$100k",
    growthRate: "High",
    requiredSkills: ["Node.js", "Python", "SQL", "APIs", "Docker"],
    keywordHints: ["api", "backend", "server", "microservice", "cloud"],
    roadmap: {
      courses: ["Backend System Design", "Databases at Scale", "Cloud Native APIs"],
      certifications: ["AWS Developer Associate", "Azure Developer Associate"],
      projects: ["Scalable REST API", "Queue-based Worker", "Realtime Notification Service"],
      learningPath: "Backend Fundamentals -> Scale & Reliability -> Cloud Deployment",
    },
    progression: [
      { level: "Junior Backend Developer", years: "0-2 years", salary: "$65k-$90k" },
      { level: "Mid Backend Developer", years: "2-5 years", salary: "$90k-$125k" },
      { level: "Senior Backend Developer", years: "5+ years", salary: "$125k-$180k" },
    ],
  },
  {
    career: "AI Engineer",
    domain: "Artificial Intelligence",
    avgSalaryEntry: "$90k-$125k",
    growthRate: "Very High",
    requiredSkills: ["Python", "Deep Learning", "TensorFlow", "PyTorch", "MLOps"],
    keywordHints: ["ai", "deep learning", "llm", "vision", "nlp"],
    roadmap: {
      courses: ["Deep Learning Specialization", "LLM Engineering", "MLOps Foundations"],
      certifications: ["TensorFlow Developer", "Azure AI Engineer Associate"],
      projects: ["Chatbot Assistant", "Image Classifier", "LLM RAG System"],
      learningPath: "Math + DL Core -> Model Building -> LLM/MLOps -> Real Deployments",
    },
    progression: [
      { level: "Junior AI Engineer", years: "0-2 years", salary: "$80k-$110k" },
      { level: "Mid AI Engineer", years: "2-5 years", salary: "$110k-$155k" },
      { level: "Senior AI Engineer", years: "5+ years", salary: "$155k-$230k" },
    ],
  },
];

function normalizeToken(token: string): string {
  return token.trim().toLowerCase();
}

function getAuthenticatedUserId(req: Request): number {
  return (req.user as { id: number }).id;
}

function computePrediction(cgpa: number, skills: string[], interests: string[]): MLPrediction {
  const normalizedSkills = skills.map(normalizeToken);
  const normalizedInterests = interests.map(normalizeToken);

  const evaluated = CAREER_PROFILES.map((profile) => {
    const requiredNormalized = profile.requiredSkills.map(normalizeToken);
    const matchingSkills = profile.requiredSkills.filter((skill, idx) => {
      const req = requiredNormalized[idx];
      return normalizedSkills.some((s) => s.includes(req) || req.includes(s));
    });

    const skillScore = requiredNormalized.length === 0 ? 0 : matchingSkills.length / requiredNormalized.length;
    const interestScore = profile.keywordHints.length === 0
      ? 0
      : profile.keywordHints.filter((hint) => normalizedInterests.some((i) => i.includes(hint))).length / profile.keywordHints.length;

    const cgpaScore = Math.min(1, Math.max(0, cgpa / 10));
    const confidence = Math.min(0.96, Math.max(0.2, skillScore * 0.6 + interestScore * 0.2 + cgpaScore * 0.2));

    return {
      profile,
      confidence,
      matchingSkills,
      gaps: profile.requiredSkills.filter((s) => !matchingSkills.includes(s)),
    };
  }).sort((a, b) => b.confidence - a.confidence);

  const best = evaluated[0];

  return {
    career: best.profile.career,
    domain: best.profile.domain,
    avgSalaryEntry: best.profile.avgSalaryEntry,
    growthRate: best.profile.growthRate,
    confidence: Number(best.confidence.toFixed(2)),
    gaps: best.gaps,
    matchingSkills: best.matchingSkills,
    progression: best.profile.progression,
    roadmap: best.profile.roadmap,
  };
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
        if (err) {
          console.error("Auto-login after registration failed:", err);
          return res.status(500).json({ message: "Login failed after registration", error: String(err) });
        }
        res.status(201).json(user);
      });
    } catch (err) {
      console.error("Registration error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error", error: String(err) });
    }
  });

  app.post(api.auth.login.path, (req, res, next) => {
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
    const authUserId = getAuthenticatedUserId(req);
    
    try {
      const input = api.users.updateProfile.input.parse(req.body);
      const userId = Number(req.params.id);
      
      if (authUserId !== userId) return res.status(401).json({ message: "Unauthorized" });
      
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
    const authUserId = getAuthenticatedUserId(req);
    const skills = await storage.getSkills(authUserId);
    res.status(200).json(skills);
  });

  app.post(api.skills.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const authUserId = getAuthenticatedUserId(req);
    try {
      const input = api.skills.create.input.parse(req.body);
      const skill = await storage.createSkill({
        ...input,
        userId: authUserId
      });
      res.status(201).json(skill);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.skills.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const authUserId = getAuthenticatedUserId(req);
    await storage.deleteSkill(Number(req.params.id), authUserId);
    res.status(204).send();
  });

  // Predictions (ML Endpoint)
  app.post(api.predictions.predict.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const authUserId = getAuthenticatedUserId(req);
    
    try {
      const input = api.predictions.predict.input.parse(req.body);
      const mlResult = computePrediction(input.cgpa, input.skills, input.interests);
      
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
        userId: authUserId,
        careerId: career.id,
        confidence: Math.min(1, Math.max(0, mlResult.confidence)),
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
    const authUserId = getAuthenticatedUserId(req);
    
    const predictions = await storage.getPredictions(authUserId);
    const history = [];
    
    for (const pred of predictions) {
      const career = await storage.getCareerById(pred.careerId);
      const roadmap = await storage.getRoadmapByCareerId(pred.careerId);
      
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