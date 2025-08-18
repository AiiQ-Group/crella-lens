#!/usr/bin/env python3
"""
🚀 AiiQ-tAIq Platform Integration for Frankenstein Strategies
Import pAIt-scored trading modules into your AiiQ trading platform for backtesting
"""

import json
import csv
import pandas as pd
from datetime import datetime
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AiiQFrankensteinImporter:
    """Import Frankenstein strategies into AiiQ-tAIq trading platform"""
    
    def __init__(self):
        self.integration_dir = Path("lens-data/aiiq_integration")
        self.aiiq_export_dir = Path("aiiq_exports")
        self.aiiq_export_dir.mkdir(exist_ok=True)
        
    def load_frankenstein_modules(self):
        """Load the generated Frankenstein strategy modules"""
        try:
            json_file = self.integration_dir / "aiiq_frankenstein_modules.json"
            csv_file = self.integration_dir / "frankenstein_modules.csv"
            
            if not json_file.exists() or not csv_file.exists():
                logger.error("❌ Frankenstein module files not found!")
                logger.info("Run 'python frankenstein_integration.py' first")
                return None
                
            # Load detailed JSON data
            with open(json_file, 'r') as f:
                json_data = json.load(f)
                
            # Load CSV summary
            csv_data = pd.read_csv(csv_file)
            
            logger.info(f"✅ Loaded {len(json_data['strategy_modules'])} strategy modules")
            return json_data, csv_data
            
        except Exception as e:
            logger.error(f"❌ Failed to load modules: {e}")
            return None
    
    def create_aiiq_backtest_config(self, modules_data):
        """Create AiiQ-tAIq compatible backtest configuration"""
        json_data, csv_data = modules_data
        
        aiiq_config = {
            "backtest_config": {
                "name": f"Frankenstein_pAIt_Strategies_{datetime.now().strftime('%Y%m%d')}",
                "description": "Automated strategies extracted from pAIt-scored YouTube analysis",
                "created_at": datetime.now().isoformat(),
                "source": "crella_lens_frankenstein_system",
                "strategies": []
            }
        }
        
        for module in json_data["strategy_modules"]:
            aiiq_strategy = {
                "strategy_id": module["module_id"],
                "name": module["name"],
                "pait_score": module["pait_score"],
                "risk_level": module["risk_level"],
                "timeframe": module["timeframe"],
                "market_conditions": module["market_conditions"],
                "backtest_settings": {
                    "initial_capital": 10000,
                    "position_size_percent": self.get_position_size(module["risk_level"]),
                    "max_positions": self.get_max_positions(module["risk_level"]),
                    "stop_loss_percent": self.get_stop_loss(module["risk_level"]),
                    "take_profit_percent": self.get_take_profit(module["pait_score"])
                },
                "trading_rules": self.extract_trading_rules(module["trading_elements"]),
                "implementation_notes": module["integration_notes"]
            }
            
            aiiq_config["backtest_config"]["strategies"].append(aiiq_strategy)
        
        return aiiq_config
    
    def get_position_size(self, risk_level):
        """Determine position size based on risk level"""
        risk_mapping = {
            "low": 5,      # 5% position size
            "medium": 3,   # 3% position size  
            "high": 2      # 2% position size
        }
        return risk_mapping.get(risk_level, 3)
    
    def get_max_positions(self, risk_level):
        """Determine max concurrent positions based on risk"""
        risk_mapping = {
            "low": 8,      # More positions for lower risk
            "medium": 5,   # Moderate positions
            "high": 3      # Fewer positions for higher risk
        }
        return risk_mapping.get(risk_level, 5)
    
    def get_stop_loss(self, risk_level):
        """Determine stop loss percentage based on risk"""
        risk_mapping = {
            "low": 2.0,    # 2% stop loss
            "medium": 1.5, # 1.5% stop loss
            "high": 1.0    # 1% stop loss
        }
        return risk_mapping.get(risk_level, 1.5)
    
    def get_take_profit(self, pait_score):
        """Determine take profit based on pAIt score"""
        if pait_score >= 90:
            return 4.0     # 4% take profit for highest scoring
        elif pait_score >= 80:
            return 3.0     # 3% take profit for high scoring
        elif pait_score >= 70:
            return 2.5     # 2.5% take profit for medium-high
        else:
            return 2.0     # 2% take profit for lower scoring
    
    def extract_trading_rules(self, trading_elements):
        """Convert trading elements into AiiQ trading rules"""
        rules = {
            "entry_conditions": [],
            "exit_conditions": [],
            "risk_management": [],
            "technical_indicators": []
        }
        
        for element in trading_elements:
            if element["type"] == "technical_indicator":
                rules["technical_indicators"].append({
                    "indicator": element["name"],
                    "description": element["description"],
                    "integration": element["integration_method"]
                })
                
                # Convert to entry conditions
                if element["name"] == "rsi":
                    rules["entry_conditions"].append("RSI < 30 (oversold) for long entry")
                    rules["exit_conditions"].append("RSI > 70 (overbought) for long exit")
                elif element["name"] == "macd":
                    rules["entry_conditions"].append("MACD line crosses above signal line")
                    rules["exit_conditions"].append("MACD line crosses below signal line")
                    
            elif element["type"] == "strategy_pattern":
                if element["name"] == "active_trading":
                    rules["entry_conditions"].append("Active market conditions with volume confirmation")
                elif element["name"] == "bot_trading":
                    rules["entry_conditions"].append("Automated signal detection with backtested parameters")
                    
            elif element["type"] == "risk_management":
                rules["risk_management"].append({
                    "rule": element["name"],
                    "description": element["description"]
                })
                
            elif element["type"] == "profit_strategy":
                rules["exit_conditions"].append("Profit target based on historical $322/hour pattern")
        
        return rules
    
    def create_aiiq_import_files(self):
        """Create all necessary files for AiiQ-tAIq import"""
        logger.info("🚀 Creating AiiQ-tAIq import files...")
        
        # Load Frankenstein modules
        modules_data = self.load_frankenstein_modules()
        if not modules_data:
            return False
            
        json_data, csv_data = modules_data
        
        # 1. Create backtest configuration
        backtest_config = self.create_aiiq_backtest_config(modules_data)
        
        config_file = self.aiiq_export_dir / "aiiq_backtest_config.json"
        with open(config_file, 'w') as f:
            json.dump(backtest_config, f, indent=2)
        
        logger.info(f"✅ Created backtest config: {config_file}")
        
        # 2. Create strategy summary for quick review
        summary_file = self.aiiq_export_dir / "strategy_summary.csv"
        
        summary_data = []
        for module in json_data["strategy_modules"]:
            summary_data.append({
                "strategy_id": module["module_id"],
                "name": module["name"][:50],
                "pait_score": module["pait_score"],
                "risk_level": module["risk_level"],
                "elements_count": len(module["trading_elements"]),
                "recommended_capital": 10000,
                "position_size_percent": self.get_position_size(module["risk_level"]),
                "expected_win_rate": self.estimate_win_rate(module["pait_score"]),
                "backtest_priority": "high" if module["pait_score"] >= 85 else "medium"
            })
        
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_csv(summary_file, index=False)
        
        logger.info(f"✅ Created strategy summary: {summary_file}")
        
        # 3. Create detailed trading rules document
        rules_file = self.aiiq_export_dir / "detailed_trading_rules.md"
        
        with open(rules_file, 'w') as f:
            f.write("# Frankenstein Trading Strategies - Detailed Rules\n\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Source: Crella Lens pAIt Analysis\n\n")
            
            for i, module in enumerate(json_data["strategy_modules"], 1):
                f.write(f"## Strategy {i}: {module['name']}\n\n")
                f.write(f"**pAIt Score:** {module['pait_score']}/100\n")
                f.write(f"**Risk Level:** {module['risk_level']}\n")
                f.write(f"**Timeframe:** {module['timeframe']}\n\n")
                
                # Extract and format trading rules
                rules = self.extract_trading_rules(module["trading_elements"])
                
                f.write("### Entry Conditions:\n")
                for condition in rules["entry_conditions"]:
                    f.write(f"- {condition}\n")
                f.write("\n")
                
                f.write("### Exit Conditions:\n") 
                for condition in rules["exit_conditions"]:
                    f.write(f"- {condition}\n")
                f.write("\n")
                
                f.write("### Technical Indicators:\n")
                for indicator in rules["technical_indicators"]:
                    f.write(f"- **{indicator['indicator'].upper()}:** {indicator['description']}\n")
                f.write("\n")
                
                f.write("### Risk Management:\n")
                for risk_rule in rules["risk_management"]:
                    f.write(f"- {risk_rule['description']}\n")
                f.write("\n---\n\n")
        
        logger.info(f"✅ Created trading rules: {rules_file}")
        
        return True
    
    def estimate_win_rate(self, pait_score):
        """Estimate win rate based on pAIt score"""
        if pait_score >= 95:
            return "65-75%"
        elif pait_score >= 85:
            return "55-65%"
        elif pait_score >= 75:
            return "50-60%"
        else:
            return "45-55%"
    
    def print_integration_summary(self):
        """Print summary of what was created for AiiQ integration"""
        print("\n🚀 AiiQ-tAIq Integration Summary")
        print("=" * 50)
        
        modules_data = self.load_frankenstein_modules()
        if not modules_data:
            print("❌ No modules found")
            return
            
        json_data, csv_data = modules_data
        
        print(f"📊 Total Strategy Modules: {len(json_data['strategy_modules'])}")
        print(f"🎯 Average pAIt Score: {sum(m['pait_score'] for m in json_data['strategy_modules']) / len(json_data['strategy_modules']):.1f}")
        print(f"📁 Files Created in aiiq_exports/:")
        
        export_files = list(self.aiiq_export_dir.glob("*"))
        for file in export_files:
            print(f"   - {file.name}")
        
        print(f"\n🔧 Ready for AiiQ-tAIq Import:")
        print(f"   1. Import aiiq_backtest_config.json into your backtesting system")
        print(f"   2. Review strategy_summary.csv for strategy overview")
        print(f"   3. Use detailed_trading_rules.md for implementation guidance")
        
        print(f"\n💡 Recommended Next Steps:")
        print(f"   - Start with highest pAIt score strategies (85+)")
        print(f"   - Use paper trading first to validate rules")
        print(f"   - Monitor performance and adjust position sizing")

def main():
    """Main integration function"""
    importer = AiiQFrankensteinImporter()
    
    print("🔬 Frankenstein → AiiQ-tAIq Integration")
    print("=" * 45)
    
    success = importer.create_aiiq_import_files()
    
    if success:
        importer.print_integration_summary()
        print("\n✅ Integration files created successfully!")
        print("🚀 Ready to import into AiiQ-tAIq trading platform!")
    else:
        print("❌ Integration failed. Check logs for details.")

if __name__ == "__main__":
    main()
