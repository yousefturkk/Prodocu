/**
 * Focus timer for Produco
 * JavaScript implementation of the focus timer
 */

class FocusTimer {
  constructor(workDuration = 25, breakDuration = 5) {
    this.workDuration = workDuration * 60; // Convert to seconds
    this.breakDuration = breakDuration * 60;
    this.timeRemaining = this.workDuration;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    this.onTick = null;
    this.onComplete = null;
    this.currentTask = null;
  }

  start(task = null) {
    if (this.isRunning) return false;
    
    this.isRunning = true;
    this.isPaused = false;
    this.currentTask = task;
    this.timeRemaining = this.workDuration;
    
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
    
    return true;
  }

  pause() {
    if (!this.isRunning || this.isPaused) return false;
    
    this.isPaused = true;
    clearInterval(this.interval);
    return true;
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return false;
    
    this.isPaused = false;
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
    return true;
  }

  stop() {
    if (!this.isRunning) return null;
    
    clearInterval(this.interval);
    const session = {
      task: this.currentTask,
      duration: (this.workDuration - this.timeRemaining) / 60,
      completed: this.timeRemaining <= 0
    };
    
    this.isRunning = false;
    this.isPaused = false;
    this.timeRemaining = this.workDuration;
    this.currentTask = null;
    
    return session;
  }

  tick() {
    this.timeRemaining--;
    
    if (this.onTick) {
      this.onTick(this.timeRemaining);
    }
    
    if (this.timeRemaining <= 0) {
      this.complete();
    }
  }

  complete() {
    clearInterval(this.interval);
    this.isRunning = false;
    
    if (this.onComplete) {
      this.onComplete();
    }
  }

  getRemainingTime() {
    return this.timeRemaining;
  }

  getFormattedTime() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  isWorkSession() {
    return this.timeRemaining > 0;
  }
}

module.exports = FocusTimer;
