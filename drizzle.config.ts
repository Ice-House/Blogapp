import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment-specific configuration
const env = process.env.NODE_ENV || 'development';
dotenv.config({ 
  path: resolve(process.cwd(), 'server', `.env.${env}`)
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Please check your environment configuration.");
}

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  driver: "pglite",  // Changed back to pglite to match the Config type
  dbCredentials: {
    // Use connectionString instead of url
    url: "postgresql://postgres:dLdUlZYrGtMgLEjUEDhaQFZExfkSNlPp@tramway.proxy.rlwy.net:16867/railway",
    // Removed unsupported 'ssl' property
  },
  verbose: true,
  strict: true
});