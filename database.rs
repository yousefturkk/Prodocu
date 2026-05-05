/**
 * Database layer for Produco - Rust implementation
 * Simple SQLite-like database functionality
 */

use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{Read, Write};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub priority: String,
    pub completed: bool,
    pub created_at: String,
    pub due_date: Option<String>,
    pub completed_at: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FocusSession {
    pub id: u32,
    pub task_id: u32,
    pub duration_minutes: u32,
    pub started_at: String,
    pub ended_at: String,
}

pub struct Database {
    data_dir: String,
    tasks: HashMap<u32, Task>,
    sessions: Vec<FocusSession>,
}

impl Database {
    pub fn new(data_dir: &str) -> Self {
        fs::create_dir_all(data_dir).unwrap_or_else(|_| ());
        
        Database {
            data_dir: data_dir.to_string(),
            tasks: HashMap::new(),
            sessions: Vec::new(),
        }
    }
    
    pub fn load(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        // Load tasks
        let tasks_path = format!("{}/tasks.json", self.data_dir);
        if let Ok(mut file) = File::open(&tasks_path) {
            let mut contents = String::new();
            file.read_to_string(&mut contents)?;
            let loaded_tasks: Vec<Task> = serde_json::from_str(&contents)?;
            for task in loaded_tasks {
                self.tasks.insert(task.id, task);
            }
        }
        
        // Load sessions
        let sessions_path = format!("{}/sessions.json", self.data_dir);
        if let Ok(mut file) = File::open(&sessions_path) {
            let mut contents = String::new();
            file.read_to_string(&mut contents)?;
            self.sessions = serde_json::from_str(&contents)?;
        }
        
        Ok(())
    }
    
    pub fn save(&self) -> Result<(), Box<dyn std::error::Error>> {
        // Save tasks
        let tasks_path = format!("{}/tasks.json", self.data_dir);
        let tasks_vec: Vec<&Task> = self.tasks.values().collect();
        let tasks_json = serde_json::to_string_pretty(&tasks_vec)?;
        let mut file = File::create(tasks_path)?;
        file.write_all(tasks_json.as_bytes())?;
        
        // Save sessions
        let sessions_path = format!("{}/sessions.json", self.data_dir);
        let sessions_json = serde_json::to_string_pretty(&self.sessions)?;
        let mut file = File::create(sessions_path)?;
        file.write_all(sessions_json.as_bytes())?;
        
        Ok(())
    }
    
    pub fn add_task(&mut self, task: Task) {
        self.tasks.insert(task.id, task);
    }
    
    pub fn get_task(&self, id: u32) -> Option<&Task> {
        self.tasks.get(&id)
    }
    
    pub fn get_all_tasks(&self) -> Vec<&Task> {
        self.tasks.values().collect()
    }
    
    pub fn add_session(&mut self, session: FocusSession) {
        self.sessions.push(session);
    }
    
    pub fn get_all_sessions(&self) -> &Vec<FocusSession> {
        &self.sessions
    }
}
