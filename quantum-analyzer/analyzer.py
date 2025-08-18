# quantum-analyzer/analyzer.py

import re
from pathlib import Path

def analyze_transcript(text: str) -> dict:
    """
    Analyze extracted video text and return component scores.
    """
    scores = {
        "profit_claims": 0,
        "risk_disclosure": 0,
        "evidence_proof": 0,
        "strategy_method": 0,
        "credibility": 0,
    }

    text_lower = text.lower()

    # 🎯 Profit Claims
    if "10x" in text_lower or "guarantee" in text_lower:
        scores["profit_claims"] = 1.5
    elif re.search(r"\b\d{2,}%\b", text_lower):
        scores["profit_claims"] = 2.5
    else:
        scores["profit_claims"] = 3.5

    # 🛑 Risk Disclosure
    if "not financial advice" in text_lower or "at your own risk" in text_lower:
        scores["risk_disclosure"] = 4.0
    else:
        scores["risk_disclosure"] = 1.0

    # 🔍 Evidence / Proof
    if "watch me" in text_lower or "live trade" in text_lower:
        scores["evidence_proof"] = 3.5
    else:
        scores["evidence_proof"] = 2.0

    # 🧠 Strategy Method
    if "moving average" in text_lower or "rsi" in text_lower:
        scores["strategy_method"] = 4.2
    else:
        scores["strategy_method"] = 2.1

    # 👤 Credibility
    if "years of experience" in text_lower or "certified" in text_lower:
        scores["credibility"] = 4.0
    else:
        scores["credibility"] = 2.5

    return scores
