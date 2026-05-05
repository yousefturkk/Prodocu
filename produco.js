/**
 * Main Produco application
 * Entry point for the productivity tracker
 */

const TaskManager = require('./task');
const FocusTimer = require('./timer');
const LocalStorage = require('./storage');
const Statistics = require('./stats');

class Produco {
  constructor() {
    this.storage = new LocalStorage();
    this.taskManager = new TaskManager(this.storage);
    this.timer = new FocusTimer();
    this.sessions = [];
    this.loadSessions();
  }

  loadSessions() {
    const data = this.storage.getItem('sessions');
    if (data) {
      this.sessions = data;
    }
  }

  saveSessions() {
    this.storage.setItem('sessions', this.sessions);
  }

  addTask(title, description, priority, dueDate) {
    return this.taskManager.addTask(title, description, priority, dueDate);
  }

  completeTask(taskId) {
    const task = this.taskManager.completeTask(taskId);
    if (task) {
      this.logSession(task.id);
    }
    return task;
  }

  deleteTask(taskId) {
    return this.taskManager.deleteTask(taskId);
  }

  getTasks() {
    return this.taskManager.getAllTasks();
  }

  startFocus(taskId) {
    const task = this.taskManager.getTask(taskId);
    if (task) {
      return this.timer.start(task.title);
    }
    return false;
  }

  pauseFocus() {
    return this.timer.pause();
  }

  resumeFocus() {
    return this.timer.resume();
  }

  stopFocus() {
    const session = this.timer.stop();
    if (session) {
      this.sessions.push(session);
      this.saveSessions();
    }
    return session;
  }

  logSession(taskId) {
    const session = {
      id: Date.now(),
      taskId,
      durationMinutes: 25,
      endedAt: new Date().toISOString()
    };
    this.sessions.push(session);
    this.saveSessions();
  }

  getStats() {
    const stats = new Statistics(this.getTasks(), this.sessions);
    return stats.getSummary();
  }

  exportData() {
    return {
      tasks: this.getTasks(),
      sessions: this.sessions,
      stats: this.getStats(),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data) {
    if (data.tasks) {
      this.storage.setItem('tasks', JSON.stringify(data.tasks));
      this.taskManager.loadTasks();
    }
    if (data.sessions) {
      this.sessions = data.sessions;
      this.saveSessions();
    }
  }
}

module.exports = Produco;
