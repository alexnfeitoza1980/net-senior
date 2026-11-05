/* ================================================================
   GUIA SÊNIOR .NET/C# — aplicação de leitura (SPA sem build)
   - Rotas por hash (#/slug/secao): F5, voltar/avançar e links compartilháveis
   - Busca indexada por seção, sem acento, navegável pelo teclado
   - Sumário da página com scrollspy e progresso real de leitura
   Depende de: js/core.js (SeniorCore) e js/chapters-data.js (CHAPTERS)
================================================================ */
(function () {
  'use strict';

  const Core = window.SeniorCore;
  const CHAPTERS_DATA = typeof CHAPTERS !== 'undefined' ? CHAPTERS : [];
  const byId = new Map(CHAPTERS_DATA.map(c => [c.id, c]));
  const order = CHAPTERS_DATA.map(c => c.id);

  const MERMAID_SRC = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
  const MERMAID_SRI = 'sha384-rbtjAdnIQE/aQJGEgXrVUlMibdfTSa4PQju4HDhN3sR2PmaKFzhEafuePsl9H/9I';
  const COMPLETE_RATIO = 0.9;          // capítulo conta como lido ao passar de 90% da rolagem
  const HOME_TITLE = 'Guia Sênior .NET/C# — Livro Online';

  /* ==============================================================
     STORAGE — tolerante a falhas (modo privado, cota, JSON corrompido)
  ============================================================== */
  const store = {
    get(key, fallback, isValid = () => true) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        const value = JSON.parse(raw);
        return isValid(value) ? value : fallback;
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sem persistência: segue em memória */ }
    },
  };

  const isIdList = v => Array.isArray(v) && v.every(x => Number.isInteger(x) && byId.has(x));

  function migrateLegacyStorage() {
    // Versão anterior: 'chaptersRead' marcava como lido ao ABRIR o capítulo. Vira "visitado".
    try {
      const legacy = localStorage.getItem('chaptersRead');
      if (legacy !== null && localStorage.getItem('sn.visited') === null) {
        const ids = JSON.parse(legacy);
        if (isIdList(ids)) store.set('sn.visited', ids);
      }
      const theme = localStorage.getItem('theme');
      if (theme && localStorage.getItem('sn.theme') === null && (theme === 'dark' || theme === 'light')) {
        store.set('sn.theme', theme);
      }
      // As chaves antigas NÃO são apagadas: em file:// a origem é compartilhada com outros livros da pasta.
    } catch { /* ignora */ }
  }

  /* ==============================================================
     STATE
  ============================================================== */
  const state = {
    chapterId: null,
    sectionIds: [],
    visited: new Set(),
    completed: new Set(),
    renderToken: 0,
    searchIndex: null,
    searchHits: [],
    activeHit: -1,
  };

  const $ = id => document.getElementById(id);

  /* ==============================================================
     THEME (o tema inicial já é aplicado no <head> para evitar flash)
  ============================================================== */
  const currentTheme = () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = $('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro');
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#050810' : '#f4f7fe');
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    store.set('sn.theme', next);
    applyTheme(next);
    renderDiagrams();
  }

  /* ==============================================================
     MERMAID — carregado sob demanda (≈2,5 MB) só em capítulos com diagrama
  ============================================================== */
  let mermaidPromise = null;

  function loadMermaid() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    if (!mermaidPromise) {
      mermaidPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = MERMAID_SRC;
        s.integrity = MERMAID_SRI;
        s.crossOrigin = 'anonymous';
        s.onload = () => window.mermaid ? resolve(window.mermaid) : reject(new Error('mermaid ausente'));
        s.onerror = () => { mermaidPromise = null; s.remove(); reject(new Error('falha ao baixar mermaid')); };
        document.head.appendChild(s);
      });
    }
    return mermaidPromise;
  }

  function renderDiagrams() {
    const nodes = [...document.querySelectorAll('#chapter-content .mermaid[data-source]')];
    if (!nodes.length) return;
    const token = state.renderToken;
    loadMermaid()
      .then(mermaid => {
        if (token !== state.renderToken) return; // usuário já trocou de capítulo
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: currentTheme() === 'dark' ? 'dark' : 'default',
          fontFamily: 'Inter, sans-serif',
        });
        nodes.forEach(el => {
          el.removeAttribute('data-processed');
          el.classList.remove('mermaid-fallback');
          el.textContent = el.dataset.source;
        });
        return mermaid.run({ nodes });
      })
      .catch(err => {
        console.warn('[diagramas] renderização indisponível:', err?.message || err);
        nodes.forEach(el => {
          if (el.querySelector('svg')) return;
          el.classList.add('mermaid-fallback');
          el.textContent = el.dataset.source;
          el.setAttribute('data-fallback-label', 'Diagrama indisponível (sem internet) — fonte Mermaid:');
        });
      });
  }

  /* ==============================================================
     PROGRESSO
  ============================================================== */
  function persistProgress() {
    store.set('sn.visited', [...state.visited]);
    store.set('sn.completed', [...state.completed]);
  }

  function markCompleted(id) {
    if (state.completed.has(id)) return;
    state.completed.add(id);
    persistProgress();
    updateProgressUI();
  }

  function updateProgressUI() {
    const total = CHAPTERS_DATA.length;
    const done = state.completed.size;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const fill = $('progress-fill');
    if (fill) fill.style.width = pct + '%';
    const bar = $('sidebar-progress');
    if (bar) bar.setAttribute('aria-valuenow', String(pct));
    const label = $('progress-label');
    if (label) label.textContent = `${done}/${total} concluídos`;

    document.querySelectorAll('[data-chapter-id]').forEach(el => {
      const id = Number(el.dataset.chapterId);
      el.classList.toggle('is-completed', state.completed.has(id));
      el.classList.toggle('is-visited', state.visited.has(id) && !state.completed.has(id));
    });
  }

  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      scrollTicking = false;
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, scrollTop / max) : 0;
      const bar = $('reading-progress');
      if (bar) bar.style.transform = `scaleX(${ratio})`;
      $('back-to-top')?.classList.toggle('visible', scrollTop > 400);
      if (state.chapterId && ratio >= COMPLETE_RATIO) markCompleted(state.chapterId);
    });
  }

  /* ==============================================================
     SIDEBAR E HOME
  ============================================================== */
  function buildSidebar() {
    const ul = $('toc-list');
    if (!ul) return;
    ul.innerHTML = CHAPTERS_DATA.map(ch => `
      <li>
        <a class="toc-item" href="${Core.buildRoute(ch)}" data-chapter-id="${ch.id}">
          <span class="toc-num">${String(ch.id).padStart(2, '0')}</span>
          <span class="toc-title">${Core.escapeHtml(ch.title)}</span>
          <span class="toc-status" aria-hidden="true"></span>
        </a>
      </li>`).join('');
  }

  function renderHome() {
    const grid = $('chapters-grid');
    if (grid) {
      grid.innerHTML = CHAPTERS_DATA.map((ch, idx) => `
        <a class="chapter-card" href="${Core.buildRoute(ch)}" data-chapter-id="${ch.id}" style="animation-delay:${idx * 0.05}s; --chapter-color:${ch.color}">
          <div class="chapter-card-header">
            <div class="chapter-icon" aria-hidden="true">${ch.icon}</div>
            <div class="chapter-meta">
              <div class="chapter-number">Capítulo ${ch.id} · ${ch.readTime} min <span class="card-status"></span></div>
              <h3 class="chapter-title">${Core.escapeHtml(ch.title)}</h3>
            </div>
          </div>
          <p class="chapter-desc">${Core.escapeHtml(ch.desc)}</p>
          <div class="chapter-footer">
            <div class="chapter-tags">${ch.tags.map(t => `<span class="tag">${Core.escapeHtml(t)}</span>`).join('')}</div>
            <span class="chapter-arrow" aria-hidden="true">→</span>
          </div>
        </a>`).join('');
    }

    const stats = Core.computeStats(CHAPTERS_DATA);
    document.querySelectorAll('[data-stat]').forEach(el => {
      const v = stats[el.dataset.stat];
      if (v !== undefined) el.textContent = String(v);
    });

    renderContinue();
  }

  function renderContinue() {
    const btn = $('continue-reading');
    if (!btn) return;
    const last = store.get('sn.last', null, v => v && byId.has(v.chapterId));
    if (!last) { btn.hidden = true; return; }
    const ch = byId.get(last.chapterId);
    btn.hidden = false;
    btn.href = Core.buildRoute(ch, last.sectionId);
    btn.querySelector('.continue-label').textContent = `Continuar: Cap. ${ch.id} — ${ch.title}`;
  }

  /* ==============================================================
     ROTEAMENTO
  ============================================================== */
  function navigate(route) {
    if (location.hash === route) handleRoute();
    else location.hash = route;
  }

  function handleRoute() {
    const route = Core.parseRoute(location.hash, CHAPTERS_DATA);
    closeMobileMenu();
    closeSearch();
    if (route.view === 'chapter') {
      const sameChapter = route.chapterId === state.chapterId;
      if (!sameChapter) renderChapter(route.chapterId);
      else if (!route.sectionId) window.scrollTo({ top: 0, behavior: 'smooth' });
      scrollToSection(route.sectionId, sameChapter);
    } else {
      showHome();
    }
  }

  function showHome() {
    state.chapterId = null;
    state.renderToken++;
    disconnectObservers();
    $('home-view').hidden = false;
    $('chapter-view').hidden = true;
    $('chapter-content').innerHTML = '';
    updateSidebarActive(null);
    renderContinue();
    document.title = HOME_TITLE;
    window.scrollTo({ top: 0 });
  }

  function updateSidebarActive(chapterId) {
    document.querySelectorAll('.toc-item').forEach(el => {
      const active = Number(el.dataset.chapterId) === chapterId;
      el.classList.toggle('active', active);
      if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
  }

  /* ==============================================================
     CAPÍTULO
  ============================================================== */
  function neighbors(chapterId) {
    const i = order.indexOf(chapterId);
    return { prev: byId.get(order[i - 1]) || null, next: byId.get(order[i + 1]) || null };
  }

  function renderChapter(chapterId) {
    const ch = byId.get(chapterId);
    if (!ch) return showHome();

    state.chapterId = chapterId;
    state.renderToken++;
    disconnectObservers();

    if (!state.visited.has(chapterId)) {
      state.visited.add(chapterId);
      persistProgress();
    }

    $('home-view').hidden = true;
    $('chapter-view').hidden = false;
    $('breadcrumb-chapter').textContent = `Cap. ${ch.id} — ${ch.title}`;

    const { prev, next } = neighbors(chapterId);
    setNavButton($('btn-prev'), prev);
    setNavButton($('btn-next'), next);

    const sections = Core.splitSections(ch.content).filter(s => s.level);
    state.sectionIds = sections.map(s => s.id);

    const content = $('chapter-content');
    content.innerHTML = `
      <header class="chapter-title-area">
        <div class="chapter-num-label">Capítulo ${String(ch.id).padStart(2, '0')}</div>
        <h1 class="chapter-main-title" tabindex="-1">${ch.icon} ${Core.escapeHtml(ch.title)}</h1>
        ${ch.subtitle ? `<p class="chapter-subtitle">${Core.escapeHtml(ch.subtitle)}</p>` : ''}
        <p class="chapter-intro">${ch.intro}</p>
        <div class="reading-time">⏱ Leitura estimada: ${ch.readTime} minutos · ${sections.filter(s => s.level === 2).length} seções</div>
      </header>
      ${buildInlineToc(ch, sections)}
      <div class="chapter-body">${ch.content}</div>
      ${buildChapterNavFooter(prev, next)}
    `;

    enhanceContent(content, ch, sections);
    renderPageToc(ch, sections);
    updateSidebarActive(chapterId);
    updateProgressUI();
    observeSections();
    renderDiagrams();

    document.title = `Cap. ${ch.id} — ${ch.title} | Guia Sênior .NET/C#`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    content.querySelector('.chapter-main-title')?.focus({ preventScroll: true });
    store.set('sn.last', { chapterId, sectionId: null });
  }

  function setNavButton(btn, target) {
    if (!btn) return;
    btn.disabled = !target;
    btn.dataset.route = target ? Core.buildRoute(target) : '';
    btn.title = target ? `${target.title} (tecla ${btn.id === 'btn-prev' ? '←' : '→'})` : '';
  }

  function tocItems(ch, sections) {
    return sections.map(s => `
      <li class="ptoc-l${s.level}"><a href="${Core.buildRoute(ch, s.id)}" data-section="${s.id}">${Core.escapeHtml(s.title)}</a></li>`).join('');
  }

  function buildInlineToc(ch, sections) {
    if (!sections.length) return '';
    return `
      <details class="inline-toc">
        <summary>📑 Nesta página (${sections.length} tópicos)</summary>
        <ul>${tocItems(ch, sections)}</ul>
      </details>`;
  }

  function renderPageToc(ch, sections) {
    const nav = $('page-toc');
    if (!nav) return;
    nav.innerHTML = sections.length ? `
      <div class="ptoc-title">Nesta página</div>
      <ul>${tocItems(ch, sections)}</ul>` : '';
  }

  /** Ajustes no HTML do capítulo após inserir: âncoras, acessibilidade, segurança e diagramas. */
  function enhanceContent(root, ch, sections) {
    const headings = root.querySelectorAll('.chapter-body h2, .chapter-body h3');
    headings.forEach((h, i) => {
      const s = sections[i];
      if (!s) return;
      h.id = s.id;
      const a = document.createElement('a');
      a.className = 'heading-anchor';
      a.href = Core.buildRoute(ch, s.id);
      a.setAttribute('aria-label', `Link para a seção ${s.title}`);
      a.textContent = '#';
      h.appendChild(a);
    });

    root.querySelectorAll('a[target="_blank"]').forEach(a => a.setAttribute('rel', 'noopener noreferrer'));
    root.querySelectorAll('img').forEach(img => { img.loading = 'lazy'; img.decoding = 'async'; });

    root.querySelectorAll('pre:not(.mermaid)').forEach(pre => {
      pre.tabIndex = 0; // blocos com rolagem horizontal precisam ser acessíveis pelo teclado
      if (!pre.hasAttribute('aria-label')) pre.setAttribute('aria-label', pre.closest('.console-output') ? 'Saída do programa' : 'Código');
    });

    root.querySelectorAll('.copy-btn').forEach(btn => {
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copiar código');
    });

    root.querySelectorAll('.mermaid').forEach(el => {
      el.dataset.source = el.textContent;
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'Diagrama');
    });

    if (window.Prism) Prism.highlightAllUnder(root);
  }

  function buildChapterNavFooter(prev, next) {
    const card = (ch, dir) => `
      <a class="nav-card ${dir}" href="${Core.buildRoute(ch)}">
        <div class="nav-card-icon" aria-hidden="true">${dir === 'prev' ? '←' : '→'}</div>
        <div>
          <div class="nav-card-label">${dir === 'prev' ? 'Anterior' : 'Próximo'}</div>
          <div class="nav-card-title">${ch.icon} ${Core.escapeHtml(ch.title)}</div>
        </div>
      </a>`;
    return `
      <nav class="chapter-nav-footer" aria-label="Navegação entre capítulos">
        ${prev ? card(prev, 'prev') : '<div></div>'}
        ${next ? card(next, 'next') : '<div class="nav-card done">🎓 Você chegou ao fim do guia!</div>'}
      </nav>`;
  }

  function scrollToSection(sectionId, smooth = false) {
    if (!sectionId) return;
    const el = document.getElementById(sectionId);
    if (!el || !$('chapter-content').contains(el)) return;
    // Aguarda o layout do capítulo recém-renderizado antes de rolar.
    requestAnimationFrame(() => el.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'instant' }));
    setActiveTocLink(sectionId);
  }

  function scrollWithin(container, el) {
    const c = container.getBoundingClientRect(), r = el.getBoundingClientRect();
    if (r.top < c.top) container.scrollTop -= c.top - r.top + 8;
    else if (r.bottom > c.bottom) container.scrollTop += r.bottom - c.bottom + 8;
  }

  /* ==============================================================
     SCROLLSPY
  ============================================================== */
  let sectionObserver = null;

  function disconnectObservers() {
    sectionObserver?.disconnect();
    sectionObserver = null;
  }

  function observeSections() {
    if (!('IntersectionObserver' in window)) return;
    const visible = new Map();
    sectionObserver = new IntersectionObserver(entries => {
      for (const e of entries) visible.set(e.target.id, e.isIntersecting);
      const current = state.sectionIds.find(id => visible.get(id));
      if (current) {
        setActiveTocLink(current);
        const ch = byId.get(state.chapterId);
        if (ch) {
          history.replaceState(null, '', Core.buildRoute(ch, current));
          store.set('sn.last', { chapterId: ch.id, sectionId: current });
        }
      }
    }, { rootMargin: '-120px 0px -65% 0px' });
    state.sectionIds.forEach(id => { const el = document.getElementById(id); if (el) sectionObserver.observe(el); });
  }

  function setActiveTocLink(sectionId) {
    document.querySelectorAll('[data-section]').forEach(a => {
      const active = a.dataset.section === sectionId;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    // Rola SÓ o container do sumário: scrollIntoView aqui interromperia a rolagem suave da página.
    const nav = $('page-toc');
    const link = nav?.querySelector(`[data-section="${CSS.escape(sectionId)}"]`);
    if (link) scrollWithin(nav, link);
  }

  /* ==============================================================
     COPIAR CÓDIGO (com fallback para navegadores sem Clipboard API em file://)
  ============================================================== */
  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch { /* tenta o fallback */ }
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }

  async function onCopyClick(btn) {
    const code = btn.closest('.code-block-wrapper')?.querySelector('code');
    if (!code) return;
    const ok = await copyText(code.textContent);
    btn.textContent = ok ? '✓ Copiado' : 'Falhou — selecione e copie';
    btn.classList.toggle('copied', ok);
    btn.classList.toggle('copy-failed', !ok);
    clearTimeout(btn._t);
    btn._t = setTimeout(() => {
      btn.textContent = 'Copiar';
      btn.classList.remove('copied', 'copy-failed');
    }, 2000);
  }

  /* ==============================================================
     BUSCA
  ============================================================== */
  function ensureIndex() {
    if (!state.searchIndex) state.searchIndex = Core.buildSearchIndex(CHAPTERS_DATA);
    return state.searchIndex;
  }

  let searchTimer = 0;
  function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(runSearch, 120);
  }

  function runSearch() {
    const input = $('search-input');
    const results = $('search-results');
    const q = input.value.trim();
    if (q.length < 2) { closeSearch(false); return; }

    state.searchHits = Core.search(ensureIndex(), q, 8);
    state.activeHit = state.searchHits.length ? 0 : -1;

    results.innerHTML = state.searchHits.length
      ? state.searchHits.map((h, i) => {
          const ch = byId.get(h.entry.chapterId);
          const where = h.entry.sectionId ? Core.escapeHtml(h.entry.title) : 'Visão geral do capítulo';
          return `
            <a class="search-result-item" role="option" id="hit-${i}" href="${Core.buildRoute(ch, h.entry.sectionId)}" aria-selected="${i === 0}">
              <div class="search-result-chapter">${ch.icon} Cap. ${ch.id} · ${where}</div>
              <div class="search-result-text">${Core.highlightTerms(h.snippet, q)}</div>
            </a>`;
        }).join('')
      : `<div class="search-empty" role="status">Nada encontrado para “${Core.escapeHtml(q)}”.</div>`;

    results.classList.add('visible');
    input.setAttribute('aria-expanded', 'true');
    updateActiveHit();
  }

  function updateActiveHit() {
    const input = $('search-input');
    document.querySelectorAll('#search-results .search-result-item').forEach((el, i) => {
      const on = i === state.activeHit;
      el.classList.toggle('active', on);
      el.setAttribute('aria-selected', String(on));
      if (on) scrollWithin($('search-results'), el);
    });
    if (state.activeHit >= 0) input.setAttribute('aria-activedescendant', `hit-${state.activeHit}`);
    else input.removeAttribute('aria-activedescendant');
  }

  function onSearchKeydown(e) {
    const n = state.searchHits.length;
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); state.activeHit = (state.activeHit + 1) % n; updateActiveHit(); }
    else if (e.key === 'ArrowUp' && n) { e.preventDefault(); state.activeHit = (state.activeHit - 1 + n) % n; updateActiveHit(); }
    else if (e.key === 'Enter' && state.activeHit >= 0) {
      e.preventDefault();
      const hit = state.searchHits[state.activeHit];
      e.target.value = '';
      navigate(Core.buildRoute(byId.get(hit.entry.chapterId), hit.entry.sectionId));
      e.target.blur();
    } else if (e.key === 'Escape') { e.preventDefault(); e.target.value = ''; closeSearch(); e.target.blur(); }
  }

  function closeSearch(clearHits = true) {
    const results = $('search-results');
    results?.classList.remove('visible');
    $('search-input')?.setAttribute('aria-expanded', 'false');
    $('search-input')?.removeAttribute('aria-activedescendant');
    if (clearHits) { state.searchHits = []; state.activeHit = -1; }
    document.body.classList.remove('search-open');
  }

  function focusSearch() {
    document.body.classList.add('search-open');
    const input = $('search-input');
    input?.focus();
    input?.select();
    ensureIndex();
  }

  /* ==============================================================
     MENU MOBILE
  ============================================================== */
  function toggleMobileMenu() {
    const open = !$('sidebar').classList.contains('open');
    $('sidebar').classList.toggle('open', open);
    $('sidebar-overlay').classList.toggle('visible', open);
    $('menu-toggle').setAttribute('aria-expanded', String(open));
    if (open) $('sidebar').querySelector('.toc-item.active, .toc-item')?.focus();
  }

  function closeMobileMenu() {
    if (!$('sidebar')?.classList.contains('open')) return;
    $('sidebar').classList.remove('open');
    $('sidebar-overlay').classList.remove('visible');
    $('menu-toggle').setAttribute('aria-expanded', 'false');
  }

  /* ==============================================================
     TECLADO
  ============================================================== */
  function isTypingContext(target) {
    return target.closest?.('input, textarea, select, [contenteditable="true"], pre');
  }

  function onKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); focusSearch(); return; }
    if (isTypingContext(e.target)) return;
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); focusSearch(); return; }
    if (e.key === 'Escape') { closeMobileMenu(); closeSearch(); return; }

    // Setas trocam de capítulo só sem modificadores e sem texto selecionado (não sequestra rolagem/seleção).
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !state.chapterId) return;
    if (String(window.getSelection?.() || '').length) return;
    const { prev, next } = neighbors(state.chapterId);
    if (e.key === 'ArrowRight' && next) navigate(Core.buildRoute(next));
    if (e.key === 'ArrowLeft' && prev) navigate(Core.buildRoute(prev));
  }

  /* ==============================================================
     INIT
  ============================================================== */
  function bindEvents() {
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKeydown);

    $('theme-toggle')?.addEventListener('click', toggleTheme);
    $('menu-toggle')?.addEventListener('click', toggleMobileMenu);
    $('sidebar-overlay')?.addEventListener('click', closeMobileMenu);
    $('search-toggle')?.addEventListener('click', focusSearch);
    $('see-chapters')?.addEventListener('click', e => {
      e.preventDefault();
      $('chapters-section')?.scrollIntoView({ behavior: 'smooth' });
    });
    $('back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    ['btn-prev', 'btn-next'].forEach(id => $(id)?.addEventListener('click', e => {
      const r = e.currentTarget.dataset.route;
      if (r) navigate(r);
    }));

    const input = $('search-input');
    input?.addEventListener('input', onSearchInput);
    input?.addEventListener('keydown', onSearchKeydown);
    input?.addEventListener('focus', ensureIndex, { once: true });
    $('search-results')?.addEventListener('click', e => {
      if (e.target.closest('.search-result-item')) { input.value = ''; closeSearch(); }
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.header-center, #search-toggle')) closeSearch(false);
    });

    // Links internos (#/...) passam pelo roteador: funciona mesmo quando o hash já é o atual
    // (o scrollspy usa replaceState, que não dispara hashchange).
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#/"]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(a.getAttribute('href'));
    });

    // Delegação: um único listener para todos os botões "Copiar".
    $('chapter-content')?.addEventListener('click', e => {
      const btn = e.target.closest('.copy-btn');
      if (btn) onCopyClick(btn);
    });

    // Sincroniza progresso entre abas abertas.
    window.addEventListener('storage', e => {
      if (e.key === 'sn.completed' || e.key === 'sn.visited') { loadProgress(); updateProgressUI(); }
    });

    // Segue o tema do sistema enquanto o usuário não escolher um manualmente.
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', e => {
      if (store.get('sn.theme', null) === null) { applyTheme(e.matches ? 'dark' : 'light'); renderDiagrams(); }
    });
  }

  function loadProgress() {
    state.visited = new Set(store.get('sn.visited', [], isIdList));
    state.completed = new Set(store.get('sn.completed', [], isIdList));
  }

  function init() {
    if (!Core || !CHAPTERS_DATA.length) {
      document.body.insertAdjacentHTML('afterbegin', '<p role="alert" style="padding:1rem">Não foi possível carregar o conteúdo do livro.</p>');
      return;
    }
    migrateLegacyStorage();
    loadProgress();
    applyTheme(currentTheme());
    buildSidebar();
    renderHome();
    bindEvents();
    handleRoute();
    updateProgressUI();
  }

  // Exposto para depuração no console e testes E2E.
  window.SeniorApp = { navigate, state };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
