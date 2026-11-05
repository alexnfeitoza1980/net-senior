/* ================================================================
   CORE — funções puras (sem DOM, sem estado global).
   Carregado como script clássico no navegador (funciona em file://,
   onde ES modules são bloqueados por CORS) e como CommonJS nos testes.
================================================================ */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SeniorCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' };

  /** Remove acentos e caixa para comparações tolerantes ("concorrencia" acha "Concorrência"). */
  function normalize(text) {
    return String(text ?? '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  }

  /** Gera um id estável e legível para URLs: "1.1 Sistema de Tipos" -> "1-1-sistema-de-tipos". */
  function slugify(text) {
    return normalize(text)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'secao';
  }

  function escapeHtml(text) {
    return String(text ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function decodeEntities(text) {
    return String(text ?? '').replace(/&(#?\w+);/g, (m, k) => {
      if (k in ENTITIES) return ENTITIES[k];
      if (/^#\d+$/.test(k)) return String.fromCodePoint(Number(k.slice(1)));
      if (/^#x[0-9a-f]+$/i.test(k)) return String.fromCodePoint(parseInt(k.slice(2), 16));
      return m;
    });
  }

  /** HTML -> texto puro (sem tags, SVG ou fontes de diagramas), com espaços colapsados. */
  function htmlToText(html) {
    const withoutNoise = String(html ?? '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<pre class="mermaid"[\s\S]*?<\/pre>/gi, ' ')
      .replace(/<[^>]+>/g, ' ');
    return decodeEntities(withoutNoise).replace(/\s+/g, ' ').trim();
  }

  /**
   * Divide o HTML do capítulo em seções a partir dos <h2>/<h3>.
   * Retorna [{ level, title, id, html }]; a primeira entrada (level 0) é o texto antes do 1º título.
   */
  function splitSections(html) {
    const re = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;
    const sections = [];
    const used = new Set();
    let last = 0;
    let current = { level: 0, title: '', id: '', html: '' };
    let m;
    while ((m = re.exec(html))) {
      current.html = html.slice(last, m.index);
      sections.push(current);
      const title = htmlToText(m[3]);
      const existing = /\bid="([^"]+)"/.exec(m[2]);
      let id = existing ? existing[1] : slugify(title);
      let n = 2;
      const base = id;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);
      current = { level: Number(m[1]), title, id, html: '' };
      last = m.index;
    }
    current.html = html.slice(last);
    sections.push(current);
    return sections;
  }

  /** Índice de busca por seção, calculado uma única vez (antes: strip de 590 KB a cada tecla). */
  function buildSearchIndex(chapters) {
    const index = [];
    for (const ch of chapters) {
      const meta = `${ch.title} ${ch.subtitle || ''} ${ch.desc || ''} ${(ch.tags || []).join(' ')}`;
      index.push({ chapterId: ch.id, sectionId: '', title: ch.title, text: htmlToText(meta + ' ' + (ch.intro || '')), weight: 3 });
      for (const s of splitSections(ch.content || '')) {
        if (!s.level) continue;
        const text = htmlToText(s.html);
        index.push({ chapterId: ch.id, sectionId: s.id, title: s.title, text, weight: s.level === 2 ? 2 : 1 });
      }
    }
    return index.map(e => ({ ...e, normTitle: normalize(e.title), normText: normalize(e.text) }));
  }

  /** Busca com todos os termos (AND), sem acento, ranqueada: título > corpo, h2 > h3. */
  function search(index, query, limit = 8) {
    const terms = normalize(query).split(/\s+/).filter(t => t.length >= 2);
    if (!terms.length) return [];
    const hits = [];
    for (const e of index) {
      if (!terms.every(t => e.normTitle.includes(t) || e.normText.includes(t))) continue;
      let score = e.weight;
      for (const t of terms) {
        if (e.normTitle.includes(t)) score += 10;
        score += Math.min(5, countOccurrences(e.normText, t));
      }
      hits.push({ entry: e, score, snippet: snippet(e.text, e.normText, terms[0]) });
    }
    return hits.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  function countOccurrences(haystack, needle) {
    let n = 0, i = 0;
    while ((i = haystack.indexOf(needle, i)) !== -1) { n++; i += needle.length; }
    return n;
  }

  /** Trecho em torno do termo. A posição é achada no texto normalizado e mapeada de volta ao original. */
  function snippet(text, normText, term, radius = 60) {
    const map = buildIndexMap(text);
    const idxNorm = normText.indexOf(term);
    if (idxNorm < 0) return text.slice(0, radius * 2) + (text.length > radius * 2 ? '…' : '');
    const start = map[Math.max(0, idxNorm - radius)] ?? 0;
    const end = map[Math.min(normText.length, idxNorm + term.length + radius)] ?? text.length;
    return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
  }

  /** Para cada posição do texto normalizado, a posição correspondente no texto original. */
  function buildIndexMap(text) {
    const map = [];
    for (let i = 0; i < text.length; i++) {
      const n = normalize(text[i]).length;
      for (let k = 0; k < n; k++) map.push(i);
    }
    map.push(text.length);
    return map;
  }

  /** Destaca os termos com <mark>, escapando TUDO antes (sem XSS, sem quebrar entidades). */
  function highlightTerms(text, query) {
    const terms = normalize(query).split(/\s+/).filter(t => t.length >= 2);
    if (!terms.length) return escapeHtml(text);
    const map = buildIndexMap(text);
    const norm = normalize(text);
    const ranges = [];
    for (const t of terms) {
      let i = 0;
      while ((i = norm.indexOf(t, i)) !== -1) { ranges.push([map[i], map[i + t.length - 1] + 1]); i += t.length; }
    }
    ranges.sort((a, b) => a[0] - b[0]);
    let out = '', pos = 0;
    for (const [s, e] of ranges) {
      if (s < pos) continue;
      out += escapeHtml(text.slice(pos, s)) + '<mark>' + escapeHtml(text.slice(s, e)) + '</mark>';
      pos = e;
    }
    return out + escapeHtml(text.slice(pos));
  }

  /** Rotas por hash: "#/fundamentos-csharp/1-1-sistema-de-tipos". Funciona em file:// e no GitHub Pages. */
  function parseRoute(hash, chapters) {
    const parts = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    if (!parts.length) return { view: 'home' };
    const key = parts[0];
    const ch = chapters.find(c => c.slug === key || String(c.id) === key);
    if (!ch) return { view: 'home', notFound: key };
    return { view: 'chapter', chapterId: ch.id, sectionId: parts[1] || null };
  }

  function buildRoute(chapter, sectionId) {
    if (!chapter) return '#/';
    return `#/${encodeURIComponent(chapter.slug)}${sectionId ? '/' + encodeURIComponent(sectionId) : ''}`;
  }

  /** Números da capa calculados a partir dos dados (antes eram fixos no HTML e podiam divergir). */
  function computeStats(chapters) {
    const count = (re) => chapters.reduce((n, c) => n + ((c.content || '').match(re) || []).length, 0);
    return {
      chapters: chapters.length,
      minutes: chapters.reduce((n, c) => n + (Number(c.readTime) || 0), 0),
      programs: count(/class="code-block-wrapper runnable"/g),
      diagrams: count(/<svg[\s>]|<pre class="mermaid"/g),
      challenges: count(/class="challenge-box"/g),
    };
  }

  return {
    normalize, slugify, escapeHtml, decodeEntities, htmlToText, splitSections,
    buildSearchIndex, search, snippet, highlightTerms, parseRoute, buildRoute, computeStats,
  };
});
