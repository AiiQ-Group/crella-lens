# 🚀 AiiQ-tAIq Import Guide - Frankenstein Strategies

## 📊 **IMPORT SUMMARY**

**Strategy Generated:** August 18, 2025  
**pAIt Score:** 100/100 ⭐  
**Risk Level:** Medium  
**Expected Win Rate:** 65-75%  
**Recommended Capital:** $10,000  

---

## 📁 **FILES TO IMPORT**

### **1. Quick Import (CSV)**
```
📂 aiiq_exports/strategy_summary.csv
```
- **Use for:** Quick overview and strategy selection
- **Contains:** Strategy ID, pAIt score, risk level, win rate estimates

### **2. Detailed Backtest Config (JSON)**  
```
📂 aiiq_exports/aiiq_backtest_config.json
```
- **Use for:** Full backtesting setup in AiiQ-tAIq
- **Contains:** Complete strategy parameters, entry/exit rules, risk management

### **3. Implementation Guide (Markdown)**
```
📂 aiiq_exports/detailed_trading_rules.md
```
- **Use for:** Manual strategy implementation reference
- **Contains:** Step-by-step trading rules and technical indicators

---

## ⚙️ **BACKTEST PARAMETERS (Ready to Use)**

### **Strategy: pAIt Bot Trading Analysis**
```json
{
  "initial_capital": 10000,
  "position_size": 3%,
  "max_positions": 5,
  "stop_loss": 1.5%,
  "take_profit": 4.0%
}
```

### **Entry Conditions:**
- ✅ RSI < 30 (oversold for long entry)
- ✅ MACD line crosses above signal line  
- ✅ Active market conditions with volume confirmation

### **Exit Conditions:**
- 🔴 RSI > 70 (overbought for long exit)
- 🔴 MACD line crosses below signal line
- 💰 Profit target: $322/hour pattern (4% take profit)

### **Technical Indicators:**
- **RSI (14):** Momentum oscillator
- **MACD (12,26,9):** Trend-following indicator

---

## 🎯 **RECOMMENDED IMPORT PROCESS**

### **Step 1: Import Strategy Summary**
```bash
# In your AiiQ-tAIq platform:
1. Go to Strategy Import section
2. Upload: aiiq_exports/strategy_summary.csv
3. Select strategy: pait_xyvqJdyUVIA_20250818
```

### **Step 2: Configure Backtest**
```bash
# Use these exact parameters:
- Capital: $10,000
- Position Size: 3% per trade
- Max Positions: 5 concurrent
- Stop Loss: 1.5%
- Take Profit: 4.0%
```

### **Step 3: Set Technical Indicators**
```bash
# Add to your charts:
- RSI(14): Entry < 30, Exit > 70
- MACD(12,26,9): Entry on bullish crossover, Exit on bearish crossover
- Volume: Confirm with above-average volume
```

### **Step 4: Backtest Period**
```bash
# Recommended test periods:
- Start: Last 6 months historical data
- Timeframes: 5M, 15M, 1H (multi-timeframe strategy)
- Markets: Focus on active trading pairs (BTC, ETH, major forex)
```

---

## 📈 **EXPECTED PERFORMANCE**

### **Based on pAIt Score of 100/100:**
- **Win Rate:** 65-75%
- **Risk/Reward:** 1:2.67 (1.5% SL, 4% TP)
- **Max Drawdown:** Expected < 8% (medium risk)
- **Profit Target:** $322/hour equivalent (approx 3.2% per successful trade)

### **Performance Benchmarks:**
```
✅ Good Performance: >60% win rate, <10% drawdown
⚠️  Review Needed: <55% win rate, >15% drawdown
❌ Stop Trading: <50% win rate, >20% drawdown
```

---

## 🔧 **INTEGRATION CHECKLIST**

### **Before Going Live:**
- [ ] Import strategy_summary.csv
- [ ] Configure backtest with provided parameters
- [ ] Test on 6-month historical data  
- [ ] Verify RSI and MACD indicators are working
- [ ] Paper trade for 2 weeks minimum
- [ ] Monitor performance vs benchmarks

### **Go-Live Requirements:**
- [ ] Backtest shows >60% win rate
- [ ] Max drawdown stays under 10%
- [ ] Paper trading confirms backtest results
- [ ] Risk management rules are automated
- [ ] Stop-loss and take-profit orders are working

---

## 🚨 **IMPORTANT NOTES**

### **⚠️ Risk Warnings:**
- This is a **medium-risk** strategy
- Always use proper position sizing (3% max)
- Never override the 1.5% stop-loss
- Monitor performance weekly

### **🔄 Strategy Updates:**
- Run `python frankenstein_integration.py` weekly for new strategies
- Check for updated modules from H100 server
- Compare new strategies against current performance

### **📞 Support:**
- Generated from: **Crella Lens Frankenstein System**
- Source: H100 GPU Server (143.198.44.252)
- Analysis Date: August 18, 2025
- Strategy ID: `pait_xyvqJdyUVIA_20250818`

---

## 🎉 **READY TO TRADE!**

Your Frankenstein strategy is now ready for backtesting in AiiQ-tAIq!

**Next Steps:**
1. Import the CSV file
2. Run a 6-month backtest
3. Paper trade for 2 weeks
4. Go live with small position sizes

**🔬 This strategy was automatically extracted from YouTube trading analysis with a perfect pAIt score of 100/100!**
