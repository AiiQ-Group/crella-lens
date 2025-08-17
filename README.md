# Crella Lens

Crella Lens is a visual intelligence interpreter that decodes visual prompts into structured logic.

## Components
- `lens.py`: Visual-to-text translator
- `scorer.py`: Proof-of-work scoring logic
- `cli.py`: Command-line interface for local use
- `lens-data/`: Vault-stored image data
- `tests/`: Unit test directory

## Usage
Run the CLI:
```bash
python cli.py path/to/image.png
```

This will return extracted tags and scores based on the image's contents.
