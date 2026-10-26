import { listarProdutos } from './produtos.js';
import { listarPedidos } from './pedidos.js';
import { buscarClientePorId } from './clientes.js';

function calcularFaturamento(): number {
    return listarPedidos().reduce((total, pedido) => total + pedido.total, 0);
}

function exibirRelatorioVendas(): void {
    const pedidos = listarPedidos();
    const faturamento = calcularFaturamento();

    console.log(`Quantidade de pedidos: ${pedidos.length}`);
    console.log(`Faturamento total: R$ ${faturamento.toFixed(2)}`);
    if (pedidos.length > 0) {
        console.log(`Valor médio por pedido: R$ ${(faturamento / pedidos.length).toFixed(2)}`);
    }

    console.log('\nPedidos:');
    for (const pedido of pedidos) {
        const cliente = buscarClientePorId(pedido.clienteId);
        const nome = cliente ? cliente.nome : 'Cliente não encontrado';
        console.log(`Pedido ${pedido.id} - ${nome} - R$ ${pedido.total.toFixed(2)} - ${pedido.data.toLocaleString('pt-BR')}`);
        for (const item of pedido.itens) {
            console.log(`   ${item.quantidade}x ${item.nomeProduto} (R$ ${item.precoUnitario.toFixed(2)})`);
        }
    }
}

// Quantidade vendida de cada produto
function exibirProdutosVendidos(): void {
    for (const produto of listarProdutos()) {
        let quantidade = 0;
        for (const pedido of listarPedidos()) {
            for (const item of pedido.itens) {
                if (item.produtoId === produto.id) {
                    quantidade = quantidade + item.quantidade;
                }
            }
        }
        console.log(`${produto.nome}: ${quantidade} vendido(s)`);
    }
}

function exibirEstoque(): void {
    for (const produto of listarProdutos()) {
        console.log(`${produto.nome}: ${produto.estoque} em estoque`);
    }
}

export {
    calcularFaturamento,
    exibirRelatorioVendas,
    exibirProdutosVendidos,
    exibirEstoque
};
