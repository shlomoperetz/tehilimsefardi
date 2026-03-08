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

// === VISTA: he / tr / es ===
// min 1 activo, max 2 activos
var viewState   = { he: true, tr: false, es: true };
var viewHistory = ['he', 'es'];
var forceSingle = false;

function toggleView(key) {
  var active = Object.keys(viewState).filter(function(k){ return viewState[k]; });
  if (viewState[key]) {
    if (active.length === 1) return;
    viewState[key] = false;
    viewHistory = viewHistory.filter(function(k){ return k !== key; });
  } else {
    if (active.length >= 2) {
      var oldest = viewHistory.shift();
      viewState[oldest] = false;
    }
    viewState[key] = true;
    viewHistory.push(key);
  }
  applyView();
  saveView();
}

function toggleCols() {
  forceSingle = !forceSingle;
  localStorage.setItem('forceSingle', forceSingle ? '1' : '0');
  applyView();
}

function toggleCantil() {
  var isOff = document.body.classList.toggle('cantil-off');
  var btn = document.getElementById('btnCantil');
  if (btn) btn.classList.toggle('active', isOff);
  localStorage.setItem('cantil', isOff ? '0' : '1');
}

function applyView() {
  var active = Object.keys(viewState).filter(function(k){ return viewState[k]; });
  var isTwoCol = active.length === 2 && !forceSingle;
  var container = document.getElementById('tehilimVerses');

  // Botones activos
  var btnHe = document.getElementById('btnHe');
  var btnTr = document.getElementById('btnTranslit');
  var btnEs = document.getElementById('btnEs');
  var btnCols = document.getElementById('btnCols');
  var btnCantil = document.getElementById('btnCantil');

  if (btnHe) btnHe.classList.toggle('active', viewState.he);
  if (btnTr) btnTr.classList.toggle('active', viewState.tr);
  if (btnEs) btnEs.classList.toggle('active', viewState.es);
  if (btnCols) btnCols.classList.toggle('active', isTwoCol);
  if (btnCantil) btnCantil.style.display = viewState.he ? '' : 'none';

  // Mostrar/ocultar elementos
  document.querySelectorAll('.verse-he').forEach(function(el){
    el.style.display = viewState.he ? '' : 'none';
  });
  document.querySelectorAll('.verse-translit').forEach(function(el){
    el.style.display = viewState.tr ? '' : 'none';
  });
  document.querySelectorAll('.verse-es').forEach(function(el){
    el.style.display = viewState.es ? '' : 'none';
  });

  if (!container) return;

  // Layout
  container.classList.toggle('two-col', isTwoCol);
  var layout = active.sort(function(a,b){
    return ['he','tr','es'].indexOf(a) - ['he','tr','es'].indexOf(b);
  }).join('-');
  container.dataset.layout = layout;
}

function saveView() {
  localStorage.setItem('viewState', JSON.stringify(viewState));
  localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
}

function loadView() {
  var saved = localStorage.getItem('viewState');
  var savedH = localStorage.getItem('viewHistory');
  forceSingle = localStorage.getItem('forceSingle') === '1';
  if (saved) {
    try {
      viewState = JSON.parse(saved);
      viewHistory = savedH ? JSON.parse(savedH) : Object.keys(viewState).filter(function(k){ return viewState[k]; });
    } catch(e) {}
  }
  if (localStorage.getItem('cantil') === '0') {
    document.body.classList.add('cantil-off');
    var btn = document.getElementById('btnCantil');
    if (btn) btn.classList.add('active');
  }
  applyView();
}

// === BÚSQUEDA ===
var searchIndex = null;
function loadSearchIndex() {
  if (searchIndex) return Promise.resolve();
  return fetch('/index.json').then(function(r){ return r.json(); }).then(function(d){ searchIndex = d; }).catch(function(){ searchIndex = []; });
}
function openSearch() {
  var overlay = document.getElementById('searchOverlay');
  var panel = document.getElementById('searchPanel');
  if (overlay) overlay.style.display = '';
  if (panel) panel.style.display = '';
  setTimeout(function(){ var i = document.getElementById('searchInput'); if(i) i.focus(); }, 50);
  loadSearchIndex();
}
function closeSearch() {
  var overlay = document.getElementById('searchOverlay');
  var panel = document.getElementById('searchPanel');
  if (overlay) overlay.style.display = 'none';
  if (panel) panel.style.display = 'none';
  var inp = document.getElementById('searchInput');
  if (inp) inp.value = '';
  var res = document.getElementById('searchResults');
  if (res) res.innerHTML = '';
}
function doSearch(q) {
  var res = document.getElementById('searchResults');
  if (!q || q.length < 1) { if(res) res.innerHTML = ''; return; }
  if (!searchIndex) { loadSearchIndex().then(function(){ doSearch(q); }); return; }
  var ql = q.toLowerCase();
  var hits = searchIndex.filter(function(p){
    return String(p.number) === q ||
      (p.title_es && p.title_es.toLowerCase().includes(ql)) ||
      (p.title_he && p.title_he.includes(q));
  }).slice(0, 10);
  if (res) res.innerHTML = hits.length
    ? hits.map(function(p){ return '<a class="search-result-item" href="' + p.url + '"><span class="search-result-num">' + p.number + '</span><span class="search-result-title">' + (p.title_es || p.title_he || '') + '</span></a>'; }).join('')
    : '<div style="padding:14px 16px;font-size:0.85em;opacity:0.5;font-family:var(--ui-font)">Sin resultados</div>';
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

// === INIT ===
document.addEventListener('DOMContentLoaded', function() {
  updateThemeIcon();
  var fs = localStorage.getItem('fontSize');
  if (fs) document.documentElement.style.setProperty('--font', fs + 'px');
  loadView();
});
