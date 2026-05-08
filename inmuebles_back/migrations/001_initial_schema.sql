-- Initial PostgreSQL schema for the project and task manager.
-- Apply with:
-- psql "$DATABASE_URL" -f inmuebles_back/migrations/001_initial_schema.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL DEFAULT '',
  email VARCHAR NOT NULL UNIQUE DEFAULT '',
  password_hash VARCHAR NOT NULL UNIQUE DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_users_name ON users (name);
CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL DEFAULT '',
  description VARCHAR NOT NULL DEFAULT '',
  user_id INTEGER NOT NULL REFERENCES users (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_projects_name ON projects (name);
CREATE INDEX IF NOT EXISTS ix_projects_description ON projects (description);
CREATE INDEX IF NOT EXISTS ix_projects_user_id ON projects (user_id);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL DEFAULT '',
  description VARCHAR NOT NULL DEFAULT '',
  status VARCHAR NOT NULL DEFAULT 'pendiente',
  project_id INTEGER NOT NULL REFERENCES projects (id),
  user_id INTEGER NOT NULL REFERENCES users (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_tasks_status
    CHECK (status IN ('pendiente', 'completada'))
);

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS ck_tasks_status;

UPDATE tasks
SET status = CASE status
  WHEN 'pending' THEN 'pendiente'
  WHEN 'in progress' THEN 'pendiente'
  WHEN 'completed' THEN 'completada'
  ELSE status
END
WHERE status IN ('pending', 'in progress', 'completed');

ALTER TABLE tasks
  ADD CONSTRAINT ck_tasks_status
  CHECK (status IN ('pendiente', 'completada'));

CREATE INDEX IF NOT EXISTS ix_tasks_title ON tasks (title);
CREATE INDEX IF NOT EXISTS ix_tasks_description ON tasks (description);
