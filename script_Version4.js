// Comentário: este arquivo controla a interatividade da cartinha, animações
// e efeitos visuais (corações). Comentários foram adicionados para explicar
// cada seção e a finalidade das funções.
// Cartinha interativa — script.js
// Versão: remoção do controle de texto na UI.
// Agora você substitui o texto diretamente no código (veja setLetterText).

/* -------------------------
   Seleção de elementos DOM
   ------------------------- */
const envelope = document.getElementById('envelope');       // div que representa o envelope clicável
const openBtn = document.getElementById('openBtn');         // botão para abrir/fechar
const letter = document.getElementById('letter');           // artigo com o conteúdo da carta
const letterContent = document.getElementById('letterContent'); // container onde o texto aparece com "typewriter"
const authorEl = document.getElementById('author');         // elemento onde aparece o autor/assinatura
const fxCanvas = document.getElementById('fxCanvas');       // canvas para corações caindo

// Comentário: cria (ou recupera) um layer fixo para renderizar os corações
// DOM acima de outros elementos transformados (evita que fiquem "presas"
// atrás do envelope). É um container com `position:fixed; inset:0`.
let heartLayer = document.getElementById('heartLayer');
if (!heartLayer) {
  heartLayer = document.createElement('div');
  heartLayer.id = 'heartLayer';
  heartLayer.style.position = 'fixed';
  heartLayer.style.inset = '0';
  heartLayer.style.pointerEvents = 'none';
  heartLayer.style.zIndex = '9999';
  document.body.appendChild(heartLayer);
}

/* -------------------------
   Dados iniciais / estado
   ------------------------- */
// Texto padrão — substitua este valor via setLetterText() abaixo
let defaultText = `oi ka,

Desde que te conheci, cada dia ganhou mais cor.
Seu sorriso é minha paz e seu abraço, meu lugar favorito.
Quero caminhar ao seu lado, construir pequenas felicidades
e poder acompanhar cada momento da sua vida e da suas conquistas.
e quero que possa sonhar com todas as aventuras que ainda voce possa viver.
voce é a pessoa mais especial que eu já conheci.
voce me faz querer ser uma pessoa melhor a cada dia.
voce é a minha inspiração diária de poder correr atrás dos meus sonhos.
quero estar ao seu lado em todos os momentos, sejam eles bons ou ruins,
pois é com você que eu quero compartilhar minha vida.
e tambem quero que saiba que sempre estarei aqui para te apoiar,
te ouvir e te amar incondicionalmente.
e tambem quero que saiba que eu te admiro muito,
e tambemq quero que voce realize todos os seus sonhos,
pois voce merece o melhor que a vida pode oferecer.
voce e a pessoa mais incrível que eu já conheci,
e eu sou muito grato por ter voce na minha vida.
voce e uma pessoa muito foda e eu admiro muito a sua força,
sua determinação e sua coragem de enfrentar os desafios da vida.
eu gosto de voce do jeitinho que voce é,
nao quero que voce mude por mim ou por qualquer outra pessoa.
quero que voce seja sempre autentica e verdadeira consigo mesma,
pois é isso que te torna tão especial e única.


gosto de voce mais do que palavras possa dizer.
quero que voce saiba que voce muito foda nao importa o que aconteça.
e que os outros falam de voce.
💕💕

Beijos, e lindo abraço 
(kayan)`;

// Texto atual (será exibido na carta)
let currentText = defaultText;
// Autor da assinatura (padrão "Você")
let currentAuthor = 'kayan';

/* -------------------------
   UTIL: mudar o texto e autor programaticamente
   - use setLetterText("seu texto aqui") para trocar o conteúdo
   - use setAuthor("Seu Nome") para trocar a assinatura
   ------------------------- */
function setLetterText(text) {
  currentText = text || defaultText;
}
function setAuthor(name) {
  currentAuthor = name || 'Você';
  authorEl.textContent = currentAuthor;
}

/* Exemplo: se quiser já definir a cartinha aqui no código, descomente e edite:
   setLetterText(`Minha cartinha personalizada...

   Coloque aqui todo o conteúdo que quiser.`);
   setAuthor('Kayan');
   ------------------------------------------------------------------ */
