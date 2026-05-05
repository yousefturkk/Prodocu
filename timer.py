#!/usr/bin/env python3
"""
Focus timer for deep work sessions
Pomodoro-style timer with session tracking
"""

import time
from datetime import datetime, timedelta
from typing import Optional, Callable


class FocusTimer:
    """Focus timer for productivity sessions."""
    
    def __init__(self):
        self.is_running: bool = False
        self.is_paused: bool = False
        self.start_time: Optional[datetime] = None
        self.pause_time: Optional[datetime] = None
        self.paused_duration: timedelta = timedelta()
        self.work_duration: int = 25  # 25 minutes
        self.break_duration: int = 5  # 5 minutes
        self.current_task: Optional[str] = None
        self.on_complete: Optional[Callable] = None
    
    def start(self, task: Optional[str] = None) -> bool:
        """Start the focus timer."""
        if self.is_running:
            return False
        
        self.is_running = True
        self.is_paused = False
        self.start_time = datetime.now()
        self.current_task = task
        self.paused_duration = timedelta()
        return True
    
    def pause(self) -> bool:
        """Pause the timer."""
        if not self.is_running or self.is_paused:
            return False
        
        self.is_paused = True
        self.pause_time = datetime.now()
        return True
    
    def resume(self) -> bool:
        """Resume the timer."""
        if not self.is_running or not self.is_paused:
            return False
        
        self.is_paused = False
        if self.pause_time:
            self.paused_duration += datetime.now() - self.pause_time
            self.pause_time = None
        return True
    
    def stop(self) -> Optional[Dict]:
        """Stop the timer and return session data."""
        if not self.is_running:
            return None
        
        end_time = datetime.now()
        if self.is_paused and self.pause_time:
            self.paused_duration += end_time - self.pause_time
        
        actual_duration = end_time - self.start_time - self.paused_duration
        duration_minutes = int(actual_duration.total_seconds() / 60)
        
        session = {
            "task": self.current_task,
            "duration_minutes": duration_minutes,
            "started_at": self.start_time.isoformat(),
            "ended_at": end_time.isoformat(),
            "paused_duration_minutes": int(self.paused_duration.total_seconds() / 60)
        }
        
        self.is_running = False
        self.is_paused = False
        self.start_time = None
        self.pause_time = None
        self.paused_duration = timedelta()
        
        if self.on_complete:
            self.on_complete(session)
        
        return session
    
    def get_elapsed_time(self) -> int:
        """Get elapsed time in minutes."""
        if not self.is_running:
            return 0
        
        current_time = datetime.now()
        if self.is_paused:
            current_time = self.pause_time if self.pause_time else current_time
        
        elapsed = current_time - self.start_time - self.paused_duration
        return int(elapsed.total_seconds() / 60)
    
    def get_remaining_time(self) -> int:
        """Get remaining time in minutes."""
        elapsed = self.get_elapsed_time()
        return max(0, self.work_duration - elapsed)
    
    def is_complete(self) -> bool:
        """Check if the focus session is complete."""
        return self.get_remaining_time() == 0
