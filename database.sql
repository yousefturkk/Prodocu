-- Produco Database Schema
-- SQL schema for task and session management

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium',
    completed BOOLEAN DEFAULT 0,
    created_at TEXT NOT NULL,
    due_date TEXT,
    completed_at TEXT
);

-- Focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    duration_minutes INTEGER NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_sessions_task_id ON focus_sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_sessions_ended_at ON focus_sessions(ended_at);

-- Insert sample data
INSERT INTO tasks (title, description, priority, created_at) VALUES
('Build MVP', 'Main application development', 'high', datetime('now')),
('Write documentation', 'Create user guide', 'medium', datetime('now')),
('Add tests', 'Unit and integration tests', 'medium', datetime('now'));

INSERT INTO focus_sessions (task_id, duration_minutes, started_at, ended_at) VALUES
(1, 25, datetime('now', '-1 hour'), datetime('now', '-35 minutes')),
(2, 25, datetime('now', '-2 hours'), datetime('now', '-2 hours 25 minutes'));
