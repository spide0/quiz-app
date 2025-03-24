import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Database connection string
const connectionString = process.env.DATABASE_URL;

async function main() {
  if (!connectionString) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("Connecting to database...");
  
  // Create a postgres client
  const client = postgres(connectionString, { max: 1 });
  
  // Create a drizzle instance
  const db = drizzle(client);
  
  console.log("Creating tables...");
  
  // Check if tables exist and create them if they don't
  try {
    // Create users table
    await client`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      profile_picture TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Users table created or already exists");
    
    // Create quizzes table
    await client`CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Quizzes table created or already exists");
    
    // Create quiz_results table
    await client`CREATE TABLE IF NOT EXISTS quiz_results (
      id SERIAL PRIMARY KEY,
      quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Quiz results table created or already exists");
    
    // Create statuses table
    await client`CREATE TABLE IF NOT EXISTS statuses (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      color VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("Statuses table created or already exists");
    
    // Create languages table
    await client`CREATE TABLE IF NOT EXISTS languages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      count INTEGER NOT NULL,
      percentage INTEGER NOT NULL
    )`;
    console.log("Languages table created or already exists");
    
    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
  
  // Close the connection
  await client.end();
  
  process.exit(0);
}

main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});