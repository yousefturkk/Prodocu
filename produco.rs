/**
 * Main Produco application - Rust implementation
 * Memory-safe productivity tracker
 */

mod database;
mod task;

use database::Database;
use task::{Task, TaskManager};
use chrono::Utc;

#[derive(Debug, Clone)]
pub struct FocusSession {
    pub id: u32,
    pub task_id: u32,
    pub duration_minutes: u32,
    pub started_at: String,
    pub ended_at: String,
}

pub struct Produco {
    db: Database,
    task_manager: TaskManager,
    sessions: Vec<FocusSession>,
}

impl Produco {
    pub fn new(data_dir: &str) -> Self {
        let db = Database::new(data_dir);
        let task_manager = TaskManager::new();
        
        Produco {
            db,
            task_manager,
            sessions: Vec::new(),
        }
    }
    
    pub fn load(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        self.db.load()?;
        Ok(())
    }
    
    pub fn save(&self) -> Result<(), Box<dyn std::error::Error>> {
        self.db.save()?;
        Ok(())
    }
    
    pub fn add_task(&mut self, title: String, description: String, priority: String, due_date: Option<String>) -> Task {
        let task = self.task_manager.add_task(title, description, priority, due_date);
        self.db.add_task(task.clone());
        task
    }
    
    pub fn complete_task(&mut self, task_id: u32) -> Option<&Task> {
        if let Some(task) = self.task_manager.complete_task(task_id) {
            self.log_session(task_id);
            Some(task)
        } else {
            None
        }
    }
    
    pub fn delete_task(&mut self, task_id: u32) -> bool {
        self.task_manager.delete_task(task_id)
    }
    
    pub fn get_all_tasks(&self) -> Vec<&Task> {
        self.task_manager.get_all_tasks()
    }
    
    pub fn start_focus(&mut self, task_id: u32) -> bool {
        if let Some(_task) = self.task_manager.get_task(task_id) {
            println!("Focus session started for task {}", task_id);
            true
        } else {
            false
        }
    }
    
    pub fn stop_focus(&mut self) -> Option<FocusSession> {
        let session = FocusSession {
            id: self.sessions.len() as u32 + 1,
            task_id: 0,
            duration_minutes: 25,
            started_at: Utc::now().to_rfc3339(),
            ended_at: Utc::now().to_rfc3339(),
        };
        self.sessions.push(session.clone());
        Some(session)
    }
    
    fn log_session(&mut self, task_id: u32) {
        let session = FocusSession {
            id: self.sessions.len() as u32 + 1,
            task_id,
            duration_minutes: 25,
            started_at: Utc::now().to_rfc3339(),
            ended_at: Utc::now().to_rfc3339(),
        };
        self.sessions.push(session);
    }
    
    pub fn get_stats(&self) -> ProducoStats {
        let tasks = self.get_all_tasks();
        let completed = self.task_manager.completed_count();
        let total_focus: u32 = self.sessions.iter().map(|s| s.duration_minutes).sum();
        
        ProducoStats {
            total_tasks: tasks.len(),
            completed_tasks: completed,
            total_focus_minutes: total_focus,
            session_count: self.sessions.len(),
        }
    }
}

#[derive(Debug)]
pub struct ProducoStats {
    pub total_tasks: usize,
    pub completed_tasks: usize,
    pub total_focus_minutes: u32,
    pub session_count: usize,
}

fn main() {
    println!("Produco Rust version initialized");
    
    let mut produco = Produco::new(".produco");
    
    produco.add_task("Build Rust version".to_string(), "".to_string(), "high".to_string(), None);
    produco.add_task("Add tests".to_string(), "".to_string(), "medium".to_string(), None);
    
    let stats = produco.get_stats();
    println!("Stats: {:?}", stats);
}
