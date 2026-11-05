/* ============================================================
   GUIA DEFINITIVO DO DESENVOLVEDOR SÊNIOR .NET / C#
   Todos os 9 capítulos — conteúdo completo
============================================================ */
const CHAPTERS = [
/* ══════════════════════════════════════════════════════════
   CAPÍTULO 1 — FUNDAMENTOS AVANÇADOS DO C#
══════════════════════════════════════════════════════════ */
{
  id: 1, slug: 'fundamentos-csharp', icon: '⚡', color: '#3b82f6',
  title: 'Fundamentos Avançados do C#',
  subtitle: 'O que o runtime realmente faz com seu código',
  desc: 'Sistema de tipos, programação funcional, Pattern Matching, Records, Span<T>, Generic Math e os recursos modernos da linguagem.',
  tags: ['Tipos','LINQ','Pattern Matching','Records','Span<T>'],
  readTime: 40,
  intro: `Você não pode dominar C# sem entender o que o runtime faz com seu código. A linguagem evoluiu de
    forma impressionante — de tipagem estática simples para recursos como <em>Pattern Matching</em>,
    <em>Records</em>, <em>Span&lt;T&gt;</em> e <em>Generic Math</em>. Este capítulo cobre os fundamentos
    que separam quem conhece a sintaxe de quem compreende os mecanismos internos.`,
  content: `
<div class="info-box info">
  <div class="info-box-label">🧭 Como estudar este capítulo</div>
  <p>Cada tópico segue o roteiro: <strong>📘 conceito</strong> → <strong>💡 exemplo do dia a dia</strong> → <strong>🖼️ diagrama</strong> (quando ajuda) → <strong>▶️ programa completo</strong> para rodar, com a saída real. Todos os programas foram compilados e executados no .NET 8. Para rodar: <code>dotnet new console -n Capitulo1</code>, cole o exemplo em <code>Program.cs</code> e execute <code>dotnet run</code> — ou use <a href="https://dotnetfiddle.net" target="_blank">dotnetfiddle.net</a> direto no navegador.</p>
</div>

<h2>1.1 Sistema de Tipos</h2>

<p>O sistema de tipos do C# define como a linguagem entende, protege e lida com os dados da sua aplicação. Mais do que evitar erros de compilação, a forma como a linguagem armazena essas informações em memória — seja na <strong>Stack</strong> (pilha) ou no <strong>Heap</strong> (monte) — define se o seu software será rápido ou terá problemas de desempenho.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Sua Mesa vs. Sala de Arquivos (Stack vs Heap)</div>
  <p>Para entender a alocação de memória de um jeito simples, imagine como você organiza o seu trabalho no escritório:</p>
  <ul>
    <li><strong>A Mesa de Trabalho (Stack):</strong> É onde você resolve as coisas rápidas. Você pega um post-it, anota um número, usa e joga fora imediatamente. O acesso é imediato e a mesa fica limpa assim que a tarefa acaba. É aqui que vivem as <em>variáveis locais</em> de tipos de valor (como um <code>int</code> ou uma <code>struct</code> declarados dentro de um método).</li>
    <li><strong>A Sala de Arquivos (Heap):</strong> É onde você guarda os documentos maiores, como caixas de relatórios (textos grandes, instâncias de classes). Cabe muita coisa lá, mas toda vez que a sala fica bagunçada, a equipe da faxina (o <strong>Garbage Collector</strong>) precisa entrar, mandar todo mundo parar de trabalhar e recolher as caixas que ninguém usa mais.</li>
  </ul>
  <p><strong>A Lição Técnica:</strong> Se o seu código ficar criando objetos pesados a todo momento (mandando cópias para a Sala de Arquivos em operações que poderiam ser simples), a "faxina" vai ser chamada com frequência, travando a sua aplicação. O segredo do código de alta performance é usar a Mesa de Trabalho sempre que possível, evitando criar "lixo" desnecessário na sala de arquivos.</p>

  <pre class="mermaid">
  graph LR
    subgraph Stack ["Mesa de Trabalho (Stack)"]
      A[Post-its / Tipos de Valor] --> B[Rápido e Prático]
      B --> C[Lixo descartado instantaneamente]
    end
    
    subgraph Heap ["Sala de Arquivos (Heap)"]
      D[Caixas / Tipos de Referência] --> E[Lixo se acumula]
      E --> F{Faxina do Garbage Collector}
      F -->|Para o sistema!| G[Lentidão na Aplicação]
    end
    
    classDef good fill:#3b82f6,stroke:#333,stroke-width:2px,color:#fff;
    classDef bad fill:#ef4444,stroke:#333,stroke-width:2px,color:#fff;
    class C good
    class G bad
  </pre>
</div>

<p>O sistema de tipos do C# é <strong>estático e fortemente tipado</strong>: o compilador sabe o tipo de cada variável antes de o programa rodar e impede misturas perigosas. Entender como valores e referências são guardados e copiados é o que separa quem "faz funcionar" de quem entende por que funciona.</p>

<h3>1.1.1 Tipos de Valor vs. Referência</h3>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Cópia vs. Chave do Armário</div>
  <p><strong>Tipo de Valor:</strong> É como entregar uma fotocópia de um relatório para alguém. Se a pessoa riscar a cópia dela, a sua original fica intacta.</p>
  <p><strong>Tipo de Referência:</strong> É como entregar a chave de um armário. Se a pessoa abrir o armário e bagunçar tudo, quando você usar a sua chave para abrir, vai encontrar a bagunça lá. Vocês dois apontam para o mesmo lugar.</p>
  <figure class="illustration">
    <img src="img/value-vs-reference.webp" alt="Ilustração: à esquerda, alguém entrega uma cópia de um relatório; à direita, alguém entrega a chave de um armário" loading="lazy" width="1024" height="1024" />
    <figcaption>Cópia (tipo de valor) vs. chave compartilhada (tipo de referência)</figcaption>
  </figure>
</div>

<p class="step-label">📘 O conceito</p>
<p>Uma variável de <strong>tipo de valor</strong> (<code>struct</code>, <code>int</code>, <code>bool</code>, <code>DateTime</code>) <em>contém o próprio dado</em>: atribuir a outra variável copia tudo. Uma variável de <strong>tipo de referência</strong> (<code>class</code>, <code>string</code>, arrays) contém só a "chave" de um objeto que vive no heap: atribuir copia a chave, e as duas variáveis enxergam o mesmo objeto.</p><p><strong>Boxing</strong> é o que acontece quando um valor precisa ser tratado como <code>object</code>: o runtime cria um objeto no heap e copia o valor para dentro — uma alocação escondida que, em laços, vira trabalho para o Garbage Collector.</p>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 290" role="img" aria-label="Memória após executar o código: a e b são duas cópias independentes na stack; c1 e c2 são duas referências na stack apontando para o mesmo objeto Container no heap">
    <defs><marker id="arr-mem" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="panel" x="10" y="10" width="290" height="270" rx="12"/>
    <text class="t-title" x="30" y="36">STACK — frame do método</text>
    <text class="t-mono" x="30" y="77">a</text>
    <rect class="box-good" x="70" y="56" width="210" height="32" rx="6"/>
    <text class="t-mono" x="84" y="77">Point { X = 1,  Y = 2 }</text>
    <text class="t-mono" x="30" y="125">b</text>
    <rect class="box-good" x="70" y="104" width="210" height="32" rx="6"/>
    <text class="t-mono" x="84" y="125">Point { X = 99, Y = 2 }</text>
    <text class="t-muted" x="30" y="158">↑ duas cópias: mudar b não afeta a</text>
    <text class="t-mono" x="30" y="203">c1</text>
    <rect class="box" x="70" y="182" width="210" height="32" rx="6"/>
    <text class="t-mono" x="84" y="203">ref → 0x7F3A</text>
    <text class="t-mono" x="30" y="251">c2</text>
    <rect class="box" x="70" y="230" width="210" height="32" rx="6"/>
    <text class="t-mono" x="84" y="251">ref → 0x7F3A</text>
    <rect class="panel" x="420" y="10" width="290" height="270" rx="12"/>
    <text class="t-title" x="440" y="36">HEAP GERENCIADO</text>
    <text class="t-muted" x="440" y="70">Só existe UM objeto:</text>
    <text class="t-muted" x="440" y="90">c1 e c2 são duas chaves</text>
    <text class="t-muted" x="440" y="110">para o mesmo armário.</text>
    <rect class="box-accent" x="450" y="170" width="230" height="96" rx="8"/>
    <text x="466" y="194" font-weight="600">Container  @0x7F3A</text>
    <rect class="box-good" x="466" y="206" width="198" height="30" rx="6"/>
    <text class="t-mono" x="478" y="226">Value: int = 99</text>
    <text class="t-muted" x="466" y="256">um int… morando no heap!</text>
    <path class="line" d="M280,198 C360,198 380,200 448,205" marker-end="url(#arr-mem)"/>
    <path class="line" d="M280,246 C360,246 380,236 448,232" marker-end="url(#arr-mem)"/>
  </svg>
  <figcaption>Estado da memória depois do código abaixo. Repare no <code>Value</code>: um tipo de valor dentro de um objeto vive no heap.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// struct: a variável GUARDA o próprio dado → atribuir = copiar tudo
Ponto a = new(1, 2);
Ponto b = a;
b.X = 99;
Console.WriteLine($"struct -&gt; a.X = {a.X}, b.X = {b.X}");

// class: a variável guarda uma REFERÊNCIA → atribuir = copiar a "chave"
var c1 = new Caixa { Valor = 1 };
var c2 = c1;
c2.Valor = 99;
Console.WriteLine($"class  -&gt; c1.Valor = {c1.Valor}, c2.Valor = {c2.Valor}");
Console.WriteLine($"c1 e c2 são o mesmo objeto? {ReferenceEquals(c1, c2)}");

// Boxing: guardar um int onde se espera "object" cria um objeto novo no heap
const int N = 1_000;
object[] comoObject = new object[N];
int[] comoInt = new int[N];

long antes = GC.GetAllocatedBytesForCurrentThread();
for (int i = 0; i &lt; N; i++) comoObject[i] = i;      // boxing a cada volta
long comBoxing = GC.GetAllocatedBytesForCurrentThread() - antes;

antes = GC.GetAllocatedBytesForCurrentThread();
for (int i = 0; i &lt; N; i++) comoInt[i] = i;         // o int vai direto para o array
long semBoxing = GC.GetAllocatedBytesForCurrentThread() - antes;

Console.WriteLine($"Com boxing: {comBoxing} bytes alocados no heap");
Console.WriteLine($"Sem boxing: {semBoxing} bytes alocados no heap");

struct Ponto(int x, int y)
{
    public int X = x;
    public int Y = y;
}

class Caixa
{
    public int Valor;
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>struct -&gt; a.X = 1, b.X = 99
class  -&gt; c1.Valor = 99, c2.Valor = 99
c1 e c2 são o mesmo objeto? True
Com boxing: 24000 bytes alocados no heap
Sem boxing: 0 bytes alocados no heap</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>Ponto b = a</code> copia a struct inteira: mudar <code>b.X</code> não afeta <code>a</code>.</li>
  <li><code>var c2 = c1</code> copia só a referência: <code>ReferenceEquals</code> confirma que é o mesmo objeto.</li>
  <li><code>GC.GetAllocatedBytesForCurrentThread()</code> mede quantos bytes o código alocou no heap. Cada <code>int</code> "embrulhado" em <code>object</code> custa 24 bytes num processo de 64 bits: 1.000 × 24 = 24.000.</li>
  <li>Guardar os mesmos números num <code>int[]</code> não aloca nada, porque o array já existia e os valores vão direto para dentro dele.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Mito comum: "struct sempre vai para a stack"</div>
  <p>A diferença real entre valor e referência é a <strong>semântica de cópia</strong>, não o lugar na memória. Onde o dado mora depende de <em>onde a variável é declarada</em>:</p>
  <ul>
    <li><strong>Variável local</strong> de tipo de valor → normalmente na stack (ou até só em registradores da CPU).</li>
    <li><strong>Campo de uma classe</strong> (como o <code>Value</code> do diagrama) → dentro do objeto, no heap.</li>
    <li><strong>Elemento de array</strong> (<code>int[]</code>) → inline no array, que está no heap.</li>
    <li><strong>Variável capturada</strong> por lambda ou usada depois de um <code>await</code> → promovida para um objeto no heap (closure / state machine).</li>
    <li><strong>Boxing</strong> (<code>object o = 42</code>) → uma cópia é embrulhada num objeto no heap.</li>
  </ul>
  <p>Numa entrevista sênior, responder "struct fica na stack" sem essas ressalvas é um sinal de alerta. A exceção são os <code>ref struct</code> (como <code>Span&lt;T&gt;</code>): o compilador <em>proíbe</em> que eles escapem para o heap.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Valor copia o dado; referência copia a chave; e boxing é uma alocação escondida que vale evitar em código executado muitas vezes.</p>
</div>

<h3>1.1.2 Nullable Reference Types (C# 8+)</h3>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A Caixa Misteriosa</div>
  <p>Sem Nullable Types, toda caixa no escritório (variável) pode ou não estar vazia, e você só descobre abrindo (o que pode causar um erro catastrófico — o <code>NullReferenceException</code>).</p>
  <p>Com Nullable Types ativados, a caixa ganha uma etiqueta obrigatória: se a etiqueta tem um <strong>"?"</strong>, ela <em>pode</em> estar vazia, e você é forçado a verificar antes de usar. Se não tem o "?", o sistema garante que sempre haverá um objeto lá dentro.</p>
  <figure class="illustration">
    <img src="img/nullable-types.webp" alt="Ilustração: uma caixa de arquivos cheia ao lado de uma caixa marcada com um ponto de interrogação" loading="lazy" width="1024" height="1024" />
    <figcaption><code>string</code> sempre tem conteúdo; <code>string?</code> pode estar vazia — verifique antes de abrir</figcaption>
  </figure>
</div>

<p class="step-label">📘 O conceito</p>
<p>Com <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> (ligado por padrão em projetos novos), o compilador passa a diferenciar <code>string</code> ("nunca é nulo") de <code>string?</code> ("pode ser nulo") e <strong>avisa</strong> quando você usa algo que pode ser nulo sem verificar. O objetivo é trocar o <code>NullReferenceException</code> em produção por um aviso no editor.</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">Exemplo.csproj</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-xml">&lt;PropertyGroup&gt;
  &lt;Nullable&gt;enable&lt;/Nullable&gt;
  &lt;!-- Opcional, recomendado: transforma avisos de nulidade em erros de compilação --&gt;
  &lt;WarningsAsErrors&gt;nullable&lt;/WarningsAsErrors&gt;
&lt;/PropertyGroup&gt;</code></pre>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Em projetos novos, &lt;Nullable&gt;enable&lt;/Nullable&gt; já vem ligado no .csproj
string? apelido = null;   // com "?": pode ser nulo — e o compilador passa a vigiar
string nome = "Ana";      // sem "?": promessa de que nunca é nulo

Saudar(nome);
Saudar(apelido);
Console.WriteLine($"Tamanho do apelido: {apelido?.Length ?? 0}");

Cliente? cliente = BuscarCliente(42);
// Console.WriteLine(cliente.Nome);   // ⚠️ aviso CS8602: "cliente" pode ser nulo aqui
if (cliente is not null)
    Console.WriteLine($"Achou: {cliente.Nome}");   // aqui dentro o compilador sabe que não é nulo
else
    Console.WriteLine("Cliente 42 não existe");

try
{
    Cadastrar(null!);   // "!" cala o compilador... e o problema aparece na execução
}
catch (ArgumentNullException ex)
{
    Console.WriteLine($"Erro: o parâmetro '{ex.ParamName}' é obrigatório");
}

// ?? = "se for nulo, use isto"
static void Saudar(string? nome) =&gt; Console.WriteLine($"Olá, {nome ?? "visitante"}!");

static Cliente? BuscarCliente(int id) =&gt; id == 1 ? new Cliente("Ana") : null;

static void Cadastrar(string email)
{
    ArgumentNullException.ThrowIfNull(email);   // guarda de entrada: falha cedo e com clareza
    Console.WriteLine($"Cadastrado: {email}");
}

record Cliente(string Nome);</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Olá, Ana!
Olá, visitante!
Tamanho do apelido: 0
Cliente 42 não existe
Erro: o parâmetro 'email' é obrigatório</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>apelido?.Length</code> (<em>null-conditional</em>): se <code>apelido</code> for nulo, o resultado é nulo em vez de uma exceção. O <code>?? 0</code> troca esse nulo por zero.</li>
  <li>Descomentar <code>Console.WriteLine(cliente.Nome)</code> gera o aviso <strong>CS8602</strong>. Depois do <code>if (cliente is not null)</code>, o compilador sabe que é seguro.</li>
  <li><code>null!</code> (<em>null-forgiving</em>) diz ao compilador "confie em mim". Use com muita parcimônia: aqui ele deixa passar um nulo que só é pego em execução.</li>
  <li><code>ArgumentNullException.ThrowIfNull</code> é a guarda de entrada padrão: falha cedo, com o nome do parâmetro na mensagem.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>O <code>?</code> no tipo é um contrato: o compilador cobra a verificação antes do uso, e o <code>!</code> é uma exceção consciente, não um atalho.</p>
</div>

<h3>1.1.3 Span&lt;T&gt; e Memory&lt;T&gt;</h3>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Lendo o Pergaminho</div>
  <p>Se você precisa ler um parágrafo no meio de um pergaminho longo, a abordagem antiga era recortar com uma tesoura aquele pedaço (criar uma nova <code>string</code>) e jogar fora depois, criando muito lixo.</p>
  <p>Com o <code>Span&lt;T&gt;</code>, você apenas pega uma moldura de papelão e coloca sobre a frase que quer ler. Você enxerga apenas aquela fatia, não corta o papel original e não gera nenhum lixo.</p>
  <figure class="illustration">
    <img src="img/span-memory.webp" alt="Ilustração: uma pessoa posiciona uma moldura sobre um trecho de um pergaminho para lê-lo sem recortá-lo" loading="lazy" width="1024" height="1024" />
    <figcaption>A moldura mostra só o trecho, sem recortar o original</figcaption>
  </figure>
</div>

<p class="step-label">📘 O conceito</p>
<p><code>Span&lt;T&gt;</code> é uma "janela" sobre um pedaço contínuo de memória (um array, uma string, um buffer na stack) que permite ler e fatiar <strong>sem copiar</strong>. Por ser um <code>ref struct</code>, ele só pode viver na stack — não pode ser campo de classe nem atravessar um <code>await</code>. Para esses casos existe <code>Memory&lt;T&gt;</code>, a versão que pode ser guardada no heap.</p>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 265" role="img" aria-label="A string João;32;SP no heap. AsSpan(5, 2) cria uma janela sobre os índices 5 e 6 sem copiar nada; Substring(5, 2) copia os caracteres para uma nova string no heap">
    <defs>
      <marker id="arr-span-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker>
      <marker id="arr-span-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker>
    </defs>
    <text class="t-mono" x="10" y="72">line</text>
    <text class="t-muted" x="10" y="90">(heap)</text>
    <rect class="box" x="130" y="50" width="46" height="40"/><text class="t-mono" x="153" y="76" text-anchor="middle">J</text><text class="t-muted" x="153" y="106" text-anchor="middle">0</text>
    <rect class="box" x="176" y="50" width="46" height="40"/><text class="t-mono" x="199" y="76" text-anchor="middle">o</text><text class="t-muted" x="199" y="106" text-anchor="middle">1</text>
    <rect class="box" x="222" y="50" width="46" height="40"/><text class="t-mono" x="245" y="76" text-anchor="middle">ã</text><text class="t-muted" x="245" y="106" text-anchor="middle">2</text>
    <rect class="box" x="268" y="50" width="46" height="40"/><text class="t-mono" x="291" y="76" text-anchor="middle">o</text><text class="t-muted" x="291" y="106" text-anchor="middle">3</text>
    <rect class="box" x="314" y="50" width="46" height="40"/><text class="t-mono" x="337" y="76" text-anchor="middle">;</text><text class="t-muted" x="337" y="106" text-anchor="middle">4</text>
    <rect class="box" x="360" y="50" width="46" height="40"/><text class="t-mono" x="383" y="76" text-anchor="middle">3</text><text class="t-muted" x="383" y="106" text-anchor="middle">5</text>
    <rect class="box" x="406" y="50" width="46" height="40"/><text class="t-mono" x="429" y="76" text-anchor="middle">2</text><text class="t-muted" x="429" y="106" text-anchor="middle">6</text>
    <rect class="box" x="452" y="50" width="46" height="40"/><text class="t-mono" x="475" y="76" text-anchor="middle">;</text><text class="t-muted" x="475" y="106" text-anchor="middle">7</text>
    <rect class="box" x="498" y="50" width="46" height="40"/><text class="t-mono" x="521" y="76" text-anchor="middle">S</text><text class="t-muted" x="521" y="106" text-anchor="middle">8</text>
    <rect class="box" x="544" y="50" width="46" height="40"/><text class="t-mono" x="567" y="76" text-anchor="middle">P</text><text class="t-muted" x="567" y="106" text-anchor="middle">9</text>
    <rect class="window" x="357" y="44" width="98" height="52" rx="6"/>
    <text class="t-good t-mono" x="560" y="30" text-anchor="middle">line.AsSpan(5, 2)</text>
    <path class="line-good" d="M488,34 L456,44" marker-end="url(#arr-span-good)"/>
    <text class="t-muted" x="560" y="130" text-anchor="middle">↑ AsSpan: janela sobre o original · 0 bytes alocados</text>
    <path class="line-bad" d="M406,112 L406,170" marker-end="url(#arr-span-bad)"/>
    <text class="t-bad t-mono" x="348" y="150" text-anchor="end">line.Substring(5, 2)</text>
    <rect class="box-bad" x="360" y="176" width="46" height="40"/><text class="t-mono" x="383" y="202" text-anchor="middle">3</text>
    <rect class="box-bad" x="406" y="176" width="46" height="40"/><text class="t-mono" x="429" y="202" text-anchor="middle">2</text>
    <text class="t-muted" x="468" y="192">nova string no heap: cópia +</text>
    <text class="t-muted" x="468" y="208">mais trabalho para o GC</text>
    <text class="t-muted" x="10" y="250">Num loop que processa milhões de linhas, essa diferença vira milhões de objetos a menos para o GC.</text>
  </svg>
  <figcaption>O <code>Span</code> é a moldura sobre o pergaminho: aponta para um trecho do dado original em vez de copiá-lo.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">string linha = "João;32;São Paulo;Engenheira";
const int Repeticoes = 1_000;

// Jeito 1: Split cria um array + uma string nova para CADA campo
long antes = GC.GetAllocatedBytesForCurrentThread();
int soma1 = 0;
for (int i = 0; i &lt; Repeticoes; i++)
{
    string[] campos = linha.Split(';');
    soma1 += int.Parse(campos[1]);
}
long bytesSplit = GC.GetAllocatedBytesForCurrentThread() - antes;

// Jeito 2: Span só "aponta" para o trecho da string original
antes = GC.GetAllocatedBytesForCurrentThread();
int soma2 = 0;
for (int i = 0; i &lt; Repeticoes; i++)
{
    ReadOnlySpan&lt;char&gt; resto = linha.AsSpan();
    resto = resto[(resto.IndexOf(';') + 1)..];              // pula o nome
    ReadOnlySpan&lt;char&gt; idade = resto[..resto.IndexOf(';')];  // janela sobre "32"
    soma2 += int.Parse(idade);
}
long bytesSpan = GC.GetAllocatedBytesForCurrentThread() - antes;

Console.WriteLine($"Mesmo resultado? {soma1 == soma2} (soma = {soma1})");
Console.WriteLine($"string.Split : {bytesSplit,7} bytes alocados");
Console.WriteLine($"Span&lt;char&gt;   : {bytesSpan,7} bytes alocados");

// stackalloc: buffer temporário na stack, liberado sozinho ao fim do método
Span&lt;int&gt; quadrados = stackalloc int[5];
for (int i = 0; i &lt; quadrados.Length; i++) quadrados[i] = i * i;
Console.WriteLine($"Quadrados: {string.Join(", ", quadrados.ToArray())}");</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(bytes alocados variam um pouco conforme a versão do runtime)</span></div>
  <pre>Mesmo resultado? True (soma = 32000)
string.Split :  209888 bytes alocados
Span&lt;char&gt;   :       0 bytes alocados
Quadrados: 0, 1, 4, 9, 16</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>linha.Split(';')</code> cria um array e 4 strings novas a cada chamada. Em 1.000 repetições, isso passa de 200 KB de lixo para o GC recolher.</li>
  <li><code>linha.AsSpan()</code> cria a janela; <code>resto[(i + 1)..]</code> e <code>resto[..j]</code> são fatias (<em>ranges</em>) que só mudam o começo e o tamanho da janela.</li>
  <li><code>int.Parse</code> aceita um <code>ReadOnlySpan&lt;char&gt;</code> diretamente: nenhuma string é criada.</li>
  <li><code>stackalloc</code> reserva um buffer na stack, que é liberado automaticamente quando o método termina. Use só para tamanhos pequenos e conhecidos.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p><code>Span</code> é a moldura sobre o pergaminho: lê o trecho sem recortar, e em código que roda milhões de vezes isso vira muito menos trabalho para o GC.</p>
</div>

<h3>1.1.4 Tuples e Tipos Anônimos</h3>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A Bandeja de Café</div>
  <p>Às vezes você precisa carregar um café e um donut juntos apenas por um breve momento, da cafeteria até a sua mesa. Não faz sentido projetar e fabricar uma lancheira plástica definitiva só para isso.</p>
  <p>As <strong>Tuplas (Tuples)</strong> são como uma bandeja improvisada de papelão: perfeitas para carregar dois ou mais itens rapidamente, sem precisar criar uma classe nova e pesada só para transportá-los entre dois métodos.</p>
</div>

<p class="step-label">📘 O conceito</p>
<p>Uma <strong>tupla</strong> agrupa alguns valores temporariamente, com nomes, sem criar uma classe: ótima para um método que precisa devolver dois ou três valores. <strong>Tipos anônimos</strong> (<code>new { ... }</code>) fazem algo parecido, mas só existem dentro do método — o uso típico é em projeções LINQ.</p>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

decimal[] precos = [19.90m, 5.50m, 42.00m, 12.75m];

// Tupla nomeada: devolver dois valores sem criar uma classe só para isso
var faixa = FaixaDePreco(precos);
Console.WriteLine($"Mais barato: {faixa.Minimo} | Mais caro: {faixa.Maximo}");

// Desconstrução: "desembrulhar" a tupla direto em variáveis
var (min, max) = FaixaDePreco(precos);
Console.WriteLine($"Diferença: {max - min}");

// Trocar duas variáveis sem variável auxiliar
int x = 1, y = 2;
(x, y) = (y, x);
Console.WriteLine($"x = {x}, y = {y}");

// Agrupar por mais de uma chave com LINQ
var vendas = new[]
{
    (Mes: 1, Loja: "Centro", Valor: 100m),
    (Mes: 1, Loja: "Centro", Valor: 50m),
    (Mes: 2, Loja: "Norte",  Valor: 70m),
};
foreach (var grupo in vendas.GroupBy(v =&gt; (v.Mes, v.Loja)))
    Console.WriteLine($"Mês {grupo.Key.Mes}, loja {grupo.Key.Loja}: {grupo.Sum(v =&gt; v.Valor)}");

// Tipo anônimo: útil dentro de um método, geralmente em consultas LINQ
var resumo = new { Total = precos.Sum(), Quantidade = precos.Length };
Console.WriteLine($"{resumo.Quantidade} itens somando {resumo.Total}");

static (decimal Minimo, decimal Maximo) FaixaDePreco(decimal[] valores) =&gt;
    (valores.Min(), valores.Max());</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Mais barato: 5,50 | Mais caro: 42,00
Diferença: 36,50
x = 2, y = 1
Mês 1, loja Centro: 150
Mês 2, loja Norte: 70
4 itens somando 80,15</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>(decimal Minimo, decimal Maximo)</code> no retorno dá nomes aos campos: quem chama escreve <code>faixa.Minimo</code> em vez de <code>faixa.Item1</code>.</li>
  <li><code>var (min, max) = ...</code> é a desconstrução: cada campo vai para uma variável.</li>
  <li><code>(x, y) = (y, x)</code> troca os valores sem variável auxiliar.</li>
  <li><code>GroupBy(v =&gt; (v.Mes, v.Loja))</code> usa a tupla como chave composta: tuplas comparam por valor.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Quando NÃO usar tupla</div>
  <p>Se a tupla atravessa várias camadas ou aparece em uma API pública, crie um <code>record</code>: ele tem nome, documentação e pode ganhar validação. Tupla é para o "trajeto curto" — a bandeja de papelão, não a mudança de casa.</p>
</div>

<h2>1.2 Programação Funcional em C#</h2>

<p>C# não é uma linguagem puramente funcional, mas incorporou as melhores ideias desse estilo: <strong>funções como valores</strong>, consultas declarativas (LINQ) e sequências preguiçosas. Dominar isso deixa o código mais curto, mais fácil de testar e — quando bem usado — mais eficiente.</p>

<h3>1.2.1 Delegates, Func e Action</h3>

<p class="step-label">📘 O conceito</p>
<p>Um <strong>delegate</strong> é uma variável que guarda uma <em>função</em>. Com ele, você passa comportamento como parâmetro: o método recebe "o que fazer" sem saber os detalhes. Os tipos prontos cobrem quase tudo:</p><ul><li><code>Func&lt;T1, T2, TResult&gt;</code> — recebe parâmetros e <strong>devolve</strong> um valor (o último tipo é o retorno).</li><li><code>Action&lt;T&gt;</code> — recebe parâmetros e <strong>não devolve</strong> nada.</li><li><code>Predicate&lt;T&gt;</code> — recebe um valor e devolve <code>bool</code>.</li></ul><p>A sintaxe <code>x =&gt; x * 2</code> é uma <strong>lambda</strong>: uma função sem nome, escrita no próprio lugar em que é usada.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O bilhete com instruções</div>
  <p>Você sai de férias e deixa um bilhete para o vizinho: "rega as plantas às 18h". O vizinho (o método) não precisa saber quais são as suas plantas; ele só executa a instrução que você entregou. Amanhã, outro bilhete ("dá comida ao gato") — mesmo vizinho, outra instrução. O delegate é esse bilhete.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// Delegate = uma variável que guarda uma FUNÇÃO
Func&lt;int, int, int&gt; somar = (a, b) =&gt; a + b;                           // recebe 2 ints, devolve int
Action&lt;string&gt; registrar = msg =&gt; Console.WriteLine($"[LOG] {msg}");   // não devolve nada
Predicate&lt;int&gt; ehPar = n =&gt; n % 2 == 0;                                // devolve bool

registrar($"2 + 3 = {somar(2, 3)}");
registrar($"4 é par? {ehPar(4)}");

// Passar COMPORTAMENTO como parâmetro: o método não sabe qual regra vai aplicar
List&lt;decimal&gt; precos = [100m, 250m, 80m];
Aplicar(precos, p =&gt; p * 0.9m, "10% de desconto");
Aplicar(precos, p =&gt; p + 15m, "frete fixo de 15");

// Composição: juntar duas funções em uma só
Func&lt;int, double&gt; raiz = n =&gt; Math.Sqrt(n);
Func&lt;double, string&gt; formatar = d =&gt; d.ToString("F2");
Func&lt;int, string&gt; raizFormatada = Compor(raiz, formatar);
registrar($"raiz de 16 = {raizFormatada(16)}");

// Currying: uma função que devolve outra função já "pré-configurada"
Func&lt;int, Func&lt;int, int&gt;&gt; multiplicarPor = fator =&gt; n =&gt; n * fator;
var dobro = multiplicarPor(2);
var triplo = multiplicarPor(3);
registrar($"dobro de 7 = {dobro(7)}, triplo de 7 = {triplo(7)}");

static void Aplicar(List&lt;decimal&gt; precos, Func&lt;decimal, decimal&gt; regra, string nome) =&gt;
    Console.WriteLine($"{nome,-17}: {string.Join(" | ", precos.Select(regra))}");

static Func&lt;T, TFim&gt; Compor&lt;T, TMeio, TFim&gt;(Func&lt;T, TMeio&gt; f, Func&lt;TMeio, TFim&gt; g) =&gt;
    x =&gt; g(f(x));</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>[LOG] 2 + 3 = 5
[LOG] 4 é par? True
10% de desconto  : 90,0 | 225,0 | 72,0
frete fixo de 15 : 115 | 265 | 95
[LOG] raiz de 16 = 4,00
[LOG] dobro de 7 = 14, triplo de 7 = 21</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>Aplicar(precos, p =&gt; p * 0.9m, ...)</code>: o método <code>Aplicar</code> é o mesmo nas duas chamadas; o que muda é a regra entregue a ele. É a base do LINQ (<code>Where</code>, <code>Select</code>) e do padrão Strategy (Capítulo 2).</li>
  <li><code>Compor(f, g)</code> devolve uma função nova que aplica <code>f</code> e depois <code>g</code>.</li>
  <li><code>fator =&gt; n =&gt; n * fator</code> é uma função que devolve outra função. <code>multiplicarPor(2)</code> "congela" o fator 2 dentro da função devolvida — isso se chama <em>closure</em>.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Delegates transformam comportamento em dado: você pode guardar, passar e combinar funções como qualquer outra variável.</p>
</div>

<h3>1.2.2 LINQ — Execução Adiada</h3>

<p class="step-label">📘 O conceito</p>
<p>Uma consulta LINQ como <code>lista.Where(...).Select(...)</code> <strong>não executa quando é escrita</strong>. Ela monta um "plano" que só roda quando alguém <em>percorre</em> o resultado: um <code>foreach</code>, <code>ToList()</code>, <code>Count()</code>, <code>First()</code>… E roda <strong>de novo a cada percorrida</strong>. Isso se chama execução adiada (<em>deferred execution</em>).</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A receita não é o bolo</div>
  <p>Anotar uma receita não assa bolo nenhum. O bolo só existe quando alguém segue a receita — e se duas pessoas pedirem bolo, a receita é seguida duas vezes, com os ingredientes que estiverem na despensa <em>naquele momento</em>. Se você quer "o bolo de hoje" guardado, precisa assá-lo e guardar (o <code>ToList()</code>).</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="Uma consulta LINQ é uma esteira: o foreach puxa um item por vez da lista, passando pelo Where e pelo Select; nada roda enquanto ninguém puxa">
    <defs><marker id="c1d1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c1d1-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c1d1-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box" x="10" y="90" width="120" height="60" rx="8"/>
    <text x="70.0" y="116.0" text-anchor="middle" font-weight="600">Lista</text>
    <text class="t-mono t-muted" x="70.0" y="134.0" text-anchor="middle">1, 2, 3, 4, 6</text>
    <rect class="box-accent" x="180" y="90" width="150" height="60" rx="8"/>
    <text x="255.0" y="116.0" text-anchor="middle" font-weight="600">Where</text>
    <text class="t-mono t-muted" x="255.0" y="134.0" text-anchor="middle">n % 2 == 0 ?</text>
    <rect class="box-accent" x="380" y="90" width="150" height="60" rx="8"/>
    <text x="455.0" y="116.0" text-anchor="middle" font-weight="600">Select</text>
    <text class="t-mono t-muted" x="455.0" y="134.0" text-anchor="middle">n * 10</text>
    <rect class="box-good" x="580" y="90" width="130" height="60" rx="8"/>
    <text x="645.0" y="116.0" text-anchor="middle" font-weight="600">foreach</text>
    <text class="t-muted" x="645.0" y="134.0" text-anchor="middle">ou ToList()</text>
    <path class="line" d="M130,120 L176,120" marker-end="url(#c1d1-head)"/>
    <path class="line" d="M330,120 L376,120" marker-end="url(#c1d1-head)"/>
    <path class="line" d="M530,120 L576,120" marker-end="url(#c1d1-head)"/>
    <path class="line-good" d="M645,90 C645,40 80,40 70,86" marker-end="url(#c1d1-head-good)"/>
    <text class="t-good" x="360" y="34" text-anchor="middle">"me dá o próximo" — quem PUXA é o foreach</text>
    <text class="t-muted" x="255" y="176" text-anchor="middle">ímpar? descarta e</text>
    <text class="t-muted" x="255" y="194" text-anchor="middle">pede o próximo</text>
    <text class="t-muted" x="10" y="238">Montar a consulta só monta a esteira. Cada percorrida liga a esteira de novo, do começo.</text>
  </svg>
  <figcaption>Execução adiada: a consulta LINQ é a receita; o bolo só sai quando alguém pede.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var numeros = new List&lt;int&gt; { 1, 2, 3, 4 };

// Montar a consulta NÃO executa nada: é só a receita
var paresVezes10 = numeros
    .Where(n =&gt; { Console.WriteLine($"   testando {n}"); return n % 2 == 0; })
    .Select(n =&gt; n * 10);

Console.WriteLine("Consulta montada. Nada foi testado ainda.");
numeros.Add(6);   // a consulta vai enxergar este item: ela só roda quando for percorrida

Console.WriteLine("1ª execução (foreach):");
foreach (var valor in paresVezes10)
    Console.WriteLine($"   -&gt; {valor}");

Console.WriteLine("2ª execução (Count): roda TUDO de novo!");
Console.WriteLine($"   total = {paresVezes10.Count()}");

Console.WriteLine("ToList(): executa UMA vez e guarda o resultado");
List&lt;int&gt; resultado = paresVezes10.ToList();
Console.WriteLine($"   guardado: {string.Join(", ", resultado)} (contar de novo não reexecuta: {resultado.Count})");</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Consulta montada. Nada foi testado ainda.
1ª execução (foreach):
   testando 1
   testando 2
   -&gt; 20
   testando 3
   testando 4
   -&gt; 40
   testando 6
   -&gt; 60
2ª execução (Count): roda TUDO de novo!
   testando 1
   testando 2
   testando 3
   testando 4
   testando 6
   total = 3
ToList(): executa UMA vez e guarda o resultado
   testando 1
   testando 2
   testando 3
   testando 4
   testando 6
   guardado: 20, 40, 60 (contar de novo não reexecuta: 3)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>A mensagem "Consulta montada" aparece <em>antes</em> de qualquer "testando": montar a consulta não executa nada.</li>
  <li>O <code>6</code> foi adicionado depois de a consulta ser montada e, mesmo assim, aparece no resultado, porque a consulta só leu a lista no <code>foreach</code>.</li>
  <li><code>Count()</code> percorre a lista inteira de novo: todos os "testando" se repetem.</li>
  <li><code>ToList()</code> executa uma vez e guarda o resultado; usar a lista depois não reexecuta nada.</li>
</ul>

<div class="info-box danger">
  <div class="info-box-label">🚨 Em banco de dados, isso custa caro</div>
  <p>Com Entity Framework, a "receita" vira SQL. Percorrer a mesma consulta duas vezes executa <strong>duas consultas no banco</strong>. Materialize com <code>ToListAsync()</code> quando for usar o resultado mais de uma vez — e veja o problema do N+1 no Capítulo 5.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>A consulta LINQ é uma receita que roda a cada percorrida; use <code>ToList()</code> quando quiser o resultado "congelado".</p>
</div>

<h3>1.2.3 Iteradores, yield e Pipelines Lazy</h3>

<p class="step-label">📘 O conceito</p>
<p><code>yield return</code> cria um <strong>iterador</strong>: um método que entrega os valores <em>um de cada vez</em>, pausando entre eles. O código só avança quando o consumidor pede o próximo item. Com isso dá para processar arquivos gigantes linha a linha, ou até sequências infinitas, usando memória constante.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A fila da padaria com senha</div>
  <p>A padaria não assa todos os pães do dia de uma vez para depois atender. A cada senha chamada, o padeiro entrega um pão e espera o próximo pedido. Se os clientes param de chegar, ele para de assar — nada de pão sobrando. O <code>yield return</code> é o "próximo!".</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Um "gerador": produz um valor por vez, só quando alguém pede
static IEnumerable&lt;int&gt; Fibonacci()
{
    int a = 0, b = 1;
    while (true)                       // infinito! só funciona porque é "preguiçoso"
    {
        Console.Write($"[gerou {a}] ");
        yield return a;                // entrega um valor e PAUSA aqui até pedirem o próximo
        (a, b) = (b, a + b);
    }
}

// Pedimos só o necessário: os 3 primeiros números maiores que 10
foreach (var n in Fibonacci().Where(n =&gt; n &gt; 10).Take(3))
    Console.WriteLine($"-&gt; usei {n}");

Console.WriteLine();

// Pipeline lazy: "lê" as linhas de um log uma a uma
static IEnumerable&lt;string&gt; LerLinhas()
{
    string[] arquivo = ["INFO iniciou", "ERROR banco fora do ar", "INFO ok", "ERROR timeout"];
    foreach (var linha in arquivo)
    {
        Console.WriteLine($"   lendo: {linha}");
        yield return linha;
    }
}

string primeiroErro = LerLinhas().First(l =&gt; l.StartsWith("ERROR"));
Console.WriteLine($"Primeiro erro: {primeiroErro} (o resto do arquivo nem foi lido)");</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>[gerou 0] [gerou 1] [gerou 1] [gerou 2] [gerou 3] [gerou 5] [gerou 8] [gerou 13] -&gt; usei 13
[gerou 21] -&gt; usei 21
[gerou 34] -&gt; usei 34

   lendo: INFO iniciou
   lendo: ERROR banco fora do ar
Primeiro erro: ERROR banco fora do ar (o resto do arquivo nem foi lido)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>while (true)</code> seria um laço infinito num método comum; com <code>yield return</code>, o método pausa a cada valor e só continua quando o <code>foreach</code> pede o próximo.</li>
  <li><code>Where(n =&gt; n &gt; 10).Take(3)</code>: depois do terceiro número aceito, o <code>Take</code> para de pedir, e o gerador para de gerar.</li>
  <li><code>First(...)</code> para no primeiro erro encontrado: a última linha do "arquivo" nunca é lida. Com <code>File.ReadLines</code>, isso vale para arquivos de vários GB.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Com <code>yield</code>, você escreve como se tivesse a lista inteira, mas processa um item por vez e só o que for necessário.</p>
</div>

<h2>1.3 Recursos Modernos da Linguagem</h2>

<p>Desde o C# 7, a linguagem ganhou recursos que deixam o código mais expressivo e mais seguro. Estes são os que um desenvolvedor sênior usa — e revisa — todos os dias.</p>

<h3>1.3.1 Pattern Matching</h3>

<p class="step-label">📘 O conceito</p>
<p><strong>Pattern matching</strong> é testar a "forma" de um valor e, ao mesmo tempo, extrair partes dele. Numa <em>switch expression</em>, cada linha é um padrão; o primeiro que combinar define o resultado. Há padrões de tipo (<code>int n</code>), de propriedade (<code>{ Length: 0 }</code>), relacionais (<code>&lt; 18.5</code>), lógicos (<code>and</code>, <code>or</code>, <code>not</code>), de lista (<code>[var primeiro, .., var ultimo]</code>) e posicionais (<code>(int x, int y)</code>).</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A triagem do pronto-socorro</div>
  <p>Na triagem, a enfermeira segue perguntas em ordem: "está inconsciente?" → vermelho; "tem febre acima de 39?" → laranja; senão → verde. A primeira condição que bate decide a fila, e ninguém fica sem classificação. A <em>switch expression</em> é esse protocolo escrito em código — e o compilador avisa se sobrar algum caso sem tratamento.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
flowchart LR
    A["valor"] --&gt; B{"é int?"}
    B -- sim --&gt; C{"n menor que 0?"}
    C -- sim --&gt; C1["inteiro negativo"]
    C -- não --&gt; C2["inteiro n"]
    B -- não --&gt; D{"é string?"}
    D -- sim --&gt; D1["vazio ou N letras"]
    D -- não --&gt; E{"é int[]?"}
    E -- sim --&gt; E1["vazia / um só / de X até Y"]
    E -- não --&gt; F["... null, tupla, outro tipo"]
  </pre>
  <figcaption>Os padrões são testados de cima para baixo; o primeiro que combina vence.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

object?[] coisas = [-5, 42, "", "C#", new[] { 7, 8, 9 }, Array.Empty&lt;int&gt;(), new[] { 1 }, (3, 3), (1, 2), null, 3.14];
foreach (var coisa in coisas)
    Console.WriteLine($"{Mostrar(coisa),-10} -&gt; {Descrever(coisa)}");

Console.WriteLine();
foreach (var imc in new[] { 17.0, 22.5, 27.3, 31.8 })
    Console.WriteLine($"IMC {imc,4:F1}: {Classificar(imc)}");

// Uma "triagem": os padrões são testados de cima para baixo; o primeiro que combinar vence
static string Descrever(object? obj) =&gt; obj switch
{
    int n when n &lt; 0                     =&gt; "inteiro negativo",       // tipo + condição
    int n                                =&gt; $"inteiro {n}",
    string { Length: 0 }                 =&gt; "texto vazio",            // property pattern
    string s                             =&gt; $"texto de {s.Length} letras",
    int[] and []                         =&gt; "lista vazia",            // list patterns (C# 11)
    int[] and [var unico]                =&gt; $"lista com um só: {unico}",
    int[] and [var primeiro, .., var ultimo] =&gt; $"lista de {primeiro} até {ultimo}",
    (int x, int y) when x == y           =&gt; "ponto na diagonal",      // positional pattern
    (int x, int y)                       =&gt; $"ponto ({x}, {y})",
    null                                 =&gt; "nulo",
    _                                    =&gt; $"outro tipo: {obj.GetType().Name}",
};

// Relational + logical patterns: faixas de valores sem if/else encadeado
static string Classificar(double imc) =&gt; imc switch
{
    &lt; 18.5           =&gt; "abaixo do peso",
    &gt;= 18.5 and &lt; 25 =&gt; "normal",
    &gt;= 25 and &lt; 30   =&gt; "sobrepeso",
    &gt;= 30            =&gt; "obesidade",
    _                =&gt; "valor inválido",   // double.NaN cai aqui
};

static string Mostrar(object? o) =&gt; o switch
{
    null =&gt; "null",
    int[] lista =&gt; $"[{string.Join(",", lista)}]",
    string s =&gt; $"\\"{s}\\"",
    _ =&gt; o.ToString() ?? "",
};</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>-5         -&gt; inteiro negativo
42         -&gt; inteiro 42
""         -&gt; texto vazio
"C#"       -&gt; texto de 2 letras
[7,8,9]    -&gt; lista de 7 até 9
[]         -&gt; lista vazia
[1]        -&gt; lista com um só: 1
(3, 3)     -&gt; ponto na diagonal
(1, 2)     -&gt; ponto (1, 2)
null       -&gt; nulo
3,14       -&gt; outro tipo: Double

IMC 17,0: abaixo do peso
IMC 22,5: normal
IMC 27,3: sobrepeso
IMC 31,8: obesidade</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>int n when n &lt; 0</code> combina tipo e condição. A ordem importa: se <code>int n</code> viesse antes, o caso negativo nunca seria alcançado (e o compilador acusaria erro).</li>
  <li><code>int[] and [var primeiro, .., var ultimo]</code>: primeiro testa o tipo, depois a "forma" da lista; o <code>..</code> significa "qualquer quantidade no meio".</li>
  <li><code>(int x, int y)</code> desmonta uma tupla em duas variáveis na hora do teste.</li>
  <li><code>&gt;= 18.5 and &lt; 25</code> expressa uma faixa sem <code>if</code>/<code>else</code> encadeado. O <code>_</code> final pega o que sobrou — aqui, <code>double.NaN</code>.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Pattern matching troca cascatas de <code>if</code> por uma tabela de casos legível, testada de cima para baixo.</p>
</div>

<h3>1.3.2 Records e Imutabilidade</h3>

<p class="step-label">📘 O conceito</p>
<p>Um <strong><code>record</code></strong> é um tipo pensado para <em>dados</em>: em uma linha você ganha construtor, propriedades somente-leitura, <code>ToString()</code> legível e <strong>igualdade por valor</strong> (dois records com os mesmos dados são iguais). Para "alterar" um record, você usa <code>with</code>, que cria uma cópia com as diferenças. Existe em duas versões: <code>record</code> (classe, no heap) e <code>record struct</code> (valor).</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A nota fiscal emitida</div>
  <p>Uma nota fiscal emitida não se edita: se algo estiver errado, emite-se uma nota nova, com a correção, e a original continua registrada. Isso evita que alguém mude um documento "por baixo" enquanto outra pessoa o usa. Records funcionam assim — e por isso são seguros para compartilhar entre threads.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 200" role="img" aria-label="O record p1 com Nome Ana e Idade 30 continua intacto; p1 with Idade igual a 31 cria um objeto novo com Nome Ana e Idade 31">
    <defs><marker id="c1d2-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c1d2-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c1d2-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="60" width="220" height="76" rx="8"/>
    <text x="120.0" y="85.0" text-anchor="middle" font-weight="600">p1</text>
    <text class="t-mono" x="120.0" y="103.0" text-anchor="middle">Nome = "Ana"</text>
    <text class="t-mono" x="120.0" y="121.0" text-anchor="middle">Idade = 30</text>
    <rect class="box-good" x="470" y="60" width="240" height="76" rx="8"/>
    <text x="590.0" y="85.0" text-anchor="middle" font-weight="600">maisVelha (objeto novo)</text>
    <text class="t-mono" x="590.0" y="103.0" text-anchor="middle">Nome = "Ana"   (copiado)</text>
    <text class="t-mono t-good" x="590.0" y="121.0" text-anchor="middle">Idade = 31     (mudou)</text>
    <path class="line-good" d="M230,98 L466,98" marker-end="url(#c1d2-head-good)"/>
    <text class="t-mono t-good" x="348" y="88" text-anchor="middle">p1 with { Idade = 31 }</text>
    <text class="t-muted" x="120" y="164" text-anchor="middle">continua com 30: ninguém</text>
    <text class="t-muted" x="120" y="182" text-anchor="middle">altera um record</text>
    <text class="t-muted" x="590" y="164" text-anchor="middle">o "with" passa pelo init:</text>
    <text class="t-muted" x="590" y="182" text-anchor="middle">a validação roda de novo</text>
  </svg>
  <figcaption>Records são imutáveis: para "mudar", você cria uma cópia com a diferença.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

var p1 = new Pessoa("Ana", 30);
var p2 = new Pessoa("Ana", 30);
Console.WriteLine($"p1 == p2? {p1 == p2} (compara os VALORES, não o endereço na memória)");
Console.WriteLine($"ToString automático: {p1}");

var maisVelha = p1 with { Idade = 31 };   // cópia com UMA mudança; o original fica intacto
Console.WriteLine($"Original: {p1.Idade} | Cópia: {maisVelha.Idade}");
// p1.Idade = 31;   // ❌ não compila: as propriedades são "init" (só na criação)

try { _ = new Pessoa("Bruno", -1); }
catch (ArgumentException ex) { Console.WriteLine($"Erro ao criar: {ex.Message}"); }

try { _ = p1 with { Idade = -5 }; }
catch (ArgumentException ex) { Console.WriteLine($"Erro no with: {ex.Message}"); }

var total = new Dinheiro(10m, "BRL") + new Dinheiro(5.5m, "BRL");
Console.WriteLine($"Total: {total}");

// record class: tipo de referência, igualdade por valor, imutável por padrão
public record Pessoa(string Nome, int Idade)
{
    // A validação fica no "init": vale tanto para "new" quanto para "with"
    private readonly int _idade = Validar(Idade);
    public int Idade { get =&gt; _idade; init =&gt; _idade = Validar(value); }

    public bool EhAdulta =&gt; Idade &gt;= 18;

    private static int Validar(int idade) =&gt;
        idade &gt;= 0 ? idade : throw new ArgumentException("a idade não pode ser negativa.");
}

// readonly record struct: tipo de VALOR (sem alocação no heap) e imutável
public readonly record struct Dinheiro(decimal Valor, string Moeda)
{
    public static Dinheiro operator +(Dinheiro a, Dinheiro b) =&gt;
        a.Moeda == b.Moeda
            ? a with { Valor = a.Valor + b.Valor }
            : throw new InvalidOperationException("moedas diferentes");
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>p1 == p2? True (compara os VALORES, não o endereço na memória)
ToString automático: Pessoa { Nome = Ana, Idade = 30, EhAdulta = True }
Original: 30 | Cópia: 31
Erro ao criar: a idade não pode ser negativa.
Erro no with: a idade não pode ser negativa.
Total: Dinheiro { Valor = 15,5, Moeda = BRL }</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>p1 == p2</code> é <code>True</code>: records comparam os valores das propriedades, não o endereço na memória.</li>
  <li>Descomentar <code>p1.Idade = 31</code> gera o erro <strong>CS8852</strong>: a propriedade só pode ser definida na criação (<code>init</code>).</li>
  <li>A validação fica no <code>init</code> da propriedade. Assim, ela roda no <code>new</code> <em>e</em> no <code>with</code> — um detalhe que muita gente esquece.</li>
  <li><code>readonly record struct Dinheiro</code> tem as mesmas vantagens, mas é um tipo de valor: ideal para dados pequenos, sem alocação no heap.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Records são dados imutáveis com igualdade por valor; para mudar, crie uma cópia com <code>with</code>.</p>
</div>

<h3>1.3.3 Extension Methods e Extension Members (C# 14)</h3>

<p class="step-label">📘 O conceito</p>
<p>Um <strong>extension method</strong> permite "acrescentar" métodos a um tipo que você não pode alterar — <code>string</code>, <code>decimal</code>, uma classe de biblioteca. É um método estático comum, com <code>this</code> antes do primeiro parâmetro, que pode ser chamado como se fosse do próprio tipo. Todo o LINQ é feito assim. No C# 14 (.NET 10), a sintaxe <code>extension</code> também permite criar <strong>propriedades</strong> de extensão.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A capinha com suporte</div>
  <p>Você não abre o celular para instalar um suporte: coloca uma capinha que já vem com ele. O celular continua o mesmo, mas agora "tem" um suporte. A extensão acrescenta comportamento sem tocar no tipo original — e só "existe" onde a capinha (o <code>using</code> do namespace) estiver.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">Console.WriteLine("  Olá,   Mundo  do C#  ".NormalizarEspacos().Truncar(10));
Console.WriteLine("ana@email.com".PareceEmail());
Console.WriteLine("não é e-mail".PareceEmail());
Console.WriteLine(1234.5m.ComoReais());

// Extension methods: "acrescentar" métodos a um tipo que não é seu (string, decimal...)
public static class ExtensoesDeTexto
{
    // O "this" antes do primeiro parâmetro é o que transforma o método em extensão
    public static string Truncar(this string texto, int maximo) =&gt;
        texto.Length &lt;= maximo ? texto : texto[..maximo] + "...";

    public static string NormalizarEspacos(this string texto) =&gt;
        string.Join(' ', texto.Split(' ', StringSplitOptions.RemoveEmptyEntries));

    public static bool PareceEmail(this string texto) =&gt;
        texto.Contains('@') &amp;&amp; texto.Contains('.');
}

public static class ExtensoesDeDinheiro
{
    public static string ComoReais(this decimal valor) =&gt;
        valor.ToString("C", new System.Globalization.CultureInfo("pt-BR"));
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Olá, Mundo...
True
False
R$ 1.234,50</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>this string texto</code> é o que faz de <code>Truncar</code> uma extensão de <code>string</code>. Por baixo, <code>x.Truncar(10)</code> vira <code>ExtensoesDeTexto.Truncar(x, 10)</code>.</li>
  <li>Extensões encadeiam naturalmente: <code>.NormalizarEspacos().Truncar(10)</code>.</li>
  <li>Extensões funcionam para qualquer tipo, até <code>decimal</code>: <code>1234.5m.ComoReais()</code>.</li>
</ul>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ <strong>Requer .NET 10</strong> (C# 14). </p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">Console.WriteLine("ana@email.com".EhEmail);                  // uma PROPRIEDADE de extensão
Console.WriteLine("um  dois   três".QuantidadeDePalavras);

public static class ExtensoesDeTexto
{
    // C# 14: um bloco "extension" agrupa membros de extensão, inclusive propriedades
    extension(string texto)
    {
        public bool EhEmail =&gt; texto.Contains('@') &amp;&amp; texto.Contains('.');

        public int QuantidadeDePalavras =&gt;
            texto.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>True
3</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>O bloco <code>extension(string texto)</code> declara o "receptor" uma vez só, e dentro dele você escreve propriedades e métodos normais.</li>
  <li><code>"...".EhEmail</code> é uma <em>propriedade</em> — antes do C# 14, só dava para criar métodos de extensão.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Use com moderação</div>
  <p>Extensões são ótimas para utilitários pequenos e para APIs fluentes. Mas se a regra é do seu domínio (por exemplo, "pedido pode ser cancelado?"), ela pertence à própria classe — escondê-la numa extensão espalha a lógica de negócio.</p>
</div>

<h3>1.3.4 Generic Math e Static Abstract Members (C# 11+)</h3>

<p class="step-label">📘 O conceito</p>
<p>Antes do .NET 7, não dava para escrever <em>uma</em> função de média que servisse para <code>int</code>, <code>double</code> e <code>decimal</code>: os operadores <code>+</code> e <code>/</code> não podiam ser usados em genéricos. Agora, interfaces podem declarar <strong>membros estáticos abstratos</strong> (como operadores e <code>Zero</code>), e os tipos numéricos implementam <code>INumber&lt;T&gt;</code>. Resultado: código matemático genérico, sem perder desempenho.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A receita de média</div>
  <p>A receita "some tudo e divida pela quantidade" funciona para notas de prova, preços ou temperaturas. Você não precisa de uma receita por tipo de número — só de uma garantia de que aquilo "sabe somar e dividir". Essa garantia é a interface <code>INumber&lt;T&gt;</code>.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
using System.Numerics;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// UMA função de média que serve para int, double, decimal... qualquer número
static T Media&lt;T&gt;(IEnumerable&lt;T&gt; valores) where T : INumber&lt;T&gt;
{
    T soma = T.Zero;
    int quantidade = 0;
    foreach (var valor in valores)
    {
        soma += valor;
        quantidade++;
    }
    return soma / T.CreateChecked(quantidade);
}

Console.WriteLine($"int    : {Media(new[] { 1, 2, 3, 4 })}   &lt;- divisão inteira: 10 / 4 = 2");
Console.WriteLine($"double : {Media(new[] { 1.5, 2.5, 3.5 })}");
Console.WriteLine($"decimal: {Media(new[] { 10m, 20m, 30m })}");

// Seus próprios tipos também participam: basta implementar os membros estáticos abstratos
Vetor total = Somar(new[] { new Vetor(1, 2), new Vetor(3, 4), new Vetor(10, 10) });
Console.WriteLine($"Soma de vetores: {total}");

static T Somar&lt;T&gt;(T[] itens) where T : ISomavel&lt;T&gt;
{
    T resultado = T.Zero;
    foreach (var item in itens) resultado += item;
    return resultado;
}

public interface ISomavel&lt;T&gt; where T : ISomavel&lt;T&gt;
{
    static abstract T Zero { get; }
    static abstract T operator +(T a, T b);
}

public readonly record struct Vetor(int X, int Y) : ISomavel&lt;Vetor&gt;
{
    public static Vetor Zero =&gt; new(0, 0);
    public static Vetor operator +(Vetor a, Vetor b) =&gt; new(a.X + b.X, a.Y + b.Y);
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>int    : 2   &lt;- divisão inteira: 10 / 4 = 2
double : 2,5
decimal: 20
Soma de vetores: Vetor { X = 14, Y = 16 }</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>where T : INumber&lt;T&gt;</code> garante que <code>T</code> tem <code>T.Zero</code>, <code>+</code> e <code>/</code>.</li>
  <li><code>T.CreateChecked(quantidade)</code> converte o <code>int</code> da contagem para o tipo <code>T</code>, lançando uma exceção se não couber.</li>
  <li>Com <code>int</code>, a divisão é inteira: a média de 1, 2, 3 e 4 dá 2, e não 2,5. O genérico respeita as regras de cada tipo.</li>
  <li><code>Vetor</code> implementa <code>ISomavel&lt;Vetor&gt;</code> e passa a funcionar em <code>Somar</code>, exatamente como os números nativos.</li>
</ul>

<h3>1.3.5 Unsafe Code, Ponteiros e Interop</h3>

<p class="step-label">📘 O conceito</p>
<p>Com <code>unsafe</code>, o C# permite manipular <strong>endereços de memória</strong> diretamente, como em C. O compilador deixa de proteger você de erros como ler fora de um array. Hoje, <code>Span&lt;T&gt;</code> resolve quase todos os casos com o mesmo desempenho e total segurança; ponteiros ficam para interoperar com bibliotecas nativas (C/C++) e para otimizações muito específicas, medidas com benchmark.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Tirar a trava de segurança da serra</div>
  <p>Um marceneiro experiente pode remover a proteção da serra para um corte muito específico. Funciona — mas qualquer descuido custa um dedo. <code>unsafe</code> é isso: só quando for realmente necessário, em um trecho pequeno, e com muito cuidado.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code># no .csproj: &lt;AllowUnsafeBlocks&gt;true&lt;/AllowUnsafeBlocks&gt;</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">int a = 1, b = 2;
unsafe
{
    Trocar(&amp;a, &amp;b);   // "&amp;a" = o ENDEREÇO de memória da variável a
}
Console.WriteLine($"a = {a}, b = {b}");

byte[] origem = [1, 2, 3, 4, 5];
byte[] destino = new byte[5];
CopiarComPonteiros(origem, destino);
Console.WriteLine($"Copiado com ponteiros: {string.Join(",", destino)}");

// O mesmo resultado, com segurança total e desempenho equivalente: prefira isto!
byte[] destino2 = new byte[5];
origem.AsSpan().CopyTo(destino2);
Console.WriteLine($"Copiado com Span:      {string.Join(",", destino2)}");

static unsafe void Trocar(int* x, int* y)
{
    int temp = *x;   // "*x" = o valor guardado no endereço x
    *x = *y;
    *y = temp;
}

static unsafe void CopiarComPonteiros(byte[] origem, byte[] destino)
{
    // "fixed" prende os arrays no lugar: o GC não pode movê-los enquanto usamos os ponteiros
    fixed (byte* pOrigem = origem, pDestino = destino)
    {
        Buffer.MemoryCopy(pOrigem, pDestino, destino.Length, origem.Length);
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>a = 2, b = 1
Copiado com ponteiros: 1,2,3,4,5
Copiado com Span:      1,2,3,4,5</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>&amp;a</code> obtém o endereço da variável; <code>int*</code> é "ponteiro para int"; <code>*x</code> lê ou escreve o valor nesse endereço.</li>
  <li><code>fixed</code> impede que o Garbage Collector mova o array enquanto o ponteiro está em uso — sem isso, o ponteiro poderia apontar para lixo.</li>
  <li>A versão com <code>Span</code> produz o mesmo resultado sem <code>unsafe</code>. Na dúvida, fique com ela.</li>
</ul>

<p>Para chamar bibliotecas nativas, prefira <code>LibraryImport</code> (gerado em tempo de compilação e compatível com Native AOT) ao antigo <code>DllImport</code>:</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Runtime.InteropServices;

internal static partial class Nativo
{
    // Chama a função strlen da biblioteca C do sistema (Linux/macOS)
    [LibraryImport("libc", EntryPoint = "strlen", StringMarshalling = StringMarshalling.Utf8)]
    internal static partial nuint Strlen(string texto);
}</code></pre>
</div>

<div class="challenge-box">
  <div class="challenge-box-header">
    <span class="challenge-box-icon">🎯</span>
    <span class="challenge-box-title">Desafio Prático — Capítulo 1</span>
  </div>
  <p>Implemente um leitor de CSV que processe um arquivo de 500 MB <strong>sem criar strings intermediárias</strong>:</p>
  <ol>
    <li>Leia com <code>File.ReadLines</code> (1.2.3) e fatie cada linha com <code>ReadOnlySpan&lt;char&gt;</code> (1.1.3).</li>
    <li>Modele cada registro como um <code>readonly record struct</code> (1.3.2).</li>
    <li>Classifique os registros com uma <em>switch expression</em> (1.3.1).</li>
    <li>Compare com a versão ingênua (<code>string.Split</code>) usando <code>GC.GetAllocatedBytesForCurrentThread()</code>, como nos exemplos, e depois com BenchmarkDotNet (Capítulo 8).</li>
  </ol>
  <p>Meta: menos de 1 alocação por linha e o mesmo resultado da versão ingênua.</p>
</div>
`
},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 2 — OOP & DESIGN PATTERNS
══════════════════════════════════════════════════════════ */
{
  id: 2, slug: 'oop-design', icon: '🏗️', color: '#8b5cf6',
  title: 'OOP & Design Patterns',
  subtitle: 'Dos 4 pilares da OOP ao SOLID, GoF Patterns e Domain-Driven Design',
  desc: 'Classes e objetos, SOLID, Factory, Builder, Decorator, Adapter, Chain, Observer, Command e DDD — cada tema com analogia, diagrama e um programa completo para rodar.',
  tags: ['OOP','SOLID','Patterns','DDD','Exemplos executáveis'],
  readTime: 55,
  intro: `Design Patterns não são soluções mágicas — são <em>vocabulário compartilhado</em> para problemas
    recorrentes. Este capítulo começa pelo básico (classe, objeto e os quatro pilares da OOP), passa pelos
    cinco princípios SOLID, pelos padrões GoF mais usados em .NET e chega ao Domain-Driven Design. Cada tema
    vem com uma analogia do dia a dia, um diagrama e um programa completo que você pode rodar. A diferença entre
    conhecer e dominar patterns está em saber qual aplicar, quando aplicar e — crucialmente — quando <strong>não aplicar</strong>.`,
  content: `
<div class="info-box info">
  <div class="info-box-label">🧭 Como estudar este capítulo</div>
  <p>Cada tópico segue o mesmo roteiro: <strong>📘 o conceito</strong> em linguagem simples → <strong>💡 um exemplo do dia a dia</strong> → <strong>🖼️ um diagrama</strong> do mecanismo → <strong>o código comentado</strong> → <strong>▶️ um programa completo</strong> para você rodar e ver a saída.</p>
  <p>Todos os programas foram compilados e executados com .NET 8+; a saída mostrada é a saída real. Para rodar qualquer um deles:</p>
</div>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">terminal</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-bash">dotnet new console -n Capitulo2   # cria o projeto (só na primeira vez)
cd Capitulo2
# apague o conteúdo de Program.cs e cole o exemplo
dotnet run</code></pre>
</div>

<p>Não tem o .NET instalado? Baixe o SDK em <a href="https://dotnet.microsoft.com/download" target="_blank">dotnet.microsoft.com/download</a>, ou cole o código em <a href="https://dotnetfiddle.net" target="_blank">dotnetfiddle.net</a> (escolha o compilador ".NET 8") e rode direto no navegador.</p>

<h2>2.1 Os Fundamentos da Orientação a Objetos</h2>

<p>Antes de SOLID e Design Patterns, é preciso ter clareza sobre o básico. Programação Orientada a Objetos (OOP) é uma forma de organizar o código imitando o mundo real: em vez de um amontoado de funções e variáveis soltas, agrupamos <strong>dados</strong> e <strong>comportamentos</strong> que andam juntos dentro de "objetos". Todos os padrões deste capítulo são combinações de quatro ideias: <strong>encapsulamento, abstração, herança e polimorfismo</strong>.</p>

<h3>2.1.1 Classe, Objeto e Encapsulamento</h3>

<p class="step-label">📘 O conceito</p>
<p>Uma <strong>classe</strong> é um molde: descreve quais dados (propriedades) e ações (métodos) algo tem. Um <strong>objeto</strong> é uma coisa concreta criada a partir desse molde com <code>new</code> — cada objeto tem seus próprios valores.</p>
<p><strong>Encapsular</strong> é esconder os dados dentro do objeto e só permitir que sejam alterados por métodos que verificam as regras. Assim, é impossível o sistema entrar num estado inválido — como uma conta com saldo negativo.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A planta da casa e o caixa eletrônico</div>
  <p>A <strong>classe</strong> é a planta de uma casa; os <strong>objetos</strong> são as casas construídas a partir dela. Todas seguem a mesma planta, mas cada uma tem seus próprios móveis — pintar a sala de uma não muda a outra.</p>
  <p>O <strong>encapsulamento</strong> é o caixa eletrônico: você não abre o cofre para pegar dinheiro. Você usa as "portas" oficiais (sacar, depositar), e o caixa confere as regras (tem saldo? a senha está certa?) antes de mexer no dinheiro.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="Uma classe ContaBancaria funciona como planta; dois objetos criados com new, contaDaAna com saldo 70 e contaDoBruno com saldo 50, cada um com seus próprios dados">
    <defs><marker id="c2d1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d1-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d1-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="20" y="24">A PLANTA (classe)</text>
    <rect class="box-accent" x="20" y="40" width="250" height="170" rx="10"/>
    <text class="t-mono" x="40" y="68" font-weight="600">class ContaBancaria</text>
    <text class="t-mono" x="52" y="100">• Titular</text>
    <text class="t-mono" x="52" y="126">• Saldo</text>
    <text class="t-mono" x="52" y="152">• Depositar(valor)</text>
    <text class="t-mono" x="52" y="178">• Sacar(valor)</text>
    <text class="t-title" x="440" y="24">OS OBJETOS (instâncias)</text>
    <rect class="box-good" x="440" y="40" width="260" height="76" rx="8"/>
    <text x="570.0" y="65.0" text-anchor="middle" font-weight="600">contaDaAna</text>
    <text class="t-mono" x="570.0" y="83.0" text-anchor="middle">Titular = "Ana"</text>
    <text class="t-mono" x="570.0" y="101.0" text-anchor="middle">Saldo = 70,00</text>
    <rect class="box-good" x="440" y="134" width="260" height="76" rx="8"/>
    <text x="570.0" y="159.0" text-anchor="middle" font-weight="600">contaDoBruno</text>
    <text class="t-mono" x="570.0" y="177.0" text-anchor="middle">Titular = "Bruno"</text>
    <text class="t-mono" x="570.0" y="195.0" text-anchor="middle">Saldo = 50,00</text>
    <path class="line" d="M270,100 C350,100 360,78 436,78" marker-end="url(#c2d1-head)"/>
    <path class="line" d="M270,150 C350,150 360,172 436,172" marker-end="url(#c2d1-head)"/>
    <text class="t-mono t-good" x="355" y="84" text-anchor="middle">new</text>
    <text class="t-mono t-good" x="355" y="172" text-anchor="middle">new</text>
    <text class="t-muted" x="20" y="238">Uma planta, quantas casas você quiser — e cada casa tem os seus próprios móveis.</text>
  </svg>
  <figcaption>A classe descreve; o objeto existe. Mudar o saldo da Ana não mexe no saldo do Bruno.</figcaption>
</figure>

<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 270" role="img" aria-label="Código de fora só altera o saldo passando pelos métodos Depositar e Sacar, que validam as regras; tentar escrever no Saldo diretamente não compila">
    <defs><marker id="c2d2-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d2-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d2-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box" x="10" y="95" width="150" height="60" rx="8"/>
    <text x="85.0" y="121.0" text-anchor="middle" font-weight="600">Código de fora</text>
    <text class="t-muted" x="85.0" y="139.0" text-anchor="middle">(Program.cs)</text>
    <rect class="panel" x="250" y="12" width="460" height="220" rx="14"/>
    <text class="t-title" x="270" y="38">class ContaBancaria</text>
    <rect class="box-good" x="280" y="56" width="220" height="54" rx="8"/>
    <text x="390.0" y="79.0" text-anchor="middle" font-weight="600">Depositar(valor)</text>
    <text class="t-muted" x="390.0" y="97.0" text-anchor="middle">regra: valor &gt; 0</text>
    <rect class="box-good" x="280" y="128" width="220" height="54" rx="8"/>
    <text x="390.0" y="151.0" text-anchor="middle" font-weight="600">Sacar(valor)</text>
    <text class="t-muted" x="390.0" y="169.0" text-anchor="middle">regra: valor ≤ Saldo</text>
    <rect class="box-warn" x="560" y="82" width="130" height="74" rx="8"/>
    <text x="625.0" y="106.0" text-anchor="middle" font-weight="600">Saldo</text>
    <text class="t-mono" x="625.0" y="124.0" text-anchor="middle">private set</text>
    <text class="t-muted" x="625.0" y="142.0" text-anchor="middle">protegido</text>
    <path class="line-good" d="M160,112 L276,83" marker-end="url(#c2d2-head-good)"/>
    <path class="line-good" d="M160,138 L276,155" marker-end="url(#c2d2-head-good)"/>
    <path class="line" d="M500,83 L556,108" marker-end="url(#c2d2-head)"/>
    <path class="line" d="M500,155 L556,132" marker-end="url(#c2d2-head)"/>
    <path class="line-bad" d="M85,155 L85,205 L244,205" marker-end="url(#c2d2-head-bad)"/>
    <text class="t-bad" x="262" y="210">✕</text>
    <text class="t-bad t-mono" x="96" y="196">Saldo = 1_000_000</text>
    <text class="t-muted" x="284" y="210">não compila (CS0272): a porta está trancada</text>
    <text class="t-muted" x="10" y="258">Os dados ficam protegidos; o acesso acontece só por "portas" que verificam as regras.</text>
  </svg>
  <figcaption>Encapsular é colocar os dados atrás de métodos que garantem as regras do negócio.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR"); // mostra dinheiro como R$ 1.234,56

// A classe é a "planta"; cada "new" constrói um objeto independente
var contaDaAna = new ContaBancaria("Ana");
var contaDoBruno = new ContaBancaria("Bruno");

contaDaAna.Depositar(100m);
contaDoBruno.Depositar(50m);
contaDaAna.Sacar(30m);

Console.WriteLine(contaDaAna);   // cada objeto guarda os seus próprios dados
Console.WriteLine(contaDoBruno);

// Encapsulamento: a regra "não pode sacar mais do que tem" mora DENTRO da classe
try
{
    contaDoBruno.Sacar(500m);
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"Operação recusada: {ex.Message}");
}

// contaDaAna.Saldo = 1_000_000m;  // ❌ não compila: só a própria classe altera o saldo

public class ContaBancaria
{
    public string Titular { get; }
    public decimal Saldo { get; private set; }   // todos podem LER; só a classe pode MUDAR

    public ContaBancaria(string titular) =&gt; Titular = titular;

    public void Depositar(decimal valor)
    {
        if (valor &lt;= 0)
            throw new ArgumentException("o depósito precisa ser positivo.");
        Saldo += valor;
    }

    public void Sacar(decimal valor)
    {
        if (valor &gt; Saldo)
            throw new InvalidOperationException($"saldo insuficiente ({Saldo:C} disponível).");
        Saldo -= valor;
    }

    public override string ToString() =&gt; $"{Titular}: saldo de {Saldo:C}";
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Ana: saldo de R$ 70,00
Bruno: saldo de R$ 50,00
Operação recusada: saldo insuficiente (R$ 50,00 disponível).</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>new ContaBancaria("Ana")</code> constrói um objeto a partir da classe. A Ana e o Bruno têm saldos independentes.</li>
  <li><code>public decimal Saldo { get; private set; }</code> é o encapsulamento em uma linha: qualquer um <em>lê</em> o saldo, mas só a própria classe <em>altera</em>. Se você descomentar <code>contaDaAna.Saldo = 1_000_000m</code>, o compilador recusa com o erro <strong>CS0272</strong>.</li>
  <li><code>Sacar</code> verifica a regra antes de mexer no saldo e lança uma exceção se ela for violada. A regra fica num lugar só, e não espalhada por todo o sistema.</li>
  <li><code>ToString()</code> define como o objeto aparece quando é impresso.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>A classe é o molde, o objeto é a coisa, e o encapsulamento garante que a coisa nunca fique num estado inválido.</p>
</div>

<h3>2.1.2 Herança, Abstração e Polimorfismo</h3>

<p class="step-label">📘 O conceito</p>
<ul>
  <li><strong>Abstração</strong>: descrever <em>o que</em> algo faz sem dizer <em>como</em>. Uma <code>abstract class</code> ou <code>interface</code> é um contrato: "todo funcionário sabe calcular o salário".</li>
  <li><strong>Herança</strong>: uma classe "filha" reaproveita o que a "mãe" tem (<code>class Clt : Funcionario</code>) — lê-se "CLT <em>é um</em> funcionário".</li>
  <li><strong>Polimorfismo</strong> ("muitas formas"): a mesma chamada — <code>CalcularSalario()</code> — executa um código diferente dependendo do objeto real. Quem chama não precisa saber o tipo.</li>
</ul>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A folha de pagamento do RH</div>
  <p>No fim do mês, o RH não pergunta a cada pessoa "você é CLT, freelancer ou estagiário?" para então escolher uma fórmula. Ele diz a todos a mesma coisa: <em>"informe quanto você recebe"</em>. O CLT responde com o salário fixo, o freelancer multiplica as horas pelo valor da hora, e o estagiário informa a bolsa.</p>
  <p>O RH (o código que chama) fica simples, e contratar um tipo novo de funcionário não muda o processo do RH.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 262" role="img" aria-label="Uma única chamada funcionario.CalcularSalario() executa três cálculos diferentes: salário fixo para CLT, horas vezes valor para Freelancer e bolsa para Estagiário">
    <defs><marker id="c2d3-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d3-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d3-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="20" y="24">UMA CHAMADA…</text>
    <rect class="box-accent" x="20" y="92" width="250" height="56" rx="8"/>
    <text class="t-mono" x="145.0" y="125.0" text-anchor="middle">funcionario.CalcularSalario()</text>
    <text class="t-title" x="430" y="24">…O OBJETO DECIDE COMO FAZER</text>
    <rect class="box-good" x="430" y="40" width="270" height="52" rx="8"/>
    <text x="565.0" y="62.0" text-anchor="middle" font-weight="600">Clt</text>
    <text class="t-muted" x="565.0" y="80.0" text-anchor="middle">salário fixo  →  R$ 5.000</text>
    <path class="line" d="M270,120 C350,120 350,66 426,66" marker-end="url(#c2d3-head)"/>
    <rect class="box-good" x="430" y="106" width="270" height="52" rx="8"/>
    <text x="565.0" y="128.0" text-anchor="middle" font-weight="600">Freelancer</text>
    <text class="t-muted" x="565.0" y="146.0" text-anchor="middle">80 h × R$ 90  →  R$ 7.200</text>
    <path class="line" d="M270,120 C350,120 350,132 426,132" marker-end="url(#c2d3-head)"/>
    <rect class="box-good" x="430" y="172" width="270" height="52" rx="8"/>
    <text x="565.0" y="194.0" text-anchor="middle" font-weight="600">Estagiario</text>
    <text class="t-muted" x="565.0" y="212.0" text-anchor="middle">bolsa fixa  →  R$ 1.800</text>
    <path class="line" d="M270,120 C350,120 350,198 426,198" marker-end="url(#c2d3-head)"/>
    <text class="t-muted" x="20" y="254">O código que chama não tem if/switch: ele confia no contrato e cada tipo responde do seu jeito.</text>
  </svg>
  <figcaption>Polimorfismo: "muitas formas" de responder à mesma mensagem.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// Uma única lista com tipos DIFERENTES de funcionário
List&lt;Funcionario&gt; folha =
[
    new Clt("Ana", salarioMensal: 5_000m),
    new Freelancer("Bruno", horasTrabalhadas: 80, valorHora: 90m),
    new Estagiario("Carla"),
];

decimal total = 0;
foreach (var funcionario in folha)
{
    // Polimorfismo: a MESMA chamada roda o cálculo certo para cada tipo
    decimal salario = funcionario.CalcularSalario();
    Console.WriteLine($"{funcionario.Nome,-6} {funcionario.Tipo,-11} {salario,12:C}");
    total += salario;
}
Console.WriteLine($"Total da folha: {total:C}");

// Abstração: define O QUE todo funcionário tem e faz, sem dizer COMO
public abstract class Funcionario(string nome)
{
    public string Nome { get; } = nome;
    public abstract string Tipo { get; }
    public abstract decimal CalcularSalario();   // cada tipo é OBRIGADO a implementar
}

// Herança: Clt "é um" Funcionario e já ganha a propriedade Nome
public class Clt(string nome, decimal salarioMensal) : Funcionario(nome)
{
    public override string Tipo =&gt; "CLT";
    public override decimal CalcularSalario() =&gt; salarioMensal;
}

public class Freelancer(string nome, int horasTrabalhadas, decimal valorHora) : Funcionario(nome)
{
    public override string Tipo =&gt; "Freelancer";
    public override decimal CalcularSalario() =&gt; horasTrabalhadas * valorHora;
}

public class Estagiario(string nome) : Funcionario(nome)
{
    private const decimal Bolsa = 1_800m;
    public override string Tipo =&gt; "Estagiário";
    public override decimal CalcularSalario() =&gt; Bolsa;
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Ana    CLT          R$ 5.000,00
Bruno  Freelancer   R$ 7.200,00
Carla  Estagiário   R$ 1.800,00
Total da folha: R$ 14.000,00</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>abstract class Funcionario</code> não pode ser instanciada diretamente — ela só define o contrato. <code>abstract decimal CalcularSalario()</code> obriga cada filha a implementar o cálculo (se esquecer, não compila).</li>
  <li><code>class Clt(string nome, decimal salarioMensal) : Funcionario(nome)</code> usa <em>primary constructor</em> (C# 12): os parâmetros ficam disponíveis na classe inteira, e <code>: Funcionario(nome)</code> repassa o nome para a mãe.</li>
  <li><code>override</code> é a palavra que diz "esta é a minha versão do método da mãe".</li>
  <li>O <code>foreach</code> trata todos como <code>Funcionario</code> e nunca pergunta o tipo. Isso é polimorfismo: adicionar um <code>Terceirizado</code> amanhã não muda esse laço.</li>
  <li>Nos textos formatados, <code>{funcionario.Nome,-6}</code> alinha à esquerda em 6 colunas e <code>{salario,12:C}</code> alinha à direita em 12 colunas, no formato de moeda.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Armadilha: herança demais</div>
  <p>Herança cria o acoplamento mais forte que existe: qualquer mudança na mãe atinge todas as filhas. Use herança só quando a relação "é um" for verdadeira <em>no comportamento</em> (veja Liskov, em 2.2.3). Na dúvida, prefira <strong>composição</strong> — "tem um" — e interfaces. A maioria dos padrões deste capítulo (Strategy, Decorator, Adapter) é composição.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>A abstração define o contrato, a herança reaproveita, e o polimorfismo permite tratar coisas diferentes do mesmo jeito.</p>
</div>

<h2>2.2 SOLID na Prática</h2>

<p>SOLID são cinco princípios, reunidos por Robert C. Martin, para escrever código que continua fácil de mudar depois de meses ou anos. Eles não servem para escrever mais classes — servem para reduzir <strong>quanto custa mudar</strong> o sistema amanhã. Cada princípio ataca um motivo diferente para uma alteração pequena virar uma cascata de bugs.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A cozinha de um restaurante</div>
  <ul>
    <li><strong>S — Responsabilidade Única:</strong> cada cozinheiro tem a sua estação. O confeiteiro não frita batata; se ele faltar, a chapa continua funcionando.</li>
    <li><strong>O — Aberto/Fechado:</strong> para lançar um prato novo, você escreve uma receita nova. Não reforma o fogão (o código que já funciona).</li>
    <li><strong>L — Substituição de Liskov:</strong> o cozinheiro substituto da chapa precisa entregar o hambúrguer que o salão espera. Se ele só faz salada e "ignora" o pedido, quebrou o contrato.</li>
    <li><strong>I — Segregação de Interfaces:</strong> o garçom só precisa do balcão de pedidos; ninguém o obriga a saber operar o forno.</li>
    <li><strong>D — Inversão de Dependência:</strong> o chef pede "um fornecedor de tomates" (abstração), não "o Sr. José da feira" (implementação). Trocar de fornecedor não muda a receita.</li>
  </ul>
</div>

<table>
  <thead><tr><th>Princípio</th><th>Em uma frase</th><th>Sintoma de violação</th></tr></thead>
  <tbody>
    <tr><td><strong>S</strong>RP</td><td>Uma classe, um motivo para mudar</td><td>Classe que calcula, salva e envia e-mail</td></tr>
    <tr><td><strong>O</strong>CP</td><td>Estender sem modificar</td><td><code>switch</code> por tipo que cresce a cada novidade</td></tr>
    <tr><td><strong>L</strong>SP</td><td>O filho substitui o pai sem surpresas</td><td><code>override</code> que lança <code>NotImplementedException</code></td></tr>
    <tr><td><strong>I</strong>SP</td><td>Interfaces pequenas e focadas</td><td>Classe obrigada a implementar métodos que não usa</td></tr>
    <tr><td><strong>D</strong>IP</td><td>Depender de abstrações, não de detalhes</td><td><code>new SqlRepository()</code> dentro da regra de negócio</td></tr>
  </tbody>
</table>

<h3>2.2.1 S — Single Responsibility (Responsabilidade Única)</h3>

<p class="step-label">📘 O conceito</p>
<p>Uma classe deve ter <strong>um único motivo para mudar</strong>. "Responsabilidade" aqui não é "fazer uma coisa só" — é responder a <em>uma única fonte de mudança</em>: a regra de preço (o time comercial), o banco de dados (o time de infraestrutura), o canal de avisos (o marketing). Quando uma classe mistura tudo isso, uma mudança pedida por um time quebra o trabalho do outro.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O funcionário "faz-tudo"</div>
  <p>Imagine uma lanchonete onde a mesma pessoa é caixa, cozinheira e entregadora. Quando ela sai para uma entrega, o caixa fecha e a chapa esfria. Se ela fica doente, a lanchonete para. Separar as funções não é burocracia — é o que permite trocar, treinar e escalar cada função sem parar as outras.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 318" role="img" aria-label="Antes: uma classe OrderService com cinco responsabilidades e cinco motivos para mudar. Depois: ServicoDePedidos apenas coordena CalculadoraDePreco, Repositorio e Notificador, cada um com um motivo para mudar">
    <defs><marker id="c2d4-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d4-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d4-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">❌ ANTES: UMA CLASSE FAZ TUDO</text>
    <rect class="box-bad" x="10" y="36" width="280" height="210" rx="10"/>
    <text class="t-mono" x="30" y="62" font-weight="600">OrderService</text>
    <text x="40" y="94">• calcula o preço</text>
    <text x="40" y="124">• salva no banco</text>
    <text x="40" y="154">• envia o e-mail</text>
    <text x="40" y="184">• gera o PDF</text>
    <text x="40" y="214">• controla o estoque</text>
    <text class="t-bad" x="10" y="270">5 motivos para mudar = 5 jeitos de quebrar</text>
    <text class="t-title" x="360" y="22">✅ DEPOIS: CADA UM NO SEU QUADRADO</text>
    <rect class="box-accent" x="430" y="36" width="220" height="50" rx="8"/>
    <text x="540.0" y="57.0" text-anchor="middle" font-weight="600">ServicoDePedidos</text>
    <text class="t-muted" x="540.0" y="75.0" text-anchor="middle">só coordena</text>
    <rect class="box-good" x="470" y="118" width="230" height="46" rx="8"/>
    <text x="585.0" y="137.0" text-anchor="middle" font-weight="600">CalculadoraDePreco</text>
    <text class="t-muted" x="585.0" y="155.0" text-anchor="middle">muda se: promoção</text>
    <path class="line" d="M440,86 L440,141 L466,141" marker-end="url(#c2d4-head)"/>
    <rect class="box-good" x="470" y="176" width="230" height="46" rx="8"/>
    <text x="585.0" y="195.0" text-anchor="middle" font-weight="600">Repositorio</text>
    <text class="t-muted" x="585.0" y="213.0" text-anchor="middle">muda se: banco</text>
    <path class="line" d="M440,86 L440,199 L466,199" marker-end="url(#c2d4-head)"/>
    <rect class="box-good" x="470" y="234" width="230" height="46" rx="8"/>
    <text x="585.0" y="253.0" text-anchor="middle" font-weight="600">Notificador</text>
    <text class="t-muted" x="585.0" y="271.0" text-anchor="middle">muda se: canal</text>
    <path class="line" d="M440,86 L440,257 L466,257" marker-end="url(#c2d4-head)"/>
    <text class="t-good" x="360" y="308">Mudou a promoção? Só a calculadora é tocada.</text>
  </svg>
  <figcaption>Responsabilidade única: cada classe tem um só motivo para mudar.</figcaption>
</figure>

<p class="step-label">🧑‍💻 O código, explicado</p>
<p>O problema, em código: uma classe com cinco responsabilidades. Para testar o cálculo do preço, você precisa de um banco de dados e de um servidor de e-mail.</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// ❌ Uma classe, cinco motivos para mudar
class OrderService
{
    public void PlaceOrder(Order order)
    {
        var total = order.Items.Sum(i =&gt; i.Price * i.Qty);   // regra de preço
        if (total &gt;= 300) total *= 0.9m;                      // promoção
        using var db = new SqlConnection("...");              // banco de dados
        db.Execute("INSERT INTO Orders ...");
        var smtp = new SmtpClient("smtp.empresa.com");        // canal de e-mail
        smtp.Send("loja@empresa.com", order.Email, "Pedido confirmado", $"Total: {total}");
    }
}</code></pre>
</div>

<p>A versão abaixo separa cada responsabilidade numa classe, e o <code>ServicoDePedidos</code> apenas coordena. Para simplificar, o "banco" é uma lista em memória e o "e-mail" é uma linha no console — mas a estrutura é exatamente a mesma de um sistema real.</p>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// Montamos as peças à mão (num projeto ASP.NET, o contêiner de DI faz isso)
var servico = new ServicoDePedidos(
    new CalculadoraDePreco(),
    new RepositorioDePedidosEmMemoria(),
    new NotificadorNoConsole());

var pedido = new Pedido("ana@email.com",
[
    new ItemDoPedido("Teclado", 250m, 1),
    new ItemDoPedido("Mouse", 80m, 2),
]);

servico.Finalizar(pedido);

// ---------- Cada classe tem UM motivo para mudar ----------

public record ItemDoPedido(string Produto, decimal PrecoUnitario, int Quantidade);
public record Pedido(string EmailCliente, List&lt;ItemDoPedido&gt; Itens);

// Muda só se a REGRA DE PREÇO mudar (ex.: nova promoção)
public class CalculadoraDePreco
{
    public decimal Calcular(Pedido pedido)
    {
        decimal subtotal = pedido.Itens.Sum(i =&gt; i.PrecoUnitario * i.Quantidade);
        return subtotal &gt;= 300m ? subtotal * 0.9m : subtotal; // 10% off acima de R$ 300
    }
}

// Muda só se o BANCO DE DADOS mudar
public class RepositorioDePedidosEmMemoria
{
    private readonly List&lt;Pedido&gt; _pedidos = [];

    public int Salvar(Pedido pedido)
    {
        _pedidos.Add(pedido);
        return _pedidos.Count; // número do pedido
    }
}

// Muda só se o CANAL de aviso mudar (e-mail, SMS, WhatsApp...)
public class NotificadorNoConsole
{
    public void Avisar(string destinatario, string mensagem) =&gt;
        Console.WriteLine($"[aviso para {destinatario}] {mensagem}");
}

// Só COORDENA: não sabe calcular, salvar nem enviar — ele delega
public class ServicoDePedidos(
    CalculadoraDePreco calculadora,
    RepositorioDePedidosEmMemoria repositorio,
    NotificadorNoConsole notificador)
{
    public void Finalizar(Pedido pedido)
    {
        decimal total = calculadora.Calcular(pedido);
        int numero = repositorio.Salvar(pedido);
        notificador.Avisar(pedido.EmailCliente, $"Pedido #{numero} confirmado. Total: {total:C}");
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>[aviso para ana@email.com] Pedido #1 confirmado. Total: R$ 369,00</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>record ItemDoPedido(...)</code> cria uma classe de dados imutável em uma linha.</li>
  <li><code>CalculadoraDePreco</code> só calcula. Para testar a promoção, basta chamar <code>Calcular</code> — sem banco nem e-mail.</li>
  <li><code>ServicoDePedidos</code> recebe as três peças no construtor e só as orquestra. Ele não sabe <em>como</em> calcular, salvar ou avisar.</li>
  <li>O pedido soma R$ 410,00 (250 + 2 × 80). Como passa de R$ 300, a promoção aplica 10% de desconto: <strong>R$ 369,00</strong>.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Pergunte "quem pediria para mudar esta classe?". Se a resposta tiver mais de um time, divida a classe.</p>
</div>

<h3>2.2.2 O — Open/Closed (Aberto/Fechado) com Strategy</h3>

<p class="step-label">📘 O conceito</p>
<p>O código deve estar <strong>aberto para extensão</strong> (dá para adicionar comportamento novo) e <strong>fechado para modificação</strong> (sem editar o que já funciona e já foi testado). A técnica mais comum é o padrão <strong>Strategy</strong>: cada variação de um algoritmo vira uma classe que implementa a mesma interface, e o código principal escolhe a estratégia em vez de usar <code>if</code>/<code>switch</code>.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A tomada e os aparelhos</div>
  <p>Quando você compra uma air fryer, não chama um eletricista para mudar a fiação da casa: você pluga na tomada. A tomada é o padrão (a interface); cada aparelho é uma estratégia. A casa está <em>fechada</em> para reforma e <em>aberta</em> para novos aparelhos.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 260" role="img" aria-label="A CalculadoraDeFrete conversa com um encaixe IEstrategiaDeFrete; nele estão plugadas Correios, Sedex, Retirada e a nova Drone, adicionada sem alterar a calculadora">
    <defs><marker id="c2d5-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d5-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d5-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="95" width="190" height="64" rx="8"/>
    <text x="105.0" y="123.0" text-anchor="middle" font-weight="600">CalculadoraDeFrete</text>
    <text class="t-muted" x="105.0" y="141.0" text-anchor="middle">fechada para mudança</text>
    <rect class="box-accent" x="250" y="30" width="34" height="196" rx="6" stroke-dasharray="6 4"/>
    <text class="t-mono" x="0" y="0" transform="translate(272,128) rotate(-90)" text-anchor="middle">IEstrategiaDeFrete</text>
    <path class="line" d="M200,127 L246,127" marker-end="url(#c2d5-head)"/>
    <rect class="box" x="400" y="20" width="300" height="44" rx="8"/>
    <text x="550.0" y="38.0" text-anchor="middle" font-weight="600">FreteCorreios</text>
    <text class="t-muted" x="550.0" y="56.0" text-anchor="middle">15 + 2/kg</text>
    <path class="line" d="M284,42 L396,42"/>
    <rect class="box" x="400" y="76" width="300" height="44" rx="8"/>
    <text x="550.0" y="94.0" text-anchor="middle" font-weight="600">FreteSedex</text>
    <text class="t-muted" x="550.0" y="112.0" text-anchor="middle">30 + 4/kg</text>
    <path class="line" d="M284,98 L396,98"/>
    <rect class="box" x="400" y="132" width="300" height="44" rx="8"/>
    <text x="550.0" y="150.0" text-anchor="middle" font-weight="600">RetiradaNaLoja</text>
    <text class="t-muted" x="550.0" y="168.0" text-anchor="middle">grátis</text>
    <path class="line" d="M284,154 L396,154"/>
    <rect class="box-good" x="400" y="188" width="300" height="44" rx="8"/>
    <text x="550.0" y="206.0" text-anchor="middle" font-weight="600">FreteDrone</text>
    <text class="t-muted" x="550.0" y="224.0" text-anchor="middle">NOVO: só uma classe a mais</text>
    <path class="line-good" d="M284,210 L396,210"/>
    <text class="t-muted" x="10" y="250">Estender = plugar uma classe nova no encaixe. O código que já funcionava nem é aberto.</text>
  </svg>
  <figcaption>Aberto para extensão, fechado para modificação — como plugar um aparelho novo numa tomada.</figcaption>
</figure>

<p class="step-label">🧑‍💻 O código, explicado</p>
<p>O sintoma clássico de violação é um <code>switch</code> que cresce a cada novidade. Cada novo frete obriga a editar (e testar de novo) esta função:</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// ❌ Toda nova forma de entrega exige mexer aqui
decimal CalcularFrete(Pedido p, string metodo) =&gt; metodo switch
{
    "correios" =&gt; 15m + p.PesoKg * 2m,
    "sedex"    =&gt; 30m + p.PesoKg * 4m,
    "retirada" =&gt; 0m,
    // "drone" =&gt; ...   ← mais uma edição, mais um risco
    _ =&gt; throw new NotSupportedException()
};</code></pre>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

var calculadora = new CalculadoraDeFrete(
[
    new FreteCorreios(),
    new FreteSedex(),
    new RetiradaNaLoja(),
    new FreteDrone(),      // novo! Nenhuma linha da CalculadoraDeFrete mudou
]);

var pedido = new Pedido(PesoKg: 3m);

foreach (var metodo in new[] { "correios", "sedex", "retirada", "drone" })
    Console.WriteLine($"{metodo,-9} -&gt; {calculadora.Calcular(pedido, metodo),10:C}");

try
{
    calculadora.Calcular(pedido, "teletransporte");
}
catch (NotSupportedException ex)
{
    Console.WriteLine(ex.Message);
}

public record Pedido(decimal PesoKg);

// O "encaixe" padrão: toda estratégia de frete tem este formato
public interface IEstrategiaDeFrete
{
    string Metodo { get; }
    decimal Calcular(Pedido pedido);
}

public class FreteCorreios : IEstrategiaDeFrete
{
    public string Metodo =&gt; "correios";
    public decimal Calcular(Pedido p) =&gt; 15m + p.PesoKg * 2m;
}

public class FreteSedex : IEstrategiaDeFrete
{
    public string Metodo =&gt; "sedex";
    public decimal Calcular(Pedido p) =&gt; 30m + p.PesoKg * 4m;
}

public class RetiradaNaLoja : IEstrategiaDeFrete
{
    public string Metodo =&gt; "retirada";
    public decimal Calcular(Pedido p) =&gt; 0m;
}

// Adicionada depois: bastou criar esta classe
public class FreteDrone : IEstrategiaDeFrete
{
    public string Metodo =&gt; "drone";
    public decimal Calcular(Pedido p) =&gt;
        p.PesoKg &lt;= 5m ? 50m : throw new InvalidOperationException("o drone só leva até 5 kg.");
}

// FECHADA para modificação: não existe if/switch por tipo de frete aqui dentro
public class CalculadoraDeFrete(IEnumerable&lt;IEstrategiaDeFrete&gt; estrategias)
{
    public decimal Calcular(Pedido pedido, string metodo)
    {
        var estrategia = estrategias.FirstOrDefault(e =&gt; e.Metodo == metodo)
            ?? throw new NotSupportedException($"Método de frete '{metodo}' não existe.");
        return estrategia.Calcular(pedido);
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>correios  -&gt;   R$ 21,00
sedex     -&gt;   R$ 42,00
retirada  -&gt;    R$ 0,00
drone     -&gt;   R$ 50,00
Método de frete 'teletransporte' não existe.</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>IEstrategiaDeFrete</code> é a "tomada": toda estratégia informa o seu <code>Metodo</code> e sabe <code>Calcular</code>.</li>
  <li><code>CalculadoraDeFrete</code> recebe <em>todas</em> as estratégias e usa <code>FirstOrDefault</code> para achar a certa. Ela não tem nenhum <code>if</code> por tipo de frete.</li>
  <li><code>FreteDrone</code> foi adicionado sem tocar em nenhuma outra classe: bastou criar o arquivo e incluí-lo na lista.</li>
  <li><code>?? throw</code> lança um erro claro quando nenhuma estratégia atende ao método pedido.</li>
</ul>

<p>Numa API ASP.NET Core, a lista de estratégias vem do contêiner de injeção de dependência. Registrar um frete novo é uma linha:</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">builder.Services.AddScoped&lt;IEstrategiaDeFrete, FreteCorreios&gt;();
builder.Services.AddScoped&lt;IEstrategiaDeFrete, FreteSedex&gt;();
builder.Services.AddScoped&lt;IEstrategiaDeFrete, FreteDrone&gt;();   // novo frete = nova linha
builder.Services.AddScoped&lt;CalculadoraDeFrete&gt;();               // recebe IEnumerable&lt;IEstrategiaDeFrete&gt;</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Quando um <code>switch</code> cresce a cada requisito novo, transforme cada <code>case</code> numa classe.</p>
</div>

<h3>2.2.3 L — Liskov Substitution (Substituição de Liskov)</h3>

<p class="step-label">📘 O conceito</p>
<p>Se <code>B</code> herda de <code>A</code>, então qualquer código que funciona com um <code>A</code> tem que continuar funcionando quando recebe um <code>B</code> — <strong>sem surpresas</strong>. Herdar não é só "ter os mesmos métodos"; é respeitar o mesmo <em>comportamento</em> (o contrato) que a classe mãe promete.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O carro reserva da locadora</div>
  <p>Seu carro foi para a oficina e a locadora te entrega um reserva. Você espera que ele acelere no pedal da direita e freie no do meio — como qualquer carro. Se o reserva tiver os pedais invertidos, ele continua "sendo um carro" no papel, mas você bate na primeira esquina. O problema não é o motorista: é o substituto que não respeita o contrato.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 260" role="img" aria-label="O código espera que um retângulo com largura 5 e altura 4 tenha área 20; o QuadradoRuim, ao receber altura 4, também muda a largura e entrega área 16">
    <defs><marker id="c2d6-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d6-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d6-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="20" y="24">O QUE O CÓDIGO ESPERA</text>
    <rect class="box-good" x="40" y="50" width="200" height="120" rx="4"/>
    <text x="140" y="115" text-anchor="middle" font-weight="600">área 20</text>
    <text class="t-mono" x="140" y="190" text-anchor="middle">Largura = 5</text>
    <text class="t-mono" x="262" y="115">Altura = 4</text>
    <text class="t-title" x="430" y="24">O QUE O QUADRADORUIM ENTREGA</text>
    <rect class="box-bad" x="460" y="50" width="120" height="120" rx="4"/>
    <text class="t-bad" x="520" y="115" text-anchor="middle">área 16</text>
    <text class="t-bad t-mono" x="520" y="190" text-anchor="middle">Largura virou 4!</text>
    <text class="t-mono" x="600" y="115">Altura = 4</text>
    <path class="line-bad" d="M360,110 L440,110" marker-end="url(#c2d6-head-bad)"/>
    <text class="t-muted" x="400" y="100" text-anchor="middle">substitui</text>
    <text class="t-muted" x="20" y="240">Ele "é um" retângulo no código, mas não se comporta como um. Quem confiava no contrato recebe um bug.</text>
  </svg>
  <figcaption>Liskov: se o filho não pode substituir o pai sem surpresas, a herança está errada.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Uma função que confia no contrato do retângulo:
// "mudar a largura NÃO mexe na altura"
static void TestarArea(RetanguloRuim r)
{
    r.Largura = 5;
    r.Altura = 4;
    Console.WriteLine($"{r.GetType().Name,-14} esperado: 20 | obtido: {r.Area()}");
}

Console.WriteLine("Herança errada:");
TestarArea(new RetanguloRuim());
TestarArea(new QuadradoRuim());   // 16! O "quadrado" quebrou quem confiava no retângulo

Console.WriteLine();
Console.WriteLine("Com a abstração correta:");
IForma[] formas = [new Retangulo(5, 4), new Quadrado(4)];
foreach (var forma in formas)
    Console.WriteLine($"{forma.GetType().Name,-14} área: {forma.Area()}");

// ❌ Quadrado herdando de Retângulo
public class RetanguloRuim
{
    public virtual int Largura { get; set; }
    public virtual int Altura { get; set; }
    public int Area() =&gt; Largura * Altura;
}

public class QuadradoRuim : RetanguloRuim
{
    // Para "continuar quadrado", muda os dois lados juntos... e surpreende quem usa Retângulo
    public override int Largura { get =&gt; base.Largura; set { base.Largura = value; base.Altura = value; } }
    public override int Altura  { get =&gt; base.Altura;  set { base.Largura = value; base.Altura = value; } }
}

// ✅ Irmãos, não pai e filho: cada um cumpre o contrato que promete
public interface IForma { int Area(); }
public record Retangulo(int Largura, int Altura) : IForma { public int Area() =&gt; Largura * Altura; }
public record Quadrado(int Lado) : IForma { public int Area() =&gt; Lado * Lado; }</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Herança errada:
RetanguloRuim  esperado: 20 | obtido: 20
QuadradoRuim   esperado: 20 | obtido: 16

Com a abstração correta:
Retangulo      área: 20
Quadrado       área: 16</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>TestarArea</code> foi escrita pensando em retângulos: define largura 5 e altura 4 e espera área 20.</li>
  <li><code>QuadradoRuim</code> herda de <code>RetanguloRuim</code> e, para "continuar quadrado", muda os dois lados a cada atribuição. Resultado: quando a altura vira 4, a largura também vira 4, e a área dá 16.</li>
  <li>Nada deu erro de compilação — o bug só aparece em tempo de execução, o que torna violações de Liskov perigosas.</li>
  <li>A correção: <code>Retangulo</code> e <code>Quadrado</code> viram "irmãos" que implementam <code>IForma</code>. Nenhum finge ser o outro.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Sinais de que Liskov foi violado</div>
  <ul>
    <li>Um <code>override</code> que lança <code>NotImplementedException</code> ou <code>NotSupportedException</code>.</li>
    <li>Código que pergunta o tipo antes de usar: <code>if (forma is Quadrado) ...</code>.</li>
    <li>Uma subclasse que exige mais (validações mais rígidas) ou entrega menos (resultados diferentes) do que a mãe prometia.</li>
  </ul>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>"É um" no mundo real não garante "é um" no código: herde só quando o filho puder substituir o pai sem ninguém perceber.</p>
</div>

<h3>2.2.4 I — Interface Segregation (Segregação de Interfaces)</h3>

<p class="step-label">📘 O conceito</p>
<p>Nenhuma classe deve ser obrigada a implementar métodos que ela não usa. Em vez de uma interface "gorda" com tudo, crie várias interfaces pequenas, cada uma representando <strong>uma capacidade</strong>. Uma classe pode implementar quantas quiser.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O controle remoto com 80 botões</div>
  <p>Para ver TV, seus pais só precisam de ligar, volume e canal. Um controle com 80 botões (dos quais 70 não fazem nada naquela TV) confunde e convida ao erro. Melhor: um controle simples para quem só assiste, e o controle completo para quem realmente usa as funções avançadas.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 270" role="img" aria-label="Interface gorda IMultifuncional força a ImpressoraSimples a implementar Escanear e EnviarFax lançando exceção; com interfaces pequenas, ImpressoraSimples implementa só IImpressora e a Multifuncional implementa IImpressora e IScanner">
    <defs><marker id="c2d7-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d7-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d7-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">❌ INTERFACE GORDA</text>
    <rect class="box-accent" x="20" y="36" width="260" height="90" rx="8"/>
    <text x="150.0" y="59.0" text-anchor="middle" font-weight="600">IMultifuncional</text>
    <text class="t-mono" x="150.0" y="77.0" text-anchor="middle">Imprimir()</text>
    <text class="t-mono" x="150.0" y="95.0" text-anchor="middle">Escanear()</text>
    <text class="t-mono" x="150.0" y="113.0" text-anchor="middle">EnviarFax()</text>
    <rect class="box-bad" x="20" y="160" width="260" height="76" rx="8"/>
    <text x="150.0" y="185.0" text-anchor="middle" font-weight="600">ImpressoraSimples</text>
    <text class="t-bad t-mono" x="150.0" y="203.0" text-anchor="middle">Escanear() → throw!</text>
    <text class="t-bad t-mono" x="150.0" y="221.0" text-anchor="middle">EnviarFax() → throw!</text>
    <path class="line" d="M150,160 L150,130" marker-end="url(#c2d7-head)"/>
    <text class="t-title" x="390" y="22">✅ INTERFACES PEQUENAS</text>
    <rect class="box-accent" x="390" y="40" width="140" height="50" rx="8"/>
    <text x="460.0" y="61.0" text-anchor="middle" font-weight="600">IImpressora</text>
    <text class="t-mono" x="460.0" y="79.0" text-anchor="middle">Imprimir()</text>
    <rect class="box-accent" x="560" y="40" width="140" height="50" rx="8"/>
    <text x="630.0" y="61.0" text-anchor="middle" font-weight="600">IScanner</text>
    <text class="t-mono" x="630.0" y="79.0" text-anchor="middle">Escanear()</text>
    <rect class="box-good" x="390" y="170" width="140" height="50" rx="8"/>
    <text x="460.0" y="200.0" text-anchor="middle" font-weight="600">ImpressoraSimples</text>
    <rect class="box-good" x="560" y="170" width="140" height="50" rx="8"/>
    <text x="630.0" y="200.0" text-anchor="middle" font-weight="600">Multifuncional</text>
    <path class="line" d="M460,170 L460,94" marker-end="url(#c2d7-head)"/>
    <path class="line" d="M610,170 L480,94" marker-end="url(#c2d7-head)"/>
    <path class="line" d="M650,170 L650,94" marker-end="url(#c2d7-head)"/>
    <text class="t-good" x="390" y="255">Cada classe implementa só o que sabe fazer.</text>
  </svg>
  <figcaption>Segregação de interfaces: ninguém deve ser obrigado a prometer o que não entrega.</figcaption>
</figure>

<p class="step-label">🧑‍💻 O código, explicado</p>
<p>Com uma interface gorda, a impressora simples é obrigada a "mentir" que sabe escanear — e o erro só aparece quando alguém tenta usar:</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// ❌ Interface gorda: nem todo aparelho faz tudo isso
public interface IMultifuncional
{
    void Imprimir(string arquivo);
    string Escanear();
    void EnviarFax(string numero);
}

public class ImpressoraSimples : IMultifuncional
{
    public void Imprimir(string arquivo) =&gt; Console.WriteLine($"imprimindo {arquivo}");
    public string Escanear() =&gt; throw new NotSupportedException();      // 💥 em produção
    public void EnviarFax(string numero) =&gt; throw new NotSupportedException();
}</code></pre>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var simples = new ImpressoraSimples();
var multi = new Multifuncional();

// Quem só precisa imprimir pede só IImpressora: aceita os dois aparelhos
var fila = new FilaDeImpressao();
fila.Enviar(simples, "contrato.pdf");
fila.Enviar(multi, "boleto.pdf");

// Quem precisa escanear pede IScanner: só a multifuncional serve
var digitalizacao = new Digitalizacao();
digitalizacao.Digitalizar(multi);
// digitalizacao.Digitalizar(simples);  // ❌ não compila: o erro aparece ANTES de rodar

// Interfaces pequenas, cada uma com uma capacidade
public interface IImpressora { void Imprimir(string arquivo); }
public interface IScanner { string Escanear(); }

public class ImpressoraSimples : IImpressora
{
    public void Imprimir(string arquivo) =&gt; Console.WriteLine($"[Simples] imprimindo {arquivo}");
}

// Quem sabe fazer mais coisas implementa mais de uma interface
public class Multifuncional : IImpressora, IScanner
{
    public void Imprimir(string arquivo) =&gt; Console.WriteLine($"[Multi]   imprimindo {arquivo}");
    public string Escanear() =&gt; "digitalizacao-001.png";
}

public class FilaDeImpressao
{
    public void Enviar(IImpressora impressora, string arquivo) =&gt; impressora.Imprimir(arquivo);
}

public class Digitalizacao
{
    public void Digitalizar(IScanner scanner) =&gt;
        Console.WriteLine($"[Scanner] arquivo gerado: {scanner.Escanear()}");
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>[Simples] imprimindo contrato.pdf
[Multi]   imprimindo boleto.pdf
[Scanner] arquivo gerado: digitalizacao-001.png</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>IImpressora</code> e <code>IScanner</code> representam uma capacidade cada.</li>
  <li><code>Multifuncional : IImpressora, IScanner</code> implementa as duas, e <code>ImpressoraSimples</code> só a primeira.</li>
  <li><code>Digitalizacao</code> pede um <code>IScanner</code>. Se você descomentar <code>digitalizacao.Digitalizar(simples)</code>, o compilador recusa (erro <strong>CS1503</strong>): o erro que antes explodia em produção agora aparece antes de rodar.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Interfaces pequenas deixam o compilador impedir o uso errado, em vez de uma exceção em produção.</p>
</div>

<h3>2.2.5 D — Dependency Inversion (Inversão de Dependência)</h3>

<p class="step-label">📘 O conceito</p>
<p>As <strong>regras de negócio</strong> (alto nível) não devem depender de <strong>detalhes técnicos</strong> (baixo nível), como banco de dados, e-mail ou APIs externas. Ambos devem depender de uma <strong>abstração</strong> — uma interface que a regra de negócio define. Assim, trocar o banco ou usar dados falsos num teste não exige mudar a regra.</p><p>Na prática, isso se faz com <strong>injeção de dependência</strong>: a classe recebe o que precisa pelo construtor, em vez de criar com <code>new</code>.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A tomada na parede</div>
  <p>Você não solda o fio do abajur direto na fiação dentro da parede. Você usa uma tomada: o abajur depende da tomada, e a rede elétrica também "se encaixa" na tomada. Por isso dá para mudar de casa e levar o abajur — ou testar o abajur numa bancada, com uma fonte qualquer.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 270" role="img" aria-label="Antes, GeradorDeRelatorio depende diretamente de PedidosDoBanco. Depois, GeradorDeRelatorio depende da interface IFonteDePedidos, e PedidosDoBanco e PedidosFalsos implementam essa interface">
    <defs><marker id="c2d8-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d8-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d8-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">❌ ACOPLADO AO DETALHE</text>
    <rect class="box-accent" x="30" y="44" width="220" height="50" rx="8"/>
    <text x="140.0" y="65.0" text-anchor="middle" font-weight="600">GeradorDeRelatorio</text>
    <text class="t-muted" x="140.0" y="83.0" text-anchor="middle">regra de negócio</text>
    <rect class="box-bad" x="30" y="170" width="220" height="50" rx="8"/>
    <text x="140.0" y="191.0" text-anchor="middle" font-weight="600">PedidosDoBanco</text>
    <text class="t-mono t-bad" x="140.0" y="209.0" text-anchor="middle">new PedidosDoBanco()</text>
    <path class="line-bad" d="M140,94 L140,166" marker-end="url(#c2d8-head-bad)"/>
    <text class="t-muted" x="150" y="135">depende de</text>
    <text class="t-title" x="360" y="22">✅ OS DOIS DEPENDEM DA ABSTRAÇÃO</text>
    <rect class="box-accent" x="430" y="36" width="220" height="46" rx="8"/>
    <text x="540.0" y="64.0" text-anchor="middle" font-weight="600">GeradorDeRelatorio</text>
    <rect class="box-warn" x="430" y="116" width="220" height="46" rx="8"/>
    <text class="t-mono" x="540.0" y="144.0" text-anchor="middle">IFonteDePedidos</text>
    <rect class="box-good" x="370" y="200" width="160" height="46" rx="8"/>
    <text x="450.0" y="228.0" text-anchor="middle" font-weight="600">PedidosDoBanco</text>
    <rect class="box-good" x="550" y="200" width="160" height="46" rx="8"/>
    <text x="630.0" y="228.0" text-anchor="middle" font-weight="600">PedidosFalsos</text>
    <path class="line" d="M540,82 L540,112" marker-end="url(#c2d8-head)"/>
    <path class="line" d="M450,200 L500,166" marker-end="url(#c2d8-head)"/>
    <path class="line" d="M630,200 L580,166" marker-end="url(#c2d8-head)"/>
    <text class="t-muted" x="10" y="258">Trocar o banco (ou usar um dublê em testes) não muda uma linha do Gerador.</text>
  </svg>
  <figcaption>Inversão de dependência: o detalhe "se encaixa" na abstração, e não o contrário.</figcaption>
</figure>

<p class="step-label">🧑‍💻 O código, explicado</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// ❌ A regra de negócio cria o detalhe: acoplamento permanente
public class GeradorDeRelatorio
{
    private readonly PedidosDoBanco _fonte = new();   // só funciona com ESTE banco
    // Para testar, você precisa de um banco de verdade rodando.
}

// ✅ A regra de negócio recebe a abstração
public class GeradorDeRelatorio(IFonteDePedidos fonte) { /* ... */ }</code></pre>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// Produção: dados "de verdade"
var relatorio = new GeradorDeRelatorio(new PedidosDoBanco());
relatorio.Imprimir();

// Teste: dados controlados — sem banco, sem rede, e o Gerador não mudou nada
var relatorioDeTeste = new GeradorDeRelatorio(new PedidosFalsos());
relatorioDeTeste.Imprimir();

// A ABSTRAÇÃO: "alguém que me entregue os valores dos pedidos"
public interface IFonteDePedidos
{
    string Nome { get; }
    IReadOnlyList&lt;decimal&gt; ObterValores();
}

// Detalhe 1: simula a leitura de um banco de dados
public class PedidosDoBanco : IFonteDePedidos
{
    public string Nome =&gt; "Banco SQL";
    public IReadOnlyList&lt;decimal&gt; ObterValores() =&gt; [120m, 89.90m, 430m, 15.50m];
}

// Detalhe 2: um "dublê" para testes
public class PedidosFalsos : IFonteDePedidos
{
    public string Nome =&gt; "Dados de teste";
    public IReadOnlyList&lt;decimal&gt; ObterValores() =&gt; [100m, 100m];
}

// ALTO NÍVEL: a regra de negócio. Não sabe (nem quer saber) de onde vêm os dados
public class GeradorDeRelatorio(IFonteDePedidos fonte)
{
    public void Imprimir()
    {
        var valores = fonte.ObterValores();
        Console.WriteLine($"[{fonte.Nome}] {valores.Count} pedidos | total {valores.Sum():C} | média {valores.Average():C}");
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>[Banco SQL] 4 pedidos | total R$ 655,40 | média R$ 163,85
[Dados de teste] 2 pedidos | total R$ 200,00 | média R$ 100,00</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>IFonteDePedidos</code> é o contrato que a regra de negócio precisa: "me dê os valores dos pedidos".</li>
  <li><code>GeradorDeRelatorio(IFonteDePedidos fonte)</code> recebe a fonte pronta pelo construtor. Ele nunca escreve <code>new PedidosDoBanco()</code>.</li>
  <li>O mesmo gerador roda com o "banco" e com <code>PedidosFalsos</code> — é assim que se escreve teste unitário sem banco de dados.</li>
  <li><code>valores.Sum()</code> e <code>valores.Average()</code> são métodos do LINQ: 655,40 ÷ 4 = 163,85.</li>
</ul>

<p>Num projeto ASP.NET Core, quem faz o <code>new</code> é o contêiner de injeção de dependência (veja o Capítulo 4.2):</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">builder.Services.AddScoped&lt;IFonteDePedidos, PedidosDoBanco&gt;();  // produção
builder.Services.AddScoped&lt;GeradorDeRelatorio&gt;();
// Nos testes: new GeradorDeRelatorio(new PedidosFalsos())</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>A regra de negócio define a tomada, e os detalhes técnicos se plugam nela, nunca o contrário.</p>
</div>

<h2>2.3 Design Patterns Essenciais (GoF)</h2>

<p>Design Patterns são <strong>soluções testadas para problemas que se repetem</strong>. O livro <em>Design Patterns</em> (1994), da "Gangue dos Quatro" (GoF), catalogou 23 deles. Mais do que código pronto, eles são um <strong>vocabulário</strong>: dizer "isso é um Decorator" explica em duas palavras o que levaria um parágrafo.</p>

<table>
  <thead><tr><th>Família</th><th>Resolve</th><th>Neste capítulo</th></tr></thead>
  <tbody>
    <tr><td><strong>Criacionais</strong></td><td>Como <em>criar</em> objetos</td><td>Factory, Builder</td></tr>
    <tr><td><strong>Estruturais</strong></td><td>Como <em>combinar</em> objetos</td><td>Decorator, Adapter</td></tr>
    <tr><td><strong>Comportamentais</strong></td><td>Como objetos <em>conversam</em></td><td>Strategy (2.2.2), Chain of Responsibility, Observer, Command</td></tr>
  </tbody>
</table>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Pattern não é objetivo</div>
  <p>Use um padrão quando você <em>sentir o problema</em> que ele resolve — não antes. Três classes e duas interfaces para algo que um <code>if</code> resolveria é overengineering, e custa tanto quanto código bagunçado.</p>
</div>

<h3>2.3.1 Factory — quem cria os objetos</h3>

<p class="step-label">📘 O conceito</p>
<p>Uma <strong>Factory</strong> (fábrica) centraliza a decisão de <em>qual classe concreta criar</em>. Quem usa pede algo pelo que é ("uma notificação de SMS") e recebe uma interface pronta, sem espalhar <code>new NotificacaoSms()</code> pelo sistema. Se a forma de criar mudar, muda um lugar só.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O balcão da pizzaria</div>
  <p>Você pede "uma calabresa" no balcão. Não entra na cozinha, não escolhe a farinha nem liga o forno. A cozinha (a fábrica) sabe montar cada sabor e te entrega uma pizza pronta. Se amanhã a receita da calabresa mudar, o seu pedido continua igual.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 210" role="img" aria-label="Quem usa pede Criar(&quot;sms&quot;) à FabricaDeNotificacoes, que decide e devolve uma NotificacaoSms, vista pelo chamador apenas como INotificacao">
    <defs><marker id="c2d9-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d9-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d9-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box" x="10" y="70" width="170" height="64" rx="8"/>
    <text class="t-mono" x="95.0" y="98.0" text-anchor="middle">Criar("sms")</text>
    <text class="t-muted" x="95.0" y="116.0" text-anchor="middle">"quero um SMS"</text>
    <rect class="box-accent" x="226" y="30" width="290" height="144" rx="10"/>
    <text x="371" y="56" text-anchor="middle" font-weight="600">FabricaDeNotificacoes</text>
    <text class="t-mono t-muted" x="242" y="90">"email" → NotificacaoEmail</text>
    <text class="t-mono t-good" x="242" y="116">"sms" → NotificacaoSms</text>
    <text class="t-mono t-muted" x="242" y="142">"whatsapp" → NotificacaoWhatsApp</text>
    <rect class="box-good" x="560" y="70" width="150" height="64" rx="8"/>
    <text x="635.0" y="98.0" text-anchor="middle" font-weight="600">NotificacaoSms</text>
    <text class="t-muted" x="635.0" y="116.0" text-anchor="middle">vista como INotificacao</text>
    <path class="line" d="M180,102 L222,102" marker-end="url(#c2d9-head)"/>
    <path class="line-good" d="M516,102 L556,102" marker-end="url(#c2d9-head-good)"/>
    <text class="t-muted" x="10" y="200">Quem usa não escreve "new NotificacaoSms()": o único lugar que conhece as classes concretas é a fábrica.</text>
  </svg>
  <figcaption>Factory: você pede o "sabor"; a cozinha decide como montar.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Quem usa só diz O QUE quer; a fábrica decide COMO criar
foreach (var canal in new[] { "email", "sms", "whatsapp" })
{
    INotificacao notificacao = FabricaDeNotificacoes.Criar(canal);
    notificacao.Enviar("Seu pedido saiu para entrega e chega hoje!");
}

try
{
    FabricaDeNotificacoes.Criar("pombo-correio");
}
catch (ArgumentException ex)
{
    Console.WriteLine(ex.Message);
}

public interface INotificacao { void Enviar(string mensagem); }

public class NotificacaoEmail : INotificacao
{
    public void Enviar(string m) =&gt; Console.WriteLine($"[E-mail]   Assunto: Atualização | {m}");
}

public class NotificacaoSms : INotificacao
{
    // SMS tem limite de caracteres: um detalhe que só esta classe precisa conhecer
    public void Enviar(string m) =&gt; Console.WriteLine($"[SMS]      {(m.Length &gt; 25 ? m[..25] + "..." : m)}");
}

public class NotificacaoWhatsApp : INotificacao
{
    public void Enviar(string m) =&gt; Console.WriteLine($"[WhatsApp] *Loja .NET*: {m}");
}

// O ÚNICO lugar do sistema que sabe qual classe criar para cada canal
public static class FabricaDeNotificacoes
{
    public static INotificacao Criar(string canal) =&gt; canal switch
    {
        "email"    =&gt; new NotificacaoEmail(),
        "sms"      =&gt; new NotificacaoSms(),
        "whatsapp" =&gt; new NotificacaoWhatsApp(),
        _          =&gt; throw new ArgumentException($"Canal '{canal}' não suportado.")
    };
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>[E-mail]   Assunto: Atualização | Seu pedido saiu para entrega e chega hoje!
[SMS]      Seu pedido saiu para entr...
[WhatsApp] *Loja .NET*: Seu pedido saiu para entrega e chega hoje!
Canal 'pombo-correio' não suportado.</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>FabricaDeNotificacoes.Criar</code> é o único lugar do sistema que conhece as classes concretas. O resto do código só vê <code>INotificacao</code>.</li>
  <li>O <code>switch</code> com <code>=&gt;</code> é uma <em>switch expression</em>: cada linha mapeia um valor a um resultado, e <code>_</code> é o "qualquer outro caso".</li>
  <li><code>m[..25]</code> pega os 25 primeiros caracteres (<em>range operator</em>): um detalhe que só a classe de SMS precisa conhecer.</li>
</ul>

<p><strong>No .NET real:</strong> <code>IHttpClientFactory</code> (cria <code>HttpClient</code> configurados) e <code>ILoggerFactory</code> são fábricas que você usa todo dia.</p>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Factory: pedir pelo nome e receber pronto, com a decisão de <code>new</code> num lugar só.</p>
</div>

<h3>2.3.2 Builder — montar passo a passo</h3>

<p class="step-label">📘 O conceito</p>
<p>O <strong>Builder</strong> monta um objeto complexo em etapas, com métodos encadeados e legíveis, e só entrega o resultado no final — depois de validar que está completo. Resolve construtores com parâmetros demais (<code>new Lanche("integral", "frango", true, null, null, "barbecue")</code> — o que é esse <code>true</code>?).</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Montar o lanche no balcão</div>
  <p>No balcão da lanchonete de sanduíches, você não diz tudo de uma vez: escolhe o pão, depois o recheio, o queijo, os molhos. O atendente vai montando e, no final, fecha o lanche. Se você esquecer o pão, ele avisa antes de entregar.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 190" role="img" aria-label="O builder monta o lanche passo a passo: ComPao, ComRecheio, ComQueijo, ComMolho e por fim Montar, que valida e entrega um Lanche pronto">
    <defs><marker id="c2d10-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d10-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d10-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box" x="10" y="50" width="100" height="44" rx="8"/>
    <text class="t-mono" x="60.0" y="77.0" text-anchor="middle">ComPao</text>
    <path class="line" d="M110,72 L124,72" marker-end="url(#c2d10-head)"/>
    <rect class="box" x="128" y="50" width="100" height="44" rx="8"/>
    <text class="t-mono" x="178.0" y="77.0" text-anchor="middle">ComRecheio</text>
    <path class="line" d="M228,72 L242,72" marker-end="url(#c2d10-head)"/>
    <rect class="box" x="246" y="50" width="100" height="44" rx="8"/>
    <text class="t-mono" x="296.0" y="77.0" text-anchor="middle">ComQueijo</text>
    <path class="line" d="M346,72 L360,72" marker-end="url(#c2d10-head)"/>
    <rect class="box" x="364" y="50" width="100" height="44" rx="8"/>
    <text class="t-mono" x="414.0" y="77.0" text-anchor="middle">ComMolho</text>
    <path class="line" d="M464,72 L478,72" marker-end="url(#c2d10-head)"/>
    <rect class="box-accent" x="482" y="50" width="100" height="44" rx="8"/>
    <text class="t-mono" x="532.0" y="77.0" text-anchor="middle">Montar()</text>
    <path class="line" d="M600,72 L606,72" marker-end="url(#c2d10-head)"/>
    <rect class="box-good" x="610" y="42" width="100" height="60" rx="8"/>
    <text x="660.0" y="68.0" text-anchor="middle" font-weight="600">Lanche</text>
    <text class="t-muted" x="660.0" y="86.0" text-anchor="middle">pronto e válido</text>
    <text class="t-muted" x="10" y="30">cada passo devolve o próprio montador ("return this") → dá para encadear</text>
    <path class="line" d="M532,94 L532,130"/>
    <text class="t-muted" x="532" y="148" text-anchor="middle">valida tudo aqui: faltou pão? faltou recheio? → erro</text>
    <text class="t-muted" x="10" y="180">Útil quando um objeto tem muitas partes opcionais e regras para ficar completo.</text>
  </svg>
  <figcaption>Builder: montar um objeto complexo passo a passo, como pedir um lanche no balcão.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var lanche = new MontadorDeLanche()
    .ComPao("integral")
    .ComRecheio("frango")
    .ComQueijo()
    .ComMolho("mostarda e mel")
    .ComMolho("barbecue")
    .Montar();

Console.WriteLine(lanche);

try
{
    new MontadorDeLanche().ComQueijo().Montar(); // esqueceu o pão e o recheio
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"Não deu para montar: {ex.Message}");
}

// O PRODUTO final: imutável e sempre válido
public record Lanche(string Pao, string Recheio, bool Queijo, IReadOnlyList&lt;string&gt; Molhos)
{
    public override string ToString() =&gt;
        $"Lanche: pão {Pao}, {Recheio}{(Queijo ? ", com queijo" : "")}, molhos: {string.Join(" + ", Molhos)}";
}

// O BUILDER: o "atendente" que monta passo a passo
public class MontadorDeLanche
{
    private string? _pao;
    private string? _recheio;
    private bool _queijo;
    private readonly List&lt;string&gt; _molhos = [];

    // Cada passo devolve o próprio montador ("return this"), o que permite encadear chamadas
    public MontadorDeLanche ComPao(string tipo)     { _pao = tipo; return this; }
    public MontadorDeLanche ComRecheio(string tipo) { _recheio = tipo; return this; }
    public MontadorDeLanche ComQueijo()             { _queijo = true; return this; }
    public MontadorDeLanche ComMolho(string molho)  { _molhos.Add(molho); return this; }

    public Lanche Montar()
    {
        // As validações ficam num lugar só: no final
        if (_pao is null) throw new InvalidOperationException("escolha o pão.");
        if (_recheio is null) throw new InvalidOperationException("escolha o recheio.");
        return new Lanche(_pao, _recheio, _queijo, _molhos.ToList());
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Lanche: pão integral, frango, com queijo, molhos: mostarda e mel + barbecue
Não deu para montar: escolha o pão.</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Cada método <code>ComXxx</code> guarda a escolha e termina com <code>return this</code>: é isso que permite escrever <code>.ComPao(...).ComRecheio(...)</code> em sequência.</li>
  <li><code>Montar()</code> concentra as validações e devolve um <code>Lanche</code> imutável (<code>record</code>). Não existe "lanche pela metade" circulando pelo sistema.</li>
  <li>O segundo pedido esquece o pão e o recheio: a exceção avisa o que falta.</li>
</ul>

<p><strong>No .NET real:</strong> <code>WebApplication.CreateBuilder()</code>, <code>StringBuilder</code>, <code>UriBuilder</code> e o <code>HostBuilder</code> seguem esse padrão.</p>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Builder: muitas partes opcionais, montadas de forma legível e validadas no fim.</p>
</div>

<h3>2.3.3 Decorator — acrescentar camadas</h3>

<p class="step-label">📘 O conceito</p>
<p>O <strong>Decorator</strong> adiciona comportamento a um objeto <em>embrulhando</em> ele em outro objeto com a mesma interface. Cada "embrulho" faz a sua parte e repassa a chamada para o de dentro. Dá para empilhar quantas camadas quiser, em qualquer ordem, sem alterar a classe original — e sem criar uma subclasse para cada combinação.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O café da cafeteria</div>
  <p>Você pede um expresso. Depois: "com leite". Depois: "com chantilly". O barista não faz uma bebida nova do zero para cada combinação — ele vai <em>acrescentando camadas</em> ao mesmo copo. O preço final é o expresso mais cada adicional. Com herança, seriam dezenas de classes (<code>CafeComLeite</code>, <code>CafeComLeiteEChantilly</code>, …).</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 260" role="img" aria-label="Três camadas encaixadas: ComChantilly envolve ComLeite, que envolve Expresso. A pergunta Preco entra até o centro, e cada camada soma seu valor na volta: 6 mais 2 mais 3,50 igual a 11,50">
    <defs><marker id="c2d11-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d11-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d11-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="20" width="440" height="200" rx="16"/>
    <text class="t-mono" x="30" y="46">ComChantilly  +3,50</text>
    <rect class="box-warn" x="40" y="62" width="380" height="140" rx="14"/>
    <text class="t-mono" x="60" y="88">ComLeite  +2,00</text>
    <rect class="box-good" x="70" y="104" width="320" height="80" rx="12"/>
    <text x="230" y="140" text-anchor="middle" font-weight="600">Expresso</text>
    <text class="t-mono" x="230" y="162" text-anchor="middle">6,00</text>
    <path class="line" d="M480,70 L700,70" marker-end="url(#c2d11-head)"/>
    <text class="t-muted" x="590" y="60" text-anchor="middle">Preco? (entra)</text>
    <path class="line-good" d="M700,130 L480,130" marker-end="url(#c2d11-head-good)"/>
    <text class="t-good" x="590" y="120" text-anchor="middle">volta somando</text>
    <text class="t-mono" x="590" y="158" text-anchor="middle">6,00 + 2,00 + 3,50</text>
    <text class="t-good" x="590" y="182" text-anchor="middle">= R$ 11,50</text>
    <text class="t-muted" x="10" y="248">Cada camada tem a MESMA interface (ICafe) do que ela embrulha — por isso dá para empilhar.</text>
  </svg>
  <figcaption>Decorator: acrescentar comportamento embrulhando o objeto, sem alterar a classe dele.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

ICafe pedido1 = new CafeExpresso();
ICafe pedido2 = new ComChantilly(new ComLeite(new CafeExpresso()));
ICafe pedido3 = new ComLeite(new ComLeite(new CafeExpresso())); // leite em dobro!

foreach (var cafe in new[] { pedido1, pedido2, pedido3 })
    Console.WriteLine($"{cafe.Descricao,-35} {cafe.Preco,8:C}");

public interface ICafe
{
    string Descricao { get; }
    decimal Preco { get; }
}

// O objeto "de base"
public class CafeExpresso : ICafe
{
    public string Descricao =&gt; "Expresso";
    public decimal Preco =&gt; 6m;
}

// Decoradores: cada um É um ICafe e TEM um ICafe dentro dele.
// Eles repassam a chamada para o de dentro e somam o seu próprio pedaço.
public class ComLeite(ICafe cafe) : ICafe
{
    public string Descricao =&gt; cafe.Descricao + " + leite";
    public decimal Preco =&gt; cafe.Preco + 2m;
}

public class ComChantilly(ICafe cafe) : ICafe
{
    public string Descricao =&gt; cafe.Descricao + " + chantilly";
    public decimal Preco =&gt; cafe.Preco + 3.5m;
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Expresso                             R$ 6,00
Expresso + leite + chantilly        R$ 11,50
Expresso + leite + leite            R$ 10,00</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>ComLeite(ICafe cafe) : ICafe</code> — o decorador <em>é</em> um <code>ICafe</code> e <em>tem</em> um <code>ICafe</code> dentro. Por isso dá para colocar um decorador dentro de outro.</li>
  <li><code>Preco =&gt; cafe.Preco + 2m</code> pergunta o preço à camada de dentro e soma o seu adicional.</li>
  <li><code>new ComChantilly(new ComLeite(new CafeExpresso()))</code> se lê de dentro para fora: expresso, depois leite, depois chantilly.</li>
</ul>

<p><strong>No mundo real:</strong> decorators adicionam log, cache, retentativas ou métricas a um serviço sem mexer nele. Os <em>streams</em> do .NET são decorators clássicos: <code>new GZipStream(new BufferedStream(new FileStream(...)), ...)</code>.</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Um decorator de LOG para qualquer serviço de pedidos
public class ServicoDePedidosComLog(IServicoDePedidos interno, ILogger&lt;ServicoDePedidosComLog&gt; log)
    : IServicoDePedidos
{
    public async Task FinalizarAsync(Pedido pedido)
    {
        log.LogInformation("Finalizando pedido de {Email}", pedido.EmailCliente);
        await interno.FinalizarAsync(pedido);           // repassa para o de dentro
        log.LogInformation("Pedido finalizado");
    }
}</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Decorator: empilhar comportamentos como camadas, sem mexer na classe original.</p>
</div>

<h3>2.3.4 Adapter — fazer interfaces incompatíveis conversarem</h3>

<p class="step-label">📘 O conceito</p>
<p>O <strong>Adapter</strong> é um tradutor entre duas interfaces que não se encaixam — tipicamente o <em>seu</em> sistema e uma biblioteca antiga ou um serviço externo que você não pode alterar. O adaptador implementa a interface que o seu sistema espera e, por dentro, chama o sistema externo, convertendo entradas e saídas.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O adaptador de tomada de viagem</div>
  <p>Seu carregador tem plugue brasileiro; a tomada do hotel na Europa é diferente. Você não troca a tomada do hotel nem corta o plugue do carregador: coloca um adaptador no meio. Cada lado continua igual — só o adaptador conhece os dois formatos.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 220" role="img" aria-label="O Checkout chama Cobrar com 149,90 reais; o adaptador converte para 14990 centavos e chama o GatewayAntigo, que devolve o código 200; o adaptador traduz 200 para true">
    <defs><marker id="c2d12-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d12-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d12-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box" x="10" y="60" width="150" height="60" rx="8"/>
    <text x="85.0" y="86.0" text-anchor="middle" font-weight="600">Checkout</text>
    <text class="t-mono" x="85.0" y="104.0" text-anchor="middle">Cobrar(149,90)</text>
    <rect class="box-accent" x="250" y="40" width="220" height="100" rx="8"/>
    <text x="360.0" y="77.0" text-anchor="middle" font-weight="600">Adaptador</text>
    <text class="t-muted" x="360.0" y="95.0" text-anchor="middle">reais → centavos</text>
    <text class="t-muted" x="360.0" y="113.0" text-anchor="middle">200 → true</text>
    <rect class="box-warn" x="560" y="60" width="150" height="60" rx="8"/>
    <text x="635.0" y="86.0" text-anchor="middle" font-weight="600">GatewayAntigo</text>
    <text class="t-muted" x="635.0" y="104.0" text-anchor="middle">(não podemos mudar)</text>
    <path class="line" d="M160,80 L246,80" marker-end="url(#c2d12-head)"/>
    <text class="t-mono t-muted" x="203" y="72" text-anchor="middle">decimal</text>
    <path class="line" d="M470,80 L556,80" marker-end="url(#c2d12-head)"/>
    <text class="t-mono" x="513" y="72" text-anchor="middle">14990</text>
    <path class="line-good" d="M556,108 L474,108" marker-end="url(#c2d12-head-good)"/>
    <text class="t-mono" x="513" y="126" text-anchor="middle">200</text>
    <path class="line-good" d="M246,108 L164,108" marker-end="url(#c2d12-head-good)"/>
    <text class="t-mono t-good" x="203" y="126" text-anchor="middle">true</text>
    <text class="t-muted" x="10" y="180">Nosso sistema fala IPagamento; o gateway fala "centavos e códigos".</text>
    <text class="t-muted" x="10" y="200">O adaptador é o único que conhece as duas línguas.</text>
  </svg>
  <figcaption>Adapter: o adaptador de tomada de viagem — ninguém troca a tomada do hotel nem o plugue do carregador.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// O resto do sistema só conhece a interface moderna
IPagamento pagamento = new AdaptadorDoGatewayAntigo(new GatewayAntigo());

var checkout = new Checkout(pagamento);
checkout.Finalizar(149.90m);
checkout.Finalizar(25_000m);

// A interface que o NOSSO sistema espera: reais (decimal) e resposta sim/não
public interface IPagamento { bool Cobrar(decimal valorEmReais); }

// Biblioteca antiga que NÃO podemos alterar: centavos (int) e códigos numéricos
public class GatewayAntigo
{
    public int ProcessarTransacao(int valorEmCentavos)
    {
        Console.WriteLine($"  [gateway antigo] recebi {valorEmCentavos} centavos");
        return valorEmCentavos &lt;= 1_000_000 ? 200 : 402; // 402 = limite excedido
    }
}

// O ADAPTADOR: "fala" IPagamento por fora e GatewayAntigo por dentro
public class AdaptadorDoGatewayAntigo(GatewayAntigo gateway) : IPagamento
{
    public bool Cobrar(decimal valorEmReais)
    {
        int centavos = (int)Math.Round(valorEmReais * 100);  // traduz a ENTRADA
        int codigo = gateway.ProcessarTransacao(centavos);
        return codigo == 200;                                 // traduz a SAÍDA
    }
}

public class Checkout(IPagamento pagamento)
{
    public void Finalizar(decimal valor)
    {
        bool aprovado = pagamento.Cobrar(valor);
        Console.WriteLine($"Compra de {valor:C}: {(aprovado ? "APROVADA" : "RECUSADA")}");
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>  [gateway antigo] recebi 14990 centavos
Compra de R$ 149,90: APROVADA
  [gateway antigo] recebi 2500000 centavos
Compra de R$ 25.000,00: RECUSADA</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>GatewayAntigo</code> trabalha com centavos (<code>int</code>) e devolve códigos numéricos — e não podemos alterá-lo.</li>
  <li><code>AdaptadorDoGatewayAntigo</code> implementa <code>IPagamento</code>: converte reais em centavos na entrada e o código 200 em <code>true</code> na saída.</li>
  <li><code>Math.Round(valorEmReais * 100)</code> evita erros de arredondamento na conversão.</li>
  <li>O <code>Checkout</code> nem sabe que o gateway antigo existe. Se ele for trocado por um novo, só o adaptador muda.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Adapter: uma classe tradutora que isola o código "estrangeiro" do seu sistema.</p>
</div>

<h3>2.3.5 Chain of Responsibility — passar adiante</h3>

<p class="step-label">📘 O conceito</p>
<p>Na <strong>Chain of Responsibility</strong> (cadeia de responsabilidade), um pedido percorre uma fila de "elos". Cada elo decide: <em>resolvo eu</em> ou <em>passo para o próximo</em>. Quem envia o pedido só conhece o primeiro elo, e dá para inserir, remover ou reordenar elos sem mudar quem pede.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A aprovação de reembolso</div>
  <p>Você pede o reembolso de uma viagem. O supervisor aprova até R$ 500; acima disso, encaminha ao gerente, que aprova até R$ 5.000; acima disso, vai para o diretor. Você entrega o pedido a uma pessoa só e ele chega a quem pode decidir.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 220" role="img" aria-label="Um pedido de reembolso de 3.200 reais passa pelo Supervisor, com limite de 500, que repassa; o Gerente, com limite de 5.000, aprova; o Diretor nem é consultado">
    <defs><marker id="c2d13-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d13-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d13-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="70" width="130" height="60" rx="8"/>
    <text x="75.0" y="96.0" text-anchor="middle" font-weight="600">Reembolso</text>
    <text class="t-mono" x="75.0" y="114.0" text-anchor="middle">R$ 3.200</text>
    <rect class="box" x="190" y="70" width="150" height="60" rx="8"/>
    <text x="265.0" y="96.0" text-anchor="middle" font-weight="600">Supervisor</text>
    <text class="t-muted" x="265.0" y="114.0" text-anchor="middle">limite R$ 500</text>
    <rect class="box-good" x="390" y="70" width="150" height="60" rx="8"/>
    <text x="465.0" y="96.0" text-anchor="middle" font-weight="600">Gerente</text>
    <text class="t-muted" x="465.0" y="114.0" text-anchor="middle">limite R$ 5.000</text>
    <rect class="box" x="590" y="70" width="120" height="60" rx="8"/>
    <text x="650.0" y="96.0" text-anchor="middle" font-weight="600">Diretor</text>
    <text class="t-muted" x="650.0" y="114.0" text-anchor="middle">limite R$ 50.000</text>
    <path class="line" d="M140,100 L186,100" marker-end="url(#c2d13-head)"/>
    <path class="line" d="M340,100 L386,100" marker-end="url(#c2d13-head)"/>
    <path class="line-bad" d="M540,100 L586,100"/>
    <text class="t-muted" x="265" y="160" text-anchor="middle">não é comigo → passa</text>
    <text class="t-good" x="465" y="160" text-anchor="middle">✓ aprovado aqui</text>
    <text class="t-muted" x="650" y="160" text-anchor="middle">nem é chamado</text>
    <text class="t-muted" x="10" y="205">Quem pede conhece só o primeiro elo. Cada elo decide: resolve ou passa adiante.</text>
  </svg>
  <figcaption>Chain of Responsibility: a cadeia de aprovação de uma empresa.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// Monta a corrente: Supervisor -&gt; Gerente -&gt; Diretor
var supervisor = new Aprovador("Supervisor", limite: 500m);
var gerente    = new Aprovador("Gerente",    limite: 5_000m);
var diretor    = new Aprovador("Diretor",    limite: 50_000m);
supervisor.DefinirProximo(gerente).DefinirProximo(diretor);

// Quem pede só conhece o PRIMEIRO elo da corrente
foreach (var valor in new[] { 120m, 3_200m, 18_000m, 90_000m })
    Console.WriteLine($"Reembolso de {valor,12:C} -&gt; {supervisor.Avaliar(valor)}");

public class Aprovador(string cargo, decimal limite)
{
    private Aprovador? _proximo;

    public Aprovador DefinirProximo(Aprovador proximo)
    {
        _proximo = proximo;
        return proximo; // permite encadear a montagem
    }

    public string Avaliar(decimal valor)
    {
        if (valor &lt;= limite)
            return $"aprovado pelo {cargo}";

        // Não é comigo: passo adiante (se houver alguém depois de mim)
        return _proximo?.Avaliar(valor) ?? "recusado: acima de todos os limites";
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Reembolso de    R$ 120,00 -&gt; aprovado pelo Supervisor
Reembolso de  R$ 3.200,00 -&gt; aprovado pelo Gerente
Reembolso de R$ 18.000,00 -&gt; aprovado pelo Diretor
Reembolso de R$ 90.000,00 -&gt; recusado: acima de todos os limites</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Cada <code>Aprovador</code> guarda uma referência ao <code>_proximo</code> — é isso que forma a "corrente".</li>
  <li><code>DefinirProximo</code> devolve o elo recebido, então <code>supervisor.DefinirProximo(gerente).DefinirProximo(diretor)</code> monta a cadeia inteira em uma linha.</li>
  <li><code>_proximo?.Avaliar(valor) ?? "recusado..."</code>: se existe um próximo, pergunta a ele; se não existe (<code>null</code>), recusa.</li>
</ul>

<p><strong>No .NET real:</strong> o <strong>pipeline de middleware do ASP.NET Core</strong> (Capítulo 4.1) é exatamente uma cadeia de responsabilidade: cada middleware trata a requisição ou chama <code>next()</code>. Os <code>DelegatingHandler</code> do <code>HttpClient</code> também.</p>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Chain of Responsibility: cada elo resolve ou passa adiante, e quem pede não precisa saber quem resolve.</p>
</div>

<h3>2.3.6 Observer — avisar quem se inscreveu</h3>

<p class="step-label">📘 O conceito</p>
<p>No <strong>Observer</strong>, um objeto (o <em>publicador</em>) mantém uma lista de interessados (os <em>observadores</em>) e avisa todos quando algo acontece. O publicador não sabe quem são nem o que farão com o aviso. Em C#, esse padrão já vem pronto na linguagem: <strong><code>event</code></strong>, com <code>+=</code> para se inscrever e <code>-=</code> para cancelar.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: "Avise-me quando chegar"</div>
  <p>O produto está esgotado e o site oferece o botão "avise-me quando chegar". A loja não liga para cada cliente perguntando se ainda quer; ela guarda a lista e, quando o estoque chega, dispara o aviso para todos os inscritos. É o mesmo "sininho" dos canais de vídeo.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 266" role="img" aria-label="A Loja dispara o evento ProdutoChegou; Ana e o PainelDoEstoque recebem o aviso; Bruno cancelou a inscrição e não recebe">
    <defs><marker id="c2d14-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d14-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d14-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="90" width="200" height="70" rx="8"/>
    <text x="110.0" y="121.0" text-anchor="middle" font-weight="600">Loja</text>
    <text class="t-mono" x="110.0" y="139.0" text-anchor="middle">event ProdutoChegou</text>
    <rect class="box-good" x="450" y="20" width="260" height="56" rx="8"/>
    <text x="580.0" y="44.0" text-anchor="middle" font-weight="600">Ana</text>
    <text class="t-muted" x="580.0" y="62.0" text-anchor="middle">inscrita</text>
    <path class="line-good" d="M210,125 C320,125 330,48 446,48" marker-end="url(#c2d14-head-good)"/>
    <rect class="box" x="450" y="96" width="260" height="56" rx="8"/>
    <text x="580.0" y="120.0" text-anchor="middle" font-weight="600">Bruno</text>
    <text class="t-muted" x="580.0" y="138.0" text-anchor="middle">cancelou (-=)</text>
    <path class="line-bad" d="M210,125 C320,125 330,124 400,124"/>
    <text class="t-bad" x="412" y="129">✕</text>
    <rect class="box-good" x="450" y="172" width="260" height="56" rx="8"/>
    <text x="580.0" y="196.0" text-anchor="middle" font-weight="600">PainelDoEstoque</text>
    <text class="t-muted" x="580.0" y="214.0" text-anchor="middle">inscrito</text>
    <path class="line-good" d="M210,125 C320,125 330,200 446,200" marker-end="url(#c2d14-head-good)"/>
    <text class="t-mono t-muted" x="10" y="60">Invoke(): "chegou!"</text>
    <text class="t-muted" x="10" y="258">A loja não conhece os inscritos: só "grita" o aviso. Entrar e sair da lista não muda a Loja.</text>
  </svg>
  <figcaption>Observer: o "sininho" de notificações — quem se inscreve recebe o aviso.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var loja = new Loja();

var ana = new Cliente("Ana");
var bruno = new Cliente("Bruno");
var estoque = new PainelDoEstoque();

// Inscrição: "me avise quando chegar"
loja.ProdutoChegou += ana.QuandoProdutoChegar;
loja.ProdutoChegou += bruno.QuandoProdutoChegar;
loja.ProdutoChegou += estoque.Registrar;

loja.ReceberProduto("PlayStation 5");

// Bruno cancelou a inscrição
loja.ProdutoChegou -= bruno.QuandoProdutoChegar;
Console.WriteLine();
loja.ReceberProduto("Nintendo Switch 2");

// O PUBLICADOR: não sabe quem está inscrito, nem o que cada um faz com o aviso
public class Loja
{
    public event Action&lt;string&gt;? ProdutoChegou;

    public void ReceberProduto(string produto)
    {
        Console.WriteLine($"Loja: chegou {produto}!");
        ProdutoChegou?.Invoke(produto); // avisa TODOS os inscritos
    }
}

// OBSERVADORES: cada um reage do seu jeito
public class Cliente(string nome)
{
    public void QuandoProdutoChegar(string produto) =&gt;
        Console.WriteLine($"  {nome} recebeu o aviso: {produto} disponível");
}

public class PainelDoEstoque
{
    public void Registrar(string produto) =&gt;
        Console.WriteLine($"  Estoque atualizado: +1 {produto}");
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Loja: chegou PlayStation 5!
  Ana recebeu o aviso: PlayStation 5 disponível
  Bruno recebeu o aviso: PlayStation 5 disponível
  Estoque atualizado: +1 PlayStation 5

Loja: chegou Nintendo Switch 2!
  Ana recebeu o aviso: Nintendo Switch 2 disponível
  Estoque atualizado: +1 Nintendo Switch 2</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>public event Action&lt;string&gt;? ProdutoChegou</code> declara o "canal". <code>Action&lt;string&gt;</code> significa "métodos que recebem uma string e não retornam nada".</li>
  <li><code>loja.ProdutoChegou += ana.QuandoProdutoChegar</code> inscreve um método; <code>-=</code> cancela a inscrição.</li>
  <li><code>ProdutoChegou?.Invoke(produto)</code> chama todos os inscritos, na ordem da inscrição. O <code>?.</code> evita erro quando não há ninguém inscrito.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Armadilha: inscrição esquecida = vazamento de memória</div>
  <p>Enquanto um objeto está inscrito num evento, o publicador guarda uma referência a ele, e o Garbage Collector não pode liberá-lo. Se um publicador de vida longa (um <em>singleton</em>) acumular inscrições que nunca recebem <code>-=</code>, a memória cresce até o processo cair. Esse é um dos vazamentos mais comuns em .NET (veja o Capítulo 8).</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Observer: quem publica não conhece quem escuta, e em C# isso é <code>event</code>.</p>
</div>

<h3>2.3.7 Command — ações como objetos</h3>

<p class="step-label">📘 O conceito</p>
<p>O <strong>Command</strong> transforma uma ação ("escrever este texto") num <strong>objeto</strong>. Como vira objeto, a ação pode ser guardada numa lista, executada depois, enviada para uma fila, registrada em log e — o mais famoso — <strong>desfeita</strong>.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A comanda do restaurante e o Ctrl+Z</div>
  <p>O garçom não grita o pedido para a cozinha: ele escreve uma comanda. A comanda pode esperar na fila, ser repassada a outro cozinheiro ou ser cancelada. No editor de texto, cada coisa que você digita vira uma "comanda" guardada numa pilha: o Ctrl+Z pega a última e a desfaz.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="Três comandos Escrever empilhados: Olá, vírgula mundo e três exclamações. O Ctrl+Z tira o comando do topo e chama Desfazer, e o texto volta de Olá, mundo!!! para Olá, mundo">
    <defs><marker id="c2d15-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d15-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d15-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="20" y="22">PILHA DO HISTÓRICO</text>
    <rect class="box-warn" x="20" y="36" width="240" height="44" rx="8"/>
    <text class="t-mono" x="140.0" y="63.0" text-anchor="middle">Escrever("!!!")</text>
    <rect class="box" x="20" y="88" width="240" height="44" rx="8"/>
    <text class="t-mono" x="140.0" y="115.0" text-anchor="middle">Escrever(", mundo")</text>
    <rect class="box" x="20" y="140" width="240" height="44" rx="8"/>
    <text class="t-mono" x="140.0" y="167.0" text-anchor="middle">Escrever("Olá")</text>
    <text class="t-muted" x="20" y="212">↑ último a entrar, primeiro a sair</text>
    <path class="line-bad" d="M260,58 L340,58" marker-end="url(#c2d15-head-bad)"/>
    <text class="t-bad" x="300" y="48" text-anchor="middle">Ctrl+Z</text>
    <text class="t-mono" x="350" y="63">.Desfazer() no comando do topo</text>
    <text class="t-title" x="360" y="118">TEXTO NO EDITOR</text>
    <rect class="box" x="360" y="132" width="160" height="40" rx="8"/>
    <text class="t-mono" x="440.0" y="157.0" text-anchor="middle">Olá, mundo!!!</text>
    <path class="line" d="M520,152 L560,152" marker-end="url(#c2d15-head)"/>
    <rect class="box-good" x="564" y="132" width="146" height="40" rx="8"/>
    <text class="t-mono" x="637.0" y="157.0" text-anchor="middle">Olá, mundo</text>
    <text class="t-muted" x="10" y="240">Como cada ação é um objeto, dá para guardar, desfazer, refazer, enfileirar e registrar em log.</text>
  </svg>
  <figcaption>Command: transformar uma ação em objeto — a base de todo "desfazer".</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var editor = new Editor();
var historico = new Historico();

historico.Executar(new Escrever(editor, "Olá"));
historico.Executar(new Escrever(editor, ", mundo"));
historico.Executar(new Escrever(editor, "!!!"));
Console.WriteLine($"Texto:  [{editor.Texto}]");

historico.Desfazer();
Console.WriteLine($"Ctrl+Z: [{editor.Texto}]");

historico.Desfazer();
Console.WriteLine($"Ctrl+Z: [{editor.Texto}]");

public class Editor
{
    public string Texto { get; set; } = "";
}

// Cada ação vira um OBJETO que sabe se executar e se desfazer
public interface IComando
{
    void Executar();
    void Desfazer();
}

public class Escrever(Editor editor, string trecho) : IComando
{
    public void Executar() =&gt; editor.Texto += trecho;
    public void Desfazer() =&gt; editor.Texto = editor.Texto[..^trecho.Length]; // remove o que foi escrito
}

// Guarda os comandos numa PILHA: o último a entrar é o primeiro a ser desfeito
public class Historico
{
    private readonly Stack&lt;IComando&gt; _pilha = new();

    public void Executar(IComando comando)
    {
        comando.Executar();
        _pilha.Push(comando);
    }

    public void Desfazer()
    {
        if (_pilha.TryPop(out var comando))
            comando.Desfazer();
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Texto:  [Olá, mundo!!!]
Ctrl+Z: [Olá, mundo]
Ctrl+Z: [Olá]</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>IComando</code> define as duas operações que toda ação precisa ter: <code>Executar</code> e <code>Desfazer</code>.</li>
  <li><code>Escrever</code> guarda o trecho que escreveu, para saber exatamente o que remover: <code>editor.Texto[..^trecho.Length]</code> significa "o texto sem os últimos N caracteres".</li>
  <li><code>Stack&lt;IComando&gt;</code> é uma pilha: <code>Push</code> empilha e <code>TryPop</code> tira o último que entrou (se houver).</li>
</ul>

<p><strong>No .NET real:</strong> os <em>commands</em> do MediatR (Capítulo 6.2), mensagens em filas (Capítulo 7) e jobs em segundo plano são variações da mesma ideia: uma intenção empacotada como objeto.</p>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Command: transformar a ação em objeto para poder enfileirar, registrar e desfazer.</p>
</div>

<h2>2.4 Domain-Driven Design</h2>

<p><strong>Domain-Driven Design (DDD)</strong>, proposto por Eric Evans em 2003, é uma abordagem para sistemas com regras de negócio complexas. A ideia central: o código deve <strong>falar a língua do negócio</strong>. Se o time financeiro diz "conciliar uma fatura", deve existir um método <code>Fatura.Conciliar()</code> — e não <code>UpdateStatus(3)</code>. Essa linguagem comum entre desenvolvedores e especialistas se chama <strong>Linguagem Ubíqua</strong>.</p>

<p>DDD traz blocos de construção (Entidade, Value Object, Aggregate, Repository) e uma forma de dividir sistemas grandes (Bounded Contexts). Vamos por partes.</p>

<h3>2.4.1 Entidades e Value Objects</h3>

<p class="step-label">📘 O conceito</p>
<ul>
  <li><strong>Entidade</strong>: tem <em>identidade</em> que atravessa o tempo. Mesmo que todos os dados mudem, continua sendo "a mesma". Duas entidades são iguais se têm o mesmo <strong>Id</strong>.</li>
  <li><strong>Value Object</strong>: é definido só pelos seus <em>valores</em>, não tem identidade e é imutável. Dois Value Objects com os mesmos valores são intercambiáveis. Além disso, <strong>se valida sozinho</strong>: não existe <code>Email</code> sem "@" nem <code>Dinheiro</code> negativo.</li>
</ul>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Você e uma nota de dinheiro</div>
  <p>Você é uma <strong>entidade</strong>: pode mudar de nome, de endereço e de cabelo, e continua sendo você (seu CPF não muda). Uma nota de R$ 10 é um <strong>value object</strong>: se alguém trocar a sua nota por outra de R$ 10, você nem se importa — o que interessa é o valor, não "qual" nota.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 240" role="img" aria-label="Entidade: a Cliente de Id 42 muda de nome de Ana Souza para Ana Lima e continua sendo a mesma pessoa. Value Object: duas notas de 10 reais são iguais porque têm o mesmo valor">
    <defs><marker id="c2d16-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d16-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d16-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="panel" x="10" y="10" width="340" height="190" rx="12"/>
    <text class="t-title" x="30" y="36">ENTIDADE — importa QUEM é</text>
    <rect class="box-accent" x="30" y="54" width="140" height="60" rx="8"/>
    <text x="100.0" y="80.0" text-anchor="middle" font-weight="600">Cliente #42</text>
    <text class="t-muted" x="100.0" y="98.0" text-anchor="middle">Ana Souza</text>
    <rect class="box-accent" x="200" y="54" width="130" height="60" rx="8"/>
    <text x="265.0" y="80.0" text-anchor="middle" font-weight="600">Cliente #42</text>
    <text class="t-muted" x="265.0" y="98.0" text-anchor="middle">Ana Lima</text>
    <path class="line" d="M170,84 L196,84" marker-end="url(#c2d16-head)"/>
    <text x="30" y="146">Mudou o nome, é a mesma pessoa:</text>
    <text class="t-good" x="30" y="170">igualdade pelo Id</text>
    <rect class="panel" x="370" y="10" width="340" height="190" rx="12"/>
    <text class="t-title" x="390" y="36">VALUE OBJECT — importa O QUE vale</text>
    <rect class="box-good" x="390" y="54" width="120" height="60" rx="8"/>
    <text x="450.0" y="80.0" text-anchor="middle" font-weight="600">R$ 10</text>
    <text class="t-muted" x="450.0" y="98.0" text-anchor="middle">nota A</text>
    <text x="540" y="90" text-anchor="middle" font-weight="600">=</text>
    <rect class="box-good" x="570" y="54" width="120" height="60" rx="8"/>
    <text x="630.0" y="80.0" text-anchor="middle" font-weight="600">R$ 10</text>
    <text class="t-muted" x="630.0" y="98.0" text-anchor="middle">nota B</text>
    <text x="390" y="146">Tanto faz qual nota você recebe:</text>
    <text class="t-good" x="390" y="170">igualdade pelos valores, imutável</text>
    <text class="t-muted" x="10" y="228">Exemplos de Value Object: Dinheiro, Email, CPF, Endereço, Período. De Entidade: Cliente, Pedido, Produto.</text>
  </svg>
  <figcaption>Entidade tem identidade e vive no tempo; Value Object é só um valor.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// VALUE OBJECTS: iguais quando os VALORES são iguais
var nota1 = new Dinheiro(10m, "BRL");
var nota2 = new Dinheiro(10m, "BRL");
Console.WriteLine($"Duas notas de 10 reais são iguais? {nota1 == nota2}");
Console.WriteLine($"Soma: {nota1 + nota2}");

try { _ = new Dinheiro(-5m, "BRL"); }
catch (ArgumentException ex) { Console.WriteLine($"Erro: {ex.Message}"); }

try { _ = nota1 + new Dinheiro(10m, "USD"); }
catch (InvalidOperationException ex) { Console.WriteLine($"Erro: {ex.Message}"); }

// ENTIDADES: iguais quando a IDENTIDADE (Id) é a mesma, mesmo que os dados mudem
var cadastro = new Cliente(42, "Ana Souza");
var mesmaPessoaNoBanco = new Cliente(42, "Ana Souza");
cadastro.MudarNome("Ana Lima"); // casou e mudou o sobrenome
Console.WriteLine($"'{cadastro.Nome}' e '{mesmaPessoaNoBanco.Nome}' são a mesma cliente? {cadastro.Equals(mesmaPessoaNoBanco)}");

// record = igualdade por valor de graça; validação no construtor = nunca existe Dinheiro inválido
public record Dinheiro
{
    public decimal Valor { get; }
    public string Moeda { get; }

    public Dinheiro(decimal valor, string moeda)
    {
        if (valor &lt; 0) throw new ArgumentException("valor não pode ser negativo.");
        Valor = valor;
        Moeda = moeda;
    }

    public static Dinheiro operator +(Dinheiro a, Dinheiro b) =&gt;
        a.Moeda == b.Moeda
            ? new Dinheiro(a.Valor + b.Valor, a.Moeda)
            : throw new InvalidOperationException($"não dá para somar {a.Moeda} com {b.Moeda}.");

    public override string ToString() =&gt; $"{Moeda} {Valor:N2}";
}

public class Cliente(int id, string nome)
{
    public int Id { get; } = id;
    public string Nome { get; private set; } = nome;

    public void MudarNome(string novoNome) =&gt; Nome = novoNome;

    // Identidade: dois objetos Cliente com o mesmo Id representam a MESMA pessoa
    public override bool Equals(object? obj) =&gt; obj is Cliente outro &amp;&amp; outro.Id == Id;
    public override int GetHashCode() =&gt; Id.GetHashCode();
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Duas notas de 10 reais são iguais? True
Soma: BRL 20,00
Erro: valor não pode ser negativo.
Erro: não dá para somar BRL com USD.
'Ana Lima' e 'Ana Souza' são a mesma cliente? True</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>record Dinheiro</code>: <em>records</em> já comparam por valor, então <code>nota1 == nota2</code> é <code>True</code> mesmo sendo dois objetos diferentes na memória.</li>
  <li>O construtor recusa valor negativo: é impossível existir um <code>Dinheiro</code> inválido no sistema.</li>
  <li><code>operator +</code> ensina o C# a somar dinheiro e impede misturar moedas.</li>
  <li><code>Cliente</code> é uma entidade: <code>Equals</code> compara só o <code>Id</code>. Mesmo com o nome alterado, continua sendo a mesma cliente.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Entidade é "quem" (compara pelo Id), e Value Object é "quanto" ou "qual" (compara pelos valores, é imutável e se valida sozinho).</p>
</div>

<h3>2.4.2 Aggregates e Domain Events</h3>

<p class="step-label">📘 O conceito</p>
<p>Um <strong>Aggregate</strong> é um grupo de objetos que precisam mudar juntos para manter as regras de negócio consistentes — por exemplo, um pedido e seus itens. Um dos objetos é a <strong>raiz</strong> (<em>Aggregate Root</em>), e ela é a <strong>única porta de entrada</strong>: ninguém de fora altera um item diretamente, só pedindo à raiz. Assim, as regras ("não pode editar pedido confirmado") são checadas sempre, em um só lugar.</p><p>Quando algo importante acontece, o aggregate registra um <strong>Domain Event</strong> ("PedidoConfirmado"), que outras partes do sistema podem usar para reagir — enviar e-mail, baixar estoque — sem que o pedido precise conhecê-las.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A comanda e o garçom</div>
  <p>No restaurante, você não entra na cozinha para trocar o seu prato. Você pede ao garçom (a raiz), que conhece as regras: "depois que o prato foi para o fogo, não dá mais para trocar". E quando o pedido fecha, o garçom avisa o caixa (o evento) — ele não precisa saber como o caixa trabalha.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 270" role="img" aria-label="O aggregate Pedido é uma fronteira; o código de fora só entra pela raiz com AdicionarItem ou Confirmar; mexer direto em um item é bloqueado; ao confirmar, a raiz publica o evento PedidoConfirmado">
    <defs><marker id="c2d17-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d17-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d17-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box" x="10" y="60" width="130" height="56" rx="8"/>
    <text x="75.0" y="93.0" text-anchor="middle" font-weight="600">Código de fora</text>
    <rect class="panel" x="240" y="14" width="300" height="220" rx="16" stroke-dasharray="8 5"/>
    <text class="t-title" x="260" y="38">AGGREGATE Pedido</text>
    <rect class="box-accent" x="260" y="52" width="260" height="70" rx="8"/>
    <text x="390.0" y="74.0" text-anchor="middle" font-weight="600">Pedido (raiz)</text>
    <text class="t-muted" x="390.0" y="92.0" text-anchor="middle">status ≠ Rascunho → não edita</text>
    <text class="t-muted" x="390.0" y="110.0" text-anchor="middle">quantidade &gt; 0</text>
    <rect class="box" x="260" y="150" width="120" height="50" rx="8"/>
    <text x="320.0" y="171.0" text-anchor="middle" font-weight="600">Item</text>
    <text class="t-muted" x="320.0" y="189.0" text-anchor="middle">Livro</text>
    <rect class="box" x="400" y="150" width="120" height="50" rx="8"/>
    <text x="460.0" y="171.0" text-anchor="middle" font-weight="600">Item</text>
    <text class="t-muted" x="460.0" y="189.0" text-anchor="middle">Caneca</text>
    <path class="line" d="M330,122 L322,150"/>
    <path class="line" d="M450,122 L458,150"/>
    <path class="line-good" d="M140,88 L256,88" marker-end="url(#c2d17-head-good)"/>
    <text class="t-good" x="198" y="78" text-anchor="middle">AdicionarItem()</text>
    <path class="line-bad" d="M75,116 L75,176 L254,176" marker-end="url(#c2d17-head-bad)"/>
    <text class="t-bad" x="20" y="214">✕ mexer no item direto</text>
    <rect class="box-warn" x="566" y="60" width="144" height="56" rx="8"/>
    <text x="638.0" y="84.0" text-anchor="middle" font-weight="600">Evento</text>
    <text class="t-mono" x="638.0" y="102.0" text-anchor="middle">PedidoConfirmado</text>
    <path class="line" d="M520,88 L562,88" marker-end="url(#c2d17-head)"/>
    <text class="t-muted" x="10" y="258">Uma única porta de entrada = as regras são checadas sempre, em um só lugar.</text>
  </svg>
  <figcaption>Aggregate: um grupo de objetos que muda junto, protegido por uma raiz.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

var pedido = new Pedido();
pedido.AdicionarItem("Livro de C#", 120m, quantidade: 1);
pedido.AdicionarItem("Caneca .NET", 45m, quantidade: 2);
Console.WriteLine($"Itens: {pedido.Itens.Count} | Total: {pedido.Total:C}");

pedido.Confirmar();
Console.WriteLine($"Status: {pedido.Status}");

// Tentativas de quebrar as regras: o aggregate barra todas
TentarExecutar("Adicionar item depois de confirmar", () =&gt; pedido.AdicionarItem("Adesivo", 5m, 1));
TentarExecutar("Adicionar quantidade zero", () =&gt; new Pedido().AdicionarItem("Caneta", 3m, 0));
TentarExecutar("Confirmar pedido vazio", () =&gt; new Pedido().Confirmar());
// pedido.Itens.Add(...)  // ❌ não compila: por fora, a lista é somente leitura

foreach (var evento in pedido.Eventos)
    Console.WriteLine($"Evento publicado: {evento}");

static void TentarExecutar(string descricao, Action acao)
{
    try
    {
        acao();
        Console.WriteLine($"{descricao}: permitido");
    }
    catch (RegraDeNegocioException ex)
    {
        Console.WriteLine($"{descricao}: BLOQUEADO ({ex.Message})");
    }
}

public enum StatusDoPedido { Rascunho, Confirmado }

public record ItemDoPedido(string Produto, decimal PrecoUnitario, int Quantidade)
{
    public decimal Subtotal =&gt; PrecoUnitario * Quantidade;
}

public record PedidoConfirmado(int QuantidadeDeItens, decimal Total); // um DOMAIN EVENT

public class RegraDeNegocioException(string mensagem) : Exception(mensagem);

// AGGREGATE ROOT: a única porta de entrada para mexer no pedido e nos seus itens
public class Pedido
{
    private readonly List&lt;ItemDoPedido&gt; _itens = [];
    private readonly List&lt;object&gt; _eventos = [];

    public StatusDoPedido Status { get; private set; } = StatusDoPedido.Rascunho;
    public IReadOnlyList&lt;ItemDoPedido&gt; Itens =&gt; _itens.AsReadOnly();
    public IReadOnlyList&lt;object&gt; Eventos =&gt; _eventos.AsReadOnly();
    public decimal Total =&gt; _itens.Sum(i =&gt; i.Subtotal);

    public void AdicionarItem(string produto, decimal preco, int quantidade)
    {
        if (Status != StatusDoPedido.Rascunho)
            throw new RegraDeNegocioException("o pedido já foi confirmado");
        if (quantidade &lt;= 0)
            throw new RegraDeNegocioException("a quantidade deve ser maior que zero");

        _itens.Add(new ItemDoPedido(produto, preco, quantidade));
    }

    public void Confirmar()
    {
        if (_itens.Count == 0)
            throw new RegraDeNegocioException("o pedido não tem itens");

        Status = StatusDoPedido.Confirmado;
        _eventos.Add(new PedidoConfirmado(_itens.Count, Total)); // "algo importante aconteceu"
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Itens: 2 | Total: R$ 210,00
Status: Confirmado
Adicionar item depois de confirmar: BLOQUEADO (o pedido já foi confirmado)
Adicionar quantidade zero: BLOQUEADO (a quantidade deve ser maior que zero)
Confirmar pedido vazio: BLOQUEADO (o pedido não tem itens)
Evento publicado: PedidoConfirmado { QuantidadeDeItens = 2, Total = 210 }</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>_itens</code> é privado. Por fora, <code>Itens</code> é exposto como <code>IReadOnlyList</code> via <code>AsReadOnly()</code>: dá para ler, mas não para adicionar. Tentar <code>pedido.Itens.Add(...)</code> não compila (erro <strong>CS1061</strong>).</li>
  <li>Toda alteração passa por métodos da raiz (<code>AdicionarItem</code>, <code>Confirmar</code>), que checam as regras e lançam <code>RegraDeNegocioException</code>.</li>
  <li><code>Total</code> é calculado a partir dos itens, então nunca fica desatualizado.</li>
  <li><code>Confirmar</code> registra o evento <code>PedidoConfirmado</code>. Numa aplicação real, ele seria publicado depois de salvar no banco (veja o Outbox Pattern, no Capítulo 6.4).</li>
  <li><code>TentarExecutar</code> é uma função local que recebe uma ação (<code>Action</code>) e mostra se ela foi permitida ou bloqueada.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Aggregates pequenos</div>
  <p>Um aggregate é carregado e salvo inteiro, numa única transação. Se você colocar "Cliente com todos os pedidos com todos os itens", cada alteração carrega milhares de objetos e gera conflitos de concorrência. Regra prática: um aggregate por transação, e referências a outros aggregates <em>pelo Id</em>, não pelo objeto.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Aggregate: um grupo que muda junto, com uma única porta de entrada que garante as regras.</p>
</div>

<h3>2.4.3 Repositories e Specifications</h3>

<p class="step-label">📘 O conceito</p>
<p>Um <strong>Repository</strong> dá ao domínio a ilusão de uma coleção de objetos em memória: "me dê os clientes que…", "guarde este pedido". Como e onde os dados estão guardados (SQL, MongoDB, API) é detalhe da infraestrutura, escondido atrás de uma interface (é o DIP de 2.2.5 aplicado).</p><p>Uma <strong>Specification</strong> é uma regra de seleção com nome próprio — "cliente elegível para cashback" — encapsulada num objeto. A mesma regra serve para filtrar no banco e para validar um objeto específico, sem duplicar a lógica.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O bibliotecário e a ficha de critérios</div>
  <p>Na biblioteca, você não vai às estantes: pede ao bibliotecário (o repositório) "livros de ficção científica publicados depois de 2020". Ele sabe onde e como procurar. O pedido pode ser escrito numa ficha (a especificação) e reaproveitado: para buscar no acervo ou para conferir se um livro que acabou de chegar entra nessa categoria.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 240" role="img" aria-label="A regra ClienteElegivelParaCashback — ativo, plano Premium e gasto acima de 5 mil — é aplicada a quatro clientes: Ana e Diego passam, Bruno falha pelo plano e Carla por estar inativa">
    <defs><marker id="c2d18-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d18-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d18-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="70" width="230" height="90" rx="8"/>
    <text x="125.0" y="93.0" text-anchor="middle" font-weight="600">ClienteElegivelParaCashback</text>
    <text class="t-mono t-muted" x="125.0" y="111.0" text-anchor="middle">Ativo</text>
    <text class="t-mono t-muted" x="125.0" y="129.0" text-anchor="middle">e Plano == Premium</text>
    <text class="t-mono t-muted" x="125.0" y="147.0" text-anchor="middle">e TotalGasto &gt; 5.000</text>
    <rect class="box-good" x="400" y="14" width="310" height="42" rx="8"/>
    <text x="414" y="40.0" font-weight="600">✓  Ana  —  ok</text>
    <path class="line-good" d="M240,115 C320,115 320,35 396,35"/>
    <rect class="box-bad" x="400" y="66" width="310" height="42" rx="8"/>
    <text x="414" y="92.0" font-weight="600">✕  Bruno  —  plano Básico</text>
    <path class="line-bad" d="M240,115 C320,115 320,87 396,87"/>
    <rect class="box-bad" x="400" y="118" width="310" height="42" rx="8"/>
    <text x="414" y="144.0" font-weight="600">✕  Carla  —  inativa</text>
    <path class="line-bad" d="M240,115 C320,115 320,139 396,139"/>
    <rect class="box-good" x="400" y="170" width="310" height="42" rx="8"/>
    <text x="414" y="196.0" font-weight="600">✓  Diego  —  ok</text>
    <path class="line-good" d="M240,115 C320,115 320,191 396,191"/>
    <text class="t-muted" x="10" y="228">A regra tem nome, fica num lugar só e é reaproveitada: no filtro do banco e na validação de um cliente.</text>
  </svg>
  <figcaption>Specification: uma regra de negócio que vira objeto.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

IRepositorioDeClientes repositorio = new RepositorioEmMemoria();
var regraDoCashback = new ClienteElegivelParaCashback();

// Uso 1: buscar no "banco" todos que atendem à regra
foreach (var cliente in repositorio.Buscar(regraDoCashback))
    Console.WriteLine($"Cashback liberado para {cliente.Nome} (gastou {cliente.TotalGasto:C})");

// Uso 2: a MESMA regra, reaproveitada para checar um cliente específico
var zeca = new Cliente("Zeca", Ativo: true, Plano: "Premium", TotalGasto: 300m);
Console.WriteLine($"Zeca é elegível? {(regraDoCashback.EhSatisfeitaPor(zeca) ? "sim" : "não")}");

public record Cliente(string Nome, bool Ativo, string Plano, decimal TotalGasto);

// SPECIFICATION: uma regra de negócio com NOME, isolada e fácil de testar
public interface IEspecificacao&lt;T&gt; { bool EhSatisfeitaPor(T item); }

public class ClienteElegivelParaCashback : IEspecificacao&lt;Cliente&gt;
{
    public bool EhSatisfeitaPor(Cliente c) =&gt;
        c.Ativo &amp;&amp; c.Plano == "Premium" &amp;&amp; c.TotalGasto &gt; 5_000m;
}

// REPOSITORY: o domínio pede "clientes"; não sabe se vêm de SQL, MongoDB ou memória
public interface IRepositorioDeClientes
{
    IEnumerable&lt;Cliente&gt; Buscar(IEspecificacao&lt;Cliente&gt; especificacao);
}

public class RepositorioEmMemoria : IRepositorioDeClientes
{
    private readonly List&lt;Cliente&gt; _clientes =
    [
        new("Ana",   Ativo: true,  Plano: "Premium", TotalGasto: 12_000m),
        new("Bruno", Ativo: true,  Plano: "Básico",  TotalGasto: 9_000m),
        new("Carla", Ativo: false, Plano: "Premium", TotalGasto: 20_000m),
        new("Diego", Ativo: true,  Plano: "Premium", TotalGasto: 6_500m),
    ];

    public IEnumerable&lt;Cliente&gt; Buscar(IEspecificacao&lt;Cliente&gt; especificacao) =&gt;
        _clientes.Where(especificacao.EhSatisfeitaPor);
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Cashback liberado para Ana (gastou R$ 12.000,00)
Cashback liberado para Diego (gastou R$ 6.500,00)
Zeca é elegível? não</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>IRepositorioDeClientes</code> é o que o domínio enxerga; <code>RepositorioEmMemoria</code> é um detalhe que poderia ser trocado por um repositório com Entity Framework.</li>
  <li><code>ClienteElegivelParaCashback</code> dá nome a uma regra que, de outro modo, estaria espalhada em vários <code>if</code>s.</li>
  <li><code>_clientes.Where(especificacao.EhSatisfeitaPor)</code> passa o método como filtro (um <em>method group</em>).</li>
  <li>Bruno gasta muito mas é do plano Básico; Carla é Premium mas está inativa; Zeca é Premium e ativo, mas gastou pouco.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Com Entity Framework, a especificação expõe uma Expression,
// para o filtro virar SQL (WHERE) em vez de rodar em memória:
public Expression&lt;Func&lt;Cliente, bool&gt;&gt; ComoExpressao() =&gt;
    c =&gt; c.Ativo &amp;&amp; c.Plano == "Premium" &amp;&amp; c.TotalGasto &gt; 5_000m;

var elegiveis = await db.Clientes.Where(regra.ComoExpressao()).ToListAsync();</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>O Repository esconde onde os dados moram, e a Specification dá nome a uma regra e a reaproveita.</p>
</div>

<h3>2.4.4 Bounded Contexts e Anti-Corruption Layer</h3>

<p class="step-label">📘 O conceito</p>
<p>Em sistemas grandes, a mesma palavra significa coisas diferentes para áreas diferentes. Tentar criar <em>um</em> modelo de "Cliente" que sirva para todos gera uma classe gigante e confusa. Um <strong>Bounded Context</strong> (contexto delimitado) é uma fronteira dentro da qual um modelo tem um significado preciso: cada área tem o seu próprio "Cliente".</p><p>Quando o seu sistema precisa conversar com outro sistema (um CRM antigo, um ERP, uma API de parceiro), uma <strong>Anti-Corruption Layer</strong> (camada anticorrupção) traduz o modelo deles para o seu, na fronteira. Assim, os nomes estranhos e as regras alheias não "contaminam" o seu domínio.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A palavra "cliente" dentro da empresa</div>
  <p>Para <strong>Vendas</strong>, cliente é quem compra (histórico, cupons). Para a <strong>Logística</strong>, é um destinatário (endereço, horário de entrega). Para o <strong>Financeiro</strong>, é um devedor (limite de crédito, faturas). Todos estão certos — em seus contextos. E quando chega um documento de um fornecedor estrangeiro, alguém o <em>traduz</em> antes de ele circular pela empresa: essa é a camada anticorrupção.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 290" role="img" aria-label="A palavra Cliente tem significados diferentes em Vendas, Logística e Financeiro. Abaixo, o CRM legado com campos FIRST_NM e TIER_CD passa pelo TradutorDoCrm, a camada anticorrupção, e vira um Cliente do nosso domínio">
    <defs><marker id="c2d19-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d19-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c2d19-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="panel" x="10" y="10" width="224" height="100" rx="12"/>
    <text class="t-title" x="26" y="34">VENDAS</text>
    <text x="26" y="64" font-weight="600">Cliente = comprador</text>
    <text class="t-muted" x="26" y="88">histórico, cupons</text>
    <rect class="panel" x="248" y="10" width="224" height="100" rx="12"/>
    <text class="t-title" x="264" y="34">LOGÍSTICA</text>
    <text x="264" y="64" font-weight="600">Cliente = destinatário</text>
    <text class="t-muted" x="264" y="88">endereço, horário</text>
    <rect class="panel" x="486" y="10" width="224" height="100" rx="12"/>
    <text class="t-title" x="502" y="34">FINANCEIRO</text>
    <text x="502" y="64" font-weight="600">Cliente = devedor</text>
    <text class="t-muted" x="502" y="88">limite, faturas</text>
    <rect class="box-warn" x="10" y="160" width="200" height="80" rx="8"/>
    <text x="110.0" y="187.0" text-anchor="middle" font-weight="600">CRM legado</text>
    <text class="t-mono t-muted" x="110.0" y="205.0" text-anchor="middle">FIRST_NM = "ANA"</text>
    <text class="t-mono t-muted" x="110.0" y="223.0" text-anchor="middle">TIER_CD = "G"</text>
    <rect class="box-accent" x="260" y="165" width="200" height="70" rx="8"/>
    <text x="360.0" y="196.0" text-anchor="middle" font-weight="600">TradutorDoCrm</text>
    <text class="t-muted" x="360.0" y="214.0" text-anchor="middle">camada anticorrupção</text>
    <rect class="box-good" x="510" y="160" width="200" height="80" rx="8"/>
    <text x="610.0" y="187.0" text-anchor="middle" font-weight="600">Cliente (nosso)</text>
    <text class="t-mono t-muted" x="610.0" y="205.0" text-anchor="middle">NomeCompleto = "Ana"</text>
    <text class="t-mono t-muted" x="610.0" y="223.0" text-anchor="middle">Plano = Premium</text>
    <path class="line" d="M210,200 L256,200" marker-end="url(#c2d19-head)"/>
    <path class="line-good" d="M460,200 L506,200" marker-end="url(#c2d19-head-good)"/>
    <text class="t-muted" x="10" y="278">Cada contexto tem o seu modelo. O que vem de fora é traduzido na fronteira e não "contamina" o domínio.</text>
  </svg>
  <figcaption>Bounded Contexts: a mesma palavra, significados diferentes. A camada anticorrupção traduz na fronteira.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Nosso sistema só conversa com o CRM antigo ATRAVÉS do tradutor
var tradutor = new TradutorDoCrm(new CrmLegado());

foreach (var codigo in new[] { "C-001", "C-002" })
{
    Cliente cliente = tradutor.BuscarCliente(codigo);
    Console.WriteLine(cliente);
}

// ---------- Mundo externo: nomes estranhos e códigos "mágicos" ----------
public record ContatoCrm(string FIRST_NM, string LAST_NM, string EMAIL_ADDR, string TIER_CD);

public class CrmLegado
{
    public ContatoCrm ObterContato(string codigo) =&gt; codigo switch
    {
        "C-001" =&gt; new ContatoCrm("ANA", "SOUZA", "ANA@EMAIL.COM", "G"),
        _       =&gt; new ContatoCrm("bruno", "lima", "bruno@email.com", "S"),
    };
}

// ---------- Nosso domínio: a linguagem do NOSSO negócio ----------
public enum Plano { Padrao, Premium }
public record Cliente(string NomeCompleto, string Email, Plano Plano);

// ANTI-CORRUPTION LAYER: a única classe que conhece os dois mundos
public class TradutorDoCrm(CrmLegado crm)
{
    public Cliente BuscarCliente(string codigo)
    {
        var contato = crm.ObterContato(codigo);
        return new Cliente(
            NomeCompleto: $"{Capitalizar(contato.FIRST_NM)} {Capitalizar(contato.LAST_NM)}",
            Email: contato.EMAIL_ADDR.ToLowerInvariant(),
            Plano: contato.TIER_CD == "G" ? Plano.Premium : Plano.Padrao); // "G" = Gold no CRM
    }

    private static string Capitalizar(string texto) =&gt;
        texto.Length == 0 ? texto : char.ToUpper(texto[0]) + texto[1..].ToLower();
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Cliente { NomeCompleto = Ana Souza, Email = ana@email.com, Plano = Premium }
Cliente { NomeCompleto = Bruno Lima, Email = bruno@email.com, Plano = Padrao }</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>ContatoCrm</code> é o modelo <em>deles</em>: nomes em maiúsculas, códigos como <code>"G"</code> para Gold.</li>
  <li><code>Cliente</code> é o <em>nosso</em> modelo, com nomes do nosso negócio e um <code>enum Plano</code> em vez de códigos mágicos.</li>
  <li><code>TradutorDoCrm</code> é a única classe que conhece os dois. Se o CRM mudar, só ela muda.</li>
  <li><code>record</code> gera um <code>ToString()</code> automático que mostra todas as propriedades, útil para depuração.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Bounded Contexts: cada área com o seu modelo. A camada anticorrupção traduz o que vem de fora na fronteira.</p>
</div>

<h2>2.5 Mapa Rápido: qual ferramenta para qual problema?</h2>

<table>
  <thead><tr><th>Se você sente que…</th><th>Considere</th><th>Seção</th></tr></thead>
  <tbody>
    <tr><td>Uma classe muda por motivos demais</td><td>SRP: dividir responsabilidades</td><td>2.2.1</td></tr>
    <tr><td>Um <code>switch</code> cresce a cada requisito novo</td><td>Strategy (OCP)</td><td>2.2.2</td></tr>
    <tr><td>Um <code>override</code> lança <code>NotImplementedException</code></td><td>Rever a herança (LSP / ISP)</td><td>2.2.3–2.2.4</td></tr>
    <tr><td>Não dá para testar sem banco ou rede</td><td>Inversão de dependência</td><td>2.2.5</td></tr>
    <tr><td><code>new ClasseConcreta()</code> espalhado pelo código</td><td>Factory</td><td>2.3.1</td></tr>
    <tr><td>Construtor com parâmetros demais</td><td>Builder</td><td>2.3.2</td></tr>
    <tr><td>Adicionar log/cache sem mexer no serviço</td><td>Decorator</td><td>2.3.3</td></tr>
    <tr><td>Uma biblioteca externa não "encaixa"</td><td>Adapter / Anti-Corruption Layer</td><td>2.3.4 / 2.4.4</td></tr>
    <tr><td>Uma sequência de verificações ou etapas</td><td>Chain of Responsibility</td><td>2.3.5</td></tr>
    <tr><td>Várias partes precisam reagir a um acontecimento</td><td>Observer / Domain Events</td><td>2.3.6 / 2.4.2</td></tr>
    <tr><td>Precisa desfazer, enfileirar ou registrar ações</td><td>Command</td><td>2.3.7</td></tr>
    <tr><td>Regras de negócio violadas por alterações "por fora"</td><td>Aggregate + encapsulamento</td><td>2.1.1 / 2.4.2</td></tr>
  </tbody>
</table>

<div class="challenge-box">
  <div class="challenge-box-header">
    <span class="challenge-box-icon">🎯</span>
    <span class="challenge-box-title">Desafio Prático — Capítulo 2</span>
  </div>
  <p>Modele uma <strong>biblioteca pública</strong> num único <code>Program.cs</code> executável, como os exemplos do capítulo:</p>
  <ol>
    <li><strong>Value Objects</strong>: <code>Isbn</code> (valida 13 dígitos) e <code>Periodo</code> (início antes do fim).</li>
    <li><strong>Aggregate</strong> <code>Livro</code> com as regras: não pode ser emprestado duas vezes, e a devolução registra o evento <code>LivroDevolvido</code>.</li>
    <li><strong>Specification</strong> <code>MembroPodeEmprestar</code>: ativo, sem atrasos e com menos de 3 empréstimos.</li>
    <li><strong>Strategy</strong> para a multa por atraso: <code>MultaPadrao</code> (R$ 1/dia) e <code>MultaEstudante</code> (metade).</li>
    <li><strong>Observer</strong>: membros na fila de reserva recebem um aviso quando o livro é devolvido.</li>
  </ol>
  <p>Critério de sucesso: tentar violar cada regra deve imprimir "BLOQUEADO", como no exemplo de 2.4.2. Bônus: escreva testes com xUnit usando um repositório em memória (DIP).</p>
</div>
`
},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 3 — PROGRAMAÇÃO ASSÍNCRONA
══════════════════════════════════════════════════════════ */
{
  id: 3, slug: 'async-concorrencia', icon: '⚙️', color: '#06b6d4',
  title: 'Programação Assíncrona e Concorrência',
  subtitle: 'async/await, deadlocks, Channels, primitivas de sincronização e Polly',
  desc: 'Como o async funciona por dentro, um deadlock reproduzido na tela, condições de corrida, Channels, cancelamento e resiliência com Polly — com programas para rodar.',
  tags: ['async/await','Channels','Polly','Threading','Exemplos executáveis'],
  readTime: 45,
  intro: `<code>async/await</code> parece simples. O que o compilador gera por baixo — uma <em>state machine</em>
    — não é. Entender deadlocks, SynchronizationContext, condições de corrida e resiliência é o que
    diferencia código que funciona em desenvolvimento de código que funciona em produção sob alta carga.
    Neste capítulo você vai <em>ver</em> cada um desses problemas acontecer — e a correção funcionando.`,
  content: `
<div class="info-box info">
  <div class="info-box-label">🧭 Como estudar este capítulo</div>
  <p>Concorrência é o assunto em que "ver acontecer" mais ajuda. Por isso, quase todo tópico tem um programa que <strong>mostra o problema e a solução na tela</strong> — inclusive um deadlock de verdade. Programas com tempos ou threads trazem a marca "variam a cada execução": os números mudam um pouco, e a conclusão não muda.</p>
</div>

<h2>3.1 async/await em Profundidade</h2>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O Garçom que Não Fica Parado</div>
  <p><strong>Garçom síncrono:</strong> anota o pedido, leva à cozinha e fica em pé ao lado do fogão por 15 minutos até o prato ficar pronto. Enquanto isso, as outras mesas esperam. Para atender mais gente, o restaurante precisa contratar mais garçons (mais threads) — caro e limitado.</p>
  <p><strong>Garçom assíncrono:</strong> entrega o pedido na cozinha (<code>await</code>) e vai atender outras mesas. Quando a campainha toca, <em>qualquer</em> garçom livre leva o prato (a continuação pode rodar em outra thread).</p>
  <p><strong>A lição técnica:</strong> <code>async</code> não deixa uma operação mais rápida. Ele aumenta <em>quantas requisições o mesmo número de threads consegue atender</em>. Por isso brilha em I/O (banco, HTTP, disco) e não ajuda em cálculo pesado de CPU — ali o "garçom" é quem está cozinhando.</p>
</div>

<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 300" role="img" aria-label="Linha do tempo: no modo síncrono a Thread 1 fica bloqueada durante toda a espera pelo banco; no modo assíncrono a Thread 1 é liberada, o I/O acontece sem nenhuma thread presa, e a continuação roda na Thread 4 do pool">
    <defs><marker id="c3-arr-async" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="24">SÍNCRONO — .Result / I/O bloqueante</text>
    <text class="t-mono" x="10" y="64">Thread #1</text>
    <rect class="box-good" x="130" y="44" width="70" height="30" rx="5"/><text x="165" y="64" text-anchor="middle">código</text>
    <rect class="box-bad" x="200" y="44" width="380" height="30" rx="5"/><text x="390" y="64" text-anchor="middle">bloqueada — só esperando o banco responder</text>
    <rect class="box-good" x="580" y="44" width="70" height="30" rx="5"/><text x="615" y="64" text-anchor="middle">código</text>
    <line class="line" x1="10" y1="100" x2="710" y2="100" stroke-dasharray="3 5"/>
    <text class="t-title" x="10" y="130">ASSÍNCRONO — await</text>
    <text class="t-mono" x="10" y="166">Thread #1</text>
    <rect class="box-good" x="130" y="146" width="70" height="30" rx="5"/><text x="165" y="166" text-anchor="middle">código</text>
    <rect class="box-accent" x="200" y="146" width="450" height="30" rx="5" stroke-dasharray="6 4"/><text x="425" y="166" text-anchor="middle">livre → volta ao pool e atende outras requisições</text>
    <text class="t-mono" x="10" y="212">Banco/rede</text>
    <rect class="box-warn" x="200" y="192" width="380" height="30" rx="5"/><text x="390" y="212" text-anchor="middle">I/O em andamento — nenhuma thread presa</text>
    <path class="line" d="M580,222 L580,236" marker-end="url(#c3-arr-async)"/>
    <text class="t-mono" x="10" y="258">Thread #4</text>
    <rect class="box-good" x="580" y="238" width="100" height="30" rx="5"/><text x="630" y="258" text-anchor="middle">continuação</text>
    <text class="t-muted" x="130" y="258">qualquer thread livre do pool</text>
    <text class="t-muted" x="130" y="290">O tempo total é o mesmo. O ganho é a thread que ficou livre: é isso que faz o servidor aguentar mais usuários.</text>
  </svg>
  <figcaption>O <code>await</code> não acelera o banco — ele devolve a thread enquanto o banco trabalha.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Collections.Concurrent;
using System.Diagnostics;
using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// Simula uma chamada de I/O (banco, API) que demora 1 segundo
static async Task&lt;string&gt; BuscarAsync(string recurso)
{
    await Task.Delay(1000);   // durante a espera, NENHUMA thread fica presa
    return $"{recurso} ok";
}

var relogio = Stopwatch.StartNew();
// Um depois do outro: cada await espera o anterior terminar
await BuscarAsync("cliente");
await BuscarAsync("pedidos");
await BuscarAsync("estoque");
Console.WriteLine($"Sequencial : {relogio.Elapsed.TotalSeconds:F1}s");

relogio.Restart();
// Dispara as três de uma vez e espera todas juntas
string[] resultados = await Task.WhenAll(BuscarAsync("cliente"), BuscarAsync("pedidos"), BuscarAsync("estoque"));
Console.WriteLine($"Concorrente: {relogio.Elapsed.TotalSeconds:F1}s -&gt; {string.Join(", ", resultados)}");

// 1.000 "requisições" simultâneas de 1s cada: quantas threads foram necessárias?
var threads = new ConcurrentDictionary&lt;int, bool&gt;();
relogio.Restart();
await Task.WhenAll(Enumerable.Range(0, 1_000).Select(async _ =&gt;
{
    threads[Environment.CurrentManagedThreadId] = true;
    await Task.Delay(1000);
    threads[Environment.CurrentManagedThreadId] = true;
}));
Console.WriteLine($"1.000 esperas de 1s: {relogio.Elapsed.TotalSeconds:F1}s usando só {threads.Count} threads");</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(tempos, contagens e IDs variam conforme a máquina e a execução)</span></div>
  <pre>Sequencial : 3,0s
Concorrente: 1,0s -&gt; cliente ok, pedidos ok, estoque ok
1.000 esperas de 1s: 1,0s usando só 8 threads</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Três <code>await</code> seguidos somam os tempos: ~3 s. <code>Task.WhenAll</code> dispara as três e espera todas: ~1 s.</li>
  <li>Mil "requisições" de 1 s terminam em ~1 s usando só um punhado de threads — enquanto o <code>Task.Delay</code> espera, nenhuma thread fica presa. Com código bloqueante, seriam necessárias mil threads.</li>
  <li><code>Environment.CurrentManagedThreadId</code> mostra em qual thread o código está. Repare que a continuação depois do <code>await</code> pode rodar em outra thread.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>O <code>await</code> não acelera a operação: ele devolve a thread enquanto se espera, e é isso que faz um servidor atender mais gente com o mesmo hardware.</p>
</div>

<h3>3.1.1 A State Machine Gerada pelo Compilador</h3>

<p class="step-label">📘 O conceito</p>
<p>Todo método <code>async</code> é reescrito pelo compilador como uma <strong>máquina de estados</strong>: uma <code>struct</code> que implementa <code>IAsyncStateMachine</code>. Cada <code>await</code> vira um estado. Quando a operação aguardada ainda não terminou, o método guarda em qual estado parou, <strong>devolve uma <code>Task</code> para quem chamou</strong> e sai. Quando a operação termina, o método <code>MoveNext()</code> é chamado de novo e continua exatamente dali.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O marcador de página</div>
  <p>Você está lendo um livro e o telefone toca. Você coloca o marcador, fecha o livro e vai atender. Depois, abre direto na página marcada. O <code>await</code> é o marcador: o método "fecha o livro" (libera a thread) e, quando a resposta chega, reabre exatamente onde parou — com todas as anotações (variáveis locais) intactas.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="O método async vira uma máquina de estados: começa no estado menos 1, executa até o primeiro await; se a operação não terminou, guarda o estado 0 e devolve o controle; quando a operação termina, MoveNext é chamado e retoma do estado 0, e assim por diante até o fim">
    <defs><marker id="c3d1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c3d1-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c3d1-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box" x="10" y="70" width="150" height="60" rx="8"/>
    <text x="85.0" y="96.0" text-anchor="middle" font-weight="600">estado -1</text>
    <text class="t-muted" x="85.0" y="114.0" text-anchor="middle">início</text>
    <path class="line" d="M160,100 L186,100" marker-end="url(#c3d1-head)"/>
    <rect class="box-accent" x="190" y="70" width="150" height="60" rx="8"/>
    <text x="265.0" y="96.0" text-anchor="middle" font-weight="600">estado 0</text>
    <text class="t-muted" x="265.0" y="114.0" text-anchor="middle">após 1º await</text>
    <path class="line" d="M340,100 L366,100" marker-end="url(#c3d1-head)"/>
    <rect class="box-accent" x="370" y="70" width="150" height="60" rx="8"/>
    <text x="445.0" y="96.0" text-anchor="middle" font-weight="600">estado 1</text>
    <text class="t-muted" x="445.0" y="114.0" text-anchor="middle">após 2º await</text>
    <path class="line" d="M520,100 L546,100" marker-end="url(#c3d1-head)"/>
    <rect class="box-good" x="550" y="70" width="150" height="60" rx="8"/>
    <text x="625.0" y="96.0" text-anchor="middle" font-weight="600">fim</text>
    <text class="t-muted" x="625.0" y="114.0" text-anchor="middle">SetResult</text>
    <path class="line-good" d="M230,70 C230,34 300,34 300,66" marker-end="url(#c3d1-head-good)"/>
    <path class="line-good" d="M410,70 C410,34 480,34 480,66" marker-end="url(#c3d1-head-good)"/>
    <text class="t-good" x="280" y="20" text-anchor="middle">await incompleto: guarda o estado, devolve a Task</text>
    <text class="t-muted" x="10" y="170">MoveNext() é chamado de novo quando a operação termina — e o switch pula direto para o estado salvo.</text>
    <text class="t-muted" x="10" y="192">As variáveis locais viram campos da máquina, por isso "sobrevivem" à pausa.</text>
    <text class="t-muted" x="10" y="236">Como um marcador de página: fechar o livro não perde onde você estava.</text>
  </svg>
  <figcaption>O compilador transforma o método async numa máquina de estados, com um estado por <code>await</code>.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">Console.WriteLine("A: vou chamar o método");
Task tarefa = TrabalharAsync();
Console.WriteLine("C: o método já DEVOLVEU uma Task, mas ainda não terminou");
await tarefa;
Console.WriteLine("E: agora sim, tudo pronto");

static async Task TrabalharAsync()
{
    Console.WriteLine("B: dentro do método, antes do await");
    await Task.Delay(100);   // aqui o método guarda "onde parou" e devolve o controle
    Console.WriteLine("D: depois do await — retomado exatamente de onde parou");
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>A: vou chamar o método
B: dentro do método, antes do await
C: o método já DEVOLVEU uma Task, mas ainda não terminou
D: depois do await — retomado exatamente de onde parou
E: agora sim, tudo pronto</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>A ordem de saída é A, B, C, D, E: o método começa a rodar na hora (B), mas, ao encontrar o <code>await</code>, <em>devolve</em> a <code>Task</code> para quem chamou (C) antes de terminar.</li>
  <li>O trecho depois do <code>await</code> (D) é a "continuação": roda quando o <code>Task.Delay</code> termina.</li>
</ul>

<p class="step-label">🧑‍💻 O que o compilador gera (simplificado)</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// O que você escreve:
public async Task&lt;string&gt; BuscarNomeAsync(int id)
{
    var dados = await _db.GetAsync(id);
    var enriquecido = await _enriquecedor.EnrichAsync(dados);
    return enriquecido.Nome;
}

// O que o compilador gera (simplificado):
struct BuscarNomeStateMachine : IAsyncStateMachine
{
    public int _estado;                          // -1 = início, 0 = após 1º await, 1 = após 2º
    public AsyncTaskMethodBuilder&lt;string&gt; _builder;
    private TaskAwaiter&lt;Dados&gt; _espera1;
    private TaskAwaiter&lt;Enriquecido&gt; _espera2;
    private Dados _dados;                        // variáveis locais viram CAMPOS

    public void MoveNext()
    {
        switch (_estado)
        {
            case -1:
                _espera1 = _db.GetAsync(id).GetAwaiter();
                if (!_espera1.IsCompleted) { _estado = 0; /* agenda MoveNext */ return; }
                goto case 0;
            case 0:
                _dados = _espera1.GetResult();
                _espera2 = _enriquecedor.EnrichAsync(_dados).GetAwaiter();
                if (!_espera2.IsCompleted) { _estado = 1; return; }
                goto case 1;
            case 1:
                _builder.SetResult(_espera2.GetResult().Nome);
                break;
        }
    }
}</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">💡 Veja com seus olhos</div>
  <p>Em <a href="https://sharplab.io" target="_blank">sharplab.io</a>, escolha "C#" na saída e cole qualquer método <code>async</code> para ver a máquina de estados real que o compilador gera.</p>
</div>

<h3>3.1.2 SynchronizationContext e Deadlocks</h3>

<p class="step-label">📘 O conceito</p>
<p>Algumas aplicações têm uma thread "especial": em WPF, WinForms, MAUI e no ASP.NET clássico (.NET Framework), certos códigos <em>precisam</em> rodar numa thread específica (por exemplo, a da interface). Quem garante isso é o <strong><code>SynchronizationContext</code></strong>: por padrão, o <code>await</code> <em>volta</em> para o contexto de origem para continuar.</p><p>O problema: se essa thread especial ficar <strong>bloqueada</strong> esperando o resultado (<code>.Result</code>, <code>.Wait()</code>), a continuação nunca consegue voltar para ela. Um espera o outro para sempre: <strong>deadlock</strong>.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A ligação que precisa da mesma linha</div>
  <p>Você liga para o banco e pedem para aguardar o retorno — que virá <em>pela mesma linha telefônica</em>. Só que você fica na linha, segurando o telefone, esperando o retorno. O banco tenta ligar, mas a linha está ocupada… por você esperando o banco. Ninguém desliga, ninguém fala.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="Deadlock: a única thread da interface bloqueia em Result esperando a Task; a Task, para terminar, precisa rodar sua continuação justamente nessa thread, que está bloqueada. Um espera o outro para sempre">
    <defs><marker id="c3d2-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c3d2-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c3d2-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-bad" x="40" y="90" width="220" height="70" rx="8"/>
    <text x="150.0" y="121.0" text-anchor="middle" font-weight="600">Thread da UI (única)</text>
    <text class="t-mono t-bad" x="150.0" y="139.0" text-anchor="middle">.Result: "espero a Task"</text>
    <rect class="box-bad" x="460" y="90" width="220" height="70" rx="8"/>
    <text x="570.0" y="121.0" text-anchor="middle" font-weight="600">Task (continuação)</text>
    <text class="t-mono t-bad" x="570.0" y="139.0" text-anchor="middle">"preciso da thread da UI"</text>
    <path class="line-bad" d="M260,110 C340,60 380,60 456,110" marker-end="url(#c3d2-head-bad)"/>
    <text class="t-bad" x="360" y="56" text-anchor="middle">espera</text>
    <path class="line-bad" d="M460,140 C380,190 340,190 264,140" marker-end="url(#c3d2-head-bad)"/>
    <text class="t-bad" x="360" y="200" text-anchor="middle">espera</text>
    <text x="360" y="128" text-anchor="middle" font-weight="600">⟳</text>
    <text class="t-good" x="10" y="240">Saídas: await de ponta a ponta (sem .Result) ou, em bibliotecas, ConfigureAwait(false).</text>
  </svg>
  <figcaption>Deadlock: dois lados esperando um pelo outro — e nenhum cede.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Collections.Concurrent;

// Um contexto de THREAD ÚNICA, como o de WPF, WinForms ou do ASP.NET clássico (.NET Framework)
var contexto = new ContextoDeThreadUnica();

contexto.Executar(() =&gt;
{
    // ❌ Bloqueia a única thread esperando um código async que precisa VOLTAR para ela
    Task&lt;string&gt; tarefa = BuscarDadosAsync(voltarParaOContexto: true);
    bool terminou = tarefa.Wait(TimeSpan.FromSeconds(2));   // .Result/.Wait(), com limite só para a demo não travar
    Console.WriteLine(terminou
        ? $"Terminou: {tarefa.Result}"
        : "DEADLOCK: a thread esperava a tarefa, e a tarefa esperava a thread (desistimos após 2s)");
});

contexto.Executar(() =&gt;
{
    // ✅ ConfigureAwait(false): a continuação roda em qualquer thread do pool
    Task&lt;string&gt; tarefa = BuscarDadosAsync(voltarParaOContexto: false);
    bool terminou = tarefa.Wait(TimeSpan.FromSeconds(2));
    Console.WriteLine(terminou ? $"Com ConfigureAwait(false): {tarefa.Result}" : "DEADLOCK");
});

static async Task&lt;string&gt; BuscarDadosAsync(bool voltarParaOContexto)
{
    await Task.Delay(100).ConfigureAwait(voltarParaOContexto);
    return "dados carregados";
}

// Uma fila de trabalhos processada por UMA thread (o "laço de mensagens" de uma janela)
sealed class ContextoDeThreadUnica : SynchronizationContext
{
    private readonly BlockingCollection&lt;(SendOrPostCallback Acao, object? Estado)&gt; _fila = new();

    // Post: "coloque esta continuação na fila da MINHA thread"
    public override void Post(SendOrPostCallback d, object? state) =&gt; _fila.Add((d, state));

    public void Executar(Action acao)
    {
        var anterior = Current;
        SetSynchronizationContext(this);
        try
        {
            Post(_ =&gt; acao(), null);
            while (_fila.TryTake(out var item, TimeSpan.FromMilliseconds(500)))
                item.Acao(item.Estado);   // um item por vez, sempre na mesma thread
        }
        finally
        {
            SetSynchronizationContext(anterior);
        }
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>DEADLOCK: a thread esperava a tarefa, e a tarefa esperava a thread (desistimos após 2s)
Com ConfigureAwait(false): dados carregados</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>ContextoDeThreadUnica</code> imita o laço de mensagens de uma janela: uma fila de trabalhos processada por <em>uma</em> thread.</li>
  <li>Na primeira chamada, <code>tarefa.Wait()</code> bloqueia essa thread. O <code>await</code> dentro de <code>BuscarDadosAsync</code> tenta voltar para o contexto (<code>Post</code>), mas a continuação fica parada na fila, porque a única thread está bloqueada. Em uma aplicação real, sem o limite de 2 s, a tela congelaria para sempre.</li>
  <li>Com <code>ConfigureAwait(false)</code>, a continuação roda numa thread do pool e não precisa da thread bloqueada, então a tarefa termina.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ E no ASP.NET Core e em apps de console?</div>
  <p>Eles <strong>não</strong> têm <code>SynchronizationContext</code>, então esse deadlock clássico não acontece. Mas bloquear com <code>.Result</code> continua sendo um erro: cada chamada prende uma thread do pool esperando I/O, e sob carga o pool se esgota (<em>thread pool starvation</em>) — o servidor inteiro fica lento. A regra é a mesma em qualquer aplicação: <strong>async de ponta a ponta</strong>. <code>ConfigureAwait(false)</code> continua recomendado em <em>bibliotecas</em>, que não sabem em qual tipo de aplicação vão rodar.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Nunca bloqueie código assíncrono com <code>.Result</code> ou <code>.Wait()</code>: use <code>await</code> do início ao fim e <code>ConfigureAwait(false)</code> em bibliotecas.</p>
</div>

<h3>3.1.3 ValueTask — Sem Alocação quando o Resultado Já Existe</h3>

<p class="step-label">📘 O conceito</p>
<p>Todo <code>Task&lt;T&gt;</code> é um objeto no heap. Se um método async <em>quase sempre</em> já tem a resposta pronta (um cache, um buffer já preenchido), criar esse objeto a cada chamada é desperdício. <strong><code>ValueTask&lt;T&gt;</code></strong> é uma <code>struct</code> que carrega o valor pronto diretamente e só usa uma <code>Task</code> de verdade quando precisa esperar.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O prato pronto no balcão</div>
  <p>Se o pão de queijo já está pronto na vitrine, a atendente te entrega na hora — não abre uma comanda, não passa pela cozinha. Só quando acabou é que ela anota o pedido (a <code>Task</code>) e você espera. <code>ValueTask</code> evita a "comanda" quando o produto já está à mão.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// 10.000 consultas ao cache: quanto cada versão aloca no heap?
long antes = GC.GetAllocatedBytesForCurrentThread();
for (int i = 0; i &lt; 10_000; i++) await Repositorio.ComTaskAsync(1);
long bytesTask = GC.GetAllocatedBytesForCurrentThread() - antes;

antes = GC.GetAllocatedBytesForCurrentThread();
for (int i = 0; i &lt; 10_000; i++) await Repositorio.ComValueTaskAsync(1);
long bytesValueTask = GC.GetAllocatedBytesForCurrentThread() - antes;

Console.WriteLine($"Task&lt;string&gt;     : {bytesTask,7} bytes alocados");
Console.WriteLine($"ValueTask&lt;string&gt;: {bytesValueTask,7} bytes alocados");

// Na falta no cache, os dois fazem o mesmo trabalho assíncrono
Console.WriteLine($"Id 2 (fora do cache): {await Repositorio.ComValueTaskAsync(2)}");

static class Repositorio
{
    private static readonly Dictionary&lt;int, string&gt; Cache = new() { [1] = "Ana" };

    // Task: mesmo quando o resultado já está pronto, cria um objeto Task no heap
    public static Task&lt;string&gt; ComTaskAsync(int id) =&gt;
        Cache.TryGetValue(id, out var nome) ? Task.FromResult(nome) : BuscarNoBancoAsync(id);

    // ValueTask: quando o resultado já está pronto, embrulha o valor sem alocar nada
    public static ValueTask&lt;string&gt; ComValueTaskAsync(int id) =&gt;
        Cache.TryGetValue(id, out var nome)
            ? new ValueTask&lt;string&gt;(nome)
            : new ValueTask&lt;string&gt;(BuscarNoBancoAsync(id));

    private static async Task&lt;string&gt; BuscarNoBancoAsync(int id)
    {
        await Task.Delay(50);   // simula o banco
        return $"Cliente {id} (veio do banco)";
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(bytes alocados variam um pouco conforme a versão do runtime)</span></div>
  <pre>Task&lt;string&gt;     :  720216 bytes alocados
ValueTask&lt;string&gt;:       0 bytes alocados
Id 2 (fora do cache): Cliente 2 (veio do banco)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>Task.FromResult(nome)</code> cria um objeto <code>Task</code> novo a cada chamada, mesmo com o resultado pronto: dezenas de bytes vezes 10.000.</li>
  <li><code>new ValueTask&lt;string&gt;(nome)</code> guarda o valor dentro da própria struct: nenhuma alocação no caminho do cache.</li>
  <li>Quando o valor não está no cache, <code>ValueTask</code> embrulha a <code>Task</code> real do banco — o custo é o mesmo da versão com <code>Task</code>.</li>
</ul>

<div class="info-box danger">
  <div class="info-box-label">🚨 A regra de ouro do ValueTask</div>
  <p>Um <code>ValueTask</code> deve ser aguardado <strong>uma única vez</strong>. Guardar numa variável e dar <code>await</code> duas vezes, ou chamar <code>.Result</code> antes de terminar, tem comportamento indefinido. Se precisar reutilizar o resultado, converta com <code>.AsTask()</code>. Na dúvida, use <code>Task</code>: <code>ValueTask</code> é otimização para caminhos muito executados, confirmada com medição.</p>
</div>

<h2>3.2 Paralelismo e Thread Safety</h2>

<p><strong>Concorrência</strong> é lidar com várias coisas ao mesmo tempo (muitas requisições esperando I/O). <strong>Paralelismo</strong> é <em>fazer</em> várias coisas ao mesmo tempo, em vários núcleos da CPU. Em ambos, quando duas threads mexem no mesmo dado, surgem os bugs mais difíceis de reproduzir que existem.</p>

<h3>3.2.1 Task Parallel Library</h3>

<p class="step-label">📘 O conceito</p>
<ul><li><code>Task.WhenAll</code>: dispara várias tarefas e espera <strong>todas</strong>.</li><li><code>Task.WhenAny</code>: devolve a <strong>primeira</strong> que terminar (a base de timeouts e "o mais rápido vence").</li><li><code>Parallel.ForEachAsync</code>: processa uma coleção em paralelo com um <strong>limite</strong> de simultaneidade — essencial para não derrubar uma API externa ou o banco.</li></ul>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Os caixas do supermercado</div>
  <p>Com uma fila e três caixas abertos, três clientes são atendidos ao mesmo tempo — nem um (lento), nem cem (não existem cem caixas). <code>MaxDegreeOfParallelism</code> é o número de caixas abertos. <code>WhenAll</code> é "o supermercado fecha quando todos forem atendidos"; <code>WhenAny</code> é "a primeira fila a andar ganha".</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Diagnostics;
using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

string[] arquivos = Enumerable.Range(1, 9).Select(i =&gt; $"foto{i}.jpg").ToArray();
int emAndamento = 0, picoSimultaneo = 0;
var relogio = Stopwatch.StartNew();

// Parallel.ForEachAsync: processa em paralelo, mas NO MÁXIMO 3 ao mesmo tempo
await Parallel.ForEachAsync(arquivos, new ParallelOptions { MaxDegreeOfParallelism = 3 }, async (arquivo, ct) =&gt;
{
    int agora = Interlocked.Increment(ref emAndamento);
    AtualizarPico(agora);
    await Task.Delay(300, ct);   // simula um upload de 300 ms
    Interlocked.Decrement(ref emAndamento);
});
Console.WriteLine($"9 uploads de 300 ms, 3 por vez: {relogio.Elapsed.TotalSeconds:F1}s (pico de {picoSimultaneo} simultâneos)");

// Task.WhenAny: quem terminar primeiro "vence" — útil para timeout
Task&lt;string&gt; consulta = ConsultarAsync(atrasoMs: 2000);
Task limite = Task.Delay(500);
Task vencedora = await Task.WhenAny(consulta, limite);
Console.WriteLine(vencedora == limite ? "WhenAny: a consulta passou de 500 ms -&gt; timeout" : await consulta);

// Task.WhenAll com tratamento individual: uma falha não esconde os outros resultados
var resultados = await Task.WhenAll(new[] { 100, -1, 200 }.Select(async atraso =&gt;
{
    try { return $"ok: {await ConsultarAsync(atraso)}"; }
    catch (Exception ex) { return $"falhou: {ex.Message}"; }
}));
Console.WriteLine("WhenAll -&gt; " + string.Join(" | ", resultados));

void AtualizarPico(int valor)
{
    int atual;
    while (valor &gt; (atual = picoSimultaneo) &amp;&amp;
           Interlocked.CompareExchange(ref picoSimultaneo, valor, atual) != atual) { }
}

static async Task&lt;string&gt; ConsultarAsync(int atrasoMs)
{
    if (atrasoMs &lt; 0) throw new InvalidOperationException("serviço indisponível");
    await Task.Delay(atrasoMs);
    return $"resposta em {atrasoMs} ms";
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(tempos, contagens e IDs variam conforme a máquina e a execução)</span></div>
  <pre>9 uploads de 300 ms, 3 por vez: 1,0s (pico de 3 simultâneos)
WhenAny: a consulta passou de 500 ms -&gt; timeout
WhenAll -&gt; ok: resposta em 100 ms | falhou: serviço indisponível | ok: resposta em 200 ms</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>9 uploads de 300 ms, 3 por vez, levam cerca de 1 s: são 3 "rodadas" de 300 ms, mais um pequeno custo de agendamento. O pico medido de tarefas simultâneas é 3, nunca mais.</li>
  <li><code>WhenAny(consulta, Task.Delay(500))</code>: se o <code>Delay</code> terminar primeiro, a consulta estourou o tempo. Num caso real, cancele a consulta com um <code>CancellationToken</code> (3.3.1), porque ela continua rodando.</li>
  <li>Envolver cada tarefa num <code>try/catch</code> dentro do <code>Select</code> faz o <code>WhenAll</code> devolver todos os resultados, com as falhas identificadas, em vez de parar na primeira exceção.</li>
</ul>

<h3>3.2.2 Condições de Corrida e Primitivas de Sincronização</h3>

<p class="step-label">📘 O conceito</p>
<p>Uma <strong>condição de corrida</strong> acontece quando o resultado depende da ordem em que threads executam. O caso clássico é <code>contador++</code>: parece uma operação, mas são três (ler, somar, gravar). Se duas threads intercalam esses passos, um incremento se perde. As ferramentas para evitar isso:</p>

<table>
  <thead><tr><th>Primitiva</th><th>Funciona com await?</th><th>Quando usar</th></tr></thead>
  <tbody>
    <tr><td><code>Interlocked</code></td><td>—</td><td>Contadores e trocas simples, sem trava (a mais rápida)</td></tr>
    <tr><td><code>lock</code></td><td>❌</td><td>Seções críticas curtas e síncronas</td></tr>
    <tr><td><code>SemaphoreSlim</code></td><td>✅</td><td>Exclusão ou limite de concorrência em código async</td></tr>
    <tr><td><code>ConcurrentDictionary</code>, <code>ConcurrentQueue</code></td><td>—</td><td>Coleções compartilhadas entre threads</td></tr>
    <tr><td><code>Channel&lt;T&gt;</code></td><td>✅</td><td>Passar trabalho entre produtores e consumidores (3.2.3)</td></tr>
  </tbody>
</table>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A conta conjunta</div>
  <p>Um casal tem R$ 100 na conta. Os dois, em caixas diferentes, consultam o saldo ao mesmo tempo: ambos veem R$ 100 e depositam R$ 1. Cada caixa grava "R$ 101". Um depósito sumiu. O banco resolve com uma regra: só um caixa por vez mexe na conta (o <code>lock</code>) — ou com uma operação indivisível de "somar 1" (o <code>Interlocked</code>).</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="Condição de corrida: as threads A e B leem o valor 100 ao mesmo tempo, as duas somam 1 e as duas gravam 101; um incremento foi perdido">
    <defs><marker id="c3d3-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c3d3-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c3d3-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="24">TEMPO →</text>
    <text class="t-mono" x="10" y="70">Thread A</text>
    <text class="t-mono" x="10" y="150">Thread B</text>
    <rect class="box" x="110" y="48" width="140" height="36" rx="8"/>
    <text x="180.0" y="71.0" text-anchor="middle" font-weight="600">lê 100</text>
    <rect class="box" x="270" y="48" width="140" height="36" rx="8"/>
    <text x="340.0" y="71.0" text-anchor="middle" font-weight="600">soma → 101</text>
    <rect class="box" x="430" y="48" width="140" height="36" rx="8"/>
    <text x="500.0" y="71.0" text-anchor="middle" font-weight="600">grava 101</text>
    <rect class="box" x="150" y="128" width="140" height="36" rx="8"/>
    <text x="220.0" y="151.0" text-anchor="middle" font-weight="600">lê 100</text>
    <rect class="box" x="310" y="128" width="140" height="36" rx="8"/>
    <text x="380.0" y="151.0" text-anchor="middle" font-weight="600">soma → 101</text>
    <rect class="box" x="470" y="128" width="140" height="36" rx="8"/>
    <text x="540.0" y="151.0" text-anchor="middle" font-weight="600">grava 101</text>
    <rect class="box-bad" x="610" y="88" width="100" height="50" rx="8"/>
    <text x="660.0" y="109.0" text-anchor="middle" font-weight="600">101</text>
    <text class="t-bad" x="660.0" y="127.0" text-anchor="middle">esperado 102</text>
    <path class="line-bad" d="M570,66 L606,100" marker-end="url(#c3d3-head-bad)"/>
    <path class="line-bad" d="M610,146 L640,142" marker-end="url(#c3d3-head-bad)"/>
    <text class="t-muted" x="10" y="206">Os três passos de "contador++" se intercalaram: o valor gravado por A foi sobrescrito por B.</text>
    <text class="t-good" x="10" y="230">Solução: tornar a operação indivisível — Interlocked, lock ou uma estrutura concorrente.</text>
  </svg>
  <figcaption>Condição de corrida: o resultado depende de quem chega primeiro.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">const int Threads = 8, Incrementos = 100_000, Esperado = Threads * Incrementos;

// ❌ Sem proteção: "contador++" é ler, somar e gravar — três passos que podem se intercalar
int semProtecao = 0;
Parallel.For(0, Threads, _ =&gt; { for (int i = 0; i &lt; Incrementos; i++) semProtecao++; });

// ✅ Interlocked: a soma acontece numa única operação atômica do processador
int comInterlocked = 0;
Parallel.For(0, Threads, _ =&gt; { for (int i = 0; i &lt; Incrementos; i++) Interlocked.Increment(ref comInterlocked); });

// ✅ lock: só uma thread por vez entra no bloco
int comLock = 0;
object trava = new();
Parallel.For(0, Threads, _ =&gt; { for (int i = 0; i &lt; Incrementos; i++) lock (trava) comLock++; });

Console.WriteLine($"Esperado        : {Esperado}");
Console.WriteLine($"Sem proteção    : {semProtecao} ({Esperado - semProtecao} incrementos PERDIDOS)");
Console.WriteLine($"Com Interlocked : {comInterlocked}");
Console.WriteLine($"Com lock        : {comLock}");

// SemaphoreSlim: o "lock" do mundo async — aqui, no máximo 2 tarefas ao mesmo tempo
var semaforo = new SemaphoreSlim(2);
int dentro = 0, pico = 0;
await Task.WhenAll(Enumerable.Range(1, 6).Select(async _ =&gt;
{
    await semaforo.WaitAsync();
    try
    {
        int agora = Interlocked.Increment(ref dentro);
        lock (semaforo) pico = Math.Max(pico, agora);
        await Task.Delay(100);
        Interlocked.Decrement(ref dentro);
    }
    finally
    {
        semaforo.Release();   // SEMPRE no finally: se der erro, a vaga é devolvida
    }
}));
Console.WriteLine($"SemaphoreSlim(2): 6 tarefas, no máximo {pico} ao mesmo tempo");</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(tempos, contagens e IDs variam conforme a máquina e a execução)</span></div>
  <pre>Esperado        : 800000
Sem proteção    : 122298 (677702 incrementos PERDIDOS)
Com Interlocked : 800000
Com lock        : 800000
SemaphoreSlim(2): 6 tarefas, no máximo 2 ao mesmo tempo</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Sem proteção, 8 threads fazendo 100.000 incrementos cada quase nunca chegam a 800.000. O número muda a cada execução, e é por isso que esse tipo de bug "some" quando você tenta depurar.</li>
  <li><code>Interlocked.Increment</code> faz ler-somar-gravar numa única instrução atômica do processador.</li>
  <li><code>lock (trava)</code> garante que só uma thread por vez executa o bloco. Não use <code>await</code> dentro de um <code>lock</code> (o compilador proíbe).</li>
  <li><code>SemaphoreSlim(2)</code> é o equivalente assíncrono: <code>WaitAsync</code> espera uma vaga sem bloquear a thread, e <code>Release</code> no <code>finally</code> garante que a vaga volta mesmo com erro.</li>
</ul>

<p class="step-label">🧑‍💻 Dois padrões que aparecem em código de produção</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// 1) Limitar chamadas simultâneas a uma API externa (throttling)
private readonly SemaphoreSlim _limite = new(5);   // no máximo 5 ao mesmo tempo

public async Task&lt;string&gt; ChamarApiAsync(string url, CancellationToken ct)
{
    await _limite.WaitAsync(ct);     // espera uma vaga ANTES de iniciar a chamada
    try { return await _http.GetStringAsync(url, ct); }
    finally { _limite.Release(); }
}

// 2) Cache assíncrono que carrega cada chave UMA vez, mesmo com muitas threads pedindo juntas
private readonly ConcurrentDictionary&lt;string, Lazy&lt;Task&lt;Config&gt;&gt;&gt; _configs = new();

public Task&lt;Config&gt; ObterConfigAsync(string chave) =&gt;
    _configs.GetOrAdd(chave, c =&gt; new Lazy&lt;Task&lt;Config&gt;&gt;(() =&gt; CarregarAsync(c))).Value;
// GetOrAdd pode chamar a fábrica mais de uma vez em corrida; o Lazy garante que CarregarAsync roda só uma.</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Estado compartilhado + várias threads = corrida: proteja com <code>Interlocked</code>, <code>lock</code> ou <code>SemaphoreSlim</code> — ou, melhor ainda, evite compartilhar.</p>
</div>

<h3>3.2.3 Channels — Produtor-Consumidor Assíncrono</h3>

<p class="step-label">📘 O conceito</p>
<p>Um <code>Channel&lt;T&gt;</code> é uma fila assíncrona e thread-safe para passar trabalho de quem <strong>produz</strong> para quem <strong>consome</strong>. Com capacidade limitada (<em>bounded</em>), ele aplica <strong>backpressure</strong>: se os consumidores não dão conta, o produtor espera em vez de encher a memória. É a base de pipelines de processamento e de <em>background workers</em> em ASP.NET Core.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O balcão da lanchonete</div>
  <p>O caixa (produtor) anota os pedidos e coloca as comandas no balcão; os cozinheiros (consumidores) pegam uma de cada vez. O balcão tem espaço para poucas comandas: se lotar, o caixa segura o próximo cliente por um instante. Assim a cozinha nunca é soterrada — e, se entrar mais um cozinheiro, a fila anda mais rápido sem mudar nada no caixa.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 220" role="img" aria-label="Um produtor coloca pedidos num canal com capacidade 3; três consumidores retiram e processam; quando o canal lota, o produtor espera">
    <defs><marker id="c3d4-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c3d4-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c3d4-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="80" width="150" height="60" rx="8"/>
    <text x="85.0" y="106.0" text-anchor="middle" font-weight="600">Produtor</text>
    <text class="t-mono t-muted" x="85.0" y="124.0" text-anchor="middle">WriteAsync</text>
    <rect class="panel" x="230" y="70" width="220" height="80" rx="12"/>
    <text class="t-muted" x="340" y="62" text-anchor="middle">Channel (capacidade 3)</text>
    <rect class="box-warn" x="250" y="92" width="54" height="36" rx="6"/>
    <text x="277.0" y="115.0" text-anchor="middle" font-weight="600">7</text>
    <rect class="box-warn" x="316" y="92" width="54" height="36" rx="6"/>
    <text x="343.0" y="115.0" text-anchor="middle" font-weight="600">8</text>
    <rect class="box-warn" x="382" y="92" width="54" height="36" rx="6"/>
    <text x="409.0" y="115.0" text-anchor="middle" font-weight="600">9</text>
    <rect class="box-good" x="560" y="20" width="150" height="50" rx="8"/>
    <text x="635.0" y="41.0" text-anchor="middle" font-weight="600">Consumidor 1</text>
    <text class="t-mono t-muted" x="635.0" y="59.0" text-anchor="middle">ReadAllAsync</text>
    <path class="line" d="M450,110 C500,110 510,45 556,45" marker-end="url(#c3d4-head)"/>
    <rect class="box-good" x="560" y="84" width="150" height="50" rx="8"/>
    <text x="635.0" y="105.0" text-anchor="middle" font-weight="600">Consumidor 2</text>
    <text class="t-mono t-muted" x="635.0" y="123.0" text-anchor="middle">ReadAllAsync</text>
    <path class="line" d="M450,110 C500,110 510,109 556,109" marker-end="url(#c3d4-head)"/>
    <rect class="box-good" x="560" y="148" width="150" height="50" rx="8"/>
    <text x="635.0" y="169.0" text-anchor="middle" font-weight="600">Consumidor 3</text>
    <text class="t-mono t-muted" x="635.0" y="187.0" text-anchor="middle">ReadAllAsync</text>
    <path class="line" d="M450,110 C500,110 510,173 556,173" marker-end="url(#c3d4-head)"/>
    <path class="line" d="M160,110 L226,110" marker-end="url(#c3d4-head)"/>
    <text class="t-muted" x="193" y="170" text-anchor="middle">canal cheio?</text>
    <text class="t-bad" x="193" y="188" text-anchor="middle">o produtor ESPERA</text>
    <text class="t-muted" x="10" y="212">Backpressure: quem produz rápido demais é freado, e a memória não explode.</text>
  </svg>
  <figcaption>Produtor-consumidor: o canal é o balcão entre quem pede e quem prepara.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Threading.Channels;

// Um canal com capacidade 3: se lotar, quem produz ESPERA (backpressure)
var canal = Channel.CreateBounded&lt;int&gt;(new BoundedChannelOptions(3)
{
    FullMode = BoundedChannelFullMode.Wait,
});

int processados = 0, maiorFila = 0;

// Produtor rápido: 20 pedidos o mais rápido possível
var produtor = Task.Run(async () =&gt;
{
    for (int pedido = 1; pedido &lt;= 20; pedido++)
    {
        await canal.Writer.WriteAsync(pedido);   // espera aqui se o canal estiver cheio
        lock (canal) maiorFila = Math.Max(maiorFila, canal.Reader.Count);
    }
    canal.Writer.Complete();   // avisa: "não vem mais nada"
});

// 3 consumidores lentos (50 ms por pedido), trabalhando em paralelo
var consumidores = Enumerable.Range(1, 3).Select(id =&gt; Task.Run(async () =&gt;
{
    int meus = 0;
    await foreach (var pedido in canal.Reader.ReadAllAsync())   // termina quando Complete() + fila vazia
    {
        await Task.Delay(50);
        Interlocked.Increment(ref processados);
        meus++;
    }
    return meus;
})).ToArray();

await produtor;
int[] porConsumidor = await Task.WhenAll(consumidores);

Console.WriteLine($"Pedidos processados: {processados}");
Console.WriteLine($"Maior fila observada: {maiorFila} (nunca passa da capacidade 3)");
Console.WriteLine($"Divisão entre os 3 consumidores: {string.Join(" + ", porConsumidor)}");</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(tempos, contagens e IDs variam conforme a máquina e a execução)</span></div>
  <pre>Pedidos processados: 20
Maior fila observada: 3 (nunca passa da capacidade 3)
Divisão entre os 3 consumidores: 6 + 7 + 7</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>Channel.CreateBounded&lt;int&gt;(3)</code> com <code>FullMode = Wait</code>: <code>WriteAsync</code> espera quando já há 3 itens na fila. A maior fila observada nunca passa de 3.</li>
  <li><code>ReadAllAsync()</code> entrega itens enquanto houver; depois de <code>Writer.Complete()</code> e com a fila vazia, o <code>await foreach</code> termina sozinho.</li>
  <li>Cada pedido é entregue a um único consumidor. A divisão entre eles varia a cada execução, mas a soma é sempre 20.</li>
</ul>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Tarefas Assíncronas Longas</div>
  <p>Se você precisa gerar um relatório pesado no banco de dados, fazê-lo diretamente na requisição HTTP vai dar timeout e frustrar o usuário. Usando o Hangfire ou BackgroundService, você coloca a tarefa em uma fila, retorna <code>202 Accepted</code> para o usuário, e ele pode checar o status depois.</p>
  <pre class="mermaid">
  sequenceDiagram
    actor U as Usuário
    participant API as API
    participant BG as Background Worker
    participant DB as Banco
    
    U->>API: POST /api/relatorios
    API->>BG: Enfileira Job (Hangfire)
    API-->>U: HTTP 202 (Em processamento)
    BG->>BG: Processamento Pesado (10 min)
    BG->>DB: Salva Resultado
    U->>API: GET /api/relatorios/status
    API-->>U: HTTP 200 (Completo)
  </pre>
</div>

<h3>3.2.4 IAsyncEnumerable — Streaming de Dados</h3>

<p class="step-label">📘 O conceito</p>
<p><code>IAsyncEnumerable&lt;T&gt;</code> junta <code>yield return</code> (1.2.3) com <code>await</code>: um método que <strong>busca dados de forma assíncrona e entrega item a item</strong>, consumido com <code>await foreach</code>. Serve para paginar APIs, ler grandes resultados do banco sem carregar tudo na memória e enviar respostas em streaming no ASP.NET Core.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Streaming vs. download</div>
  <p>No streaming, o filme começa a tocar enquanto o resto ainda está chegando; se você desistir na metade, o resto nem é baixado. No download, você espera o arquivo inteiro antes de ver o primeiro segundo. <code>IAsyncEnumerable</code> é o streaming; <code>Task&lt;List&lt;T&gt;&gt;</code> é o download.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Runtime.CompilerServices;

using var cancelamento = new CancellationTokenSource();

// Consome as páginas À MEDIDA que chegam, sem esperar a lista inteira
await foreach (var pedido in BuscarPedidosAsync(cancelamento.Token))
{
    Console.WriteLine($"   processando pedido {pedido}");
    if (pedido == 5)
    {
        Console.WriteLine("Achei o que eu queria: cancelando o resto");
        cancelamento.Cancel();
    }
}

// Um "stream" assíncrono: busca uma página por vez na API e entrega item a item
static async IAsyncEnumerable&lt;int&gt; BuscarPedidosAsync([EnumeratorCancellation] CancellationToken ct = default)
{
    for (int pagina = 1; pagina &lt;= 10; pagina++)
    {
        if (ct.IsCancellationRequested)
        {
            Console.WriteLine($"(página {pagina} nem foi buscada)");
            yield break;
        }
        Console.WriteLine($"Buscando página {pagina}...");
        await Task.Delay(100, CancellationToken.None);   // simula a chamada HTTP
        for (int i = 1; i &lt;= 3; i++)
            yield return (pagina - 1) * 3 + i;
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Buscando página 1...
   processando pedido 1
   processando pedido 2
   processando pedido 3
Buscando página 2...
   processando pedido 4
   processando pedido 5
Achei o que eu queria: cancelando o resto
   processando pedido 6
(página 3 nem foi buscada)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Os pedidos são processados assim que cada página chega. Quem consome não espera as 10 páginas.</li>
  <li><code>[EnumeratorCancellation]</code> liga o token passado ao <code>BuscarPedidosAsync</code> ao cancelamento do <code>await foreach</code>.</li>
  <li>Ao cancelar no pedido 5, o pedido 6 ainda é processado, porque já tinha vindo na página 2. Mas a página 3 nem é buscada: economia de rede, banco e memória.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// No ASP.NET Core, devolver IAsyncEnumerable faz a resposta JSON ser enviada em streaming
app.MapGet("/pedidos", (AppDbContext db, CancellationToken ct) =&gt;
    db.Pedidos.AsNoTracking().OrderBy(p =&gt; p.Id).AsAsyncEnumerable());</code></pre>
</div>

<h2>3.3 Cancelamento e Resiliência</h2>

<p>Em produção, operações demoram, clientes desistem e serviços caem. Código sênior trata isso como parte do fluxo normal: <strong>cancela</strong> o que não é mais necessário e <strong>resiste</strong> a falhas temporárias sem derrubar o sistema inteiro.</p>

<h3>3.3.1 CancellationToken — Propagação e Linked Tokens</h3>

<p class="step-label">📘 O conceito</p>
<p>Um <code>CancellationToken</code> é um sinal de "pode parar". Quem quer cancelar tem o <code>CancellationTokenSource</code>; quem executa recebe o token e o <strong>repassa</strong> para todas as operações que chama. O cancelamento é <strong>cooperativo</strong>: nada é interrompido à força, então cada método precisa aceitar o token e verificá-lo.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Cancelar o pedido no app de delivery</div>
  <p>Você cancela o pedido no aplicativo. O restaurante recebe o aviso e para de preparar — mas só se alguém na cozinha olhar a tela. Se o cozinheiro nunca olha (não checa o token), o prato fica pronto à toa. E o pedido pode ser cancelado por você <em>ou</em> pelo restaurante fechando: são dois sinais combinados num só (o <em>linked token</em>).</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Diagnostics;

// 1) Timeout: o token é cancelado sozinho depois de 300 ms
using (var timeout = new CancellationTokenSource(TimeSpan.FromMilliseconds(300)))
{
    try
    {
        await RelatorioLentoAsync(timeout.Token);
    }
    catch (OperationCanceledException) when (timeout.IsCancellationRequested)
    {
        Console.WriteLine("1) Timeout: o relatório foi interrompido após 300 ms");
    }
}

// 2) Linked token: cancela se QUALQUER um dos dois pedir (usuário OU desligamento da aplicação)
using var usuario = new CancellationTokenSource();
using var desligamento = new CancellationTokenSource();
using var combinado = CancellationTokenSource.CreateLinkedTokenSource(usuario.Token, desligamento.Token);
desligamento.CancelAfter(200);   // a aplicação está sendo desligada
try
{
    await RelatorioLentoAsync(combinado.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine($"2) Linked: cancelado pelo {(desligamento.IsCancellationRequested ? "desligamento da app" : "usuário")}");
}

// 3) Cancelamento é COOPERATIVO: código de CPU precisa checar o token
using var cpu = new CancellationTokenSource(TimeSpan.FromMilliseconds(100));
var relogio = Stopwatch.StartNew();
long somados = 0;
try
{
    for (long i = 0; i &lt; long.MaxValue; i++)
    {
        if (i % 1_000_000 == 0) cpu.Token.ThrowIfCancellationRequested();   // o ponto de checagem
        somados++;
    }
}
catch (OperationCanceledException)
{
    Console.WriteLine($"3) Laço de CPU parou em ~{relogio.ElapsedMilliseconds / 100 * 100} ms, porque checou o token");
}

static async Task RelatorioLentoAsync(CancellationToken ct)
{
    for (int etapa = 1; etapa &lt;= 10; etapa++)
        await Task.Delay(100, ct);   // repassar o token é o que permite interromper a espera
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>1) Timeout: o relatório foi interrompido após 300 ms
2) Linked: cancelado pelo desligamento da app
3) Laço de CPU parou em ~100 ms, porque checou o token</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>new CancellationTokenSource(TimeSpan)</code> cancela sozinho após o tempo — o jeito mais simples de colocar um timeout.</li>
  <li><code>CreateLinkedTokenSource(a, b)</code> gera um token que cancela quando <em>qualquer</em> um dos dois cancelar: o cliente desistiu <em>ou</em> a aplicação está desligando.</li>
  <li>O laço de CPU só para porque chama <code>ThrowIfCancellationRequested()</code> de tempos em tempos. Sem essa linha, ele ignoraria o cancelamento.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// No ASP.NET Core, o token da requisição é cancelado quando o cliente desconecta
app.MapGet("/relatorio", async (IRelatorioService servico, CancellationToken ct) =&gt;
{
    var dados = await servico.GerarAsync(ct);   // repasse o token até o banco / HttpClient
    return Results.Ok(dados);
});</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Aceite um <code>CancellationToken</code> em todo método assíncrono e repasse-o adiante: cancelar é cooperativo, e só funciona se todos colaborarem.</p>
</div>

<h3>3.3.2 Polly v8 — Retry e Circuit Breaker</h3>

<p class="step-label">📘 O conceito</p>
<ul><li><strong>Retry</strong> (nova tentativa): falhas <em>temporárias</em> (um timeout, um 503) muitas vezes se resolvem sozinhas. Tente de novo, esperando cada vez mais (<em>backoff exponencial</em>) e com um pouco de aleatoriedade (<em>jitter</em>) para que milhares de clientes não tentem todos no mesmo milissegundo.</li><li><strong>Circuit breaker</strong> (disjuntor): se um serviço está <em>fora do ar</em>, insistir só piora — para ele e para você, que fica esperando timeouts. Depois de muitas falhas, o disjuntor "abre" e passa a falhar na hora; depois de um tempo, deixa uma chamada de teste passar.</li></ul>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A linha ocupada e o disjuntor de casa</div>
  <p><strong>Retry:</strong> a linha deu ocupado? Você liga de novo em 1 minuto, depois em 2, depois em 4 — não fica apertando "rediscar" sem parar. <strong>Circuit breaker:</strong> quando há um curto-circuito, o disjuntor de casa desarma e corta a energia daquele circuito na hora, para não pegar fogo. Depois que o problema é resolvido, você religa — e, se ainda houver curto, ele desarma de novo.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
stateDiagram-v2
    direction LR
    [*] --&gt; Fechado
    Fechado --&gt; Aberto: muitas falhas
    Aberto --&gt; MeioAberto: após BreakDuration
    MeioAberto --&gt; Fechado: chamada de teste OK
    MeioAberto --&gt; Aberto: chamada de teste falhou
    note right of Aberto: chamadas bloqueadas na hora
  </pre>
  <figcaption>Os três estados do circuit breaker.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Polly.Core --version 8.8.0</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using Polly;
using Polly.CircuitBreaker;
using Polly.Retry;

// ── 1) RETRY: um serviço instável que falha 2 vezes e depois responde ──
int tentativasDoInstavel = 0;
var comRetry = new ResiliencePipelineBuilder()
    .AddRetry(new RetryStrategyOptions
    {
        ShouldHandle = new PredicateBuilder().Handle&lt;HttpRequestException&gt;(),
        MaxRetryAttempts = 3,
        Delay = TimeSpan.FromMilliseconds(100),
        BackoffType = DelayBackoffType.Exponential,   // 100 ms, 200 ms, 400 ms...
        UseJitter = false,                            // em produção: true (evita todos tentarem juntos)
        OnRetry = args =&gt;
        {
            Console.WriteLine($"   tentativa {args.AttemptNumber + 1} falhou; nova tentativa em {args.RetryDelay.TotalMilliseconds} ms");
            return ValueTask.CompletedTask;
        },
    })
    .Build();

string resposta = await comRetry.ExecuteAsync(async _ =&gt;
{
    await Task.Yield();
    if (++tentativasDoInstavel &lt;= 2) throw new HttpRequestException("503 Service Unavailable");
    return "200 OK";
});
Console.WriteLine($"Retry: {resposta} depois de {tentativasDoInstavel} tentativas");
Console.WriteLine();

// ── 2) CIRCUIT BREAKER: um serviço fora do ar ──
var comDisjuntor = new ResiliencePipelineBuilder()
    .AddCircuitBreaker(new CircuitBreakerStrategyOptions
    {
        ShouldHandle = new PredicateBuilder().Handle&lt;HttpRequestException&gt;(),
        FailureRatio = 0.5,                          // abre se 50% ou mais falharem...
        MinimumThroughput = 4,                       // ...considerando pelo menos 4 chamadas
        SamplingDuration = TimeSpan.FromSeconds(10),
        BreakDuration = TimeSpan.FromSeconds(30),    // fica aberto por 30 s
        OnOpened = _ =&gt; { Console.WriteLine("   &gt;&gt;&gt; disjuntor ABRIU: parando de chamar o serviço"); return ValueTask.CompletedTask; },
    })
    .Build();

int chamadasReais = 0;
for (int i = 1; i &lt;= 7; i++)
{
    try
    {
        await comDisjuntor.ExecuteAsync(async _ =&gt;
        {
            chamadasReais++;
            await Task.Yield();
            throw new HttpRequestException("timeout");
        });
    }
    catch (BrokenCircuitException)
    {
        Console.WriteLine($"Chamada {i}: bloqueada na hora (falha rápida, sem esperar o serviço)");
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"Chamada {i}: falhou ({ex.Message})");
    }
}
Console.WriteLine($"O serviço recebeu só {chamadasReais} das 7 chamadas");</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>   tentativa 1 falhou; nova tentativa em 100 ms
   tentativa 2 falhou; nova tentativa em 200 ms
Retry: 200 OK depois de 3 tentativas

Chamada 1: falhou (timeout)
Chamada 2: falhou (timeout)
Chamada 3: falhou (timeout)
   &gt;&gt;&gt; disjuntor ABRIU: parando de chamar o serviço
Chamada 4: falhou (timeout)
Chamada 5: bloqueada na hora (falha rápida, sem esperar o serviço)
Chamada 6: bloqueada na hora (falha rápida, sem esperar o serviço)
Chamada 7: bloqueada na hora (falha rápida, sem esperar o serviço)
O serviço recebeu só 4 das 7 chamadas</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>O serviço "instável" falha duas vezes. O retry espera 100 ms e depois 200 ms (exponencial) e, na terceira tentativa, recebe o "200 OK". Quem chamou nem percebe as falhas.</li>
  <li>No serviço "fora do ar", depois de 4 chamadas com 100% de falha (<code>MinimumThroughput = 4</code>, <code>FailureRatio = 0.5</code>), o disjuntor abre.</li>
  <li>Com o disjuntor aberto, as chamadas seguintes lançam <code>BrokenCircuitException</code> <em>imediatamente</em>: o serviço doente para de receber carga e o seu sistema para de esperar timeouts.</li>
  <li><code>UseJitter = false</code> só para a saída ser previsível. Em produção, deixe <code>true</code>.</li>
</ul>

<p class="step-label">🧑‍💻 Em uma aplicação real</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Pacote Microsoft.Extensions.Http.Resilience: retry + circuit breaker + timeouts prontos
builder.Services.AddHttpClient&lt;ICatalogoClient, CatalogoClient&gt;(c =&gt;
        c.BaseAddress = new Uri("https://catalogo.interno"))
    .AddStandardResilienceHandler(opcoes =&gt;
    {
        opcoes.Retry.MaxRetryAttempts = 3;
        opcoes.CircuitBreaker.FailureRatio = 0.5;
        opcoes.TotalRequestTimeout.Timeout = TimeSpan.FromSeconds(30);
    });</code></pre>
</div>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Retry só para o que é seguro repetir</div>
  <p>Repetir um <code>GET</code> é seguro. Repetir um "cobrar cartão" que deu timeout <em>depois</em> de o servidor processar pode cobrar duas vezes. Retry em operações que alteram dados exige <strong>idempotência</strong> (Capítulo 7.1.2).</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Retry resolve falhas passageiras, e o circuit breaker protege todo mundo quando a falha não é passageira.</p>
</div>

<div class="challenge-box">
  <div class="challenge-box-header">
    <span class="challenge-box-icon">🎯</span>
    <span class="challenge-box-title">Desafio Prático — Capítulo 3</span>
  </div>
  <p>Construa um <strong>processador de jobs</strong> num único <code>Program.cs</code>, juntando as peças do capítulo:</p>
  <ol>
    <li>Um <code>Channel&lt;Job&gt;</code> limitado a 50 itens, com 3 produtores e 5 consumidores (3.2.3).</li>
    <li>Cada job chama um "serviço" que falha aleatoriamente em 30% das vezes; proteja-o com retry exponencial e circuit breaker (3.3.2).</li>
    <li>Um <code>CancellationTokenSource</code> que encerra tudo de forma limpa após 10 segundos, sem perder jobs já retirados da fila (3.3.1).</li>
    <li>Contadores com <code>Interlocked</code> para jobs processados, com retry e descartados; ao final, imprima o throughput (jobs/s) (3.2.2).</li>
  </ol>
  <p>Bônus: registre o tempo de cada job e calcule os percentis P50, P95 e P99.</p>
</div>
`
},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 4 — ASP.NET CORE
══════════════════════════════════════════════════════════ */
{
  id: 4, slug: 'aspnet-core', icon: '🌐', color: '#10b981',
  title: 'ASP.NET Core Avançado',
  subtitle: 'Pipeline, DI, Segurança, Minimal APIs e Performance',
  desc: 'Pipeline de middleware, Problem Details, lifetimes e keyed services, JWT, policies, Minimal APIs, Output Cache e Rate Limiting — cada tema com uma API executável que se testa sozinha.',
  tags: ['Middleware','DI','JWT','Authorization','Minimal APIs'],
  readTime: 45,
  intro: `ASP.NET Core é um framework, não uma caixa-preta. Entender o pipeline de middleware é a diferença
    entre configurar e compreender. Cada requisição HTTP passa por uma cadeia de componentes
    configuráveis — a ordem importa, os lifetimes importam, e a segurança precisa ser projetada,
    não adicionada no fim. Cada exemplo deste capítulo é uma API que sobe e se testa sozinha.`,
  content: `
<div class="info-box info">
  <div class="info-box-label">🧭 Como estudar este capítulo</div>
  <p>Os programas deste capítulo são APIs completas que <strong>sobem o próprio servidor e fazem as requisições sozinhas</strong>, mostrando no console o que o cliente recebe. Para rodar: <code>dotnet new web -n Exemplo</code>, substitua o <code>Program.cs</code> e execute <code>dotnet run</code>. Numa API de verdade, você faria essas mesmas chamadas com o navegador, <code>curl</code>, Postman ou o arquivo <code>.http</code> do Visual Studio.</p>
</div>

<h2>4.1 Pipeline de Middleware</h2>

<p class="step-label">📘 O conceito</p>
<p>Toda requisição HTTP atravessa uma <strong>fila de componentes</strong> — os <em>middlewares</em> — antes de chegar ao seu código (o <em>endpoint</em>). Cada middleware pode fazer algo na ida, chamar o próximo (<code>await next()</code>), fazer algo na volta — ou <strong>encerrar a requisição ali mesmo</strong> (curto-circuito). A ordem em que você os registra no <code>Program.cs</code> é a ordem em que eles executam.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O Controle do Aeroporto</div>
  <p>Todo passageiro (request) passa pelas mesmas etapas, sempre na mesma ordem: check-in, raio-X, imigração e, só então, o portão de embarque (seu endpoint). Qualquer etapa pode barrar o passageiro na hora — sem passaporte, ele nem chega ao portão. Na volta (response), o caminho é percorrido ao contrário.</p>
  <p>Por isso a <strong>ordem</strong> importa: se o portão ficasse antes do raio-X, alguém embarcaria sem ser revistado. No ASP.NET Core, colocar <code>UseAuthorization()</code> antes de <code>UseAuthentication()</code> é exatamente isso: a pergunta "pode entrar?" é feita antes de saber "quem é você?".</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 240" role="img" aria-label="Pipeline de middleware: a requisição passa em ordem por Exceptions, HTTPS, Routing, Authentication, Authorization e chega ao Endpoint; a resposta volta pelo caminho inverso; a autenticação pode encerrar a requisição cedo com 401">
    <defs><marker id="c4-arr-mw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c4-arr-mw-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <path class="line" d="M20,40 L688,40" marker-end="url(#c4-arr-mw)"/>
    <text x="20" y="30" font-weight="600">Request →</text>
    <rect class="box" x="20" y="62" width="100" height="62" rx="8"/><text x="70" y="88" text-anchor="middle" font-weight="600">Exceptions</text><text class="t-muted" x="70" y="108" text-anchor="middle">captura erros</text>
    <path class="line" d="M120,93 L134,93"/>
    <rect class="box" x="134" y="62" width="100" height="62" rx="8"/><text x="184" y="88" text-anchor="middle" font-weight="600">HTTPS</text><text class="t-muted" x="184" y="108" text-anchor="middle">redireciona</text>
    <path class="line" d="M234,93 L248,93"/>
    <rect class="box" x="248" y="62" width="100" height="62" rx="8"/><text x="298" y="88" text-anchor="middle" font-weight="600">Routing</text><text class="t-muted" x="298" y="108" text-anchor="middle">acha endpoint</text>
    <path class="line" d="M348,93 L362,93"/>
    <rect class="box" x="362" y="62" width="100" height="62" rx="8"/><text x="412" y="88" text-anchor="middle" font-weight="600">AuthN</text><text class="t-muted" x="412" y="108" text-anchor="middle">quem é você?</text>
    <path class="line" d="M462,93 L476,93"/>
    <rect class="box" x="476" y="62" width="100" height="62" rx="8"/><text x="526" y="88" text-anchor="middle" font-weight="600">AuthZ</text><text class="t-muted" x="526" y="108" text-anchor="middle">pode entrar?</text>
    <path class="line" d="M576,93 L590,93"/>
    <rect class="box-accent" x="590" y="62" width="100" height="62" rx="8"/><text x="640" y="88" text-anchor="middle" font-weight="600">Endpoint</text><text class="t-muted" x="640" y="108" text-anchor="middle">seu código</text>
    <path class="line" d="M690,150 L22,150" marker-end="url(#c4-arr-mw)"/>
    <text x="690" y="172" text-anchor="end" font-weight="600">← Response (mesmo caminho, na ordem inversa)</text>
    <path class="line-bad" d="M412,124 L412,205 L24,205" marker-end="url(#c4-arr-mw-bad)"/>
    <text class="t-bad" x="424" y="200">sem token → 401 e volta daqui</text>
    <text class="t-muted" x="424" y="220">curto-circuito: AuthZ e o endpoint nem executam</text>
  </svg>
  <figcaption>Cada middleware decide: faz algo, chama o próximo (<code>await next()</code>) ou encerra a requisição ali mesmo.</figcaption>
</figure>

<h3>4.1.1 A Ordem Importa</h3>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();                  // console limpo: só as nossas mensagens
var app = builder.Build();

// Middleware 1: registra a ENTRADA e a SAÍDA de cada requisição
app.Use(async (contexto, proximo) =&gt;
{
    Console.WriteLine($"  -&gt; [1 Log] entrou: {contexto.Request.Path}");
    await proximo(contexto);   // passa a requisição para o próximo da fila
    Console.WriteLine($"  &lt;- [1 Log] saiu com status {contexto.Response.StatusCode}");
});

// Middleware 2: exige uma chave; sem ela, a requisição termina AQUI (curto-circuito)
app.Use(async (contexto, proximo) =&gt;
{
    if (!contexto.Request.Headers.ContainsKey("X-Api-Key"))
    {
        Console.WriteLine("     [2 Chave] sem chave: devolve 401 e NÃO chama o próximo");
        contexto.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return;
    }
    Console.WriteLine("     -&gt; [2 Chave] chave ok");
    await proximo(contexto);
    Console.WriteLine("     &lt;- [2 Chave] voltando");
});

// O endpoint: o "portão de embarque"
app.MapGet("/pedidos", () =&gt;
{
    Console.WriteLine("        [Endpoint] executando o seu código");
    return "lista de pedidos";
});

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };

Console.WriteLine("Requisição COM chave:");
var comChave = new HttpRequestMessage(HttpMethod.Get, "/pedidos");
comChave.Headers.Add("X-Api-Key", "segredo");
await http.SendAsync(comChave);

Console.WriteLine("Requisição SEM chave:");
await http.GetAsync("/pedidos");

await app.StopAsync();</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Requisição COM chave:
  -&gt; [1 Log] entrou: /pedidos
     -&gt; [2 Chave] chave ok
        [Endpoint] executando o seu código
     &lt;- [2 Chave] voltando
  &lt;- [1 Log] saiu com status 200
Requisição SEM chave:
  -&gt; [1 Log] entrou: /pedidos
     [2 Chave] sem chave: devolve 401 e NÃO chama o próximo
  &lt;- [1 Log] saiu com status 401</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>app.Use(async (contexto, proximo) =&gt; ...)</code> cria um middleware em linha. Tudo antes de <code>await proximo(contexto)</code> roda na ida, e tudo depois, na volta.</li>
  <li>Com chave, a saída mostra a "cebola": entra no 1, entra no 2, executa o endpoint, volta pelo 2 e volta pelo 1.</li>
  <li>Sem chave, o middleware 2 define o status 401 e <em>não</em> chama o próximo: o endpoint nem roda. É exatamente isso que <code>UseAuthentication</code>/<code>UseAuthorization</code> fazem com requisições não autorizadas.</li>
</ul>

<p class="step-label">🧑‍💻 A ordem recomendada numa API real</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var app = builder.Build();

app.UseExceptionHandler();       // 1. PRIMEIRO: captura erros de tudo que vem depois
if (!app.Environment.IsDevelopment())
    app.UseHsts();               // 2. Cabeçalho HSTS (só fora do ambiente de desenvolvimento)
app.UseHttpsRedirection();       // 3. HTTP → HTTPS
app.UseStaticFiles();            // 4. Arquivos estáticos respondem cedo, sem passar pela autenticação
app.UseRouting();                // 5. Descobre QUAL endpoint vai atender
app.UseCors("MeuFrontend");      // 6. CORS: depois do Routing e ANTES da autenticação
app.UseAuthentication();         // 7. "Quem é você?"
app.UseAuthorization();          // 8. "Você pode acessar este endpoint?"
app.UseRateLimiter();            // 9. Limites de uso (4.4.2)
app.UseOutputCache();            // 10. Cache de respostas (4.4.2)

app.MapControllers();            // os endpoints
app.MapHealthChecks("/healthz");
app.Run();</code></pre>
</div>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Os erros de ordem mais comuns</div>
  <ul><li><code>UseAuthorization</code> antes de <code>UseAuthentication</code>: a autorização roda sem saber quem é o usuário, e tudo vira 401/403.</li><li><code>UseExceptionHandler</code> no meio da lista: erros dos middlewares anteriores a ele não são capturados.</li><li><code>UseCors</code> depois da autenticação: as requisições de <em>preflight</em> do navegador (<code>OPTIONS</code>) são barradas antes de receber os cabeçalhos de CORS.</li></ul><p>Na hospedagem mínima (.NET 6+), <code>UseRouting</code> é adicionado automaticamente no início se você não chamar. Chame explicitamente quando precisar controlar a posição, como no caso do CORS.</p>
</div>

<h3>4.1.2 Middleware Customizado</h3>

<p class="step-label">📘 O conceito</p>
<p>Para lógica reutilizável que vale para <em>toda</em> requisição — correlation id, tempo de resposta, cabeçalhos de segurança, auditoria —, crie um middleware em classe. Há dois estilos: <strong>por convenção</strong> (recebe o <code>RequestDelegate</code> no construtor; é criado uma vez, como singleton) e <strong><code>IMiddleware</code></strong> (criado pelo contêiner de DI a cada requisição, o que permite injetar serviços <em>scoped</em>).</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O carimbo de protocolo</div>
  <p>Em uma repartição, todo documento que entra recebe um número de protocolo no balcão. Qualquer setor por onde ele passe usa esse número, e quando você liga para perguntar, basta informá-lo. O <em>correlation id</em> é esse protocolo: o middleware carimba cada requisição, e o número aparece em todos os logs — inclusive nos de outros serviços que ela chamar.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();                  // console limpo: só as nossas mensagens
builder.Services.AddTransient&lt;CorrelationIdMiddleware&gt;();   // IMiddleware precisa estar registrado no DI

var app = builder.Build();
app.UseMiddleware&lt;CorrelationIdMiddleware&gt;();
app.UseMiddleware&lt;TempoDeRespostaMiddleware&gt;();
app.MapGet("/rapido", () =&gt; "ok");
app.MapGet("/lento", async () =&gt; { await Task.Delay(600); return "ok, mas demorou"; });

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };

var semId = await http.GetAsync("/rapido");
string gerado = semId.Headers.GetValues("X-Correlation-Id").First();
Console.WriteLine($"Sem id enviado -&gt; o servidor gerou um GUID novo ({gerado.Length} caracteres)");

var comId = new HttpRequestMessage(HttpMethod.Get, "/rapido");
comId.Headers.Add("X-Correlation-Id", "pedido-123");
var resposta = await http.SendAsync(comId);
Console.WriteLine($"Com id enviado -&gt; o servidor devolveu o mesmo: {resposta.Headers.GetValues("X-Correlation-Id").First()}");

var lento = new HttpRequestMessage(HttpMethod.Get, "/lento");
lento.Headers.Add("X-Correlation-Id", "pedido-456");
await http.SendAsync(lento);

await app.StopAsync();

// IMiddleware: criado pelo contêiner de DI, então pode receber dependências no construtor
public class CorrelationIdMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext contexto, RequestDelegate proximo)
    {
        string id = contexto.Request.Headers["X-Correlation-Id"].FirstOrDefault() ?? Guid.NewGuid().ToString();
        contexto.Items["CorrelationId"] = id;               // disponível para o resto da requisição
        contexto.Response.Headers["X-Correlation-Id"] = id; // e devolvido ao cliente
        await proximo(contexto);
    }
}

// Middleware "por convenção": recebe o próximo no construtor e expõe InvokeAsync
public class TempoDeRespostaMiddleware(RequestDelegate proximo)
{
    public async Task InvokeAsync(HttpContext contexto)
    {
        var relogio = Stopwatch.StartNew();
        await proximo(contexto);
        if (relogio.ElapsedMilliseconds &gt; 500)
            Console.WriteLine($"[ALERTA] {contexto.Request.Path} passou de 500 ms (correlation id: {contexto.Items["CorrelationId"]})");
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Sem id enviado -&gt; o servidor gerou um GUID novo (36 caracteres)
Com id enviado -&gt; o servidor devolveu o mesmo: pedido-123
[ALERTA] /lento passou de 500 ms (correlation id: pedido-456)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>CorrelationIdMiddleware</code> reaproveita o id enviado pelo cliente (ou por outro serviço) ou gera um novo, guarda em <code>HttpContext.Items</code> e devolve no cabeçalho da resposta.</li>
  <li><code>TempoDeRespostaMiddleware</code> mede quanto a requisição levou; como vem depois do de correlation id, já encontra o id disponível para o alerta.</li>
  <li>Em produção, em vez de <code>Console.WriteLine</code>, use <code>ILogger</code> com <code>BeginScope</code>: o correlation id vai automaticamente para todas as linhas de log da requisição.</li>
</ul>

<h3>4.1.3 Tratamento de Erros com Problem Details</h3>

<p class="step-label">📘 O conceito</p>
<p>Uma API profissional nunca devolve uma página de erro em HTML ou um <em>stack trace</em>. Ela responde com um JSON padronizado, o <strong>Problem Details</strong> (RFC 9457), com <code>status</code>, <code>title</code>, <code>detail</code> e um <code>traceId</code> para localizar o erro nos logs. No .NET 8+, a forma recomendada é um <code>IExceptionHandler</code> — um único lugar que traduz exceções em respostas HTTP.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O formulário padrão do SAC</div>
  <p>Não importa se o problema foi entrega atrasada, cobrança errada ou produto com defeito: o SAC registra tudo no mesmo formulário (protocolo, tipo, descrição) — e nunca repassa ao cliente os e-mails internos da empresa. O Problem Details é esse formulário, e o <code>IExceptionHandler</code> é o atendente que o preenche.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();                  // console limpo: só as nossas mensagens
// Respostas de erro no formato padrão (RFC 9457), com o traceId para achar o erro nos logs
builder.Services.AddProblemDetails(o =&gt; o.CustomizeProblemDetails = c =&gt;
    c.ProblemDetails.Extensions["traceId"] = c.HttpContext.TraceIdentifier);
builder.Services.AddExceptionHandler&lt;TradutorDeExcecoes&gt;();  // .NET 8+

var app = builder.Build();
app.UseExceptionHandler();   // o PRIMEIRO do pipeline: pega erros de todos que vêm depois

app.MapGet("/produtos/{id:int}", (int id) =&gt;
    id == 1 ? Results.Ok(new { Id = 1, Nome = "Teclado" }) : throw new NaoEncontradoException($"Produto {id} não existe."));
app.MapPost("/produtos", () =&gt; { throw new RegraDeNegocioException("O preço não pode ser negativo."); });
app.MapGet("/bug", () =&gt; { throw new InvalidOperationException("string de conexão: Server=db;Password=123"); });

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };

foreach (var (metodo, url) in new[] { ("GET", "/produtos/1"), ("GET", "/produtos/99"), ("POST", "/produtos"), ("GET", "/bug") })
{
    var resposta = await http.SendAsync(new HttpRequestMessage(new HttpMethod(metodo), url));
    string corpo = await resposta.Content.ReadAsStringAsync();
    Console.WriteLine($"{metodo,-4} {url,-12} -&gt; {(int)resposta.StatusCode} {Resumo(corpo)}");
}
await app.StopAsync();

static string Resumo(string json)
{
    var raiz = JsonDocument.Parse(json).RootElement;
    if (!raiz.TryGetProperty("title", out var titulo)) return json;
    string detalhe = raiz.TryGetProperty("detail", out var d) ? d.GetString()! : "(sem detalhe)";
    return $"| {titulo.GetString()} | {detalhe} | traceId? {raiz.TryGetProperty("traceId", out _)}";
}

public class NaoEncontradoException(string mensagem) : Exception(mensagem);
public class RegraDeNegocioException(string mensagem) : Exception(mensagem);

// Traduz exceções conhecidas em respostas HTTP padronizadas — num lugar só
public class TradutorDeExcecoes(IProblemDetailsService problemDetails) : IExceptionHandler
{
    public async ValueTask&lt;bool&gt; TryHandleAsync(HttpContext contexto, Exception excecao, CancellationToken ct)
    {
        (int status, string titulo, string? detalhe) = excecao switch
        {
            NaoEncontradoException e  =&gt; (404, "Recurso não encontrado", e.Message),
            RegraDeNegocioException e =&gt; (422, "Regra de negócio violada", e.Message),
            _                         =&gt; (500, "Erro interno", null),   // nunca vaza detalhes internos
        };
        contexto.Response.StatusCode = status;
        return await problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = contexto,
            ProblemDetails = { Status = status, Title = titulo, Detail = detalhe },
            Exception = excecao,
        });
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>GET  /produtos/1  -&gt; 200 {"id":1,"nome":"Teclado"}
GET  /produtos/99 -&gt; 404 | Recurso não encontrado | Produto 99 não existe. | traceId? True
POST /produtos    -&gt; 422 | Regra de negócio violada | O preço não pode ser negativo. | traceId? True
GET  /bug         -&gt; 500 | Erro interno | (sem detalhe) | traceId? True</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>AddProblemDetails()</code> e <code>UseExceptionHandler()</code> transformam qualquer exceção não tratada em uma resposta JSON padronizada.</li>
  <li><code>TradutorDeExcecoes</code> mapeia exceções de negócio para os status certos: 404 para "não encontrado" e 422 para "regra violada".</li>
  <li>A exceção inesperada (<code>/bug</code>) vira um 500 genérico, <strong>sem</strong> o detalhe: a senha da string de conexão nunca chega ao cliente.</li>
  <li><code>CustomizeProblemDetails</code> acrescenta o <code>traceId</code> em todas as respostas de erro. Com ele, o suporte acha nos logs a exceção completa daquela requisição.</li>
</ul>

<p>Em APIs com controllers (MVC), os <strong>filtros</strong> (<code>IActionFilter</code>, <code>IExceptionFilter</code>) atuam em volta das actions; nas Minimal APIs, o equivalente são os <em>endpoint filters</em> (4.4.1). Para tratamento de erros, prefira o <code>IExceptionHandler</code>, que funciona para os dois estilos.</p>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Middlewares formam uma fila em que a ordem é a regra: erros primeiro, depois roteamento, CORS, autenticação e autorização, e por fim os endpoints.</p>
</div>

<h2>4.2 Injeção de Dependência Avançada</h2>

<p class="step-label">📘 O conceito</p>
<p>No ASP.NET Core, as classes não criam suas dependências com <code>new</code>: elas as <strong>pedem no construtor</strong>, e o contêiner de DI entrega (é o DIP do Capítulo 2.2.5 na prática). Ao registrar um serviço, você escolhe o seu <strong>tempo de vida</strong>:</p>

<table>
  <thead><tr><th>Lifetime</th><th>Uma instância por…</th><th>Cuidado</th><th>Exemplos</th></tr></thead>
  <tbody>
    <tr><td><code>Singleton</code></td><td>aplicação inteira</td><td>Precisa ser thread-safe; nunca guarde dados de um usuário</td><td>Configuração, caches, <code>HttpClient</code> via factory</td></tr>
    <tr><td><code>Scoped</code></td><td>requisição HTTP</td><td>Não pode ser injetado num Singleton</td><td><code>DbContext</code>, unidade de trabalho, usuário atual</td></tr>
    <tr><td><code>Transient</code></td><td>cada vez que é pedido</td><td>Custo de criação, se for pesado</td><td>Serviços leves e sem estado</td></tr>
  </tbody>
</table>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Geladeira, bandeja e copo descartável</div>
  <p>No refeitório da empresa, a <strong>geladeira</strong> é uma só, para todos, o tempo todo (Singleton) — então ninguém deve deixar nada pessoal lá. A <strong>bandeja</strong> é sua durante uma refeição e volta para a pilha no fim (Scoped). O <strong>copo descartável</strong> é novo a cada vez que você pega um (Transient).</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="Linha do tempo de duas requisições: o Singleton é a mesma instância nas duas; o Scoped é uma instância por requisição; o Transient é uma instância nova a cada vez que é pedido">
    <defs><marker id="c4d1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c4d1-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c4d1-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="panel" x="150" y="14" width="270" height="190" rx="12"/>
    <text class="t-title" x="285" y="36" text-anchor="middle">Requisição 1</text>
    <rect class="panel" x="440" y="14" width="270" height="190" rx="12"/>
    <text class="t-title" x="575" y="36" text-anchor="middle">Requisição 2</text>
    <text class="t-mono" x="10" y="80">Singleton</text>
    <text class="t-mono" x="10" y="134">Scoped</text>
    <text class="t-mono" x="10" y="188">Transient</text>
    <rect class="box-accent" x="160" y="50" width="540" height="40" rx="8"/>
    <text x="430.0" y="75.0" text-anchor="middle" font-weight="600">#1 — a mesma instância para todos, a vida toda</text>
    <rect class="box-warn" x="160" y="104" width="250" height="40" rx="8"/>
    <text x="285.0" y="129.0" text-anchor="middle" font-weight="600">#1 (compartilhada na requisição)</text>
    <rect class="box-warn" x="450" y="104" width="250" height="40" rx="8"/>
    <text x="575.0" y="129.0" text-anchor="middle" font-weight="600">#2</text>
    <rect class="box-good" x="160" y="158" width="120" height="40" rx="8"/>
    <text x="220.0" y="183.0" text-anchor="middle" font-weight="600">#1</text>
    <rect class="box-good" x="290" y="158" width="120" height="40" rx="8"/>
    <text x="350.0" y="183.0" text-anchor="middle" font-weight="600">#2</text>
    <rect class="box-good" x="450" y="158" width="120" height="40" rx="8"/>
    <text x="510.0" y="183.0" text-anchor="middle" font-weight="600">#3</text>
    <rect class="box-good" x="580" y="158" width="120" height="40" rx="8"/>
    <text x="640.0" y="183.0" text-anchor="middle" font-weight="600">#4</text>
    <text class="t-muted" x="10" y="236">Regra: um serviço só pode depender de outros que vivam tanto quanto ele, ou mais.</text>
  </svg>
  <figcaption>Os três lifetimes da injeção de dependência.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();                  // console limpo: só as nossas mensagens
builder.Services.AddSingleton&lt;ServicoSingleton&gt;();   // UM para a aplicação inteira
builder.Services.AddScoped&lt;ServicoScoped&gt;();         // UM por requisição
builder.Services.AddTransient&lt;ServicoTransient&gt;();   // um NOVO cada vez que é pedido

var app = builder.Build();

// O endpoint pede cada serviço DUAS vezes (dois parâmetros do mesmo tipo)
app.MapGet("/ids", (ServicoSingleton s1, ServicoSingleton s2,
                    ServicoScoped sc1, ServicoScoped sc2,
                    ServicoTransient t1, ServicoTransient t2) =&gt;
    $"Singleton {s1.Id}/{s2.Id} | Scoped {sc1.Id}/{sc2.Id} | Transient {t1.Id}/{t2.Id}");

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };
Console.WriteLine("Requisição 1: " + await http.GetStringAsync("/ids"));
Console.WriteLine("Requisição 2: " + await http.GetStringAsync("/ids"));
await app.StopAsync();

// Cada classe numera as próprias instâncias, para vermos quando uma nova é criada
public class ServicoSingleton { private static int _criados; public int Id { get; } = ++_criados; }
public class ServicoScoped    { private static int _criados; public int Id { get; } = ++_criados; }
public class ServicoTransient { private static int _criados; public int Id { get; } = ++_criados; }</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Requisição 1: Singleton 1/1 | Scoped 1/1 | Transient 1/2
Requisição 2: Singleton 1/1 | Scoped 2/2 | Transient 3/4</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>O Singleton é o nº 1 nas duas requisições: nunca é recriado.</li>
  <li>O Scoped é o mesmo <em>dentro</em> de uma requisição (1/1), mas uma nova instância na seguinte (2/2).</li>
  <li>O Transient é diferente até dentro da mesma requisição (1/2, depois 3/4).</li>
</ul>

<h3>4.2.1 Captive Dependencies e Keyed Services</h3>

<p class="step-label">📘 O conceito</p>
<p>Uma <strong>captive dependency</strong> (dependência "sequestrada") acontece quando um serviço de vida longa recebe um de vida curta: um Singleton que recebe um <code>DbContext</code> (Scoped) passa a usar a <em>mesma</em> conexão para sempre, compartilhada entre requisições e threads — um bug grave e silencioso. As opções <code>ValidateScopes</code>/<code>ValidateOnBuild</code> detectam isso ao iniciar a aplicação.</p><p>Os <strong>keyed services</strong> (.NET 8) permitem registrar várias implementações da mesma interface e escolher uma por chave, sem fábricas manuais.</p>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Microsoft.Extensions.DependencyInjection --version 8.0.1</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
using Microsoft.Extensions.DependencyInjection;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// ── 1) Captive dependency: um Singleton "sequestrando" um Scoped ──
var servicos = new ServiceCollection();
servicos.AddScoped&lt;ConexaoDoBanco&gt;();     // deveria viver só durante uma requisição...
servicos.AddSingleton&lt;CacheDePrecos&gt;();   // ...mas este vive para sempre e a recebe no construtor

try
{
    // O ASP.NET Core liga estas validações sozinho no ambiente Development
    servicos.BuildServiceProvider(new ServiceProviderOptions { ValidateScopes = true, ValidateOnBuild = true });
}
catch (AggregateException ex)
{
    Console.WriteLine("Detectado ao montar o contêiner:");
    Console.WriteLine($"   {ex.InnerExceptions[0].Message}");
}

// ── 2) Keyed services (.NET 8): várias implementações, escolhidas por uma chave ──
var pagamentos = new ServiceCollection();
pagamentos.AddKeyedScoped&lt;IPagamento, PagamentoPix&gt;("pix");
pagamentos.AddKeyedScoped&lt;IPagamento, PagamentoBoleto&gt;("boleto");
pagamentos.AddScoped&lt;Checkout&gt;();

using var provedor = pagamentos.BuildServiceProvider();
using var escopo = provedor.CreateScope();   // um escopo = "uma requisição"

Console.WriteLine();
Console.WriteLine(escopo.ServiceProvider.GetRequiredService&lt;Checkout&gt;().Pagar(150m));
foreach (var metodo in new[] { "pix", "boleto" })
    Console.WriteLine(escopo.ServiceProvider.GetRequiredKeyedService&lt;IPagamento&gt;(metodo).Cobrar(99.90m));

public class ConexaoDoBanco;
public class CacheDePrecos(ConexaoDoBanco conexao)
{
    public ConexaoDoBanco Conexao =&gt; conexao;
}

public interface IPagamento { string Cobrar(decimal valor); }
public class PagamentoPix : IPagamento { public string Cobrar(decimal valor) =&gt; $"Pix de {valor:C} gerado (QR Code)"; }
public class PagamentoBoleto : IPagamento { public string Cobrar(decimal valor) =&gt; $"Boleto de {valor:C} emitido"; }

// [FromKeyedServices] escolhe a implementação direto no construtor
public class Checkout([FromKeyedServices("pix")] IPagamento pagamento)
{
    public string Pagar(decimal valor) =&gt; "Checkout -&gt; " + pagamento.Cobrar(valor);
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Detectado ao montar o contêiner:
   Error while validating the service descriptor 'ServiceType: CacheDePrecos Lifetime: Singleton ImplementationType: CacheDePrecos': Cannot consume scoped service 'ConexaoDoBanco' from singleton 'CacheDePrecos'.

Checkout -&gt; Pix de R$ 150,00 gerado (QR Code)
Pix de R$ 99,90 gerado (QR Code)
Boleto de R$ 99,90 emitido</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Com <code>ValidateOnBuild</code>, o erro aparece ao montar o contêiner, na hora em que a aplicação sobe, e não semanas depois em produção.</li>
  <li><code>AddKeyedScoped&lt;IPagamento, PagamentoPix&gt;("pix")</code> registra com uma chave. <code>[FromKeyedServices("pix")]</code> escolhe no construtor, e <code>GetRequiredKeyedService</code> escolhe em tempo de execução (por exemplo, pelo método que o cliente escolheu).</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Ligue as validações também fora de Development (custa um pouco no startup, evita bugs graves)
builder.Host.UseDefaultServiceProvider(o =&gt;
{
    o.ValidateScopes = true;
    o.ValidateOnBuild = true;
});

// Precisa de um serviço Scoped dentro de um Singleton (ex.: um BackgroundService)? Crie um escopo:
public class Limpeza(IServiceScopeFactory escopos) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        using var escopo = escopos.CreateScope();
        var db = escopo.ServiceProvider.GetRequiredService&lt;AppDbContext&gt;();
        await db.Sessoes.Where(s =&gt; s.Expirada).ExecuteDeleteAsync(ct);
    }
}</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Escolha o lifetime pela vida do dado: aplicação (Singleton), requisição (Scoped) ou uso (Transient); e nunca deixe o mais longo segurar o mais curto.</p>
</div>

<h2>4.3 Segurança — Autenticação e Autorização</h2>

<p>Duas perguntas diferentes, que costumam ser confundidas: <strong>autenticação</strong> é "quem é você?" (401 quando falha) e <strong>autorização</strong> é "você pode fazer isso?" (403 quando falha).</p>

<h3>4.3.1 Autenticação com JWT</h3>

<p class="step-label">📘 O conceito</p>
<p>Um <strong>JWT</strong> (JSON Web Token) é um "crachá digital": depois do login, o servidor entrega um texto assinado com os dados do usuário (as <em>claims</em>) e a validade. O cliente envia esse token em cada requisição, no cabeçalho <code>Authorization: Bearer ...</code>. A API só precisa conferir a <strong>assinatura</strong> e a validade — sem consultar o banco a cada chamada. Por isso JWT escala tão bem entre vários servidores.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A pulseira do festival</div>
  <p>Na entrada do festival, você mostra o ingresso e o documento uma única vez e recebe uma pulseira com holograma. Em cada área (palco, camarote, bar), o segurança só olha a pulseira — não liga para a bilheteria. O holograma é a assinatura: dá para ver o que está escrito, mas não dá para falsificar. E a pulseira vale só para aquele dia (a expiração).</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 230" role="img" aria-label="Um JWT tem três partes separadas por ponto: o cabeçalho com o algoritmo, o payload com as claims como nome, papel e expiração, e a assinatura calculada com a chave secreta do servidor">
    <defs><marker id="c4d2-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c4d2-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c4d2-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-bad" x="10" y="40" width="220" height="70" rx="8"/>
    <text x="120.0" y="71.0" text-anchor="middle" font-weight="600">HEADER</text>
    <text class="t-mono t-muted" x="120.0" y="89.0" text-anchor="middle">{"alg":"HS256"}</text>
    <text class="t-muted" x="120" y="134" text-anchor="middle">algoritmo</text>
    <rect class="box-accent" x="250" y="40" width="220" height="70" rx="8"/>
    <text x="360.0" y="71.0" text-anchor="middle" font-weight="600">PAYLOAD</text>
    <text class="t-mono t-muted" x="360.0" y="89.0" text-anchor="middle">{"name":"ana", ...}</text>
    <text class="t-muted" x="360" y="134" text-anchor="middle">claims: quem é, papel, validade</text>
    <rect class="box-good" x="490" y="40" width="220" height="70" rx="8"/>
    <text x="600.0" y="71.0" text-anchor="middle" font-weight="600">SIGNATURE</text>
    <text class="t-mono t-muted" x="600.0" y="89.0" text-anchor="middle">HMAC(h + p, chave)</text>
    <text class="t-muted" x="600" y="134" text-anchor="middle">prova de que ninguém alterou</text>
    <text x="240" y="80" text-anchor="middle" font-weight="600">.</text>
    <text x="480" y="80" text-anchor="middle" font-weight="600">.</text>
    <text class="t-mono" x="10" y="24">eyJhbGciOi...  .  eyJuYW1lIjoiYW5h...  .  Xk3f9...</text>
    <text class="t-bad" x="10" y="176">Header e payload são só Base64: qualquer um LÊ. Não coloque senhas ou dados sensíveis ali.</text>
    <text class="t-good" x="10" y="200">A assinatura garante que ninguém MUDOU nada: sem a chave, é impossível gerar uma assinatura válida.</text>
  </svg>
  <figcaption>Anatomia de um JWT: legível por todos, falsificável por ninguém.</figcaption>
</figure>

<figure class="diagram">
  <pre class="mermaid">
sequenceDiagram
    actor U as Cliente (app)
    participant L as /login
    participant P as /perfil
    U-&gt;&gt;L: usuário + senha
    L--&gt;&gt;U: JWT assinado (validade 15 min)
    U-&gt;&gt;P: Authorization: Bearer JWT
    P-&gt;&gt;P: confere assinatura, emissor, público e validade
    P--&gt;&gt;U: 200 OK (sem consultar o banco de usuários)
  </pre>
  <figcaption>O fluxo de login e uso do token.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code><br><code>dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.31</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

// Chave de assinatura. Em produção: Key Vault / variável de ambiente — NUNCA no código-fonte
var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("chave-de-demonstracao-com-mais-de-32-bytes!"));
const string Emissor = "loja-api", Publico = "loja-app";

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();                  // console limpo: só as nossas mensagens
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =&gt;
    {
        o.MapInboundClaims = false;   // mantém os nomes das claims como vieram ("name", "role")
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = Emissor,          // quem emitiu
            ValidAudience = Publico,        // para quem foi emitido
            IssuerSigningKey = chave,       // confere a assinatura
            ValidateLifetime = true,        // recusa token vencido
            ClockSkew = TimeSpan.Zero,      // sem tolerância extra (o padrão é 5 minutos)
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();
app.UseAuthentication();   // "quem é você?"
app.UseAuthorization();    // "você pode entrar aqui?"

// Login: confere usuário e senha (simulado aqui) e emite o "crachá"
app.MapPost("/login", (string usuario) =&gt; new JsonWebTokenHandler().CreateToken(new SecurityTokenDescriptor
{
    Issuer = Emissor,
    Audience = Publico,
    Subject = new ClaimsIdentity([new Claim("name", usuario), new Claim("role", "Cliente")]),
    Expires = DateTime.UtcNow.AddMinutes(15),
    SigningCredentials = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256),
}));

app.MapGet("/perfil", (ClaimsPrincipal usuario) =&gt;
        $"Olá, {usuario.FindFirst("name")?.Value}! Papel: {usuario.FindFirst("role")?.Value}")
   .RequireAuthorization();

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };

Console.WriteLine($"1) Sem token       -&gt; {await Chamar(null)}");

string token = await (await http.PostAsync("/login?usuario=ana", null)).Content.ReadAsStringAsync();
Console.WriteLine($"2) Token emitido   -&gt; {token[..36]}... ({token.Split('.').Length} partes separadas por '.')");
var payload = JsonDocument.Parse(Base64UrlEncoder.Decode(token.Split('.')[1])).RootElement;   // só Base64: não há segredo
string nome = payload.GetProperty("name").GetString()!, papel = payload.GetProperty("role").GetString()!;
Console.WriteLine($"3) Parte do meio   -&gt; name={nome}, role={papel} (qualquer um consegue LER!)");
Console.WriteLine($"4) Com token       -&gt; {await Chamar(token)}");

// Muda um único caractere da assinatura: o servidor percebe na hora
string adulterado = token[..^2] + (token[^2] == 'A' ? 'B' : 'A') + token[^1];
Console.WriteLine($"5) Token adulterado -&gt; {await Chamar(adulterado)}");

await app.StopAsync();

async Task&lt;string&gt; Chamar(string? jwt)
{
    var pedido = new HttpRequestMessage(HttpMethod.Get, "/perfil");
    if (jwt is not null) pedido.Headers.Authorization = new("Bearer", jwt);
    var resposta = await http.SendAsync(pedido);
    return resposta.IsSuccessStatusCode
        ? await resposta.Content.ReadAsStringAsync()
        : $"{(int)resposta.StatusCode} {resposta.StatusCode}";
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>1) Sem token       -&gt; 401 Unauthorized
2) Token emitido   -&gt; eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (3 partes separadas por '.')
3) Parte do meio   -&gt; name=ana, role=Cliente (qualquer um consegue LER!)
4) Com token       -&gt; Olá, ana! Papel: Cliente
5) Token adulterado -&gt; 401 Unauthorized</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Sem token, <code>RequireAuthorization()</code> responde <strong>401</strong>.</li>
  <li><code>JsonWebTokenHandler().CreateToken</code> monta e assina o token. Na saída, repare nas 3 partes separadas por ponto.</li>
  <li>A parte do meio é só Base64: decodificada, mostra as claims em texto puro. <strong>Nunca coloque dados sensíveis no JWT.</strong></li>
  <li>Trocar um único caractere da assinatura já faz a API recusar o token: sem a chave secreta, ninguém consegue assinar de novo.</li>
  <li><code>ClockSkew = TimeSpan.Zero</code> remove a tolerância padrão de 5 minutos na expiração.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Boas práticas com JWT</div>
  <ul><li>Tokens de acesso <strong>curtos</strong> (5 a 15 min) + <em>refresh token</em> para renovar.</li><li>A chave de assinatura fica num cofre (Azure Key Vault, AWS Secrets Manager), nunca no <code>appsettings.json</code> versionado.</li><li>Em sistemas com vários serviços, prefira um provedor de identidade (Entra ID, Keycloak, Auth0) e assinatura assimétrica (RS256): as APIs só precisam da chave <em>pública</em> para validar.</li></ul>
</div>

<h3>4.3.2 Authorization Policies e Autorização por Recurso</h3>

<p class="step-label">📘 O conceito</p>
<p>Uma <strong>policy</strong> é uma regra de acesso com nome — "só gerentes", "só plano premium" — declarada uma vez e aplicada aos endpoints. Quando a regra depende do <em>dado</em> acessado ("só o dono do pedido pode vê-lo"), usa-se a <strong>autorização baseada em recurso</strong>: um <code>AuthorizationHandler</code> que recebe o usuário <em>e</em> o objeto.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O crachá e a sala</div>
  <p>O crachá diz quem você é e qual é o seu cargo. A porta da sala da diretoria tem uma regra ("só gerentes") — isso é uma <em>policy</em>. Já o armário de cada funcionário tem outra regra: "só abre para o dono", e para aplicá-la o segurança precisa olhar o crachá <em>e</em> o armário — isso é a autorização por recurso.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();                  // console limpo: só as nossas mensagens
// Autenticação de DEMONSTRAÇÃO: lê o usuário de um cabeçalho (em produção: JWT, cookies, OpenID Connect)
builder.Services.AddAuthentication("Demo").AddScheme&lt;AuthenticationSchemeOptions, CrachaDeDemo&gt;("Demo", null);
builder.Services.AddAuthorization(opcoes =&gt;
{
    opcoes.AddPolicy("SomenteGerentes", p =&gt; p.RequireRole("Gerente"));
    opcoes.AddPolicy("PlanoPremium", p =&gt; p.RequireClaim("plano", "premium", "enterprise"));
});
builder.Services.AddSingleton&lt;IAuthorizationHandler, DonoDoPedidoHandler&gt;();

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

var pedidos = new Dictionary&lt;int, Pedido&gt; { [1] = new(1, "ana"), [2] = new(2, "bruno") };

app.MapGet("/relatorio", () =&gt; "relatório financeiro").RequireAuthorization("SomenteGerentes");
app.MapGet("/premium", () =&gt; "conteúdo premium").RequireAuthorization("PlanoPremium");

// Autorização baseada no RECURSO: a regra depende do pedido, não só do usuário
app.MapGet("/pedidos/{id:int}", async (int id, ClaimsPrincipal usuario, IAuthorizationService autorizacao) =&gt;
{
    if (!pedidos.TryGetValue(id, out var pedido)) return Results.NotFound();
    var resultado = await autorizacao.AuthorizeAsync(usuario, pedido, new DonoDoPedidoRequirement());
    return resultado.Succeeded ? Results.Text($"pedido {id} de {pedido.Dono}") : Results.Forbid();
}).RequireAuthorization();

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };

await Testar("ana;Cliente;basico", "/relatorio");
await Testar("carla;Gerente;basico", "/relatorio");
await Testar("ana;Cliente;basico", "/premium");
await Testar("ana;Cliente;premium", "/premium");
await Testar("ana;Cliente;basico", "/pedidos/1");
await Testar("ana;Cliente;basico", "/pedidos/2");
await Testar(null, "/pedidos/1");
await app.StopAsync();

async Task Testar(string? cracha, string url)
{
    var pedido = new HttpRequestMessage(HttpMethod.Get, url);
    if (cracha is not null) pedido.Headers.Add("X-Cracha", cracha);
    var resposta = await http.SendAsync(pedido);
    string corpo = resposta.IsSuccessStatusCode ? await resposta.Content.ReadAsStringAsync() : "";
    Console.WriteLine($"{cracha ?? "(anônimo)",-22} {url,-11} -&gt; {(int)resposta.StatusCode} {corpo}");
}

public record Pedido(int Id, string Dono);
public class DonoDoPedidoRequirement : IAuthorizationRequirement;

// A regra "só o dono pode ver", escrita uma vez e reaproveitada onde precisar
public class DonoDoPedidoHandler : AuthorizationHandler&lt;DonoDoPedidoRequirement, Pedido&gt;
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext contexto,
        DonoDoPedidoRequirement requisito, Pedido pedido)
    {
        if (contexto.User.Identity?.Name == pedido.Dono) contexto.Succeed(requisito);
        return Task.CompletedTask;
    }
}

// Lê "nome;papel;plano" do cabeçalho X-Cracha e monta a identidade do usuário
public class CrachaDeDemo(IOptionsMonitor&lt;AuthenticationSchemeOptions&gt; opcoes, ILoggerFactory log, UrlEncoder encoder)
    : AuthenticationHandler&lt;AuthenticationSchemeOptions&gt;(opcoes, log, encoder)
{
    protected override Task&lt;AuthenticateResult&gt; HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-Cracha", out var valor))
            return Task.FromResult(AuthenticateResult.NoResult());

        string[] partes = valor.ToString().Split(';');
        var identidade = new ClaimsIdentity(
            [new Claim(ClaimTypes.Name, partes[0]), new Claim(ClaimTypes.Role, partes[1]), new Claim("plano", partes[2])],
            authenticationType: "Demo");
        return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(identidade), "Demo")));
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>ana;Cliente;basico     /relatorio  -&gt; 403 
carla;Gerente;basico   /relatorio  -&gt; 200 relatório financeiro
ana;Cliente;basico     /premium    -&gt; 403 
ana;Cliente;premium    /premium    -&gt; 200 conteúdo premium
ana;Cliente;basico     /pedidos/1  -&gt; 200 pedido 1 de ana
ana;Cliente;basico     /pedidos/2  -&gt; 403 
(anônimo)              /pedidos/1  -&gt; 401 </pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>CrachaDeDemo</code> é um esquema de autenticação didático, que lê o usuário de um cabeçalho. O resto do exemplo funciona igual com JWT.</li>
  <li><code>RequireRole("Gerente")</code> e <code>RequireClaim("plano", ...)</code> viram policies com nome, aplicadas com <code>RequireAuthorization("NomeDaPolicy")</code>.</li>
  <li><code>DonoDoPedidoHandler</code> recebe o <code>Pedido</code>: a Ana vê o pedido 1 (dela) e recebe <strong>403</strong> no pedido 2 (do Bruno).</li>
  <li>Sem crachá: <strong>401</strong> (não sabemos quem é). Com crachá, mas sem permissão: <strong>403</strong> (sabemos quem é, e não pode).</li>
</ul>

<div class="info-box danger">
  <div class="info-box-label">🚨 IDOR: o bug de segurança mais comum em APIs</div>
  <p>Checar só "está logado?" e devolver <code>/pedidos/{id}</code> para qualquer <code>id</code> permite que um usuário veja os dados de outro só trocando o número na URL (Insecure Direct Object Reference, topo do OWASP API Top 10). A autorização por recurso é a defesa.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>A autenticação diz quem é o usuário; as policies e os handlers dizem o que ele pode fazer, inclusive com qual dado.</p>
</div>

<h2>4.4 Minimal APIs e Performance</h2>

<h3>4.4.1 Minimal APIs com Route Groups e Endpoint Filters</h3>

<p class="step-label">📘 O conceito</p>
<p>As <strong>Minimal APIs</strong> declaram endpoints direto no <code>Program.cs</code> (ou em métodos de extensão), sem controllers: menos cerimônia e um pouco mais de desempenho. Para organizar, os <strong>route groups</strong> (<code>MapGroup</code>) agrupam rotas com prefixo, autorização e filtros em comum. <strong><code>TypedResults</code></strong> com <code>Results&lt;...&gt;</code> deixam explícito no tipo quais respostas o endpoint pode dar — e o OpenAPI é gerado a partir disso.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O cardápio por seções</div>
  <p>Um cardápio organizado em seções (Entradas, Pratos, Sobremesas) em que cada seção tem as suas regras ("sobremesas só após as 12h"). O route group é a seção: o prefixo e as regras valem para todos os itens dela, sem repetir em cada um.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();                  // console limpo: só as nossas mensagens
var app = builder.Build();

var produtos = new List&lt;Produto&gt; { new(1, "Teclado", 250m) };

var api = app.MapGroup("/api/produtos")          // prefixo comum a todas as rotas do grupo
             .AddEndpointFilter&lt;LogDeEndpoint&gt;(); // filtro aplicado ao grupo inteiro

api.MapGet("/", () =&gt; produtos);

// TypedResults + Results&lt;...&gt;: o tipo de retorno documenta todas as respostas possíveis
api.MapGet("/{id:int}", Results&lt;Ok&lt;Produto&gt;, NotFound&gt; (int id) =&gt;
    produtos.FirstOrDefault(p =&gt; p.Id == id) is { } produto ? TypedResults.Ok(produto) : TypedResults.NotFound());

api.MapPost("/", Results&lt;Created&lt;Produto&gt;, ValidationProblem&gt; (NovoProduto novo) =&gt;
{
    var erros = new Dictionary&lt;string, string[]&gt;();
    if (string.IsNullOrWhiteSpace(novo.Nome)) erros["nome"] = ["O nome é obrigatório."];
    if (novo.Preco &lt;= 0) erros["preco"] = ["O preço deve ser maior que zero."];
    if (erros.Count &gt; 0) return TypedResults.ValidationProblem(erros);

    var produto = new Produto(produtos.Max(p =&gt; p.Id) + 1, novo.Nome, novo.Preco);
    produtos.Add(produto);
    return TypedResults.Created($"/api/produtos/{produto.Id}", produto);
});

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };

await Mostrar(await http.GetAsync("/api/produtos/1"));
await Mostrar(await http.GetAsync("/api/produtos/99"));
await Mostrar(await http.PostAsJsonAsync("/api/produtos", new NovoProduto("Mouse", 80m)));
await Mostrar(await http.PostAsJsonAsync("/api/produtos", new NovoProduto("", -5m)));
await Mostrar(await http.GetAsync("/api/produtos"));
await app.StopAsync();

static async Task Mostrar(HttpResponseMessage r)
{
    string local = r.Headers.Location is { } l ? $" (Location: {l})" : "";
    Console.WriteLine($"   {(int)r.StatusCode} {r.StatusCode}{local} {await r.Content.ReadAsStringAsync()}");
}

public record Produto(int Id, string Nome, decimal Preco);
public record NovoProduto(string Nome, decimal Preco);

// Endpoint filter: o "middleware" das Minimal APIs, com acesso aos argumentos do endpoint
public class LogDeEndpoint : IEndpointFilter
{
    public async ValueTask&lt;object?&gt; InvokeAsync(EndpointFilterInvocationContext contexto, EndpointFilterDelegate proximo)
    {
        Console.WriteLine($"[filtro] {contexto.HttpContext.Request.Method} {contexto.HttpContext.Request.Path}");
        return await proximo(contexto);
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>[filtro] GET /api/produtos/1
   200 OK {"id":1,"nome":"Teclado","preco":250}
[filtro] GET /api/produtos/99
   404 NotFound 
[filtro] POST /api/produtos
   201 Created (Location: /api/produtos/2) {"id":2,"nome":"Mouse","preco":80}
[filtro] POST /api/produtos
   400 BadRequest {"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"nome":["O nome é obrigatório."],"preco":["O preço deve ser maior que zero."]}}
[filtro] GET /api/produtos
   200 OK [{"id":1,"nome":"Teclado","preco":250},{"id":2,"nome":"Mouse","preco":80}]</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>MapGroup("/api/produtos")</code> define o prefixo uma vez; <code>AddEndpointFilter</code> aplica o filtro a todo o grupo.</li>
  <li><code>Results&lt;Ok&lt;Produto&gt;, NotFound&gt;</code> declara no tipo as duas respostas possíveis.</li>
  <li><code>TypedResults.Created</code> devolve 201 com o cabeçalho <code>Location</code> apontando para o recurso criado.</li>
  <li><code>TypedResults.ValidationProblem</code> devolve 400 no formato Problem Details, com os erros por campo — o formato que os front-ends já sabem exibir.</li>
</ul>

<h3>4.4.2 Output Cache e Rate Limiting</h3>

<p class="step-label">📘 O conceito</p>
<ul><li><strong>Output Cache</strong> guarda a <em>resposta HTTP pronta</em> e a devolve nas próximas requisições, sem executar o endpoint (nem o banco). Ideal para dados lidos muito e alterados pouco.</li><li><strong>Rate Limiting</strong> limita quantas requisições um cliente pode fazer num intervalo. Protege a API de abuso, de robôs e de um cliente com defeito em laço infinito. Quem passa do limite recebe <strong>429 Too Many Requests</strong>.</li></ul>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O prato do dia e a catraca</div>
  <p><strong>Output cache:</strong> no almoço, o restaurante monta vários pratos do dia de uma vez e só entrega — não cozinha um por um. <strong>Rate limiting:</strong> a catraca do parque aquático deixa entrar 3 pessoas por minuto em cada tobogã; quem chega depois espera a próxima janela — e cada tobogã tem a sua fila.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();                  // console limpo: só as nossas mensagens
builder.Services.AddOutputCache();
builder.Services.AddRateLimiter(opcoes =&gt;
{
    opcoes.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // Uma "cota" por cliente: aqui pelo cabeçalho X-Cliente; numa API real, pelo usuário logado ou IP
    opcoes.AddPolicy("porCliente", contexto =&gt; RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: contexto.Request.Headers["X-Cliente"].ToString() is { Length: &gt; 0 } cliente ? cliente : "anonimo",
        factory: _ =&gt; new FixedWindowRateLimiterOptions { PermitLimit = 3, Window = TimeSpan.FromSeconds(10) }));
});

var app = builder.Build();
app.UseRateLimiter();
app.UseOutputCache();

int consultasAoBanco = 0;
app.MapGet("/vitrine", () =&gt; $"vitrine montada (consulta nº {++consultasAoBanco} ao banco)")
   .CacheOutput(p =&gt; p.Expire(TimeSpan.FromSeconds(30)));   // guarda a RESPOSTA pronta por 30 s

app.MapGet("/cotacao", () =&gt; "dólar: 5,00").RequireRateLimiting("porCliente");

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };

Console.WriteLine("Output cache — 3 visitas à vitrine:");
for (int i = 1; i &lt;= 3; i++)
    Console.WriteLine($"   visita {i}: {await http.GetStringAsync("/vitrine")}");

Console.WriteLine("Rate limiting — no máximo 3 chamadas a cada 10 s por cliente:");
foreach (var cliente in new[] { "ana", "ana", "ana", "ana", "ana", "bruno" })
{
    var pedido = new HttpRequestMessage(HttpMethod.Get, "/cotacao");
    pedido.Headers.Add("X-Cliente", cliente);
    var resposta = await http.SendAsync(pedido);
    Console.WriteLine($"   {cliente,-6} -&gt; {(int)resposta.StatusCode} {resposta.StatusCode}");
}
await app.StopAsync();</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Output cache — 3 visitas à vitrine:
   visita 1: vitrine montada (consulta nº 1 ao banco)
   visita 2: vitrine montada (consulta nº 1 ao banco)
   visita 3: vitrine montada (consulta nº 1 ao banco)
Rate limiting — no máximo 3 chamadas a cada 10 s por cliente:
   ana    -&gt; 200 OK
   ana    -&gt; 200 OK
   ana    -&gt; 200 OK
   ana    -&gt; 429 TooManyRequests
   ana    -&gt; 429 TooManyRequests
   bruno  -&gt; 200 OK</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>As três visitas à vitrine mostram "consulta nº 1": depois da primeira, o endpoint nem é executado; a resposta vem do cache por 30 s.</li>
  <li>A Ana faz 3 chamadas com sucesso e a 4ª e a 5ª recebem <strong>429</strong>. O Bruno tem a própria cota e passa normalmente.</li>
  <li><code>GetFixedWindowLimiter</code> usa janelas fixas; existem também <code>SlidingWindow</code> (mais suave), <code>TokenBucket</code> (permite rajadas) e <code>Concurrency</code> (limita requisições simultâneas).</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Invalidar o cache quando o dado muda: marque as respostas com uma tag...
app.MapGet("/produtos", ListarProdutos).CacheOutput(p =&gt; p.Tag("produtos").Expire(TimeSpan.FromMinutes(5)));

// ...e descarte todas as respostas com essa tag ao alterar um produto
app.MapPut("/produtos/{id}", async (int id, Produto p, IOutputCacheStore cache, CancellationToken ct) =&gt;
{
    // ... salva no banco ...
    await cache.EvictByTagAsync("produtos", ct);
    return Results.NoContent();
});</code></pre>
</div>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Com vários servidores</div>
  <p>Por padrão, o output cache e os contadores do rate limiter ficam na memória de <em>cada</em> servidor. Com 5 instâncias atrás de um balanceador, cada uma tem seu próprio cache e sua própria cota. Para compartilhar, use o output cache com Redis (<code>AddStackExchangeRedisOutputCache</code>) e faça o rate limiting no gateway (Azure API Management, YARP, NGINX).</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Output cache economiza trabalho repetido, e o rate limiting protege a API de excessos; os dois são configurados por endpoint.</p>
</div>

<div class="challenge-box">
  <div class="challenge-box-header">
    <span class="challenge-box-icon">🎯</span>
    <span class="challenge-box-title">Desafio Prático — Capítulo 4</span>
  </div>
  <p>Construa uma API de <strong>biblioteca</strong> com Minimal APIs, reaproveitando os padrões do capítulo:</p>
  <ol>
    <li>Um middleware de correlation id e o tratamento de erros com Problem Details (4.1).</li>
    <li>Login com JWT de 15 minutos e as roles <code>Leitor</code> e <code>Bibliotecario</code> (4.3.1).</li>
    <li>Uma policy "só bibliotecários cadastram livros" e a autorização por recurso "só o leitor que pegou emprestado pode renovar" (4.3.2).</li>
    <li>Output cache no catálogo, invalidado por tag ao cadastrar um livro, e um rate limit de 10 buscas por minuto por usuário (4.4.2).</li>
  </ol>
  <p>Escreva testes de integração com <code>WebApplicationFactory&lt;Program&gt;</code> para os casos 401, 403, 404, 422 e 429.</p>
</div>
`
},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 5 — ACESSO A DADOS
══════════════════════════════════════════════════════════ */
{
  id: 5, slug: 'dados', icon: '🗄️', color: '#f59e0b',
  title: 'Acesso a Dados e Persistência',
  subtitle: 'EF Core avançado, Dapper, Redis, MongoDB e Elasticsearch',
  desc: 'Mapeamento, N+1 medido na prática, concorrência otimista, filtros globais e interceptors, Dapper, cache-aside e persistência poliglota — com exemplos que rodam em SQLite em memória.',
  tags: ['EF Core','Dapper','Redis','MongoDB','Elasticsearch'],
  readTime: 45,
  intro: `O banco de dados é o componente mais difícil de escalar e o mais crítico para a
    corretude do sistema. Um sênior não apenas escreve queries — ele entende o SQL gerado,
    detecta N+1 em code review, sabe quando usar cache, quando usar NoSQL
    e como evitar que duas pessoas comprem o mesmo último ingresso.`,
  content: `
<div class="info-box info">
  <div class="info-box-label">🧭 Como estudar este capítulo</div>
  <p>Os exemplos de EF Core e Dapper usam <strong>SQLite em memória</strong>: rodam sem instalar nenhum banco e mostram o SQL de verdade e quantas consultas chegaram ao banco. O que você aprende vale igual para SQL Server e PostgreSQL — só muda o <code>UseSqlite</code> para <code>UseSqlServer</code>/<code>UseNpgsql</code>. Os pacotes necessários aparecem acima de cada programa.</p>
</div>

<h2>5.1 Entity Framework Core Avançado</h2>

<p>O <strong>EF Core</strong> é um ORM (<em>Object-Relational Mapper</em>): ele traduz objetos C# em linhas de tabela e consultas LINQ em SQL. Ele economiza muito código, mas cobra um preço de quem não entende o que acontece por baixo: o SQL gerado, quantas vezes o banco é chamado e o que fica em memória.</p>

<h3>5.1.1 Fluent API e Mapeamento</h3>

<p class="step-label">📘 O conceito</p>
<p>A <strong>Fluent API</strong> (<code>IEntityTypeConfiguration&lt;T&gt;</code>) configura como cada classe vira uma tabela — nomes, tamanhos, índices, conversões — <em>fora</em> da classe de domínio, que continua limpa. Recursos-chave: <strong>value conversions</strong> (um Value Object vira uma coluna), <strong>owned types</strong> (um objeto vira várias colunas na mesma tabela) e <strong>shadow properties</strong> (colunas que existem só no banco).</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A planta e a obra</div>
  <p>A classe de domínio é a planta que o arquiteto desenha pensando em quem vai morar (o negócio). O mapeamento é o projeto executivo do engenheiro: onde passam os canos e os fios (tabelas, colunas e índices). Os dois precisam casar, mas quem desenha a sala não deveria se preocupar com a bitola do cano.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 290" role="img" aria-label="A classe Pedido, com um Dinheiro e um Endereco dentro, vira uma única tabela Pedidos: Total vira a coluna ValorTotal, e Rua, Cidade e Cep do endereço viram as colunas EntregaRua, EntregaCidade e EntregaCep; AtualizadoEm é uma shadow property que só existe no banco">
    <defs><marker id="c5d1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c5d1-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c5d1-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">NO C# (objetos)</text>
    <rect class="box-accent" x="10" y="34" width="270" height="230" rx="10"/>
    <text class="t-mono" x="26" y="58" font-weight="600">class Pedido</text>
    <text class="t-mono" x="36" y="86">Id: int</text>
    <text class="t-mono" x="36" y="114">Cliente: string</text>
    <text class="t-mono" x="36" y="142">Total: Dinheiro</text>
    <text class="t-mono" x="36" y="170">Entrega: Endereco</text>
    <text class="t-mono" x="36" y="198">Status: string</text>
    <text class="t-mono" x="36" y="226">CriadoEm: DateTime</text>
    <text class="t-title" x="440" y="22">NO BANCO (tabela Pedidos)</text>
    <rect class="box" x="440" y="32" width="270" height="24" rx="4"/>
    <text class="t-mono" x="575.0" y="49.0" text-anchor="middle">Id</text>
    <rect class="box" x="440" y="58" width="270" height="24" rx="4"/>
    <text class="t-mono" x="575.0" y="75.0" text-anchor="middle">Cliente</text>
    <rect class="box-good" x="440" y="84" width="270" height="24" rx="4"/>
    <text class="t-mono" x="575.0" y="101.0" text-anchor="middle">ValorTotal</text>
    <rect class="box-warn" x="440" y="110" width="270" height="24" rx="4"/>
    <text class="t-mono" x="575.0" y="127.0" text-anchor="middle">EntregaRua</text>
    <rect class="box-warn" x="440" y="136" width="270" height="24" rx="4"/>
    <text class="t-mono" x="575.0" y="153.0" text-anchor="middle">EntregaCidade</text>
    <rect class="box-warn" x="440" y="162" width="270" height="24" rx="4"/>
    <text class="t-mono" x="575.0" y="179.0" text-anchor="middle">EntregaCep</text>
    <rect class="box" x="440" y="188" width="270" height="24" rx="4"/>
    <text class="t-mono" x="575.0" y="205.0" text-anchor="middle">Status</text>
    <rect class="box" x="440" y="214" width="270" height="24" rx="4"/>
    <text class="t-mono" x="575.0" y="231.0" text-anchor="middle">CriadoEm</text>
    <rect class="box-bad" x="440" y="240" width="270" height="24" rx="4"/>
    <text class="t-mono" x="575.0" y="257.0" text-anchor="middle">AtualizadoEm</text>
    <path class="line-good" d="M200,138 C320,138 340,96 436,96" marker-end="url(#c5d1-head-good)"/>
    <text class="t-mono t-good" x="360" y="84" text-anchor="middle">HasConversion</text>
    <path class="line" d="M210,166 C330,166 340,148 436,148" marker-end="url(#c5d1-head)"/>
    <text class="t-mono" x="330" y="186" text-anchor="middle">OwnsOne</text>
    <text class="t-muted" x="10" y="282">Amarelo: owned type (3 colunas). Verde: conversão. Vermelho: shadow property (só no banco).</text>
  </svg>
  <figcaption>A Fluent API decide como os objetos viram colunas, sem poluir o domínio com atributos de banco.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8.0.31</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using var db = new LojaDb();
// Mostra o SQL da tabela que o EF Core cria a partir do mapeamento
Console.WriteLine(db.Database.GenerateCreateScript());

public record Dinheiro(decimal Valor);
public record Endereco(string Rua, string Cidade, string Cep);

// A classe de domínio não sabe nada de banco de dados
public class Pedido
{
    public int Id { get; set; }
    public string Cliente { get; set; } = "";
    public Dinheiro Total { get; set; } = new(0);
    public Endereco Entrega { get; set; } = new("", "", "");
    public string Status { get; set; } = "Rascunho";
    public DateTime CriadoEm { get; set; }
}

public class LojaDb : DbContext
{
    public DbSet&lt;Pedido&gt; Pedidos =&gt; Set&lt;Pedido&gt;();
    protected override void OnConfiguring(DbContextOptionsBuilder o) =&gt; o.UseSqlite("Data Source=:memory:");
    protected override void OnModelCreating(ModelBuilder mb) =&gt; mb.ApplyConfiguration(new PedidoConfig());
}

// Fluent API: toda a configuração da tabela num lugar só, fora da classe de domínio
public class PedidoConfig : IEntityTypeConfiguration&lt;Pedido&gt;
{
    public void Configure(EntityTypeBuilder&lt;Pedido&gt; b)
    {
        b.ToTable("Pedidos");
        b.Property(p =&gt; p.Cliente).HasMaxLength(100).IsRequired();
        b.Property(p =&gt; p.Status).HasMaxLength(20);

        // Value Object em UMA coluna: converte Dinheiro &lt;-&gt; decimal
        b.Property(p =&gt; p.Total).HasConversion(d =&gt; d.Valor, v =&gt; new Dinheiro(v)).HasColumnName("ValorTotal");

        // Owned type: o Endereco vira colunas NA MESMA tabela (sem tabela nem Id próprios)
        b.OwnsOne(p =&gt; p.Entrega, e =&gt;
        {
            e.Property(x =&gt; x.Rua).HasColumnName("EntregaRua").HasMaxLength(200);
            e.Property(x =&gt; x.Cidade).HasColumnName("EntregaCidade").HasMaxLength(100);
            e.Property(x =&gt; x.Cep).HasColumnName("EntregaCep").HasMaxLength(9);
        });

        // Índice para a consulta mais comum: "pedidos por status, mais recentes primeiro"
        b.HasIndex(p =&gt; new { p.Status, p.CriadoEm });

        // Shadow property: existe no banco, mas não aparece na classe de domínio
        b.Property&lt;DateTime&gt;("AtualizadoEm");
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>CREATE TABLE "Pedidos" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Pedidos" PRIMARY KEY,
    "Cliente" TEXT NOT NULL,
    "ValorTotal" TEXT NOT NULL,
    "EntregaRua" TEXT NOT NULL,
    "EntregaCidade" TEXT NOT NULL,
    "EntregaCep" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "CriadoEm" TEXT NOT NULL,
    "AtualizadoEm" TEXT NOT NULL
);


CREATE INDEX "IX_Pedidos_Status_CriadoEm" ON "Pedidos" ("Status", "CriadoEm");</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>GenerateCreateScript()</code> mostra o SQL que o EF Core geraria. Use isso (ou as migrations) para <em>revisar</em> o esquema antes de ir para produção.</li>
  <li><code>HasConversion</code> grava o <code>Dinheiro</code> como um número na coluna <code>ValorTotal</code> e o reconstrói ao ler.</li>
  <li><code>OwnsOne</code> "achata" o <code>Endereco</code> em três colunas na própria tabela <code>Pedidos</code>.</li>
  <li>O índice composto <code>(Status, CriadoEm)</code> atende consultas como "pedidos pagos, dos mais recentes aos mais antigos".</li>
  <li>No SQLite, <code>decimal</code> vira <code>TEXT</code>. No SQL Server, defina a precisão com <code>.HasPrecision(18, 2)</code>; sem ela, o EF avisa e usa <code>decimal(18,2)</code>.</li>
</ul>

<h3>5.1.2 O Problema N+1</h3>

<p class="step-label">📘 O conceito</p>
<p><strong>N+1</strong> é quando o código faz 1 consulta para buscar uma lista e depois <strong>mais 1 consulta para cada item</strong>, para buscar um dado relacionado. Com 100 pedidos de 100 clientes diferentes, são 101 idas ao banco — cada uma pagando a latência da rede. Em desenvolvimento, com 5 registros, ninguém percebe; em produção, com 10.000, a página leva segundos. As soluções são carregar junto (<code>Include</code>) ou, melhor ainda, <strong>projetar</strong> só o necessário (<code>Select</code>).</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A lista do supermercado</div>
  <p>N+1 é ir ao supermercado, comprar o arroz, voltar para casa, olhar a lista, voltar ao supermercado para comprar o feijão, voltar para casa... O <code>Include</code> é levar a lista inteira e comprar tudo numa ida só. A projeção é comprar <em>só</em> o que está na lista — sem encher o carrinho de coisas que você não vai usar.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 256" role="img" aria-label="N+1: a aplicação faz uma consulta para os pedidos e depois uma consulta por pedido para buscar o cliente, 101 idas ao banco. Com Include ou projeção, uma única consulta com JOIN traz tudo">
    <defs><marker id="c5d2-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c5d2-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c5d2-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">❌ N+1</text>
    <rect class="box" x="10" y="40" width="110" height="50" rx="8"/>
    <text x="65.0" y="70.0" text-anchor="middle" font-weight="600">App</text>
    <rect class="box" x="230" y="40" width="110" height="50" rx="8"/>
    <text x="285.0" y="70.0" text-anchor="middle" font-weight="600">Banco</text>
    <path class="line" d="M120,60 C160,90 190,90 226,60" marker-end="url(#c5d2-head)"/>
    <path class="line-bad" d="M120,80 C160,99 190,99 226,80" marker-end="url(#c5d2-head-bad)"/>
    <path class="line-bad" d="M120,80 C160,108 190,108 226,80" marker-end="url(#c5d2-head-bad)"/>
    <path class="line-bad" d="M120,80 C160,117 190,117 226,80" marker-end="url(#c5d2-head-bad)"/>
    <path class="line-bad" d="M120,80 C160,126 190,126 226,80" marker-end="url(#c5d2-head-bad)"/>
    <path class="line-bad" d="M120,80 C160,135 190,135 226,80" marker-end="url(#c5d2-head-bad)"/>
    <text class="t-bad" x="175" y="240" text-anchor="middle">1 + N consultas: cresce com os dados</text>
    <text class="t-mono t-muted" x="40" y="160">SELECT pedidos</text>
    <text class="t-mono t-muted" x="40" y="180">SELECT cliente 1</text>
    <text class="t-mono t-muted" x="40" y="200">SELECT cliente 2</text>
    <text class="t-mono t-muted" x="40" y="220">... uma por cliente</text>
    <text class="t-title" x="400" y="22">✅ INCLUDE / PROJEÇÃO</text>
    <rect class="box" x="400" y="40" width="110" height="50" rx="8"/>
    <text x="455.0" y="70.0" text-anchor="middle" font-weight="600">App</text>
    <rect class="box" x="600" y="40" width="110" height="50" rx="8"/>
    <text x="655.0" y="70.0" text-anchor="middle" font-weight="600">Banco</text>
    <path class="line-good" d="M510,65 L596,65" marker-end="url(#c5d2-head-good)"/>
    <text class="t-good" x="555" y="56" text-anchor="middle">1 consulta</text>
    <text class="t-mono t-muted" x="400" y="160">SELECT p.Id, c.Nome, p.Total</text>
    <text class="t-mono t-muted" x="400" y="180">FROM Pedidos p</text>
    <text class="t-mono t-muted" x="400" y="200">JOIN Cliente c ON ...</text>
    <text class="t-good" x="555" y="240" text-anchor="middle">1 consulta, só as colunas usadas</text>
  </svg>
  <figcaption>N+1: o problema de desempenho mais comum com ORMs — e o mais fácil de evitar.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8.0.31</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Data.Common;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var contador = new ContadorDeConsultas();
using var conexao = new SqliteConnection("Data Source=:memory:");
conexao.Open();   // banco em memória: existe enquanto a conexão estiver aberta

using (var db = new LojaDb(conexao, contador))
{
    db.Database.EnsureCreated();
    for (int c = 1; c &lt;= 50; c++)
    {
        var cliente = new Cliente { Nome = $"Cliente {c}" };
        db.Pedidos.Add(new Pedido { Cliente = cliente, Total = c * 10 });
        db.Pedidos.Add(new Pedido { Cliente = cliente, Total = c * 20 });
    }
    db.SaveChanges();   // 100 pedidos de 50 clientes
}

// ❌ N+1: 1 consulta para os pedidos + 1 consulta POR pedido para buscar o cliente
await Medir("N+1 (cliente carregado dentro do laço)", async db =&gt;
{
    var pedidos = await db.Pedidos.ToListAsync();
    foreach (var p in pedidos)
        await db.Entry(p).Reference(x =&gt; x.Cliente).LoadAsync();   // o que o lazy loading faz "escondido"
    return pedidos.Count;
});

// ✅ Include: um JOIN traz pedidos e clientes de uma vez
await Medir("Include (eager loading)", async db =&gt;
    (await db.Pedidos.Include(p =&gt; p.Cliente).ToListAsync()).Count);

// ✅ Projeção: busca SÓ as colunas necessárias
await Medir("Projeção com Select", async db =&gt;
    (await db.Pedidos.Select(p =&gt; new { p.Id, NomeDoCliente = p.Cliente.Nome, p.Total }).ToListAsync()).Count);

Console.WriteLine();
Console.WriteLine("SQL gerado pela projeção (ToQueryString):");
using (var db = new LojaDb(conexao, contador))
    Console.WriteLine(db.Pedidos.Select(p =&gt; new { p.Id, NomeDoCliente = p.Cliente.Nome, p.Total }).ToQueryString());

async Task Medir(string nome, Func&lt;LojaDb, Task&lt;int&gt;&gt; consulta)
{
    using var db = new LojaDb(conexao, contador);
    contador.Total = 0;
    int pedidos = await consulta(db);
    Console.WriteLine($"{nome,-40}: {pedidos} pedidos em {contador.Total,3} consulta(s) ao banco");
}

public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
}

public class Pedido
{
    public int Id { get; set; }
    public decimal Total { get; set; }
    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;
}

public class LojaDb(DbConnection conexao, ContadorDeConsultas contador) : DbContext
{
    public DbSet&lt;Pedido&gt; Pedidos =&gt; Set&lt;Pedido&gt;();
    protected override void OnConfiguring(DbContextOptionsBuilder o) =&gt;
        o.UseSqlite(conexao).AddInterceptors(contador);
}

// Interceptor: conta cada consulta SQL que chega ao banco
public class ContadorDeConsultas : DbCommandInterceptor
{
    public int Total;

    public override ValueTask&lt;InterceptionResult&lt;DbDataReader&gt;&gt; ReaderExecutingAsync(
        DbCommand comando, CommandEventData dados, InterceptionResult&lt;DbDataReader&gt; resultado, CancellationToken ct = default)
    {
        Total++;
        return base.ReaderExecutingAsync(comando, dados, resultado, ct);
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>N+1 (cliente carregado dentro do laço)  : 100 pedidos em  51 consulta(s) ao banco
Include (eager loading)                 : 100 pedidos em   1 consulta(s) ao banco
Projeção com Select                     : 100 pedidos em   1 consulta(s) ao banco

SQL gerado pela projeção (ToQueryString):
SELECT "p"."Id", "c"."Nome" AS "NomeDoCliente", "p"."Total"
FROM "Pedidos" AS "p"
INNER JOIN "Cliente" AS "c" ON "p"."ClienteId" = "c"."Id"</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>ContadorDeConsultas</code> é um <code>DbCommandInterceptor</code>: o EF Core o chama antes de cada comando SQL. É a mesma técnica de ferramentas como o MiniProfiler.</li>
  <li>O laço com <code>Reference(...).LoadAsync()</code> faz o que o <em>lazy loading</em> faz escondido. Aqui foram 51 consultas: 1 para os pedidos e mais 1 para cada um dos 50 clientes (o EF não busca de novo um cliente que já carregou). Com 10.000 pedidos de 5.000 clientes, seriam 5.001.</li>
  <li><code>Include</code> e a projeção resolvem com <strong>uma</strong> consulta. A projeção ainda traz só 3 colunas, e o EF não precisa rastrear as entidades.</li>
  <li><code>ToQueryString()</code> mostra o SQL de uma consulta sem executá-la. É ótimo para code review e depuração.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Include com várias coleções: use AsSplitQuery</div>
  <p><code>Include(p =&gt; p.Itens).Include(p =&gt; p.Pagamentos)</code> num único JOIN gera um <em>produto cartesiano</em> (itens × pagamentos linhas por pedido). Com <code>.AsSplitQuery()</code>, o EF faz uma consulta por coleção — mais idas ao banco, mas muito menos dados trafegando. E para detectar N+1 cedo, deixe o log de SQL ligado em desenvolvimento: <code>optionsBuilder.LogTo(Console.WriteLine, LogLevel.Information)</code>.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Se uma consulta aparece dentro de um laço, desconfie de N+1; prefira projeções com <code>Select</code>, que trazem só o necessário numa ida só.</p>
</div>

<h3>5.1.3 Concorrência Otimista</h3>

<p class="step-label">📘 O conceito</p>
<p>Quando duas pessoas editam o mesmo registro ao mesmo tempo, a última a salvar sobrescreve a primeira sem ninguém perceber (<em>lost update</em>). A <strong>concorrência otimista</strong> resolve sem travar o banco: cada registro tem uma <strong>versão</strong>; o <code>UPDATE</code> só é aplicado se a versão ainda for a que você leu. Se alguém mudou antes, nenhuma linha é alterada e o EF lança <code>DbUpdateConcurrencyException</code>.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O último ingresso do show</div>
  <p>Dois fãs veem o último ingresso disponível e clicam em "comprar" com um segundo de diferença. O sistema confere: "a versão que você viu ainda é a atual?". Para o primeiro, sim — ele leva. Para o segundo, não — ele recebe "esse assento acabou de ser vendido, escolha outro", em vez de uma venda duplicada.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
sequenceDiagram
    actor U1 as Usuário 1
    actor U2 as Usuário 2
    participant DB as Banco de Dados
    
    U1-&gt;&gt;DB: Lê Ingresso (v1)
    U2-&gt;&gt;DB: Lê Ingresso (v1)
    U1-&gt;&gt;DB: Atualiza (v1 -&gt; v2)
    Note over DB: Atualização OK
    U2-&gt;&gt;DB: Tenta atualizar (espera v1, mas está v2)
    Note over DB: DbUpdateConcurrencyException
  </pre>
  <figcaption>A versão lida vai no WHERE do UPDATE; se mudou, o UPDATE não altera nada.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8.0.31</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

using var conexao = new SqliteConnection("Data Source=:memory:");
conexao.Open();
using (var db = new ShowDb(conexao))
{
    db.Database.EnsureCreated();
    db.Ingressos.Add(new Ingresso { Id = 1, Assento = "A-12" });
    db.SaveChanges();
}

// Duas pessoas abrem a página do MESMO último ingresso ao mesmo tempo
using var sessaoDaAna = new ShowDb(conexao);
using var sessaoDoBruno = new ShowDb(conexao);
var vistoPelaAna = (await sessaoDaAna.Ingressos.FindAsync(1))!;
var vistoPeloBruno = (await sessaoDoBruno.Ingressos.FindAsync(1))!;
Console.WriteLine($"Ana e Bruno leram o assento {vistoPelaAna.Assento} (versão {vistoPelaAna.Versao})");

// A Ana clica em "comprar" primeiro
vistoPelaAna.Comprar("Ana");
await sessaoDaAna.SaveChangesAsync();
Console.WriteLine($"Ana comprou. Versão no banco agora: {vistoPelaAna.Versao}");

// O Bruno clica logo depois, ainda com a versão antiga na tela
vistoPeloBruno.Comprar("Bruno");
try
{
    await sessaoDoBruno.SaveChangesAsync();
    Console.WriteLine("Bruno comprou (isso seria uma venda duplicada!)");
}
catch (DbUpdateConcurrencyException ex)
{
    // O UPDATE levou "WHERE Versao = 0", mas no banco já é 1: nenhuma linha foi alterada
    var noBanco = await ex.Entries[0].GetDatabaseValuesAsync();
    Console.WriteLine($"Bruno: conflito detectado! O assento já é de {noBanco!["Dono"]}. Oferecer outro assento.");
}

public class Ingresso
{
    public int Id { get; set; }
    public string Assento { get; set; } = "";
    public string? Dono { get; set; }
    public int Versao { get; set; }   // muda a cada alteração do registro

    public void Comprar(string comprador)
    {
        Dono = comprador;
        Versao++;
    }
}

public class ShowDb(SqliteConnection conexao) : DbContext
{
    public DbSet&lt;Ingresso&gt; Ingressos =&gt; Set&lt;Ingresso&gt;();
    protected override void OnConfiguring(DbContextOptionsBuilder o) =&gt; o.UseSqlite(conexao);

    // IsConcurrencyToken: o valor ORIGINAL entra no WHERE do UPDATE
    protected override void OnModelCreating(ModelBuilder mb) =&gt;
        mb.Entity&lt;Ingresso&gt;().Property(i =&gt; i.Versao).IsConcurrencyToken();
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Ana e Bruno leram o assento A-12 (versão 0)
Ana comprou. Versão no banco agora: 1
Bruno: conflito detectado! O assento já é de Ana. Oferecer outro assento.</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>IsConcurrencyToken()</code> faz o EF incluir o valor <em>original</em> de <code>Versao</code> no <code>WHERE</code> do <code>UPDATE</code>.</li>
  <li>A Ana salva primeiro: a versão vai de 0 para 1. O Bruno salva com a versão 0 que tinha lido, o <code>UPDATE</code> afeta 0 linhas e o EF lança <code>DbUpdateConcurrencyException</code>.</li>
  <li><code>GetDatabaseValuesAsync()</code> lê o valor atual no banco, para decidir o que fazer: avisar o usuário, mesclar as mudanças ou tentar de novo.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// No SQL Server, use uma coluna rowversion, que o próprio banco atualiza a cada alteração
public class Ingresso
{
    public int Id { get; set; }
    [Timestamp] public byte[] RowVersion { get; set; } = [];
}</code></pre>
</div>

<h3>5.1.4 Global Query Filters, Interceptors e Compiled Queries</h3>

<p class="step-label">📘 O conceito</p>
<ul><li><strong>Global query filter</strong>: uma condição aplicada automaticamente a <em>toda</em> consulta de uma entidade — perfeito para exclusão lógica ("não mostrar excluídos") e multi-tenant ("só dados da minha empresa").</li><li><strong>SaveChangesInterceptor</strong>: código que roda antes de todo <code>SaveChanges</code> — auditoria (quem criou, quando) e exclusão lógica, sem repetir em cada serviço.</li><li><strong>Compiled query</strong>: a tradução LINQ → SQL feita uma única vez, para consultas executadas milhares de vezes por segundo.</li></ul>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O porteiro do prédio comercial</div>
  <p>Num prédio com várias empresas, o porteiro confere o crachá de todo mundo automaticamente: ninguém da empresa A entra no andar da empresa B, e ninguém precisa lembrar de pedir isso. O global query filter é esse porteiro. E o livro de registro na portaria (quem entrou, quando) é o interceptor de auditoria: preenchido sempre, sem depender da boa vontade de cada visitante.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8.0.31</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var usuarioAtual = new UsuarioAtual { Nome = "ana", Empresa = "loja-a" };
using var conexao = new SqliteConnection("Data Source=:memory:");
conexao.Open();

using (var db = new AppDb(conexao, usuarioAtual))
{
    db.Database.EnsureCreated();
    db.Produtos.AddRange(
        new Produto { Nome = "Teclado", Empresa = "loja-a" },
        new Produto { Nome = "Mouse", Empresa = "loja-a" },
        new Produto { Nome = "Monitor", Empresa = "loja-b" });   // de OUTRA empresa
    await db.SaveChangesAsync();

    var mouse = await db.Produtos.SingleAsync(p =&gt; p.Nome == "Mouse");
    db.Produtos.Remove(mouse);   // o interceptor troca o DELETE por uma "exclusão lógica"
    await db.SaveChangesAsync();
}

// Compiled query: a tradução LINQ -&gt; SQL acontece uma única vez (útil em caminhos muito executados)
var buscarPorNome = EF.CompileAsyncQuery((AppDb db, string nome) =&gt; db.Produtos.FirstOrDefault(p =&gt; p.Nome == nome));

using (var db = new AppDb(conexao, usuarioAtual))
{
    var visiveis = await db.Produtos.Select(p =&gt; p.Nome).ToListAsync();
    Console.WriteLine($"Consulta normal (com filtros) : {string.Join(", ", visiveis)}");

    var todos = await db.Produtos.IgnoreQueryFilters().ToListAsync();
    Console.WriteLine($"IgnoreQueryFilters (admin)    : {string.Join(", ", todos.Select(p =&gt; $"{p.Nome} [{p.Empresa}{(p.Excluido ? ", excluído" : "")}]"))}");

    var teclado = await buscarPorNome(db, "Teclado");
    Console.WriteLine($"Auditoria do Teclado          : criado por '{teclado!.CriadoPor}', data preenchida? {teclado.CriadoEm != default}");
}

public class UsuarioAtual
{
    public string Nome { get; set; } = "";
    public string Empresa { get; set; } = "";
}

public interface IAuditavel { string CriadoPor { get; set; } DateTime CriadoEm { get; set; } }
public interface IExclusaoLogica { bool Excluido { get; set; } }

public class Produto : IAuditavel, IExclusaoLogica
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public string Empresa { get; set; } = "";
    public string CriadoPor { get; set; } = "";
    public DateTime CriadoEm { get; set; }
    public bool Excluido { get; set; }
}

public class AppDb(SqliteConnection conexao, UsuarioAtual usuario) : DbContext
{
    public DbSet&lt;Produto&gt; Produtos =&gt; Set&lt;Produto&gt;();
    public string EmpresaAtual =&gt; usuario.Empresa;   // lido a CADA consulta, por instância do contexto

    protected override void OnConfiguring(DbContextOptionsBuilder o) =&gt;
        o.UseSqlite(conexao).AddInterceptors(new AuditoriaInterceptor(usuario));

    // Global query filter: aplicado AUTOMATICAMENTE em toda consulta de Produto
    protected override void OnModelCreating(ModelBuilder mb) =&gt;
        mb.Entity&lt;Produto&gt;().HasQueryFilter(p =&gt; !p.Excluido &amp;&amp; p.Empresa == EmpresaAtual);
}

// Interceptor: roda antes de todo SaveChanges, para qualquer entidade
public class AuditoriaInterceptor(UsuarioAtual usuario) : SaveChangesInterceptor
{
    public override ValueTask&lt;InterceptionResult&lt;int&gt;&gt; SavingChangesAsync(
        DbContextEventData dados, InterceptionResult&lt;int&gt; resultado, CancellationToken ct = default)
    {
        foreach (var entrada in dados.Context!.ChangeTracker.Entries())
        {
            if (entrada.State == EntityState.Added &amp;&amp; entrada.Entity is IAuditavel novo)
            {
                novo.CriadoPor = usuario.Nome;
                novo.CriadoEm = DateTime.UtcNow;
            }
            if (entrada.State == EntityState.Deleted &amp;&amp; entrada.Entity is IExclusaoLogica excluido)
            {
                entrada.State = EntityState.Modified;   // em vez de DELETE, um UPDATE
                excluido.Excluido = true;
            }
        }
        return base.SavingChangesAsync(dados, resultado, ct);
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Consulta normal (com filtros) : Teclado
IgnoreQueryFilters (admin)    : Teclado [loja-a], Mouse [loja-a, excluído], Monitor [loja-b]
Auditoria do Teclado          : criado por 'ana', data preenchida? True</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>HasQueryFilter(p =&gt; !p.Excluido &amp;&amp; p.Empresa == EmpresaAtual)</code>: toda consulta de <code>Produto</code> recebe esse <code>WHERE</code>. O Monitor (de outra empresa) e o Mouse (excluído) somem.</li>
  <li>O filtro usa a propriedade <code>EmpresaAtual</code> do próprio <code>DbContext</code>: o EF lê o valor a cada consulta, por instância. Não use uma variável fixa, que ficaria "congelada" no modelo em cache.</li>
  <li><code>IgnoreQueryFilters()</code> desliga os filtros explicitamente — para telas de administração ou auditoria.</li>
  <li><code>AuditoriaInterceptor</code> preenche <code>CriadoPor</code>/<code>CriadoEm</code> e troca o <code>DELETE</code> por um <code>UPDATE Excluido = 1</code>.</li>
</ul>

<div class="info-box danger">
  <div class="info-box-label">🚨 Multi-tenant com filtro global: nunca confie só nele</div>
  <p>O filtro é uma ótima rede de segurança, mas SQL escrito à mão (<code>FromSql</code>, Dapper) e <code>IgnoreQueryFilters()</code> passam por cima dele. Em sistemas multi-tenant críticos, combine com <em>Row-Level Security</em> no próprio banco ou com bancos separados por cliente.</p>
</div>

<h2>5.2 Dapper para Consultas Complexas</h2>

<p class="step-label">📘 O conceito</p>
<p><strong>Dapper</strong> é um "micro-ORM": você escreve o SQL, e ele só faz a ponte entre os <strong>parâmetros</strong> e as <strong>colunas</strong> e os seus objetos C#. É praticamente tão rápido quanto ADO.NET puro. Brilha em relatórios, agregações, consultas com recursos específicos do banco e em telas de leitura muito acessadas. Uma arquitetura comum é EF Core para escrita (com regras e rastreamento) e Dapper para leituras pesadas — o CQRS do Capítulo 6.2 aplicado aos dados.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Carro automático e câmbio manual</div>
  <p>O EF Core é o carro automático: confortável, faz as trocas por você, ótimo para o dia a dia. O Dapper é o câmbio manual: dá mais trabalho, mas você escolhe exatamente a marcha — e, numa subida difícil (um relatório pesado), faz toda a diferença. Muitas equipes têm os dois na garagem.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Dapper --version 2.1.66</code><br><code>dotnet add package Microsoft.Data.Sqlite --version 8.0.31</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
using Dapper;
using Microsoft.Data.Sqlite;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

using var conexao = new SqliteConnection("Data Source=:memory:");
conexao.Open();

// Com Dapper, VOCÊ escreve o SQL; ele só faz a ponte entre parâmetros/colunas e objetos C#
await conexao.ExecuteAsync("""
    CREATE TABLE Clientes (Id INTEGER PRIMARY KEY, Nome TEXT);
    CREATE TABLE Pedidos  (Id INTEGER PRIMARY KEY, ClienteId INTEGER, Total REAL, Status TEXT);
    INSERT INTO Clientes VALUES (1, 'Ana'), (2, 'Bruno');
    INSERT INTO Pedidos VALUES (10, 1, 250.0, 'Pago'), (11, 1, 80.0, 'Pago'), (12, 2, 40.0, 'Cancelado');
    """);

// 1) Parâmetros (@Status): o valor viaja SEPARADO do SQL — imune a SQL injection
var pagos = await conexao.QueryAsync&lt;Pedido&gt;(
    "SELECT Id, ClienteId, Total, Status FROM Pedidos WHERE Status = @Status",
    new { Status = "Pago" });
Console.WriteLine($"Pagos: {string.Join(" | ", pagos.Select(p =&gt; $"#{p.Id} {p.Total:C}"))}");

// 2) Multi-mapping: cada linha do JOIN vira um Pedido COM o seu Cliente
var pedidos = await conexao.QueryAsync&lt;Pedido, Cliente, Pedido&gt;(
    """
    SELECT p.Id, p.ClienteId, p.Total, p.Status, c.Id, c.Nome
    FROM Pedidos p JOIN Clientes c ON c.Id = p.ClienteId
    ORDER BY p.Id
    """,
    (pedido, cliente) =&gt; { pedido.Cliente = cliente; return pedido; },
    splitOn: "Id");   // a partir da SEGUNDA coluna "Id", os campos pertencem ao Cliente
foreach (var p in pedidos)
    Console.WriteLine($"Pedido #{p.Id} de {p.Cliente?.Nome,-5} -&gt; {p.Status}");

// 3) Relatório: agregação escrita em SQL, onde o banco é imbatível
var resumo = await conexao.QueryAsync&lt;ResumoPorCliente&gt;(
    """
    SELECT c.Nome, COUNT(*) AS Quantidade, SUM(p.Total) AS Soma
    FROM Pedidos p JOIN Clientes c ON c.Id = p.ClienteId
    WHERE p.Status = 'Pago'
    GROUP BY c.Nome
    """);
foreach (var r in resumo)
    Console.WriteLine($"Resumo: {r.Nome} tem {r.Quantidade} pedidos pagos, somando {r.Soma:C}");

public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
}

public class Pedido
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = "";
    public Cliente? Cliente { get; set; }
}

public class ResumoPorCliente
{
    public string Nome { get; set; } = "";
    public int Quantidade { get; set; }
    public decimal Soma { get; set; }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Pagos: #10 R$ 250,00 | #11 R$ 80,00
Pedido #10 de Ana   -&gt; Pago
Pedido #11 de Ana   -&gt; Pago
Pedido #12 de Bruno -&gt; Cancelado
Resumo: Ana tem 2 pedidos pagos, somando R$ 330,00</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>new { Status = "Pago" }</code> vira o parâmetro <code>@Status</code>. O valor viaja separado do SQL, e é isso que impede SQL injection.</li>
  <li><code>QueryAsync&lt;Pedido, Cliente, Pedido&gt;</code> com <code>splitOn: "Id"</code>: o Dapper corta cada linha do JOIN na segunda coluna <code>Id</code> e entrega dois objetos para você combinar.</li>
  <li>Para relatórios, o banco agrega (<code>COUNT</code>, <code>SUM</code>, <code>GROUP BY</code>) muito melhor do que carregar tudo em memória e usar LINQ.</li>
</ul>

<div class="info-box danger">
  <div class="info-box-label">🚨 SQL injection: a regra que não tem exceção</div>
  <p>Nunca monte SQL concatenando valores: <code>$"... WHERE Nome = '{nome}'"</code>. Um nome como <code>' OR 1=1; DROP TABLE Clientes; --</code> vira código executado no seu banco. Use <strong>sempre</strong> parâmetros — no Dapper, no ADO.NET ou no <code>FromSql</code> do EF Core (que parametriza as interpolações automaticamente).</p>
</div>

<h2>5.3 Cache Distribuído com Redis</h2>

<p class="step-label">📘 O conceito</p>
<p>Um <strong>cache</strong> guarda o resultado de uma operação cara (uma consulta, uma chamada externa) num lugar muito mais rápido, para reaproveitar. O padrão mais comum é o <strong>cache-aside</strong>: a aplicação procura no cache; se não achar (<em>miss</em>), busca na fonte e guarda no cache com uma validade; ao alterar o dado, <strong>invalida</strong> a entrada. Com vários servidores, o cache precisa ser <strong>distribuído</strong> (Redis), para que todos vejam o mesmo dado.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O post-it na geladeira</div>
  <p>Toda vez que alguém pergunta a senha do Wi-Fi, você teria que ir até o roteador, virar e ler a etiqueta. Em vez disso, cola um post-it na geladeira. Se trocar a senha, precisa trocar o post-it também — senão todo mundo tenta a senha velha (o <em>cache desatualizado</em>). E se o post-it cair, ainda dá para ir até o roteador: mais lento, mas funciona.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
flowchart LR
    A["Pedido do produto 1"] --&gt; B{"Está no cache?"}
    B -- "sim (hit)" --&gt; C["Devolve do cache&lt;br/&gt;em ~1 ms"]
    B -- "não (miss)" --&gt; D["Busca no banco&lt;br/&gt;~100 ms"]
    D --&gt; E["Guarda no cache&lt;br/&gt;com validade"]
    E --&gt; F["Devolve"]
    G["Produto alterado"] --&gt; H["Salva no banco"] --&gt; I["Remove do cache"]
  </pre>
  <figcaption>Cache-aside: ler, e se não achar, buscar e guardar; ao alterar, invalidar.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Microsoft.Extensions.Caching.Memory --version 8.0.1</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

// Em produção: builder.Services.AddStackExchangeRedisCache(...). A interface é a MESMA.
IDistributedCache cache = new MemoryDistributedCache(Options.Create(new MemoryDistributedCacheOptions()));
var banco = new BancoLento();
var catalogo = new CatalogoComCache(cache, banco);

Console.WriteLine(await catalogo.ObterAsync(1));   // não está no cache: vai ao banco e guarda
Console.WriteLine(await catalogo.ObterAsync(1));   // está no cache: nem toca no banco
await catalogo.AtualizarPrecoAsync(1, 199m);       // grava no banco e INVALIDA o cache
Console.WriteLine(await catalogo.ObterAsync(1));   // busca de novo e traz o preço novo
Console.WriteLine($"Consultas ao banco até aqui: {banco.Consultas}");

// E se o Redis cair? O sistema fica mais lento, mas continua respondendo
var semRedis = new CatalogoComCache(new CacheForaDoAr(), banco);
Console.WriteLine(await semRedis.ObterAsync(1));

public record Produto(int Id, string Nome, decimal Preco);

public class BancoLento
{
    private readonly Dictionary&lt;int, Produto&gt; _tabela = new() { [1] = new(1, "Teclado", 250m) };
    public int Consultas { get; private set; }

    public async Task&lt;Produto?&gt; BuscarAsync(int id)
    {
        Consultas++;
        await Task.Delay(100);   // simula uma consulta lenta
        return _tabela.GetValueOrDefault(id);
    }

    public Task SalvarAsync(Produto produto)
    {
        _tabela[produto.Id] = produto;
        return Task.CompletedTask;
    }
}

// Cache-aside: a APLICAÇÃO decide quando ler, gravar e invalidar o cache
public class CatalogoComCache(IDistributedCache cache, BancoLento banco)
{
    private static readonly DistributedCacheEntryOptions Validade = new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),   // nunca guarde para sempre
    };

    public async Task&lt;string&gt; ObterAsync(int id)
    {
        string chave = $"produto:{id}";
        try
        {
            string? json = await cache.GetStringAsync(chave);                       // 1) procura no cache
            if (json is not null) return $"[cache] {JsonSerializer.Deserialize&lt;Produto&gt;(json)}";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"   (cache indisponível: {ex.Message} — seguindo pelo banco)");
        }

        var produto = await banco.BuscarAsync(id);                                  // 2) não achou: banco
        if (produto is null) return "não encontrado";

        try { await cache.SetStringAsync(chave, JsonSerializer.Serialize(produto), Validade); }   // 3) guarda
        catch { /* falhar ao gravar no cache não pode derrubar a requisição */ }
        return $"[banco] {produto}";
    }

    public async Task AtualizarPrecoAsync(int id, decimal preco)
    {
        var atual = await banco.BuscarAsync(id);
        await banco.SalvarAsync(atual! with { Preco = preco });
        await cache.RemoveAsync($"produto:{id}");   // a próxima leitura vai buscar o valor novo
    }
}

// Simula um Redis fora do ar
public class CacheForaDoAr : IDistributedCache
{
    private static Exception Erro =&gt; new TimeoutException("Redis não respondeu");
    public byte[]? Get(string key) =&gt; throw Erro;
    public Task&lt;byte[]?&gt; GetAsync(string key, CancellationToken token = default) =&gt; throw Erro;
    public void Set(string key, byte[] value, DistributedCacheEntryOptions options) =&gt; throw Erro;
    public Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options, CancellationToken token = default) =&gt; throw Erro;
    public void Refresh(string key) =&gt; throw Erro;
    public Task RefreshAsync(string key, CancellationToken token = default) =&gt; throw Erro;
    public void Remove(string key) =&gt; throw Erro;
    public Task RemoveAsync(string key, CancellationToken token = default) =&gt; throw Erro;
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>[banco] Produto { Id = 1, Nome = Teclado, Preco = 250 }
[cache] Produto { Id = 1, Nome = Teclado, Preco = 250 }
[banco] Produto { Id = 1, Nome = Teclado, Preco = 199 }
Consultas ao banco até aqui: 3
   (cache indisponível: Redis não respondeu — seguindo pelo banco)
[banco] Produto { Id = 1, Nome = Teclado, Preco = 199 }</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>A primeira leitura vem do <code>[banco]</code> (~100 ms), e a segunda, do <code>[cache]</code>, sem tocar no banco.</li>
  <li><code>AtualizarPrecoAsync</code> salva no banco e <strong>remove</strong> a chave do cache. A próxima leitura busca o preço novo.</li>
  <li>Com o <code>CacheForaDoAr</code>, o <code>try/catch</code> faz a aplicação seguir pelo banco: o cache é uma otimização, e a queda dele não pode derrubar o sistema (<em>degradação graciosa</em>).</li>
  <li><code>MemoryDistributedCache</code> implementa a mesma interface <code>IDistributedCache</code> do Redis. Em produção, basta trocar o registro para <code>AddStackExchangeRedisCache</code>.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Program.cs de produção
builder.Services.AddStackExchangeRedisCache(o =&gt;
{
    o.Configuration = builder.Configuration.GetConnectionString("Redis");
    o.InstanceName = "loja:";   // prefixo das chaves, para dividir o Redis entre aplicações
});
// .NET 9+: HybridCache junta cache em memória + Redis e já protege contra "cache stampede"
// builder.Services.AddHybridCache();</code></pre>
</div>

<div class="info-box warning">
  <div class="info-box-label">⚠️ As três armadilhas do cache</div>
  <ul><li><strong>Sem validade</strong>: dados desatualizados para sempre. Sempre defina uma expiração.</li><li><strong>Invalidação esquecida</strong>: todo código que altera o dado precisa remover (ou atualizar) a entrada no cache.</li><li><strong>Cache stampede</strong>: quando uma chave muito acessada expira, centenas de requisições vão ao banco ao mesmo tempo. Use um <code>SemaphoreSlim</code> por chave (Capítulo 3.2.2) ou o <code>HybridCache</code>, que já trata isso.</li></ul>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Cache-aside: procure, busque, guarde com validade e invalide ao alterar; e se o cache cair, siga pelo banco.</p>
</div>

<h2>5.4 MongoDB e Elasticsearch</h2>

<p class="step-label">📘 O conceito</p>
<p>Nem todo dado cabe bem em tabelas. A <strong>persistência poliglota</strong> é usar o banco certo para cada tipo de dado:</p>

<table>
  <thead><tr><th>Banco</th><th>Modelo</th><th>Use para</th><th>Evite para</th></tr></thead>
  <tbody>
    <tr><td>SQL Server / PostgreSQL</td><td>Tabelas e relações</td><td>Transações, dados financeiros, consistência forte</td><td>Estruturas que mudam a cada registro</td></tr>
    <tr><td>Redis</td><td>Chave-valor em memória</td><td>Cache, sessões, contadores, filas simples</td><td>Fonte da verdade de dados importantes</td></tr>
    <tr><td>MongoDB</td><td>Documentos JSON</td><td>Catálogos com atributos variados, eventos, logs de auditoria</td><td>Muitos relacionamentos e JOINs</td></tr>
    <tr><td>Elasticsearch</td><td>Índice invertido</td><td>Busca por texto, filtros facetados, tolerância a erros de digitação</td><td>Fonte da verdade (é um índice derivado)</td></tr>
  </tbody>
</table>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A biblioteca</div>
  <p>O <strong>banco relacional</strong> é o sistema de empréstimos: cada livro, leitor e empréstimo registrado com rigor. O <strong>MongoDB</strong> é a pasta de cada livro, com anotações que variam de um para outro. O <strong>Elasticsearch</strong> é o índice remissivo no fim do livro — encontra "assíncrono" em todas as páginas em que aparece, mesmo que você digite "asincrono". E o <strong>Redis</strong> é o balcão com os mais pedidos da semana, à mão.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="Persistência poliglota: a API usa o banco relacional para transações, o Redis para cache, o MongoDB para documentos flexíveis e o Elasticsearch para busca textual">
    <defs><marker id="c5d3-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c5d3-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c5d3-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="95" width="150" height="60" rx="8"/>
    <text x="85.0" y="112.0" text-anchor="middle" font-weight="600">API</text>
    <text class="t-muted" x="85.0" y="130.0" text-anchor="middle">cada dado no</text>
    <text class="t-muted" x="85.0" y="148.0" text-anchor="middle">lugar certo</text>
    <rect class="box" x="330" y="10" width="380" height="50" rx="8"/>
    <text x="520.0" y="31.0" text-anchor="middle" font-weight="600">SQL Server / PostgreSQL</text>
    <text class="t-muted" x="520.0" y="49.0" text-anchor="middle">pedidos, pagamentos: transações</text>
    <path class="line" d="M160,125 C240,125 250,35 326,35" marker-end="url(#c5d3-head)"/>
    <rect class="box-bad" x="330" y="70" width="380" height="50" rx="8"/>
    <text x="520.0" y="91.0" text-anchor="middle" font-weight="600">Redis</text>
    <text class="t-muted" x="520.0" y="109.0" text-anchor="middle">cache, sessões: milissegundos</text>
    <path class="line" d="M160,125 C240,125 250,95 326,95" marker-end="url(#c5d3-head)"/>
    <rect class="box-good" x="330" y="130" width="380" height="50" rx="8"/>
    <text x="520.0" y="151.0" text-anchor="middle" font-weight="600">MongoDB</text>
    <text class="t-muted" x="520.0" y="169.0" text-anchor="middle">catálogo, eventos: formato flexível</text>
    <path class="line" d="M160,125 C240,125 250,155 326,155" marker-end="url(#c5d3-head)"/>
    <rect class="box-warn" x="330" y="190" width="380" height="50" rx="8"/>
    <text x="520.0" y="211.0" text-anchor="middle" font-weight="600">Elasticsearch</text>
    <text class="t-muted" x="520.0" y="229.0" text-anchor="middle">busca por texto, com erros de digitação</text>
    <path class="line" d="M160,125 C240,125 250,215 326,215" marker-end="url(#c5d3-head)"/>
  </svg>
  <figcaption>Persistência poliglota: não existe "o melhor banco", existe o melhor banco para cada tipo de dado.</figcaption>
</figure>

<div class="info-box info">
  <div class="info-box-label">🐳 Para experimentar localmente</div>
  <p>MongoDB e Elasticsearch precisam de um servidor. Com Docker: <code>docker run -d -p 27017:27017 mongo:7</code> e <code>docker run -d -p 9200:9200 -e discovery.type=single-node -e xpack.security.enabled=false elasticsearch:8.15.0</code>. Os pacotes são <code>MongoDB.Driver</code> e <code>Elastic.Clients.Elasticsearch</code>.</p>
</div>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// MongoDB: cada documento pode ter atributos diferentes (um celular tem "memória", um sofá não)
var colecao = new MongoClient("mongodb://localhost:27017")
    .GetDatabase("catalogo").GetCollection&lt;ProdutoDoc&gt;("produtos");

await colecao.Indexes.CreateOneAsync(new CreateIndexModel&lt;ProdutoDoc&gt;(
    Builders&lt;ProdutoDoc&gt;.IndexKeys.Ascending(p =&gt; p.Categoria).Descending(p =&gt; p.CriadoEm)));

var celulares = await colecao.Find(p =&gt; p.Categoria == "celular" &amp;&amp; p.Preco &lt; 3000m)
                             .SortByDescending(p =&gt; p.CriadoEm).Limit(20).ToListAsync();

// Elasticsearch: busca textual com peso por campo e tolerância a erros de digitação
var resultado = await elastic.SearchAsync&lt;ProdutoDoc&gt;(s =&gt; s
    .Index("produtos")
    .Query(q =&gt; q.MultiMatch(m =&gt; m
        .Fields(new[] { "nome^3", "descricao" })   // o nome vale 3× mais que a descrição
        .Query("teclado mecanico")
        .Fuzziness(new Fuzziness("AUTO"))))         // encontra "teclado mecânico" e "tecldo"
    .Size(20));</code></pre>
</div>

<div class="info-box warning">
  <div class="info-box-label">⚠️ O Elasticsearch não é a fonte da verdade</div>
  <p>Ele é um índice <em>derivado</em>: os dados nascem no banco principal e são copiados para o Elasticsearch — de preferência por eventos (Capítulo 7), para não "esquecer" de atualizar. Se o índice se corromper, você o reconstrói a partir do banco.</p>
</div>

<div class="challenge-box">
  <div class="challenge-box-header">
    <span class="challenge-box-icon">🎯</span>
    <span class="challenge-box-title">Desafio Prático — Capítulo 5</span>
  </div>
  <p>Monte o acesso a dados de uma <strong>loja</strong> num único programa com SQLite em memória:</p>
  <ol>
    <li>Mapeie <code>Pedido</code> com um Value Object <code>Dinheiro</code> e um owned type <code>Endereco</code> (5.1.1).</li>
    <li>Crie uma tela "últimos pedidos com nome do cliente" e prove, com o interceptor contador, que ela faz <strong>1</strong> consulta (5.1.2).</li>
    <li>Adicione concorrência otimista ao estoque e simule duas vendas simultâneas do último item (5.1.3).</li>
    <li>Escreva o relatório "faturamento por mês" com Dapper e coloque-o atrás de um cache-aside de 5 minutos, invalidado quando um pedido é pago (5.2 e 5.3).</li>
  </ol>
  <p>Bônus: meça com <code>Stopwatch</code> a diferença entre a primeira leitura do relatório (banco) e a segunda (cache).</p>
</div>
`
},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 6 — ARQUITETURA DE SOFTWARE
══════════════════════════════════════════════════════════ */
{
  id: 6, slug: 'arquitetura', icon: '🏛️', color: '#6366f1',
  title: 'Arquitetura de Software',
  subtitle: 'Clean Architecture, CQRS, Event Sourcing, Outbox e Monólito Modular',
  desc: 'Clean Architecture com teste de dependências, CQRS com um mediador escrito à mão, Event Sourcing com viagem no tempo, Outbox Pattern e quando (não) usar microservices.',
  tags: ['Clean Arch','CQRS','Event Sourcing','Outbox','Microservices'],
  readTime: 40,
  intro: `Arquitetura não é sobre o futuro perfeito — é sobre manter a <em>opcionalidade</em> quando
    o futuro chegar. Um sênior entende que a melhor arquitetura é a mais simples que resolve o
    problema atual com as extensões corretas para os problemas previsíveis. Monólito modular
    frequentemente supera microservices prematuros em equipes pequenas.`,
  content: `
<div class="info-box info">
  <div class="info-box-label">🧭 Como estudar este capítulo</div>
  <p>Arquitetura é o assunto em que mais se fala e menos se vê código rodando. Aqui, cada padrão é um programa <strong>pequeno e completo</strong>: as camadas da Clean Architecture num arquivo só, um mediador de CQRS escrito à mão, uma conta corrente em Event Sourcing e uma Outbox que sobrevive à queda do broker. Entenda o mecanismo primeiro; as bibliotecas vêm depois.</p>
</div>

<h2>6.1 Clean Architecture</h2>

<p class="step-label">📘 O conceito</p>
<p>A <strong>Clean Architecture</strong> organiza o sistema em camadas concêntricas com uma única regra: <strong>as dependências apontam só para dentro</strong>. No centro fica o <strong>Domínio</strong> (as regras de negócio), que não conhece banco, HTTP nem frameworks. Quando o domínio precisa de algo externo (salvar, enviar e-mail), ele <em>declara uma interface</em> (uma "porta"), e a Infraestrutura a implementa. Resultado: dá para trocar o banco, o framework web ou o provedor de e-mail sem tocar nas regras — e testar as regras sem nada disso.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: As receitas e a cozinha</div>
  <p>As receitas de um restaurante (o domínio) não mudam se ele trocar o fogão a gás por um de indução, ou o fornecedor de tomates (a infraestrutura). O cozinheiro-chefe (a aplicação) segue as receitas usando os equipamentos disponíveis. Se a receita dissesse "use o fogão Brastemp modelo X", qualquer reforma na cozinha obrigaria a reescrever o livro de receitas.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 300" role="img" aria-label="Clean Architecture em círculos: no centro o Domínio, em volta a Aplicação, e por fora a Infraestrutura e a API. Todas as setas de dependência apontam para dentro">
    <defs><marker id="c6d1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c6d1-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c6d1-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <circle class="box" cx="200" cy="150" r="140"/>
    <text x="200" y="26" text-anchor="middle" font-weight="600">API / Infraestrutura</text>
    <circle class="box-warn" cx="200" cy="150" r="98"/>
    <text x="200" y="68" text-anchor="middle" font-weight="600">Aplicação</text>
    <circle class="box-accent" cx="200" cy="150" r="54"/>
    <text x="200" y="155" text-anchor="middle" font-weight="600">Domínio</text>
    <text class="t-muted" x="200" y="175" text-anchor="middle">regras</text>
    <path class="line-good" d="M66,150 L100,150" marker-end="url(#c6d1-head-good)"/>
    <path class="line-good" d="M108,150 L142,150" marker-end="url(#c6d1-head-good)"/>
    <text class="t-good" x="380" y="40">Dependências SÓ para dentro</text>
    <text x="380" y="70" font-weight="600">Domínio</text>
    <text class="t-muted" x="380" y="88">entidades, value objects, regras, interfaces (portas)</text>
    <text class="t-muted" x="380" y="104">zero pacotes externos</text>
    <text x="380" y="124" font-weight="600">Aplicação</text>
    <text class="t-muted" x="380" y="142">casos de uso, commands e queries</text>
    <text class="t-muted" x="380" y="158">conhece só o Domínio</text>
    <text x="380" y="178" font-weight="600">Infraestrutura</text>
    <text class="t-muted" x="380" y="196">EF Core, e-mail, filas, APIs externas</text>
    <text class="t-muted" x="380" y="212">implementa as portas</text>
    <text x="380" y="232" font-weight="600">API</text>
    <text class="t-muted" x="380" y="250">endpoints, middlewares, Program.cs</text>
    <text class="t-muted" x="380" y="266">liga tudo (composition root)</text>
  </svg>
  <figcaption>As camadas de dentro não sabem que as de fora existem: trocar o banco não mexe nas regras.</figcaption>
</figure>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">estrutura de pastas</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-bash">src/
├── Domain/              # zero dependências externas
│   ├── Entities/        # Order, Customer, Product
│   ├── ValueObjects/    # Money, Email, Address
│   ├── Enums/           # OrderStatus, PaymentMethod
│   ├── Events/          # OrderPlaced, OrderShipped (IDomainEvent)
│   ├── Exceptions/      # DomainException, NotFoundException
│   └── Interfaces/      # IOrderRepository, IUnitOfWork
├── Application/         # depende apenas de Domain
│   ├── UseCases/        # PlaceOrder, CancelOrder, GetOrder
│   ├── Commands/        # PlaceOrderCommand, CancelOrderCommand
│   ├── Queries/         # GetOrderQuery, ListOrdersQuery
│   ├── DTOs/            # OrderDto, CreateOrderDto
│   ├── Validators/      # FluentValidation validators
│   ├── Behaviors/       # LoggingBehavior, ValidationBehavior (MediatR)
│   └── Interfaces/      # IEmailService, IEventBus, ICurrentUser
├── Infrastructure/      # implementa interfaces de Domain + Application
│   ├── Persistence/     # EF Core DbContext, Repositories
│   ├── Messaging/       # RabbitMQ, Azure Service Bus
│   ├── Cache/           # Redis implementation
│   └── ExternalServices/
└── API/                 # Presentation — depende de Application
    ├── Controllers/     # ou Endpoints/ para Minimal APIs
    ├── Middleware/
    ├── Extensions/      # DI registration
    └── Program.cs</code></pre>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
using System.Reflection;
using Aplicacao;
using Dominio;
using Infraestrutura;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// COMPOSITION ROOT: o único lugar que conhece TODAS as camadas e liga as peças
// (numa API real, é o Program.cs registrando tudo no contêiner de DI)
IRepositorioDePedidos repositorio = new RepositorioEmMemoria();
INotificador notificador = new NotificadorNoConsole();
var criarPedido = new CriarPedido(repositorio, notificador);

criarPedido.Executar(new CriarPedidoComando("ana@email.com", 3, 49.90m));
Console.WriteLine($"Pedidos no repositório: {repositorio.Contar()}");

try { criarPedido.Executar(new CriarPedidoComando("bruno@email.com", 0, 10m)); }
catch (RegraDeNegocioException ex) { Console.WriteLine($"Recusado pelo DOMÍNIO: {ex.Message}"); }

// Um "teste de arquitetura": verifica, por reflexão, quem depende de quem
Console.WriteLine();
Verificar("Dominio", proibidas: ["Aplicacao", "Infraestrutura"]);
Verificar("Aplicacao", proibidas: ["Infraestrutura"]);

static void Verificar(string camada, string[] proibidas)
{
    var violacoes = Assembly.GetExecutingAssembly().GetTypes()
        .Where(t =&gt; t.Namespace == camada)
        .SelectMany(t =&gt; Dependencias(t).Where(d =&gt; proibidas.Contains(d.Namespace)).Select(d =&gt; $"{t.Name} -&gt; {d.Name}"))
        .ToList();
    Console.WriteLine($"{camada,-9} respeita a regra de dependência? {(violacoes.Count == 0 ? "sim" : "NÃO: " + string.Join(", ", violacoes))}");
}

static IEnumerable&lt;Type&gt; Dependencias(Type tipo) =&gt;
    tipo.GetConstructors().SelectMany(c =&gt; c.GetParameters()).Select(p =&gt; p.ParameterType)
        .Concat(tipo.GetFields(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic).Select(f =&gt; f.FieldType))
        .Concat(tipo.GetInterfaces());

namespace Dominio   // O CENTRO: regras de negócio, sem nenhuma dependência técnica
{
    public class RegraDeNegocioException(string mensagem) : Exception(mensagem);

    public class Pedido
    {
        public string Cliente { get; }
        public decimal Total { get; }

        public Pedido(string cliente, int quantidade, decimal precoUnitario)
        {
            if (quantidade &lt;= 0) throw new RegraDeNegocioException("a quantidade deve ser positiva.");
            Cliente = cliente;
            Total = quantidade * precoUnitario;
        }
    }

    // O domínio DECLARA o que precisa; quem implementa é a infraestrutura
    public interface IRepositorioDePedidos
    {
        void Salvar(Pedido pedido);
        int Contar();
    }
}

namespace Aplicacao   // CASOS DE USO: orquestram o domínio, sem saber de banco ou de e-mail
{
    using Dominio;

    public record CriarPedidoComando(string Cliente, int Quantidade, decimal PrecoUnitario);

    public interface INotificador { void Avisar(string para, string mensagem); }

    public class CriarPedido(IRepositorioDePedidos repositorio, INotificador notificador)
    {
        public void Executar(CriarPedidoComando comando)
        {
            var pedido = new Pedido(comando.Cliente, comando.Quantidade, comando.PrecoUnitario);   // regra: domínio
            repositorio.Salvar(pedido);                                                              // porta de saída
            notificador.Avisar(pedido.Cliente, $"pedido de {pedido.Total:C} recebido");             // porta de saída
        }
    }
}

namespace Infraestrutura   // DETALHES TÉCNICOS: implementam as portas das camadas de dentro
{
    using Aplicacao;
    using Dominio;

    public class RepositorioEmMemoria : IRepositorioDePedidos
    {
        private readonly List&lt;Pedido&gt; _pedidos = [];
        public void Salvar(Pedido pedido) =&gt; _pedidos.Add(pedido);
        public int Contar() =&gt; _pedidos.Count;
    }

    public class NotificadorNoConsole : INotificador
    {
        public void Avisar(string para, string mensagem) =&gt; Console.WriteLine($"[e-mail para {para}] {mensagem}");
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>[e-mail para ana@email.com] pedido de R$ 149,70 recebido
Pedidos no repositório: 1
Recusado pelo DOMÍNIO: a quantidade deve ser positiva.

Dominio   respeita a regra de dependência? sim
Aplicacao respeita a regra de dependência? sim</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Os <code>namespace</code>s representam as camadas. Num projeto real, cada camada é um projeto (<code>.csproj</code>) separado, e a regra de dependência é garantida pelas referências entre projetos.</li>
  <li><code>IRepositorioDePedidos</code> é declarado no Domínio e implementado na Infraestrutura: é a inversão de dependência (Capítulo 2.2.5) em escala de arquitetura.</li>
  <li>O caso de uso <code>CriarPedido</code> só orquestra: a regra "quantidade positiva" está no Domínio, que é quem recusa o segundo pedido.</li>
  <li>O "teste de arquitetura" varre os tipos por reflexão e confere que Domínio e Aplicação não dependem da Infraestrutura. Em projetos reais, use <strong>NetArchTest</strong> ou <strong>ArchUnitNET</strong> numa suíte de testes para que ninguém quebre a regra sem perceber.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Sinais de que a regra foi quebrada</div>
  <ul><li><code>using Microsoft.EntityFrameworkCore</code> ou atributos de banco dentro de uma entidade de domínio.</li><li>Um caso de uso que recebe <code>HttpContext</code> ou devolve <code>IActionResult</code>.</li><li>Regras de negócio espalhadas em controllers ou repositórios.</li></ul><p>E o sinal oposto também é problema: <strong>camadas demais para um CRUD simples</strong>. Clean Architecture paga o seu custo quando há regras de negócio de verdade; para um cadastro trivial, uma Minimal API com EF Core direto é a escolha sênior.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>O domínio no centro, sem dependências; tudo que é técnico fica por fora e se "pluga" nas interfaces que o domínio declara.</p>
</div>

<h2>6.2 CQRS e o Padrão Mediator</h2>

<p class="step-label">📘 O conceito</p>
<p><strong>CQRS</strong> (Command Query Responsibility Segregation) separa as operações em dois grupos: <strong>commands</strong>, que <em>mudam</em> o estado (criar pedido, cancelar) e aplicam regras, e <strong>queries</strong>, que só <em>leem</em> e devolvem dados no formato da tela. Cada lado pode ser otimizado de forma independente: escrita com EF Core e agregados; leitura com Dapper, views ou até um banco separado.</p><p>O padrão <strong>Mediator</strong> costuma acompanhar o CQRS: cada mensagem tem <em>um</em> handler, e comportamentos transversais (log, validação, transação) viram <em>behaviors</em> que envolvem todos os handlers — como os middlewares do Capítulo 4.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O caixa e a TV do cardápio</div>
  <p>Na lanchonete, o <strong>caixa</strong> registra pedidos, confere pagamento e aplica promoções: é o lado dos <em>commands</em>, cheio de regras. A <strong>TV com o cardápio e o status dos pedidos</strong> só mostra informação, num formato feito para ser lido de longe: é o lado das <em>queries</em>. Ninguém espera que a TV registre pedidos, nem que o caixa seja bonito de ler.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
graph TD
    UI[Interface do Usuário] --&gt; C[Command: Criar Pedido]
    UI --&gt; Q[Query: Obter Status]
    C --&gt; B(Validação e Regras)
    B --&gt; W[(Banco de Escrita - SQL)]
    W -. Sincroniza .-&gt; R[(Banco de Leitura - Redis/NoSQL)]
    Q --&gt; R
  </pre>
  <figcaption>Commands passam pelas regras e gravam; queries leem de um modelo otimizado para leitura.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// Montagem: registra handlers, assinantes e behaviors (o MediatR faz isso pelo contêiner de DI)
var banco = new BancoFake();
var mediador = new Mediador();
mediador.Registrar(new CriarPedidoHandler(banco, mediador));
mediador.Registrar(new ObterResumoHandler(banco));
mediador.Assinar&lt;PedidoCriado&gt;(n =&gt; Console.WriteLine($"   [e-mail]  confirmação do pedido #{n.Id} enviada"));
mediador.Assinar&lt;PedidoCriado&gt;(n =&gt; Console.WriteLine($"   [estoque] itens do pedido #{n.Id} reservados"));
mediador.AdicionarBehavior(new LogBehavior());
mediador.AdicionarBehavior(new ValidacaoBehavior());

// COMMAND: muda o estado do sistema
int id = await mediador.Enviar(new CriarPedido("Ana", [new Item("Teclado", 250m, 1), new Item("Mouse", 80m, 2)]));

// QUERY: só lê, e devolve um modelo pensado para a tela
ResumoDoPedido resumo = await mediador.Enviar(new ObterResumo(id));
Console.WriteLine($"Tela: pedido #{resumo.Id} de {resumo.Cliente} | {resumo.QuantidadeDeItens} itens | {resumo.Total:C}");

try { await mediador.Enviar(new CriarPedido("", [])); }
catch (ArgumentException ex) { Console.WriteLine($"   validação barrou: {ex.Message}"); }

// ---------- Mensagens ----------
public interface IRequisicao&lt;TResposta&gt;;
public record Item(string Produto, decimal Preco, int Quantidade);
public record CriarPedido(string Cliente, List&lt;Item&gt; Itens) : IRequisicao&lt;int&gt;;    // command
public record ObterResumo(int Id) : IRequisicao&lt;ResumoDoPedido&gt;;                    // query
public record ResumoDoPedido(int Id, string Cliente, int QuantidadeDeItens, decimal Total);
public record PedidoCriado(int Id);                                                  // notification

// ---------- Handlers: UM por mensagem, pequenos e fáceis de testar ----------
public interface IHandler&lt;TRequisicao, TResposta&gt; where TRequisicao : IRequisicao&lt;TResposta&gt;
{
    Task&lt;TResposta&gt; Tratar(TRequisicao requisicao);
}

public class CriarPedidoHandler(BancoFake banco, Mediador mediador) : IHandler&lt;CriarPedido, int&gt;
{
    public async Task&lt;int&gt; Tratar(CriarPedido comando)
    {
        int id = banco.Inserir(comando);
        await mediador.Publicar(new PedidoCriado(id));   // avisa quem se interessar, sem conhecê-los
        return id;
    }
}

public class ObterResumoHandler(BancoFake banco) : IHandler&lt;ObterResumo, ResumoDoPedido&gt;
{
    public Task&lt;ResumoDoPedido&gt; Tratar(ObterResumo consulta)
    {
        var p = banco.Buscar(consulta.Id);
        return Task.FromResult(new ResumoDoPedido(consulta.Id, p.Cliente,
            p.Itens.Sum(i =&gt; i.Quantidade), p.Itens.Sum(i =&gt; i.Preco * i.Quantidade)));
    }
}

// ---------- Behaviors: rodam em volta de TODO handler, como middlewares ----------
public interface IBehavior { Task&lt;object?&gt; Executar(object requisicao, Func&lt;Task&lt;object?&gt;&gt; proximo); }

public class LogBehavior : IBehavior
{
    public async Task&lt;object?&gt; Executar(object requisicao, Func&lt;Task&lt;object?&gt;&gt; proximo)
    {
        Console.WriteLine($"-&gt; {requisicao.GetType().Name}");
        var resposta = await proximo();
        Console.WriteLine($"&lt;- {requisicao.GetType().Name} ok");
        return resposta;
    }
}

public class ValidacaoBehavior : IBehavior
{
    public Task&lt;object?&gt; Executar(object requisicao, Func&lt;Task&lt;object?&gt;&gt; proximo)
    {
        if (requisicao is CriarPedido { Cliente: "" } or CriarPedido { Itens.Count: 0 })
            throw new ArgumentException("o pedido precisa de cliente e de pelo menos um item.");
        return proximo();
    }
}

// ---------- O mediador: uma versão mínima do que o MediatR faz ----------
public class Mediador
{
    private readonly Dictionary&lt;Type, Func&lt;object, Task&lt;object?&gt;&gt;&gt; _handlers = [];
    private readonly Dictionary&lt;Type, List&lt;Action&lt;object&gt;&gt;&gt; _assinantes = [];
    private readonly List&lt;IBehavior&gt; _behaviors = [];

    public void Registrar&lt;TReq, TResp&gt;(IHandler&lt;TReq, TResp&gt; handler) where TReq : IRequisicao&lt;TResp&gt; =&gt;
        _handlers[typeof(TReq)] = async requisicao =&gt; await handler.Tratar((TReq)requisicao);

    public void Assinar&lt;T&gt;(Action&lt;T&gt; acao)
    {
        if (!_assinantes.TryGetValue(typeof(T), out var lista)) _assinantes[typeof(T)] = lista = [];
        lista.Add(n =&gt; acao((T)n));
    }

    public void AdicionarBehavior(IBehavior behavior) =&gt; _behaviors.Add(behavior);

    public async Task&lt;TResp&gt; Enviar&lt;TResp&gt;(IRequisicao&lt;TResp&gt; requisicao)
    {
        // Monta a "cebola": o primeiro behavior adicionado fica por fora
        Func&lt;Task&lt;object?&gt;&gt; pipeline = () =&gt; _handlers[requisicao.GetType()](requisicao);
        foreach (var behavior in Enumerable.Reverse(_behaviors))
        {
            var proximo = pipeline;
            pipeline = () =&gt; behavior.Executar(requisicao, proximo);
        }
        return (TResp)(await pipeline())!;
    }

    public Task Publicar&lt;T&gt;(T notificacao) where T : notnull
    {
        if (_assinantes.TryGetValue(typeof(T), out var lista))
            foreach (var assinante in lista) assinante(notificacao);
        return Task.CompletedTask;
    }
}

public class BancoFake
{
    private readonly Dictionary&lt;int, CriarPedido&gt; _pedidos = [];
    public int Inserir(CriarPedido pedido) { int id = _pedidos.Count + 1; _pedidos[id] = pedido; return id; }
    public CriarPedido Buscar(int id) =&gt; _pedidos[id];
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>-&gt; CriarPedido
   [e-mail]  confirmação do pedido #1 enviada
   [estoque] itens do pedido #1 reservados
&lt;- CriarPedido ok
-&gt; ObterResumo
&lt;- ObterResumo ok
Tela: pedido #1 de Ana | 3 itens | R$ 410,00
-&gt; CriarPedido
   validação barrou: o pedido precisa de cliente e de pelo menos um item.</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>CriarPedido</code> (command) e <code>ObterResumo</code> (query) são records simples. Cada um tem exatamente um handler.</li>
  <li><code>Mediador.Enviar</code> monta a "cebola" de behaviors em volta do handler. Por isso a saída mostra <code>-&gt; CriarPedido</code> antes e <code>&lt;- CriarPedido ok</code> depois.</li>
  <li><code>PedidoCriado</code> é uma <em>notification</em>: publicada uma vez, tratada por vários assinantes (e-mail e estoque) que o handler não conhece.</li>
  <li>No último envio, o <code>ValidacaoBehavior</code> barra o pedido antes de ele chegar ao handler, e por isso não aparece o <code>&lt;-</code>.</li>
</ul>

<p class="step-label">🧑‍💻 O mesmo com MediatR</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// builder.Services.AddMediatR(c =&gt; c.RegisterServicesFromAssemblyContaining&lt;Program&gt;()
//                                    .AddOpenBehavior(typeof(ValidacaoBehavior&lt;,&gt;)));
public record CriarPedido(string Cliente, List&lt;Item&gt; Itens) : IRequest&lt;int&gt;;

public class CriarPedidoHandler(AppDbContext db, IPublisher publicador) : IRequestHandler&lt;CriarPedido, int&gt;
{
    public async Task&lt;int&gt; Handle(CriarPedido comando, CancellationToken ct)
    {
        var pedido = Pedido.Criar(comando.Cliente, comando.Itens);
        db.Pedidos.Add(pedido);
        await db.SaveChangesAsync(ct);
        await publicador.Publish(new PedidoCriado(pedido.Id), ct);
        return pedido.Id;
    }
}

// No endpoint:
app.MapPost("/pedidos", async (CriarPedido comando, ISender mediador) =&gt;
    Results.Ok(await mediador.Send(comando)));</code></pre>
</div>

<div class="info-box warning">
  <div class="info-box-label">⚠️ MediatR: atenção à licença</div>
  <p>A partir da versão 13 (2025), o MediatR passou a exigir licença comercial para empresas acima de um certo porte. Confira os termos antes de adotar. Alternativas: a versão 12 (Apache 2.0), o <strong>Mediator</strong> (gerado em tempo de compilação), o <strong>Wolverine</strong> — ou um mediador simples como o do exemplo acima, que cobre a maioria dos casos.</p>
</div>

<div class="info-box warning">
  <div class="info-box-label">⚠️ CQRS não exige dois bancos</div>
  <p>O ganho principal é separar <em>modelos</em> e responsabilidades. Leitura e escrita no mesmo banco (EF Core para commands, Dapper ou projeções para queries) já resolve a maioria dos sistemas. Bancos separados trazem <strong>consistência eventual</strong> (a tela pode mostrar um dado alguns segundos atrasado) e só se justificam com escala real.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Commands mudam o estado e aplicam regras; queries só leem e servem a tela. O mediador liga cada mensagem ao seu handler e aplica os comportamentos comuns.</p>
</div>

<h2>6.3 Event Sourcing</h2>

<p class="step-label">📘 O conceito</p>
<p>No modelo tradicional, o banco guarda só o <em>estado atual</em> (saldo = 750). Em <strong>Event Sourcing</strong>, guarda-se a <strong>sequência de fatos</strong> que levou a ele (conta aberta, depositou 1.000, sacou 300, depositou 50). O estado é calculado reaplicando os eventos. Nada é apagado ou sobrescrito: o <em>event store</em> só acrescenta. Ganha-se auditoria completa, "viagem no tempo" e a possibilidade de criar novas visões dos dados (projeções) a qualquer momento.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O extrato bancário</div>
  <p>O banco não guarda "o seu saldo" num campo que é sobrescrito: ele guarda cada lançamento. O saldo é a soma dos lançamentos. Um valor cobrado errado não é apagado — o banco faz um <em>estorno</em>, que é um novo lançamento. E dá para saber o saldo de qualquer dia do ano passado, porque o histórico inteiro está lá.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="Event sourcing: o stream guarda os eventos ContaAberta, Depositado 1000, Sacado 300 e Depositado 50. Aplicando-os em ordem obtém-se o saldo de 750; os mesmos eventos alimentam outras projeções, como o extrato">
    <defs><marker id="c6d2-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c6d2-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c6d2-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">STREAM "conta-42" (só acrescenta)</text>
    <rect class="box" x="10" y="36" width="120" height="56" rx="8"/>
    <text x="70.0" y="60.0" text-anchor="middle" font-weight="600">ContaAberta</text>
    <text class="t-mono" x="70.0" y="78.0" text-anchor="middle">Ana</text>
    <text class="t-muted" x="70" y="110" text-anchor="middle">v1</text>
    <rect class="box-good" x="142" y="36" width="120" height="56" rx="8"/>
    <text x="202.0" y="60.0" text-anchor="middle" font-weight="600">Depositado</text>
    <text class="t-mono" x="202.0" y="78.0" text-anchor="middle">+1.000</text>
    <text class="t-muted" x="202" y="110" text-anchor="middle">v2</text>
    <rect class="box-bad" x="274" y="36" width="120" height="56" rx="8"/>
    <text x="334.0" y="60.0" text-anchor="middle" font-weight="600">Sacado</text>
    <text class="t-mono" x="334.0" y="78.0" text-anchor="middle">−300</text>
    <text class="t-muted" x="334" y="110" text-anchor="middle">v3</text>
    <rect class="box-good" x="406" y="36" width="120" height="56" rx="8"/>
    <text x="466.0" y="60.0" text-anchor="middle" font-weight="600">Depositado</text>
    <text class="t-mono" x="466.0" y="78.0" text-anchor="middle">+50</text>
    <text class="t-muted" x="466" y="110" text-anchor="middle">v4</text>
    <path class="line" d="M540,64 L580,64" marker-end="url(#c6d2-head)"/>
    <rect class="box" x="584" y="36" width="126" height="56" rx="8"/>
    <text x="647.0" y="60.0" text-anchor="middle" font-weight="600">próximo</text>
    <text class="t-muted" x="647.0" y="78.0" text-anchor="middle">evento...</text>
    <path class="line" d="M270,120 L270,150" marker-end="url(#c6d2-head)"/>
    <rect class="box-accent" x="150" y="154" width="240" height="56" rx="8"/>
    <text x="270.0" y="178.0" text-anchor="middle" font-weight="600">Estado atual</text>
    <text class="t-mono t-muted" x="270.0" y="196.0" text-anchor="middle">saldo = 0 +1000 −300 +50 = 750</text>
    <rect class="box-warn" x="450" y="154" width="260" height="56" rx="8"/>
    <text x="580.0" y="178.0" text-anchor="middle" font-weight="600">Outras projeções</text>
    <text class="t-muted" x="580.0" y="196.0" text-anchor="middle">extrato, relatório mensal...</text>
    <path class="line" d="M390,100 C430,120 520,120 560,150" marker-end="url(#c6d2-head)"/>
    <text class="t-muted" x="10" y="240">O estado é uma CONSEQUÊNCIA dos eventos. Nada se apaga: corrigir é lançar um novo evento (um estorno).</text>
  </svg>
  <figcaption>Event sourcing: guarde os fatos; o estado é calculado a partir deles.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

var loja = new LojaDeEventos();

// 1) Comandos geram EVENTOS; só os eventos são gravados — nunca "o saldo"
var conta = new ContaCorrente();
conta.Abrir("conta-42", "Ana");
conta.Depositar(1_000m);
conta.Sacar(300m);
conta.Depositar(50m);
loja.Anexar(conta.Id, conta.NovosEventos, versaoEsperada: 0);

// 2) Para usar a conta de novo, ela é "reidratada": todos os eventos reaplicados em ordem
var atual = ContaCorrente.Reidratar(loja.Ler("conta-42"));
Console.WriteLine($"Saldo atual: {atual.Saldo:C} (versão {atual.Versao})");

// 3) Viagem no tempo: o estado em qualquer ponto do passado
var noPassado = ContaCorrente.Reidratar(loja.Ler("conta-42").Take(2));
Console.WriteLine($"Saldo logo após o 2º evento: {noPassado.Saldo:C}");

// 4) Projeção: outra "visão" montada a partir dos MESMOS eventos
Console.WriteLine("Extrato:");
foreach (var evento in loja.Ler("conta-42"))
    Console.WriteLine($"   {evento}");

// 5) As regras continuam valendo
try { atual.Sacar(5_000m); }
catch (InvalidOperationException ex) { Console.WriteLine($"Saque recusado: {ex.Message}"); }

// 6) Concorrência: duas sessões carregaram a mesma versão e tentam gravar
var sessaoA = ContaCorrente.Reidratar(loja.Ler("conta-42"));
var sessaoB = ContaCorrente.Reidratar(loja.Ler("conta-42"));
sessaoA.Sacar(100m);
loja.Anexar(sessaoA.Id, sessaoA.NovosEventos, sessaoA.VersaoCarregada);
sessaoB.Sacar(100m);
try { loja.Anexar(sessaoB.Id, sessaoB.NovosEventos, sessaoB.VersaoCarregada); }
catch (InvalidOperationException ex) { Console.WriteLine($"Conflito: {ex.Message}"); }

// ---------- Eventos: fatos que JÁ aconteceram (verbo no passado), imutáveis ----------
public abstract record Evento;
public record ContaAberta(string Id, string Titular) : Evento;
public record ValorDepositado(decimal Valor) : Evento;
public record ValorSacado(decimal Valor) : Evento;

public class ContaCorrente
{
    private readonly List&lt;Evento&gt; _novos = [];
    public string Id { get; private set; } = "";
    public decimal Saldo { get; private set; }
    public int Versao { get; private set; }
    public int VersaoCarregada { get; private set; }
    public IReadOnlyList&lt;Evento&gt; NovosEventos =&gt; _novos;

    public static ContaCorrente Reidratar(IEnumerable&lt;Evento&gt; historico)
    {
        var conta = new ContaCorrente();
        foreach (var evento in historico) conta.Aplicar(evento);
        conta.VersaoCarregada = conta.Versao;
        return conta;
    }

    // Comandos: validam as regras e REGISTRAM um evento
    public void Abrir(string id, string titular) =&gt; Registrar(new ContaAberta(id, titular));
    public void Depositar(decimal valor) =&gt; Registrar(new ValorDepositado(valor));
    public void Sacar(decimal valor)
    {
        if (valor &gt; Saldo) throw new InvalidOperationException($"o saldo de {Saldo:C} é insuficiente.");
        Registrar(new ValorSacado(valor));
    }

    private void Registrar(Evento evento)
    {
        Aplicar(evento);
        _novos.Add(evento);
    }

    // O ÚNICO lugar que muda o estado: "o que este fato significa para a conta?"
    private void Aplicar(Evento evento)
    {
        switch (evento)
        {
            case ContaAberta a: Id = a.Id; break;
            case ValorDepositado d: Saldo += d.Valor; break;
            case ValorSacado s: Saldo -= s.Valor; break;
        }
        Versao++;
    }
}

// Event store: só ACRESCENTA (append-only); nunca altera nem apaga um evento
public class LojaDeEventos
{
    private readonly Dictionary&lt;string, List&lt;Evento&gt;&gt; _streams = [];

    public void Anexar(string id, IEnumerable&lt;Evento&gt; eventos, int versaoEsperada)
    {
        if (!_streams.TryGetValue(id, out var stream)) _streams[id] = stream = [];
        if (stream.Count != versaoEsperada)
            throw new InvalidOperationException($"esperava a versão {versaoEsperada}, mas o stream já está na {stream.Count}.");
        stream.AddRange(eventos);
    }

    public IEnumerable&lt;Evento&gt; Ler(string id) =&gt;
        _streams.TryGetValue(id, out var stream) ? stream : Enumerable.Empty&lt;Evento&gt;();
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Saldo atual: R$ 750,00 (versão 4)
Saldo logo após o 2º evento: R$ 1.000,00
Extrato:
   ContaAberta { Id = conta-42, Titular = Ana }
   ValorDepositado { Valor = 1000 }
   ValorSacado { Valor = 300 }
   ValorDepositado { Valor = 50 }
Saque recusado: o saldo de R$ 750,00 é insuficiente.
Conflito: esperava a versão 4, mas o stream já está na 5.</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Os métodos <code>Depositar</code>/<code>Sacar</code> validam as regras e <em>registram</em> um evento. Só o método <code>Aplicar</code> muda o estado.</li>
  <li><code>Reidratar</code> reconstrói a conta a partir do histórico; <code>Take(2)</code> reconstrói como ela estava depois do segundo evento (a viagem no tempo).</li>
  <li>O extrato é uma <em>projeção</em>: outra visão, montada a partir dos mesmos eventos.</li>
  <li><code>versaoEsperada</code> é a concorrência otimista (Capítulo 5.1.3) do event store: a sessão B carregou a versão 4, mas a A gravou antes; a gravação da B é recusada.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Event Sourcing é poderoso — e caro</div>
  <p>Ele traz complexidade real: versionar eventos antigos quando o modelo muda, <em>snapshots</em> para agregados com milhares de eventos, projeções com consistência eventual e uma curva de aprendizado alta para a equipe. Use onde o histórico <em>é</em> o negócio (financeiro, contábil, logística, auditoria regulatória), não como padrão para todo o sistema. Para produção, prefira um event store pronto, como Marten (PostgreSQL) ou EventStoreDB.</p>
</div>

<h2>6.4 Outbox Pattern</h2>

<p class="step-label">📘 O conceito</p>
<p>O problema do <strong>dual write</strong>: salvar no banco e publicar uma mensagem no broker são duas operações em dois sistemas diferentes, sem uma transação que as una. Se a aplicação cair (ou o broker falhar) entre uma e outra, o pedido fica salvo, mas o evento se perde — e o estoque nunca é baixado. A <strong>Outbox</strong> resolve gravando a mensagem numa tabela do <em>mesmo banco</em>, na <em>mesma transação</em> do pedido. Um processador em segundo plano lê essa tabela e publica, tentando de novo até conseguir.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O livro de protocolo do correio</div>
  <p>Quando você manda uma carta registrada, o atendente primeiro a registra no livro de protocolo, junto com o seu recibo. Se o caminhão quebrar no caminho, a carta não some: está registrada, e o correio a despacha no próximo caminhão. Enviar a carta sem registrar seria o <em>dual write</em>: se o caminhão quebra, ninguém sabe que ela existia.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
sequenceDiagram
    participant API
    participant DB as Banco
    participant P as Processador da Outbox
    participant B as Broker (RabbitMQ/Kafka)
    API-&gt;&gt;DB: BEGIN: INSERT Pedido + INSERT Outbox
    DB--&gt;&gt;API: COMMIT (os dois ou nenhum)
    loop a cada poucos segundos
        P-&gt;&gt;DB: SELECT mensagens pendentes
        P-&gt;&gt;B: publica
        alt broker respondeu
            P-&gt;&gt;DB: marca como processada
        else broker fora do ar
            P-&gt;&gt;DB: incrementa tentativas (tenta de novo depois)
        end
    end
  </pre>
  <figcaption>Pedido e mensagem na mesma transação; o processador publica e reenvia até conseguir.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8.0.31</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Text.Json;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

using var conexao = new SqliteConnection("Data Source=:memory:");
conexao.Open();
using (var db = new LojaDb(conexao)) db.Database.EnsureCreated();
var broker = new BrokerInstavel();

// ❌ "Dual write": grava no banco e DEPOIS publica. Se o broker falhar, o evento se perde
using (var db = new LojaDb(conexao))
{
    db.Pedidos.Add(new Pedido { Cliente = "Ana" });
    db.SaveChanges();
    broker.ForaDoAr = true;
    try { broker.Publicar("PedidoCriado", """{"Cliente":"Ana"}"""); }
    catch (Exception ex) { Console.WriteLine($"Sem outbox: pedido salvo, mas o evento se PERDEU ({ex.Message})"); }
}

// ✅ Outbox: o pedido E a mensagem vão para o banco na MESMA transação (um único SaveChanges)
using (var db = new LojaDb(conexao))
{
    var pedido = new Pedido { Cliente = "Bruno" };
    db.Pedidos.Add(pedido);
    db.Outbox.Add(new MensagemOutbox { Tipo = "PedidoCriado", Conteudo = JsonSerializer.Serialize(new { pedido.Cliente }) });
    db.SaveChanges();
    Console.WriteLine("Com outbox: pedido e mensagem gravados juntos (ou nenhum dos dois)");
}

// Um processador em segundo plano publica o que estiver pendente, de tempos em tempos
await ProcessarOutbox("1ª rodada, broker fora do ar");
broker.ForaDoAr = false;
await ProcessarOutbox("2ª rodada, broker de volta ");
await ProcessarOutbox("3ª rodada                  ");

async Task ProcessarOutbox(string rodada)
{
    using var db = new LojaDb(conexao);
    var pendentes = await db.Outbox.Where(m =&gt; m.ProcessadaEm == null).OrderBy(m =&gt; m.Id).ToListAsync();
    Console.WriteLine($"{rodada}: {pendentes.Count} pendente(s)");
    foreach (var mensagem in pendentes)
    {
        try
        {
            broker.Publicar(mensagem.Tipo, mensagem.Conteudo);
            mensagem.ProcessadaEm = DateTime.UtcNow;   // só marca como enviada DEPOIS de publicar
        }
        catch (Exception ex)
        {
            mensagem.Tentativas++;
            Console.WriteLine($"   falhou ({ex.Message}); tentativa {mensagem.Tentativas}, fica para a próxima rodada");
        }
    }
    await db.SaveChangesAsync();
}

public class Pedido
{
    public int Id { get; set; }
    public string Cliente { get; set; } = "";
}

public class MensagemOutbox
{
    public int Id { get; set; }
    public string Tipo { get; set; } = "";
    public string Conteudo { get; set; } = "";
    public DateTime? ProcessadaEm { get; set; }
    public int Tentativas { get; set; }
}

public class LojaDb(SqliteConnection conexao) : DbContext
{
    public DbSet&lt;Pedido&gt; Pedidos =&gt; Set&lt;Pedido&gt;();
    public DbSet&lt;MensagemOutbox&gt; Outbox =&gt; Set&lt;MensagemOutbox&gt;();
    protected override void OnConfiguring(DbContextOptionsBuilder o) =&gt; o.UseSqlite(conexao);
}

public class BrokerInstavel
{
    public bool ForaDoAr { get; set; }

    public void Publicar(string tipo, string conteudo)
    {
        if (ForaDoAr) throw new InvalidOperationException("broker indisponível");
        Console.WriteLine($"   [broker] publicado {tipo} {conteudo}");
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Sem outbox: pedido salvo, mas o evento se PERDEU (broker indisponível)
Com outbox: pedido e mensagem gravados juntos (ou nenhum dos dois)
1ª rodada, broker fora do ar: 1 pendente(s)
   falhou (broker indisponível); tentativa 1, fica para a próxima rodada
2ª rodada, broker de volta : 1 pendente(s)
   [broker] publicado PedidoCriado {"Cliente":"Bruno"}
3ª rodada                  : 0 pendente(s)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Sem outbox, o pedido da Ana foi salvo e o evento se perdeu de vez: nenhum outro serviço ficará sabendo dele.</li>
  <li>Com outbox, <code>Pedidos.Add</code> e <code>Outbox.Add</code> vão no <strong>mesmo</strong> <code>SaveChanges</code>, uma única transação: ou os dois são gravados, ou nenhum.</li>
  <li>Na 1ª rodada, o broker está fora do ar: a mensagem continua pendente, com o contador de tentativas. Na 2ª, é publicada e marcada. Na 3ª, não há nada pendente.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Outbox garante "pelo menos uma vez" — não "exatamente uma vez"</div>
  <p>Se o processador publicar e cair <em>antes</em> de marcar a mensagem como processada, ela será publicada de novo. Por isso, quem consome precisa ser <strong>idempotente</strong>: processar a mesma mensagem duas vezes não pode gerar efeito duplicado (Capítulo 7.1.2). Em produção, bibliotecas como <strong>MassTransit</strong> (com o <em>transactional outbox</em> do EF Core) e <strong>Wolverine</strong> já implementam outbox e inbox para você.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Nunca publique direto depois de salvar: grave a mensagem junto com os dados e publique depois, tentando de novo até dar certo.</p>
</div>

<h2>6.5 Monólito Modular ou Microservices?</h2>

<p class="step-label">📘 O conceito</p>
<p>Microservices resolvem um problema de <strong>organização</strong> (muitas equipes trabalhando e publicando de forma independente) ao custo de um problema <strong>técnico</strong> enorme: rede, consistência eventual, observabilidade distribuída, versionamento de contratos. Um <strong>monólito modular</strong> — um único deploy, dividido internamente em módulos com fronteiras claras (os Bounded Contexts do Capítulo 2.4.4) — traz a maior parte dos benefícios de organização sem esse custo, e pode ser dividido depois, módulo a módulo.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O prédio e o condomínio de casas</div>
  <p>Um prédio bem planejado (monólito modular) tem apartamentos independentes, com paredes e portas próprias, mas uma só estrutura, portaria e caixa-d'água: é barato de manter. Um condomínio de casas (microservices) dá independência total a cada família — cada uma com o seu telhado, a sua caixa-d'água e o seu portão —, mas custa muito mais para construir e manter. Uma família de três pessoas raramente precisa de um condomínio.</p>
</div>

<table>
  <thead><tr><th>Critério</th><th>Monólito modular</th><th>Microservices</th></tr></thead>
  <tbody>
    <tr><td>Tamanho da equipe</td><td>1 a ~5 times</td><td>Muitos times, que precisam publicar sem depender uns dos outros</td></tr>
    <tr><td>Deploy</td><td>Um artefato</td><td>Dezenas, com pipelines independentes</td></tr>
    <tr><td>Consistência</td><td>Transações locais simples</td><td>Eventual: sagas, outbox, idempotência (Capítulo 7)</td></tr>
    <tr><td>Escala</td><td>O sistema inteiro junto</td><td>Cada serviço conforme a sua carga</td></tr>
    <tr><td>Custo operacional</td><td>Baixo</td><td>Alto: Kubernetes, observabilidade distribuída (Capítulo 9)</td></tr>
  </tbody>
</table>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Comece com um monólito bem modularizado; extraia um microservice quando houver um motivo concreto de equipe ou de escala, e não por tendência.</p>
</div>

<div class="challenge-box">
  <div class="challenge-box-header">
    <span class="challenge-box-icon">🎯</span>
    <span class="challenge-box-title">Desafio Prático — Capítulo 6</span>
  </div>
  <p>Construa o núcleo de um <strong>sistema de pedidos</strong> em Clean Architecture, num único programa (ou em projetos separados, se preferir):</p>
  <ol>
    <li>Domínio sem dependências, com o agregado <code>Pedido</code> e as suas regras; valide as dependências com o teste de arquitetura de 6.1.</li>
    <li>Commands e queries com um mediador (o do exemplo ou MediatR) e behaviors de log e validação (6.2).</li>
    <li>Ao confirmar um pedido, grave um <code>PedidoConfirmado</code> na outbox, na mesma transação, e publique-o com um processador que resista à queda do broker (6.4).</li>
    <li>Bônus: modele o <strong>estoque</strong> com Event Sourcing (entradas, saídas e ajustes) e mostre o saldo de qualquer produto em qualquer data (6.3).</li>
  </ol>
</div>
`
},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 7 — MENSAGERIA E EVENTOS
══════════════════════════════════════════════════════════ */
{
  id: 7, slug: 'mensageria', icon: '📨', color: '#ec4899',
  title: 'Mensageria e Eventos Distribuídos',
  subtitle: 'Filas, Pub/Sub, idempotência, DLQ, Sagas, RabbitMQ e Kafka',
  desc: 'Filas e pub/sub, entregas duplicadas e idempotência, retry e Dead Letter Queue, sagas com compensação e partições do Kafka — com simulações executáveis de cada conceito.',
  tags: ['RabbitMQ','Kafka','MassTransit','Idempotência','Saga'],
  readTime: 40,
  intro: `Se dois serviços precisam estar disponíveis ao mesmo tempo para se comunicar,
    você não tem microservices — tem um monólito distribuído com mais pontos de falha. A mensageria
    assíncrona é o que realmente desacopla serviços, mas exige entender idempotência, ordem,
    entrega at-least-once e compensação de sagas.`,
  content: `
<div class="info-box info">
  <div class="info-box-label">🧭 Como estudar este capítulo</div>
  <p>Brokers de verdade (RabbitMQ, Kafka) precisam de um servidor. Para você <em>ver</em> os conceitos funcionando sem instalar nada, cada tópico traz uma <strong>simulação em memória</strong> que se comporta como o broker real — filas, exchanges, reentregas, DLQ, partições e offsets. Depois vem o código real com MassTransit e Confluent.Kafka, para quando você subir os servidores (há um <code>docker run</code> no fim do capítulo).</p>
</div>

<h2>7.1 Fundamentos de Mensageria</h2>

<p class="step-label">📘 O conceito</p>
<p>Na comunicação <strong>síncrona</strong> (HTTP), quem chama espera a resposta: se o outro serviço estiver lento ou fora do ar, quem chamou também fica. Na comunicação <strong>assíncrona</strong>, o serviço deixa uma mensagem num <strong>broker</strong> e segue a vida; quem precisa dela a processa quando puder. Os serviços deixam de depender da disponibilidade um do outro — e picos de carga viram uma fila, não uma queda.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Telefonema vs. mensagem de voz</div>
  <p>Um telefonema só funciona se a outra pessoa atender agora. Uma mensagem de voz chega mesmo que ela esteja numa reunião, e ela ouve quando puder. Se você manda a mesma mensagem num grupo, todos recebem (pub/sub). Se você deixa uma tarefa no quadro da equipe, só uma pessoa a pega (fila).</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
flowchart LR
    P[Serviço Pagamento] -- "Publica (PaymentApproved)" --&gt; B{Broker: RabbitMQ / Kafka}
    B -- "Consome" --&gt; L[Serviço Logística]
    B -- "Consome" --&gt; NF[Serviço Notas Fiscais]
  </pre>
  <figcaption>O serviço de pagamento publica um fato; quem se interessa reage, sem que ele precise saber quem são.</figcaption>
</figure>

<h3>7.1.1 Filas e Pub/Sub</h3>

<p class="step-label">📘 O conceito</p>
<ul><li><strong>Fila</strong> (<em>point-to-point</em>, <em>competing consumers</em>): cada mensagem é processada por <strong>um</strong> consumidor. Mais consumidores = mais vazão. Use para <em>comandos</em>: "emita a nota fiscal".</li><li><strong>Pub/Sub</strong> (publicar/assinar): cada <strong>assinante</strong> recebe uma cópia. Use para <em>eventos</em>: "o pagamento foi aprovado" — logística, fidelidade e e-mail reagem, cada um do seu jeito.</li></ul><p>No RabbitMQ, o produtor publica num <strong>exchange</strong>, que roteia para as <strong>filas</strong> vinculadas a ele; cada fila entrega aos seus consumidores.</p>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 260" role="img" aria-label="Fila: um produtor envia quatro mensagens para uma fila, e dois workers dividem o trabalho, cada mensagem para um só. Pub/Sub: um evento publicado num exchange é copiado para três filas, e cada serviço recebe a sua cópia">
    <defs><marker id="c7d1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c7d1-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c7d1-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">FILA — dividir o trabalho</text>
    <rect class="box-accent" x="10" y="60" width="110" height="50" rx="8"/>
    <text x="65.0" y="90.0" text-anchor="middle" font-weight="600">Produtor</text>
    <rect class="box-warn" x="150" y="60" width="110" height="50" rx="8"/>
    <text x="205.0" y="81.0" text-anchor="middle" font-weight="600">fila</text>
    <text class="t-mono t-muted" x="205.0" y="99.0" text-anchor="middle">4 3 2 1</text>
    <rect class="box-good" x="290" y="36" width="80" height="40" rx="8"/>
    <text x="330.0" y="61.0" text-anchor="middle" font-weight="600">Worker A</text>
    <rect class="box-good" x="290" y="96" width="80" height="40" rx="8"/>
    <text x="330.0" y="121.0" text-anchor="middle" font-weight="600">Worker B</text>
    <path class="line" d="M120,85 L146,85" marker-end="url(#c7d1-head)"/>
    <path class="line" d="M260,80 L286,58" marker-end="url(#c7d1-head)"/>
    <path class="line" d="M260,90 L286,114" marker-end="url(#c7d1-head)"/>
    <text class="t-muted" x="190" y="164" text-anchor="middle">cada mensagem vai para UM worker</text>
    <text class="t-title" x="400" y="22">PUB/SUB — avisar todo mundo</text>
    <rect class="box-accent" x="400" y="76" width="100" height="50" rx="8"/>
    <text x="450.0" y="97.0" text-anchor="middle" font-weight="600">Exchange</text>
    <text class="t-muted" x="450.0" y="115.0" text-anchor="middle">fanout</text>
    <rect class="box-good" x="590" y="30" width="120" height="40" rx="8"/>
    <text x="650.0" y="55.0" text-anchor="middle" font-weight="600">Logística</text>
    <path class="line" d="M500,101 C540,101 550,50 586,50" marker-end="url(#c7d1-head)"/>
    <rect class="box-good" x="590" y="82" width="120" height="40" rx="8"/>
    <text x="650.0" y="107.0" text-anchor="middle" font-weight="600">Fidelidade</text>
    <path class="line" d="M500,101 C540,101 550,102 586,102" marker-end="url(#c7d1-head)"/>
    <rect class="box-good" x="590" y="134" width="120" height="40" rx="8"/>
    <text x="650.0" y="159.0" text-anchor="middle" font-weight="600">E-mail</text>
    <path class="line" d="M500,101 C540,101 550,154 586,154" marker-end="url(#c7d1-head)"/>
    <text class="t-muted" x="555" y="200" text-anchor="middle">cada serviço recebe uma CÓPIA</text>
    <text class="t-muted" x="10" y="244">Fila = trabalho a ser feito uma vez ("emita a nota"). Evento = fato que vários querem saber ("pagamento aprovado").</text>
  </svg>
  <figcaption>Os dois modelos básicos de mensageria.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var broker = new MiniBroker();

// FILA (competing consumers): cada mensagem vai para UM consumidor — dividem o trabalho
broker.CriarFila("emissao-nf");
broker.Consumir("emissao-nf", m =&gt; Console.WriteLine($"   Worker A emitiu a nota do {m}"));
broker.Consumir("emissao-nf", m =&gt; Console.WriteLine($"   Worker B emitiu a nota do {m}"));

Console.WriteLine("FILA 'emissao-nf': 4 mensagens, 2 workers");
for (int i = 1; i &lt;= 4; i++) broker.EnviarParaFila("emissao-nf", $"pedido {i}");

// PUB/SUB (fanout): cada serviço interessado recebe uma CÓPIA — cada um faz a sua parte
foreach (var fila in new[] { "logistica", "fidelidade", "email" })
{
    broker.CriarFila(fila);
    broker.Vincular("pagamento-aprovado", fila);
}
broker.Consumir("logistica", m =&gt; Console.WriteLine($"   Logística separou o {m}"));
broker.Consumir("fidelidade", m =&gt; Console.WriteLine($"   Fidelidade somou os pontos do {m}"));
broker.Consumir("email", m =&gt; Console.WriteLine($"   E-mail avisou o cliente do {m}"));

Console.WriteLine("PUB/SUB 'pagamento-aprovado': 1 evento publicado");
broker.Publicar("pagamento-aprovado", "pedido 7");

// Um broker em miniatura, no modelo do RabbitMQ:
// o produtor publica num EXCHANGE, que copia para as FILAS vinculadas; cada fila entrega a um consumidor
public class MiniBroker
{
    private readonly Dictionary&lt;string, List&lt;Action&lt;string&gt;&gt;&gt; _consumidores = [];
    private readonly Dictionary&lt;string, int&gt; _vez = [];
    private readonly Dictionary&lt;string, List&lt;string&gt;&gt; _vinculos = [];

    public void CriarFila(string fila)
    {
        _consumidores[fila] = [];
        _vez[fila] = 0;
    }

    public void Consumir(string fila, Action&lt;string&gt; tratar) =&gt; _consumidores[fila].Add(tratar);

    public void Vincular(string exchange, string fila)
    {
        if (!_vinculos.TryGetValue(exchange, out var filas)) _vinculos[exchange] = filas = [];
        filas.Add(fila);
    }

    // Fila: rodízio (round-robin) — cada mensagem é entregue a UM consumidor
    public void EnviarParaFila(string fila, string mensagem)
    {
        var consumidores = _consumidores[fila];
        consumidores[_vez[fila]++ % consumidores.Count](mensagem);
    }

    // Exchange do tipo fanout: uma cópia para CADA fila vinculada
    public void Publicar(string exchange, string mensagem)
    {
        if (_vinculos.TryGetValue(exchange, out var filas))
            foreach (var fila in filas) EnviarParaFila(fila, mensagem);
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>FILA 'emissao-nf': 4 mensagens, 2 workers
   Worker A emitiu a nota do pedido 1
   Worker B emitiu a nota do pedido 2
   Worker A emitiu a nota do pedido 3
   Worker B emitiu a nota do pedido 4
PUB/SUB 'pagamento-aprovado': 1 evento publicado
   Logística separou o pedido 7
   Fidelidade somou os pontos do pedido 7
   E-mail avisou o cliente do pedido 7</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Na fila, os dois workers se alternam (rodízio): o pedido 1 vai para A, o 2 para B, e assim por diante. Nenhuma nota é emitida duas vezes.</li>
  <li>No pub/sub, o exchange copia o evento para as 3 filas vinculadas, e cada serviço recebe a sua cópia.</li>
  <li>Um novo serviço interessado no evento? Basta criar uma fila e vinculá-la ao exchange, sem mudar nada no serviço de pagamento. É o desacoplamento que a mensageria oferece.</li>
</ul>

<h3>7.1.2 Garantias de Entrega e Idempotência</h3>

<p class="step-label">📘 O conceito</p>
<p>Redes falham. Um broker pode entregar uma mensagem, o consumidor processar, e a <strong>confirmação</strong> (<em>ack</em>) se perder no caminho. Sem o ack, o broker entende que falhou e entrega de novo. Por isso, na prática, quase todo sistema opera em <strong>at-least-once</strong> (pelo menos uma vez): nenhuma mensagem se perde, mas <strong>duplicatas acontecem</strong>. A defesa é tornar o consumidor <strong>idempotente</strong>: processar a mesma mensagem duas vezes tem o mesmo efeito que processar uma.</p>

<table>
  <thead><tr><th>Garantia</th><th>Perde mensagens?</th><th>Duplica?</th><th>Na prática</th></tr></thead>
  <tbody>
    <tr><td>At-most-once</td><td>Pode perder</td><td>Nunca</td><td>Métricas e logs em que perder um pouco não importa</td></tr>
    <tr><td>At-least-once</td><td>Nunca</td><td>Pode duplicar</td><td><strong>O padrão</strong>: combine com consumidor idempotente</td></tr>
    <tr><td>Exactly-once</td><td>Nunca</td><td>Nunca</td><td>Só dentro de um mesmo sistema (ex.: transações do Kafka); entre sistemas, o que existe é "at-least-once + idempotência"</td></tr>
  </tbody>
</table>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O elevador e o botão apertado duas vezes</div>
  <p>Apertar o botão do elevador duas vezes não chama dois elevadores: o botão é <em>idempotente</em>. Já o botão "pedir um lanche" de um app mal feito, apertado duas vezes numa conexão ruim, gera dois pedidos. O objetivo é fazer todo consumidor se comportar como o botão do elevador.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
sequenceDiagram
    participant B as Broker
    participant C as Consumidor
    participant DB as Banco
    B-&gt;&gt;C: entrega msg-7f8c (cobrar R$ 150)
    C-&gt;&gt;DB: cobra o cliente
    C--xB: ack (perdido na rede)
    Note over B: sem ack, o broker entende que falhou
    B-&gt;&gt;C: entrega msg-7f8c DE NOVO
    C-&gt;&gt;DB: já processei msg-7f8c?
    DB--&gt;&gt;C: sim, então ignora
  </pre>
  <figcaption>O ack perdido gera uma reentrega; o consumidor idempotente reconhece e ignora.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// O broker entregou, o consumidor processou... e a confirmação (ack) se perdeu na rede.
// Então o broker ENTREGA DE NOVO. Isso é "at-least-once": duplicatas são normais, não um bug.
var mensagem = new CobrarPedido(MensagemId: "msg-7f8c2a10", PedidoId: 42, Valor: 150m);
CobrarPedido[] entregas = [mensagem, mensagem];

var ingenuo = new ConsumidorIngenuo();
foreach (var m in entregas) ingenuo.Tratar(m);
Console.WriteLine($"Consumidor ingênuo     -&gt; cobrou {ingenuo.Cobrancas.Count}x, total {ingenuo.Cobrancas.Sum():C}");

var idempotente = new ConsumidorIdempotente();
foreach (var m in entregas) idempotente.Tratar(m);
Console.WriteLine($"Consumidor idempotente -&gt; cobrou {idempotente.Cobrancas.Count}x, total {idempotente.Cobrancas.Sum():C}");

public record CobrarPedido(string MensagemId, int PedidoId, decimal Valor);

public class ConsumidorIngenuo
{
    public List&lt;decimal&gt; Cobrancas { get; } = [];
    public void Tratar(CobrarPedido m) =&gt; Cobrancas.Add(m.Valor);
}

public class ConsumidorIdempotente
{
    // Em produção: uma tabela com chave primária em MensagemId,
    // gravada NA MESMA transação que o efeito (a cobrança)
    private readonly HashSet&lt;string&gt; _processadas = [];
    public List&lt;decimal&gt; Cobrancas { get; } = [];

    public void Tratar(CobrarPedido m)
    {
        if (!_processadas.Add(m.MensagemId))   // Add devolve false se o id já estava lá
        {
            Console.WriteLine($"   {m.MensagemId} já foi processada: duplicata ignorada");
            return;
        }
        Cobrancas.Add(m.Valor);
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Consumidor ingênuo     -&gt; cobrou 2x, total R$ 300,00
   msg-7f8c2a10 já foi processada: duplicata ignorada
Consumidor idempotente -&gt; cobrou 1x, total R$ 150,00</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>A mesma mensagem (mesmo <code>MensagemId</code>) é entregue duas vezes. O consumidor ingênuo cobra o cliente em dobro.</li>
  <li>O idempotente registra cada <code>MensagemId</code> processado; <code>HashSet.Add</code> devolve <code>false</code> para um id repetido.</li>
  <li>Em produção, o registro fica numa tabela com chave primária no id da mensagem, gravada <strong>na mesma transação</strong> do efeito. Se a cobrança falhar, o registro também não é gravado, e a próxima entrega tenta de novo.</li>
</ul>

<div class="info-box info">
  <div class="info-box-label">💡 Idempotência também se projeta no domínio</div>
  <p>Nem sempre é preciso uma tabela de controle: "marcar o pedido como pago" é naturalmente idempotente (fazer duas vezes dá no mesmo); "somar 150 ao saldo" não é. Sempre que der, modele as operações como <em>definir um estado</em> em vez de <em>aplicar um incremento</em>.</p>
</div>

<h3>7.1.3 Retry e Dead Letter Queue</h3>

<p class="step-label">📘 O conceito</p>
<p>Quando o processamento falha, há dois tipos de erro: <strong>passageiros</strong> (timeout, banco lento), que se resolvem com novas tentativas, e <strong>permanentes</strong> — as "mensagens venenosas", com dados inválidos, que falharão sempre. Tentar para sempre uma mensagem venenosa trava a fila e queima CPU. A solução: <strong>retry</strong> com espera crescente e, esgotadas as tentativas, mover a mensagem para uma <strong>Dead Letter Queue (DLQ)</strong>, onde ela aguarda análise sem bloquear as outras.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A carta com endereço errado</div>
  <p>O carteiro tenta entregar; se ninguém atende, volta amanhã (retry). Depois de três tentativas, a carta vai para a seção de "cartas não entregues" dos Correios (a DLQ) — ela não fica rodando no caminhão para sempre, atrasando as outras entregas. Lá, alguém analisa: o endereço está errado? devolve ao remetente?</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var fila = new Queue&lt;Mensagem&gt;([
    new("pedido-1", "normal"),
    new("pedido-2", "instavel"),   // falha 2 vezes (banco lento) e depois funciona
    new("pedido-3", "venenosa"),   // SEMPRE falha: dado inválido, nenhuma tentativa resolve
    new("pedido-4", "normal"),
]);
var dlq = new List&lt;(Mensagem Mensagem, string Erro)&gt;();
int falhasDoInstavel = 0;
const int MaxTentativas = 3;

while (fila.TryDequeue(out var mensagem))
{
    for (int tentativa = 1; ; tentativa++)
    {
        try
        {
            Processar(mensagem);
            Console.WriteLine($"{mensagem.Id}: processado na tentativa {tentativa}");
            break;
        }
        catch (Exception ex) when (tentativa &lt; MaxTentativas)
        {
            var espera = TimeSpan.FromMilliseconds(100 * Math.Pow(2, tentativa - 1));   // 100, 200, 400 ms...
            Console.WriteLine($"{mensagem.Id}: falhou ({ex.Message}); nova tentativa em {espera.TotalMilliseconds} ms");
            await Task.Delay(espera);
        }
        catch (Exception ex)
        {
            dlq.Add((mensagem, ex.Message));   // tira da fila principal: as outras mensagens seguem
            Console.WriteLine($"{mensagem.Id}: esgotou as {MaxTentativas} tentativas -&gt; Dead Letter Queue");
            break;
        }
    }
}

Console.WriteLine();
Console.WriteLine($"DLQ: {dlq.Count} mensagem(ns) aguardando análise");
foreach (var (m, erro) in dlq) Console.WriteLine($"   {m.Id}: {erro}");

void Processar(Mensagem m)
{
    if (m.Tipo == "instavel" &amp;&amp; falhasDoInstavel++ &lt; 2) throw new TimeoutException("banco lento");
    if (m.Tipo == "venenosa") throw new FormatException("CPF inválido no pedido");
}

public record Mensagem(string Id, string Tipo);</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>pedido-1: processado na tentativa 1
pedido-2: falhou (banco lento); nova tentativa em 100 ms
pedido-2: falhou (banco lento); nova tentativa em 200 ms
pedido-2: processado na tentativa 3
pedido-3: falhou (CPF inválido no pedido); nova tentativa em 100 ms
pedido-3: falhou (CPF inválido no pedido); nova tentativa em 200 ms
pedido-3: esgotou as 3 tentativas -&gt; Dead Letter Queue
pedido-4: processado na tentativa 1

DLQ: 1 mensagem(ns) aguardando análise
   pedido-3: CPF inválido no pedido</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>O <code>pedido-2</code> falha duas vezes por um problema passageiro e é processado na 3ª tentativa, com esperas de 100 e 200 ms (backoff exponencial).</li>
  <li>O <code>pedido-3</code> é venenoso: depois de 3 tentativas, vai para a DLQ, e o <code>pedido-4</code> segue normalmente.</li>
  <li><code>catch ... when (tentativa &lt; MaxTentativas)</code> é um <em>exception filter</em>: só captura enquanto ainda há tentativas. Na última, cai no <code>catch</code> seguinte, que envia para a DLQ.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ DLQ não é lixeira</div>
  <p>Configure um <strong>alerta</strong> para quando a DLQ receber mensagens, e tenha um processo (ou uma ferramenta) para analisar, corrigir e reenviar. Uma DLQ que só cresce é um bug de negócio escondido: pedidos que nunca foram processados.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>At-least-once é o padrão, então faça consumidores idempotentes, com retry para falhas passageiras e DLQ para as permanentes.</p>
</div>

<h2>7.2 Sagas e RabbitMQ com MassTransit</h2>

<h3>7.2.1 Saga com Compensação</h3>

<p class="step-label">📘 O conceito</p>
<p>Num monólito, "cobrar, reservar estoque e agendar entrega" cabe numa transação de banco: se algo falhar, <code>ROLLBACK</code>. Entre serviços diferentes, cada um com o seu banco, não existe esse rollback. A <strong>saga</strong> resolve com uma sequência de transações locais, em que cada passo tem uma <strong>compensação</strong> — uma ação de negócio que desfaz o efeito (estornar o pagamento, liberar o estoque). Se um passo falhar, as compensações dos passos anteriores são executadas, do último para o primeiro.</p><p>Na saga <strong>orquestrada</strong>, um coordenador comanda os passos (como no exemplo). Na <strong>coreografada</strong>, cada serviço reage aos eventos do anterior, sem coordenador.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Cancelar uma viagem</div>
  <p>Você comprou a passagem, reservou o hotel e alugou o carro. A viagem é cancelada. Não existe um "desfazer tudo" mágico: você cancela o carro, depois o hotel, depois pede o reembolso da passagem — na ordem inversa, cada um com a sua regra (e às vezes com multa). Cada cancelamento é uma compensação.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
flowchart LR
    A[Cobrar pagamento] --&gt;|ok| B[Reservar estoque]
    B --&gt;|ok| C[Agendar entrega]
    C --&gt;|ok| D([Pedido concluído])
    B -.-&gt;|falhou| X1[Estornar pagamento]
    C -.-&gt;|falhou| X2[Liberar estoque]
    X2 -.-&gt; X1
    X1 -.-&gt; E([Pedido cancelado])
  </pre>
  <figcaption>Caminho feliz em linha contínua; compensações em linha tracejada.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Saga ORQUESTRADA: um coordenador executa os passos em ordem.
// Se um passo falhar, ele COMPENSA os que já foram feitos, do último para o primeiro.
await Executar("Pedido 1 (tudo certo)", falharEm: null);
await Executar("Pedido 2 (sem estoque)", falharEm: "ReservarEstoque");
await Executar("Pedido 3 (transportadora recusou)", falharEm: "AgendarEntrega");

static async Task Executar(string nome, string? falharEm)
{
    Console.WriteLine($"== {nome}");
    string estadoFinal = await new SagaDePedido(falharEm).ExecutarAsync();
    Console.WriteLine($"   estado final: {estadoFinal}");
}

public class SagaDePedido(string? falharEm)
{
    // Cada passo tem uma AÇÃO e uma COMPENSAÇÃO (a ação de negócio que desfaz o efeito)
    private static readonly (string Nome, Func&lt;Task&gt; Acao, Func&lt;Task&gt; Compensacao)[] Passos =
    [
        ("CobrarPagamento", () =&gt; Feito("pagamento cobrado"), () =&gt; Desfeito("pagamento ESTORNADO")),
        ("ReservarEstoque", () =&gt; Feito("estoque reservado"), () =&gt; Desfeito("estoque LIBERADO")),
        ("AgendarEntrega",  () =&gt; Feito("entrega agendada"),  () =&gt; Desfeito("entrega CANCELADA")),
    ];

    public async Task&lt;string&gt; ExecutarAsync()
    {
        var concluidos = new Stack&lt;Func&lt;Task&gt;&gt;();   // pilha: o último feito é o primeiro desfeito
        foreach (var (nome, acao, compensacao) in Passos)
        {
            try
            {
                if (nome == falharEm) throw new InvalidOperationException($"{nome} falhou");
                await acao();
                concluidos.Push(compensacao);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"   [falha]  {ex.Message} -&gt; compensando o que já foi feito");
                while (concluidos.TryPop(out var desfazer)) await desfazer();
                return "Cancelado";
            }
        }
        return "Concluído";
    }

    private static Task Feito(string texto) { Console.WriteLine($"   [ok]     {texto}"); return Task.CompletedTask; }
    private static Task Desfeito(string texto) { Console.WriteLine($"   [desfaz] {texto}"); return Task.CompletedTask; }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>== Pedido 1 (tudo certo)
   [ok]     pagamento cobrado
   [ok]     estoque reservado
   [ok]     entrega agendada
   estado final: Concluído
== Pedido 2 (sem estoque)
   [ok]     pagamento cobrado
   [falha]  ReservarEstoque falhou -&gt; compensando o que já foi feito
   [desfaz] pagamento ESTORNADO
   estado final: Cancelado
== Pedido 3 (transportadora recusou)
   [ok]     pagamento cobrado
   [ok]     estoque reservado
   [falha]  AgendarEntrega falhou -&gt; compensando o que já foi feito
   [desfaz] estoque LIBERADO
   [desfaz] pagamento ESTORNADO
   estado final: Cancelado</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Cada passo é um par (ação, compensação). Os concluídos vão para uma <code>Stack</code>, para serem desfeitos na ordem inversa.</li>
  <li>No pedido 2, a reserva de estoque falha: só o pagamento precisa ser estornado. No pedido 3, a entrega falha: o estoque é liberado e depois o pagamento é estornado.</li>
  <li>Numa saga real, cada ação é uma mensagem para outro serviço, e o estado da saga é persistido (em qual passo está), para sobreviver a reinícios.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Compensação não é rollback</div>
  <p>Entre um passo e a compensação, o mundo viu o efeito: o cliente pode ter recebido o e-mail de "pagamento aprovado". Compensações precisam ser pensadas como <em>regras de negócio</em> (enviar "seu pedido foi cancelado e o valor estornado"), e também precisam ser idempotentes, porque podem ser reexecutadas.</p>
</div>

<h3>7.2.2 RabbitMQ com MassTransit</h3>

<p class="step-label">📘 O conceito</p>
<p><strong>MassTransit</strong> é a biblioteca de mensageria mais usada em .NET: abstrai RabbitMQ, Azure Service Bus e Amazon SQS e já traz retry, DLQ, outbox transacional e sagas como máquinas de estado. Você escreve consumidores e publica mensagens; ele cuida de filas, exchanges, serialização e reentregas.</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// dotnet add package MassTransit.RabbitMQ   (e MassTransit.EntityFrameworkCore para a outbox)
builder.Services.AddMassTransit(x =&gt;
{
    x.AddConsumer&lt;PagamentoAprovadoConsumer&gt;();

    // Outbox transacional (Capítulo 6.4): publica só depois do commit do banco
    x.AddEntityFrameworkOutbox&lt;AppDbContext&gt;(o =&gt;
    {
        o.UseSqlServer();
        o.UseBusOutbox();
    });

    x.UsingRabbitMq((contexto, cfg) =&gt;
    {
        cfg.Host("localhost", "/", h =&gt; { h.Username("guest"); h.Password("guest"); });

        // Retry exponencial para falhas passageiras. Esgotadas as tentativas, a mensagem
        // vai para a fila "&lt;nome-da-fila&gt;_error" — a Dead Letter Queue do MassTransit
        cfg.UseMessageRetry(r =&gt; r.Exponential(5,
            minInterval: TimeSpan.FromSeconds(1),
            maxInterval: TimeSpan.FromSeconds(30),
            intervalDelta: TimeSpan.FromSeconds(2)));

        cfg.ConfigureEndpoints(contexto);   // cria filas e exchanges por convenção
    });
});

// Consumidor: o MassTransit entrega a mensagem já desserializada
public class PagamentoAprovadoConsumer(ILogger&lt;PagamentoAprovadoConsumer&gt; log) : IConsumer&lt;PagamentoAprovado&gt;
{
    public Task Consume(ConsumeContext&lt;PagamentoAprovado&gt; contexto)
    {
        log.LogInformation("Separando o pedido {Id}", contexto.Message.PedidoId);
        return Task.CompletedTask;
    }
}

// Publicar, de qualquer lugar da aplicação:
await publicador.Publish(new PagamentoAprovado(pedido.Id));   // IPublishEndpoint publicador</code></pre>
</div>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Licença do MassTransit</div>
  <p>A versão 8 do MassTransit é open source (Apache 2.0). A partir da v9, o projeto passou a ter licença comercial. Avalie os termos antes de escolher a versão; alternativas incluem Wolverine, Rebus e o SDK oficial de cada broker.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Sem transação distribuída, uma saga executa passos locais e, se algo falhar, compensa os anteriores na ordem inversa.</p>
</div>

<h2>7.3 Apache Kafka — Event Streaming</h2>

<p class="step-label">📘 O conceito</p>
<p>Kafka não é uma fila que esvazia: é um <strong>log distribuído, particionado e durável</strong>. As mensagens são <em>acrescentadas</em> a partições e <strong>ficam lá</strong> pelo tempo configurado (dias, ou para sempre). Cada <strong>consumer group</strong> guarda o seu próprio <em>offset</em> (até onde leu) em cada partição. Consequências: vários sistemas leem o mesmo fluxo de forma independente, um sistema novo pode reprocessar todo o histórico (<em>replay</em>) e a ordem é garantida <strong>dentro de uma partição</strong> — por isso a <strong>chave</strong> da mensagem importa.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O livro-caixa e os marcadores</div>
  <p>O Kafka é um livro-caixa em que só se escreve na próxima linha, nunca se apaga. Cada departamento (consumer group) tem o seu marcador de página: o faturamento está na linha 1.203, a auditoria na 850 — e um estagiário novo pode começar a ler da primeira página. Para não misturar, o livro tem vários volumes (partições), e todas as linhas de um mesmo cliente vão sempre para o mesmo volume.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 270" role="img" aria-label="Um tópico Kafka com três partições: as mensagens da Ana vão sempre para a partição 1, as do Beto para a 0 e as da Carla para a 2, cada uma com offsets crescentes. O grupo faturamento já leu até certo offset; o grupo analytics, novo, lê desde o início">
    <defs><marker id="c7d2-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c7d2-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c7d2-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">TÓPICO "pedidos"</text>
    <text class="t-mono" x="10" y="68">partição 0</text>
    <rect class="box" x="110" y="40" width="122" height="40" rx="6"/>
    <text class="t-mono" x="171.0" y="65.0" text-anchor="middle">beto:criado</text>
    <text class="t-muted" x="171" y="92" text-anchor="middle">offset 0</text>
    <rect class="box" x="240" y="40" width="122" height="40" rx="6"/>
    <text class="t-mono" x="301.0" y="65.0" text-anchor="middle">beto:pago</text>
    <text class="t-muted" x="301" y="92" text-anchor="middle">offset 1</text>
    <rect class="box-warn" x="370" y="40" width="122" height="40" rx="6"/>
    <text class="t-mono" x="431.0" y="65.0" text-anchor="middle">beto:enviado</text>
    <text class="t-muted" x="431" y="92" text-anchor="middle">offset 2</text>
    <text class="t-mono" x="10" y="124">partição 1</text>
    <rect class="box" x="110" y="96" width="122" height="40" rx="6"/>
    <text class="t-mono" x="171.0" y="121.0" text-anchor="middle">ana:criado</text>
    <text class="t-muted" x="171" y="148" text-anchor="middle">offset 0</text>
    <rect class="box" x="240" y="96" width="122" height="40" rx="6"/>
    <text class="t-mono" x="301.0" y="121.0" text-anchor="middle">ana:pago</text>
    <text class="t-muted" x="301" y="148" text-anchor="middle">offset 1</text>
    <rect class="box" x="370" y="96" width="122" height="40" rx="6"/>
    <text class="t-mono" x="431.0" y="121.0" text-anchor="middle">ana:enviado</text>
    <text class="t-muted" x="431" y="148" text-anchor="middle">offset 2</text>
    <text class="t-mono" x="10" y="180">partição 2</text>
    <rect class="box" x="110" y="152" width="122" height="40" rx="6"/>
    <text class="t-mono" x="171.0" y="177.0" text-anchor="middle">carla:criado</text>
    <text class="t-muted" x="171" y="204" text-anchor="middle">offset 0</text>
    <rect class="box-good" x="560" y="40" width="150" height="56" rx="8"/>
    <text x="635.0" y="64.0" text-anchor="middle" font-weight="600">faturamento</text>
    <text class="t-muted" x="635.0" y="82.0" text-anchor="middle">continua de onde parou</text>
    <rect class="box-accent" x="560" y="120" width="150" height="56" rx="8"/>
    <text x="635.0" y="144.0" text-anchor="middle" font-weight="600">analytics (novo)</text>
    <text class="t-muted" x="635.0" y="162.0" text-anchor="middle">lê desde o offset 0</text>
    <text class="t-muted" x="10" y="222">Mesma chave → mesma partição → ordem garantida para aquela chave (criado antes de pago).</text>
    <text class="t-muted" x="10" y="244">As mensagens FICAM no log após a leitura: cada grupo guarda o seu próprio offset e pode reprocessar.</text>
  </svg>
  <figcaption>Kafka: um log particionado e durável, não uma fila que esvazia.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Um tópico com 3 partições. Cada partição é um LOG: só acrescenta, e cada mensagem ganha um offset
var topico = new Topico("pedidos", particoes: 3);

// A CHAVE decide a partição: mesma chave -&gt; mesma partição -&gt; ordem garantida para aquela chave
foreach (var evento in new[] { "ana:criado", "beto:criado", "ana:pago", "carla:criado", "beto:pago", "ana:enviado" })
{
    string[] partes = evento.Split(':');
    var (particao, offset) = topico.Produzir(chave: partes[0], valor: partes[1]);
    Console.WriteLine($"produziu {partes[0],-5} {partes[1],-7} -&gt; partição {particao}, offset {offset}");
}

// Consumer group "faturamento": lê cada partição em ordem e guarda até onde leu (o offset)
var faturamento = new GrupoDeConsumo("faturamento", topico);
faturamento.LerNovas();

topico.Produzir("beto", "enviado");
faturamento.LerNovas();   // continua de onde parou: só a novidade

// Um grupo NOVO começa do zero: as mensagens continuam no log (replay)
new GrupoDeConsumo("analytics", topico).LerNovas();

public class Topico(string nome, int particoes)
{
    public string Nome { get; } = nome;
    public List&lt;string&gt;[] Particoes { get; } = Enumerable.Range(0, particoes).Select(_ =&gt; new List&lt;string&gt;()).ToArray();

    public (int Particao, int Offset) Produzir(string chave, string valor)
    {
        int p = chave.Sum(c =&gt; (int)c) % Particoes.Length;   // o Kafka usa um hash (murmur2) da chave
        Particoes[p].Add($"{chave}:{valor}");
        return (p, Particoes[p].Count - 1);
    }
}

public class GrupoDeConsumo(string nome, Topico topico)
{
    private readonly int[] _offsets = new int[topico.Particoes.Length];   // posição "commitada" em cada partição

    public void LerNovas()
    {
        Console.WriteLine($"Grupo '{nome}' lendo '{topico.Nome}':");
        bool leuAlgo = false;
        for (int p = 0; p &lt; topico.Particoes.Length; p++)
        {
            var novas = topico.Particoes[p].Skip(_offsets[p]).ToList();
            if (novas.Count == 0) continue;
            Console.WriteLine($"   partição {p}: {string.Join(" -&gt; ", novas)}");
            _offsets[p] += novas.Count;   // commit DEPOIS de processar (at-least-once)
            leuAlgo = true;
        }
        if (!leuAlgo) Console.WriteLine("   (nada novo)");
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>produziu ana   criado  -&gt; partição 1, offset 0
produziu beto  criado  -&gt; partição 0, offset 0
produziu ana   pago    -&gt; partição 1, offset 1
produziu carla criado  -&gt; partição 2, offset 0
produziu beto  pago    -&gt; partição 0, offset 1
produziu ana   enviado -&gt; partição 1, offset 2
Grupo 'faturamento' lendo 'pedidos':
   partição 0: beto:criado -&gt; beto:pago
   partição 1: ana:criado -&gt; ana:pago -&gt; ana:enviado
   partição 2: carla:criado
Grupo 'faturamento' lendo 'pedidos':
   partição 0: beto:enviado
Grupo 'analytics' lendo 'pedidos':
   partição 0: beto:criado -&gt; beto:pago -&gt; beto:enviado
   partição 1: ana:criado -&gt; ana:pago -&gt; ana:enviado
   partição 2: carla:criado</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>A partição é escolhida a partir da chave: todas as mensagens da Ana caem na mesma partição, e por isso "criado → pago → enviado" chega sempre nessa ordem.</li>
  <li>O grupo <code>faturamento</code> guarda os offsets: na segunda leitura, recebe só o <code>beto:enviado</code>.</li>
  <li>O grupo <code>analytics</code>, criado depois, lê tudo desde o offset 0: as mensagens não foram "consumidas e apagadas", como numa fila.</li>
  <li>Dentro de um grupo, cada partição é lida por <em>um</em> consumidor. Por isso, o número de partições limita o paralelismo do grupo.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// dotnet add package Confluent.Kafka
var produtor = new ProducerBuilder&lt;string, string&gt;(new ProducerConfig
{
    BootstrapServers = "localhost:9092",
    Acks = Acks.All,            // confirma só depois que as réplicas gravarem
    EnableIdempotence = true,   // retries do produtor não geram duplicatas no log
}).Build();

await produtor.ProduceAsync("pedidos", new Message&lt;string, string&gt;
{
    Key = pedido.ClienteId.ToString(),   // mesma chave = mesma partição = ordem garantida
    Value = JsonSerializer.Serialize(new PedidoCriado(pedido.Id)),
});

using var consumidor = new ConsumerBuilder&lt;string, string&gt;(new ConsumerConfig
{
    BootstrapServers = "localhost:9092",
    GroupId = "faturamento",
    AutoOffsetReset = AutoOffsetReset.Earliest,
    EnableAutoCommit = false,   // commit manual, só depois de processar (at-least-once)
}).Build();

consumidor.Subscribe("pedidos");
while (!ct.IsCancellationRequested)
{
    var resultado = consumidor.Consume(ct);
    await ProcessarAsync(resultado.Message.Value, ct);   // precisa ser idempotente!
    consumidor.Commit(resultado);
}</code></pre>
</div>

<h3>7.3.1 RabbitMQ, Kafka ou Azure Service Bus?</h3>

<table>
  <thead><tr><th>Critério</th><th>RabbitMQ</th><th>Kafka</th><th>Azure Service Bus</th></tr></thead>
  <tbody>
    <tr><td>Modelo</td><td>Broker com filas e roteamento flexível</td><td>Log particionado e durável</td><td>Broker gerenciado (filas e tópicos)</td></tr>
    <tr><td>Depois de consumida</td><td>A mensagem sai da fila</td><td>Fica no log (replay)</td><td>Sai da fila</td></tr>
    <tr><td>Ordem</td><td>Por fila (com um consumidor)</td><td>Por partição (pela chave)</td><td>Por sessão</td></tr>
    <tr><td>Vazão</td><td>Alta</td><td>Altíssima</td><td>Alta (depende do plano)</td></tr>
    <tr><td>Operação</td><td>Você mantém (ou serviço gerenciado)</td><td>Complexa (ou Confluent Cloud / Event Hubs)</td><td>Zero: é PaaS</td></tr>
    <tr><td>Melhor para</td><td>Comandos, filas de trabalho, roteamento</td><td>Streaming de eventos, integração de dados, analytics</td><td>Sistemas corporativos no Azure</td></tr>
  </tbody>
</table>

<div class="info-box info">
  <div class="info-box-label">🐳 Para experimentar com os brokers reais</div>
  <p>RabbitMQ com painel web em <code>http://localhost:15672</code> (usuário e senha <code>guest</code>): <code>docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management</code>. Kafka em modo KRaft (sem ZooKeeper): <code>docker run -d -p 9092:9092 apache/kafka:3.8.0</code>.</p>
</div>

<div class="challenge-box">
  <div class="challenge-box-header">
    <span class="challenge-box-icon">🎯</span>
    <span class="challenge-box-title">Desafio Prático — Capítulo 7</span>
  </div>
  <p>Implemente o fluxo de pedidos de uma loja com mensageria, primeiro em memória e depois com RabbitMQ:</p>
  <ol>
    <li>Publique <code>PedidoCriado</code> num exchange fanout, com três consumidores: pagamento, estoque e e-mail (7.1.1).</li>
    <li>Torne o consumidor de pagamento idempotente e prove, forçando uma reentrega, que o cliente não é cobrado duas vezes (7.1.2).</li>
    <li>Adicione retry exponencial e uma DLQ; crie uma mensagem venenosa e mostre que ela não trava a fila (7.1.3).</li>
    <li>Orquestre pagamento → estoque → entrega como uma saga com compensações (7.2.1).</li>
  </ol>
  <p>Bônus: troque o broker em memória pelo MassTransit com RabbitMQ e escreva testes com o <code>ITestHarness</code> do MassTransit cobrindo os fluxos de sucesso e de falha.</p>
</div>
`
},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 8 — PERFORMANCE & SEGURANÇA
══════════════════════════════════════════════════════════ */
{
  id: 8, slug: 'performance-seguranca', icon: '🛡️', color: '#ef4444',
  title: 'Performance & Segurança',
  subtitle: 'BenchmarkDotNet, GC, pools, OWASP, criptografia e segredos',
  desc: 'Benchmark real, vazamento de memória reproduzido, gerações do GC, ArrayPool, SQL injection demonstrada, AES-GCM, hash de senha e gestão de segredos — medidos e testados na prática.',
  tags: ['BenchmarkDotNet','GC','OWASP','Criptografia','AOT'],
  readTime: 45,
  intro: `Código rápido não é código prematuro — é código que você <em>mediu</em> antes de otimizar.
    E código seguro não é paranoia — é a mentalidade de que todo input é suspeito até prova em
    contrário. Performance e segurança são as dimensões em que erros em produção têm as consequências
    mais severas e mais difíceis de reverter.`,
  content: `
<div class="info-box info">
  <div class="info-box-label">🧭 Como estudar este capítulo</div>
  <p>Performance sem medição é chute, e segurança sem ver o ataque é abstrata. Por isso, aqui você vai <strong>medir</strong> (um BenchmarkDotNet real, bytes alocados), <strong>ver um vazamento de memória</strong> acontecer, <strong>executar uma SQL injection</strong> contra um banco em memória e <strong>adulterar um dado criptografado</strong> para ver a proteção funcionando.</p>
</div>

<h2>8.1 Medir Antes de Otimizar</h2>

<p class="step-label">📘 O conceito</p>
<p>A regra número 1 de performance: <strong>não otimize o que você não mediu</strong>. A intuição erra muito sobre onde está a lentidão. Medir com <code>Stopwatch</code> engana (a primeira execução inclui a compilação JIT, o GC pode rodar no meio, a CPU varia). O <strong>BenchmarkDotNet</strong> resolve: aquece o código, repete milhares de vezes, descarta ruído e entrega média, desvio padrão e — com <code>[MemoryDiagnoser]</code> — quanto cada método aloca.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O médico e o exame</div>
  <p>Um bom médico não receita remédio para o coração porque você "parece cansado": pede exames primeiro. E não mede a sua pressão logo depois de você subir uma escada correndo — espera você descansar e mede mais de uma vez. O BenchmarkDotNet é esse exame bem feito; o <code>Stopwatch</code> solto é medir a pressão na escada.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package BenchmarkDotNet --version 0.15.8</code><br><code>dotnet run -c Release   # benchmarks só valem compilados em Release</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Text;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

BenchmarkRunner.Run&lt;MontarTexto&gt;();

[MemoryDiagnoser]   // mede também quanto cada método aloca
[ShortRunJob]       // execução curta, para o exemplo; remova para medições "oficiais"
public class MontarTexto
{
    private readonly string[] _itens = Enumerable.Range(1, 100).Select(i =&gt; $"item{i}").ToArray();

    [Benchmark(Baseline = true)]   // a referência: os outros são comparados a este
    public string ConcatenarComMais()
    {
        string resultado = "";
        foreach (var item in _itens) resultado += item + ";";   // cria uma string NOVA a cada volta
        return resultado;
    }

    [Benchmark]
    public string ComStringBuilder()
    {
        var sb = new StringBuilder();
        foreach (var item in _itens) sb.Append(item).Append(';');
        return sb.ToString();
    }

    [Benchmark]
    public string ComStringJoin() =&gt; string.Join(';', _itens) + ";";
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(tempos, contagens e IDs variam conforme a máquina e a execução)</span></div>
  <pre>| Method            | Mean       | Error       | StdDev    | Ratio | RatioSD | Gen0    | Allocated | Alloc Ratio |
|------------------ |-----------:|------------:|----------:|------:|--------:|--------:|----------:|------------:|
| ConcatenarComMais | 5,082.5 ns | 2,093.54 ns | 114.75 ns |  1.00 |    0.03 | 17.0898 |   69.8 KB |        1.00 |
| ComStringBuilder  |   970.7 ns |    86.45 ns |   4.74 ns |  0.19 |    0.00 |  0.9460 |   3.87 KB |        0.06 |
| ComStringJoin     |   866.3 ns |   557.94 ns |  30.58 ns |  0.17 |    0.01 |  0.6714 |   2.75 KB |        0.04 |</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>Mean</code> é o tempo médio por chamada; <code>Error</code> e <code>StdDev</code> mostram o quanto a medição variou.</li>
  <li><code>Ratio</code> compara com o <code>Baseline</code>: 0,17 significa que <code>string.Join</code> leva 17% do tempo da concatenação — quase 6 vezes mais rápido.</li>
  <li><code>Allocated</code> mostra a memória alocada por chamada: cerca de 70 KB contra menos de 3 KB. A concatenação com <code>+</code> cria uma string nova a cada volta, copiando tudo o que já existia.</li>
  <li><code>Gen0</code> é o número de coletas de Gen 0 a cada 1.000 execuções: mais alocação significa mais trabalho para o GC (8.2).</li>
  <li>Rode sempre em <strong>Release</strong> e sem o depurador anexado. O BenchmarkDotNet avisa quando isso não acontece.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Otimize o que importa</div>
  <p>Economizar 5 microssegundos num método chamado uma vez por dia não vale a legibilidade perdida. Use benchmarks nos <em>caminhos quentes</em> — código executado milhões de vezes, como serialização, parsing e laços de cada requisição — que você identificou com um profiler (8.1.1).</p>
</div>

<h3>8.1.1 Diagnóstico em Produção: counters, trace e dump</h3>

<p class="step-label">📘 O conceito</p>
<p>Em produção não dá para anexar um depurador. As ferramentas <code>dotnet-counters</code> (métricas ao vivo: CPU, GC, requisições), <code>dotnet-trace</code> (onde o tempo de CPU é gasto) e <code>dotnet-dump</code> (uma "fotografia" da memória) funcionam num processo em execução, com impacto baixo.</p>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">terminal</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-bash"># Monitorar contadores em tempo real
dotnet-counters monitor --process-id $(pgrep -f "MyApp") \\
  --counters "System.Runtime[gc-heap-size,working-set,alloc-rate],\\
              Microsoft.AspNetCore.Hosting[total-requests,requests-per-second,failed-requests]"

# Capturar trace CPU por 30 segundos
dotnet-trace collect --process-id $(pgrep -f "MyApp") \\
  --duration 00:00:30 \\
  --providers "Microsoft-DotNETCore-SampleProfiler:0xF:5" \\
  --output cpu_trace.nettrace

# Converter para SpeedScope (https://speedscope.app)
dotnet-trace convert cpu_trace.nettrace --format Speedscope

# Dump de memória para análise de leak
dotnet-dump collect --process-id $(pgrep -f "MyApp")
dotnet-dump analyze core.dmp
# Comandos: dumpheap -stat | dumpheap -type ClassName | gcroot &lt;address&gt;</code></pre>
</div>

<h3>8.1.2 Vazamento de Memória</h3>

<p class="step-label">📘 O conceito</p>
<p>Em .NET não existe "esquecer o <code>free</code>", mas existe vazamento: um objeto de <strong>vida longa</strong> (um singleton, um campo estático, um cache sem limite) que continua <strong>referenciando</strong> objetos que deveriam morrer. O GC só coleta o que ninguém alcança. A causa clássica é a inscrição em evento sem o cancelamento correspondente.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O convidado que ninguém tira da lista</div>
  <p>A portaria do prédio tem uma lista de pessoas autorizadas. Um prestador de serviço foi embora há meses, mas o nome dele continua na lista — então o crachá dele segue ativo, ocupando espaço no sistema. Ninguém o chama, mas ele "existe". Cancelar a inscrição no evento é tirar o nome da lista.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 200" role="img" aria-label="Vazamento por evento: a CentralDeNotificacoes, de vida longa, guarda no evento uma referência à TelaDePedidos, que carrega 10 MB; mesmo fechada, a tela não pode ser coletada">
    <defs><marker id="c8d1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c8d1-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c8d1-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="60" width="220" height="70" rx="8"/>
    <text x="120.0" y="91.0" text-anchor="middle" font-weight="600">CentralDeNotificacoes</text>
    <text class="t-muted" x="120.0" y="109.0" text-anchor="middle">Singleton: vive para sempre</text>
    <rect class="box-warn" x="300" y="60" width="170" height="70" rx="8"/>
    <text x="385.0" y="91.0" text-anchor="middle" font-weight="600">event NovoPedido</text>
    <text class="t-muted" x="385.0" y="109.0" text-anchor="middle">lista de inscritos</text>
    <rect class="box-bad" x="540" y="60" width="170" height="70" rx="8"/>
    <text x="625.0" y="91.0" text-anchor="middle" font-weight="600">TelaDePedidos</text>
    <text class="t-bad" x="625.0" y="109.0" text-anchor="middle">+10 MB, já "fechada"</text>
    <path class="line" d="M230,95 L296,95" marker-end="url(#c8d1-head)"/>
    <path class="line-bad" d="M470,95 L536,95" marker-end="url(#c8d1-head-bad)"/>
    <text class="t-bad" x="503" y="86" text-anchor="middle">segura</text>
    <text class="t-muted" x="10" y="170">Enquanto houver um caminho de referências até um objeto, o GC não pode coletá-lo — ele não é "lixo".</text>
    <text class="t-good" x="10" y="190">Cancelar a inscrição (-=) corta a última seta, e a tela vira lixo coletável.</text>
  </svg>
  <figcaption>O vazamento mais comum em .NET: um objeto de vida longa segurando objetos que deveriam morrer.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Runtime.CompilerServices;

// Um serviço de vida longa (pense num Singleton) que publica eventos
var central = new CentralDeNotificacoes();

WeakReference telaEsquecida = AbrirEFecharTela(central, cancelarInscricao: false);
WeakReference telaCorreta = AbrirEFecharTela(central, cancelarInscricao: true);

// Força uma coleta completa — NUNCA faça isso em produção; aqui é só para ver o efeito
GC.Collect();
GC.WaitForPendingFinalizers();
GC.Collect();

Console.WriteLine($"Tela que NÃO cancelou a inscrição continua na memória? {telaEsquecida.IsAlive}");
Console.WriteLine($"Tela que cancelou a inscrição continua na memória?     {telaCorreta.IsAlive}");
Console.WriteLine($"Inscrições que a central ainda segura: {central.QuantidadeDeInscritos}");

[MethodImpl(MethodImplOptions.NoInlining)]
static WeakReference AbrirEFecharTela(CentralDeNotificacoes central, bool cancelarInscricao)
{
    var tela = new TelaDePedidos(central);   // a tela se inscreve no evento da central
    tela.Fechar(cancelarInscricao);          // a tela "fecha": nenhum código nosso a usa mais
    return new WeakReference(tela);          // referência fraca: observa sem impedir a coleta
}

public class CentralDeNotificacoes
{
    public event Action&lt;string&gt;? NovoPedido;
    public int QuantidadeDeInscritos =&gt; NovoPedido?.GetInvocationList().Length ?? 0;
}

public class TelaDePedidos
{
    private readonly CentralDeNotificacoes _central;
    private readonly byte[] _dadosDaTela = new byte[10_000_000];   // 10 MB que ficam presos junto

    public TelaDePedidos(CentralDeNotificacoes central)
    {
        _central = central;
        _central.NovoPedido += AoReceberPedido;   // agora a CENTRAL guarda uma referência a esta tela
    }

    public void Fechar(bool cancelarInscricao)
    {
        if (cancelarInscricao) _central.NovoPedido -= AoReceberPedido;
    }

    private void AoReceberPedido(string pedido) =&gt; Console.WriteLine($"{pedido}: {_dadosDaTela.Length} bytes");
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Tela que NÃO cancelou a inscrição continua na memória? True
Tela que cancelou a inscrição continua na memória?     False
Inscrições que a central ainda segura: 1</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>WeakReference</code> observa um objeto sem mantê-lo vivo: se <code>IsAlive</code> é <code>True</code> depois da coleta, algo ainda o referencia.</li>
  <li>A tela que não cancelou a inscrição continua viva — com os seus 10 MB — porque a central a referencia pelo evento.</li>
  <li>A tela que fez <code>-=</code> foi coletada. Numa aplicação real, repita isso a cada tela aberta e o processo cresce até ser derrubado (<em>OOMKilled</em>).</li>
</ul>

<p class="step-label">🖼️ Como investigar em produção</p>

<figure class="diagram">
  <pre class="mermaid">
graph TD
    A[Uso de RAM Sobe] --&gt; B(OOM Killed no K8s)
    B --&gt; C[Coletar Dump: dotnet-dump]
    C --&gt; D[Analisar no Visual Studio/WinDbg]
    D --&gt; E(Identificar GC Roots)
    E --&gt; F[Correção do Bug]
  </pre>
  <figcaption>No dump, o comando gcroot mostra a cadeia de referências que mantém o objeto vivo.</figcaption>
</figure>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Meça com BenchmarkDotNet antes de otimizar; e, em vazamentos, procure quem ainda segura a referência.</p>
</div>

<h2>8.2 Garbage Collector e Gerenciamento de Memória</h2>

<p class="step-label">📘 O conceito</p>
<p>O GC do .NET é <strong>geracional</strong>, com base numa observação: a maioria dos objetos morre jovem. Objetos novos nascem na <strong>Gen 0</strong>, coletada com frequência e muito rápido. Quem sobrevive sobe para a Gen 1 e depois para a <strong>Gen 2</strong>, coletada raramente — e cara. Objetos de 85 KB ou mais vão direto para o <strong>Large Object Heap</strong> (LOH), coletado junto com a Gen 2.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A arrumação da casa</div>
  <p>A mesa da cozinha (Gen 0) é limpa várias vezes por dia: rápido, porque tem pouca coisa. O armário (Gen 2) você arruma de vez em quando, e leva uma tarde. Os móveis grandes (LOH) nem passam pela mesa: vão direto para o depósito. O ideal é que a bagunça do dia a dia fique na mesa e seja limpa logo — e não vá parar no armário.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 250" role="img" aria-label="As gerações do GC: objetos nascem na geração 0, coletada com frequência e barata; os que sobrevivem sobem para a 1 e depois para a 2, coletada raramente e mais cara; objetos grandes vão direto para o Large Object Heap">
    <defs><marker id="c8d2-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c8d2-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c8d2-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-good" x="10" y="50" width="160" height="80" rx="8"/>
    <text x="90.0" y="77.0" text-anchor="middle" font-weight="600">Gen 0</text>
    <text class="t-muted" x="90.0" y="95.0" text-anchor="middle">recém-criados</text>
    <text class="t-muted" x="90.0" y="113.0" text-anchor="middle">coleta frequente e barata</text>
    <rect class="box-warn" x="200" y="50" width="160" height="80" rx="8"/>
    <text x="280.0" y="77.0" text-anchor="middle" font-weight="600">Gen 1</text>
    <text class="t-muted" x="280.0" y="95.0" text-anchor="middle">sobreviveram 1 vez</text>
    <text class="t-muted" x="280.0" y="113.0" text-anchor="middle">amortecedor</text>
    <rect class="box-bad" x="390" y="50" width="160" height="80" rx="8"/>
    <text x="470.0" y="77.0" text-anchor="middle" font-weight="600">Gen 2</text>
    <text class="t-muted" x="470.0" y="95.0" text-anchor="middle">vida longa</text>
    <text class="t-muted" x="470.0" y="113.0" text-anchor="middle">coleta rara e cara</text>
    <path class="line" d="M170,90 L196,90" marker-end="url(#c8d2-head)"/>
    <path class="line" d="M360,90 L386,90" marker-end="url(#c8d2-head)"/>
    <text class="t-muted" x="183" y="150" text-anchor="middle">sobreviveu</text>
    <text class="t-muted" x="373" y="150" text-anchor="middle">sobreviveu</text>
    <rect class="box-accent" x="580" y="50" width="130" height="80" rx="8"/>
    <text x="645.0" y="77.0" text-anchor="middle" font-weight="600">LOH</text>
    <text class="t-muted" x="645.0" y="95.0" text-anchor="middle">objetos ≥ 85 KB</text>
    <text class="t-muted" x="645.0" y="113.0" text-anchor="middle">coletado com a Gen 2</text>
    <text class="t-mono t-good" x="10" y="30">new</text>
    <path class="line-good" d="M40,34 L60,48" marker-end="url(#c8d2-head-good)"/>
    <text class="t-muted" x="10" y="170">A maioria dos objetos morre jovem (uma requisição, um laço): a Gen 0 os recolhe em microssegundos.</text>
    <text class="t-muted" x="10" y="192">O problema são objetos que vivem "um pouco demais" e chegam à Gen 2: coletas longas e pausas.</text>
    <text class="t-good" x="10" y="222">Reduzir alocações (Span, pools, structs) = menos coletas = latência mais estável.</text>
  </svg>
  <figcaption>O GC geracional: coletar muito e barato onde está o lixo (Gen 0), pouco e caro onde estão os sobreviventes.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">var objeto = new object();
Console.WriteLine($"Recém-criado            -&gt; geração {GC.GetGeneration(objeto)}");
GC.Collect();
Console.WriteLine($"Sobreviveu a 1 coleta   -&gt; geração {GC.GetGeneration(objeto)}");
GC.Collect();
Console.WriteLine($"Sobreviveu a 2 coletas  -&gt; geração {GC.GetGeneration(objeto)} (a mais velha)");

var pequeno = new byte[80_000];
var grande = new byte[90_000];   // 85.000 bytes ou mais: vai direto para o Large Object Heap (LOH)
Console.WriteLine($"Array de 80 KB          -&gt; geração {GC.GetGeneration(pequeno)}");
Console.WriteLine($"Array de 90 KB (no LOH) -&gt; geração {GC.GetGeneration(grande)} (já nasce \\"velho\\")");

// Objetos de vida curta morrem baratos, em coletas rápidas da geração 0
int gen0 = GC.CollectionCount(0), gen2 = GC.CollectionCount(2);
for (int i = 0; i &lt; 1_000_000; i++) _ = new string('x', 20);   // lixo temporário
Console.WriteLine($"1 milhão de objetos temporários: {GC.CollectionCount(0) - gen0} coletas de Gen0 e {GC.CollectionCount(2) - gen2} de Gen2");</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(tempos, contagens e IDs variam conforme a máquina e a execução)</span></div>
  <pre>Recém-criado            -&gt; geração 0
Sobreviveu a 1 coleta   -&gt; geração 1
Sobreviveu a 2 coletas  -&gt; geração 2 (a mais velha)
Array de 80 KB          -&gt; geração 0
Array de 90 KB (no LOH) -&gt; geração 2 (já nasce "velho")
1 milhão de objetos temporários: 15 coletas de Gen0 e 0 de Gen2</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>GC.GetGeneration</code> mostra o objeto subindo de geração a cada coleta a que sobrevive: 0, depois 1, depois 2.</li>
  <li>O array de 90 KB já nasce no LOH, reportado como geração 2.</li>
  <li>Um milhão de strings temporárias gera várias coletas rápidas de Gen 0 e, normalmente, nenhuma de Gen 2: esse é o cenário saudável.</li>
  <li>O número exato de coletas de Gen 0 depende do <em>orçamento</em> da geração 0, que o runtime calcula a partir do cache da CPU: em máquinas com cache L3 grande (servidores, alguns contêineres) você pode ver poucas ou até <strong>0</strong> coletas. O que importa é a ordem de grandeza e a ausência de coletas de Gen 2.</li>
</ul>

<table>
  <thead><tr><th>Modo</th><th>Como funciona</th><th>Indicado para</th></tr></thead>
  <tbody>
    <tr><td><strong>Workstation</strong></td><td>Um heap; coletas curtas e concorrentes</td><td>Apps desktop e de console</td></tr>
    <tr><td><strong>Server</strong> (padrão no ASP.NET Core)</td><td>Um heap e uma thread de GC por núcleo: mais vazão, mais memória</td><td>APIs e serviços com muita carga</td></tr>
    <tr><td><strong>Server + DATAS</strong></td><td>Ajusta o número de heaps à carga real (padrão a partir do .NET 9)</td><td>Containers com limite de memória</td></tr>
  </tbody>
</table>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">Exemplo.csproj</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-xml">&lt;!-- No .csproj: configurações do GC --&gt;
&lt;PropertyGroup&gt;
  &lt;ServerGarbageCollection&gt;true&lt;/ServerGarbageCollection&gt;
  &lt;ConcurrentGarbageCollection&gt;true&lt;/ConcurrentGarbageCollection&gt;
  &lt;!-- .NET 8: liga o DATAS (no .NET 9+ já vem ligado com Server GC) --&gt;
  &lt;GarbageCollectionAdaptationMode&gt;1&lt;/GarbageCollectionAdaptationMode&gt;
&lt;/PropertyGroup&gt;</code></pre>
</div>

<h3>8.2.1 ArrayPool, ObjectPool e Redução de Alocações</h3>

<p class="step-label">📘 O conceito</p>
<p>A forma mais eficaz de reduzir o trabalho do GC é <strong>alocar menos</strong>. Para buffers usados e descartados o tempo todo (ler um arquivo, montar uma resposta), o <code>ArrayPool&lt;T&gt;</code> empresta arrays já existentes; para objetos caros de criar, o <code>ObjectPool&lt;T&gt;</code> faz o mesmo. Juntos com <code>Span&lt;T&gt;</code> (Capítulo 1.1.3), são as principais ferramentas de código de alta performance.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Pratos de louça vs. descartáveis</div>
  <p>Uma festa com pratos descartáveis gera sacos de lixo (o GC trabalhando). Com pratos de louça, lava-se e reutiliza-se. O pool é o armário de louça: você pega, usa e <strong>devolve</strong> — se esquecer de devolver, ele cria um novo, e a economia some.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Microsoft.Extensions.ObjectPool --version 8.0.31</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Buffers;
using System.Globalization;
using Microsoft.Extensions.ObjectPool;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

const int Repeticoes = 1_000;

long antes = GC.GetAllocatedBytesForCurrentThread();
for (int i = 0; i &lt; Repeticoes; i++)
{
    byte[] buffer = new byte[8192];   // um array novo a cada volta: tudo vira lixo para o GC
    Preencher(buffer);
}
long semPool = GC.GetAllocatedBytesForCurrentThread() - antes;

antes = GC.GetAllocatedBytesForCurrentThread();
for (int i = 0; i &lt; Repeticoes; i++)
{
    byte[] buffer = ArrayPool&lt;byte&gt;.Shared.Rent(8192);   // pega um emprestado
    try { Preencher(buffer); }
    finally { ArrayPool&lt;byte&gt;.Shared.Return(buffer); }  // devolve, para ser reutilizado
}
long comPool = GC.GetAllocatedBytesForCurrentThread() - antes;

Console.WriteLine($"new byte[8192] x {Repeticoes}: {semPool,10:N0} bytes alocados");
Console.WriteLine($"ArrayPool      x {Repeticoes}: {comPool,10:N0} bytes alocados");

// ObjectPool: o mesmo princípio para objetos caros de criar
ObjectPool&lt;System.Text.StringBuilder&gt; pool = new DefaultObjectPoolProvider().CreateStringBuilderPool();
var primeiro = pool.Get();
primeiro.Append("relatório de vendas");
Console.WriteLine($"1º Get: \\"{primeiro}\\"");
pool.Return(primeiro);   // o pool limpa o StringBuilder ao receber de volta

var segundo = pool.Get();
Console.WriteLine($"2º Get devolveu o MESMO objeto? {ReferenceEquals(primeiro, segundo)} — e vazio: \\"{segundo}\\"");
pool.Return(segundo);

static void Preencher(byte[] buffer) =&gt; buffer.AsSpan(0, 8192).Fill(1);   // Rent pode devolver um array MAIOR</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(bytes alocados variam um pouco conforme a versão do runtime)</span></div>
  <pre>new byte[8192] x 1000:  8.216.000 bytes alocados
ArrayPool      x 1000:     10.160 bytes alocados
1º Get: "relatório de vendas"
2º Get devolveu o MESMO objeto? True — e vazio: ""</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>new byte[8192]</code> 1.000 vezes aloca cerca de 8 MB, que o GC precisa recolher.</li>
  <li>Com <code>ArrayPool.Shared.Rent</code>/<code>Return</code>, o mesmo buffer é reutilizado: praticamente nenhuma alocação depois do primeiro.</li>
  <li><code>Rent(8192)</code> pode devolver um array <em>maior</em> que o pedido; use só o tamanho que você pediu (por isso o <code>AsSpan(0, 8192)</code>).</li>
  <li>O <code>ObjectPool</code> devolveu o mesmo <code>StringBuilder</code> no segundo <code>Get</code>, já limpo pela política do pool.</li>
</ul>

<div class="info-box danger">
  <div class="info-box-label">🚨 Depois do Return, o array não é mais seu</div>
  <p>Usar um array depois de devolvê-lo ao pool é um bug grave: outra parte do código pode estar escrevendo nele ao mesmo tempo. E, se o buffer guardou dados sensíveis, devolva com <code>Return(buffer, clearArray: true)</code>.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>O GC é rápido com lixo jovem; alocar menos (Span, pools, structs) mantém a Gen 2 quieta e a latência estável.</p>
</div>

<h2>8.3 Segurança Aplicada ao .NET</h2>

<p class="step-label">📘 O conceito</p>
<p>Segurança é a mentalidade de que <strong>toda entrada é suspeita</strong> até prova em contrário, e de que <strong>vai dar errado em algum momento</strong> — então cada camada precisa limitar o estrago (<em>defesa em profundidade</em>). O <strong>OWASP Top 10</strong> lista as falhas mais exploradas em aplicações web:</p>

<table>
  <thead><tr><th>OWASP 2021</th><th>O que é</th><th>Defesa no .NET</th></tr></thead>
  <tbody>
    <tr><td>A01 Broken Access Control</td><td>Acessar o que não deveria (IDOR)</td><td>Policies e autorização por recurso (4.3.2)</td></tr>
    <tr><td>A02 Cryptographic Failures</td><td>Dados sensíveis expostos</td><td>AES-GCM, hash de senha, TLS, HSTS (8.3.2)</td></tr>
    <tr><td>A03 Injection</td><td>Entrada vira código (SQL, comandos)</td><td>Parâmetros sempre; EF Core/Dapper (8.3.1)</td></tr>
    <tr><td>A04 Insecure Design</td><td>Falha na concepção</td><td>Modelagem de ameaças, rate limiting (4.4.2)</td></tr>
    <tr><td>A05 Security Misconfiguration</td><td>Configuração insegura</td><td>Sem stack trace em produção (4.1.3), cabeçalhos de segurança</td></tr>
    <tr><td>A06 Vulnerable Components</td><td>Pacotes com falhas conhecidas</td><td><code>dotnet list package --vulnerable</code>, Dependabot</td></tr>
    <tr><td>A07 Authentication Failures</td><td>Login fraco, sessão roubada</td><td>Identity, MFA, bloqueio por tentativas, JWT curto (4.3.1)</td></tr>
    <tr><td>A08 Integrity Failures</td><td>Código ou dados adulterados</td><td>Pacotes assinados, pipeline confiável, assinatura de dados</td></tr>
    <tr><td>A09 Logging Failures</td><td>Ataques sem registro</td><td>Logs estruturados e alertas (Capítulo 9)</td></tr>
    <tr><td>A10 SSRF</td><td>Servidor induzido a chamar URLs internas</td><td>Lista de destinos permitidos no <code>HttpClient</code></td></tr>
  </tbody>
</table>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O castelo medieval</div>
  <p>Um castelo não confia só na muralha: tem fosso, muralha, portão com guardas, torre com arqueiros e um cofre no fundo. Se o invasor passa pelo fosso, ainda enfrenta a muralha. Na aplicação: HTTPS (fosso), autenticação (portão), autorização (guardas em cada sala), validação de entrada (revista na porta) e criptografia (cofre) — cada camada supõe que a anterior pode falhar.</p>
</div>

<h3>8.3.1 Injeção de SQL</h3>

<p class="step-label">📘 O conceito</p>
<p>A injeção acontece quando <strong>dado vira código</strong>: o texto que o usuário digitou é concatenado numa consulta e passa a fazer parte do SQL. Com a entrada certa, o atacante lê tabelas inteiras, apaga dados ou burla o login. A defesa é uma só, e sem exceções: <strong>parâmetros</strong>. Com eles, o valor viaja separado do comando, e o banco nunca o interpreta como SQL.</p>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet add package Microsoft.Data.Sqlite --version 8.0.31</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using Microsoft.Data.Sqlite;

using var conexao = new SqliteConnection("Data Source=:memory:");
conexao.Open();
Executar(conexao, """
    CREATE TABLE Usuarios (Email TEXT, SenhaHash TEXT);
    INSERT INTO Usuarios VALUES ('ana@loja.com', 'h1'), ('bruno@loja.com', 'h2');
    """);

string digitado = "x' OR '1'='1";   // o que o atacante digita no campo "e-mail" do formulário

// ❌ Concatenando: o texto digitado vira PARTE DO CÓDIGO SQL
string sql = $"SELECT Email FROM Usuarios WHERE Email = '{digitado}'";
Console.WriteLine($"SQL montado  : {sql}");
Console.WriteLine($"Vulnerável   : {string.Join(", ", Consultar(conexao, sql))}  &lt;- vazou a tabela inteira");

// ✅ Parâmetro: o texto digitado é apenas um VALOR a ser comparado
Console.WriteLine($"Parametrizado: {Consultar(conexao, "SELECT Email FROM Usuarios WHERE Email = $email", digitado).Count} usuários encontrados (correto)");

static void Executar(SqliteConnection conexao, string sql)
{
    using var comando = conexao.CreateCommand();
    comando.CommandText = sql;
    comando.ExecuteNonQuery();
}

static List&lt;string&gt; Consultar(SqliteConnection conexao, string sql, string? email = null)
{
    using var comando = conexao.CreateCommand();
    comando.CommandText = sql;
    if (email is not null) comando.Parameters.AddWithValue("$email", email);   // viaja SEPARADO do SQL
    using var leitor = comando.ExecuteReader();
    var emails = new List&lt;string&gt;();
    while (leitor.Read()) emails.Add(leitor.GetString(0));
    return emails;
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>SQL montado  : SELECT Email FROM Usuarios WHERE Email = 'x' OR '1'='1'
Vulnerável   : ana@loja.com, bruno@loja.com  &lt;- vazou a tabela inteira
Parametrizado: 0 usuários encontrados (correto)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Com a entrada <code>x' OR '1'='1</code>, a condição vira "e-mail igual a x <strong>ou</strong> 1 igual a 1", que é sempre verdadeira: a consulta devolve todos os usuários.</li>
  <li>Com <code>$email</code> como parâmetro, o banco procura um e-mail literalmente igual a <code>x' OR '1'='1</code>, e não encontra nenhum.</li>
  <li>EF Core (LINQ e <code>FromSql</code> com interpolação) e Dapper (<code>@parametro</code>) parametrizam automaticamente. O perigo está em montar SQL com <code>+</code>, <code>string.Format</code> ou <code>FromSqlRaw</code> com interpolação.</li>
</ul>

<h3>8.3.2 Criptografia e Hash de Senhas</h3>

<p class="step-label">📘 O conceito</p>
<ul><li><strong>Criptografia</strong> é ida e volta: com a chave, o dado cifrado volta a ser legível. Use para dados que você precisa ler depois (documentos, tokens). O padrão moderno é <strong>AES-GCM</strong>, que além de cifrar detecta qualquer adulteração.</li><li><strong>Hash</strong> é só de ida: não existe "des-hashear". Use para <strong>senhas</strong>: no login, calcula-se o hash da senha digitada e compara-se. Um hash de senha precisa de <strong>sal</strong> (valor aleatório por usuário) e de ser <strong>lento de propósito</strong> (PBKDF2, bcrypt, Argon2), para tornar ataques de força bruta inviáveis.</li></ul>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O cofre e o moedor de carne</div>
  <p>A criptografia é um cofre: quem tem a chave abre e pega o documento de volta. O hash é um moedor de carne: dá para moer e comparar se duas porções saíram do mesmo pedaço, mas ninguém transforma carne moída de volta num bife. Senha se mói; nunca se guarda no cofre.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 240" role="img" aria-label="Criptografia é ida e volta: com a chave, o texto cifrado volta a ser o original. Hash é só de ida: da senha mais o sal sai um hash, e não há como voltar; para conferir, calcula-se de novo e compara-se">
    <defs><marker id="c8d3-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c8d3-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c8d3-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">CRIPTOGRAFIA — ida e volta</text>
    <rect class="box" x="10" y="40" width="140" height="50" rx="8"/>
    <text class="t-mono" x="80.0" y="70.0" text-anchor="middle">CPF 123...</text>
    <rect class="box-warn" x="210" y="40" width="140" height="50" rx="8"/>
    <text class="t-mono" x="280.0" y="70.0" text-anchor="middle">x9$#Kq@...</text>
    <path class="line" d="M150,58 L206,58" marker-end="url(#c8d3-head)"/>
    <path class="line-good" d="M206,76 L154,76" marker-end="url(#c8d3-head-good)"/>
    <text class="t-good" x="180" y="110" text-anchor="middle">com a CHAVE</text>
    <text class="t-muted" x="10" y="140">Para dados que você precisa LER de volta:</text>
    <text class="t-muted" x="10" y="158">CPF, cartão tokenizado, documentos.</text>
    <text class="t-title" x="390" y="22">HASH — só de ida</text>
    <rect class="box" x="390" y="40" width="140" height="50" rx="8"/>
    <text class="t-mono" x="460.0" y="61.0" text-anchor="middle">Senha@123</text>
    <text class="t-muted" x="460.0" y="79.0" text-anchor="middle">+ sal</text>
    <rect class="box-accent" x="590" y="40" width="120" height="50" rx="8"/>
    <text class="t-mono" x="650.0" y="70.0" text-anchor="middle">3kF9a...</text>
    <path class="line" d="M530,65 L586,65" marker-end="url(#c8d3-head)"/>
    <text class="t-bad" x="560" y="110" text-anchor="middle">✕ não volta</text>
    <text class="t-muted" x="390" y="140">Para SENHAS: no login, calcula o hash</text>
    <text class="t-muted" x="390" y="158">de novo e compara. Ninguém lê a senha.</text>
    <text class="t-bad" x="10" y="222">Senha criptografada (e não com hash) é falha grave: quem roubar a chave lê todas as senhas.</text>
  </svg>
  <figcaption>Criptografia protege dados que você precisa ler de volta; hash protege senhas, que nunca devem ser lidas.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Security.Cryptography;
using System.Text;

// ── 1) CRIPTOGRAFIA (ida e volta, com chave): AES-256-GCM ──
byte[] chave = RandomNumberGenerator.GetBytes(32);   // 256 bits; em produção vem de um cofre (Key Vault)
byte[] original = Encoding.UTF8.GetBytes("CPF 123.456.789-00");

byte[] nonce = RandomNumberGenerator.GetBytes(12);   // único por mensagem: NUNCA reutilize com a mesma chave
byte[] cifrado = new byte[original.Length];
byte[] tag = new byte[16];                           // o "lacre" que detecta adulteração

using (var aes = new AesGcm(chave, tagSizeInBytes: 16))
    aes.Encrypt(nonce, original, cifrado, tag);
Console.WriteLine($"Cifrado: {cifrado.Length} bytes ilegíveis (+ nonce de {nonce.Length} e tag de {tag.Length} bytes)");

byte[] decifrado = new byte[cifrado.Length];
using (var aes = new AesGcm(chave, tagSizeInBytes: 16))
    aes.Decrypt(nonce, cifrado, tag, decifrado);
Console.WriteLine($"Decifrado com a chave: {Encoding.UTF8.GetString(decifrado)}");

cifrado[0] ^= 0xFF;   // alguém altera UM byte guardado no banco...
try
{
    using var aes = new AesGcm(chave, tagSizeInBytes: 16);
    aes.Decrypt(nonce, cifrado, tag, decifrado);
}
catch (AuthenticationTagMismatchException)
{
    Console.WriteLine("Adulteração detectada: o lacre não confere, e nada é decifrado");
}

// ── 2) HASH DE SENHA (só ida): PBKDF2 com sal e muitas iterações ──
string guardadoNoBanco = HashDeSenha.Gerar("Senha@123");
Console.WriteLine($"Mesma senha gera o mesmo hash? {guardadoNoBanco == HashDeSenha.Gerar("Senha@123")} (o sal aleatório deixa cada hash único)");
Console.WriteLine($"Login com a senha certa : {HashDeSenha.Verificar("Senha@123", guardadoNoBanco)}");
Console.WriteLine($"Login com a senha errada: {HashDeSenha.Verificar("senha@123", guardadoNoBanco)}");

public static class HashDeSenha
{
    private const int Iteracoes = 600_000;   // recomendação da OWASP para PBKDF2-SHA256

    public static string Gerar(string senha)
    {
        byte[] sal = RandomNumberGenerator.GetBytes(16);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(senha, sal, Iteracoes, HashAlgorithmName.SHA256, 32);
        return $"{Iteracoes}.{Convert.ToBase64String(sal)}.{Convert.ToBase64String(hash)}";   // tudo junto numa coluna
    }

    public static bool Verificar(string senha, string guardado)
    {
        string[] partes = guardado.Split('.');
        byte[] sal = Convert.FromBase64String(partes[1]);
        byte[] esperado = Convert.FromBase64String(partes[2]);
        byte[] calculado = Rfc2898DeriveBytes.Pbkdf2(senha, sal, int.Parse(partes[0]), HashAlgorithmName.SHA256, esperado.Length);
        return CryptographicOperations.FixedTimeEquals(calculado, esperado);   // tempo constante: não "vaza" pela demora
    }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Cifrado: 18 bytes ilegíveis (+ nonce de 12 e tag de 16 bytes)
Decifrado com a chave: CPF 123.456.789-00
Adulteração detectada: o lacre não confere, e nada é decifrado
Mesma senha gera o mesmo hash? False (o sal aleatório deixa cada hash único)
Login com a senha certa : True
Login com a senha errada: False</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>AesGcm.Encrypt</code> produz o texto cifrado e uma <code>tag</code> de 16 bytes. Guarde nonce, texto cifrado e tag juntos; a chave fica num cofre.</li>
  <li>Alterar um único byte faz o <code>Decrypt</code> lançar <code>AuthenticationTagMismatchException</code>: o GCM garante <em>confidencialidade e integridade</em>.</li>
  <li><code>Rfc2898DeriveBytes.Pbkdf2</code> com 600.000 iterações torna cada tentativa de senha lenta para quem ataca. O sal aleatório faz duas pessoas com a mesma senha terem hashes diferentes.</li>
  <li><code>CryptographicOperations.FixedTimeEquals</code> compara em tempo constante, para que o tempo da resposta não revele quantos bytes estavam certos.</li>
</ul>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Não invente criptografia</div>
  <p>Use as APIs prontas (<code>AesGcm</code>, <code>PasswordHasher</code> do ASP.NET Core Identity, Data Protection API) e nunca algoritmos obsoletos (MD5, SHA-1 para senhas, DES, AES-ECB). Para proteger cookies, tokens temporários e dados de curta duração, o <strong>Data Protection API</strong> (<code>IDataProtector.Protect</code>/<code>Unprotect</code>) já cuida de chaves, rotação e algoritmos.</p>
</div>

<h3>8.3.3 Gestão de Segredos</h3>

<p class="step-label">📘 O conceito</p>
<p>Senhas de banco, chaves de API e chaves de assinatura <strong>nunca</strong> vão para o código nem para o Git — o histórico do Git é para sempre, e repositórios vazam. O sistema de configuração do .NET empilha fontes, e a última vence: <code>appsettings.json</code> (versionado, sem segredos) → <strong>User Secrets</strong> (desenvolvimento local) → <strong>variáveis de ambiente</strong> → <strong>Azure Key Vault</strong> (produção).</p>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using Microsoft.Extensions.Configuration;

// Em produção, o segredo chega por variável de ambiente ou Key Vault — nunca pelo código ou pelo Git
Environment.SetEnvironmentVariable("Pagamentos__ChaveApi", "sk_live_51HxQ2vindaDoCofre");

var configuracao = new ConfigurationBuilder()
    .AddInMemoryCollection(new Dictionary&lt;string, string?&gt;   // faz o papel do appsettings.json (versionado)
    {
        ["Pagamentos:Url"] = "https://api.pagamentos.com",
        ["Pagamentos:ChaveApi"] = "",                          // vazio de propósito: segredo não vai para o Git
        ["Pagamentos:TimeoutSegundos"] = "30",
    })
    .AddEnvironmentVariables()                                 // quem vem DEPOIS sobrescreve quem veio antes
    .Build();

var opcoes = configuracao.GetSection("Pagamentos").Get&lt;OpcoesDePagamento&gt;()!;
Console.WriteLine($"{"Url",-8} = {opcoes.Url}  (appsettings)");
Console.WriteLine($"{"Timeout",-8} = {opcoes.TimeoutSegundos}s  (appsettings)");
Console.WriteLine($"{"ChaveApi",-8} = {Mascarar(opcoes.ChaveApi)}  (variável de ambiente)");

// Nunca registre um segredo inteiro em log
static string Mascarar(string segredo) =&gt; segredo.Length &lt;= 8 ? "****" : segredo[..8] + new string('*', 8);

public class OpcoesDePagamento
{
    public string Url { get; set; } = "";
    public string ChaveApi { get; set; } = "";
    public int TimeoutSegundos { get; set; }
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Url      = https://api.pagamentos.com  (appsettings)
Timeout  = 30s  (appsettings)
ChaveApi = sk_live_********  (variável de ambiente)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>Pagamentos__ChaveApi</code> (com dois sublinhados) vira a chave <code>Pagamentos:ChaveApi</code>: é assim que variáveis de ambiente alcançam seções aninhadas.</li>
  <li><code>AddEnvironmentVariables()</code> vem depois do "appsettings" e sobrescreve só o que define: Url e Timeout vêm do arquivo, e a chave vem do ambiente.</li>
  <li><code>Get&lt;OpcoesDePagamento&gt;()</code> transforma a seção num objeto tipado. Numa API, use <code>builder.Services.Configure&lt;OpcoesDePagamento&gt;(...)</code> e injete <code>IOptions&lt;OpcoesDePagamento&gt;</code>.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">terminal</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-bash"># Desenvolvimento: User Secrets ficam FORA da pasta do projeto (não vão para o Git)
dotnet user-secrets init
dotnet user-secrets set "Pagamentos:ChaveApi" "sk_test_..."</code></pre>
</div>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// Produção: Azure Key Vault com Managed Identity — nenhuma senha no código nem na configuração
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{nomeDoCofre}.vault.azure.net/"),
    new DefaultAzureCredential());   // no Azure usa a identidade do serviço; localmente, o login do az/VS</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Toda entrada é suspeita: use parâmetros sempre, AES-GCM para dados, hash lento com sal para senhas e segredos fora do código.</p>
</div>

<h2>8.4 Native AOT e Trimming</h2>

<p class="step-label">📘 O conceito</p>
<p>Normalmente, o .NET compila o seu código para IL e, na execução, o <strong>JIT</strong> o transforma em código de máquina. Com <strong>Native AOT</strong>, a compilação para código nativo acontece no <code>publish</code>: o executável sobe em milissegundos, usa menos memória e não precisa do runtime instalado. O <strong>trimming</strong> remove do pacote o código que não é usado. O preço: reflexão dinâmica, geração de código em tempo de execução e algumas bibliotecas deixam de funcionar.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: Comida congelada pronta vs. cozinhar na hora</div>
  <p>O JIT é o restaurante que cozinha cada prato na hora do pedido: flexível, mas o primeiro prato demora. O Native AOT é a marmita congelada pronta: esquenta em segundos, mas o cardápio foi decidido antes — não dá para pedir "algo diferente" na hora (a reflexão dinâmica).</p>
</div>

<table>
  <thead><tr><th></th><th>JIT (padrão)</th><th>Native AOT</th></tr></thead>
  <tbody>
    <tr><td>Tempo de inicialização</td><td>Centenas de ms</td><td>Dezenas de ms</td></tr>
    <tr><td>Memória</td><td>Maior</td><td>Menor</td></tr>
    <tr><td>Desempenho de pico</td><td>Excelente (o JIT otimiza com dados reais)</td><td>Muito bom</td></tr>
    <tr><td>Reflexão / código dinâmico</td><td>Tudo funciona</td><td>Limitado: prefira source generators</td></tr>
    <tr><td>Ideal para</td><td>APIs de longa duração</td><td>Funções serverless, CLIs, containers que escalam do zero</td></tr>
  </tbody>
</table>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">Exemplo.csproj</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-xml">&lt;PropertyGroup&gt;
  &lt;PublishAot&gt;true&lt;/PublishAot&gt;
  &lt;InvariantGlobalization&gt;true&lt;/InvariantGlobalization&gt;
&lt;/PropertyGroup&gt;
&lt;!-- dotnet publish -c Release -r linux-x64   → um executável nativo, sem precisar do runtime --&gt;</code></pre>
</div>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// JSON sem reflexão: o serializador é gerado em tempo de compilação (compatível com AOT)
[JsonSerializable(typeof(Produto))]
[JsonSerializable(typeof(List&lt;Produto&gt;))]
internal partial class AppJsonContext : JsonSerializerContext;

var builder = WebApplication.CreateSlimBuilder(args);   // host enxuto, pensado para AOT
builder.Services.ConfigureHttpJsonOptions(o =&gt; o.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonContext.Default));</code></pre>
</div>

<div class="challenge-box">
  <div class="challenge-box-header">
    <span class="challenge-box-icon">🎯</span>
    <span class="challenge-box-title">Desafio Prático — Capítulo 8</span>
  </div>
  <p>Faça uma <strong>auditoria de performance e segurança</strong> de uma API sua (ou do desafio do Capítulo 4):</p>
  <ol>
    <li>Escreva benchmarks com <code>[MemoryDiagnoser]</code> para os 3 métodos mais chamados e reduza as alocações de pelo menos um com <code>Span</code> ou <code>ArrayPool</code> (8.1 e 8.2).</li>
    <li>Rode <code>dotnet-counters</code> durante um teste de carga e anote as coletas de Gen 2 por minuto antes e depois da otimização.</li>
    <li>Procure concatenação de SQL e troque tudo por parâmetros (8.3.1); rode <code>dotnet list package --vulnerable</code>.</li>
    <li>Garanta que as senhas usem hash com sal (<code>PasswordHasher</code> ou PBKDF2) e que nenhum segredo esteja no Git (8.3.2 e 8.3.3).</li>
  </ol>
  <p>Entregue um relatório curto: problema encontrado, severidade, evidência (medição ou teste) e correção.</p>
</div>
`
},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 9 — CLOUD, DEVOPS & OBSERVABILIDADE
══════════════════════════════════════════════════════════ */
{
  id: 9, slug: 'cloud-devops', icon: '☁️', color: '#06b6d4',
  title: 'Cloud, DevOps & Observabilidade',
  subtitle: 'Docker, Kubernetes, CI/CD, OpenTelemetry e SRE',
  desc: 'Dockerfile multi-stage seguro, health checks e desligamento gracioso, rolling updates, GitHub Actions, logs estruturados, traces distribuídos e SLOs com error budget — com os conceitos da aplicação executáveis.',
  tags: ['Docker','Kubernetes','GitHub Actions','OpenTelemetry','SRE'],
  readTime: 40,
  intro: `Sua aplicação não é apenas código — é código em produção, com um SLA, logs estruturados,
    métricas, rastreamento distribuído e um time de plantão. Um sênior entende o caminho completo
    do código: do commit ao container em produção, passando por CI/CD, health checks, observabilidade
    e alertas. A responsabilidade começa quando o deploy termina.`,
  content: `
<div class="info-box info">
  <div class="info-box-label">🧭 Como estudar este capítulo</div>
  <p>Docker, Kubernetes e pipelines de CI/CD são configuração, não código C# — por isso aparecem como arquivos comentados, prontos para adaptar. Já os conceitos que vivem <em>dentro</em> da aplicação (health checks, desligamento gracioso, logs estruturados, traces e SLOs) têm programas executáveis para você ver funcionando.</p>
</div>

<h2>9.1 Containerização com Docker</h2>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O Contêiner de Navio</div>
  <p>Antes dos contêineres padronizados, cada carga era embarcada de um jeito: sacos, barris, caixas soltas — e sempre algo se perdia ou quebrava na troca de navio para caminhão. O contêiner de aço resolveu isso: o conteúdo viaja <strong>lacrado</strong>, e todo porto do mundo sabe movê-lo.</p>
  <p>Uma imagem Docker é esse contêiner: sua aplicação viaja junto com o runtime, as bibliotecas e a configuração exatas que ela precisa. O "na minha máquina funciona" deixa de existir, porque a máquina vai junto.</p>
</div>

<p class="step-label">📘 O conceito</p>
<p>Uma <strong>imagem</strong> é um pacote imutável com a aplicação e tudo de que ela precisa (runtime, bibliotecas, configuração padrão); um <strong>container</strong> é uma imagem em execução, isolada das outras. O <strong>Dockerfile</strong> é a receita da imagem, executada em <em>camadas</em>: cada instrução gera uma camada, e camadas que não mudaram são reaproveitadas do cache. O <strong>multi-stage build</strong> compila numa imagem grande (com o SDK) e copia só o resultado para uma imagem pequena (só o runtime).</p>

<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 300" role="img" aria-label="Multi-stage build: o stage de build contém código-fonte, SDK, cache NuGet e temporários; apenas a pasta publish é copiada para o stage final, que contém só o runtime e as DLLs">
    <defs><marker id="c9-arr-docker-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="panel" x="10" y="10" width="300" height="240" rx="12"/>
    <text class="t-title" x="30" y="38">STAGE build — imagem sdk</text>
    <rect class="box-bad" x="30" y="56" width="260" height="30" rx="5"/><text x="42" y="76">código-fonte (.cs, .csproj)</text>
    <rect class="box-bad" x="30" y="94" width="260" height="30" rx="5"/><text x="42" y="114">SDK + compilador (Roslyn)</text>
    <rect class="box-bad" x="30" y="132" width="260" height="30" rx="5"/><text x="42" y="152">cache de pacotes NuGet</text>
    <rect class="box-bad" x="30" y="170" width="260" height="30" rx="5"/><text x="42" y="190">obj/ e arquivos temporários</text>
    <rect class="box-good" x="30" y="208" width="260" height="30" rx="5"/><text x="42" y="228">/app/publish (DLLs prontas)</text>
    <rect class="panel" x="420" y="10" width="290" height="240" rx="12"/>
    <text class="t-title" x="440" y="38">STAGE final — imagem aspnet</text>
    <text class="t-muted" x="440" y="76">só o necessário para rodar:</text>
    <rect class="box" x="440" y="94" width="250" height="30" rx="5"/><text x="452" y="114">runtime do ASP.NET Core</text>
    <rect class="box-good" x="440" y="208" width="250" height="30" rx="5"/><text x="452" y="228">/app (as mesmas DLLs)</text>
    <path class="line-good" d="M290,223 L436,223" marker-end="url(#c9-arr-docker-good)"/>
    <text class="t-good t-mono" x="363" y="214" text-anchor="middle">COPY --from</text>
    <text class="t-bad" x="30" y="274">vermelho = fica para trás, nunca chega à produção</text>
    <text class="t-muted" x="30" y="292">Imagem final menor → pull e deploy mais rápidos e menos superfície de ataque (sem compilador nem código-fonte).</text>
  </svg>
  <figcaption>Cozinhe na cozinha industrial (SDK), mas entregue só a marmita (runtime + DLLs).</figcaption>
</figure>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">Dockerfile</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-dockerfile"># ---------- Estágio 1: restaurar (em cache enquanto os .csproj não mudarem) ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Api/Api.csproj", "src/Api/"]
COPY ["src/Dominio/Dominio.csproj", "src/Dominio/"]
COPY ["src/Infraestrutura/Infraestrutura.csproj", "src/Infraestrutura/"]
RUN dotnet restore "src/Api/Api.csproj"

# ---------- Estágio 2: compilar e publicar ----------
COPY . .
RUN dotnet publish "src/Api/Api.csproj" -c Release -o /app/publish --no-restore /p:UseAppHost=false

# ---------- Estágio 3: imagem final, só com o runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
# As imagens .NET 8+ já trazem um usuário sem privilégios ("app") e escutam na porta 8080
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "Api.dll"]
# Health check fica com o orquestrador (probes do Kubernetes, 9.2):
# a imagem aspnet não traz curl, então um HEALTHCHECK com curl falharia sempre.</code></pre>
</div>

<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Copiar primeiro só os <code>.csproj</code> e rodar o <code>restore</code> cria uma camada que fica em cache enquanto as dependências não mudarem: alterar um <code>.cs</code> não baixa os pacotes de novo.</li>
  <li>A imagem final parte de <code>aspnet:8.0</code> (só o runtime), e o SDK, o código-fonte e os arquivos temporários ficam para trás.</li>
  <li><code>USER $APP_UID</code> usa o usuário sem privilégios que as imagens .NET 8+ já trazem: se alguém invadir o container, não será root.</li>
  <li>Para imagens ainda menores e com menos superfície de ataque, use as variantes <em>chiseled</em> (<code>aspnet:8.0-jammy-chiseled</code>), sem shell nem gerenciador de pacotes.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">.dockerignore</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-bash">**/bin/
**/obj/
**/.vs/
**/node_modules/
.git
*.md
**/appsettings.Development.json
**/*.user</code></pre>
</div>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">compose.yaml</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-yaml"># compose.yaml — o ambiente completo de desenvolvimento com um comando: docker compose up
services:
  api:
    build: .
    ports: ["8080:8080"]
    environment:
      ConnectionStrings__Banco: "Server=db;Database=Loja;User=sa;Password=\${SENHA_DB};TrustServerCertificate=true"
      ConnectionStrings__Redis: "redis:6379"
    depends_on:
      db: { condition: service_healthy }
      redis: { condition: service_started }

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: \${SENHA_DB}          # vem do arquivo .env, que NÃO vai para o Git
    healthcheck:
      test: /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$\${MSSQL_SA_PASSWORD}" -Q "SELECT 1"
      interval: 10s
      retries: 10

  redis:
    image: redis:7-alpine</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Imagem pequena, em camadas bem ordenadas, rodando sem privilégios e com a configuração vinda do ambiente: o mesmo artefato do laptop à produção.</p>
</div>

<h2>9.2 Kubernetes em Produção</h2>

<p class="step-label">📘 O conceito</p>
<p>O <strong>Kubernetes</strong> é um orquestrador: você descreve o estado desejado ("3 réplicas desta imagem, com estes recursos") e ele trabalha continuamente para mantê-lo — reiniciando containers que travam, redistribuindo quando um servidor cai e trocando versões sem derrubar o serviço. Para isso, ele precisa que a aplicação <strong>responda perguntas</strong> (health checks) e <strong>saiba desligar</strong> sem perder requisições.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O gerente do restaurante</div>
  <p>O gerente não cozinha, mas garante que sempre haja 3 cozinheiros trabalhando. Se um passa mal (liveness), ele manda para casa e chama outro. Se um novato acabou de chegar e ainda está se trocando (readiness), não recebe pedidos até estar pronto. E, na troca de turno, ninguém sai no meio de um prato: termina o que está fazendo e só então vai embora (graceful shutdown).</p>
</div>

<h3>9.2.1 Health Checks: Liveness e Readiness</h3>

<table>
  <thead><tr><th>Probe</th><th>Pergunta</th><th>Se falhar</th><th>Deve verificar dependências?</th></tr></thead>
  <tbody>
    <tr><td><strong>startup</strong></td><td>"Já terminou de subir?"</td><td>Espera mais um pouco</td><td>Não</td></tr>
    <tr><td><strong>liveness</strong></td><td>"O processo está vivo?"</td><td><strong>Reinicia</strong> o container</td><td><strong>Não</strong>: se o banco cair, reiniciar a API não ajuda</td></tr>
    <tr><td><strong>readiness</strong></td><td>"Posso receber tráfego agora?"</td><td>Tira o pod do balanceador</td><td>Sim: banco, cache, broker</td></tr>
  </tbody>
</table>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();
var banco = new BancoSimulado();
builder.Services.AddSingleton(banco);
builder.Services.AddHealthChecks()
    .AddCheck&lt;BancoHealthCheck&gt;("banco", tags: ["ready"])   // dependência externa: só no readiness
    .AddCheck("memoria", () =&gt; HealthCheckResult.Healthy("uso normal"), tags: ["ready"]);

var app = builder.Build();

// LIVENESS: "o processo está vivo?" — NÃO verifica dependências (Predicate = false)
app.MapHealthChecks("/healthz/live", new HealthCheckOptions { Predicate = _ =&gt; false });

// READINESS: "posso receber tráfego agora?" — verifica o que tem a tag "ready"
app.MapHealthChecks("/healthz/ready", new HealthCheckOptions
{
    Predicate = check =&gt; check.Tags.Contains("ready"),
    ResponseWriter = EscreverJson,
});

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };

await Sondar("Banco no ar");
banco.NoAr = false;
await Sondar("Banco FORA do ar");

await app.StopAsync();

async Task Sondar(string cenario)
{
    Console.WriteLine($"== {cenario}");
    foreach (var url in new[] { "/healthz/live", "/healthz/ready" })
    {
        var resposta = await http.GetAsync(url);
        Console.WriteLine($"   {url,-14} -&gt; {(int)resposta.StatusCode} {await resposta.Content.ReadAsStringAsync()}");
    }
}

static Task EscreverJson(HttpContext contexto, HealthReport relatorio)
{
    contexto.Response.ContentType = "application/json";
    return contexto.Response.WriteAsync(JsonSerializer.Serialize(new
    {
        status = relatorio.Status.ToString(),
        checks = relatorio.Entries.Select(e =&gt; new { nome = e.Key, status = e.Value.Status.ToString(), e.Value.Description }),
    }));
}

public class BancoSimulado { public bool NoAr { get; set; } = true; }

public class BancoHealthCheck(BancoSimulado banco) : IHealthCheck
{
    public Task&lt;HealthCheckResult&gt; CheckHealthAsync(HealthCheckContext contexto, CancellationToken ct = default) =&gt;
        Task.FromResult(banco.NoAr
            ? HealthCheckResult.Healthy("banco respondeu")
            : HealthCheckResult.Unhealthy("banco sem resposta"));
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>== Banco no ar
   /healthz/live  -&gt; 200 Healthy
   /healthz/ready -&gt; 200 {"status":"Healthy","checks":[{"nome":"banco","status":"Healthy","Description":"banco respondeu"},{"nome":"memoria","status":"Healthy","Description":"uso normal"}]}
== Banco FORA do ar
   /healthz/live  -&gt; 200 Healthy
   /healthz/ready -&gt; 503 {"status":"Unhealthy","checks":[{"nome":"banco","status":"Unhealthy","Description":"banco sem resposta"},{"nome":"memoria","status":"Healthy","Description":"uso normal"}]}</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>/healthz/live</code> usa <code>Predicate = _ =&gt; false</code>: não roda nenhum check e só confirma que o processo responde. Continua 200 mesmo com o banco fora.</li>
  <li><code>/healthz/ready</code> roda os checks com a tag <code>ready</code>. Com o banco fora, devolve <strong>503</strong>, e o Kubernetes para de enviar tráfego para este pod, sem reiniciá-lo.</li>
  <li>Pacotes como <code>AspNetCore.HealthChecks.SqlServer</code>, <code>.Redis</code> e <code>.RabbitMQ</code> trazem checks prontos para as dependências mais comuns.</li>
</ul>

<div class="info-box danger">
  <div class="info-box-label">🚨 O erro clássico: dependências na liveness</div>
  <p>Se a liveness verificar o banco e o banco ficar lento, o Kubernetes reinicia <em>todos</em> os pods ao mesmo tempo. Eles sobem, tentam conectar no banco já sobrecarregado, falham de novo e são reiniciados de novo: uma queda em cascata causada pelo próprio health check.</p>
</div>

<h3>9.2.2 Rolling Update e Desligamento Gracioso</h3>

<p class="step-label">📘 O conceito</p>
<p>No <strong>rolling update</strong>, o Kubernetes sobe pods da versão nova, espera cada um passar na readiness e só então remove um antigo. Para remover, ele envia <strong>SIGTERM</strong> ao container e espera até <code>terminationGracePeriodSeconds</code>. O ASP.NET Core trata o SIGTERM: para de aceitar conexões novas e <strong>termina as requisições em andamento</strong> antes de sair.</p>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 260" role="img" aria-label="Rolling update com maxUnavailable zero e maxSurge um: primeiro sobe um pod da versão 2; só quando ele passa na readiness probe um pod da versão 1 é removido; repete até todos serem da versão 2, sem nunca ficar com menos de três pods atendendo">
    <defs><marker id="c9d1-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c9d1-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c9d1-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-muted" x="70" y="24" text-anchor="middle">início</text>
    <rect class="box" x="10" y="36" width="120" height="30" rx="6"/>
    <text class="t-mono" x="70.0" y="56.0" text-anchor="middle">v1</text>
    <rect class="box" x="10" y="74" width="120" height="30" rx="6"/>
    <text class="t-mono" x="70.0" y="94.0" text-anchor="middle">v1</text>
    <rect class="box" x="10" y="112" width="120" height="30" rx="6"/>
    <text class="t-mono" x="70.0" y="132.0" text-anchor="middle">v1</text>
    <text class="t-muted" x="212" y="24" text-anchor="middle">sobe 1 v2</text>
    <rect class="box" x="152" y="36" width="120" height="30" rx="6"/>
    <text class="t-mono" x="212.0" y="56.0" text-anchor="middle">v1</text>
    <rect class="box" x="152" y="74" width="120" height="30" rx="6"/>
    <text class="t-mono" x="212.0" y="94.0" text-anchor="middle">v1</text>
    <rect class="box" x="152" y="112" width="120" height="30" rx="6"/>
    <text class="t-mono" x="212.0" y="132.0" text-anchor="middle">v1</text>
    <rect class="box-good" x="152" y="150" width="120" height="30" rx="6"/>
    <text class="t-mono" x="212.0" y="170.0" text-anchor="middle">v2 (subindo)</text>
    <text class="t-muted" x="354" y="24" text-anchor="middle">v2 pronto → sai 1 v1</text>
    <rect class="box" x="294" y="36" width="120" height="30" rx="6"/>
    <text class="t-mono" x="354.0" y="56.0" text-anchor="middle">v1</text>
    <rect class="box" x="294" y="74" width="120" height="30" rx="6"/>
    <text class="t-mono" x="354.0" y="94.0" text-anchor="middle">v1</text>
    <rect class="box-good" x="294" y="112" width="120" height="30" rx="6"/>
    <text class="t-mono" x="354.0" y="132.0" text-anchor="middle">v2</text>
    <rect class="box-good" x="294" y="150" width="120" height="30" rx="6"/>
    <text class="t-mono" x="354.0" y="170.0" text-anchor="middle">v2 (subindo)</text>
    <text class="t-muted" x="496" y="24" text-anchor="middle">repete</text>
    <rect class="box" x="436" y="36" width="120" height="30" rx="6"/>
    <text class="t-mono" x="496.0" y="56.0" text-anchor="middle">v1</text>
    <rect class="box-good" x="436" y="74" width="120" height="30" rx="6"/>
    <text class="t-mono" x="496.0" y="94.0" text-anchor="middle">v2</text>
    <rect class="box-good" x="436" y="112" width="120" height="30" rx="6"/>
    <text class="t-mono" x="496.0" y="132.0" text-anchor="middle">v2</text>
    <rect class="box-good" x="436" y="150" width="120" height="30" rx="6"/>
    <text class="t-mono" x="496.0" y="170.0" text-anchor="middle">v2 (subindo)</text>
    <text class="t-muted" x="638" y="24" text-anchor="middle">fim</text>
    <rect class="box-good" x="578" y="36" width="120" height="30" rx="6"/>
    <text class="t-mono" x="638.0" y="56.0" text-anchor="middle">v2</text>
    <rect class="box-good" x="578" y="74" width="120" height="30" rx="6"/>
    <text class="t-mono" x="638.0" y="94.0" text-anchor="middle">v2</text>
    <rect class="box-good" x="578" y="112" width="120" height="30" rx="6"/>
    <text class="t-mono" x="638.0" y="132.0" text-anchor="middle">v2</text>
    <text class="t-muted" x="10" y="216">maxSurge: 1 → no máximo 1 pod a mais durante a troca. maxUnavailable: 0 → nunca menos pods prontos do que o pedido.</text>
    <text class="t-good" x="10" y="238">A readiness probe decide quando o pod novo recebe tráfego: sem ela, usuários caem num app que ainda está subindo.</text>
  </svg>
  <figcaption>Rolling update: troca os pods um a um, e só remove o antigo quando o novo está pronto.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:0");   // porta livre qualquer (só para a demonstração)
builder.Logging.ClearProviders();
var app = builder.Build();
var relogio = Stopwatch.StartNew();
var relatorioComecou = new TaskCompletionSource();

app.Lifetime.ApplicationStopping.Register(() =&gt;
    Console.WriteLine($"[{Tempo()}] SIGTERM recebido: parando de aceitar novas requisições"));
app.Lifetime.ApplicationStopped.Register(() =&gt;
    Console.WriteLine($"[{Tempo()}] aplicação encerrada"));

app.MapGet("/relatorio", async () =&gt;
{
    Console.WriteLine($"[{Tempo()}] relatório começou (vai levar 1 s)");
    relatorioComecou.SetResult();
    await Task.Delay(1000);   // uma requisição "em voo" quando o desligamento chega
    Console.WriteLine($"[{Tempo()}] relatório terminou");
    return "relatório pronto";
});

await app.StartAsync();
using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };

Task&lt;string&gt; emVoo = http.GetStringAsync("/relatorio");
await relatorioComecou.Task;   // garante que a requisição já está "em voo"

// O Kubernetes manda SIGTERM ao remover o pod; StopAsync faz o mesmo aqui
await app.StopAsync();
Console.WriteLine($"[{Tempo()}] o cliente recebeu: \\"{await emVoo}\\" (nenhuma requisição perdida)");

string Tempo() =&gt; $"{relogio.ElapsedMilliseconds / 100 * 100,5} ms";   // arredondado a 100 ms</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(tempos, contagens e IDs variam conforme a máquina e a execução)</span></div>
  <pre>[  300 ms] relatório começou (vai levar 1 s)
[  300 ms] SIGTERM recebido: parando de aceitar novas requisições
[ 1300 ms] relatório terminou
[ 1400 ms] aplicação encerrada
[ 1400 ms] o cliente recebeu: "relatório pronto" (nenhuma requisição perdida)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Assim que a requisição de 1 s começa, chega o "SIGTERM" (<code>StopAsync</code>).</li>
  <li>A aplicação para de aceitar novas requisições, mas espera o relatório terminar, e o cliente recebe a resposta completa.</li>
  <li><code>ApplicationStopping</code> é o lugar para interromper trabalhos em segundo plano (via <code>CancellationToken</code>, Capítulo 3.3.1). O tempo máximo de espera é configurável com <code>HostOptions.ShutdownTimeout</code>.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">deployment.yaml</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: pedidos-api
spec:
  replicas: 3
  selector:
    matchLabels: { app: pedidos-api }
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0     # nunca fica com menos de 3 pods prontos
      maxSurge: 1           # sobe 1 pod extra por vez durante a troca
  template:
    metadata:
      labels: { app: pedidos-api }
    spec:
      terminationGracePeriodSeconds: 30   # tempo para terminar requisições em voo após o SIGTERM
      containers:
      - name: api
        image: ghcr.io/minha-org/pedidos-api:1.4.0   # versão fixa, nunca "latest" em produção
        ports: [{ containerPort: 8080 }]
        resources:
          requests: { cpu: "100m", memory: "128Mi" }   # o que o pod precisa (usado para agendar)
          limits:   { memory: "512Mi" }                # acima disso, o pod é reiniciado (OOMKilled)
        env:
        - name: ConnectionStrings__Banco
          valueFrom:
            secretKeyRef: { name: pedidos-segredos, key: banco }
        startupProbe:                 # dá tempo para a aplicação subir
          httpGet: { path: /healthz/live, port: 8080 }
          periodSeconds: 5
          failureThreshold: 24
        livenessProbe:                # travou? o Kubernetes reinicia o container
          httpGet: { path: /healthz/live, port: 8080 }
          periodSeconds: 10
        readinessProbe:               # não está pronto? sai do balanceador (sem reiniciar)
          httpGet: { path: /healthz/ready, port: 8080 }
          periodSeconds: 5</code></pre>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>O orquestrador cuida da disponibilidade se a aplicação colaborar: liveness sem dependências, readiness com elas, desligamento gracioso e uma imagem versionada.</p>
</div>

<h2>9.3 CI/CD com GitHub Actions</h2>

<p class="step-label">📘 O conceito</p>
<p><strong>CI</strong> (integração contínua): a cada push, o código é compilado e testado automaticamente — problemas aparecem em minutos, não na véspera da entrega. <strong>CD</strong> (entrega contínua): o que passou pela CI vira um artefato versionado (a imagem) e é implantado de forma automática e repetível, com aprovação humana onde fizer sentido. O ponto central: <strong>o mesmo artefato</strong> passa por todos os ambientes; só a configuração muda.</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A linha de montagem com controle de qualidade</div>
  <p>Numa fábrica de carros, cada peça passa por estações de inspeção automáticas; uma peça com defeito é barrada na hora, e não quando o carro já está com o cliente. No fim, o carro recebe um número de chassi (a versão da imagem) e um lacre (a assinatura), e é esse carro exato — não outro "igual" — que vai para a concessionária.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>

<figure class="diagram">
  <pre class="mermaid">
flowchart LR
    A[push / PR] --&gt; B[build + testes]
    B --&gt; C[scan de pacotes vulneráveis]
    C --&gt; D[imagem Docker]
    D --&gt; E[assina a imagem]
    E --&gt; F[deploy em staging]
    F --&gt; G{aprovação}
    G --&gt; H[rolling update em produção]
    H --&gt; I[observa SLOs]
    I -. piorou .-&gt; J[rollback]
  </pre>
  <figcaption>Da alteração no código à produção, com portões de qualidade em cada etapa.</figcaption>
</figure>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">.github/workflows/ci-cd.yml</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-yaml">name: ci-cd
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

env:
  IMAGEM: ghcr.io/\${{ github.repository }}/pedidos-api

jobs:
  testes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with: { dotnet-version: '8.0.x' }
      - run: dotnet restore
      - run: dotnet build --no-restore -c Release
      - run: dotnet test --no-build -c Release --collect:"XPlat Code Coverage"
      - name: Pacotes com vulnerabilidades conhecidas
        run: |
          dotnet list package --vulnerable --include-transitive | tee vuln.txt
          ! grep -q "has the following vulnerable packages" vuln.txt

  imagem:
    needs: testes
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write, id-token: write }
    outputs:
      digest: \${{ steps.build.outputs.digest }}
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - id: build
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: \${{ env.IMAGEM }}:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      - uses: sigstore/cosign-installer@v3        # instala o cosign...
      - run: cosign sign --yes \${{ env.IMAGEM }}@\${{ steps.build.outputs.digest }}   # ...e assina a imagem

  deploy:
    needs: imagem
    runs-on: ubuntu-latest
    environment: producao          # exige aprovação manual, configurada no GitHub
    steps:
      - run: |
          kubectl set image deployment/pedidos-api api=\${{ env.IMAGEM }}@\${{ needs.imagem.outputs.digest }}
          kubectl rollout status deployment/pedidos-api --timeout=5m</code></pre>
</div>

<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>O job <code>testes</code> roda em todo push e PR; <code>imagem</code> e <code>deploy</code>, só na <code>main</code>.</li>
  <li>O passo de vulnerabilidades falha o build se algum pacote tiver uma falha conhecida (OWASP A06, Capítulo 8.3).</li>
  <li>A imagem é marcada com o SHA do commit e implantada pelo <em>digest</em> (<code>@sha256:...</code>): impossível implantar "outra imagem com a mesma tag".</li>
  <li>O <code>cosign</code> assina a imagem, e o cluster pode ser configurado para só aceitar imagens assinadas pela sua pipeline (OWASP A08).</li>
  <li>O <code>environment: producao</code> permite exigir aprovação manual no GitHub antes do deploy.</li>
</ul>

<h2>9.4 Observabilidade com OpenTelemetry</h2>

<p class="step-label">📘 O conceito</p>
<p><strong>Monitorar</strong> é saber <em>se</em> algo está errado; <strong>observabilidade</strong> é conseguir descobrir <em>por quê</em>, inclusive para problemas que você nunca imaginou. Ela se apoia em três sinais: <strong>métricas</strong> (números agregados no tempo), <strong>traces</strong> (o caminho de uma requisição entre serviços) e <strong>logs</strong> (eventos com contexto). O <strong>OpenTelemetry</strong> é o padrão aberto para coletar os três e enviá-los para qualquer ferramenta (Grafana, Jaeger, Datadog, Application Insights).</p>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: O painel e a caixa-preta do avião</div>
  <p>O painel mostra velocidade, altitude e combustível (as métricas): avisa que algo está estranho. O plano de voo com cada trecho e horário (o trace) mostra onde o atraso aconteceu. A caixa-preta, com cada comando e alerta registrados com contexto (os logs), explica o porquê. Um piloto — ou um time de plantão — precisa dos três.</p>
</div>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 230" role="img" aria-label="Os três pilares da observabilidade: métricas dizem que algo está errado, traces mostram onde, e logs explicam por quê">
    <defs><marker id="c9d2-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c9d2-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c9d2-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect class="box-accent" x="10" y="30" width="222" height="100" rx="8"/>
    <text x="121.0" y="67.0" text-anchor="middle" font-weight="600">MÉTRICAS</text>
    <text class="t-muted" x="121.0" y="85.0" text-anchor="middle">números ao longo do tempo</text>
    <text class="t-mono t-muted" x="121.0" y="103.0" text-anchor="middle">"a latência P99 subiu"</text>
    <text x="121" y="156" text-anchor="middle" font-weight="600">QUE algo está errado</text>
    <path class="line" d="M232,80 L246,80" marker-end="url(#c9d2-head)"/>
    <rect class="box-warn" x="248" y="30" width="222" height="100" rx="8"/>
    <text x="359.0" y="67.0" text-anchor="middle" font-weight="600">TRACES</text>
    <text class="t-muted" x="359.0" y="85.0" text-anchor="middle">o caminho de uma requisição</text>
    <text class="t-mono t-muted" x="359.0" y="103.0" text-anchor="middle">"90% do tempo no SELECT"</text>
    <text x="359" y="156" text-anchor="middle" font-weight="600">ONDE está o problema</text>
    <path class="line" d="M470,80 L484,80" marker-end="url(#c9d2-head)"/>
    <rect class="box-good" x="486" y="30" width="222" height="100" rx="8"/>
    <text x="597.0" y="67.0" text-anchor="middle" font-weight="600">LOGS</text>
    <text class="t-muted" x="597.0" y="85.0" text-anchor="middle">eventos com contexto</text>
    <text class="t-mono t-muted" x="597.0" y="103.0" text-anchor="middle">"timeout no pedido 42"</text>
    <text x="597" y="156" text-anchor="middle" font-weight="600">POR QUE aconteceu</text>
    <text class="t-muted" x="10" y="196">Ligue os três pelo trace id: do alerta (métrica) ao trace, e do trace aos logs daquela requisição.</text>
    <text class="t-good" x="10" y="218">OpenTelemetry é o padrão aberto que coleta os três e envia para qualquer ferramenta.</text>
  </svg>
  <figcaption>Métricas avisam, traces localizam, logs explicam.</figcaption>
</figure>

<h3>9.4.1 Logs Estruturados</h3>

<p class="step-label">📘 O conceito</p>
<p>Um log estruturado não é uma frase: é um <strong>evento com campos</strong>. Em vez de "Pedido 42 criado com valor 1500", grava-se <code>{PedidoId: 42, Valor: 1500}</code>. Assim, dá para buscar "todos os pedidos acima de 1.000 com erro na última hora" em segundos. No .NET, isso vem de graça quando se usam <strong>templates</strong> no <code>ILogger</code> — e se perde quando se usa interpolação de string.</p>

<p class="step-label">▶️ Rode você mesmo</p>
<p class="run-setup">🛠️ Prepare o projeto antes: <br><code>dotnet new web -n Exemplo</code></p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Text.Encodings.Web;
using Microsoft.Extensions.Logging;

// Logs em JSON: cada campo vira uma propriedade pesquisável (Seq, Elastic, Loki, Application Insights)
using var fabrica = LoggerFactory.Create(b =&gt; b.AddJsonConsole(o =&gt;
{
    o.IncludeScopes = true;
    o.JsonWriterOptions = new() { Indented = false, Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping };   // acentos legíveis
}));
var log = fabrica.CreateLogger("Pedidos");

// ❌ Interpolação: vira UM texto; não dá para filtrar "todos os pedidos acima de 1.000"
log.LogInformation($"Pedido 42 criado com valor 1500");

// ✅ Template com propriedades nomeadas: cada {Campo} vira um campo do JSON
using (log.BeginScope("Requisição {CorrelationId}", "req-7f3a"))
{
    log.LogInformation("Pedido {PedidoId} criado com valor {Valor}", 42, 1500m);
    log.LogWarning("Estoque baixo para {Produto}: restam {Quantidade}", "Teclado", 2);
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>{"EventId":0,"LogLevel":"Information","Category":"Pedidos","Message":"Pedido 42 criado com valor 1500","State":{"Message":"Pedido 42 criado com valor 1500","{OriginalFormat}":"Pedido 42 criado com valor 1500"},"Scopes":[]}
{"EventId":0,"LogLevel":"Information","Category":"Pedidos","Message":"Pedido 42 criado com valor 1500","State":{"Message":"Pedido 42 criado com valor 1500","PedidoId":42,"Valor":1500,"{OriginalFormat}":"Pedido {PedidoId} criado com valor {Valor}"},"Scopes":[{"Message":"Requisição req-7f3a","CorrelationId":"req-7f3a","{OriginalFormat}":"Requisição {CorrelationId}"}]}
{"EventId":0,"LogLevel":"Warning","Category":"Pedidos","Message":"Estoque baixo para Teclado: restam 2","State":{"Message":"Estoque baixo para Teclado: restam 2","Produto":"Teclado","Quantidade":2,"{OriginalFormat}":"Estoque baixo para {Produto}: restam {Quantidade}"},"Scopes":[{"Message":"Requisição req-7f3a","CorrelationId":"req-7f3a","{OriginalFormat}":"Requisição {CorrelationId}"}]}</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Com interpolação (<code>$"..."</code>), o JSON tem só a mensagem pronta: os números viraram texto e não dá para filtrar por eles.</li>
  <li>Com template (<code>"Pedido {PedidoId} ..."</code>), cada campo aparece separado em <code>State</code>: <code>PedidoId</code>, <code>Valor</code>, <code>Produto</code>.</li>
  <li><code>BeginScope</code> adiciona o <code>CorrelationId</code> a todos os logs do bloco. É assim que o middleware do Capítulo 4.1.2 liga todos os logs de uma requisição.</li>
</ul>

<h3>9.4.2 Traces Distribuídos</h3>

<p class="step-label">📘 O conceito</p>
<p>Um <strong>trace</strong> é a história de uma requisição: uma árvore de <strong>spans</strong> (etapas), cada um com início, duração e atributos. Todos compartilham o mesmo <strong>trace id</strong>, que viaja nos cabeçalhos HTTP (<code>traceparent</code>) e nas mensagens, costurando a história mesmo entre serviços diferentes. No .NET, a API nativa é <code>ActivitySource</code>/<code>Activity</code>; o OpenTelemetry coleta essas Activities e as exporta.</p>

<p class="step-label">🖼️ Veja o mecanismo</p>
<figure class="diagram">
  <svg class="dg" viewBox="0 0 720 230" role="img" aria-label="Trace de uma requisição lenta em cascata: POST /comprar leva 3 segundos; dentro dele, a validação leva 100 ms, a gravação do pedido 100 ms, e uma consulta ao banco leva 2,6 segundos, o gargalo">
    <defs><marker id="c9d3-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c9d3-head-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-good" d="M0,0 L10,5 L0,10 z"/></marker><marker id="c9d3-head-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="head-bad" d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text class="t-title" x="10" y="22">TRACE a1b2c3 — POST /comprar</text>
    <text x="10" y="56">Gateway: POST /comprar</text>
    <rect class="box" x="230.0" y="40" width="470.00000000000006" height="24" rx="4"/>
    <text class="t-muted" x="238.0" y="57">3000 ms</text>
    <text x="24" y="90">Pedidos: processar</text>
    <rect class="box" x="237.83333333333334" y="74" width="462.1666666666667" height="24" rx="4"/>
    <text class="t-muted" x="245.83333333333334" y="91">2950 ms</text>
    <text x="38" y="124">validar</text>
    <rect class="box-good" x="239.4" y="108" width="15.666666666666668" height="24" rx="4"/>
    <text class="t-muted" x="261.06666666666666" y="125">100 ms</text>
    <text x="38" y="158">INSERT pedido</text>
    <rect class="box-good" x="256.6333333333333" y="142" width="15.666666666666668" height="24" rx="4"/>
    <text class="t-muted" x="278.3" y="159">100 ms</text>
    <text x="38" y="192">SELECT estoque</text>
    <rect class="box-bad" x="273.8666666666667" y="176" width="407.33333333333337" height="24" rx="4"/>
    <text class="t-bad" x="281.8666666666667" y="193">2600 ms  ← sem índice</text>
    <text class="t-good" x="10" y="222">Sem trace: "o sistema está lento". Com trace: "falta um índice na consulta de estoque", em segundos.</text>
  </svg>
  <figcaption>Um trace distribuído mostra onde, exatamente, o tempo de uma requisição foi gasto.</figcaption>
</figure>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Diagnostics;

// ActivitySource é a API nativa do .NET para traces; o OpenTelemetry coleta e exporta essas Activities
var fonte = new ActivitySource("Loja.Pedidos");

// Um "ouvinte" que imprime cada span ao terminar (no mundo real: o exportador OTLP do OpenTelemetry)
ActivitySource.AddActivityListener(new ActivityListener
{
    ShouldListenTo = s =&gt; s.Name == "Loja.Pedidos",
    Sample = (ref ActivityCreationOptions&lt;ActivityContext&gt; _) =&gt; ActivitySamplingResult.AllDataAndRecorded,
    ActivityStopped = a =&gt; Console.WriteLine(
        $"{new string(' ', Profundidade(a) * 3)}{a.DisplayName,-22} ~{Math.Round(a.Duration.TotalMilliseconds / 100) * 100,4} ms  " +
        $"trace={a.TraceId.ToString()[..6]}...  {string.Join(" ", a.Tags.Select(t =&gt; $"{t.Key}={t.Value}"))}"),
});

using (var raiz = fonte.StartActivity("POST /pedidos"))
{
    raiz?.SetTag("http.method", "POST");
    await Etapa("Validar pedido", 100);
    await Etapa("SELECT estoque", 600, ("db.system", "sqlserver"));   // o gargalo aparece aqui
    await Etapa("Publicar evento", 100, ("messaging.system", "rabbitmq"));
}
Console.WriteLine("Todos os spans têm o MESMO trace id: é assim que as ferramentas montam a árvore.");

async Task Etapa(string nome, int ms, params (string Chave, object Valor)[] tags)
{
    using var span = fonte.StartActivity(nome);   // filho automático do span atual (Activity.Current)
    foreach (var (chave, valor) in tags) span?.SetTag(chave, valor);
    await Task.Delay(ms);
}

static int Profundidade(Activity a) { int n = 0; for (var p = a.Parent; p is not null; p = p.Parent) n++; return n; }</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code> <span class="console-note">(tempos, contagens e IDs variam conforme a máquina e a execução)</span></div>
  <pre>   Validar pedido         ~ 100 ms  trace=3bae41...  
   SELECT estoque         ~ 600 ms  trace=3bae41...  db.system=sqlserver
   Publicar evento        ~ 100 ms  trace=3bae41...  messaging.system=rabbitmq
POST /pedidos          ~ 900 ms  trace=3bae41...  http.method=POST
Todos os spans têm o MESMO trace id: é assim que as ferramentas montam a árvore.</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li><code>fonte.StartActivity("...")</code> abre um span. Dentro do <code>using</code> da raiz, os spans criados viram filhos automaticamente, via <code>Activity.Current</code>.</li>
  <li>Os filhos terminam antes do pai, por isso aparecem primeiro. A soma mostra claramente que o <code>SELECT estoque</code> é o gargalo.</li>
  <li>Atributos como <code>db.system</code> seguem as <em>convenções semânticas</em> do OpenTelemetry: qualquer ferramenta entende o que significam.</li>
  <li>O <code>ActivityListener</code> aqui só imprime. Em produção, quem escuta é o OpenTelemetry, que envia para o Jaeger, Tempo ou Application Insights.</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">csharp</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">// dotnet add package OpenTelemetry.Extensions.Hosting
// dotnet add package OpenTelemetry.Instrumentation.AspNetCore
// dotnet add package OpenTelemetry.Instrumentation.Http
// dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
builder.Services.AddOpenTelemetry()
    .ConfigureResource(r =&gt; r.AddService("pedidos-api", serviceVersion: "1.4.0"))
    .WithTracing(t =&gt; t
        .AddAspNetCoreInstrumentation(o =&gt; o.Filter = ctx =&gt; !ctx.Request.Path.StartsWithSegments("/healthz"))
        .AddHttpClientInstrumentation()
        .AddSource("Loja.Pedidos"))            // os seus ActivitySource (exemplo acima)
    .WithMetrics(m =&gt; m
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()           // pacote OpenTelemetry.Instrumentation.Runtime
        .AddMeter("Loja.Negocio"))             // as suas métricas de negócio
    .UseOtlpExporter();                        // envia tudo para o Collector (OTEL_EXPORTER_OTLP_ENDPOINT)

builder.Logging.AddOpenTelemetry(o =&gt;
{
    o.IncludeScopes = true;
    o.IncludeFormattedMessage = true;          // os logs também saem com o trace id da requisição
});

// Métrica de negócio: quantos pedidos, de quanto
var medidor = new Meter("Loja.Negocio");
var pedidos = medidor.CreateCounter&lt;long&gt;("loja.pedidos.criados");
var valores = medidor.CreateHistogram&lt;double&gt;("loja.pedidos.valor", unit: "BRL");
pedidos.Add(1, new KeyValuePair&lt;string, object?&gt;("pagamento", "pix"));
valores.Record(149.90);</code></pre>
</div>

<h3>9.4.3 SLIs, SLOs e Error Budget</h3>

<p class="step-label">📘 O conceito</p>
<ul><li><strong>SLI</strong> (indicador): o que você mede — "porcentagem de requisições sem erro", "P99 de latência".</li><li><strong>SLO</strong> (objetivo): a meta para o indicador — "99,9% das requisições sem erro em 30 dias".</li><li><strong>Error budget</strong> (orçamento de erro): o que a meta <em>permite</em> falhar — com 99,9%, 0,1% das requisições. Enquanto sobra orçamento, o time pode arriscar (publicar mais rápido); quando acaba, a prioridade vira estabilidade.</li><li><strong>Burn rate</strong>: a velocidade com que o orçamento está sendo gasto. Alerta-se sobre ele, e não sobre cada erro isolado.</li></ul>

<div class="info-box tip">
  <div class="info-box-label">💡 No dia a dia: A mesada do mês</div>
  <p>Um SLO de 99,9% é como uma mesada de 43 minutos de indisponibilidade por mês. Gastar um pouco por dia é normal. O que preocupa é o ritmo: se em uma hora você gastou o que deveria durar dois dias, alguém precisa agir agora. Se chegou ao fim do mês com sobra, dava para ter arriscado mais.</p>
</div>

<p class="step-label">▶️ Rode você mesmo</p>
<div class="code-block-wrapper runnable">
  <div class="code-header"><span class="code-lang">▶ Program.cs — completo e executável</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-csharp">using System.Globalization;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

// 30 dias de tráfego simulado: 1 milhão de requisições (semente fixa: o resultado é sempre o mesmo)
var aleatorio = new Random(42);
var latencias = new List&lt;double&gt;();
int erros = 0;
for (int i = 0; i &lt; 1_000_000; i++)
{
    double ms = 40 + aleatorio.NextDouble() * 60;         // a maioria entre 40 e 100 ms
    if (aleatorio.NextDouble() &lt; 0.02) ms += 400;          // 2% bem lentas
    latencias.Add(ms);
    if (aleatorio.NextDouble() &lt; 0.0006) erros++;          // 0,06% de erros 5xx
}
latencias.Sort();

// SLIs: o que medimos
double P(double percentil) =&gt; latencias[(int)(percentil / 100 * (latencias.Count - 1))];
double disponibilidade = 1 - (double)erros / latencias.Count;
Console.WriteLine($"Latência  P50 = {P(50):F0} ms | P95 = {P(95):F0} ms | P99 = {P(99):F0} ms");
Console.WriteLine($"Média     = {latencias.Average():F0} ms  (a média ESCONDE os 2% lentos; os percentis não)");

// SLO: a meta. Error budget: quanto de falha a meta permite
const double Slo = 0.999;                                   // 99,9% de sucesso em 30 dias
int orcamento = (int)(latencias.Count * (1 - Slo));
Console.WriteLine($"Disponibilidade = {disponibilidade:P3} (SLO: {Slo:P1})");
Console.WriteLine($"Error budget    = {orcamento} erros permitidos; usados {erros} ({(double)erros / orcamento:P0}); restam {orcamento - erros}");

// Burn rate: a que velocidade o orçamento está sendo gasto (1,0 = acaba exatamente no fim dos 30 dias)
foreach (var (janela, taxaDeErro) in new[] { ("última hora (normal)", 0.0006), ("última hora (incidente)", 0.02) })
{
    double burnRate = taxaDeErro / (1 - Slo);
    string alerta = burnRate &gt;= 14.4 ? "ACORDE ALGUÉM (orçamento some em ~2 dias)" : "ok";
    Console.WriteLine($"Burn rate na {janela,-23}: {burnRate,5:F1}x -&gt; {alerta}");
}</code></pre>
</div>
<div class="console-output">
  <div class="console-header">Saída de <code>dotnet run</code></div>
  <pre>Latência  P50 = 71 ms | P95 = 98 ms | P99 = 470 ms
Média     = 78 ms  (a média ESCONDE os 2% lentos; os percentis não)
Disponibilidade = 99,941% (SLO: 99,9%)
Error budget    = 1000 erros permitidos; usados 590 (59%); restam 410
Burn rate na última hora (normal)   :   0,6x -&gt; ok
Burn rate na última hora (incidente):  20,0x -&gt; ACORDE ALGUÉM (orçamento some em ~2 dias)</pre>
</div>
<p><strong>🔍 Entendendo o código:</strong></p>
<ul>
  <li>Os percentis mostram a experiência real: o P50 é o usuário típico, e o P99 é o 1% mais lento. A média esconde os 2% de requisições lentas; o P99 as revela.</li>
  <li>Com 1 milhão de requisições e um SLO de 99,9%, o orçamento é de 1.000 erros no mês. A simulação usou cerca de 60%.</li>
  <li>Um burn rate de <strong>14,4x</strong> numa hora significa esgotar o orçamento de 30 dias em ~2 dias: é o limiar clássico para acionar o plantão (do livro de SRE do Google).</li>
</ul>

<div class="code-block-wrapper">
  <div class="code-header"><span class="code-lang">alertas.yaml</span><button class="copy-btn">Copiar</button></div>
  <pre><code class="language-yaml"># Regras de alerta do Prometheus para o SLO "99,9% das requisições sem erro 5xx"
# (métrica emitida pelo ASP.NET Core 8+: http.server.request.duration)
groups:
- name: pedidos-api-slo
  rules:
  # Queima RÁPIDA do orçamento: 14,4x na última hora (e confirmado nos últimos 5 min) → acorda alguém
  - alert: ErrorBudgetBurnRapido
    expr: |
      (
        sum(rate(http_server_request_duration_seconds_count{job="pedidos-api", http_response_status_code=~"5.."}[1h]))
        / sum(rate(http_server_request_duration_seconds_count{job="pedidos-api"}[1h]))
      ) &gt; (14.4 * 0.001)
      and
      (
        sum(rate(http_server_request_duration_seconds_count{job="pedidos-api", http_response_status_code=~"5.."}[5m]))
        / sum(rate(http_server_request_duration_seconds_count{job="pedidos-api"}[5m]))
      ) &gt; (14.4 * 0.001)
    labels: { severity: page }
    annotations:
      summary: "pedidos-api vai esgotar o error budget do mês em ~2 dias"
      runbook: "https://wiki.interna/runbooks/pedidos-api-erros"

  # Latência: P99 acima de 500 ms por 10 minutos → ticket, não plantão
  - alert: LatenciaP99Alta
    expr: |
      histogram_quantile(0.99, sum by (le) (
        rate(http_server_request_duration_seconds_bucket{job="pedidos-api"}[5m]))) &gt; 0.5
    for: 10m
    labels: { severity: ticket }</code></pre>
</div>

<div class="info-box warning">
  <div class="info-box-label">⚠️ Alerte sintomas, não causas</div>
  <p>"CPU a 90%" não é um problema se os usuários estão bem; "5% das requisições com erro" é, qualquer que seja a causa. Alertas que acordam alguém devem estar ligados a SLOs (a experiência do usuário) e ter um <strong>runbook</strong>: o que verificar e como agir. O resto vira ticket para o horário comercial.</p>
</div>

<div class="info-box info">
  <div class="info-box-label">🧠 Resumo em uma frase</div>
  <p>Métricas avisam, traces localizam e logs explicam; e os SLOs, com o error budget, dizem quando agir e quando é seguro acelerar.</p>
</div>

<div class="challenge-box">
  <div class="challenge-box-header">
    <span class="challenge-box-icon">🎯</span>
    <span class="challenge-box-title">Desafio Prático — Capítulo 9</span>
  </div>
  <p>Leve a API de algum capítulo anterior até a "produção" local:</p>
  <ol>
    <li>Escreva um Dockerfile multi-stage que rode como usuário não-root e um <code>compose.yaml</code> com a API, o banco e o Redis (9.1).</li>
    <li>Implemente <code>/healthz/live</code> e <code>/healthz/ready</code>, derrube o banco e observe a diferença entre as duas (9.2.1).</li>
    <li>Crie um workflow do GitHub Actions que teste, verifique vulnerabilidades e publique a imagem no GHCR (9.3).</li>
    <li>Adicione OpenTelemetry com um span próprio e uma métrica de negócio; suba o Jaeger (<code>docker run -p 16686:16686 -p 4317:4317 jaegertracing/all-in-one</code>) e encontre o span mais lento de uma requisição (9.4).</li>
  </ol>
  <p>Bônus: defina um SLO para a API e escreva o runbook do alerta de burn rate.</p>
</div>
`
}
]; // fim do array CHAPTERS

// Permite carregar os dados em Node (testes e tools/verificar-programas.mjs) sem afetar o navegador.
if (typeof module !== 'undefined' && module.exports) module.exports = CHAPTERS;
