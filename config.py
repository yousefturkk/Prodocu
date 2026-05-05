#!/usr/bin/env python3
"""
Configuration management for Produco
Simple configuration without complex frameworks
"""

import os
import json
from pathlib import Path
from typing import Dict, Any, Optional


class Config:
    """Configuration management for Produco."""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config_file = config_file or self._get_default_config_path()
        self.config = self._load_config()
    
    def _get_default_config_path(self) -> str:
        """Get default configuration file path."""
        home_dir = Path.home()
        config_dir = home_dir / ".produco"
        config_dir.mkdir(exist_ok=True)
        return str(config_dir / "config.json")
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from file."""
        default_config = {
            "data_dir": str(Path.home() / ".produco" / "data"),
            "work_duration": 25,
            "break_duration": 5,
            "auto_save": True,
            "theme": "dark",
            "notifications": False,
            "language": "en"
        }
        
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r') as f:
                    user_config = json.load(f)
                    default_config.update(user_config)
            except (json.JSONDecodeError, IOError):
                pass
        
        return default_config
    
    def save(self) -> bool:
        """Save configuration to file."""
        try:
            os.makedirs(os.path.dirname(self.config_file), exist_ok=True)
            with open(self.config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
            return True
        except Exception:
            return False
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value."""
        return self.config.get(key, default)
    
    def set(self, key: str, value: Any) -> bool:
        """Set configuration value."""
        self.config[key] = value
        return self.save()
    
    @property
    def data_dir(self) -> str:
        """Get data directory path."""
        return self.get("data_dir")
    
    @property
    def work_duration(self) -> int:
        """Get work duration in minutes."""
        return self.get("work_duration", 25)
    
    @property
    def break_duration(self) -> int:
        """Get break duration in minutes."""
        return self.get("break_duration", 5)
