// Siddur Sefardi UI v4 - Bottom Sheet Navigation

let fontSize = 20;
let sidebarFontSize = 18;
let lastScroll = 0;
const SCROLL_THRESHOLD = 100;

// ── Bottom Sheet ──
function openBottomSheet() {
  const sheet = document.getElementById('bottomSheet');
  const overlay = document.getElementById('sheetOverlay');
  if (!sheet) return;
  updateActiveSidebarLink();
  sheet.classList.add('open');
  overlay.classList.add('visible');
  // scroll al elemento activo dentro del sheet
  setTimeout(() => {
    const active = sheet.querySelector('.sheet-nav a.active');
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, 180);
}

function closeBottomSheet() {
  const sheet = document.getElementById('bottomSheet');
  const overlay = document.getElementById('sheetOverlay');
  if (!sheet) return;
  sheet.classList.remove('open');
  overlay.classList.remove('visible');
}

function toggleSidebar() { openBottomSheet(); }
function closeSidebar()  { closeBottomSheet(); }
function openSidebar()   { openBottomSheet(); }

// ── Navegación ──
function initNavigation() {
  const sheetNav = document.getElementById('sheetNavLinks');
  if (!sheetNav) return;

  const titles = document.querySelectorAll('.prayer-block .prayer-title');

  titles.forEach((title, index) => {
    const block2 = title.closest(".prayer-block");
    if (block2.dataset.navSkip === "true") return;
    const block = title.closest('.prayer-block');
    if (!block.id) block.id = 'prayer-block-' + index;

    const link = document.createElement('a');
    link.href = '#' + block.id;
    link.textContent = title.textContent.trim();
    link.dataset.target = block.id;

    link.onclick = (e) => {
      e.preventDefault();
      closeBottomSheet();
      // pequeño delay para que el sheet cierre antes de hacer scroll
      setTimeout(() => {
        const target = document.getElementById(block.id);
        if (target) {
          const mainContent = document.getElementById('mainContent');
          if (mainContent) {
            const rect = target.getBoundingClientRect();
            const containerRect = mainContent.getBoundingClientRect();
            const offset = mainContent.scrollTop + rect.top - containerRect.top - 20;
            mainContent.scrollTo({ top: offset, behavior: 'smooth' });
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 200);
    };

    sheetNav.appendChild(link);
  });

  setInitialSection();
}

function updateActiveSidebarLink() {
  const currentText = document.getElementById('currentSectionText')?.textContent?.trim();
  document.querySelectorAll('#sheetNavLinks a').forEach(link => {
    link.classList.toggle('active', link.textContent.trim() === currentText);
  });
}

// ── Sección actual ──
function updateCurrentSection() {
  const blocks = document.querySelectorAll('.prayer-block');
  const text = document.getElementById('currentSectionText');
  const mainContent = document.getElementById('mainContent');
  if (!text || blocks.length === 0) return;

  let current = '';
  blocks.forEach(block => {
    const rect = block.getBoundingClientRect();
    if (rect.top < window.innerHeight / 3 && rect.bottom > 0) {
      const t = block.querySelector('.prayer-title');
      if (t) current = t.dataset.navTitle || t.textContent.trim();
    }
  });

  if (current && current !== text.textContent) {
    text.textContent = current;
  }
}

function setInitialSection() {
  const firstTitle = document.querySelector('.prayer-title');
  const currentSectionText = document.getElementById('currentSectionText');
  if (firstTitle && currentSectionText) {
    currentSectionText.textContent = firstTitle.dataset.navTitle || firstTitle.textContent.trim();
  }
}

// ── Fuente ──
function adjustFont(delta) {
  fontSize = Math.max(16, Math.min(55, fontSize + delta));
  document.documentElement.style.setProperty('--font', fontSize + 'px');
  localStorage.setItem('siddur_fontSize', fontSize);
}

function adjustSidebarFont(delta) {
  sidebarFontSize = Math.max(14, Math.min(28, sidebarFontSize + delta));
  document.querySelectorAll('#sheetNavLinks a').forEach(a => {
    a.style.fontSize = sidebarFontSize + 'px';
  });
  localStorage.setItem('siddur_sidebarFontSize', sidebarFontSize);
}

// ── Dark mode ──
function toggleDarkMode() {
  const root = document.documentElement;
  if (root.classList.contains('dark-mode')) {
    root.classList.remove('dark-mode');
    root.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  } else if (root.classList.contains('light-mode')) {
    root.classList.remove('light-mode');
    localStorage.removeItem('theme');
  } else {
    root.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }
}

// ── Navegación rápida ──
function goToBirkat() { window.location.href = '/extra/birkat-hamazon/'; }
function goToUrgency() { window.location.href = '/urgencia/'; }

// ── Modo minyan ──
function setMinyanMode(mode) {
  document.body.classList.remove('mode-yachid', 'mode-minyan');
  document.body.classList.add('mode-' + mode);
  const yachidBtn = document.getElementById('yachidBtn');
  const minyanBtn = document.getElementById('minyanBtn');
  if (yachidBtn) yachidBtn.classList.toggle('active', mode === 'yachid');
  if (minyanBtn) minyanBtn.classList.toggle('active', mode === 'minyan');
  localStorage.setItem('siddur_minyanMode', mode);
}

// ── Progress bar ──
function updateProgressBar() {
  const mainContent = document.getElementById('mainContent');
  const scroll = mainContent ? mainContent.scrollTop : document.documentElement.scrollTop;
  const height = mainContent
    ? mainContent.scrollHeight - mainContent.clientHeight
    : document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (scroll / height) * 100 : 0;
  const bar = document.querySelector('.reading-progress');
  if (bar) bar.style.background =
    'linear-gradient(to top, #d4af37 ' + pct + '%, rgba(128,128,128,.06) ' + pct + '%)';
}

// ── Scroll handler ──
function handleScroll() {
  const mainContent = document.getElementById('mainContent');
  const currentScroll = mainContent ? mainContent.scrollTop : window.pageYOffset;
  const navMini   = document.querySelector('.nav-mini');
  const bottombar = document.querySelector('.bottombar');
  const topbar    = document.querySelector('.topbar');
  const leftBtn     = document.getElementById('leftBtn');
  const leftBtnIcon = document.getElementById('leftBtnIcon');

  updateCurrentSection();
  updateProgressBar();

  if (currentScroll > SCROLL_THRESHOLD) {
    if (leftBtnIcon) leftBtnIcon.textContent = '↑';
    if (leftBtn) leftBtn.onclick = () => {
      if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  } else {
    if (leftBtnIcon) leftBtnIcon.textContent = 'בהמ״ז';
    if (leftBtn) leftBtn.onclick = goToBirkat;
  }

  const nearTop      = currentScroll < 150;
  const scrollingDown = currentScroll > lastScroll && currentScroll > 150;

  if (scrollingDown) {
    if (navMini)   navMini.classList.add('hidden');
    if (bottombar) bottombar.classList.add('hidden');
    if (topbar)    topbar.style.transform = 'translateY(-130%)';
  } else if (nearTop) {
    if (bottombar) bottombar.classList.remove('hidden');
    if (navMini)   { navMini.classList.remove('hidden'); navMini.classList.remove('solo'); }
    if (topbar)    topbar.style.transform = 'translateY(0)';
  } else {
    if (bottombar) bottombar.classList.add('hidden');
    if (navMini)   { navMini.classList.remove('hidden'); navMini.classList.add('solo'); }
    if (topbar)    topbar.style.transform = 'translateY(0)';
  }

  lastScroll = currentScroll;
}

// ── Init ──
window.addEventListener('load', function () {
  const theme       = localStorage.getItem('theme');
  const size        = localStorage.getItem('siddur_fontSize');
  const sidebarSize = localStorage.getItem('siddur_sidebarFontSize');
  const mode        = localStorage.getItem('siddur_minyanMode') || 'minyan';

  if (theme === 'dark')  document.documentElement.classList.add('dark-mode');
  if (theme === 'light') document.documentElement.classList.add('light-mode');
  if (size) {
    fontSize = parseInt(size);
    document.documentElement.style.setProperty('--font', fontSize + 'px');
  }
  if (sidebarSize) sidebarFontSize = parseInt(sidebarSize);

  setMinyanMode(mode);
  initNavigation();

  const navMiniEl  = document.querySelector('.nav-mini');
  const bottombarEl = document.querySelector('.bottombar');
  if (navMiniEl)   { navMiniEl.classList.remove('hidden'); navMiniEl.classList.remove('solo'); }
  if (bottombarEl) bottombarEl.classList.remove('hidden');

  const mainContent = document.getElementById('mainContent');
  if (mainContent) mainContent.addEventListener('scroll', handleScroll);
  else window.addEventListener('scroll', handleScroll);

  // Cerrar sheet con tecla Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBottomSheet();
  });
});

// ── Festividades ──
function detectFestival() {
  const params   = new URLSearchParams(window.location.search);
  const festival = params.get('festival');
  if (festival) {
    document.querySelectorAll('.festival-block').forEach(el => {
      if ((el.dataset.festival || '').includes(festival)) el.style.display = '';
    });
    document.querySelectorAll('.festival-label').forEach(el => {
      el.style.display = el.dataset.festival === festival ? 'inline' : 'none';
    });
  }
}
detectFestival();
