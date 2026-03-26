#!/usr/bin/env python3
"""
Añade campo 'ocasiones' verificado a cada salmo JSON.
Fuentes:
  - Shir shel Yom: Talmud Rosh Hashana 31a
  - Kabbalat Shabat: Nusaj Sefardí (R. Moshe Cordovero, s.XVI)
  - Hallel: Mishná Sukká 3:10 + Talmud Arajín 10a
  - Pesukei deZimrá: Siddur Sefardí estándar
  - 7 Salmos penitenciales: tradición cristiana y judía medieval (s.VII)
  - Elul/Yamim Noraim: minhag extendido Sefarad y Ashkenaz
  - Duelo, enfermedad, boda, viaje: minhaguim documentados
"""

import json
import os
from pathlib import Path

# ── BASE DE DATOS DE OCASIONES ─────────────────────────────────────────────
# Formato: número de salmo → lista de ocasiones

OCASIONES = {
    # SHIR SHEL YOM — Talmud Rosh Hashana 31a
    24:  ["Shir shel Yom (domingo)"],
    48:  ["Shir shel Yom (lunes)"],
    82:  ["Shir shel Yom (martes)"],
    94:  ["Shir shel Yom (miércoles)"],
    81:  ["Shir shel Yom (jueves)"],
    93:  ["Shir shel Yom (viernes)", "Kabalat Shabat"],
    92:  ["Shir shel Yom (Shabat)", "Kabalat Shabat"],

    # KABALAT SHABAT — Nusaj Sefardí
    95:  ["Kabalat Shabat"],
    96:  ["Kabalat Shabat"],
    97:  ["Kabalat Shabat"],
    98:  ["Kabalat Shabat", "Pesukei deZimrá (Shabat/Yom Tov)"],
    99:  ["Kabalat Shabat"],
    29:  ["Kabalat Shabat"],

    # HALLEL — Pesaj, Shavuot, Sucot, Janucá, Rosh Jodesh
    113: ["Hallel", "Rosh Jodesh"],
    114: ["Hallel", "Rosh Jodesh"],
    115: ["Hallel", "Rosh Jodesh"],
    116: ["Hallel", "Rosh Jodesh"],
    117: ["Hallel", "Rosh Jodesh"],
    118: ["Hallel", "Rosh Jodesh"],

    # PESUKEI DEZIMRÁ — diario
    100: ["Pesukei deZimrá (diario)"],
    145: ["Pesukei deZimrá (diario)"],
    146: ["Pesukei deZimrá (diario)"],
    147: ["Pesukei deZimrá (diario)"],
    148: ["Pesukei deZimrá (diario)"],
    149: ["Pesukei deZimrá (diario)"],
    150: ["Pesukei deZimrá (diario)"],

    # PESUKEI DEZIMRÁ — Shabat y Yom Tov (añadidos)
    19:  ["Pesukei deZimrá (Shabat/Yom Tov)"],
    34:  ["Pesukei deZimrá (Shabat/Yom Tov)"],
    90:  ["Pesukei deZimrá (Shabat/Yom Tov)", "Duelo", "Yom Kipur"],
    91:  ["Pesukei deZimrá (Shabat/Yom Tov)"],
    135: ["Pesukei deZimrá (Shabat/Yom Tov)"],
    136: ["Pesukei deZimrá (Shabat/Yom Tov)"],
    33:  ["Pesukei deZimrá (Shabat/Yom Tov)"],

    # ELUL Y YAMIM NORAIM
    27:  ["Elul", "Yamim Noraim"],

    # 7 SALMOS PENITENCIALES — tradición medieval, recitados en Yom Kipur
    6:   ["Salmos penitenciales", "Enfermedad"],
    32:  ["Salmos penitenciales", "Yom Kipur"],
    38:  ["Salmos penitenciales", "Enfermedad"],
    51:  ["Salmos penitenciales", "Yom Kipur"],
    102: ["Salmos penitenciales", "Enfermedad"],
    130: ["Salmos penitenciales", "Yom Kipur", "Duelo"],
    143: ["Salmos penitenciales"],

    # DUELO / SHIVÁ
    49:  ["Duelo"],
    23:  ["Duelo", "Enfermedad"],
    16:  ["Duelo"],

    # ENFERMEDAD (Tehilim para enfermos — lista estándar del siddur)
    20:  ["Enfermedad"],
    22:  ["Enfermedad"],
    30:  ["Enfermedad"],
    88:  ["Enfermedad"],
    103: ["Enfermedad"],
    121: ["Enfermedad", "Viaje"],

    # BODA
    45:  ["Boda"],

    # VIAJE
    # 121 ya incluido arriba
}

# ── PROCESO ────────────────────────────────────────────────────────────────

data_dir = Path("data/tehilim")
modified = 0
skipped = 0

for json_file in sorted(data_dir.glob("*.json")):
    with open(json_file, "r", encoding="utf-8") as f:
        psalm = json.load(f)

    num = psalm.get("number")
    ocasiones = OCASIONES.get(num, [])

    # Si ya tiene el campo y es igual, no tocar
    if psalm.get("ocasiones") == ocasiones:
        skipped += 1
        continue

    # Insertar/actualizar campo ocasiones (preservar orden del resto)
    psalm["ocasiones"] = ocasiones

    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(psalm, f, ensure_ascii=False, indent=2)

    modified += 1
    if ocasiones:
        print(f"  [{num:3d}] {json_file.name} → {ocasiones}")

print(f"\n✅ {modified} salmos actualizados, {skipped} sin cambios")

# ── RESUMEN POR OCASIÓN ────────────────────────────────────────────────────
print("\n── Resumen por ocasión ──")
from collections import defaultdict
resumen = defaultdict(list)
for num, ocs in OCASIONES.items():
    for oc in ocs:
        resumen[oc].append(num)

for oc, nums in sorted(resumen.items()):
    print(f"  {oc}: {sorted(nums)}")
