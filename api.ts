/**
 * API layer for Produco
 * TypeScript interfaces and API functions
 */

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
}

export interface FocusSession {
  id: number;
  taskId: number;
  durationMinutes: number;
  startedAt: string;
  endedAt: string;
}

export interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalFocusMinutes: number;
  streak: number;
}

class ProducoAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${this.baseUrl}/tasks`);
    return response.json();
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return response.json();
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }

  async deleteTask(id: number): Promise<void> {
    await fetch(`${this.baseUrl}/tasks/${id}`, { method: 'DELETE' });
  }

  async getSessions(): Promise<FocusSession[]> {
    const response = await fetch(`${this.baseUrl}/sessions`);
    return response.json();
  }

  async createSession(session: Omit<FocusSession, 'id'>): Promise<FocusSession> {
    const response = await fetch(`${this.baseUrl}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    return response.json();
  }

  async getStats(): Promise<Stats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    return response.json();
  }
}

export const api = new ProducoAPI();
