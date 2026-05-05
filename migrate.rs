/**
 * Data migration for Produco - Rust implementation
 * Handle data migrations and schema changes
 */

use std::fs;
use serde::{Deserialize, Serialize};
use serde_json;

#[derive(Serialize, Deserialize, Debug)]
struct TaskV1 {
    id: u32,
    title: String,
    completed: bool,
}

#[derive(Serialize, Deserialize, Debug)]
struct TaskV2 {
    id: u32,
    title: String,
    description: String,
    priority: String,
    completed: bool,
    created_at: String,
}

pub struct Migrator {
    data_dir: String,
}

impl Migrator {
    pub fn new(data_dir: &str) -> Self {
        Migrator {
            data_dir: data_dir.to_string(),
        }
    }
    
    pub fn migrate_v1_to_v2(&self) -> Result<(), Box<dyn std::error::Error>> {
        let tasks_path = format!("{}/tasks.json", self.data_dir);
        
        if !fs::metadata(&tasks_path).is_ok() {
            println!("No tasks file found, skipping migration");
            return Ok(());
        }
        
        let contents = fs::read_to_string(&tasks_path)?;
        let tasks_v1: Vec<TaskV1> = serde_json::from_str(&contents)?;
        
        let tasks_v2: Vec<TaskV2> = tasks_v1
            .into_iter()
            .map(|t| TaskV2 {
                id: t.id,
                title: t.title,
                description: String::new(),
                priority: String::from("medium"),
                completed: t.completed,
                created_at: chrono::Utc::now().to_rfc3339(),
            })
            .collect();
        
        let new_contents = serde_json::to_string_pretty(&tasks_v2)?;
        fs::write(&tasks_path, new_contents)?;
        
        println!("Migrated {} tasks from v1 to v2", tasks_v2.len());
        Ok(())
    }
    
    pub fn backup_current_data(&self) -> Result<(), Box<dyn std::error::Error>> {
        let backup_dir = format!("{}/backup", self.data_dir);
        fs::create_dir_all(&backup_dir)?;
        
        let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
        
        // Backup tasks
        let tasks_path = format!("{}/tasks.json", self.data_dir);
        if fs::metadata(&tasks_path).is_ok() {
            let backup_path = format!("{}/tasks_{}.json", backup_dir, timestamp);
            fs::copy(&tasks_path, &backup_path)?;
        }
        
        // Backup sessions
        let sessions_path = format!("{}/sessions.json", self.data_dir);
        if fs::metadata(&sessions_path).is_ok() {
            let backup_path = format!("{}/sessions_{}.json", backup_dir, timestamp);
            fs::copy(&sessions_path, &backup_path)?;
        }
        
        println!("Backup created at {}", timestamp);
        Ok(())
    }
    
    pub fn check_migration_needed(&self) -> bool {
        // Check if migration is needed based on data version
        let version_path = format!("{}/version.txt", self.data_dir);
        
        if !fs::metadata(&version_path).is_ok() {
            return true;
        }
        
        false
    }
}

fn main() {
    println!("Data migration utility for Produco");
    
    let migrator = Migrator::new(".produco");
    
    if migrator.check_migration_needed() {
        println!("Migration needed");
    } else {
        println!("No migration needed");
    }
}
