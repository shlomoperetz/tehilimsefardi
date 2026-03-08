const STRINGS = {
  he: {
    home: "בַּיִת", psalms: "תְּהִלִּים", topics: "נוֹשְׂאִים",
    search_placeholder: "חפש מזמור...",
    all_psalms: "כָּל הַמְּזָמוֹרִים",
    nav_list: "כָּל הַמְּזָמוֹרִים",
    prev: "מזמור", next: "מזמור",
    read: "קְרָא תְּהִלִּים",
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
    all_psalms: "Todos los salmos",
    nav_list: "Todos los salmos",
    prev: "Salmo", next: "Salmo",
    read: "Leer Tehilim",
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
  const attr = (id, attr, key) => { const el = document.getElementById(id); if (el) el[attr] = t(key); };

  // Bottombar
  set('nav-home',   'home');
  set('nav-psalms', 'psalms');
  set('nav-topics', 'topics');

  // Landing
  set('landing-subtitle',   'subtitle');
  set('landing-enter-text', 'read');
  set('landing-all',        'landing_all');
  set('landing-topics',     'landing_topics');

  // Search
  attr('searchInput', 'placeholder', 'search_placeholder');

  // Botones topbar títulos
  const bCantil   = document.getElementById('translitBtn');
  const bTranslit = document.getElementById('translBtn');
  const bEs       = document.getElementById('esBtn');
  if (bCantil)   bCantil.title   = t('title_cantil');
  if (bTranslit) bTranslit.title = t('title_translit');
  if (bEs)       bEs.title       = t('title_es');

  // Nav salmo
  document.querySelectorAll('.nav-list').forEach(el => el.textContent = t('nav_list'));
  document.querySelectorAll('.nav-prev').forEach(el => {
    const num = el.dataset.num;
    el.textContent = '← ' + t('prev') + ' ' + num;
  });
  document.querySelectorAll('.nav-next').forEach(el => {
    const num = el.dataset.num;
    el.textContent = t('next') + ' ' + num + ' →';
  });

  // Botón idioma
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = currentLang === 'es' ? 'עב' : 'ES';

  document.documentElement.lang = currentLang;
}

function toggleLang() {
  currentLang = currentLang === 'es' ? 'he' : 'es';
  localStorage.setItem('ui_lang', currentLang);
  applyLang();
}

document.addEventListener('DOMContentLoaded', applyLang);
