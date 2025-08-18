from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
from pathlib import Path
import sys

# Add parent directory to path to import lens modules
sys.path.append(str(Path(__file__).parent.parent))
try:
    from lens import analyze_image
    from scorer import compute_pait_score
    OCR_AVAILABLE = True
except ImportError as e:
    print(f"OCR modules not available: {e}")
    print("Running in demo mode...")
    OCR_AVAILABLE = False
    
    def analyze_image(image_path):
        return {
            "tags": ["demo", "fallback"], 
            "confidence": 0.85,
            "ocrText": "OCR dependencies not installed.\nUsing demo mode.\nInstall: pip install Pillow pytesseract opencv-python"
        }
    
    def compute_pait_score(tags, confidence):
        return round(confidence * len(tags), 2)

app = Flask(__name__)
CORS(app)

# Create upload directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/analyze', methods=['POST'])
def analyze_image_api():
    try:
        # Check if image file is in request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name
        
        try:
            # Analyze the image using existing lens module
            analysis_result = analyze_image(temp_path)
            
            # Compute pAIt score using existing scorer module
            pait_score = compute_pait_score(
                analysis_result.get('tags', []), 
                analysis_result.get('confidence', 0.0)
            )
            
            # Format response
            response = {
                'ocrText': analysis_result.get('ocrText', 'Sample extracted text from image analysis...'),
                'tags': analysis_result.get('tags', []),
                'confidence': analysis_result.get('confidence', 0.0),
                'paitScore': pait_score,
                'metadata': {
                    'imageSize': f"{os.path.getsize(temp_path)} bytes",
                    'processingTime': '1.2s',  # Mock timing for now
                    'language': 'en'
                }
            }
            
            return jsonify(response)
            
        finally:
            # Clean up temporary file
            os.unlink(temp_path)
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'Crella Lens API'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8002)
