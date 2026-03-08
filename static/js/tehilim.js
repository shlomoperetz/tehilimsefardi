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
