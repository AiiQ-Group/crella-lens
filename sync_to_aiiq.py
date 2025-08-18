#!/usr/bin/env python3
"""
🔗 Crella-Lens → AiiQ-tAIq Sync Bridge
Automatically sync generated strategies to your trading platform
"""

import shutil
import os
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AiiQSyncBridge:
    def __init__(self, aiiq_path=None):
        self.crella_exports = Path("aiiq_exports")
        
        # Auto-detect or set AiiQ path
        possible_paths = [
            Path("../AiiQ-tAIq"),
            Path("../../AiiQ-tAIq"), 
            Path("D:/Gringots001/AiiQ_vault001/AiiQ-tAIq"),
            Path(aiiq_path) if aiiq_path else None
        ]
        
        self.aiiq_path = None
        for path in possible_paths:
            if path and path.exists():
                self.aiiq_path = path / "strategy_imports"
                break
                
        if not self.aiiq_path:
            logger.warning("⚠️ AiiQ-tAIq path not found. Manual copy required.")
            
    def sync_strategies(self):
        """Sync Frankenstein strategies to AiiQ platform"""
        if not self.crella_exports.exists():
            logger.error("❌ No export files found. Run frankenstein_integration.py first")
            return False
            
        if not self.aiiq_path:
            logger.warning("⚠️ AiiQ path not configured")
            self.show_manual_instructions()
            return False
            
        # Create imports directory if needed
        self.aiiq_path.mkdir(parents=True, exist_ok=True)
        
        # Sync all export files
        synced_files = []
        for export_file in self.crella_exports.glob("*"):
            if export_file.is_file():
                dest = self.aiiq_path / export_file.name
                shutil.copy2(export_file, dest)
                synced_files.append(export_file.name)
                logger.info(f"✅ Synced: {export_file.name}")
        
        logger.info(f"🚀 Successfully synced {len(synced_files)} files to AiiQ-tAIq")
        return True
    
    def show_manual_instructions(self):
        """Show manual copy instructions"""
        print("\n📋 MANUAL SYNC INSTRUCTIONS:")
        print("=" * 40)
        print("1. Copy these files to your AiiQ-tAIq platform:")
        
        for file in self.crella_exports.glob("*"):
            print(f"   📁 {file.name}")
            
        print("\n2. Suggested AiiQ-tAIq location:")
        print("   📂 AiiQ-tAIq/strategy_imports/")
        print("\n3. Then import via your AiiQ platform interface")

def main():
    """Sync strategies to AiiQ-tAIq"""
    bridge = AiiQSyncBridge()
    
    print("🔗 Crella-Lens → AiiQ-tAIq Sync Bridge")
    print("=" * 40)
    
    success = bridge.sync_strategies()
    
    if success:
        print("✅ Sync complete! Check your AiiQ-tAIq imports folder")
    else:
        print("⚠️ Manual sync required")

if __name__ == "__main__":
    main()
