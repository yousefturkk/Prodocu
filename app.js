// Produco - Simple Productivity Tracker
// Credits Who made this: Zenith.gg

class ProducoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('produco_tasks')) || [];
        this.currentFilter = 'all';
        this.timerInterval = null;
        this.timerSeconds = 25 * 60; // 25 minutes default
        this.isTimerRunning = false;
        this.sessionsCompleted = parseInt(localStorage.getItem('produco_sessions_today') || '0');
        this.totalFocusTime = parseInt(localStorage.getItem('produco_total_focus') || '0');
        this.streak = parseInt(localStorage.getItem('produco_streak') || '0');
        this.lastActiveDate = localStorage.getItem('produco_last_active') || '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTasks();
        this.updateStats();
        this.checkStreak();
        this.renderDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Tasks
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Task filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterTasks(e.target.dataset.filter));
        });

        // Timer
        document.getElementById('startTimer').addEventListener('click', () => this.startTimer());
        document.getElementById('pauseTimer').addEventListener('click', () => this.pauseTimer());
        document.getElementById('resetTimer').addEventListener('click', () => this.resetTimer());

        // Timer presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setTimerPreset(parseInt(e.target.dataset.minutes)));
        });
    }

    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        // Update specific tab content
        if (tabName === 'stats') {
            this.updateStatsPage();
        }
    }

    // Task Management
    addTask() {
        const input = document.getElementById('taskInput');
        const priority = document.getElementById('taskPriority').value;
        const text = input.value.trim();

        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.loadTasks();
        this.updateStats();
        this.addActivity(`Added task: ${text}`);

        input.value = '';
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;

        this.saveTasks();
        this.loadTasks();
        this.updateStats();

        if (task.completed) {
            this.addActivity(`Completed: ${task.text}`);
            this.unlockAchievement('first-task');
        } else {
            this.addActivity(`Uncompleted: ${task.text}`);
        }
    }

    deleteTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.loadTasks();
        this.updateStats();
        this.addActivity(`Deleted: ${task.text}`);
    }

    filterTasks(filter) {
        this.currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.loadTasks();
    }

    loadTasks() {
        const taskList = document.getElementById('taskList');
        let filteredTasks = this.tasks;

        if (this.currentFilter === 'active') {
            filteredTasks = this.tasks.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filteredTasks = this.tasks.filter(t => t.completed);
        }

        taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<div class="task-item">No tasks found. Add one above!</div>';
            return;
        }

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.priority}-priority ${task.completed ? 'completed' : ''}`;
            
            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="task-delete">Delete</button>
            `;

            taskElement.querySelector('.task-checkbox').addEventListener('change', () => this.toggleTask(task.id));
            taskElement.querySelector('.task-delete').addEventListener('click', () => this.deleteTask(task.id));

            taskList.appendChild(taskElement);
        });
    }

    saveTasks() {
        localStorage.setItem('produco_tasks', JSON.stringify(this.tasks));
    }

    // Timer Management
    setTimerPreset(minutes) {
        if (this.isTimerRunning) return;
        
        this.timerSeconds = minutes * 60;
        this.updateTimerDisplay();
        
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-minutes="${minutes}"]`).classList.add('active');
    }

    startTimer() {
        if (this.isTimerRunning) return;
        
        this.isTimerRunning = true;
        this.addActivity('Started focus session');
        
        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            this.updateTimerDisplay();
            
            if (this.timerSeconds <= 0) {
                this.completeTimerSession();
            }
        }, 1000);
    }

    pauseTimer() {
        if (!this.isTimerRunning) return;
        
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
        this.addActivity('Paused focus session');
    }

    resetTimer() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
        this.timerSeconds = 25 * 60;
        this.updateTimerDisplay();
        this.addActivity('Reset timer');
    }

    completeTimerSession() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
        
        this.sessionsCompleted++;
        this.totalFocusTime += 25; // Default session length
        
        localStorage.setItem('produco_sessions_today', this.sessionsCompleted.toString());
        localStorage.setItem('produco_total_focus', this.totalFocusTime.toString());
        
        this.updateTimerStats();
        this.updateStats();
        this.addActivity('Completed focus session! +25 minutes');
        
        this.unlockAchievement('focus-warrior');
        
        // Reset timer for next session
        this.timerSeconds = 25 * 60;
        this.updateTimerDisplay();
        
        // Show completion message
        alert('🎉 Focus session completed! Great job!');
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timerDisplay').textContent = display;
    }

    updateTimerStats() {
        document.getElementById('sessionsCompleted').textContent = this.sessionsCompleted;
        document.getElementById('totalFocusTime').textContent = this.totalFocusTime;
    }

    // Statistics and Dashboard
    updateStats() {
        const today = new Date().toDateString();
        const todayTasks = this.tasks.filter(t => 
            new Date(t.createdAt).toDateString() === today
        );
        
        const completedToday = todayTasks.filter(t => t.completed).length;
        const focusMinutesToday = parseInt(localStorage.getItem('produco_focus_today') || '0');
        const productivityScore = this.calculateProductivityScore();

        document.getElementById('tasksCompleted').textContent = completedToday;
        document.getElementById('focusTime').textContent = focusMinutesToday;
        document.getElementById('streak').textContent = this.streak;
        document.getElementById('productivityScore').textContent = productivityScore;
    }

    calculateProductivityScore() {
        const today = new Date().toDateString();
        const todayTasks = this.tasks.filter(t => 
            new Date(t.createdAt).toDateString() === today
        );
        
        let score = 0;
        
        // Points for completed tasks
        score += todayTasks.filter(t => t.completed).length * 10;
        
        // Bonus points for high priority tasks
        score += todayTasks.filter(t => t.completed && t.priority === 'high').length * 5;
        
        // Points for focus sessions
        score += this.sessionsCompleted * 25;
        
        // Streak bonus
        score += this.streak * 5;
        
        return score;
    }

    renderDashboard() {
        this.updateStats();
        this.updateTimerStats();
        this.renderActivity();
    }

    updateStatsPage() {
        // Week stats
        const weekStats = this.getWeekStats();
        document.getElementById('weekTasks').textContent = weekStats.tasks;
        document.getElementById('weekMinutes').textContent = weekStats.minutes;
        document.getElementById('weekScore').textContent = weekStats.score;

        // Month stats
        const monthStats = this.getMonthStats();
        document.getElementById('monthTasks').textContent = monthStats.tasks;
        document.getElementById('monthMinutes').textContent = monthStats.minutes;
        document.getElementById('monthScore').textContent = monthStats.score;

        // Draw chart
        this.drawProductivityChart();
    }

    getWeekStats() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const weekTasks = this.tasks.filter(t => new Date(t.createdAt) >= weekAgo);
        const completedWeekTasks = weekTasks.filter(t => t.completed);
        
        return {
            tasks: completedWeekTasks.length,
            minutes: this.totalFocusTime,
            score: completedWeekTasks.length * 10 + this.totalFocusTime
        };
    }

    getMonthStats() {
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const monthTasks = this.tasks.filter(t => new Date(t.createdAt) >= monthAgo);
        const completedMonthTasks = monthTasks.filter(t => t.completed);
        
        return {
            tasks: completedMonthTasks.length,
            minutes: this.totalFocusTime,
            score: completedMonthTasks.length * 10 + this.totalFocusTime
        };
    }

    drawProductivityChart() {
        const canvas = document.getElementById('productivityChart');
        const ctx = canvas.getContext('2d');
        
        // Simple bar chart for last 7 days
        const days = [];
        const values = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            const dayTasks = this.tasks.filter(t => 
                new Date(t.createdAt).toDateString() === dateStr
            );
            
            const completedCount = dayTasks.filter(t => t.completed).length;
            
            days.push(date.toLocaleDateString('en', { weekday: 'short' }));
            values.push(completedCount * 10); // 10 points per completed task
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        const barWidth = canvas.width / 7 - 10;
        const maxValue = Math.max(...values, 1);
        
        values.forEach((value, index) => {
            const barHeight = (value / maxValue) * (canvas.height - 40);
            const x = index * (barWidth + 10) + 5;
            const y = canvas.height - barHeight - 20;
            
            ctx.fillStyle = '#ff6b35';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw day label
            ctx.fillStyle = '#b8bec7';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(days[index], x + barWidth / 2, canvas.height - 5);
        });
    }

    // Activity Log
    addActivity(message) {
        const activities = JSON.parse(localStorage.getItem('produco_activities') || '[]');
        activities.unshift({
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.splice(50);
        }
        
        localStorage.setItem('produco_activities', JSON.stringify(activities));
        this.renderActivity();
    }

    renderActivity() {
        const activities = JSON.parse(localStorage.getItem('produco_activities') || '[]');
        const activityList = document.getElementById('activityList');
        
        activityList.innerHTML = '';
        
        if (activities.length === 0) {
            activityList.innerHTML = '<div class="activity-item">No recent activity</div>';
            return;
        }
        
        activities.slice(0, 10).forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            
            const time = new Date(activity.timestamp).toLocaleTimeString('en', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            activityElement.innerHTML = `
                <strong>${time}</strong> - ${activity.message}
            `;
            
            activityList.appendChild(activityElement);
        });
    }

    // Achievements
    unlockAchievement(achievementId) {
        const achievements = JSON.parse(localStorage.getItem('produco_achievements') || '[]');
        
        if (achievements.includes(achievementId)) return;
        
        achievements.push(achievementId);
        localStorage.setItem('produco_achievements', JSON.stringify(achievements));
        
        const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (achievementElement) {
            achievementElement.classList.remove('locked');
            achievementElement.classList.add('unlocked');
        }
        
        this.addActivity(`🏆 Achievement unlocked: ${achievementId}`);
    }

    checkStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        if (this.lastActiveDate === today) {
            // Already active today
            return;
        } else if (this.lastActiveDate === yesterday) {
            // Continuing streak
            this.streak++;
        } else if (this.lastActiveDate !== yesterday) {
            // Streak broken
            this.streak = 1;
        }
        
        this.lastActiveDate = today;
        localStorage.setItem('produco_streak', this.streak.toString());
        localStorage.setItem('produco_last_active', today);
        
        if (this.streak >= 7) {
            this.unlockAchievement('streak-master');
        }
        
        if (this.calculateProductivityScore() >= 1000) {
            this.unlockAchievement('productivity-king');
        }
        
        // Load existing achievements
        const achievements = JSON.parse(localStorage.getItem('produco_achievements') || '[]');
        achievements.forEach(achievementId => {
            const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
            if (achievementElement) {
                achievementElement.classList.remove('locked');
                achievementElement.classList.add('unlocked');
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProducoApp();
});
