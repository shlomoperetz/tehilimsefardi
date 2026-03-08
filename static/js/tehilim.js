// ===== TEHILIM.JS =====

// Dark mode (heredado del siddur)
function toggleDarkMode() {
  const root = document.documentElement;
  if (root.classList.contains('dark-mode')) {
    root.classList.remove('dark-mode');
    root.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  } else {
    root.classList.remove('light-mode');
    root.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }
}

// Font size
function adjustFont(delta) {
  const root = document.documentElement;
  const current = parseFloat(getComputedStyle(root).getPropertyValue('--font')) || 22;
  const next = Math.min(Math.max(current + delta * 2, 14), 40);
  root.style.setProperty('--font', next + 'px');
  localStorage.setItem('fontSize', next);
}

// Transliteración sefaradí
function toggleTranslit() {
  const btn = document.getElementById('translitBtn');
  const block = document.getElementById('translitBlock');
  if (!block) return;
  const visible = block.style.display !== 'none';
  block.style.display = visible ? 'none' : 'block';
  btn.classList.toggle('active', !visible);
  localStorage.setItem('translit', !visible ? '1' : '0');
}

// Búsqueda
let searchIndex = [];

async function loadSearchIndex() {
  try {
    const res = await fetch('/index.json');
    searchIndex = await res.json();
  } catch(e) {
    searchIndex = [];
  }
}

function openSearch() {
  document.getElementById('searchOverlay').style.display = 'block';
  document.getElementById('searchPanel').style.display = 'block';
  document.getElementById('searchInput').focus();
  if (searchIndex.length === 0) loadSearchIndex();
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

  // Buscar por número
  const num = parseInt(q);
  let hits = [];
  if (!isNaN(num)) {
    hits = searchIndex.filter(p => p.number === num);
  }
  // Buscar por texto/título
  if (hits.length === 0) {
    const ql = q.toLowerCase();
    hits = searchIndex.filter(p =>
      (p.title && p.title.toLowerCase().includes(ql)) ||
      (p.categories && p.categories.some(c => c.toLowerCase().includes(ql))) ||
      (p.content && p.content.toLowerCase().includes(ql))
    ).slice(0, 10);
  }

  if (hits.length === 0) {
    results.innerHTML = '<div style="padding:1em;color:var(--muted);text-align:center">לא נמצא</div>';
    return;
  }

  results.innerHTML = hits.map(p => `
    <div class="search-result-item" onclick="location.href='${p.permalink}'">
      <span style="color:#d4af37;font-weight:700;margin-inline-end:8px">${p.number || ''}</span>
      <span>${p.title || ''}</span>
      ${p.categories ? `<span style="font-size:0.7em;color:var(--muted);margin-inline-start:8px">${p.categories.join(', ')}</span>` : ''}
    </div>
  `).join('');
}

// Modo lectura completa (fullscreen)
function toggleReadingMode() {
  document.body.classList.toggle('reading-mode');
}

// Restaurar preferencias al cargar
(function init() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.documentElement.classList.add('dark-mode');
  if (theme === 'light') document.documentElement.classList.add('light-mode');

  const fontSize = localStorage.getItem('fontSize');
  if (fontSize) document.documentElement.style.setProperty('--font', fontSize + 'px');

  const translit = localStorage.getItem('translit');
  if (translit === '1') {
    const block = document.getElementById('translitBlock');
    const btn = document.getElementById('translitBtn');
    if (block) { block.style.display = 'block'; btn?.classList.add('active'); }
  }
})();
