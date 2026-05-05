/**
 * Task management for Produco - TypeScript version
 * Type-safe task management
 */

import { Task } from './api';

export class TaskManager {
  private tasks: Task[] = [];
  private storage: any;

  constructor(storage: any) {
    this.storage = storage;
    this.loadTasks();
  }

  private loadTasks(): void {
    const data = this.storage.getItem('tasks');
    if (data) {
      this.tasks = JSON.parse(data);
    }
  }

  private saveTasks(): void {
    this.storage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(title: string, description: string = '', priority: 'low' | 'medium' | 'high' = 'medium', dueDate?: string): Task {
    const task: Task = {
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

  completeTask(taskId: number): Task | null {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      task.completed = true;
      task.completedAt = new Date().toISOString();
      this.saveTasks();
      return task;
    }
    return null;
  }

  deleteTask(taskId: number): boolean {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      return true;
    }
    return false;
  }

  getTask(taskId: number): Task | undefined {
    return this.tasks.find(t => t.id === taskId);
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getPendingTasks(): Task[] {
    return this.tasks.filter(t => !t.completed);
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter(t => t.completed);
  }

  getTasksByPriority(priority: 'low' | 'medium' | 'high'): Task[] {
    return this.tasks.filter(t => t.priority === priority);
  }
}
