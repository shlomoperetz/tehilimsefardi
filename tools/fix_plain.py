import json, os

DIR = "data/tehilim"

for fname in sorted(os.listdir(DIR)):
    if not fname.endswith('.json'): continue
    path = os.path.join(DIR, fname)
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    
    for v in data['verses']:
        # Reemplazar maqaf (־ U+05BE) por espacio antes de quitar cantilaciones
        plain = v['he'].replace('־', ' ')
        # Ahora quitar cantilaciones y nikkud
        result = []
        for ch in plain:
            cp = ord(ch)
            if 0x0591 <= cp <= 0x05C7:
                continue
            result.append(ch)
        # Limpiar espacios dobles
        import re
        v['he_plain'] = re.sub(r'  +', ' ', ''.join(result)).strip()
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("=== he_plain corregido ===")
