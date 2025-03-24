import type { InsertUser, Language, Quiz, QuizResult, Status, User } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { drizzle } from "drizzle-orm/postgres-js";
import session from "express-session";
import createMemoryStore from "memorystore";
import mongoose from 'mongoose';
import postgres from "postgres";
import { config } from './config';
import { Language as MongoLanguage, Status as MongoStatus } from './models/schema';
import { User as UserModel } from './models/User';

// Setup PostgreSQL connection
const connectionString = process.env.DATABASE_URL;
// Create PostgreSQL client and drizzle instance
let client: postgres.Sql | undefined;
let db: ReturnType<typeof drizzle> | undefined;

try {
  client = postgres(connectionString as string);
  db = drizzle(client);
  console.log('Connected to PostgreSQL database');
} catch (error) {
  console.error('Failed to connect to PostgreSQL:', error);
  client = undefined;
  db = undefined;
}

// Create session stores
const PostgresSessionStore = connectPg(session);
const pgSessionStore = new PostgresSessionStore({
  conObject: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  createTableIfMissing: true,
});

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, "confirmPassword">): Promise<User>;
  updateUserProfile(id: number, data: { username?: string; email?: string }): Promise<User>;
  updateUserPassword(id: number, hashedPassword: string): Promise<void>;
  updateUserProfilePicture(id: number, profilePicture: string): Promise<void>;
  deleteUser(id: number): Promise<void>;
  
  // Quiz operations
  createQuiz(quiz: Omit<Quiz, "id" | "createdAt">): Promise<Quiz>;
  getQuizzes(): Promise<Quiz[]>;
  getQuizById(id: number): Promise<Quiz | undefined>;
  getQuizzesByUser(userId: number): Promise<Quiz[]>;
  
  // Quiz Result operations
  createQuizResult(result: Omit<QuizResult, "id" | "completedAt">): Promise<QuizResult>;
  getQuizResults(userId: number): Promise<QuizResult[]>;
  
  // Status operations
  getStatuses(): Promise<Status[]>;
  createStatus(status: Omit<Status, "id" | "createdAt">): Promise<Status>;
  
  // Language operations
  getLanguages(): Promise<Language[]>;
  createLanguage(language: Omit<Language, "id">): Promise<Language>;
  
  // Session store
  sessionStore: any; // Use 'any' for session store to avoid type issues
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizzes: Map<number, Quiz>;
  private quizResults: Map<number, QuizResult>;
  private statuses: Map<number, Status>;
  private languages: Map<number, Language>;
  
  currentUserId: number;
  currentQuizId: number;
  currentQuizResultId: number;
  currentStatusId: number;
  currentLanguageId: number;
  sessionStore: any; // Use any type for session store

  constructor() {
    this.users = new Map();
    this.quizzes = new Map();
    this.quizResults = new Map();
    this.statuses = new Map();
    this.languages = new Map();
    
    this.currentUserId = 1;
    this.currentQuizId = 1;
    this.currentQuizResultId = 1;
    this.currentStatusId = 1;
    this.currentLanguageId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with sample data
    this._initStatuses();
    this._initLanguages();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: Omit<InsertUser, "confirmPassword">): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      role: "user", // Set default role
      profilePicture: null,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserProfile(id: number, data: { username?: string; email?: string }): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserPassword(id: number, hashedPassword: string): Promise<void> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    user.password = hashedPassword;
    this.users.set(id, user);
  }
  
  async updateUserProfilePicture(id: number, profilePicture: string): Promise<void> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    user.profilePicture = profilePicture;
    this.users.set(id, user);
  }
  
  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
  }
  
  // Quiz operations
  async createQuiz(quiz: Omit<Quiz, "id" | "createdAt">): Promise<Quiz> {
    const id = this.currentQuizId++;
    const now = new Date();
    const newQuiz: Quiz = { ...quiz, id, createdAt: now };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }
  
  async getQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values());
  }
  
  async getQuizById(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }
  
  async getQuizzesByUser(userId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(
      (quiz) => quiz.createdBy === userId,
    );
  }
  
  // Quiz Result operations
  async createQuizResult(result: Omit<QuizResult, "id" | "completedAt">): Promise<QuizResult> {
    const id = this.currentQuizResultId++;
    const now = new Date();
    const newResult: QuizResult = { ...result, id, completedAt: now };
    this.quizResults.set(id, newResult);
    return newResult;
  }
  
  async getQuizResults(userId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(
      (result) => result.userId === userId,
    );
  }
  
  // Status operations
  async getStatuses(): Promise<Status[]> {
    return Array.from(this.statuses.values());
  }
  
  async createStatus(status: Omit<Status, "id" | "createdAt">): Promise<Status> {
    const id = this.currentStatusId++;
    const now = new Date();
    const newStatus: Status = { ...status, id, createdAt: now };
    this.statuses.set(id, newStatus);
    return newStatus;
  }
  
  // Language operations
  async getLanguages(): Promise<Language[]> {
    return Array.from(this.languages.values());
  }
  
  async createLanguage(language: Omit<Language, "id">): Promise<Language> {
    const id = this.currentLanguageId++;
    const newLanguage: Language = { ...language, id };
    this.languages.set(id, newLanguage);
    return newLanguage;
  }
  
  // Initialize sample data
  private _initStatuses(): void {
    const statuses = [
      { name: "API Service", description: "Operating normally", color: "#10B981" },
      { name: "Database Service", description: "Degraded performance", color: "#F59E0B" },
      { name: "Authentication Service", description: "Operating normally", color: "#10B981" },
      { name: "File Storage", description: "Service disruption", color: "#EF4444" },
    ];
    
    statuses.forEach((status) => {
      const id = this.currentStatusId++;
      const now = new Date();
      this.statuses.set(id, { ...status, id, createdAt: now });
    });
  }
  
  private _initLanguages(): void {
    const languages = [
      { name: "JavaScript", count: 45, percentage: 45 },
      { name: "Python", count: 30, percentage: 30 },
      { name: "Java", count: 20, percentage: 20 },
      { name: "C#", count: 15, percentage: 15 },
      { name: "PHP", count: 10, percentage: 10 },
      { name: "Ruby", count: 5, percentage: 5 },
    ];
    
    languages.forEach((language) => {
      const id = this.currentLanguageId++;
      this.languages.set(id, { ...language, id });
    });
  }
}

