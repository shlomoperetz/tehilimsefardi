#!/usr/bin/env python3
"""
Generate translit_en from translit via simple string replacement.
No API, no external calls.
"""
import json, os

BASE = os.path.join(os.path.dirname(__file__), '..', 'data', 'tehilim')

REPLACEMENTS = [
    # lowercase accented vowels → plain
    ('á', 'a'), ('é', 'e'), ('í', 'i'), ('ó', 'o'), ('ú', 'u'), ('ü', 'u'),
    # uppercase accented vowels → plain uppercase
    ('Á', 'A'), ('É', 'E'), ('Í', 'I'), ('Ó', 'O'), ('Ú', 'U'),
    # j → ch (ח/כ in Sephardic Spanish = ch in English)
    ('J', 'Ch'), ('j', 'ch'),
]

def convert(text):
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text

def main():
    files, verses = 0, 0
    for i in range(1, 151):
        key = f"{i:03d}"
        path = os.path.join(BASE, f"{key}.json")
        with open(path, encoding='utf-8') as f:
            data = json.load(f)
        changed = False
        for v in data.get('verses', []):
            src = v.get('translit', '')
            if src:
                new = convert(src)
                if v.get('translit_en') != new:
                    v['translit_en'] = new
                    verses += 1
                    changed = True
        if changed:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            files += 1
    print(f"Done. {files} files, {verses} verses updated.")

if __name__ == '__main__':
    main()
