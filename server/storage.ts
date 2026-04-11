import type {
  InsertUser,
  User,
  InsertSkill,
  Skill,
  InsertCareer,
  Career,
  InsertPrediction,
  Prediction,
  InsertRoadmap,
  Roadmap,
  UserProfileUpdate,
} from "@shared/schema";

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
  getCareerById(id: number): Promise<Career | undefined>;
  
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPredictions(userId: number): Promise<Prediction[]>;
  
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  getRoadmapByCareerId(careerId: number): Promise<Roadmap | undefined>;
}

export class MemStorage implements IStorage {
  private users: User[] = [
    {
      id: 1,
      username: "student_demo",
      // Password: Career@2026 (pre-hashed)
      password:
        "9bc03cc73b0cf9c19fe34b65e7f25f5e51ae56fd9ffeeaca09cd588f841e6b4e96c97d14f2c4feb3b0588190aaa363bc6969f591ce87e58373b7b4aa564102c4.e20ddf7215280ef5513a8d610d5a5dcd",
      name: "Student Demo",
      email: null,
      cgpa: null,
      interests: [],
      goals: null,
    },
  ];
  private skills: Skill[] = [];
  private careers: Career[] = [];
  private predictions: Prediction[] = [];
  private roadmaps: Roadmap[] = [];

  private userId = 2;
  private skillId = 1;
  private careerId = 1;
  private predictionId = 1;
  private roadmapId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.userId++,
      username: insertUser.username,
      password: insertUser.password,
      name: insertUser.name ?? null,
      email: null,
      cgpa: null,
      interests: [],
      goals: null,
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id: number, updates: UserProfileUpdate): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }

    if (updates.name !== undefined) user.name = updates.name;
    if (updates.email !== undefined) user.email = updates.email;
    if (updates.cgpa !== undefined) user.cgpa = updates.cgpa;
    if (updates.interests !== undefined) user.interests = updates.interests;
    if (updates.goals !== undefined) user.goals = updates.goals;

    return user;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const newSkill: Skill = {
      id: this.skillId++,
      userId: skill.userId,
      skillName: skill.skillName,
      skillLevel: skill.skillLevel,
    };
    this.skills.push(newSkill);
    return newSkill;
  }

  async getSkills(userId: number): Promise<Skill[]> {
    return this.skills.filter((s) => s.userId === userId);
  }

  async deleteSkill(id: number, userId: number): Promise<void> {
    this.skills = this.skills.filter((s) => !(s.id === id && s.userId === userId));
  }

  async createCareer(career: InsertCareer): Promise<Career> {
    const newCareer: Career = {
      id: this.careerId++,
      careerName: career.careerName,
      domain: career.domain,
      avgSalaryEntry: career.avgSalaryEntry,
      growthRate: career.growthRate,
    };
    this.careers.push(newCareer);
    return newCareer;
  }

  async getCareerByName(name: string): Promise<Career | undefined> {
    return this.careers.find((c) => c.careerName === name);
  }

  async getCareerById(id: number): Promise<Career | undefined> {
    return this.careers.find((c) => c.id === id);
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const newPrediction: Prediction = {
      id: this.predictionId++,
      userId: prediction.userId,
      careerId: prediction.careerId,
      confidence: prediction.confidence,
      date: new Date().toISOString(),
      gaps: prediction.gaps ?? [],
      matchingSkills: prediction.matchingSkills ?? [],
      progression: prediction.progression ?? [],
    };
    this.predictions.push(newPrediction);
    return newPrediction;
  }

  async getPredictions(userId: number): Promise<Prediction[]> {
    return this.predictions
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
  }

  async createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap> {
    const newRoadmap: Roadmap = {
      id: this.roadmapId++,
      careerId: roadmap.careerId,
      courses: roadmap.courses ?? [],
      certifications: roadmap.certifications ?? [],
      projects: roadmap.projects ?? [],
      learningPath: roadmap.learningPath,
    };
    this.roadmaps.push(newRoadmap);
    return newRoadmap;
  }

  async getRoadmapByCareerId(careerId: number): Promise<Roadmap | undefined> {
    return this.roadmaps.find((r) => r.careerId === careerId);
  }
}

export const storage = new MemStorage();