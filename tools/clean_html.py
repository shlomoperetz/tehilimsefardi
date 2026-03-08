import json, os, re

DIR = "data/tehilim"

def strip_html(text):
    # Quitar tags HTML pero conservar cantilaciones Unicode
    clean = re.sub(r'<[^>]+>', '', text)
    # Quitar entidades HTML
    clean = clean.replace('&nbsp;', ' ').replace('&amp;', '&')
    return clean.strip()

fixed = 0
for fname in sorted(os.listdir(DIR)):
    if not fname.endswith('.json'): continue
    path = os.path.join(DIR, fname)
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    
    changed = False
    for v in data['verses']:
        clean = strip_html(v['he'])
        if clean != v['he']:
            v['he'] = clean
            changed = True
    
    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        fixed += 1
        print(f"✓ {fname} - limpiado")

print(f"\n=== {fixed} archivos corregidos ===")
