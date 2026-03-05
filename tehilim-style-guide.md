# Guía de Estilo — Tehilim Sefaradí
> Basada en el sistema visual de siddursefardi.com

---

## Tipografía

| Elemento | Fuente | Peso | Tamaño |
|---|---|---|---|
| Texto de tehilim | Noto Serif Hebrew | 400 | 1.4rem |
| Títulos (מזמור) | Noto Serif Hebrew | 600 | 1.1rem |
| Instrucciones | Sistema (ui-font) | 400 | 0.85rem |
| Fuentes/variantes | Sistema (ui-font) | 400 | 0.8rem |

---

## Clases CSS — Reutilizar exactas del siddur

```css
/* Texto principal del tehilim */
.prayer-text {
  font-family: 'Noto Serif Hebrew', serif;
  font-weight: 400;
  font-style: normal;
  line-height: 2.2;
  direction: rtl;
  text-align: justify;
}

/* Título del mizmor: מזמור א׳, לדוד וכו׳ */
.prayer-title {
  font-family: 'Noto Serif Hebrew', serif;
  font-weight: 600;
  text-align: center;
  margin: 1.5rem 0 0.5rem;
  direction: rtl;
}

/* Instrucciones del Ben Ish Hai o rubricas */
.instruction {
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--muted-color);
  direction: rtl;
  margin: 0.4rem 0;
}

/* Instrucción física dentro del texto (span) */
.inline-instruction {
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  font-style: italic;
  color: var(--muted-color);
}

/* Referencia bíblica o variante textual (span) */
.source-ref {
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
  color: var(--muted-color);
  opacity: 0.75;
}

/* Kavana / leshem yichud — preparación */
.kavana {
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  color: var(--muted-color);
  text-align: center;
  font-style: italic;
  direction: rtl;
}
```

---

## Estructura HTML de un Mizmor

```html
<div class="prayer-block">
  
  <!-- Número y título del mizmor -->
  <div class="prayer-title">מִזְמ֥וֹר א׳</div>

  <!-- Encabezado bíblico si existe -->
  <div class="prayer-title">לְדָוִ֗ד</div>

  <!-- Instrucción opcional (Ben Ish Hai) -->
  <div class="instruction">יש לאומרו בכוונה (בא"ח ...)</div>

  <!-- Texto del mizmor -->
  <div class="prayer-text">
    אַשְׁרֵ֥י הָאִ֗ישׁ אֲשֶׁ֤ר ׀ לֹ֥א הָלַךְ֮ 
    <!-- instruccion fisica inline si hay -->
    <span class="inline-instruction">יפסיק מעט</span>
    בַּעֲצַ֪ת רְשָׁ֫עִים...
    <!-- variante textual -->
    כתיב <span class="source-ref">[כתיב: פלוני]</span>
  </div>

</div>
```

---

## Convenciones de Contenido

### Numeración de mizmorim
- Usar numerales hebreos: א׳, ב׳, ג׳...
- Título: `<div class="prayer-title">מִזְמ֥וֹר א׳</div>`

### Referencias bíblicas inline
- Formato: `(תהילים א׳:א׳-ב׳)` → envolver en `<span class="source-ref">`

### Variantes textuales (כתיב/קרי)
- Forma: `כתיב [נוסח אחר]` → el corchete en `source-ref`

### Instrucciones físicas dentro del texto
- Ejemplos: יפסיק מעט, יגביה קולו → `<span class="inline-instruction">`

### Instrucciones del Ben Ish Hai
- Siempre en `<div class="instruction">` separado, antes o después del texto
- Incluir referencia: `(בא"ח שם ה"X)`

---

## Paleta de colores (usar variables del siddur)

```css
:root {
  --text-color: #1a1a1a;
  --muted-color: #888;
  --accent-color: #b8973a;   /* dorado del siddur */
  --bg-color: #fafaf8;
  --border-color: #e0ddd6;
}
```

---

## Navegación entre mizmorim

El siddur usa un sistema de navegación con flechas arriba/abajo que aparecen al hacer scroll hacia atrás. Para tehilim se recomienda el mismo patrón más:
- Barra inferior fija con: ◀ mizmor anterior | nombre actual | mizmor siguiente ▶
- Índice de los 150 mizmorim accesible desde el título principal

---

## Notas de implementación Hugo

- Cada mizmor puede ser una página separada: `/tehilim/001/`, `/tehilim/002/`...
- O todos en un `_index.md` por libro (alef-bet, gimel-vav, etc.)
- Usar el mismo tema `minisiddur`
- Mismos archivos CSS — no crear CSS nuevo, extender `site.css`

---

## Lo que NO hacer

- No usar `<strong>` ni `<em>` directamente — usar las clases
- No centrar el texto de tehilim (solo títulos)
- No añadir numeración de versículos como elementos separados — mantenerlos inline como `source-ref` si es necesario
- No usar fuentes distintas a Noto Serif Hebrew para el texto principal
