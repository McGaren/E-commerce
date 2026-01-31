let produtos = [];
let listaCarrinho = [];

const vitrine = document.querySelector("#vitrine");
const contadorElemento = document.querySelector("#contador");
const inputBusca = document.querySelector("#campo-busca");
const filtrosContainer = document.querySelector(".filtros");
const secaoCheckout = document.querySelector("#secao-checkout");
const listaResumo = document.querySelector("#lista-resumo");
const valorTotalElemento = document.querySelector("#valor-total");

// --- 2. INTEGRAÇÃO COM API ---
async function buscarProdutosAPI() {
    vitrine.innerHTML = `<div class="loading"><p>Carregando produtos...</p></div>`;
    try {
        const resposta = await fetch('https://fakestoreapi.com/products');
        if (!resposta.ok) throw new Error("Erro no servidor");
        const dados = await resposta.json();
        
        produtos = dados.map(item => ({
            nome: item.title,
            preco: item.price,
            imagem: item.image,
            categoria: item.category,
            emEstoque: true
        }));
        renderizarProdutos(produtos);
    } catch (erro) {
        vitrine.innerHTML = `<p>⚠️ Erro ao carregar loja. <button onclick="buscarProdutosAPI()">Tentar novamente</button></p>`;
    }
}

// --- 3. RENDERIZAÇÃO DA VITRINE ---
function renderizarProdutos(lista) {
    vitrine.innerHTML = "";
    lista.forEach((produto, index) => {
        vitrine.innerHTML += `
            <div class="card-produto">
                <img src="${produto.imagem}" class="foto-produto">
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco.toFixed(2)}</p>
                <button type="button" onclick="adicionarAoCarrinho(${index})">Comprar</button>
            </div>`;
    });
}

// --- 4. LÓGICA DO CARRINHO ---
function adicionarAoCarrinho(index) {
    if (listaCarrinho.length >= 5) {
        alert("Limite de 5 itens atingido!");
        return;
    }
    listaCarrinho.push(produtos[index]);
    atualizarContador();
    salvarCarrinhoNoStorage();
}

function atualizarContador() {
    contadorElemento.innerText = listaCarrinho.length;
}

function limparCarrinho() {
    if (confirm("Limpar todo o carrinho?")) {
        listaCarrinho = [];
        atualizarContador();
        localStorage.removeItem("carrinhoSalvo");
        if (!secaoCheckout.classList.contains("escondido")) voltarParaLoja();
    }
}

// --- 5. BUSCA E FILTROS ---
function buscarProduto() {
    const termo = inputBusca.value.toLowerCase();
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
    renderizarProdutos(filtrados);
}

function filtrarPorCategoria(cat) {
    const filtrados = produtos.filter(p => p.categoria === cat);
    renderizarProdutos(filtrados);
}

function mostrarTodos() { renderizarProdutos(produtos); }

// --- 6. CHECKOUT E NAVEGAÇÃO ---
function irParaCheckout() {
    if (listaCarrinho.length === 0) return alert("Carrinho vazio!");
    
    vitrine.classList.add("escondido");
    filtrosContainer.classList.add("escondido");
    secaoCheckout.classList.remove("escondido");
    
    renderizarResumo();
}

function renderizarResumo() {
    listaResumo.innerHTML = "";
    listaCarrinho.forEach(item => {
        listaResumo.innerHTML += `<p>✅ ${item.nome} - <strong>R$ ${item.preco.toFixed(2)}</strong></p>`;
    });
    const total = listaCarrinho.reduce((acc, p) => acc + p.preco, 0);
    valorTotalElemento.innerText = total.toFixed(2);
}

function voltarParaLoja() {
    secaoCheckout.classList.add("escondido");
    vitrine.classList.remove("escondido");
    filtrosContainer.classList.remove("escondido");
}

function finalizarCompra() {
    alert("🚀 Pagamento Confirmado!");
    limparCarrinho();
}

// --- 7. INICIALIZAÇÃO ---
function salvarCarrinhoNoStorage() {
    localStorage.setItem("carrinhoSalvo", JSON.stringify(listaCarrinho));
}

function carregarCarrinhoDoStorage() {
    const salvo = localStorage.getItem("carrinhoSalvo");
    if (salvo) {
        listaCarrinho = JSON.parse(salvo);
        atualizarContador();
    }
}

carregarCarrinhoDoStorage();
buscarProdutosAPI();