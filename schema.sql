-- Database initialization schema for Demo Portal
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  access_code TEXT UNIQUE NOT NULL,
  active INTEGER NOT NULL DEFAULT 1, -- Boolean stored as 0 or 1 in SQLite/D1
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index to optimize access code lookups
CREATE INDEX IF NOT EXISTS idx_projects_access_code ON projects(access_code);
