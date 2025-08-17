# cli.py
import sys
from lens import analyze_image
from scorer import compute_pait_score

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cli.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    result = analyze_image(image_path)
    score = compute_pait_score(result["tags"], result["confidence"])
    print(f"Tags: {result['tags']} | Score: {score}")
