/**
 * Task management for Produco - C++ implementation
 * High-performance task tracking
 */

#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <ctime>

struct Task {
    int id;
    std::string title;
    std::string description;
    std::string priority;
    bool completed;
    std::string createdAt;
    std::string dueDate;
    std::string completedAt;
};

class TaskManager {
private:
    std::vector<Task> tasks;
    
    std::string getCurrentTimestamp() {
        auto now = std::chrono::system_clock::now();
        std::time_t time = std::chrono::system_clock::to_time_t(now);
        char buffer[26];
        ctime_r(&time, buffer);
        buffer[24] = '\0';
        return std::string(buffer);
    }
    
public:
    TaskManager() {}
    
    void addTask(const std::string& title, const std::string& description = "", 
                 const std::string& priority = "medium", const std::string& dueDate = "") {
        Task task;
        task.id = tasks.size() + 1;
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.completed = false;
        task.createdAt = getCurrentTimestamp();
        task.dueDate = dueDate;
        tasks.push_back(task);
    }
    
    bool completeTask(int taskId) {
        for (auto& task : tasks) {
            if (task.id == taskId && !task.completed) {
                task.completed = true;
                task.completedAt = getCurrentTimestamp();
                return true;
            }
        }
        return false;
    }
    
    bool deleteTask(int taskId) {
        for (auto it = tasks.begin(); it != tasks.end(); ++it) {
            if (it->id == taskId) {
                tasks.erase(it);
                return true;
            }
        }
        return false;
    }
    
    std::vector<Task> getAllTasks() const {
        return tasks;
    }
    
    std::vector<Task> getPendingTasks() const {
        std::vector<Task> pending;
        for (const auto& task : tasks) {
            if (!task.completed) {
                pending.push_back(task);
            }
        }
        return pending;
    }
    
    int getTaskCount() const {
        return tasks.size();
    }
    
    int getCompletedCount() const {
        int count = 0;
        for (const auto& task : tasks) {
            if (task.completed) count++;
        }
        return count;
    }
};

int main() {
    TaskManager manager;
    
    manager.addTask("Build C++ version", "Implement task manager", "high");
    manager.addTask("Test performance", "Benchmark against JS", "medium");
    
    auto tasks = manager.getAllTasks();
    std::cout << "Total tasks: " << tasks.size() << std::endl;
    
    return 0;
}
