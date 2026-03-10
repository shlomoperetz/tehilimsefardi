const STRINGS = {
  en: {
    landing_title: "Tehilim Sefardi",
    landing_desc: "The Psalms of David in Hebrew, Sephardic transliteration and English",
    landing_search: "Search psalm...",
    search_placeholder: "Search psalm by number or theme...",
    tile_daily: "Today's Psalm",
    tile_topics: "Grief · Love · Protection",
    tile_topics_sub: "Psalms by theme",
    tile_all: "All Psalms",
    tile_all_sub: "Complete list",
    tile_start: "Begin from the start",
    tile_start_sub: "Blessed is the man...",
    landing_read: "Read the full psalm →",
    tile_topics_icon: "By occasion",
    tile_all_icon: "1 — 150",
    tile_start_icon: "Psalm 1",
    brand_title: "Tehilim Sefardi",
    brand_byline: "by Shlomo Peretz",
    nav_home: "Home",
    nav_list: "All Psalms",
    prev: "Psalm",
    next: "Psalm",
    view_he: "עב",
    view_tr: "tr",
    view_es: "EN",
  },
  he: {
    home: "בַּיִת",
    psalms: "תְּהִלִּים",
    topics: "נוֹשְׂאִים",
    search_placeholder: "חפש מזמור לפי מספר או נושא...",
    nav_home: "בַּיִת",
    nav_list: "תְּהִלִּים",
    prev: "מזמור", next: "מזמור",
    landing_title: "תְּהִלִּים סְפָרַדִי",
    landing_desc: "מִזְמוֹרֵי דָּוִד בְּעִבְרִית, תַּעְתִּיק סְפָרַדִי וְסְפָרַדִּית",
    landing_search: "חפש מזמור...",
    tile_daily: "מזמור היום",
    tile_topics: "אֵבֶל · אַהֲבָה · הֲגָנָה",
    tile_topics_sub: "מזמורים לפי נושא",
    tile_all: "כָּל הַמְּזָמוֹרִים",
    tile_all_sub: "רשימה מלאה",
    tile_start: "לְהַתְחִיל מֵהַהַתְחָלָה",
    tile_start_sub: "אַשְׁרֵי הָאִישׁ…",
    landing_read: "קְרָא אֶת הַמִּזְמוֹר הַמָּלֵא ←",
    tile_topics_icon: "לְפִי אוֹקָזְיָה",
    tile_all_icon: "1 — 150",
    tile_start_icon: "מזמור 1",
    brand_title: "תְּהִלִּים סְפָרַדִי",
    brand_byline: "מאת שלמה פרץ",
    not_found: "לא נמצא",
    title_cantil: "ניקוד וטעמים",
    title_translit: "תעתיק ספרדי",
    title_es: "תרגום",
  },
  es: {
    home: "Inicio",
    psalms: "Salmos",
    topics: "Temas",
    search_placeholder: "Buscar salmo por número o tema...",
    nav_list: "Todos los salmos",
    prev: "Salmo", next: "Salmo",
    landing_title: "Tehilim Sefardí",
    landing_desc: "Los Salmos de David en hebreo, transliteración sefaradí y español",
    landing_search: "Buscar salmo por número o tema…",
    tile_daily: "Salmo del día",
    tile_topics: "Duelo · Amor · Protección",
    tile_topics_sub: "Salmos por tema",
    tile_all: "Todos los salmos",
    tile_all_sub: "Lista completa",
    tile_start: "Empezar desde el principio",
    tile_start_sub: "Dichoso el hombre…",
    landing_read: "Leer el salmo completo →",
    tile_topics_icon: "Por ocasión",
    tile_all_icon: "1 — 150",
    tile_start_icon: "Salmo 1",
    brand_title: "Tehilim Sefardí",
    brand_byline: "by Shlomo Peretz",
    not_found: "No encontrado",
    title_cantil: "Cantilaciones",
    title_translit: "Transliteración",
    title_es: "Traducción",
  }
};

let currentLang = localStorage.getItem('ui_lang') || (() => {
  const bl = navigator.language || navigator.userLanguage || 'es';
  if (bl.startsWith('he')) return 'he';
  if (bl.startsWith('en')) return 'en';
  return 'es';
})();

function t(key) {
  return (STRINGS[currentLang] && STRINGS[currentLang][key]) || STRINGS['es'][key] || key;
}