// setLetterText(`Meu amor,\n\nEssa cartinha foi colocada diretamente no código.\nTe amo!\n\nBeijos,\nKayan`);
// setAuthor('Kayan');

/* -------------------------
   TYPEWRITER: digita o texto progressivamente
   - text: string a ser digitada
   - target: elemento DOM onde inserir
   - speed: ms por caractere
   ------------------------- */
let typingTimer = null;
function typeText(text, target, speed = 24) {
  target.textContent = '';
  let i = 0;
  clearInterval(typingTimer);
  typingTimer = setInterval(() => {
    target.textContent = text.slice(0, i);
    i++;
    if (i > text.length) {
      clearInterval(typingTimer);
    }
  }, speed);
}

/* -------------------------
   ABRIR / FECHAR ENVELOPE
   ------------------------- */
function openEnvelope() {
  if (envelope.classList.contains('open')) return;
  envelope.classList.remove('closing');
  envelope.classList.add('open');
  envelope.setAttribute('aria-expanded', 'true');
  openBtn.disabled = true;
  openBtn.textContent = 'Abrindo...';

  setTimeout(() => {
    openBtn.disabled = false;
    openBtn.textContent = 'Fechar cartinha';
    letter.classList.remove('hidden');
    letter.setAttribute('aria-hidden', 'false');
    letter.classList.remove('closing');
    // aplica autor atual (caso tenha sido alterado programaticamente)
    authorEl.textContent = currentAuthor;
    // inicia efeito de digitação com o texto atual
    typeText(currentText, letterContent, 20);
    spawnHearts(10);       // corações DOM flutuantes
    startFallingHearts();  // corações caindo via canvas
  }, 650);
}

function closeEnvelope() {
  if (!envelope.classList.contains('open')) return;

  // anima a carta dobrando
  letter.classList.add('closing');
  letter.setAttribute('aria-hidden', 'true');
  openBtn.disabled = true;
  openBtn.textContent = 'Fechando...';

  setTimeout(() => {
    letter.classList.add('hidden');
    letter.classList.remove('closing');
    stopFallingHearts();
    envelope.classList.add('closing');
    envelope.classList.remove('open');
    envelope.setAttribute('aria-expanded', 'false');

    setTimeout(() => {
      envelope.classList.remove('closing');
      openBtn.disabled = false;
      openBtn.textContent = 'Abrir cartinha';
      letterContent.textContent = '';
    }, 650);
  }, 420);
}

function toggleEnvelope() {
  if (envelope.classList.contains('open')) closeEnvelope();
  else openEnvelope();
}

/* -------------------------
   CORAÇÕES (DOM) - decorativo
   Comentário: corações criados no DOM agora CAEM do topo para baixo
   (efeito "falling hearts"). Cada coração começa acima da janela
   e anima para baixo usando o keyframe `fallDown`.
   ------------------------- */
