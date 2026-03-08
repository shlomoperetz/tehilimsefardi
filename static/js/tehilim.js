
// ============================================
// TEHILIM.JS — versión limpia
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

// === CANTILACIONES ===
function toggleCantil() {
  const btn = document.getElementById('btnCantil');
  const isOff = document.body.classList.contains('cantil-off');
  document.body.classList.toggle('cantil-off', !isOff);
  btn?.classList.toggle('active', !isOff);
  localStorage.setItem('cantil', isOff ? '1' : '0');
}

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

// === HEBREO ===
function toggleHe() {
  const btn = document.getElementById('btnHe');
  const els = document.querySelectorAll('.verse-he');
  const isVisible = els.length && els[0].style.display !== 'none';

  if (isVisible) {
    // Si no hay nada más visible, activar ES primero
    const esVis = [...document.querySelectorAll('.verse-es')].some(el => el.style.display !== 'none');
    const trVis = [...document.querySelectorAll('.verse-translit')].some(el => el.style.display !== 'none');
    if (!esVis && !trVis) {
      document.querySelectorAll('.verse-es').forEach(el => el.style.display = '');
      document.getElementById('btnEs')?.classList.add('active');
      localStorage.setItem('showEs', '1');
    }
    els.forEach(el => el.style.display = 'none');
    document.body.classList.add('he-hidden');
    btn?.classList.add('active');
    localStorage.setItem('showHe', '0');
  } else {
    // Restaurar hebreo — CSS maneja cantilaciones via body.cantil-off
    document.querySelectorAll('.verse-he').forEach(el => el.style.display = '');
    document.body.classList.remove('he-hidden');
    btn?.classList.remove('active');
    localStorage.setItem('showHe', '1');
  }
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
  // Tema
  updateThemeIcon();

  // Fuente
  const fs = localStorage.getItem('fontSize');
  if (fs) document.documentElement.style.setProperty('--font', fs + 'px');

  // Cantilaciones (por defecto ON)
  if (localStorage.getItem('cantil') === '0') {
    document.body.classList.add('cantil-off');
    document.getElementById('btnCantil')?.classList.add('active');
  }

  // Transliteración (por defecto OFF)
  if (localStorage.getItem('translit') === '1') {
    document.querySelectorAll('.verse-translit').forEach(el => el.style.display = '');
    document.getElementById('btnTranslit')?.classList.add('active');
  }

  // Español (por defecto OFF)
  if (localStorage.getItem('showEs') === '1') {
    document.querySelectorAll('.verse-es').forEach(el => el.style.display = '');
    document.getElementById('btnEs')?.classList.add('active');
  }

  // Hebreo (por defecto ON)
  if (localStorage.getItem('showHe') === '0') {
    document.querySelectorAll('.verse-he').forEach(el => el.style.display = 'none');
    document.body.classList.add('he-hidden');
    document.getElementById('btnHe')?.classList.add('active');
  }

  // Dos columnas (por defecto OFF)
  if (localStorage.getItem('twoCols') === '1') {
    document.getElementById('tehilimVerses')?.classList.add('two-col');
    document.getElementById('btnCols')?.classList.add('active');
  }
});
