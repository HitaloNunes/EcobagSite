// ===== CONFIGURAÇÃO =====
// Número no formato internacional: 55 (Brasil) + DDD + número, só dígitos.
const WHATSAPP_NUMERO = "558599518597";

// Tempo (ms) para o carrossel avançar sozinho
const AUTOPLAY_MS = 3500;

// ===== ESTAMPAS DO MOSTRUÁRIO =====
// Só nome e foto: o preço agora depende apenas do tamanho (definido no HTML).
const estampas = [
  { nome: "Da Seus Pulos", imagem: "assets/ecobags/da_seus_pulos.jpeg" },
  { nome: "Faço de Minhas Mãos", imagem: "assets/ecobags/faco_de_minhas_maos.jpeg" },
  { nome: "I Love Cuscuz", imagem: "assets/ecobags/i_love_cuscuz.jpeg" },
  { nome: "Letras - Libras", imagem: "assets/ecobags/letras_libras_ernest.jpeg" },
  { nome: "Libras em Ondas", imagem: "assets/ecobags/libras_ondas.jpeg" },
  { nome: "Qual o seu Superpoder?", imagem: "assets/ecobags/qual_seu_super_poder.jpeg" },
  { nome: "Deaf Community", imagem: "assets/ecobags/deaf_community.jpeg" },
];

// ===== WHATSAPP =====
function abrirWhatsApp(mensagem) {
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener");
}

// ===== CARROSSEL =====
function iniciarCarrossel() {
  const carrossel = document.getElementById("carrossel");
  const trilho = document.getElementById("trilho");
  const pontosEl = document.getElementById("pontos");

  trilho.innerHTML = estampas.map((e) => `
    <div class="slide">
      <figure>
        <img src="${e.imagem}" alt="${e.nome}" draggable="false" loading="lazy">
        <figcaption>${e.nome}</figcaption>
      </figure>
    </div>`).join("");

  let indice = 0;
  let timer = null;

  // Quantos slides aparecem ao mesmo tempo (vem do CSS: 1, 2 ou 3)
  const porVista = () =>
    parseInt(getComputedStyle(carrossel).getPropertyValue("--por-vista")) || 1;
  const ultimoIndice = () => Math.max(0, estampas.length - porVista());

  function irPara(i, deslocamentoPx = 0) {
    const max = ultimoIndice();
    if (i > max) i = 0;          // volta ao início
    if (i < 0) i = max;          // vai para o fim
    indice = i;

    const passo = 100 / porVista();
    const extra = (deslocamentoPx / trilho.clientWidth) * 100;
    trilho.style.transform = `translateX(${-indice * passo + extra}%)`;
    desenharPontos();
  }

  function desenharPontos() {
    const total = ultimoIndice() + 1;
    if (pontosEl.children.length !== total) {
      pontosEl.innerHTML = "";
      for (let i = 0; i < total; i++) {
        const p = document.createElement("button");
        p.className = "ponto";
        p.setAttribute("aria-label", `Ir para a estampa ${i + 1}`);
        p.addEventListener("click", () => { irPara(i); reiniciarAutoplay(); });
        pontosEl.appendChild(p);
      }
    }
    [...pontosEl.children].forEach((p, i) => p.classList.toggle("ativo", i === indice));
  }

  // Autoplay
  const iniciarAutoplay = () => { timer = setInterval(() => irPara(indice + 1), AUTOPLAY_MS); };
  const pararAutoplay = () => clearInterval(timer);
  const reiniciarAutoplay = () => { pararAutoplay(); iniciarAutoplay(); };

  document.getElementById("anterior").addEventListener("click", () => { irPara(indice - 1); reiniciarAutoplay(); });
  document.getElementById("proximo").addEventListener("click", () => { irPara(indice + 1); reiniciarAutoplay(); });

  // Pausa enquanto o mouse está em cima
  carrossel.addEventListener("mouseenter", pararAutoplay);
  carrossel.addEventListener("mouseleave", iniciarAutoplay);

  // Arrastar com mouse ou dedo (Pointer Events cobrem os dois)
  let inicioX = null;
  let deltaX = 0;

  trilho.addEventListener("pointerdown", (ev) => {
    inicioX = ev.clientX;
    deltaX = 0;
    trilho.classList.add("arrastando");
    trilho.setPointerCapture(ev.pointerId);
    pararAutoplay();
  });

  trilho.addEventListener("pointermove", (ev) => {
    if (inicioX === null) return;
    deltaX = ev.clientX - inicioX;
    irPara(indice, deltaX);
  });

  const soltar = () => {
    if (inicioX === null) return;
    trilho.classList.remove("arrastando");
    const limite = trilho.clientWidth / porVista() / 5; // arrastou 20% de um slide? troca
    if (deltaX < -limite) irPara(indice + 1);
    else if (deltaX > limite) irPara(indice - 1);
    else irPara(indice);
    inicioX = null;
    iniciarAutoplay();
  };
  trilho.addEventListener("pointerup", soltar);
  trilho.addEventListener("pointercancel", soltar);

  // Recalcula ao girar o celular / redimensionar a janela
  window.addEventListener("resize", () => irPara(Math.min(indice, ultimoIndice())));

  irPara(0);
  iniciarAutoplay();
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  iniciarCarrossel();

  // Todos os botões com data-whats abrem o WhatsApp com a mensagem definida
  document.querySelectorAll("[data-whats]").forEach((el) =>
    el.addEventListener("click", () => abrirWhatsApp(el.dataset.whats))
  );

  document.getElementById("ano").textContent = new Date().getFullYear();
});