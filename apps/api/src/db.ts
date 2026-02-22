import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { env } from "./config";

const dataDir = path.resolve(process.cwd(), env.DATABASE_DIR);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, "efs.sqlite"));

db.pragma("journal_mode = WAL");

const migrationsDir = path.resolve(process.cwd(), "migrations");
const migrationFiles = fs.readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();
for (const file of migrationFiles) {
  const migrationSql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
  for (const statement of migrationSql
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)) {
    try {
      db.exec(`${statement};`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("duplicate column name")) {
        throw error;
      }
    }
  }
}
