import urllib.request
import json
import time
import os

OUTPUT_DIR = "data/tehilim"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def fetch_psalm(num):
    url = f"https://www.sefaria.org/api/texts/Psalms.{num}?lang=he&commentary=0&context=0"
    with urllib.request.urlopen(url, timeout=10) as r:
        return json.loads(r.read())

def build_json(num, data):
    he_verses = data.get("he", [])
    verses = []
    for i, he in enumerate(he_verses, 1):
        verses.append({
            "num": i,
            "he": he,          # con cantilaciones
            "he_plain": "",    # sin cantilaciones - añadir después
            "translit": "",    # transliteración sefaradí - añadir después
            "es": ""           # traducción español - añadir después
        })
    return {
        "number": num,
        "title_he": data.get("heTitle", ""),
        "verses": verses,
        "audio": ""
    }

errors = []
for num in range(1, 151):
    path = f"{OUTPUT_DIR}/{num:03d}.json"
    try:
        data = fetch_psalm(num)
        psalm = build_json(num, data)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(psalm, f, ensure_ascii=False, indent=2)
        print(f"✓ Salmo {num:3d} - {len(psalm['verses'])} versos")
        time.sleep(0.3)  # respetar rate limit
    except Exception as e:
        print(f"✗ Salmo {num}: {e}")
        errors.append(num)
        time.sleep(1)

print(f"\n=== HECHO ===")
print(f"Errores: {errors if errors else 'ninguno'}")
print(f"Archivos: {len(os.listdir(OUTPUT_DIR))}")
