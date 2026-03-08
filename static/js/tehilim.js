// ============================================
// TEHILIM.JS
// ============================================

// === DARK MODE ===
function toggleDarkMode() {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark-mode');
  root.classList.toggle('dark-mode', !isDark);
  root.classList.toggle('light-mode', isDark);
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  updateThemeIcon();
}
function updateThemeIcon() {
  const dark = document.documentElement.classList.contains('dark-mode');
  const sun  = document.getElementById('iconSun');
  const moon = document.getElementById('iconMoon');
  if (sun)  sun.style.display  = dark ? '' : 'none';
  if (moon) moon.style.display = dark ? 'none' : '';
}
(function initTheme() {
  const t = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = t ? t === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark-mode', dark);
  document.documentElement.classList.toggle('light-mode', !dark);
})();

// === FONT SIZE ===
function adjustFont(delta) {
  const root = document.documentElement;
  const current = parseInt(getComputedStyle(root).getPropertyValue('--font')) || 22;
  const next = Math.min(Math.max(current + delta * 2, 16), 36);
  root.style.setProperty('--font', next + 'px');
  localStorage.setItem('fontSize', next);
}
function toggleFontMenu() {
  document.querySelector('.font-popover')?.classList.toggle('open');
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.font-popover-wrap')) {
    document.querySelector('.font-popover')?.classList.remove('open');
  }
});

// === TRANSLITERACIÓN ===
function toggleTranslit() {
  const btn = document.getElementById('btnTranslit');
  const els = document.querySelectorAll('.verse-translit');
  const hidden = els.length && els[0].style.display === 'none';
  els.forEach(el => el.style.display = hidden ? '' : 'none');
  btn?.classList.toggle('active', hidden);
  localStorage.setItem('translit', hidden ? '1' : '0');
}

// === ESPAÑOL ===
function toggleEs() {
  const btn = document.getElementById('btnEs');
  const els = document.querySelectorAll('.verse-es');
  const hidden = els.length && els[0].style.display === 'none';
  els.forEach(el => el.style.display = hidden ? '' : 'none');
  btn?.classList.toggle('active', hidden);
  localStorage.setItem('showEs', hidden ? '1' : '0');
}

// === DOS COLUMNAS ===
function toggleCols() {
  const btn = document.getElementById('btnCols');
  const container = document.getElementById('tehilimVerses');
  if (!container) return;
  const isTwo = container.classList.toggle('two-col');
  btn?.classList.toggle('active', isTwo);
  localStorage.setItem('twoCols', isTwo ? '1' : '0');
}

// === BÚSQUEDA ===
let searchIndex = null;
async function loadSearchIndex() {
  if (searchIndex) return;
  try {
    const r = await fetch('/index.json');
    searchIndex = await r.json();
  } catch(e) { searchIndex = []; }
}
function openSearch() {
  document.getElementById('searchOverlay').style.display = '';
  document.getElementById('searchPanel').style.display = '';
  setTimeout(() => document.getElementById('searchInput')?.focus(), 50);
  loadSearchIndex();
}
function closeSearch() {
  document.getElementById('searchOverlay').style.display = 'none';
  document.getElementById('searchPanel').style.display = 'none';
  if (document.getElementById('searchInput'))
    document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}
function doSearch(q) {
  const res = document.getElementById('searchResults');
  if (!q || q.length < 1) { res.innerHTML = ''; return; }
  if (!searchIndex) { loadSearchIndex().then(() => doSearch(q)); return; }
  const ql = q.toLowerCase();
  const hits = searchIndex.filter(p =>
    String(p.number) === q ||
    (p.title_es && p.title_es.toLowerCase().includes(ql)) ||
    (p.title_he && p.title_he.includes(q))
  ).slice(0, 10);
  res.innerHTML = hits.length
    ? hits.map(p => `<a class="search-result-item" href="${p.url}">
        <span class="search-result-num">${p.number}</span>
        <span class="search-result-title">${p.title_es || p.title_he || ''}</span>
      </a>`).join('')
    : '<div style="padding:14px 16px;font-size:0.85em;opacity:0.5;font-family:var(--ui-font)">Sin resultados</div>';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

// === RESTAURAR ESTADOS AL CARGAR ===
document.addEventListener('DOMContentLoaded', () => {
  updateThemeIcon();

  const fs = localStorage.getItem('fontSize');
  if (fs) document.documentElement.style.setProperty('--font', fs + 'px');

  // Transliteración (por defecto OFF)
  if (localStorage.getItem('translit') === '1') {
    document.querySelectorAll('.verse-translit').forEach(el => el.style.display = '');
    document.getElementById('btnTranslit')?.classList.add('active');
  } else {
    document.querySelectorAll('.verse-translit').forEach(el => el.style.display = 'none');
  }

  // Español (por defecto ON)
  const showEs = localStorage.getItem('showEs');
  if (showEs === null || showEs === '1') {
    document.querySelectorAll('.verse-es').forEach(el => el.style.display = '');
    document.getElementById('btnEs')?.classList.add('active');
  } else {
    document.querySelectorAll('.verse-es').forEach(el => el.style.display = 'none');
  }

  // Dos columnas (por defecto ON)
  const twoCols = localStorage.getItem('twoCols');
  if (twoCols === null || twoCols === '1') {
    document.getElementById('tehilimVerses')?.classList.add('two-col');
    document.getElementById('btnCols')?.classList.add('active');
  }
});
