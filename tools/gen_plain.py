import json, os, re

DIR = "data/tehilim"

def clean_entities(text):
    # Quitar entidades HTML que quedaron
    text = re.sub(r'&[a-zA-Z]+;', '', text)
    text = re.sub(r'&#[0-9]+;', '', text)
    return text.strip()

def strip_cantillation(text):
    result = []
    for ch in text:
        cp = ord(ch)
        if 0x0591 <= cp <= 0x05C7:
            continue
        result.append(ch)
    return ''.join(result).strip()

for fname in sorted(os.listdir(DIR)):
    if not fname.endswith('.json'): continue
    path = os.path.join(DIR, fname)
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    
    for v in data['verses']:
        # Limpiar entidades del hebreo con cantilaciones
        v['he'] = clean_entities(v['he'])
        # Generar versión sin cantilaciones ni nikkud
        v['he_plain'] = strip_cantillation(v['he'])
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("=== Listo: he + he_plain generados para 150 salmos ===")
