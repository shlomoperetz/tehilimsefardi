# tehilimsefardi.com — Guía de desarrollo

## Estructura del proyecto

```
tehilimsefardi/
├── config.toml              # Configuración Hugo
├── static/
│   └── css/style.css        # Estilos
├── layouts/
│   ├── index.html           # Página principal (grid de 150 salmos)
│   └── _default/
│       ├── baseof.html      # Layout base
│       └── single.html      # Template de salmo individual
└── content/
    └── tehilim/
        ├── 001.md           # Salmo 1
        ├── 023.md           # Salmo 23
        └── 150.md           # Salmo 150
```

## Añadir un salmo nuevo

Crear un archivo `content/tehilim/NNN.md` con la siguiente estructura:

```yaml
---
title: "Salmo N"
number: N
number_he: "Número en hebreo"
subtitle_he: "מִזְמוֹר לְדָוִד"      # opcional
subtitle_es: "Salmo de David"         # opcional
weight: N
verses:
  - num: 1
    he: "Texto hebreo con vocales"
    translit: "Transliteración sefardí"
    es: "Traducción al español"
  - num: 2
    ...
---
```

## Transliteración sefardí — criterios

- **ח** = j (como en español: "jardín")
- **כ/ך** sin dagesh = j
- **צ** = tz
- **ש** = sh
- **ע** = ' (apóstrofo)
- **ו** como consonante = v
- **ת** sin dagesh = t (no 's' como en ashkenazí)
- Acento indicado con tilde: **nafshí**, **Adonái**
- **יְהֹוָה** siempre = Adonai

## Comandos

```bash
# Desarrollo local
hugo server -D

# Build para producción
hugo

# Deploy (GitHub Pages)
git add . && git commit -m "Add psalms" && git push
```

## Prioridades de contenido

Salmos más buscados (añadir primero):
1, 2, 3, 8, 15, 19, 22, 23, 24, 27, 51, 90, 91, 100, 104, 121, 130, 145, 148, 150
