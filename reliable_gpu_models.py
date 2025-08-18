#!/usr/bin/env python3
"""
🤖 Reliable GPU Models Configuration
Your proven, stable AI models for trading analysis

EXCLUDED: juliet (reliability issues reported by user)
FOCUS: High-performance, stable models for production use
"""

# Your reliable GPU models configuration
RELIABLE_MODELS = {
    # Primary Analysis Models
    "jbot:latest": {
        "size": "47GB",
        "specialty": "Main trading analysis and best practices extraction",
        "reliability": "HIGH",
        "use_cases": ["screenshot_analysis", "strategy_identification", "risk_assessment"],
        "timeout": 90
    },
    
    "claudia-trader:latest": {
        "size": "67GB", 
        "specialty": "Advanced trading strategies and pAIt scoring",
        "reliability": "VERY HIGH",
        "use_cases": ["deep_strategy_analysis", "pait_scoring", "frankenstein_strategies"],
        "timeout": 120
    },
    
    "trader-max:latest": {
        "size": "47GB",
        "specialty": "Maximum trading insights and optimization",
        "reliability": "HIGH",
        "use_cases": ["performance_optimization", "advanced_analysis", "market_insights"],
        "timeout": 100
    },
    
    "kathy-ops:latest": {
        "size": "67GB",
        "specialty": "Options trading specialist",
        "reliability": "HIGH", 
        "use_cases": ["options_analysis", "greeks_calculation", "risk_reward_profiles"],
        "timeout": 110
    },
    
    "qwen2.5:72b": {
        "size": "47GB",
        "specialty": "Deep quantum analysis and complex reasoning",
        "reliability": "HIGH",
        "use_cases": ["complex_analysis", "multi_factor_evaluation", "quantum_insights"],
        "timeout": 150
    },
    
    # Security & Compliance Models
    "fraud-detector:latest": {
        "size": "4.7GB",
        "specialty": "Fraud detection and scam identification",
        "reliability": "HIGH",
        "use_cases": ["fraud_detection", "scam_identification", "risk_flagging"],
        "timeout": 60
    },
    
    "compliance-officer:latest": {
        "size": "4.7GB", 
        "specialty": "Regulatory compliance and risk assessment",
        "reliability": "HIGH",
        "use_cases": ["compliance_check", "regulatory_analysis", "legal_review"],
        "timeout": 60
    }
}

# Excluded models (with reasons)
EXCLUDED_MODELS = {
    "juliet:latest": "Reliability issues reported - excluded from production use",
    "juliet:backup": "Associated with problematic juliet model",
    "juliet:latest-working": "Part of juliet family - excluded for consistency"
}

# Model routing for different analysis types
ANALYSIS_ROUTING = {
    "screenshot_analysis": ["jbot:latest", "claudia-trader:latest"],
    "strategy_deep_dive": ["claudia-trader:latest", "trader-max:latest"],
    "options_analysis": ["kathy-ops:latest", "claudia-trader:latest"],
    "fraud_detection": ["fraud-detector:latest", "compliance-officer:latest"],
    "pait_scoring": ["claudia-trader:latest", "jbot:latest"],
    "quantum_analysis": ["qwen2.5:72b", "claudia-trader:latest"]
}

def get_best_model_for_task(task_type: str) -> str:
    """Get the best model for a specific task"""
    models = ANALYSIS_ROUTING.get(task_type, ["claudia-trader:latest"])
    return models[0]  # Return primary model

def get_model_config(model_name: str) -> dict:
    """Get configuration for a specific model"""
    return RELIABLE_MODELS.get(model_name, {})

def is_model_reliable(model_name: str) -> bool:
    """Check if a model is in the reliable list"""
    return model_name in RELIABLE_MODELS

def get_reliable_models_list() -> list:
    """Get list of all reliable model names"""
    return list(RELIABLE_MODELS.keys())

if __name__ == "__main__":
    print("🤖 RELIABLE GPU MODELS CONFIGURATION")
    print("=" * 50)
    
    print(f"\n✅ RELIABLE MODELS ({len(RELIABLE_MODELS)}):")
    for model, config in RELIABLE_MODELS.items():
        print(f"  🎯 {model}")
        print(f"      Size: {config['size']} | Reliability: {config['reliability']}")
        print(f"      Specialty: {config['specialty']}")
        print()
    
    print(f"❌ EXCLUDED MODELS ({len(EXCLUDED_MODELS)}):")
    for model, reason in EXCLUDED_MODELS.items():
        print(f"  🚫 {model}: {reason}")
    
    print(f"\n📊 ANALYSIS ROUTING:")
    for task, models in ANALYSIS_ROUTING.items():
        print(f"  🎯 {task}: {models[0]} (primary)")
