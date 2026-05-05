#!/usr/bin/env python3
"""
Backup system for Produco data
Simple JSON-based backup and restore functionality
"""

import json
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional, List


class BackupManager:
    """Manage data backups for Produco."""
    
    def __init__(self, data_dir: str, backup_dir: str = "backups"):
        self.data_dir = Path(data_dir)
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(exist_ok=True)
    
    def create_backup(self) -> Optional[str]:
        """Create a backup of all data files."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"produco_backup_{timestamp}"
        backup_path = self.backup_dir / backup_name
        backup_path.mkdir(exist_ok=True)
        
        try:
            # Copy all JSON files from data directory
            for file in self.data_dir.glob("*.json"):
                shutil.copy2(file, backup_path / file.name)
            
            # Create backup manifest
            manifest = {
                "created_at": datetime.now().isoformat(),
                "files": [f.name for f in backup_path.glob("*.json")],
                "backup_name": backup_name
            }
            
            with open(backup_path / "manifest.json", 'w') as f:
                json.dump(manifest, f, indent=2)
            
            return str(backup_path)
        
        except Exception as e:
            print(f"Backup failed: {e}")
            return None
    
    def restore_backup(self, backup_path: str) -> bool:
        """Restore data from a backup."""
        backup_path = Path(backup_path)
        
        if not backup_path.exists():
            return False
        
        try:
            # Check for manifest
            manifest_file = backup_path / "manifest.json"
            if not manifest_file.exists():
                return False
            
            with open(manifest_file, 'r') as f:
                manifest = json.load(f)
            
            # Copy files back to data directory
            for file_name in manifest["files"]:
                src = backup_path / file_name
                dst = self.data_dir / file_name
                shutil.copy2(src, dst)
            
            return True
        
        except Exception as e:
            print(f"Restore failed: {e}")
            return False
    
    def list_backups(self) -> List[Dict]:
        """List all available backups."""
        backups = []
        
        for backup_path in self.backup_dir.glob("produco_backup_*"):
            manifest_file = backup_path / "manifest.json"
            if manifest_file.exists():
                try:
                    with open(manifest_file, 'r') as f:
                        manifest = json.load(f)
                    backups.append(manifest)
                except:
                    continue
        
        return sorted(backups, key=lambda x: x["created_at"], reverse=True)
    
    def cleanup_old_backups(self, keep_count: int = 5) -> int:
        """Remove old backups, keeping only the most recent ones."""
        backups = self.list_backups()
        
        if len(backups) <= keep_count:
            return 0
        
        removed = 0
        for backup in backups[keep_count:]:
            backup_path = self.backup_dir / backup["backup_name"]
            try:
                shutil.rmtree(backup_path)
                removed += 1
            except:
                continue
        
        return removed
