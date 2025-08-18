# Quantum Analyzer – pAIt Trader Intelligence Module

## 🔍 Purpose
The Quantum Analyzer is a Crella Lens-integrated module that ingests trading-related video content and evaluates credibility, strategy quality, and proof-of-work claims using pAIt scoring methodology.

## 🧠 Core Features

- 🎥 **YouTube Video Analysis**
  - Transcribes and summarizes trading content
  - Detects aggressive claims (e.g. "10x in 7 days")
  - Grades strategy transparency and risk disclosure

- 🧮 **Component-Level Scoring**
  - Profit Claim Integrity
  - Risk Disclosure
  - Evidence & Screenshots
  - Strategy Method
  - Presenter Credibility
  - Final Trust Score (1–5)

- 📸 **Visual Scorecard Output**
  - Auto-generates image-based pAIt scorecards
  - Compatible with Crella Lens vault upload
  - Metadata embedded with IP, timestamp, and signature

- 🤖 **Multi-Agent Verification**
  - Claude + Ollama-based prompt cross-validation
  - Signature chain for consensus scoring

---

## 🧪 Example Output

```json
{
  "video_url": "https://youtube.com/xyz123",
  "score": 2.3,
  "components": {
    "profit_claims": 2.1,
    "risk_disclosure": 1.2,
    "evidence": 1.8,
    "strategy_method": 3.4,
    "credibility": 2.9
  },
  "verdict": "⚠️ High Risk - Multiple red flags detected",
  "image_path": "lens-data/scorecards/youtube-trader-xyz123.png"
}
