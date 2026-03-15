import type { InsertUser, User, InsertSkill, Skill, InsertCareer, Career, InsertPrediction, Prediction, InsertRoadmap, Roadmap, UserProfileUpdate } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UserProfileUpdate): Promise<User>;
  
  createSkill(skill: InsertSkill): Promise<Skill>;
  getSkills(userId: number): Promise<Skill[]>;
  deleteSkill(id: number, userId: number): Promise<void>;
  
  createCareer(career: InsertCareer): Promise<Career>;
  getCareerByName(name: string): Promise<Career | undefined>;
  
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPredictions(userId: number): Promise<Prediction[]>;
  
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  getRoadmapByCareerId(careerId: number): Promise<Roadmap | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: UserProfileUpdate): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async getSkills(userId: number): Promise<Skill[]> {
    return await db.select().from(skills).where(eq(skills.userId, userId));
  }

  async deleteSkill(id: number, userId: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  async createCareer(career: InsertCareer): Promise<Career> {
    const [newCareer] = await db.insert(careers).values(career).returning();
    return newCareer;
  }

  async getCareerByName(name: string): Promise<Career | undefined> {
    const [career] = await db.select().from(careers).where(eq(careers.careerName, name));
    return career;
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const [newPrediction] = await db.insert(predictions).values(prediction).returning();
    return newPrediction;
  }

  async getPredictions(userId: number): Promise<Prediction[]> {
    return await db.select().from(predictions).where(eq(predictions.userId, userId)).orderBy(desc(predictions.date));
  }

  async createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap> {
    const [newRoadmap] = await db.insert(roadmaps).values(roadmap).returning();
    return newRoadmap;
  }

  async getRoadmapByCareerId(careerId: number): Promise<Roadmap | undefined> {
    const [roadmap] = await db.select().from(roadmaps).where(eq(roadmaps.careerId, careerId));
    return roadmap;
  }
}

export const storage = new DatabaseStorage();