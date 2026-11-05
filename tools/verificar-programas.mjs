#!/usr/bin/env node
/**
 * Compila e executa TODOS os programas "▶ Program.cs — completo e executável" do livro
 * e compara a saída real com a saída impressa no capítulo.
 *
 * Uso:
 *   node tools/verificar-programas.mjs            # todos
 *   node tools/verificar-programas.mjs 3.4 8.3    # só alguns (capítulo.ordem)
 *   node tools/verificar-programas.mjs --keep     # mantém os projetos em .work/programas
 *
 * Requisitos: .NET SDK 8 (e SDK 10 para o exemplo marcado "Requer .NET 10").
 * Status:
 *   OK      saída idêntica
 *   VARIA   saída diferente, mas o livro avisa que tempos/contagens variam (console-note)
 *   DIFF    saída diferente SEM aviso no livro            -> falha
 *   ERRO    não compilou, saiu com código != 0 ou timeout -> falha
 *   PULADO  SDK necessário não instalado
 */
import { createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHAPTERS = require(path.join(root, 'js/chapters-data.js'));
const { decodeEntities } = require(path.join(root, 'js/core.js'));

const args = process.argv.slice(2);
const keep = args.includes('--keep');
const only = new Set(args.filter(a => /^\d+\.\d+$/.test(a)));
const workDir = path.join(root, '.work', 'programas');

const text = html => decodeEntities(String(html).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''));
const lines = s => s.replace(/\r/g, '').trim().split('\n').map(l => l.trimEnd());

/** Extrai { key, setup, code, expected, variable } de cada programa executável. */
function extract() {
  const programs = [];
  for (const ch of CHAPTERS) {
    const t = ch.content;
    let last = 0, n = 0, idx;
    while ((idx = t.indexOf('code-block-wrapper runnable', last)) !== -1) {
      n++;
      const setups = [...t.slice(last, idx).matchAll(/<p class="run-setup">([\s\S]*?)<\/p>/g)];
      const setup = setups.length ? text(setups.at(-1)[1].replace(/<br\s*\/?>/gi, '\n')) : '';
      const cs = t.indexOf('<code', idx);
      const ce = t.indexOf('</code></pre>', cs);
      const code = decodeEntities(t.slice(t.indexOf('>', cs) + 1, ce));
      const co = t.indexOf('class="console-output"', ce);
      const header = t.slice(co, t.indexOf('</div>', co));
      const ps = t.indexOf('<pre>', co), pe = t.indexOf('</pre>', ps);
      programs.push({
        key: `${ch.id}.${n}`, setup, code,
        expected: co - ce < 200 ? text(t.slice(ps + 5, pe)) : null,
        variable: /console-note/.test(header),
      });
      last = ce;
    }
  }
  return programs;
}

function installedSdks() {
  try {
    return execFileSync('dotnet', ['--list-sdks'], { encoding: 'utf8' })
      .split('\n').map(l => parseInt(l, 10)).filter(Number.isFinite);
  } catch {
    console.error('dotnet não encontrado no PATH. Instale o .NET SDK 8 ou superior.');
    process.exit(2);
  }
}

function project(p) {
  const web = /dotnet new web\b/.test(p.setup);
  const net10 = /\.NET 10/.test(p.setup);
  const packages = [...p.setup.matchAll(/dotnet add package ([\w.]+) --version ([\d.]+)/g)];
  const unsafe = /AllowUnsafeBlocks/.test(p.setup);
  const release = /-c Release/.test(p.setup);
  const csproj = `<Project Sdk="${web ? 'Microsoft.NET.Sdk.Web' : 'Microsoft.NET.Sdk'}">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>${net10 ? 'net10.0' : 'net8.0'}</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>${unsafe ? '\n    <AllowUnsafeBlocks>true</AllowUnsafeBlocks>' : ''}
  </PropertyGroup>
  <ItemGroup>${packages.map(([, n, v]) => `\n    <PackageReference Include="${n}" Version="${v}" />`).join('')}
  </ItemGroup>
</Project>
`;
  return { csproj, needsSdk: net10 ? 10 : 8, config: release ? 'Release' : 'Debug' };
}

const sdks = installedSdks();
const programs = extract().filter(p => !only.size || only.has(p.key));
fs.mkdirSync(workDir, { recursive: true });
const env = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: '1', DOTNET_NOLOGO: '1' };
const summary = { OK: 0, VARIA: 0, DIFF: 0, ERRO: 0, PULADO: 0 };
const failures = [];

for (const p of programs) {
  const { csproj, needsSdk, config } = project(p);
  if (!sdks.some(v => v >= needsSdk)) { summary.PULADO++; console.log(`PULADO ${p.key} (requer SDK ${needsSdk})`); continue; }

  const dir = path.join(workDir, p.key);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'App.csproj'), csproj);
  fs.writeFileSync(path.join(dir, 'Program.cs'), p.code);

  let status, detail = '';
  const build = spawnSync('dotnet', ['build', '-c', config, '-nologo', '-v', 'q'], { cwd: dir, env, encoding: 'utf8', timeout: 600_000 });
  if (build.status !== 0) {
    status = 'ERRO';
    detail = [...new Set((build.stdout || '').match(/error \w+:[^\[\r\n]*/g) || [])].slice(0, 5).join('\n') || build.stderr;
  } else {
    const run = spawnSync('dotnet', ['run', '--no-build', '-c', config], { cwd: dir, env, encoding: 'utf8', timeout: 240_000 });
    const out = run.stdout || '';
    if (run.error || run.status !== 0) {
      status = 'ERRO';
      detail = run.error ? String(run.error) : (run.stderr || '').slice(-600);
    } else if (p.expected === null) {
      status = 'OK';
    } else if (lines(out).join('\n') === lines(p.expected).join('\n')) {
      status = 'OK';
    } else {
      status = p.variable ? 'VARIA' : 'DIFF';
      if (!p.variable) detail = `--- esperado (livro)\n${p.expected}\n--- obtido\n${out.trim()}`;
    }
  }
  summary[status]++;
  console.log(`${status.padEnd(6)} ${p.key}`);
  if (status === 'DIFF' || status === 'ERRO') failures.push(`${p.key}: ${status}\n${detail}`);
  if (!keep) fs.rmSync(dir, { recursive: true, force: true });
}

console.log('\nResumo:', Object.entries(summary).map(([k, v]) => `${k}=${v}`).join('  '));
if (failures.length) {
  console.log('\nFalhas:\n\n' + failures.join('\n\n'));
  process.exit(1);
}
