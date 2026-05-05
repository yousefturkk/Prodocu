/**
 * Task management for Produco
 * JavaScript implementation of task management
 */

class TaskManager {
  constructor(storage) {
    this.storage = storage;
    this.tasks = [];
    this.loadTasks();
  }

  loadTasks() {
    const data = this.storage.getItem('tasks');
    if (data) {
      this.tasks = JSON.parse(data);
    }
  }

  saveTasks() {
    this.storage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(title, description = '', priority = 'medium', dueDate = null) {
    const task = {
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate
    };
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  completeTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      task.completed = true;
      task.completedAt = new Date().toISOString();
      this.saveTasks();
      return task;
    }
    return null;
  }

  deleteTask(taskId) {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      return true;
    }
    return false;
  }

  getTask(taskId) {
    return this.tasks.find(t => t.id === taskId);
  }

  getAllTasks() {
    return this.tasks;
  }

  getPendingTasks() {
    return this.tasks.filter(t => !t.completed);
  }

  getCompletedTasks() {
    return this.tasks.filter(t => t.completed);
  }

  getTasksByPriority(priority) {
    return this.tasks.filter(t => t.priority === priority);
  }
}

module.exports = TaskManager;
