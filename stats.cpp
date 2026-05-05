/**
 * Statistics calculation for Produco - C++ implementation
 * Performance-optimized statistics
 */

#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <algorithm>

struct Task {
    int id;
    bool completed;
};

struct Session {
    int durationMinutes;
    std::string endedAt;
};

class Statistics {
private:
    std::vector<Task> tasks;
    std::vector<Session> sessions;
    
public:
    Statistics(const std::vector<Task>& t, const std::vector<Session>& s) 
        : tasks(t), sessions(s) {}
    
    double getCompletionRate() {
        if (tasks.empty()) return 0.0;
        
        int completed = 0;
        for (const auto& task : tasks) {
            if (task.completed) completed++;
        }
        
        return (static_cast<double>(completed) / tasks.size()) * 100.0;
    }
    
    int getTotalFocusTime() {
        int total = 0;
        for (const auto& session : sessions) {
            total += session.durationMinutes;
        }
        return total;
    }
    
    double getAverageSessionLength() {
        if (sessions.empty()) return 0.0;
        
        return static_cast<double>(getTotalFocusTime()) / sessions.size();
    }
    
    int getStreak() {
        if (sessions.empty()) return 0;
        
        int streak = 0;
        // Simplified streak calculation
        // In production, this would parse dates and calculate consecutive days
        for (size_t i = 0; i < sessions.size(); i++) {
            streak++;
        }
        
        return streak;
    }
    
    void printSummary() {
        std::cout << "=== Statistics Summary ===" << std::endl;
        std::cout << "Total tasks: " << tasks.size() << std::endl;
        std::cout << "Completion rate: " << getCompletionRate() << "%" << std::endl;
        std::cout << "Total focus time: " << getTotalFocusTime() << " minutes" << std::endl;
        std::cout << "Average session: " << getAverageSessionLength() << " minutes" << std::endl;
        std::cout << "Streak: " << getStreak() << " days" << std::endl;
    }
};

int main() {
    std::vector<Task> tasks = {
        {1, true},
        {2, false},
        {3, true}
    };
    
    std::vector<Session> sessions = {
        {25, "2024-01-01"},
        {30, "2024-01-02"}
    };
    
    Statistics stats(tasks, sessions);
    stats.printSummary();
    
    return 0;
}