function applyLang() {
  const set = (id, key) => { const el = document.getElementById(id); if (el) el.textContent = t(key); };
  const attr = (id, a, key) => { const el = document.getElementById(id); if (el) el[a] = t(key); };

  // Topbar / brand
  set('landing-title',          'landing_title');
  set('landing-desc',           'landing_desc');

  // Barra de búsqueda landing
  set('landing-search-placeholder', 'landing_search');
  attr('searchInput', 'placeholder', 'search_placeholder');

  // Tiles landing
  set('tile-daily',      'tile_daily');
  set('tile-topics',     'tile_topics');
  set('tile-topics-sub', 'tile_topics_sub');
  set('tile-all',        'tile_all');
  set('tile-all-sub',    'tile_all_sub');
  set('tile-start',      'tile_start');
  set('tile-start-sub',  'tile_start_sub');
  set('landing-read',    'landing_read');
  set('tile-topics-icon', 'tile_topics_icon');
  set('tile-all-icon',    'tile_all_icon');
  set('tile-start-icon',  'tile_start_icon');
  set('brand-title', 'brand_title');
  set('brand-byline', 'brand_byline');

  // Alineación general según idioma
  const isHe = currentLang === 'he';
  document.querySelectorAll('.landing-head, .landing-search, .landing-tiles, .landing-verse-preview').forEach(el => {
    el.style.direction = isHe ? 'rtl' : 'ltr';
    el.style.textAlign = isHe ? 'right' : 'left';
  });
  // Brand: fuente hebrea en modo hebreo
  // Actualizar label del botón de idioma
  const lb = document.getElementById('langBtn');
  if (lb) lb.textContent = currentLang === 'he' ? 'עב' : currentLang === 'en' ? 'EN' : 'ES';
  // Marcar idioma activo en dropdown
  document.querySelectorAll('.lang-menu button[data-lang]').forEach(btn => {
    btn.classList.toggle('active-lang', btn.getAttribute('data-lang') === currentLang);
  });
  // Bottombar
  set('nav-home',   'nav_home');
  set('nav-psalms', 'nav_list');
  set('nav-topics', 'tile_topics_icon');
  const bt = document.getElementById('brand-title');
  if (bt) bt.style.fontFamily = isHe ? '"Noto Serif Hebrew", serif' : '';



  // Títulos en lista de salmos según idioma
  document.querySelectorAll('.tehilim-name').forEach(el => {
    const titleEs = el.getAttribute('data-title-es');
    const titleHe = el.getAttribute('data-title-he');
    const titleEn = el.getAttribute('data-title-en');
    if (currentLang === 'he' && titleHe) el.textContent = titleHe;
    else if (currentLang === 'en' && titleEn) el.textContent = titleEn;
    else if (titleEs) el.textContent = titleEs;
  });
  // Botones de vista (A, K, tr, ES/EN)
  const btnEs = document.getElementById('btnEs');
  if (btnEs) btnEs.textContent = currentLang === 'en' ? 'EN' : 'ES';
  if (btnEs) btnEs.title = currentLang === 'en' ? 'English translation' : 'Traducción al español';
  // Navegación single psalm
  document.querySelectorAll('.nav-list').forEach(el => el.textContent = t('nav_list'));
  document.querySelectorAll('.nav-prev').forEach(el => {
    el.textContent = '← ' + t('prev') + ' ' + el.dataset.num;
  });
  document.querySelectorAll('.nav-next').forEach(el => {
    el.textContent = t('next') + ' ' + el.dataset.num + ' →';
  });

  // Botones de vista
  const bCantil   = document.getElementById('btnHe');
  const bTranslit = document.getElementById('btnTranslit');
  const bEs       = document.getElementById('btnEs');
  if (bCantil)   bCantil.title   = t('title_cantil');
  if (bTranslit) bTranslit.title = t('title_translit');
  if (bEs)       bEs.title       = t('title_es');

  // Botón de idioma

  // Verso del salmo del día (landing)
  const lvp = document.getElementById('lvp-translation');
  if (lvp) {
    const verseEs = lvp.getAttribute('data-verse-es');
    const verseEn = lvp.getAttribute('data-verse-en');
    if (currentLang === 'en' && verseEn) lvp.textContent = verseEn;
    else if (verseEs) lvp.textContent = verseEs;
  }

  // Título landing: fuente y tamaño según idioma
  const title = document.getElementById('landing-title');
  if (title) {
    title.style.fontFamily = currentLang === 'he'
      ? '"Noto Serif Hebrew", serif'
      : '"Assistant", "Segoe UI", sans-serif';
    title.style.fontSize = currentLang === 'he' ? '2em' : '2.4em';
  }

  // Dirección del documento
  document.documentElement.lang = currentLang;
  window.__uiLang = currentLang;
  if (typeof applyView === 'function') applyView();
  document.documentElement.dir  = currentLang === 'he' ? 'rtl' : 'ltr';
  // Grilla de salmos: flujo RTL en hebreo
  document.querySelectorAll('.tehilim-grid').forEach(el => {
    el.style.direction = currentLang === 'he' ? 'rtl' : 'ltr';
  });
}

function applyLangToGrid() {
  document.querySelectorAll('.tehilim-name[data-title-es]').forEach(el => {
    if (currentLang === 'he') el.textContent = el.dataset.titleHe || el.dataset.titleEs;
    else if (currentLang === 'en') el.textContent = el.dataset.titleEn || el.dataset.titleEs;
    else el.textContent = el.dataset.titleEs;
  });
}

function toggleLangMenu() {
  const m = document.getElementById('langMenu');
  if (m) m.style.display = m.style.display === 'none' ? 'block' : 'none';
}
function setLang(lang) {
  currentLang = lang;
  const m = document.getElementById('langMenu');
  if (m) m.style.display = 'none';
  localStorage.setItem('ui_lang', currentLang);
  applyLang();
  applyLangToGrid();
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  applyLangToGrid();
});

// Cerrar dropdown al click fuera
document.addEventListener('click', function(e) {
  const dd = document.getElementById('langDropdown');
  const m = document.getElementById('langMenu');
  if (dd && m && !dd.contains(e.target)) m.style.display = 'none';
});
