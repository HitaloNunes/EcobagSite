// ===== CONFIGURAÇÃO =====
// Número no formato internacional: 55 (Brasil) + DDD + número, só dígitos.
const WHATSAPP_NUMERO = "558599518597";

// ===== PRODUTOS =====
// Para adicionar/editar ecobags, basta mexer nesta lista.
// "imagem": caminho da foto (ex.: "img/girassol.jpg"). Se vazio, mostra um ícone.
const produtos = [
  { id: 1, nome: "Ecobag Dá Seus Pulos",   categoria: "Ecobag", preco: 45.0, descricao: "Ecobag com ilustração e gesto de \"Dá seus pulos\"", imagem: "assets\\faco_de_minhas_maos.jpeg", tag: "Novidade" },
  { id: 2, nome: "Ecobag Faço de minhas mãos",    categoria: "Ecobag",      preco: 35.0, descricao: "Ecobag com texto Faço de Minhas mãos",   imagem: "assets\\i_love_cuscuz.jpeg", tag: "Novidade" },
  { id: 3, nome: "Ecobag I Love Cuscuz",      categoria: "Ecobag", preco: 50.0, descricao: "Ecobag ensinando a soletrar \"cuscuz\"",              imagem: "assets\\da_seus_pulos.jpeg", tag: "Novidade" },
  { id: 4, nome: "Ecobag Letras Libras",  categoria: "Ecobag", preco: 45.0, descricao: "Ecobag com foto de Ernest Huet.",                     imagem: "assets\\letras_libras_ernest.jpeg", tag: "Novidade" },
  { id: 5, nome: "Ecobag Libras em Ondas",  categoria: "Ecobag",      preco: 55.0, descricao: "Ecobag com titulo Libras e ondas coloridas",                  imagem: "assets\\libras_ondas.jpeg", tag: "Novidade" },
  { id: 6, nome: "Ecobag Qual seu Super Poder?", categoria: "Ecobag", preco: 60.0, descricao: "Ecobag perguntando qual o seu superpoder", imagem: "assets\\qual_seu_super_poder.jpeg", tag: "Novidade" },
];

// ===== FUNÇÕES =====
const formatarPreco = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function abrirWhatsApp(mensagem) {
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener");
}

function criarCard(p) {
  const card = document.createElement("article");
  card.className = "card";

  const imagem = p.imagem
    ? `<img src="${p.imagem}" alt="${p.nome}" loading="lazy">`
    : `<div class="placeholder" aria-hidden="true">👜</div>`;

  card.innerHTML = `
    <div class="card__img">
      ${imagem}
      ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
    </div>
    <div class="card__corpo">
      <h3>${p.nome}</h3>
      <p class="card__desc">${p.descricao}</p>
      <p class="card__preco">${formatarPreco(p.preco)}</p>
      <button class="btn btn--whats">Quero esta!</button>
    </div>
  `;

  card.querySelector("button").addEventListener("click", () => {
    abrirWhatsApp(`Olá! Tenho interesse na *${p.nome}* (${formatarPreco(p.preco)}). Ainda está disponível?`);
  });

  return card;
}

function renderizarProdutos(categoria = "Todas") {
  const grade = document.getElementById("grade");
  grade.innerHTML = "";
  produtos
    .filter((p) => categoria === "Todas" || p.categoria === categoria)
    .forEach((p) => grade.appendChild(criarCard(p)));
}

function renderizarFiltros() {
  const container = document.getElementById("filtros");
  const categorias = ["Todas", ...new Set(produtos.map((p) => p.categoria))];

  categorias.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "filtro" + (i === 0 ? " ativo" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      container.querySelectorAll(".filtro").forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      renderizarProdutos(cat);
    });
    container.appendChild(btn);
  });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  renderizarFiltros();
  renderizarProdutos();

  // Todos os botões com data-whats abrem o WhatsApp com a mensagem definida
  document.querySelectorAll("[data-whats]").forEach((el) =>
    el.addEventListener("click", () => abrirWhatsApp(el.dataset.whats))
  );

  document.getElementById("ano").textContent = new Date().getFullYear();
});
