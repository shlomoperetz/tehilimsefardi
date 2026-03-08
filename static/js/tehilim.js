// ===== TEHILIM.JS =====

function toggleDarkMode() {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark-mode');
  root.classList.toggle('dark-mode', !isDark);
  root.classList.toggle('light-mode', isDark);
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function adjustFont(delta) {
  const root = document.documentElement;
  const current = parseFloat(getComputedStyle(root).getPropertyValue('--font')) || 22;
  const next = Math.min(Math.max(current + delta * 2, 14), 40);
  root.style.setProperty('--font', next + 'px');
  localStorage.setItem('fontSize', next);
}

// Toggle cantilaciones
function toggleCantil() {
  const btn = document.getElementById('translitBtn');
  const on  = document.querySelectorAll('.cantil-on');
  const off = document.querySelectorAll('.cantil-off');
  const showing = on[0] && on[0].style.display !== 'none';
  on.forEach(el  => el.style.display = showing ? 'none' : '');
  off.forEach(el => el.style.display = showing ? '' : 'none');
  btn.classList.toggle('active', showing);
  localStorage.setItem('cantil', showing ? '0' : '1');
}

// Toggle transliteración
function toggleTranslit() {
  const els = document.querySelectorAll('.verse-translit');
  if (!els.length) return;
  const showing = els[0].style.display !== 'none';
  els.forEach(el => el.style.display = showing ? 'none' : 'block');
  localStorage.setItem('translit', showing ? '0' : '1');
}

// Toggle español
function toggleEs() {
  const els = document.querySelectorAll('.verse-es');
  if (!els.length) return;
  const showing = els[0].style.display !== 'none';
  els.forEach(el => el.style.display = showing ? 'none' : 'block');
  localStorage.setItem('showEs', showing ? '0' : '1');
}

// Búsqueda
let searchIndex = [];

async function loadSearchIndex() {
  try {
    const res = await fetch('/index.json');
    searchIndex = await res.json();
  } catch(e) { searchIndex = []; }
}

function openSearch() {
  document.getElementById('searchOverlay').style.display = 'block';
  document.getElementById('searchPanel').style.display = 'block';
  document.getElementById('searchInput').focus();
  if (!searchIndex.length) loadSearchIndex();
}

function closeSearch() {
  document.getElementById('searchOverlay').style.display = 'none';
  document.getElementById('searchPanel').style.display = 'none';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}

function doSearch(query) {
  const q = query.trim();
  const results = document.getElementById('searchResults');
  if (!q) { results.innerHTML = ''; return; }
  const num = parseInt(q);
  let hits = [];
  if (!isNaN(num)) {
    hits = searchIndex.filter(p => p.number === num);
  }
  if (!hits.length) {
    const ql = q.toLowerCase();
    hits = searchIndex.filter(p =>
      (p.title && p.title.toLowerCase().includes(ql)) ||
      (p.categories && p.categories.some(c => c.toLowerCase().includes(ql))) ||
      (p.content && p.content.toLowerCase().includes(ql))
    ).slice(0, 10);
  }
  if (!hits.length) {
    results.innerHTML = '<div style="padding:1em;color:var(--muted);text-align:center">לא נמצא</div>';
    return;
  }
  results.innerHTML = hits.map(p => `
    <div class="search-result-item" onclick="location.href='${p.permalink}'">
      <span style="color:#d4af37;font-weight:700;margin-inline-end:8px">${p.number || ''}</span>
      <span>${p.title || ''}</span>
    </div>
  `).join('');
}

// Restaurar preferencias
(function init() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark')  document.documentElement.classList.add('dark-mode');
  if (theme === 'light') document.documentElement.classList.add('light-mode');

  const fontSize = localStorage.getItem('fontSize');
  if (fontSize) document.documentElement.style.setProperty('--font', fontSize + 'px');

  if (localStorage.getItem('cantil') === '0') toggleCantil();
  if (localStorage.getItem('translit') === '1') toggleTranslit();
  if (localStorage.getItem('showEs') === '1') toggleEs();
})();

function updateThemeIcon() {
  const dark = document.documentElement.classList.contains('dark-mode');
  const sun  = document.getElementById('iconSun');
  const moon = document.getElementById('iconMoon');
  if (sun)  sun.style.display  = dark ? '' : 'none';
  if (moon) moon.style.display = dark ? 'none' : '';
}

// Sobreescribir toggleDarkMode para actualizar icono
const _toggleDark = toggleDarkMode;
function toggleDarkMode() {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark-mode');
  root.classList.toggle('dark-mode', !isDark);
  root.classList.toggle('light-mode', isDark);
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  updateThemeIcon();
}

document.addEventListener('DOMContentLoaded', () => {
  updateThemeIcon();
  // Marcar botones activos según estado guardado
  if (localStorage.getItem('cantil') === '0')
    document.getElementById('btnCantil')?.classList.add('active');
  if (localStorage.getItem('translit') === '1')
    document.getElementById('btnTranslit')?.classList.add('active');
  if (localStorage.getItem('showEs') === '1')
    document.getElementById('btnEs')?.classList.add('active');
});

