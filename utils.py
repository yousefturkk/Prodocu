#!/usr/bin/env python3
"""
Utility functions for Produco
Helper functions for common operations
"""

import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional
from pathlib import Path


def load_json(file_path: str) -> Optional[Dict]:
    """Load JSON data from file."""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def save_json(file_path: str, data: Dict) -> bool:
    """Save JSON data to file."""
    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception:
        return False


def format_duration(minutes: int) -> str:
    """Format minutes into human-readable duration."""
    hours = minutes // 60
    mins = minutes % 60
    
    if hours > 0:
        return f"{hours}h {mins}m"
    return f"{mins}m"


def parse_duration(duration_str: str) -> int:
    """Parse duration string into minutes."""
    duration_str = duration_str.lower().strip()
    
    if 'h' in duration_str and 'm' in duration_str:
        parts = duration_str.replace('h', '').replace('m', '').split()
        hours = int(parts[0])
        mins = int(parts[1])
        return hours * 60 + mins
    elif 'h' in duration_str:
        hours = int(duration_str.replace('h', ''))
        return hours * 60
    elif 'm' in duration_str:
        mins = int(duration_str.replace('m', ''))
        return mins
    else:
        return int(duration_str)


def get_timestamp() -> str:
    """Get current timestamp in ISO format."""
    return datetime.now().isoformat()


def ensure_directory(path: str) -> bool:
    """Ensure directory exists, create if it doesn't."""
    try:
        Path(path).mkdir(parents=True, exist_ok=True)
        return True
    except Exception:
        return False


def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe file system usage."""
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename


def generate_id() -> str:
    """Generate unique ID."""
    import uuid
    return str(uuid.uuid4())[:8]
