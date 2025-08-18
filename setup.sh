#!/bin/bash

echo "Setting up Crella Lens..."

echo ""
echo "Installing frontend dependencies..."
npm install

echo ""
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo ""
echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && python app.py"
echo "2. Frontend: npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
