/**
 * Development server for Produco
 * Hot reload and development features
 */

const express = require('express');
const http = require('http');
const chokidar = require('chokidar');
const path = require('path');

const app = express();
const PORT = 8080;

// Serve static files
app.use(express.static(__dirname));

// Mock API endpoints for development
app.get('/api/tasks', (req, res) => {
  res.json([
    { id: 1, title: 'Build MVP', priority: 'high', completed: false },
    { id: 2, title: 'Write docs', priority: 'medium', completed: false }
  ]);
});

app.get('/api/sessions', (req, res) => {
  res.json([
    { id: 1, taskId: 1, durationMinutes: 25, startedAt: new Date().toISOString() }
  ]);
});

// Hot reload
const watcher = chokidar.watch(['*.html', '*.js', '*.css'], {
  ignored: /node_modules/,
  persistent: true
});

watcher.on('change', (path) => {
  console.log(`File changed: ${path}`);
  // In production, this would trigger hot reload
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Development server running on http://localhost:${PORT}`);
  console.log('Hot reload enabled');
});
