/**
 * Main Produco application - TypeScript version
 * Type-safe implementation of the productivity tracker
 */

import { TaskManager } from './task';
import { FocusTimer } from './timer';
import { LocalStorage } from './storage';
import { Statistics } from './stats';
import { Task, FocusSession, Stats } from './api';

export class Produco {
  private storage: LocalStorage;
  private taskManager: TaskManager;
  private timer: FocusTimer;
  private sessions: FocusSession[];

  constructor() {
    this.storage = new LocalStorage();
    this.taskManager = new TaskManager(this.storage);
    this.timer = new FocusTimer();
    this.sessions = [];
    this.loadSessions();
  }

  private loadSessions(): void {
    const data = this.storage.getItem<FocusSession[]>('sessions');
    if (data) {
      this.sessions = data;
    }
  }

  private saveSessions(): void {
    this.storage.setItem('sessions', this.sessions);
  }

  addTask(title: string, description?: string, priority?: 'low' | 'medium' | 'high', dueDate?: string): Task {
    return this.taskManager.addTask(title, description, priority, dueDate);
  }

  completeTask(taskId: number): Task | null {
    const task = this.taskManager.completeTask(taskId);
    if (task) {
      this.logSession(task.id);
    }
    return task;
  }

  deleteTask(taskId: number): boolean {
    return this.taskManager.deleteTask(taskId);
  }

  getTasks(): Task[] {
    return this.taskManager.getAllTasks();
  }

  startFocus(taskId: number): boolean {
    const task = this.taskManager.getTask(taskId);
    if (task) {
      return this.timer.start(task.title);
    }
    return false;
  }

  pauseFocus(): boolean {
    return this.timer.pause();
  }

  resumeFocus(): boolean {
    return this.timer.resume();
  }

  stopFocus(): FocusSession | null {
    const session = this.timer.stop();
    if (session) {
      this.sessions.push(session);
      this.saveSessions();
    }
    return session;
  }

  private logSession(taskId: number): void {
    const session: FocusSession = {
      id: Date.now(),
      taskId,
      durationMinutes: 25,
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString()
    };
    this.sessions.push(session);
    this.saveSessions();
  }

  getStats(): Stats {
    const stats = new Statistics(this.getTasks(), this.sessions);
    return stats.getSummary();
  }

  exportData(): any {
    return {
      tasks: this.getTasks(),
      sessions: this.sessions,
      stats: this.getStats(),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data: any): void {
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
