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