// ===== TOGGLE HEBREO =====
function toggleHe() {
  const btn = document.getElementById('btnHe');
  const verses = document.querySelectorAll('.verse-he');
  const hidden = verses.length && verses[0].style.display === 'none';
  verses.forEach(el => el.style.display = hidden ? '' : 'none');
  btn?.classList.toggle('active', !hidden);
  localStorage.setItem('showHe', hidden ? '1' : '0');
}

// ===== TOGGLE DOS COLUMNAS =====
function toggleCols() {
  const btn = document.getElementById('btnCols');
  const container = document.getElementById('tehilimVerses');
  if (!container) return;
  const isTwo = container.classList.toggle('two-col');
  btn?.classList.toggle('active', isTwo);
  localStorage.setItem('twoCols', isTwo ? '1' : '0');
}

// ===== RESTAURAR ESTADO AL CARGAR =====
document.addEventListener('DOMContentLoaded', () => {
  // Hebreo
  if (localStorage.getItem('showHe') === '0') {
    document.querySelectorAll('.verse-he').forEach(el => el.style.display = 'none');
    document.getElementById('btnHe')?.classList.add('active');
  }
  // Dos columnas
  if (localStorage.getItem('twoCols') === '1') {
    const container = document.getElementById('tehilimVerses');
    if (container) {
      container.classList.add('two-col');
      document.getElementById('btnCols')?.classList.add('active');
    }
  }
});

// ===== FONT POPOVER =====
function toggleFontMenu() {
  document.querySelector('.font-popover')?.classList.toggle('open');
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.font-popover-wrap')) {
    document.querySelector('.font-popover')?.classList.remove('open');
  }
});

// ===== TOGGLE HEBREO: añade clase he-hidden al body =====
const _toggleHe2 = toggleHe;
function toggleHe() {
  const btn = document.getElementById('btnHe');
  const verses = document.querySelectorAll('.verse-he');
  const hidden = verses.length && verses[0].style.display === 'none';
  verses.forEach(el => el.style.display = hidden ? '' : 'none');
  document.body.classList.toggle('he-hidden', !hidden);
  btn?.classList.toggle('active', !hidden);
  localStorage.setItem('showHe', hidden ? '1' : '0');
}

// ===== RESTAURAR ESTADOS =====
document.addEventListener('DOMContentLoaded', () => {
  const cantil = localStorage.getItem('cantil');
  const translit = localStorage.getItem('translit');
  const showEs = localStorage.getItem('showEs');
  const twoCols = localStorage.getItem('twoCols');
  const showHe = localStorage.getItem('showHe');

  // Hebreo oculto
  if (showHe === '0') {
    document.querySelectorAll('.verse-he').forEach(el => el.style.display = 'none');
    document.getElementById('btnHe')?.classList.add('active');
    document.body.classList.add('he-hidden');
  } else {
    document.getElementById('btnHe')?.classList.remove('active');
  }

  // Cantilaciones: activo = sin cantilaciones (plain)
  if (cantil === '0') {
    document.getElementById('btnCantil')?.classList.add('active');
  }

  // Transliteración
  if (translit === '1') {
    document.getElementById('btnTranslit')?.classList.add('active');
    document.querySelectorAll('.verse-translit').forEach(el => el.style.display = '');
  }

  // Español
  if (showEs === '1') {
    document.getElementById('btnEs')?.classList.add('active');
    document.querySelectorAll('.verse-es').forEach(el => el.style.display = '');
  }

  // Dos columnas
  if (twoCols === '1') {
    const container = document.getElementById('tehilimVerses');
    if (container) container.classList.add('two-col');
    document.getElementById('btnCols')?.classList.add('active');
  }
});

// Protección: si se oculta hebreo y no hay ES visible, mostrar ES automáticamente
function safeToggleHe() {
  const btn = document.getElementById('btnHe');
  const verses = document.querySelectorAll('.verse-he');
  const isVisible = verses.length && verses[0].style.display !== 'none';

  if (isVisible) {
    // Verificar que haya al menos otra cosa visible
    const esVisible = document.querySelectorAll('.verse-es')[0]?.style.display !== 'none';
    const trVisible = document.querySelectorAll('.verse-translit')[0]?.style.display !== 'none';
    if (!esVisible && !trVisible) {
      // Activar ES automáticamente
      document.querySelectorAll('.verse-es').forEach(el => el.style.display = '');
      document.getElementById('btnEs')?.classList.add('active');
      localStorage.setItem('showEs', '1');
    }
    verses.forEach(el => el.style.display = 'none');
    document.body.classList.add('he-hidden');
    btn?.classList.add('active');
    localStorage.setItem('showHe', '0');
  } else {
    verses.forEach(el => el.style.display = '');
    document.body.classList.remove('he-hidden');
    btn?.classList.remove('active');
    localStorage.setItem('showHe', '1');
  }
}
// Reemplazar toggleHe
window.toggleHe = safeToggleHe;
