let carrinho = [
    {nome: "Monitor", preco: 800.00},
    {nome: "Teclado", preco: 150.00},
    {nome: "Mouse", preco: 100.00},
]

function calcularTotal(carrinho) {
    let total = 0;
    for (let i of carrinho) {
        total += i.preco;
    } 
    
    if (i.preco > 200) {
        total *= 0.90; // Aplica 10% de desconto para compras com total acima de R$200
    }
    return total;
}

console.log(`O total do carrinho é R$ ${calcularTotal(carrinho).toFixed(2)}`);