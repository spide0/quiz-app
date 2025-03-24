import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
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
  
  console.log("Running migrations...");
  
  // Run migrations
  await migrate(db, { migrationsFolder: "drizzle" });
  
  console.log("Migrations completed successfully!");
  
  // Close the connection
  await client.end();
  
  process.exit(0);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});