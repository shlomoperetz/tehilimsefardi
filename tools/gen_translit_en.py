#!/usr/bin/env python3
"""
Regenerate translit_en for every verse in data/tehilim/*.json.

Sephardic Spanish → English transliteration rules:
  1. Stressed vowel marked with UPPERCASE (removing diacritic):
       á→A  é→E  í→I  ó→O  ú→U   (and Á→A É→E Í→I Ó→O Ú→U)
  2. j → ch  (ח/כ: 'j' in Spanish sephardic = 'ch' in English)
     J → Ch
  3. '; ' → ', '  (semicolons between clauses → commas)
  All other characters unchanged (sh, ts, accented → plain elsewhere).
"""

import json
import os

BASE = os.path.join(os.path.dirname(__file__), '..', 'data', 'tehilim')

# Stressed accented vowel → uppercase plain vowel
STRESS_MAP = {
    'á': 'A', 'é': 'E', 'í': 'I', 'ó': 'O', 'ú': 'U',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
}


def to_translit_en(text: str) -> str:
    # 1. Stressed accented vowels → uppercase plain vowels
    result = ''.join(STRESS_MAP.get(c, c) for c in text)
    # 2. j → ch  (Spanish sephardic 'j' = English 'ch' for ח/כ)
    result = result.replace('J', 'Ch').replace('j', 'ch')
    # 3. Semicolons between clauses → commas
    result = result.replace('; ', ', ')
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
            if 'translit' in verse:
                new_val = to_translit_en(verse['translit'])
                if verse.get('translit_en') != new_val:
                    verse['translit_en'] = new_val
                    updated_verses += 1
                    changed = True

        if changed:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            updated_files += 1

    print(f"Done. {updated_files} files, {updated_verses} verses updated.")


if __name__ == '__main__':
    main()
