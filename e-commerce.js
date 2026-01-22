let produtos = [];
let listaCarrinho =[];
// --- 2 --- Seleção de elementos do DOM

const vitrine = document.querySelector("#vitrine");
const contadorElemento = document.querySelector("#contador");
const inputBusca = document.querySelector("#campo-busca");

async function buscarProdutosAPI(){

    vitrine.innerHTML =`
    <div class="loading">
        <p> A carregar produtos incriveis para você...<p>
    </div>
    `;

    try{
        const resposta = await fetch('https://fakestoreapi.com/products');

        if(!resposta.ok){
           throw new Error("Não foi possível contatar o servidor."); 
        }
        const dados  = await resposta.json();

        produtos = dados.map(item => ({
            nome: item.title,
            preco: item.price,
            imagem: item.image,
            categoria: item.category,
            emEstoque: true
        }));

        renderizarProdutos(produtos);
    } catch (erro){
        console.error(`Erro Fatall:`, erro);
        vitrine.innerHTML = `
        <div  class="erro-container">
            <p> ⚠️ Ups! Tivemos um problema ao carregar a loja.</p>
            <button type="button onclick="buscarProdutosAPI()">Tentar Novamente</button>
        </div>
        `;
    }
};

//--- 3 --- Estado da aplicação - Quantidade de itens no carrinho (ALTERÁVEL)

// --- 4 --- Funções principais da aplicação - renderização (Desenham na tela).
function renderizarProdutos(listaParaExibir){
    vitrine.innerHTML = ""; // Limpa a vitrine antes de renderizar

    listaParaExibir.forEach((produto, index) =>{
        // Criamos o html dinamicamente
        const card = `
        <div class="card-produto">
            <img src="${produto.imagem}" alt="${produto.nome}" class="foto-produto">

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
    listaCarrinho.push(item)

    contadorElemento.innerText = listaCarrinho.length;

    contadorElemento.classList.add("pulso");
    setTimeout(( ) => {
        contadorElemento.classList.remove("pulso")
    }, 200);

    salvarCarrinhoNoStorage();

    alert(`Você adicionou ${item.nome} ao carrinho!`);
    salvarCarrinhoNoStorage();
    console.log(`Adicionado: ${item.nome} ao carrinho.`);
}

function buscarProduto() {
    const termoBusca = inputBusca.value.toLowerCase();
    const resultado = produtos.filter(produto => {
        return produto.nome.toLowerCase().includes(termoBusca) ||
        produto.categoria.toLowerCase().includes(termoBusca)
    });
    renderizarProdutos(resultado);
}

function filtrarPorCategoria(categoriaAlvo){
    const filtrados = produtos.filter(p => p.categoria === categoriaAlvo)
    renderizarProdutos(filtrados);
}


//--- 6 --- Inicialização ---
// faz a primeira renderização ao carregar a página.
renderizarProdutos(produtos);

function aplicarCupom(){
    const cupom = document.querySelector("#input-cupom").value;

    if(cupom === "PROMO10"){
        const produtosComDesconto = produtos.map( p =>{
        return {
            ...p, // Espalhamos as propriedades originais(nome, estoque)
            preco: p.preco * 0.9 //Sobrescrevemos apenas o preço
        };
    });

    renderizarProdutos(produtosComDesconto);
    alert("Cupon aplicado! 10% de desconto em tudo. ")
    } else {
        alert("Cupom inválido!");
    }
}

function salvarCarrinhoNoStorage(){
    localStorage.setItem("carrinhoSalvo", JSON.stringify(listaCarrinho));
}

function carregarCarrinhoDoStorage(){
    const salvo = localStorage.getItem("carrinhoSalvo");
    if(salvo){
         listaCarrinho = JSON.parse(salvo);
         contadorElemento.innerText = listaCarrinho.length;
    }
}

carregarCarrinhoDoStorage();
buscarProdutosAPI()

function limparCarrinho(){
    if(confirm("Deseja realmente remover todos os itens do carrinho?")){

        listaCarrinho = [];

        contadorElemento.innerText = 0;
        localStorage.removeItem("carrinhoSalvo")
        

        console.log("Não há itens no carrinho")
    }
}

function calcularTotal (){
    const total = listaCarrinho.reduce((soma, produto) => soma + produto.preco, 0);
    console.log(`Total da compra: R$ ${total.toFixed(2)}`);
}