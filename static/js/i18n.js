const STRINGS = {
  he: {
    home: "בַּיִת", psalms: "תְּהִלִּים", topics: "נוֹשְׂאִים",
    search_placeholder: "חפש מזמור...",
    nav_list: "כָּל הַמְּזָמוֹרִים",
    prev: "מזמור", next: "מזמור",
    read: "קְרָא תְּהִלִּים",
    landing_title: "תְּהִלִּים סְפָרַדִי",
    subtitle: "נֻסַח סְפָרַד · מִזְמוֹרֵי דָּוִד",
    landing_all: "כָּל הַמְּזָמוֹרִים",
    landing_topics: "לְפִי נוֹשֵׂא",
    not_found: "לא נמצא",
    title_cantil: "ניקוד וטעמים",
    title_translit: "תעתיק ספרדי",
    title_es: "תרגום",
  },
  es: {
    home: "Inicio", psalms: "Salmos", topics: "Temas",
    search_placeholder: "Buscar salmo por número o tema...",
    nav_list: "Todos los salmos",
    prev: "Salmo", next: "Salmo",
    read: "Leer Tehilim",
    landing_title: "Tehilim Sefardí",
    subtitle: "Nusaj Sefardí · Salmos de David",
    landing_all: "Todos los salmos",
    landing_topics: "Por tema",
    not_found: "No encontrado",
    title_cantil: "Cantilaciones",
    title_translit: "Transliteración",
    title_es: "Traducción",
  }
};

let currentLang = localStorage.getItem('ui_lang') || 'es';

function t(key) {
  return STRINGS[currentLang][key] || STRINGS['es'][key] || key;
}

function applyLang() {
  const set = (id, key) => { const el = document.getElementById(id); if (el) el.textContent = t(key); };
  const attr = (id, a, key) => { const el = document.getElementById(id); if (el) el[a] = t(key); };

  set('landing-title',      'landing_title');
  set('landing-subtitle',   'subtitle');
  set('landing-enter-text', 'read');
  set('landing-all',        'landing_all');
  set('landing-topics',     'landing_topics');
  set('nav-home',           'home');
  set('nav-psalms',         'psalms');
  set('nav-topics',         'topics');

  attr('searchInput', 'placeholder', 'search_placeholder');

  const bCantil   = document.getElementById('translitBtn');
  const bTranslit = document.getElementById('translBtn');
  const bEs       = document.getElementById('esBtn');
  if (bCantil)   bCantil.title   = t('title_cantil');
  if (bTranslit) bTranslit.title = t('title_translit');
  if (bEs)       bEs.title       = t('title_es');

  document.querySelectorAll('.nav-list').forEach(el => el.textContent = t('nav_list'));
  document.querySelectorAll('.nav-prev').forEach(el => {
    el.textContent = '← ' + t('prev') + ' ' + el.dataset.num;
  });
  document.querySelectorAll('.nav-next').forEach(el => {
    el.textContent = t('next') + ' ' + el.dataset.num + ' →';
  });

  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = currentLang === 'es' ? 'עב' : 'ES';

  // Fuente del título: hebreo = serif hebrea, español = sans elegante
  const title = document.getElementById('landing-title');
  if (title) {
    title.style.fontFamily = currentLang === 'he'
      ? '"Noto Serif Hebrew", serif'
      : '"Assistant", "Segoe UI", sans-serif';
    title.style.fontSize = currentLang === 'he' ? '2em' : '2.4em';
  }

  document.documentElement.lang = currentLang;
}

function toggleLang() {
  currentLang = currentLang === 'es' ? 'he' : 'es';
  localStorage.setItem('ui_lang', currentLang);
  applyLang();
}

document.addEventListener('DOMContentLoaded', applyLang);

// Actualizar títulos en la cuadrícula de salmos
function applyLangToGrid() {
  document.querySelectorAll('.tehilim-name[data-title-es]').forEach(el => {
    el.textContent = currentLang === 'he'
      ? el.dataset.titleHe
      : el.dataset.titleEs;
  });
}

// Sobreescribir applyLang para incluir grid
const _applyLang = applyLang;
document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  applyLangToGrid();
});

const _toggleLang = toggleLang;
function toggleLang() {
  currentLang = currentLang === 'es' ? 'he' : 'es';
  localStorage.setItem('ui_lang', currentLang);
  applyLang();
  applyLangToGrid();
}
