#!/usr/bin/env python3
"""
Core mechanics for Produco productivity tracking
Task completion logic, streak calculation, achievement system
"""

from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dataclasses import dataclass


@dataclass
class Task:
    """Task data structure."""
    id: int
    title: str
    priority: str
    completed: bool
    created_at: datetime
    completed_at: Optional[datetime] = None


@dataclass
class FocusSession:
    """Focus session data structure."""
    id: int
    task_id: int
    duration_minutes: int
    started_at: datetime
    ended_at: datetime


class ProductivityMechanics:
    """Core productivity tracking mechanics."""
    
    def __init__(self):
        self.tasks: List[Task] = []
        self.sessions: List[FocusSession] = []
        self.streak: int = 0
        self.last_activity_date: Optional[datetime] = None
    
    def calculate_streak(self) -> int:
        """Calculate current streak based on daily activity."""
        if not self.sessions:
            return 0
        
        today = datetime.now().date()
        sorted_sessions = sorted(self.sessions, key=lambda x: x.ended_at.date(), reverse=True)
        
        streak = 0
        current_date = today
        
        for session in sorted_sessions:
            session_date = session.ended_at.date()
            
            if session_date == current_date or session_date == current_date - timedelta(days=1):
                streak += 1
                current_date = session_date
            else:
                break
        
        return streak
    
    def get_completion_rate(self) -> float:
        """Calculate task completion rate."""
        if not self.tasks:
            return 0.0
        
        completed = sum(1 for task in self.tasks if task.completed)
        return (completed / len(self.tasks)) * 100
    
    def get_focus_efficiency(self) -> float:
        """Calculate focus session efficiency."""
        if not self.sessions:
            return 0.0
        
        total_duration = sum(s.duration_minutes for s in self.sessions)
        completed_during_focus = sum(1 for s in self.sessions if self._task_completed_during_session(s))
        
        if total_duration == 0:
            return 0.0
        
        return (completed_during_focus / len(self.sessions)) * 100
    
    def _task_completed_during_session(self, session: FocusSession) -> bool:
        """Check if a task was completed during a focus session."""
        for task in self.tasks:
            if task.completed and task.completed_at:
                if session.started_at <= task.completed_at <= session.ended_at:
                    return True
        return False
    
    def get_productivity_score(self) -> float:
        """Calculate overall productivity score."""
        completion_rate = self.get_completion_rate()
        focus_efficiency = self.get_focus_efficiency()
        streak_bonus = min(self.streak * 2, 20)  # Max 20% bonus for streak
        
        base_score = (completion_rate * 0.4) + (focus_efficiency * 0.4) + streak_bonus
        return min(base_score, 100.0)  # Cap at 100%
