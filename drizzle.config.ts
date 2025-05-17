import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { resolve } from "path";

const env = process.env.NODE_ENV || "development";
dotenv.config({ 
  path: resolve(process.cwd(), "server", `.env.${env}`)
});

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",  // Changed from "pg" to "postgresql"
  dbCredentials: {
    host: "tramway.proxy.rlwy.net",
    port: 16867,
    user: "postgres",
    password: "dLdUlZYrGtMgLEjUEDhaQFZExfkSNlPp",
    database: "railway"
  }
});