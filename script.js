// Vitrine - Catálogo interativo de produtos
// APIs utilizadas: DummyJSON (produtos) e Frankfurter (cotação USD/BRL).
const API_PRODUTOS = "https://dummyjson.com/products?limit=100";
const API_COTACAO = "https://api.frankfurter.app/latest?from=USD&to=BRL";
const CHAVE_FAVORITOS = "vitrine_favoritos";

// Traduções e ajustes dos dados da API para apresentação em português.
const categoriasPT = {
  beauty: "Beleza", fragrances: "Perfumes", furniture: "Móveis",
  groceries: "Alimentos", "home-decoration": "Decoração",
  "kitchen-accessories": "Acessórios de cozinha", laptops: "Notebooks",
  "mens-shirts": "Camisas masculinas", "mens-shoes": "Calçados masculinos",
  "mens-watches": "Relógios masculinos", "mobile-accessories": "Acessórios para celular",
  motorcycle: "Motocicletas", "skin-care": "Cuidados com a pele",
  smartphones: "Celulares", "sports-accessories": "Acessórios esportivos",
  sunglasses: "Óculos de sol", tablets: "Tablets",
  tops: "Blusas", vehicle: "Veículos", "womens-bags": "Bolsas femininas",
  "womens-dresses": "Vestidos", "womens-jewellery": "Joias femininas",
  "womens-shoes": "Calçados femininos", "womens-watches": "Relógios femininos"
};
const traducoes = {
  "Essence Mascara Lash Princess": "Máscara para cílios Essence Lash Princess",
  "Eyeshadow Palette with Mirror": "Paleta de sombras com espelho",
  "Powder Canister": "Pote para pó facial",
  "Red Lipstick": "Batom vermelho",
  "Red Nail Polish": "Esmalte vermelho",
  "Calvin Klein CK One": "Perfume Calvin Klein CK One",
  "Chanel Coco Noir Eau De": "Perfume Chanel Coco Noir",
  "Dior J'adore": "Perfume Dior J'adore",
  "Dolce Shine Eau de": "Perfume Dolce Shine",
  "Gucci Bloom Eau de": "Perfume Gucci Bloom",
  "Annibale Colombo Bed": "Cama Annibale Colombo",
  "Annibale Colombo Sofa": "Sofá Annibale Colombo",
  "Bedside Table African Cherry": "Mesa de cabeceira em cerejeira",
  "Knoll Saarinen Executive Conference Chair": "Cadeira executiva Knoll Saarinen",
  "Wooden Bathroom Sink With Mirror": "Pia de banheiro de madeira com espelho",
  "Apple": "Maçã", "Beef": "Carne bovina", "Cat Food": "Ração para gatos",
  "Chicken Meat": "Carne de frango", "Cooking Oil": "Óleo de cozinha",
  "Cucumber": "Pepino", "Dog Food": "Ração para cães", "Eggs": "Ovos",
  "Fish Steak": "Filé de peixe", "Green Bell Pepper": "Pimentão verde",
  "Green Chili Pepper": "Pimenta verde", "Honey Jar": "Pote de mel",
  "Ice Cream": "Sorvete", "Juice": "Suco", "Kiwi": "Kiwi",
  "Lemon": "Limão", "Milk": "Leite", "Mulberry": "Amora",
  "Nescafe Coffee": "Café Nescafé", "Potatoes": "Batatas",
  "Protein Powder": "Proteína em pó", "Red Onions": "Cebolas roxas",
  "Rice": "Arroz", "Soft Drinks": "Refrigerantes", "Strawberry": "Morango",
  "Tissue Paper": "Papel-toalha", "Water": "Água"
};
const descricoesPT = {
  beauty: "Produto de beleza para complementar sua rotina de cuidados pessoais.",
  fragrances: "Fragrância para uso diário ou ocasiões especiais.",
  furniture: "Móvel pensado para trazer praticidade e estilo ao ambiente.",
  groceries: "Produto para o dia a dia, ideal para sua casa.",
  laptops: "Equipamento de informática para estudos, trabalho e entretenimento.",
  smartphones: "Dispositivo móvel para comunicação, aplicativos e outras tarefas.",
  tablets: "Dispositivo portátil para produtividade e entretenimento.",
  "home-decoration": "Item decorativo para deixar seu ambiente mais agradável.",
  "skin-care": "Produto desenvolvido para os cuidados com a pele."
};

