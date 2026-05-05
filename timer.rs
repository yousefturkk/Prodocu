/**
 * Focus timer for Produco - Rust implementation
 * Thread-safe timer for focus sessions
 */

use std::sync::{Arc, Mutex};
use std::time::Duration;
use std::thread;
use std::sync::atomic::{AtomicBool, Ordering};

pub struct FocusTimer {
    is_running: Arc<AtomicBool>,
    is_paused: Arc<AtomicBool>,
    work_duration: u32,
    time_remaining: Arc<Mutex<u32>>,
}

impl FocusTimer {
    pub fn new(work_minutes: u32, _break_minutes: u32) -> Self {
        FocusTimer {
            is_running: Arc::new(AtomicBool::new(false)),
            is_paused: Arc::new(AtomicBool::new(false)),
            work_duration: work_minutes * 60,
            time_remaining: Arc::new(Mutex::new(work_minutes * 60)),
        }
    }
    
    pub fn start(&self, _task: Option<String>) -> bool {
        if self.is_running.load(Ordering::SeqCst) {
            return false;
        }
        
        self.is_running.store(true, Ordering::SeqCst);
        self.is_paused.store(false, Ordering::SeqCst);
        
        let is_running = self.is_running.clone();
        let is_paused = self.is_paused.clone();
        let time_remaining = self.time_remaining.clone();
        let duration = self.work_duration;
        
        // Reset time remaining
        *time_remaining.lock().unwrap() = duration;
        
        thread::spawn(move || {
            while is_running.load(Ordering::SeqCst) {
                if !is_paused.load(Ordering::SeqCst) {
                    let mut remaining = time_remaining.lock().unwrap();
                    if *remaining > 0 {
                        *remaining -= 1;
                        drop(remaining);
                        thread::sleep(Duration::from_secs(1));
                    } else {
                        break;
                    }
                } else {
                    thread::sleep(Duration::from_millis(100));
                }
            }
            
            is_running.store(false, Ordering::SeqCst);
        });
        
        true
    }
    
    pub fn pause(&self) -> bool {
        if !self.is_running.load(Ordering::SeqCst) || self.is_paused.load(Ordering::SeqCst) {
            return false;
        }
        
        self.is_paused.store(true, Ordering::SeqCst);
        true
    }
    
    pub fn resume(&self) -> bool {
        if !self.is_running.load(Ordering::SeqCst) || !self.is_paused.load(Ordering::SeqCst) {
            return false;
        }
        
        self.is_paused.store(false, Ordering::SeqCst);
        true
    }
    
    pub fn stop(&self) -> bool {
        if !self.is_running.load(Ordering::SeqCst) {
            return false;
        }
        
        self.is_running.store(false, Ordering::SeqCst);
        self.is_paused.store(false, Ordering::SeqCst);
        true
    }
    
    pub fn get_time_remaining(&self) -> u32 {
        *self.time_remaining.lock().unwrap()
    }
    
    pub fn get_formatted_time(&self) -> String {
        let remaining = self.get_time_remaining();
        let minutes = remaining / 60;
        let seconds = remaining % 60;
        format!("{:02}:{:02}", minutes, seconds)
    }
    
    pub fn is_running(&self) -> bool {
        self.is_running.load(Ordering::SeqCst)
    }
}

impl Default for FocusTimer {
    fn default() -> Self {
        Self::new(25, 5)
    }
}

fn main() {
    let timer = FocusTimer::new(25, 5);
    
    timer.start(Some("Test task".to_string()));
    
    for _ in 0..5 {
        thread::sleep(Duration::from_secs(1));
        println!("Time remaining: {}", timer.get_formatted_time());
    }
    
    timer.stop();
    println!("Timer stopped");
}
