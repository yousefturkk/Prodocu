#!/usr/bin/env python3
"""
Task management for Produco
Simple, focused task management without complex features
"""

import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict


@dataclass
class Task:
    """Task data structure."""
    id: int
    title: str
    description: str = ""
    priority: str = "medium"  # low, medium, high
    completed: bool = False
    created_at: str = None
    due_date: Optional[str] = None
    completed_at: Optional[str] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()


class TaskManager:
    """Manage tasks for productivity tracking."""
    
    def __init__(self, storage):
        self.storage = storage
        self.tasks: List[Task] = []
        self._load_tasks()
    
    def _load_tasks(self):
        """Load tasks from storage."""
        data = self.storage.load("tasks")
        if data:
            self.tasks = [Task(**task_data) for task_data in data]
    
    def _save_tasks(self):
        """Save tasks to storage."""
        data = [asdict(task) for task in self.tasks]
        self.storage.save("tasks", data)
    
    def add_task(self, title: str, description: str = "", priority: str = "medium", due_date: Optional[str] = None) -> Task:
        """Add a new task."""
        task_id = len(self.tasks) + 1
        task = Task(
            id=task_id,
            title=title,
            description=description,
            priority=priority,
            due_date=due_date
        )
        self.tasks.append(task)
        self._save_tasks()
        return task
    
    def complete_task(self, task_id: int) -> Optional[Task]:
        """Mark a task as completed."""
        for task in self.tasks:
            if task.id == task_id and not task.completed:
                task.completed = True
                task.completed_at = datetime.now().isoformat()
                self._save_tasks()
                return task
        return None
    
    def delete_task(self, task_id: int) -> bool:
        """Delete a task."""
        for i, task in enumerate(self.tasks):
            if task.id == task_id:
                self.tasks.pop(i)
                self._save_tasks()
                return True
        return False
    
    def get_task(self, task_id: int) -> Optional[Task]:
        """Get a specific task."""
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None
    
    def get_all_tasks(self) -> List[Task]:
        """Get all tasks."""
        return self.tasks
    
    def get_pending_tasks(self) -> List[Task]:
        """Get all pending (uncompleted) tasks."""
        return [task for task in self.tasks if not task.completed]
    
    def get_completed_tasks(self) -> List[Task]:
        """Get all completed tasks."""
        return [task for task in self.tasks if task.completed]
    
    def get_tasks_by_priority(self, priority: str) -> List[Task]:
        """Get tasks by priority."""
        return [task for task in self.tasks if task.priority == priority]
