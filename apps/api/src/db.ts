import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dataDir = path.resolve(process.cwd(), ".data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, "efs.sqlite"));

const migrationSql = fs.readFileSync(path.resolve(process.cwd(), "migrations/001_init.sql"), "utf8");
db.exec(migrationSql);
