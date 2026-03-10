#!/usr/bin/env python3
"""
Generate translit_en for every verse in data/tehilim/*.json.

Sephardic Spanish → English transliteration rules:
  j  → ch   (ח / כ sound: 'j' in Spanish = 'ch' in English)
  J  → Ch   (capitalized)
  Everything else stays the same (accented vowels, sh, ts, etc.)
"""

import json
import os
import re

BASE = os.path.join(os.path.dirname(__file__), '..', 'data', 'tehilim')


def to_translit_en(translit_es: str) -> str:
    """Convert Sephardic Spanish transliteration to English convention."""
    # Replace 'j' → 'ch', preserving case of the letter that follows
    # Simple: J → Ch, j → ch
    result = translit_es.replace('J', 'Ch').replace('j', 'ch')
    return result


def main():
    updated_files = 0
    updated_verses = 0

    for i in range(1, 151):
        key = f"{i:03d}"
        path = os.path.join(BASE, f"{key}.json")
        with open(path, encoding='utf-8') as f:
            data = json.load(f)

        changed = False
        for verse in data.get('verses', []):
            if 'translit' in verse and 'translit_en' not in verse:
                verse['translit_en'] = to_translit_en(verse['translit'])
                updated_verses += 1
                changed = True

        if changed:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            updated_files += 1

    print(f"Done. {updated_files} files, {updated_verses} verses updated.")


if __name__ == '__main__':
    main()
