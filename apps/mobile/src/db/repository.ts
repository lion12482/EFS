import * as SQLite from "expo-sqlite";
import { type Fit, deserializeFit, serializeFit } from "@efs/core";

const DB_NAME = "efs.db";

export interface FitRecord {
    id: string;
    name: string;
    hull_type_id: number;
    fit_json: string;
    tags: string | null;
    favorite: number;
    created_at: string;
    updated_at: string;
}

export function openDb() {
    return SQLite.openDatabaseSync(DB_NAME);
}

export function initDb() {
    const db = openDb();
    db.execSync(`
CREATE TABLE IF NOT EXISTS fits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hull_type_id INTEGER NOT NULL,
  fit_json TEXT NOT NULL,
  tags TEXT,
  favorite INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prices (
  type_id INTEGER PRIMARY KEY,
  price REAL NOT NULL,
  source TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
  `);
}

export function saveFitInDb(fit: Fit, tags?: string, favorite: boolean = false) {
    const db = openDb();
    const now = new Date().toISOString();
    db.runSync(
        `INSERT INTO fits (id, name, hull_type_id, fit_json, tags, favorite, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET 
       name=excluded.name, 
       hull_type_id=excluded.hull_type_id, 
       fit_json=excluded.fit_json, 
       tags=COALESCE(excluded.tags, fits.tags),
       favorite=excluded.favorite,
       updated_at=excluded.updated_at`,
        fit.fitId,
        fit.name,
        fit.hullTypeId,
        serializeFit(fit),
        tags || null,
        favorite ? 1 : 0,
        fit.createdAt || now,
        now
    );
}

export function getFitsFromDb(): (Fit & { isFavorite: boolean })[] {
    const db = openDb();
    const rows = db.getAllSync<FitRecord>("SELECT * FROM fits ORDER BY updated_at DESC");
    return rows.map((row) => {
        const fit = deserializeFit(row.fit_json);
        return {
            ...fit,
            isFavorite: row.favorite === 1
        };
    });
}

export function getFitByIdFromDb(id: string): (Fit & { isFavorite: boolean }) | null {
    const db = openDb();
    const row = db.getFirstSync<FitRecord>("SELECT * FROM fits WHERE id = ?", id);
    if (!row) return null;
    const fit = deserializeFit(row.fit_json);
    return { ...fit, isFavorite: row.favorite === 1 };
}

export function deleteFitFromDb(id: string) {
    const db = openDb();
    db.runSync("DELETE FROM fits WHERE id = ?", id);
}
