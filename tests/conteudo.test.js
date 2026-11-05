// Validação estrutural do conteúdo real do livro (js/chapters-data.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const CHAPTERS = require('../js/chapters-data.js');
const Core = require('../js/core.js');

const REQUIRED = ['id', 'slug', 'icon', 'color', 'title', 'desc', 'tags', 'readTime', 'intro', 'content'];

test('cada capítulo tem os campos obrigatórios', () => {
  for (const ch of CHAPTERS) for (const k of REQUIRED) assert.ok(ch[k] !== undefined && ch[k] !== '', `cap ${ch.id} sem ${k}`);
});

test('ids sequenciais e slugs únicos e válidos', () => {
  CHAPTERS.forEach((ch, i) => assert.equal(ch.id, i + 1));
  const slugs = CHAPTERS.map(c => c.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  slugs.forEach(s => assert.match(s, /^[a-z0-9-]+$/));
});

test('todo programa executável tem a saída logo abaixo', () => {
  for (const ch of CHAPTERS) {
    const parts = ch.content.split('code-block-wrapper runnable').slice(1);
    parts.forEach((p, i) => {
      const end = p.indexOf('</code></pre>');
      const out = p.indexOf('class="console-output"', end);
      assert.ok(end > -1 && out > -1 && out - end < 200, `cap ${ch.id}, programa ${i + 1}: sem bloco de saída logo abaixo`);
    });
  }
});

test('blocos de código declaram linguagem e têm botão copiar', () => {
  for (const ch of CHAPTERS) {
    const wrappers = (ch.content.match(/class="code-block-wrapper/g) || []).length;
    const copy = (ch.content.match(/class="copy-btn"/g) || []).length;
    const langs = (ch.content.match(/<code class="language-[a-z]+"/g) || []).length;
    assert.equal(copy, wrappers, `cap ${ch.id}: copiar`);
    assert.ok(langs >= wrappers, `cap ${ch.id}: linguagem`);
  }
});

test('código dentro de <code> não tem "<" cru (precisa ser &lt;)', () => {
  for (const ch of CHAPTERS) {
    for (const m of ch.content.matchAll(/<code class="language-[^"]+">([\s\S]*?)<\/code>/g)) {
      assert.ok(!/<(?!\/?(span|mark|strong|em)\b)/.test(m[1]), `cap ${ch.id}: "<" não escapado em bloco de código`);
    }
  }
});

test('links externos usam https', () => {
  for (const ch of CHAPTERS) for (const m of ch.content.matchAll(/href="(http[^"]*)"/g)) assert.match(m[1], /^https:/, `cap ${ch.id}`);
});

test('imagens existem em disco e têm texto alternativo', () => {
  const fs = require('node:fs'), path = require('node:path');
  for (const ch of CHAPTERS) for (const m of ch.content.matchAll(/<img([^>]*)>/g)) {
    const src = /src="([^"]+)"/.exec(m[1])[1];
    assert.ok(fs.existsSync(path.join(__dirname, '..', src)), `imagem ausente: ${src}`);
    assert.match(m[1], /alt="[^"]+"/, `sem alt: ${src}`);
  }
});

test('os números da capa batem com o conteúdo', () => {
  const s = Core.computeStats(CHAPTERS);
  assert.equal(s.chapters, 9);
  assert.equal(s.programs, 77);
  assert.equal(s.challenges, 9);
  assert.equal(s.diagrams, 59);
});

test('busca encontra termos reais do livro sem acento', () => {
  const idx = Core.buildSearchIndex(CHAPTERS);
  for (const q of ['span', 'concorrencia', 'outbox', 'jwt', 'garbage collector']) {
    assert.ok(Core.search(idx, q).length > 0, `nada para "${q}"`);
  }
});
