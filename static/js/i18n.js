// ===== i18n UI =====
const STRINGS = {
  he: {
    home: "בַּיִת",
    psalms: "תְּהִלִּים",
    topics: "נוֹשְׂאִים",
    search_placeholder: "חפש מזמור...",
    all_psalms: "כָּל הַמְּזָמוֹרִים",
    prev: "← מזמור",
    next: "מזמור →",
    read: "קְרָא תְּהִלִּים",
    subtitle: "נֻסַח סְפָרַד · מִזְמוֹרֵי דָּוִד",
    not_found: "לא נמצא",
    btn_cantil: "טַ",
    btn_translit: "tr",
    btn_es: "ES",
    title_cantil: "ניקוד וטעמים",
    title_translit: "תעתיק",
    title_es: "תרגום",
  },
  es: {
    home: "Inicio",
    psalms: "Salmos",
    topics: "Temas",
    search_placeholder: "Buscar salmo...",
    all_psalms: "Todos los salmos",
    prev: "← Salmo",
    next: "Salmo →",
    read: "Leer Tehilim",
    subtitle: "Nusaj Sefardí · Salmos de David",
    not_found: "No encontrado",
    btn_cantil: "טַ",
    btn_translit: "tr",
    btn_es: "ES",
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
  // Bottombar
  const q = (sel, key) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = t(key);
  };
  q('#nav-home',   'home');
  q('#nav-psalms', 'psalms');
  q('#nav-topics', 'topics');

  // Search
  const inp = document.getElementById('searchInput');
  if (inp) inp.placeholder = t('search_placeholder');

  // Botones topbar
  const bCantil = document.getElementById('translitBtn');
  const bTranslit = document.getElementById('translBtn');
  const bEs = document.getElementById('esBtn');
  if (bCantil)  { bCantil.title  = t('title_cantil');  }
  if (bTranslit){ bTranslit.title = t('title_translit');}
  if (bEs)      { bEs.title      = t('title_es');      }

  // Nav del salmo
  document.querySelectorAll('.nav-list').forEach(el => el.textContent = t('all_psalms'));
  document.querySelectorAll('.nav-prev').forEach(el => {
    const num = el.dataset.num;
    el.textContent = t('prev') + ' ' + num;
  });
  document.querySelectorAll('.nav-next').forEach(el => {
    const num = el.dataset.num;
    el.textContent = t('next').replace('→', '').trim() + ' ' + num + ' →';
  });

  // Toggle botón de idioma
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = currentLang === 'es' ? 'עב' : 'ES';

  // dir del body: hebreo = RTL, español = LTR para UI... pero mantenemos RTL por el texto
  document.documentElement.lang = currentLang === 'he' ? 'he' : 'es';
}

function toggleLang() {
  currentLang = currentLang === 'es' ? 'he' : 'es';
  localStorage.setItem('ui_lang', currentLang);
  applyLang();
}

document.addEventListener('DOMContentLoaded', applyLang);