let produtos = [];
let cotacaoDolar = 5.50; // valor de contingência caso a API de câmbio esteja indisponível
let favoritos = carregarFavoritos();
let mostrandoFavoritos = false;

const grade = document.getElementById("gradeProdutos");
const mensagem = document.getElementById("mensagem");
const campoPesquisa = document.getElementById("campoPesquisa");
const filtroCategoria = document.getElementById("filtroCategoria");

function carregarFavoritos() {
  try { return JSON.parse(localStorage.getItem(CHAVE_FAVORITOS)) || []; }
  catch (erro) { console.warn("Não foi possível ler os favoritos:", erro); return []; }
}
function salvarFavoritos() {
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
  atualizarContador();
}
function atualizarContador() {
  document.getElementById("contadorFavoritos").textContent = favoritos.length;
}
function formatarReal(valorUSD) {
  return (valorUSD * cotacaoDolar).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function nomeEmPortugues(produto) {
  return traducoes[produto.title] || produto.title
    .replaceAll(" - ", " ")
    .replace(/\b(with|for|and)\b/gi, "")
    .trim();
}
function categoriaEmPortugues(categoria) {
  return categoriasPT[categoria] || categoria.replaceAll("-", " ");
}
function descricaoEmPortugues(produto) {
  // A descrição original é mantida como informação complementar quando não há tradução específica.
  return descricoesPT[produto.category] ||
    `Conheça ${nomeEmPortugues(produto).toLowerCase()}, da categoria ${categoriaEmPortugues(produto.category).toLowerCase()}. Um produto selecionado para você.`;
}
async function carregarCotacao() {
  try {
    const resposta = await fetch(API_COTACAO);
    if (!resposta.ok) throw new Error("Falha ao consultar a cotação.");
    const dados = await resposta.json();
    if (dados.rates && dados.rates.BRL) cotacaoDolar = dados.rates.BRL;
  } catch (erro) {
    console.warn("Cotação indisponível; usando taxa de contingência de R$ 5,50.", erro);
  }
}
async function carregarProdutos() {
  mensagem.hidden = false;
  mensagem.className = "mensagem";
  mensagem.textContent = "Carregando produtos...";
  try {
    const resposta = await fetch(API_PRODUTOS);
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
    const dados = await resposta.json();
    produtos = dados.products || [];
    preencherCategorias();
    renderizarProdutos(produtos);
  } catch (erro) {
    mensagem.hidden = false;
    mensagem.className = "mensagem erro";
    mensagem.textContent = "Não foi possível carregar os produtos. Verifique sua conexão e tente novamente.";
    console.error(erro);
  }
}
function preencherCategorias() {
  const categorias = [...new Set(produtos.map(p => p.category))].sort();
  categorias.forEach(cat => {
    const opcao = document.createElement("option");
    opcao.value = cat;
    opcao.textContent = categoriaEmPortugues(cat);
    filtroCategoria.appendChild(opcao);
  });
}
function renderizarProdutos(lista) {
  grade.innerHTML = "";
  mensagem.hidden = lista.length > 0;
  if (!lista.length) {
    mensagem.textContent = mostrandoFavoritos ? "Você ainda não adicionou produtos aos favoritos." : "Nenhum produto encontrado.";
    mensagem.className = "mensagem vazio";
  }
  document.getElementById("quantidadeProdutos").textContent = `${lista.length} produto(s)`;
  lista.forEach(produto => {
    const salvo = favoritos.some(f => f.id === produto.id);
    const cartao = document.createElement("article");
    cartao.className = "produto";
    cartao.innerHTML = `
      <div class="imagem-produto">
        <img src="${produto.thumbnail}" alt="${nomeEmPortugues(produto)}" loading="lazy">
        <button class="favoritar ${salvo ? "salvo" : ""}" aria-label="${salvo ? "Remover dos" : "Adicionar aos"} favoritos" title="Favoritar">${salvo ? "♥" : "♡"}</button>
      </div>
      <div class="info-produto">
        <span class="categoria">${categoriaEmPortugues(produto.category)}</span>
        <h3 class="nome-produto">${nomeEmPortugues(produto)}</h3>
        <div class="preco">${formatarReal(produto.price)}</div>
        <div class="acoes"><button class="detalhes-btn">Ver detalhes</button></div>
      </div>`;
    cartao.querySelector(".favoritar").addEventListener("click", () => alternarFavorito(produto));
    cartao.querySelector(".detalhes-btn").addEventListener("click", () => abrirDetalhes(produto));
    grade.appendChild(cartao);
  });
}
function alternarFavorito(produto) {
  const existe = favoritos.some(f => f.id === produto.id);
  favoritos = existe ? favoritos.filter(f => f.id !== produto.id) :
    [...favoritos, { id: produto.id, title: produto.title, price: produto.price, thumbnail: produto.thumbnail, category: produto.category }];
  salvarFavoritos();
  aplicarFiltros();
}
function aplicarFiltros() {
  const termo = campoPesquisa.value.toLocaleLowerCase("pt-BR").trim();
  const categoria = filtroCategoria.value;
  let lista = mostrandoFavoritos ? produtos.filter(p => favoritos.some(f => f.id === p.id)) : [...produtos];
  lista = lista.filter(p => nomeEmPortugues(p).toLocaleLowerCase("pt-BR").includes(termo) &&
    (categoria === "todas" || p.category === categoria));
  renderizarProdutos(lista);
}
function abrirDetalhes(produto) {
  const modal = document.getElementById("modalDetalhes");
  document.getElementById("conteudoDetalhes").innerHTML = `
    <div class="detalhe-layout">
      <img src="${produto.thumbnail}" alt="${nomeEmPortugues(produto)}">
      <div>
        <span class="categoria">${categoriaEmPortugues(produto.category)}</span>
        <h3>${nomeEmPortugues(produto)}</h3>
        <p>${descricaoEmPortugues(produto)}</p>
        <div class="detalhe-preco">${formatarReal(produto.price)}</div>
        <p>Avaliação: ${produto.rating ?? "Não informada"} / 5</p>
      </div>
    </div>`;
  modal.showModal();
}
document.getElementById("fecharModal").addEventListener("click", () => document.getElementById("modalDetalhes").close());
document.getElementById("modalDetalhes").addEventListener("click", e => {
  if (e.target.id === "modalDetalhes") e.target.close();
});
document.getElementById("formPesquisa").addEventListener("submit", e => { e.preventDefault(); aplicarFiltros(); });
campoPesquisa.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);
document.getElementById("btnTodos").addEventListener("click", () => {
  mostrandoFavoritos = false;
  document.getElementById("btnTodos").classList.add("ativo");
  document.getElementById("btnFavoritos").classList.remove("ativo");
  document.getElementById("tituloLista").textContent = "Produtos em destaque";
  aplicarFiltros();
});
document.getElementById("btnFavoritos").addEventListener("click", () => {
  mostrandoFavoritos = true;
  document.getElementById("btnFavoritos").classList.add("ativo");
  document.getElementById("btnTodos").classList.remove("ativo");
  document.getElementById("tituloLista").textContent = "Seus favoritos";
  aplicarFiltros();
});

async function iniciar() {
  atualizarContador();
  await carregarCotacao();
  await carregarProdutos();
}
iniciar();
