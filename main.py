#!/usr/bin/env python3
"""
Produco - Main entry point for the productivity tracker
Simple, focused, no AI. Just productivity tracking.
"""

import sys
import os
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).parent
sys.path.insert(0, str(PROJECT_ROOT))

from produco.task_manager import TaskManager
from produco.timer import FocusTimer
from produco.storage import LocalStorage
from produco.config import Config


def main():
    """Main application entry point."""
    config = Config()
    storage = LocalStorage(config.data_dir)
    
    task_manager = TaskManager(storage)
    timer = FocusTimer(storage)
    
    print("Produco - Productivity Tracker")
    print("=============================")
    print(f"Data directory: {config.data_dir}")
    print(f"Tasks: {len(task_manager.get_all_tasks())}")
    print(f"Focus sessions: {len(timer.get_sessions())}")
    
    # Start the application
    try:
        # For now, just initialize and show status
        # In a full implementation, this would start the web server or CLI
        print("\nProduco initialized successfully.")
        print("Run the web interface by opening index.html in your browser.")
        
    except KeyboardInterrupt:
        print("\nShutting down Produco...")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
