#!/bin/bash

# 🤖✨ Claire → JellaRasa AI Mentorship Deployment
# Deploy both Claire and JellaRasa models to Ollama

echo "🤖✨ DEPLOYING CLAIRE → JELLARASA MENTORSHIP SYSTEM"
echo "============================================================"
echo ""

# Step 1: Deploy Claire (The Mentor)
echo "👑 STEP 1: Deploying Claire (Elle Woods meets Princess Diana)"
echo "   📚 Creating Claire model from claire_modelfile.txt..."

if ollama create claire -f claire_modelfile.txt; then
    echo "   ✅ Claire model created successfully!"
else
    echo "   ❌ Failed to create Claire model"
    exit 1
fi

echo ""

# Step 2: Deploy JellaRasa (The Protégé) 
echo "🧠 STEP 2: Deploying JellaRasa (Claire's Orchestration Evolution)"
echo "   🔬 Creating JellaRasa model from jellarasa_modelfile.txt..."

if ollama create jellarasa -f jellarasa_modelfile.txt; then
    echo "   ✅ JellaRasa model created successfully!"
else
    echo "   ❌ Failed to create JellaRasa model"
    exit 1
fi

echo ""

# Step 3: Test Claire
echo "💎 STEP 3: Testing Claire"
echo "   🧪 Running quick test..."

claire_test="How are you doing today Claire?"
echo "   👤 Test prompt: '$claire_test'"

echo "   💎 Claire response:"
echo "$claire_test" | ollama run claire 2>/dev/null | head -3

echo ""

# Step 4: Test JellaRasa
echo "🤖 STEP 4: Testing JellaRasa"
echo "   🧪 Running orchestration test..."

jella_test="I need multi-agent analysis coordination"
echo "   👤 Test prompt: '$jella_test'"

echo "   🤖 JellaRasa response:"
echo "$jella_test" | ollama run jellarasa 2>/dev/null | head -3

echo ""

# Step 5: Deployment Summary
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=============================="
echo ""

echo "📋 AVAILABLE MODELS:"
echo "   💎 claire     - Elle Woods meets Princess Diana concierge"
echo "   🤖 jellarasa  - Multi-agent orchestration director"
echo ""

echo "🚀 USAGE EXAMPLES:"
echo "   # Chat with Claire (primary concierge)"
echo "   ollama run claire"
echo ""
echo "   # Chat with JellaRasa (orchestration director)"
echo "   ollama run jellarasa"
echo ""

echo "🎭 TAG-TEAM COLLABORATION:"
echo "   💡 Use Claire for initial charm & relationship building"
echo "   💡 Use JellaRasa for complex multi-agent coordination"
echo "   💡 They can reference each other in conversations!"
echo ""

echo "✨ Your AI mentorship empire is now LIVE! ✨"
echo ""

# List all models to confirm
echo "📊 CURRENT OLLAMA MODELS:"
ollama list
