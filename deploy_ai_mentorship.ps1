# 🤖✨ Claire → JellaRasa AI Mentorship Deployment
# Deploy both Claire and JellaRasa models to Ollama

Write-Host "🤖✨ DEPLOYING CLAIRE → JELLARASA MENTORSHIP SYSTEM" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Step 1: Deploy Claire (The Mentor)
Write-Host "👑 STEP 1: Deploying Claire (Elle Woods meets Princess Diana)" -ForegroundColor Magenta
Write-Host "   📚 Base: llama3:latest (4.7 GB) - Perfect for charming concierge work" -ForegroundColor Gray
Write-Host "   📚 Creating Claire model from claire_modelfile.txt..." -ForegroundColor White

try {
    ollama create claire -f claire_modelfile.txt
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Claire model created successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to create Claire model" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Error creating Claire model: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Deploy JellaRasa (The Protégé) 
Write-Host "🧠 STEP 2: Deploying JellaRasa (Claire's Orchestration Evolution)" -ForegroundColor Magenta
Write-Host "   🔬 Base: mixtral:latest (26 GB) - Powerful multi-agent orchestration" -ForegroundColor Gray
Write-Host "   🔬 Creating JellaRasa model from jellarasa_modelfile.txt..." -ForegroundColor White

try {
    ollama create jellarasa -f jellarasa_modelfile.txt
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ JellaRasa model created successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to create JellaRasa model" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Error creating JellaRasa model: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Test Claire
Write-Host "💎 STEP 3: Testing Claire" -ForegroundColor Magenta
Write-Host "   🧪 Running quick test..." -ForegroundColor White

$claireTest = 'How are you doing today Claire?'
Write-Host "   👤 Test prompt: '$claireTest'" -ForegroundColor Yellow

try {
    $claireResponse = ollama run claire --prompt $claireTest 2>&1
    Write-Host "   💎 Claire: " -ForegroundColor Magenta -NoNewline
    Write-Host $claireResponse -ForegroundColor White
} catch {
    Write-Host "   ⚠️ Claire test failed, but model is deployed" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Test JellaRasa
Write-Host "🤖 STEP 4: Testing JellaRasa" -ForegroundColor Magenta
Write-Host "   🧪 Running orchestration test..." -ForegroundColor White

$jellaTest = 'I need multi-agent analysis coordination'
Write-Host "   👤 Test prompt: '$jellaTest'" -ForegroundColor Yellow

try {
    $jellaResponse = ollama run jellarasa --prompt $jellaTest 2>&1
    Write-Host "   🤖 JellaRasa: " -ForegroundColor Blue -NoNewline
    Write-Host $jellaResponse -ForegroundColor White
} catch {
    Write-Host "   ⚠️ JellaRasa test failed, but model is deployed" -ForegroundColor Yellow
}

Write-Host ""

# Step 5: Deployment Summary
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=" * 30 -ForegroundColor Green
Write-Host ""

Write-Host "📋 AVAILABLE MODELS:" -ForegroundColor Cyan
Write-Host "   💎 claire     - Elle Woods meets Princess Diana concierge" -ForegroundColor Magenta
Write-Host "   🤖 jellarasa  - Multi-agent orchestration director" -ForegroundColor Blue
Write-Host ""

Write-Host "🚀 USAGE EXAMPLES:" -ForegroundColor Cyan
Write-Host "   # Chat with Claire (primary concierge)" -ForegroundColor Gray
Write-Host "   ollama run claire" -ForegroundColor White
Write-Host ""
Write-Host "   # Chat with JellaRasa (orchestration director)" -ForegroundColor Gray  
Write-Host "   ollama run jellarasa" -ForegroundColor White
Write-Host ""

Write-Host "🎭 TAG-TEAM COLLABORATION:" -ForegroundColor Cyan
Write-Host "   💡 Use Claire for initial charm & relationship building" -ForegroundColor White
Write-Host "   💡 Use JellaRasa for complex multi-agent coordination" -ForegroundColor White
Write-Host "   💡 They can reference each other in conversations!" -ForegroundColor White
Write-Host ""

Write-Host "✨ Your AI mentorship empire is now LIVE! ✨" -ForegroundColor Green
Write-Host ""

# List all models to confirm
Write-Host "📊 CURRENT OLLAMA MODELS:" -ForegroundColor Cyan
ollama list
