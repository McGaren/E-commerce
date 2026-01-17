// --- 1 --- Lista de produtos disponíveis na loja

const produtos = [
    { nome: "Mouse Gamer", preco: 150.00, emEstoque: true },
    { nome: "Teclado Mecânico", preco: 300.00, emEstoque: true },
    { nome: "Monitor 144hz", preco: 1200.00, emEstoque: false },
    { nome: "Headset Usb", preco: 250.00, emEstoque: true },
    { nome: "Webcam 4k", preco: 400.00, emEstoque: false },
    { nome: "Cadeira Gamer", preco: 850.00, emEstoque: true },
];

// --- 2 --- Seleção de elementos do DOM

const vitrine = document.querySelector("#vitrine");
const contadorElemento = document.querySelector("#contador");
const inputBusca = document.querySelector("#campo-busca");

//--- 3 --- Estado da aplicação - Quantidade de itens no carrinho (ALTERÁVEL)
let qtdCarrinho = 0;

// --- 4 --- Funções principais da aplicação - renderização (Desenham na tela).
function renderizarProdutos(listaParaExibir){
    vitrine.innerHTML = ""; // Limpa a vitrine antes de renderizar

    listaParaExibir.forEach((produto, index) =>{
        // Criamos o html dinamicamente
        const card = `
        <div class="card-produto">
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <button type="button" onclick="adicionarAoCarrinho(${index})" ${produto.emEstoque ? "" : "disabled"}>
                ${produto.emEstoque ? "comprar" : "Indisponível"}
            </button>
        </div>
        `;    
        vitrine.innerHTML += card;
    });
};

renderizarProdutos(produtos);

// --- 5 --- Funções de logica e interação.


function filtrarDisponiveis(){
    const disponiveis = produtos.filter(produto => produto.emEstoque === true);
    renderizarProdutos(disponiveis);
};

function filtrarIndisponiveis(){
    const indisponiveis = produtos.filter(produto => produto.emEstoque === false);
    renderizarProdutos(indisponiveis);
}

function mostrarTodos(){
    renderizarProdutos(produtos);
};

function adicionarAoCarrinho(index) {
    const item = produtos[index];
    qtdCarrinho ++;

    contadorElemento.innerText = qtdCarrinho;
    console.log(`Adicionado: ${item.nome} ao carrinho.`);
}

function buscarProduto() {
    const termoBusca = inputBusca.value.toLowerCase();
    const resultado = produtos.filter(produto => {
        return produto.nome.toLowerCase().includes(termoBusca);
    });
    renderizarProdutos(resultado);
}

//--- 6 --- Inicialização ---
// faz a primeira renderização ao carregar a página.
renderizarProdutos(produtos);