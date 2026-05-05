#!/usr/bin/env python3
"""
Hackathon version of Produco - Built for quick deployment and demo
Stripped down features for fast iteration during hackathons
"""

import json
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional


class HackathonProduco:
    """Simplified productivity tracker for hackathon demos."""
    
    def __init__(self):
        self.tasks: List[Dict] = []
        self.sessions: List[Dict] = []
        self.start_time: Optional[datetime] = None
        self.current_task: Optional[str] = None
    
    def add_task(self, title: str, priority: str = "medium") -> Dict:
        """Add a task quickly."""
        task = {
            "id": len(self.tasks) + 1,
            "title": title,
            "priority": priority,
            "completed": False,
            "created_at": datetime.now().isoformat()
        }
        self.tasks.append(task)
        return task
    
    def start_focus(self, task_title: str) -> bool:
        """Start a focus session."""
        self.start_time = datetime.now()
        self.current_task = task_title
        return True
    
    def end_focus(self) -> Dict:
        """End focus session and log it."""
        if not self.start_time:
            return {}
        
        duration = (datetime.now() - self.start_time).total_seconds() / 60
        session = {
            "task": self.current_task,
            "duration_minutes": duration,
            "started_at": self.start_time.isoformat(),
            "ended_at": datetime.now().isoformat()
        }
        self.sessions.append(session)
        self.start_time = None
        self.current_task = None
        return session
    
    def get_stats(self) -> Dict:
        """Get quick stats for demo."""
        total_focus = sum(s["duration_minutes"] for s in self.sessions)
        completed = sum(1 for t in self.tasks if t["completed"])
        return {
            "total_tasks": len(self.tasks),
            "completed": completed,
            "total_focus_minutes": total_focus,
            "sessions": len(self.sessions)
        }
    
    def export_json(self) -> str:
        """Export data for demo."""
        return json.dumps({
            "tasks": self.tasks,
            "sessions": self.sessions,
            "stats": self.get_stats()
        }, indent=2)


def demo():
    """Quick demo for hackathon."""
    app = HackathonProduco()
    
    # Add some demo tasks
    app.add_task("Build MVP", "high")
    app.add_task("Write README", "medium")
    app.add_task("Deploy to Vercel", "high")
    
    # Simulate focus session
    app.start_focus("Build MVP")
    time.sleep(0.1)  # Simulate work
    app.end_focus()
    
    print(app.export_json())


if __name__ == "__main__":
    demo()
