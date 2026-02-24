import { pgTable, text, serial, integer, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  cgpa: doublePrecision("cgpa"),
  interests: json("interests").$type<string[]>().default([]),
  goals: text("goals"),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  skillName: text("skill_name").notNull(),
  skillLevel: text("skill_level").notNull(), // Beginner, Intermediate, Advanced
});

export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  careerName: text("career_name").notNull(),
  domain: text("domain").notNull(),
  avgSalaryEntry: text("avg_salary_entry").notNull(),
  growthRate: text("growth_rate").notNull(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  careerId: integer("career_id").references(() => careers.id).notNull(),
  confidence: doublePrecision("confidence").notNull(),
  date: timestamp("date").defaultNow(),
  gaps: json("gaps").$type<string[]>().default([]),
  matchingSkills: json("matching_skills").$type<string[]>().default([]),
  progression: json("progression").$type<{level: string, years: string, salary: string}[]>().default([]),
});

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  careerId: integer("career_id").references(() => careers.id).notNull(),
  courses: json("courses").$type<string[]>().default([]),
  certifications: json("certifications").$type<string[]>().default([]),
  projects: json("projects").$type<string[]>().default([]),
  learningPath: text("learning_path").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertCareerSchema = createInsertSchema(careers).omit({ id: true });
export const insertPredictionSchema = createInsertSchema(predictions).omit({ id: true, date: true });
export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Career = typeof careers.$inferSelect;
export type InsertCareer = z.infer<typeof insertCareerSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;

export type UserProfileUpdate = Partial<Omit<InsertUser, "username" | "password">>;

export type PredictRequest = {
  cgpa: number;
  skills: string[];
  interests: string[];
};

export type PredictResponse = {
  career: Career;
  confidence: number;
  gaps: string[];
  matchingSkills: string[];
  progression: { level: string; years: string; salary: string }[];
  roadmap: Roadmap;
};
