#!/usr/bin/env python3
"""
Generate translit_en from translit via string replacement.
Also fixes OCR/encoding garbage in the translit source field.
No API, no external calls.
"""
import json, os

BASE = os.path.join(os.path.dirname(__file__), '..', 'data', 'tehilim')

# Rules applied ONLY to translit_en (convert Spanish sephardic → English)
TRANSLIT_EN_RULES = [
    # Arabic jeem → ch  (OCR artifact that also represents ח/כ)
    ('ج', 'ch'),
    # Spanish stressed vowels → plain lowercase
    ('á', 'a'), ('é', 'e'), ('í', 'i'), ('ó', 'o'), ('ú', 'u'), ('ü', 'u'),
    # Spanish stressed uppercase → plain uppercase
    ('Á', 'A'), ('É', 'E'), ('Í', 'I'), ('Ó', 'O'), ('Ú', 'U'),
    # j → ch  (ח/כ)
    ('J', 'Ch'), ('j', 'ch'),
    # Cyrillic lookalikes (OCR errors)
    ('\u0430', 'a'),   # а → a
    ('\u0435', 'e'),   # е → e
    ('\u043E', 'o'),   # о → o
    ('\u043A', 'k'),   # к → k
    ('\u043B', 'l'),   # л → l
    ('\u0442', 't'),   # т → t
    ('\u0440', 'r'),   # р → r
    ('\u0441', 's'),   # с → s
    # Other diacritic/OCR artifacts
    ('\u00EC', 'i'),   # ì → i
    ('\u00EF', 'i'),   # ï → i
    ('\u00F4', 'o'),   # ô → o
    ('\u00F7', 'u'),   # ÷ → u  (OCR for וּ)
    ('\u00F0', 'u'),   # ð → u  (OCR for וּ)
    ('\u00B7', ''),    # · → remove
    ('\u0924', 't'),   # त → t  (Devanagari OCR)
    ('\u093E', 'a'),   # ा → a  (Devanagari vowel AA)
]

# Rules applied ONLY to translit source field (fix OCR garbage, keep Spanish accents + j)
TRANSLIT_SRC_RULES = [
    # Cyrillic lookalikes
    ('\u0430', 'a'),   # а → a
    ('\u0435', 'e'),   # е → e
    ('\u043E', 'o'),   # о → o
    ('\u043A', 'k'),   # к → k
    ('\u043B', 'l'),   # л → l
    ('\u0442', 't'),   # т → t
    ('\u0440', 'r'),   # р → r
    ('\u0441', 's'),   # с → s
    # Arabic jeem used as ח  (keep as 'j' in Spanish, fix in translit_en separately)
    ('\u062C', 'j'),   # ج → j
    # Other artifacts
    ('\u00EC', 'i'),   # ì → i
    ('\u00EF', 'i'),   # ï → i
    ('\u00F4', 'o'),   # ô → o
    ('\u00F7', 'u'),   # ÷ → u
    ('\u00F0', 'u'),   # ð → u
    ('\u00B7', ''),    # · → remove
    ('\u0924', 't'),   # त → t
    ('\u093E', 'a'),   # ा → a  (Devanagari vowel AA)
]

def apply_rules(text, rules):
    for old, new in rules:
        text = text.replace(old, new)
    return text

def main():
    files, tr_fixed, ten_fixed = 0, 0, 0
    for i in range(1, 151):
        key = f"{i:03d}"
        path = os.path.join(BASE, f"{key}.json")
        with open(path, encoding='utf-8') as f:
            data = json.load(f)
        changed = False
        for v in data.get('verses', []):
            src = v.get('translit', '')
            if not src:
                continue
            # Fix OCR garbage in the Spanish translit source
            src_clean = apply_rules(src, TRANSLIT_SRC_RULES)
            if src_clean != src:
                v['translit'] = src_clean
                tr_fixed += 1
                changed = True
            # Generate translit_en from the cleaned source
            new_en = apply_rules(src_clean, TRANSLIT_EN_RULES)
            if v.get('translit_en') != new_en:
                v['translit_en'] = new_en
                ten_fixed += 1
                changed = True
        if changed:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            files += 1
    print(f"Done. {files} files | {tr_fixed} translit fixes | {ten_fixed} translit_en updates.")

if __name__ == '__main__':
    main()
