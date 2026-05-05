#!/usr/bin/env python3
"""
Storage layer for Produco
Simple localStorage-like functionality using JSON files
"""

import json
import os
from pathlib import Path
from typing import Any, Dict, Optional


class LocalStorage:
    """Simple file-based storage for Produco data."""
    
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_file_path(self, key: str) -> Path:
        """Get file path for a storage key."""
        return self.data_dir / f"{key}.json"
    
    def save(self, key: str, data: Any) -> bool:
        """Save data to storage."""
        try:
            file_path = self._get_file_path(key)
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
            return True
        except Exception:
            return False
    
    def load(self, key: str) -> Optional[Any]:
        """Load data from storage."""
        try:
            file_path = self._get_file_path(key)
            if file_path.exists():
                with open(file_path, 'r') as f:
                    return json.load(f)
            return None
        except Exception:
            return None
    
    def delete(self, key: str) -> bool:
        """Delete data from storage."""
        try:
            file_path = self._get_file_path(key)
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False
    
    def exists(self, key: str) -> bool:
        """Check if data exists in storage."""
        return self._get_file_path(key).exists()
    
    def clear(self) -> bool:
        """Clear all data from storage."""
        try:
            for file in self.data_dir.glob("*.json"):
                file.unlink()
            return True
        except Exception:
            return False
    
    def get_all_keys(self) -> list:
        """Get all storage keys."""
        return [f.stem for f in self.data_dir.glob("*.json")]
