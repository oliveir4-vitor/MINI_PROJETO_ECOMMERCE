import type { ID, ItemPedido, Pedido } from './types.js';
import { buscarClientePorId } from './clientes.js';
import { buscarProdutoPorId } from './produtos.js';
import { listarCarrinho, limparCarrinho } from './carrinho.js';

const pedidos: Pedido[] = [];

// Usado para gerar um id diferente para cada pedido
let proximoId = 1;

function finalizarPedido(clienteId: ID): boolean {
    const cliente = buscarClientePorId(clienteId);
    if (!cliente) {
        console.log(`Erro: o cliente ${clienteId} não existe.`);
        return false;
    }

    const carrinho = listarCarrinho();
    if (carrinho.length === 0) {
        console.log('Erro: o carrinho está vazio.');
        return false;
    }

    // 1º passo: conferir TODOS os itens antes de mexer no estoque.
    // Se um item falhar, o pedido não é registrado e nenhum estoque é descontado.
    const itens: ItemPedido[] = [];
    for (const item of carrinho) {
        const produto = buscarProdutoPorId(item.produtoId);
        if (!produto) {
            console.log(`Erro: o produto ${item.produtoId} não existe mais.`);
            return false;
        }
        if (item.quantidade > produto.estoque) {
            console.log(`Erro: estoque insuficiente de ${produto.nome}. Disponível: ${produto.estoque}.`);
            return false;
        }
        // Guarda o preço de agora
        itens.push({
            produtoId: produto.id,
            nomeProduto: produto.nome,
            categoria: produto.categoria,
            quantidade: item.quantidade,
            precoUnitario: produto.preco,
            subtotal: produto.preco * item.quantidade
        });
    }

    // 2º passo: tudo certo, então desconta o estoque
    for (const item of itens) {
        const produto = buscarProdutoPorId(item.produtoId);
        if (produto) {
            produto.estoque = produto.estoque - item.quantidade;
        }
    }

    const pedido: Pedido = {
        id: proximoId,
        clienteId: clienteId,
        itens: itens,
        total: itens.reduce((total, item) => total + item.subtotal, 0),
        data: new Date()
    };
    pedidos.push(pedido);
    proximoId++;

    limparCarrinho();
    console.log(`Pedido ${pedido.id} registrado para ${cliente.nome}. Total: R$ ${pedido.total.toFixed(2)}`);
    return true;
}

function listarPedidos(): Pedido[] {
    return pedidos;
}

function listarPedidosPorCliente(clienteId: ID): Pedido[] {
    return pedidos.filter((pedido) => pedido.clienteId === clienteId);
}

export {
    finalizarPedido,
    listarPedidos,
    listarPedidosPorCliente
};
