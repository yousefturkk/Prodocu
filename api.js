/**
 * API client for Produco
 * JavaScript implementation of API calls
 */

class ProducoAPI {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async getTasks() {
    const response = await fetch(`${this.baseUrl}/tasks`);
    return response.json();
  }

  async createTask(task) {
    const response = await fetch(`${this.baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return response.json();
  }

  async updateTask(id, updates) {
    const response = await fetch(`${this.baseUrl}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }

  async deleteTask(id) {
    await fetch(`${this.baseUrl}/tasks/${id}`, { method: 'DELETE' });
  }

  async getSessions() {
    const response = await fetch(`${this.baseUrl}/sessions`);
    return response.json();
  }

  async createSession(session) {
    const response = await fetch(`${this.baseUrl}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    return response.json();
  }

  async getStats() {
    const response = await fetch(`${this.baseUrl}/stats`);
    return response.json();
  }
}

module.exports = ProducoAPI;
