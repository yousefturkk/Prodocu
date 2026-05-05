/**
 * Utility functions for Produco - C++ implementation
 * Helper functions for common operations
 */

#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <iomanip>
#include <algorithm>
#include <random>

std::string formatDuration(int minutes) {
    int hours = minutes / 60;
    int mins = minutes % 60;
    
    std::stringstream ss;
    if (hours > 0) {
        ss << hours << "h " << mins << "m";
    } else {
        ss << mins << "m";
    }
    return ss.str();
}

std::string generateId() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1000, 9999);
    
    return std::to_string(dis(gen));
}

std::string getCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto time = std::chrono::system_clock::to_time_t(now);
    
    std::stringstream ss;
    ss << std::put_time(std::localtime(&time), "%Y-%m-%d %H:%M:%S");
    return ss.str();
}

std::string sanitizeFilename(const std::string& filename) {
    std::string result = filename;
    std::string invalidChars = "<>:\"/\\|?*";
    
    for (char c : invalidChars) {
        result.erase(std::remove(result.begin(), result.end(), c), result.end());
    }
    
    std::replace(result.begin(), result.end(), ' ', '_');
    return result;
}

std::vector<std::string> splitString(const std::string& str, char delimiter) {
    std::vector<std::string> tokens;
    std::stringstream ss(str);
    std::string token;
    
    while (std::getline(ss, token, delimiter)) {
        if (!token.empty()) {
            tokens.push_back(token);
        }
    }
    
    return tokens;
}

std::string joinStrings(const std::vector<std::string>& strings, const std::string& delimiter) {
    if (strings.empty()) return "";
    
    std::stringstream ss;
    for (size_t i = 0; i < strings.size(); i++) {
        ss << strings[i];
        if (i < strings.size() - 1) {
            ss << delimiter;
        }
    }
    
    return ss.str();
}

bool stringContains(const std::string& str, const std::string& substr) {
    return str.find(substr) != std::string::npos;
}

std::string toLower(const std::string& str) {
    std::string result = str;
    std::transform(result.begin(), result.end(), result.begin(), ::tolower);
    return result;
}

int main() {
    std::cout << "Testing utility functions..." << std::endl;
    
    std::cout << "Format 125 minutes: " << formatDuration(125) << std::endl;
    std::cout << "Generate ID: " << generateId() << std::endl;
    std::cout << "Current time: " << getCurrentTimestamp() << std::endl;
    std::cout << "Sanitize filename: " << sanitizeFilename("test file.txt") << std::endl;
    
    std::vector<std::string> parts = splitString("one,two,three", ',');
    std::cout << "Joined: " << joinStrings(parts, " + ") << std::endl;
    
    return 0;
}
