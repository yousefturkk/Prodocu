#!/usr/bin/env python3
"""
Statistics and analytics for Produco
Simple, focused stats without complex data processing
"""

from datetime import datetime, timedelta
from typing import List, Dict, Optional
from collections import defaultdict


class StatisticsTracker:
    """Track and calculate productivity statistics."""
    
    def __init__(self):
        self.daily_stats: Dict[str, Dict] = defaultdict(dict)
        self.weekly_stats: Dict[str, Dict] = defaultdict(dict)
        self.monthly_stats: Dict[str, Dict] = defaultdict(dict)
    
    def log_task_completion(self, task_id: int, duration_minutes: int):
        """Log a task completion for stats."""
        date = datetime.now().strftime("%Y-%m-%d")
        week = datetime.now().strftime("%Y-W%W")
        month = datetime.now().strftime("%Y-%m")
        
        self.daily_stats[date]["tasks_completed"] = self.daily_stats[date].get("tasks_completed", 0) + 1
        self.daily_stats[date]["total_minutes"] = self.daily_stats[date].get("total_minutes", 0) + duration_minutes
        
        self.weekly_stats[week]["tasks_completed"] = self.weekly_stats[week].get("tasks_completed", 0) + 1
        self.weekly_stats[week]["total_minutes"] = self.weekly_stats[week].get("total_minutes", 0) + duration_minutes
        
        self.monthly_stats[month]["tasks_completed"] = self.monthly_stats[month].get("tasks_completed", 0) + 1
        self.monthly_stats[month]["total_minutes"] = self.monthly_stats[month].get("total_minutes", 0) + duration_minutes
    
    def get_daily_summary(self, date: Optional[str] = None) -> Dict:
        """Get daily statistics summary."""
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
        
        return self.daily_stats.get(date, {"tasks_completed": 0, "total_minutes": 0})
    
    def get_weekly_summary(self, week: Optional[str] = None) -> Dict:
        """Get weekly statistics summary."""
        if not week:
            week = datetime.now().strftime("%Y-W%W")
        
        return self.weekly_stats.get(week, {"tasks_completed": 0, "total_minutes": 0})
    
    def get_monthly_summary(self, month: Optional[str] = None) -> Dict:
        """Get monthly statistics summary."""
        if not month:
            month = datetime.now().strftime("%Y-%m")
        
        return self.monthly_stats.get(month, {"tasks_completed": 0, "total_minutes": 0})
    
    def get_productivity_trend(self, days: int = 7) -> List[Dict]:
        """Get productivity trend over specified days."""
        trend = []
        for i in range(days):
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            stats = self.get_daily_summary(date)
            trend.append({
                "date": date,
                "tasks_completed": stats["tasks_completed"],
                "total_minutes": stats["total_minutes"]
            })
        
        return list(reversed(trend))
    
    def calculate_average_daily_focus(self) -> float:
        """Calculate average daily focus time in minutes."""
        if not self.daily_stats:
            return 0.0
        
        total_minutes = sum(stats.get("total_minutes", 0) for stats in self.daily_stats.values())
        return total_minutes / len(self.daily_stats)