function spawnHearts(count = 8) {
  for (let i = 0; i < count; i++) createHeart();
}
function createHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  h.innerHTML = heartSVG();
  // anexar o coração ao layer criado (evita problemas de stacking com
  // elementos transformados como o envelope)
  heartLayer.appendChild(h);
  // Comentário: restringe o surgimento dos corações à largura do envelope
  // para que eles caiam verticalmente sobre o envelope e não por toda
  // a largura da janela.
  const envelopeRect = envelope.getBoundingClientRect();
  const minX = Math.max(0, envelopeRect.left + 8);
  const maxX = Math.min(window.innerWidth, envelopeRect.right - 8);
  const startX = minX + Math.random() * Math.max(1, maxX - minX);
  // delay menor para espalhar o início sem agrupar muitos num mesmo frame
  const delay = 200 + Math.random() * 1200;
  // começa ligeiramente acima do envelope
  const startY = Math.max(-80, envelopeRect.top - 48);
  // usar posicionamento absoluto dentro do layer (heartLayer é fixed)
  h.style.position = 'absolute';
  h.style.left = `${startX}px`;
  h.style.top = `${startY}px`;
  h.style.opacity = 0;
  // reduzir variação de escala para que o coração não fique maior que o envelope
  const scale = 0.6 + Math.random() * 0.4;
  h.style.transform = `translateY(0) scale(${scale})`;
  h.style.zIndex = 30; // garantir sobreposição visível ao envelope
  // Aumenta duração para simular queda mais lenta (como folhas caindo)
  // duração entre ~4500ms e ~8200ms
  const duration = 4500 + Math.random() * 3700;
  // distancia final da queda: até sair da viewport (garante que não fique "presa")
  const endDistance = Math.max(240, window.innerHeight - startY + 80);
  h.style.setProperty('--fall-distance', `${endDistance}px`);
  h.style.transition = `opacity 500ms ease ${delay}ms`;
  requestAnimationFrame(() => {
    h.style.opacity = 1;
    // usa o keyframe `fallDown` (criado no CSS) para animar verticalmente
    // e aplica uma aceleração mais suave (ease-in-out) parecida com
    // o comportamento de folhas ao cair.
    h.style.animation = `fallDown ${duration}ms ease-in-out ${delay}ms forwards`;
  });
  // remover após terminar a animação (margem extra de 400ms)
  setTimeout(()=> h.remove(), duration + delay + 400);
}
function heartSVG(){
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21s-7.5-4.7-10-8c-2.5-3.1 0-7 3.1-7 2.1 0 3.4 1.1 3.9 1.7.5-.6 1.8-1.7 3.9-1.7 3.1 0 5.6 3.9 3.1 7-2.5 3.3-10 8-10 8z" fill="#FF6B6B"/>
  </svg>`;
}

/* -------------------------
   CANVAS: CORAÇÕES CAINDO (requestAnimationFrame)
   ------------------------- */
const ctx = fxCanvas.getContext('2d');
let running = false;
let hearts = [];
let lastTs = 0;

function resizeCanvas() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnCanvasHearts(n = 40) {
  hearts = [];
  for (let i = 0; i < n; i++) {
    hearts.push({
      x: Math.random() * fxCanvas.width,
      y: -Math.random() * fxCanvas.height,
      vy: 1 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 1.2,
      size: 8 + Math.random() * 18,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04,
      color: `hsl(${Math.floor(Math.random() * 30 + 330)}, 75%, ${50 + Math.random()*10}%)`
    });
  }
}

function drawHeartPath(ctx, x, y, size, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  const s = size / 2;
  ctx.moveTo(0, s * 0.6);
  ctx.bezierCurveTo(0 + s, s * 0.1, s * 1.1, -s * 0.8, 0, -s * 1.5);
  ctx.bezierCurveTo(-s * 1.1, -s * 0.8, -s, s * 0.1, 0, s * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function stepCanvas(ts) {
  if (!running) return;
  const dt = ts - (lastTs || ts);
  lastTs = ts;
  ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  for (let p of hearts) {
    p.x += p.vx * (dt / 16);
    p.y += p.vy * (dt / 16);
    p.vy += 0.006 * (dt / 16);
    p.angle += p.spin * (dt / 16);
    ctx.fillStyle = p.color;
    drawHeartPath(ctx, p.x, p.y, p.size, p.angle);
    if (p.y - p.size > fxCanvas.height) {
      p.y = -10 - Math.random() * 60;
      p.x = Math.random() * fxCanvas.width;
      p.vy = 1 + Math.random() * 2.5;
      p.vx = (Math.random() - 0.5) * 1.2;
    }
    if (p.x < -50) p.x = fxCanvas.width + 50;
    if (p.x > fxCanvas.width + 50) p.x = -50;
  }
  requestAnimationFrame(stepCanvas);
}

function startFallingHearts() {
  if (running) return;
  spawnCanvasHearts(60);
  running = true;
  lastTs = 0;
  requestAnimationFrame(stepCanvas);
}

function stopFallingHearts() {
  running = false;
  hearts = [];
  ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
}

/* -------------------------
   BIND DE EVENTOS (limpo: sem controles de texto na UI)
   ------------------------- */
envelope.addEventListener('click', toggleEnvelope); // clicar no envelope abre/fecha
openBtn.addEventListener('click', toggleEnvelope);  // botão também alterna

/* -------------------------
   Observação final
   - Para trocar o texto da cartinha sem UI, chame:
       setLetterText("seu texto grande aqui...");
       setAuthor("Seu Nome");
     Você pode chamar essas funções diretamente neste arquivo (antes de qualquer openEnvelope())
     ou a partir de outro script que inclua este.
   ------------------------- */