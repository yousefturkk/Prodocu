/**
 * Focus timer for Produco - C++ implementation
 * High-precision timing for focus sessions
 */

#include <iostream>
#include <chrono>
#include <thread>
#include <atomic>
#include <functional>

class FocusTimer {
private:
    std::atomic<bool> isRunning;
    std::atomic<bool> isPaused;
    int workDuration;
    int breakDuration;
    int timeRemaining;
    std::string currentTask;
    std::function<void()> onTick;
    std::function<void()> onComplete;
    std::thread timerThread;
    
public:
    FocusTimer(int workMin = 25, int breakMin = 5) 
        : isRunning(false), isPaused(false), 
          workDuration(workMin * 60), breakDuration(breakMin * 60),
          timeRemaining(workDuration) {
        std::cout << "Focus timer initialized" << std::endl;
    }
    
    ~FocusTimer() {
        stop();
    }
    
    bool start(const std::string& task = "") {
        if (isRunning) return false;
        
        isRunning = true;
        isPaused = false;
        currentTask = task;
        timeRemaining = workDuration;
        
        timerThread = std::thread([this]() {
            while (isRunning && timeRemaining > 0) {
                if (!isPaused) {
                    std::this_thread::sleep_for(std::chrono::seconds(1));
                    timeRemaining--;
                    
                    if (onTick) {
                        onTick();
                    }
                } else {
                    std::this_thread::sleep_for(std::chrono::milliseconds(100));
                }
            }
            
            if (timeRemaining <= 0 && onComplete) {
                onComplete();
            }
        });
        
        return true;
    }
    
    bool pause() {
        if (!isRunning || isPaused) return false;
        isPaused = true;
        return true;
    }
    
    bool resume() {
        if (!isRunning || !isPaused) return false;
        isPaused = false;
        return true;
    }
    
    void stop() {
        isRunning = false;
        if (timerThread.joinable()) {
            timerThread.join();
        }
    }
    
    int getTimeRemaining() const {
        return timeRemaining;
    }
    
    std::string getFormattedTime() const {
        int minutes = timeRemaining / 60;
        int seconds = timeRemaining % 60;
        char buffer[10];
        snprintf(buffer, sizeof(buffer), "%02d:%02d", minutes, seconds);
        return std::string(buffer);
    }
    
    bool getIsRunning() const {
        return isRunning;
    }
    
    void setOnTick(std::function<void()> callback) {
        onTick = callback;
    }
    
    void setOnComplete(std::function<void()> callback) {
        onComplete = callback;
    }
};

int main() {
    FocusTimer timer;
    
    timer.setOnTick([&]() {
        std::cout << "Time remaining: " << timer.getFormattedTime() << std::endl;
    });
    
    timer.setOnComplete([&]() {
        std::cout << "Focus session complete!" << std::endl;
    });
    
    timer.start("Test task");
    
    // Run for 5 seconds then stop
    std::this_thread::sleep_for(std::chrono::seconds(5));
    timer.stop();
    
    return 0;
}
