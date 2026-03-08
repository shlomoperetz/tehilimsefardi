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
  loadViewState();
  if (localStorage.getItem('cantil') === '0') {
    document.body.classList.add('cantil-off');
    document.getElementById('btnCantil')?.classList.add('active');
  }
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


// === VISTA: he / tr / es — min1, max2 ===
let viewState = { he: true, tr: false, es: true };
let viewHistory = ['he', 'es'];

function toggleView(key) {
  const active = Object.keys(viewState).filter(k => viewState[k]);
  if (viewState[key]) {
    if (active.length === 1) return; // no se puede desactivar el último
    viewState[key] = false;
    viewHistory = viewHistory.filter(k => k !== key);
  } else {
    if (active.length >= 2) {
      const oldest = viewHistory.shift();
      viewState[oldest] = false;
    }
    viewState[key] = true;
    viewHistory.push(key);
  }
  applyViewState();
  saveViewState();
}

function applyViewState() {
  const active = Object.keys(viewState).filter(k => viewState[k]);
  const isTwoCol = active.length === 2;
  const container = document.getElementById('tehilimVerses');

  // Botones
  document.getElementById('btnHe')?.classList.toggle('active', viewState.he);
  document.getElementById('btnTranslit')?.classList.toggle('active', viewState.tr);
  document.getElementById('btnEs')?.classList.toggle('active', viewState.es);

  // Cantilaciones: visible solo si hebreo activo
  const btnCantil = document.getElementById('btnCantil');
  if (btnCantil) btnCantil.style.display = viewState.he ? '' : 'none';

  // Visibilidad de elementos
  document.querySelectorAll('.verse-he').forEach(el =>
    el.style.display = viewState.he ? '' : 'none');
  document.querySelectorAll('.verse-translit').forEach(el =>
    el.style.display = viewState.tr ? '' : 'none');
  document.querySelectorAll('.verse-es').forEach(el =>
    el.style.display = viewState.es ? '' : 'none');

  // Layout
  if (!container) return;
  container.classList.toggle('two-col', isTwoCol);
  // data-layout para CSS: he-es, he-tr, tr-es
  container.dataset.layout = active.sort((a,b) =>
    ['he','tr','es'].indexOf(a) - ['he','tr','es'].indexOf(b)).join('-');
}

function saveViewState() {
  localStorage.setItem('viewState', JSON.stringify(viewState));
  localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
}

function loadViewState() {
  const saved = localStorage.getItem('viewState');
  const savedH = localStorage.getItem('viewHistory');
  if (saved) {
    viewState = JSON.parse(saved);
    viewHistory = savedH ? JSON.parse(savedH) : Object.keys(viewState).filter(k => viewState[k]);
  }
  applyViewState();
}

// === CANTILACIONES ===
function toggleCantil() {
  const btn = document.getElementById('btnCantil');
  const isOff = document.body.classList.toggle('cantil-off');
  btn?.classList.toggle('active', isOff);
  localStorage.setItem('cantil', isOff ? '0' : '1');
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
  loadViewState();
  if (localStorage.getItem('cantil') === '0') {
    document.body.classList.add('cantil-off');
    document.getElementById('btnCantil')?.classList.add('active');
  }

  const fs = localStorage.getItem('fontSize');
  if (fs) document.documentElement.style.setProperty('--font', fs + 'px');

});
