/**
 * Task management for Produco - Rust implementation
 * Type-safe task management
 */

use std::collections::HashMap;
use chrono::Utc;

#[derive(Debug, Clone)]
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

pub struct TaskManager {
    tasks: HashMap<u32, Task>,
    next_id: u32,
}

impl TaskManager {
    pub fn new() -> Self {
        TaskManager {
            tasks: HashMap::new(),
            next_id: 1,
        }
    }
    
    pub fn add_task(&mut self, title: String, description: String, priority: String, due_date: Option<String>) -> Task {
        let task = Task {
            id: self.next_id,
            title,
            description,
            priority,
            completed: false,
            created_at: Utc::now().to_rfc3339(),
            due_date,
            completed_at: None,
        };
        
        self.tasks.insert(self.next_id, task.clone());
        self.next_id += 1;
        
        task
    }
    
    pub fn complete_task(&mut self, task_id: u32) -> Option<&Task> {
        if let Some(task) = self.tasks.get_mut(&task_id) {
            if !task.completed {
                task.completed = true;
                task.completed_at = Some(Utc::now().to_rfc3339());
            }
            return Some(task);
        }
        None
    }
    
    pub fn delete_task(&mut self, task_id: u32) -> bool {
        self.tasks.remove(&task_id).is_some()
    }
    
    pub fn get_task(&self, task_id: u32) -> Option<&Task> {
        self.tasks.get(&task_id)
    }
    
    pub fn get_all_tasks(&self) -> Vec<&Task> {
        self.tasks.values().collect()
    }
    
    pub fn get_pending_tasks(&self) -> Vec<&Task> {
        self.tasks.values()
            .filter(|t| !t.completed)
            .collect()
    }
    
    pub fn get_completed_tasks(&self) -> Vec<&Task> {
        self.tasks.values()
            .filter(|t| t.completed)
            .collect()
    }
    
    pub fn get_tasks_by_priority(&self, priority: &str) -> Vec<&Task> {
        self.tasks.values()
            .filter(|t| t.priority == priority)
            .collect()
    }
    
    pub fn task_count(&self) -> usize {
        self.tasks.len()
    }
    
    pub fn completed_count(&self) -> usize {
        self.tasks.values()
            .filter(|t| t.completed)
            .count()
    }
}

impl Default for TaskManager {
    fn default() -> Self {
        Self::new()
    }
}
