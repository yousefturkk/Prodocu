/**
 * Statistics for Produco
 * Calculate productivity metrics
 */

class Statistics {
  constructor(tasks, sessions) {
    this.tasks = tasks;
    this.sessions = sessions;
  }

  getCompletionRate() {
    if (this.tasks.length === 0) return 0;
    const completed = this.tasks.filter(t => t.completed).length;
    return (completed / this.tasks.length) * 100;
  }

  getTotalFocusTime() {
    return this.sessions.reduce((total, session) => total + session.durationMinutes, 0);
  }

  getAverageSessionLength() {
    if (this.sessions.length === 0) return 0;
    return this.getTotalFocusTime() / this.sessions.length;
  }

  getStreak() {
    if (this.sessions.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = today;
    
    const sessionDates = this.sessions
      .map(s => new Date(s.endedAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));
    
    for (const dateStr of sessionDates) {
      const sessionDate = new Date(dateStr);
      sessionDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  }

  getTasksByPriority() {
    const priorities = { high: 0, medium: 0, low: 0 };
    this.tasks.forEach(task => {
      if (priorities[task.priority] !== undefined) {
        priorities[task.priority]++;
      }
    });
    return priorities;
  }

  getWeeklyFocusTime() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return this.sessions
      .filter(s => new Date(s.endedAt) >= weekAgo)
      .reduce((total, session) => total + session.durationMinutes, 0);
  }

  getSummary() {
    return {
      totalTasks: this.tasks.length,
      completedTasks: this.tasks.filter(t => t.completed).length,
      completionRate: this.getCompletionRate(),
      totalFocusMinutes: this.getTotalFocusTime(),
      averageSessionMinutes: this.getAverageSessionLength(),
      streak: this.getStreak(),
      weeklyFocusMinutes: this.getWeeklyFocusTime(),
      tasksByPriority: this.getTasksByPriority()
    };
  }
}

module.exports = Statistics;
