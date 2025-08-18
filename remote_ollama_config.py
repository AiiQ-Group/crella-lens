#!/usr/bin/env python3
"""
🌐 Remote Ollama Configuration - Bridge to Your GPU Server
Connect Windows analysis to Linux GPU models
"""

import json

# Your GPU server configuration
OLLAMA_SERVERS = {
    "local": {
        "url": "http://localhost:11434",
        "available_models": ["claudia-trader:latest"],
        "description": "Local Windows Ollama instance"
    },
    "gpu_server": {
        "url": "http://AiiQ-core-neuralcenter:11434",  # Your Linux GPU server
        "available_models": [
            "juliet:latest",
            "jbot:latest", 
            "trader-max:latest",
            "claudia-trader:latest",
            "kathy-ops:latest",
            "qwen2.5:72b",
            "fraud-detector:latest",
            "compliance-officer:latest",
            "security-guard-enhanced:latest",
            "threat-hunter:latest"
        ],
        "description": "Main GPU server with all specialized models"
    }
}

# Model routing - which server to use for each model
MODEL_ROUTING = {
    "jbot:latest": "gpu_server",
    "claudia-trader:latest": "local",  # Available locally
    "kathy-ops:latest": "gpu_server", 
    "trader-max:latest": "gpu_server",
    "fraud-detector:latest": "gpu_server",
    "compliance-officer:latest": "gpu_server",
    "juliet:latest": "gpu_server",
    "qwen2.5:72b": "gpu_server"
}

def get_model_server(model_name: str) -> str:
    """Get the appropriate server URL for a model"""
    server_key = MODEL_ROUTING.get(model_name, "local")
    return OLLAMA_SERVERS[server_key]["url"]

def get_available_models() -> dict:
    """Get all available models across servers"""
    all_models = {}
    for server_name, config in OLLAMA_SERVERS.items():
        for model in config["available_models"]:
            all_models[model] = {
                "server": server_name,
                "url": config["url"]
            }
    return all_models
