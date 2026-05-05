/**
 * Simple Node.js server for Produco
 * Basic API endpoints for task and session management
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
fs.mkdir(DATA_DIR, { recursive: true }).catch(() => {});

// Helper functions
async function readData(filename) {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeData(filename, data) {
  await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/tasks', async (req, res) => {
  const tasks = await readData('tasks.json');
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const tasks = await readData('tasks.json');
  const newTask = {
    id: tasks.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  await writeData('tasks.json', tasks);
  res.json(newTask);
});

app.patch('/api/tasks/:id', async (req, res) => {
  const tasks = await readData('tasks.json');
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...req.body };
    await writeData('tasks.json', tasks);
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const tasks = await readData('tasks.json');
  const filtered = tasks.filter(t => t.id !== parseInt(req.params.id));
  await writeData('tasks.json', filtered);
  res.json({ success: true });
});

app.get('/api/sessions', async (req, res) => {
  const sessions = await readData('sessions.json');
  res.json(sessions);
});

app.post('/api/sessions', async (req, res) => {
  const sessions = await readData('sessions.json');
  const newSession = {
    id: sessions.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  sessions.push(newSession);
  await writeData('sessions.json', sessions);
  res.json(newSession);
});

app.get('/api/stats', async (req, res) => {
  const tasks = await readData('tasks.json');
  const sessions = await readData('sessions.json');
  
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    totalFocusMinutes: sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    streak: 0 // Would calculate from session dates
  };
  
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Produco server running on port ${PORT}`);
});
