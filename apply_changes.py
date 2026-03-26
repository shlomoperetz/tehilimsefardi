#!/usr/bin/env python3
"""
Aplica 3 cambios al proyecto tehilimsefardi:
  A) layouts/index.json  — añade campo ocasiones al índice de búsqueda
  B) themes/minithilim/layouts/_default/single.html — muestra ocasiones como tags
  C) layouts/categories/list.html + content/categories/_index.md — página de categorías
"""

import os
from pathlib import Path

ROOT = Path(os.environ.get("PROJECT", "."))

# ── A) layouts/index.json ──────────────────────────────────────────────────

INDEX_JSON = """\
{{- $psalms := .Site.Data.tehilim -}}
{{- $keys := slice -}}
{{- range $k, $v := $psalms }}{{ $keys = $keys | append $k }}{{ end -}}
{{- $sorted := sort $keys -}}
[
{{- range $i, $k := $sorted -}}
{{- $p := index $psalms $k -}}
{{- if $i }},{{ end }}
{"number":{{ $p.number }},"url":"/tehilim/{{ $k }}/","title_he":{{ $p.title_he | jsonify }},"title_es":{{ $p.title_es | jsonify }},"ocasiones":{{ $p.ocasiones | jsonify }},"translit":{{ if $p.verses }}{{ with index $p.verses 0 }}{{ .translit | jsonify }}{{ else }}""{{ end }}{{ else }}""{{ end }},"es_preview":{{ if $p.verses }}{{ with index $p.verses 0 }}{{ .es | jsonify }}{{ else }}""{{ end }}{{ else }}""{{ end }}}
{{- end }}
]
"""

# ── B) single.html — añadir tags de ocasiones debajo del número ────────────

SINGLE_HTML = """\
{{ define "main" }}
{{ $num := printf "%03d" .Params.number }}
{{ $data := index .Site.Data.tehilim $num }}
<article class="card tehilim-single" data-page>
  <div class="tehilim-header psalm-header">
    <div class="psalm-number">{{ .Params.number }}</div>
    {{ if $data }}{{ with $data.ocasiones }}{{ if . }}
    <div class="psalm-ocasiones">
      {{ range . }}<span class="ocasion-tag">{{ . }}</span>{{ end }}
    </div>
    {{ end }}{{ end }}{{ end }}
  </div>
  {{ if $data }}
  <div class="tehilim-verses" id="tehilimVerses">
    {{ range $data.verses }}
    <div class="verse" id="v{{ .num }}">
      <div class="verse-he cantil-on"><sup class="verse-num">{{ .num }}</sup>{{ .he | safeHTML }}</div>
      <div class="verse-he cantil-off" style="display:none"><sup class="verse-num">{{ .num }}</sup>{{ .he_plain }}</div>
      {{ if .translit }}
      <div class="verse-translit" style="display:none"><sup class="verse-num">{{ .num }}</sup>{{ .translit }}</div>
      {{ end }}
      {{ if .es }}
      <div class="verse-es" style="display:none"><sup class="verse-num-es">{{ .num }}</sup>{{ .es }}</div>
      {{ end }}
    </div>
    {{ end }}
  </div>
  {{ end }}
  <nav class="tehilim-nav">
    {{ with .PrevInSection }}
    <a href="{{ .Permalink }}" class="nav-prev" data-num="{{ .Params.number }}">← Salmo {{ .Params.number }}</a>
    {{ end }}
    <a href="/tehilim/" class="nav-list">Todos los salmos</a>
    {{ with .NextInSection }}
    <a href="{{ .Permalink }}" class="nav-next" data-num="{{ .Params.number }}">Salmo {{ .Params.number }} →</a>
    {{ end }}
  </nav>
</article>
{{ end }}
"""

# ── C) categories layout ───────────────────────────────────────────────────

# Orden deseado para las categorías (el resto va al final alfabéticamente)
CATEGORIES_HTML = """\
{{ define "main" }}
{{/* Agrupar salmos por ocasión desde data/tehilim */}}
{{- $groups := dict -}}
{{- $order := slice
    "Pesukei deZimra (diario)"
    "Kabalat Shabat"
    "Shir shel Yom (domingo)"
    "Shir shel Yom (lunes)"
    "Shir shel Yom (martes)"
    "Shir shel Yom (miércoles)"
    "Shir shel Yom (jueves)"
    "Shir shel Yom (viernes)"
    "Shir shel Yom (Shabat)"
    "Pesukei deZimra (Shabat)"
    "Hallel"
    "Rosh Jodesh"
    "Elul"
    "Yamim Noraim"
    "Yom Kipur"
    "Salmos penitenciales"
    "Duelo"
    "Enfermedad"
    "Viaje"
    "Boda"
-}}
{{- range $k, $v := .Site.Data.tehilim -}}
  {{- range $v.ocasiones -}}
    {{- $oc := . -}}
    {{- $existing := index $groups $oc | default slice -}}
    {{- $groups = merge $groups (dict $oc ($existing | append $v)) -}}
  {{- end -}}
{{- end -}}

<div class="card categories-page">
  <h1 class="categories-title">Salmos por ocasión</h1>
  <p class="categories-desc">Clasificación según el Siddur Sefardí y la tradición halájica</p>

  {{/* Primero las categorías en orden definido */}}
  {{- range $oc := $order -}}
    {{- $psalms := index $groups $oc -}}
    {{- if $psalms }}
  <section class="category-group">
    <h2 class="category-name">{{ $oc }}</h2>
    <div class="category-psalms">
      {{- range sort $psalms "number" -}}
      {{- $key := printf "%03d" .number -}}
      <a href="/tehilim/{{ $key }}/" class="category-psalm-item">
        <span class="cat-num">{{ .number }}</span>
        <span class="cat-title">{{ .title_es | default .title_he }}</span>
      </a>
      {{- end }}
    </div>
  </section>
    {{- end -}}
  {{- end -}}

  {{/* Luego cualquier ocasión no prevista en el orden */}}
  {{- range $oc, $psalms := $groups -}}
    {{- if not (in $order $oc) }}
  <section class="category-group">
    <h2 class="category-name">{{ $oc }}</h2>
    <div class="category-psalms">
      {{- range sort $psalms "number" -}}
      {{- $key := printf "%03d" .number -}}
      <a href="/tehilim/{{ $key }}/" class="category-psalm-item">
        <span class="cat-num">{{ .number }}</span>
        <span class="cat-title">{{ .title_es | default .title_he }}</span>
      </a>
      {{- end }}
    </div>
  </section>
    {{- end -}}
  {{- end }}

</div>
{{ end }}
"""

CATEGORIES_INDEX_MD = """\
---
title: "Salmos por ocasión"
description: "Tehilim clasificados según el Siddur Sefardí: Kabalat Shabat, Hallel, Yamim Noraim, duelo, enfermedad y más."
layout: "list"
---
"""

# ── ESCRIBIR ARCHIVOS ──────────────────────────────────────────────────────

files = {
    ROOT / "layouts/index.json": INDEX_JSON,
    ROOT / "themes/minithilim/layouts/_default/single.html": SINGLE_HTML,
    ROOT / "layouts/categories/list.html": CATEGORIES_HTML,
    ROOT / "content/categories/_index.md": CATEGORIES_INDEX_MD,
}

for path, content in files.items():
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"✅ {path}")

print("\nListo. Ejecuta: hugo --minify")
