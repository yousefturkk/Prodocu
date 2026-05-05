/**
 * Main Produco application - C++ implementation
 * High-performance productivity tracker
 */

#include <iostream>
#include <vector>
#include <string>
#include <thread>
#include <chrono>

#include "task.cpp"

struct FocusSession {
    int id;
    int taskId;
    int durationMinutes;
    std::string startedAt;
    std::string endedAt;
};

class Produco {
private:
    TaskManager taskManager;
    std::vector<FocusSession> sessions;
    bool isTimerRunning;
    
public:
    Produco() : isTimerRunning(false) {
        std::cout << "Produco C++ initialized" << std::endl;
    }
    
    void addTask(const std::string& title, const std::string& priority = "medium") {
        taskManager.addTask(title, "", priority);
    }
    
    bool completeTask(int taskId) {
        return taskManager.completeTask(taskId);
    }
    
    void startFocus(int taskId) {
        if (isTimerRunning) {
            std::cout << "Timer already running" << std::endl;
            return;
        }
        
        isTimerRunning = true;
        std::cout << "Focus session started for task " << taskId << std::endl;
    }
    
    void stopFocus() {
        if (!isTimerRunning) {
            std::cout << "Timer not running" << std::endl;
            return;
        }
        
        isTimerRunning = false;
        
        FocusSession session;
        session.id = sessions.size() + 1;
        session.durationMinutes = 25;
        session.startedAt = "now";
        session.endedAt = "now";
        sessions.push_back(session);
        
        std::cout << "Focus session completed" << std::endl;
    }
    
    void printStats() {
        auto tasks = taskManager.getAllTasks();
        int completed = taskManager.getCompletedCount();
        int totalFocus = 0;
        
        for (const auto& session : sessions) {
            totalFocus += session.durationMinutes;
        }
        
        std::cout << "=== Produco Stats ===" << std::endl;
        std::cout << "Total tasks: " << tasks.size() << std::endl;
        std::cout << "Completed: " << completed << std::endl;
        std::cout << "Total focus: " << totalFocus << " minutes" << std::endl;
        std::cout << "Sessions: " << sessions.size() << std::endl;
    }
    
    int getTaskCount() {
        return taskManager.getTaskCount();
    }
    
    int getSessionCount() {
        return sessions.size();
    }
};

int main() {
    Produco app;
    
    app.addTask("Build C++ version", "high");
    app.addTask("Optimize performance", "medium");
    app.addTask("Add tests", "low");
    
    app.startFocus(1);
    std::this_thread::sleep_for(std::chrono::seconds(1));
    app.stopFocus();
    
    app.completeTask(1);
    app.printStats();
    
    return 0;
}
