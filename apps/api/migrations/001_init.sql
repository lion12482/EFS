CREATE TABLE IF NOT EXISTS shared_fits (
  id TEXT PRIMARY KEY,
  parent_id TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  visibility TEXT NOT NULL,
  fit_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prices (
  type_id INTEGER PRIMARY KEY,
  price REAL NOT NULL,
  source TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
