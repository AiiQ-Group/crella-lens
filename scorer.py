# scorer.py
def compute_pait_score(tags, confidence):
    # TODO: Implement scoring logic based on tags and confidence
    return round(confidence * len(tags), 2)
