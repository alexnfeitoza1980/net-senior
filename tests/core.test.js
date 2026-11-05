// Testes das funções puras do leitor. Rode: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../js/core.js');

const chapters = [
  { id: 1, slug: 'fundamentos-csharp', title: 'Fundamentos', desc: 'Tipos', tags: ['Span<T>'], readTime: 10,
    intro: 'Intro', content: '<h2>1.1 Sistema de Tipos</h2><p>Stack &amp; Heap</p><h3>Concorrência</h3><p>lock</p><h3>Concorrência</h3><p>x</p>' },
  { id: 2, slug: 'oop', title: 'OOP', desc: '', tags: [], readTime: 5, intro: '',
    content: '<div class="code-block-wrapper runnable"></div><pre class="mermaid">graph LR</pre><figure class="diagram"><svg viewBox="0 0 1 1"></svg></figure><div class="challenge-box"></div>' },
];

test('normalize remove acentos e caixa', () => {
  assert.equal(Core.normalize('Concorrência AÇÃO'), 'concorrencia acao');
});

test('slugify gera ids estáveis e seguros para URL', () => {
  assert.equal(Core.slugify('1.1 Sistema de Tipos'), '1-1-sistema-de-tipos');
  assert.equal(Core.slugify('Span<T> & Memory<T>'), 'span-t-memory-t');
  assert.equal(Core.slugify('!!!'), 'secao');
});

test('escapeHtml neutraliza HTML', () => {
  assert.equal(Core.escapeHtml('<img src=x onerror="a">'), '&lt;img src=x onerror=&quot;a&quot;&gt;');
});

test('htmlToText decodifica entidades e ignora SVG e Mermaid', () => {
  assert.equal(Core.htmlToText('<p>a &lt;b&gt;</p><svg><text>lixo</text></svg><pre class="mermaid">graph</pre> c'), 'a <b> c');
});

test('splitSections cria ids únicos mesmo com títulos repetidos', () => {
  const ids = Core.splitSections(chapters[0].content).filter(s => s.level).map(s => s.id);
  assert.deepEqual(ids, ['1-1-sistema-de-tipos', 'concorrencia', 'concorrencia-2']);
});

test('busca ignora acento, exige todos os termos e aponta a seção', () => {
  const index = Core.buildSearchIndex(chapters);
  const hits = Core.search(index, 'concorrencia lock');
  assert.equal(hits[0].entry.sectionId, 'concorrencia');
  assert.equal(Core.search(index, 'inexistente').length, 0);
  assert.equal(Core.search(index, 'a').length, 0, 'termos de 1 letra são ignorados');
});

test('highlightTerms escapa o texto e não quebra entidades', () => {
  const html = Core.highlightTerms('Stack & Heap <script>', 'heap');
  assert.equal(html, 'Stack &amp; <mark>Heap</mark> &lt;script&gt;');
  assert.equal(Core.highlightTerms('Concorrência', 'concorrencia'), '<mark>Concorrência</mark>');
});

test('rotas: parse e build são inversas', () => {
  assert.deepEqual(Core.parseRoute('', chapters), { view: 'home' });
  assert.deepEqual(Core.parseRoute('#/oop', chapters), { view: 'chapter', chapterId: 2, sectionId: null });
  assert.deepEqual(Core.parseRoute('#/2', chapters), { view: 'chapter', chapterId: 2, sectionId: null });
  assert.equal(Core.parseRoute('#/nao-existe', chapters).view, 'home');
  const r = Core.buildRoute(chapters[0], '1-1-sistema-de-tipos');
  assert.deepEqual(Core.parseRoute(r, chapters), { view: 'chapter', chapterId: 1, sectionId: '1-1-sistema-de-tipos' });
});

test('computeStats conta a partir do conteúdo', () => {
  assert.deepEqual(Core.computeStats(chapters), { chapters: 2, minutes: 15, programs: 1, diagrams: 2, challenges: 1 });
});
