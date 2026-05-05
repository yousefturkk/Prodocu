/**
 * Prototype version of Produco
 * Quick prototype for testing and validation
 */

class ProducoPrototype {
  constructor() {
    this.tasks = [];
    this.sessions = [];
    this.timer = null;
    this.isRunning = false;
  }

  addTask(title, priority = 'medium') {
    const task = {
      id: Date.now(),
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.tasks.push(task);
    return task;
  }

  startFocus(taskId) {
    if (this.isRunning) return false;
    
    this.isRunning = true;
    this.timer = setInterval(() => {
      console.log('Focus session in progress...');
    }, 60000); // Log every minute
    
    return true;
  }

  stopFocus() {
    if (!this.isRunning) return null;
    
    clearInterval(this.timer);
    this.isRunning = false;
    
    const session = {
      id: Date.now(),
      durationMinutes: 25,
      endedAt: new Date().toISOString()
    };
    this.sessions.push(session);
    return session;
  }

  getStats() {
    return {
      totalTasks: this.tasks.length,
      completed: this.tasks.filter(t => t.completed).length,
      totalSessions: this.sessions.length
    };
  }

  export() {
    return JSON.stringify({
      tasks: this.tasks,
      sessions: this.sessions,
      stats: this.getStats()
    }, null, 2);
  }
}

// Demo
const app = new ProducoPrototype();
app.addTask('Build prototype', 'high');
app.addTask('Test features', 'medium');
console.log(app.export());