export class MongoDBStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = pgSessionStore;
  }

  async connect() {
    await mongoose.connect(config.database.uri);
    console.log('Connected to MongoDB database');
  }

  async getUser(id: number): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    if (!user) return undefined;
    return this._transformUser(user);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username });
    if (!user) return undefined;
    return this._transformUser(user);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email });
    if (!user) return undefined;
    return this._transformUser(user);
  }

  async createUser(user: Omit<InsertUser, "confirmPassword">): Promise<User> {
    const newUser = await UserModel.create(user);
    return this._transformUser(newUser);
  }

  async updateUserProfile(id: number, data: { username?: string; email?: string }): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new Error("User not found");
    return this._transformUser(user);
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { password: hashedPassword });
  }

  async updateUserProfilePicture(id: number, profilePicture: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { profilePicture });
  }

  async deleteUser(id: number): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  private _transformUser(mongoUser: any): User {
    return {
      id: mongoUser._id.toString(),
      username: mongoUser.username,
      email: mongoUser.email,
      password: mongoUser.password,
      role: mongoUser.role,
      profilePicture: mongoUser.profilePicture,
      createdAt: mongoUser.createdAt
    };
  }

  async createQuiz(quiz: Omit<Quiz, "id" | "createdAt">): Promise<Quiz> {
    throw new Error("Method not implemented.");
  }

  async getQuizzes(): Promise<Quiz[]> {
    throw new Error("Method not implemented.");
  }

  async getQuizById(id: number): Promise<Quiz | undefined> {
    throw new Error("Method not implemented.");
  }

  async getQuizzesByUser(userId: number): Promise<Quiz[]> {
    throw new Error("Method not implemented.");
  }

  async createQuizResult(result: Omit<QuizResult, "id" | "completedAt">): Promise<QuizResult> {
    throw new Error("Method not implemented.");
  }

  async getQuizResults(userId: number): Promise<QuizResult[]> {
    throw new Error("Method not implemented.");
  }

  async createStatus(status: Omit<Status, "id" | "createdAt">): Promise<Status> {
    const mongoStatus = new MongoStatus({
      name: status.name,
      created_at: new Date(),
      updated_at: new Date()
    });
    return await mongoStatus.save() as unknown as Status;
  }

  async getStatuses(): Promise<Status[]> {
    return await MongoStatus.find() as unknown as Status[];
  }

  async getLanguages(): Promise<Language[]> {
    const languages = await MongoLanguage.find();
    return languages.map(lang => ({
      id: parseInt(lang._id.toString(), 16),
      name: lang.name,
      count: lang.count || 0,
      percentage: lang.percentage || 0
    }));
  }

  async createLanguage(language: Omit<Language, "id">): Promise<Language> {
    const mongoLanguage = new MongoLanguage({
      name: language.name,
      count: language.count,
      percentage: language.percentage,
      created_at: new Date(),
      updated_at: new Date()
    });
    const savedLanguage = await mongoLanguage.save();
    return {
      id: parseInt(savedLanguage._id.toString(), 16),
      name: savedLanguage.name,
      count: savedLanguage.count,
      percentage: savedLanguage.percentage
    };
  }
}

// Use MongoDB storage if available, otherwise fallback to memory storage
let storage: IStorage;

const initStorage = async () => {
  try {
    const mongoStorage = new MongoDBStorage();
    await mongoStorage.connect();
    storage = mongoStorage;
    console.log('Using MongoDB storage');
  } catch (error) {
    console.error('Error initializing MongoDB storage, falling back to memory storage:', error);
    storage = new MemStorage();
  }
};

initStorage();

export { storage };
