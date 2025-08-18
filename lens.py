# lens.py
import cv2
import pytesseract
from PIL import Image
import os

def analyze_image(image_path):
    """
    Analyze image using OCR and extract intelligence
    """
    try:
        # Load and process image
        image = cv2.imread(image_path)
        if image is None:
            return {"tags": [], "confidence": 0.0, "ocrText": "Failed to load image"}
        
        # Convert to RGB for Pillow
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(image_rgb)
        
        # Extract text using OCR
        ocr_text = pytesseract.image_to_string(pil_image, config='--psm 6')
        
        # Analyze text for intelligence tags
        tags = extract_intelligence_tags(ocr_text)
        confidence = calculate_confidence(ocr_text, tags)
        
        return {
            "tags": tags, 
            "confidence": confidence,
            "ocrText": ocr_text.strip() if ocr_text.strip() else "No text detected"
        }
    except Exception as e:
        # Fallback for demo purposes
        return {
            "tags": ["analysis", "demo"], 
            "confidence": 0.85,
            "ocrText": f"OCR processing failed: {str(e)}\n\nUsing demo data for display."
        }

def extract_intelligence_tags(text):
    """Extract relevant tags based on OCR text content"""
    tags = []
    text_lower = text.lower()
    
    # Financial/Trading terms
    if any(term in text_lower for term in ['price', 'chart', 'trading', 'stock', 'crypto', '$']):
        tags.append('financial')
    
    # Security/Vault terms  
    if any(term in text_lower for term in ['secure', 'vault', 'private', 'confidential']):
        tags.append('secure')
    
    # AI/Intelligence terms
    if any(term in text_lower for term in ['ai', 'intelligence', 'analysis', 'score']):
        tags.append('pAIt')
        
    # Technical terms
    if any(term in text_lower for term in ['api', 'code', 'function', 'data']):
        tags.append('technical')
        
    # Default tag if nothing found
    if not tags:
        tags.append('general')
        
    return tags

def calculate_confidence(text, tags):
    """Calculate confidence score based on text quality and tag relevance"""
    if not text.strip():
        return 0.0
        
    # Base confidence on text length and tag count
    text_quality = min(len(text.strip()) / 100, 1.0)  # Normalize to 0-1
    tag_relevance = min(len(tags) / 5, 1.0)  # More tags = higher confidence
    
    return round((text_quality * 0.7 + tag_relevance * 0.3), 2)
