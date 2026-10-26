import type { ID, ItemCarrinho } from './types.js';
import { buscarProdutoPorId } from './produtos.js';

let carrinho: ItemCarrinho[] = [];

function adicionarAoCarrinho(produtoId: ID, quantidade: number): boolean {
    if (quantidade <= 0) {
        console.log('Erro: a quantidade deve ser maior que zero.');
        return false;
    }

    const produto = buscarProdutoPorId(produtoId);
    if (!produto) {
        console.log(`Erro: o produto ${produtoId} não existe.`);
        return false;
    }

    const item = carrinho.find((i) => i.produtoId === produtoId);

    // Se o produto já está no carrinho, soma a quantidade (não cria outra linha)
    if (item) {
        if (item.quantidade + quantidade > produto.estoque) {
            console.log(`Erro: estoque insuficiente de ${produto.nome}. Disponível: ${produto.estoque}.`);
            return false;
        }
        item.quantidade = item.quantidade + quantidade;
    } else {
        if (quantidade > produto.estoque) {
            console.log(`Erro: estoque insuficiente de ${produto.nome}. Disponível: ${produto.estoque}.`);
            return false;
        }
        carrinho.push({ produtoId: produtoId, quantidade: quantidade });
    }

    console.log(`${produto.nome} adicionado ao carrinho.`);
    return true;
}

function removerDoCarrinho(produtoId: ID): boolean {
    const item = carrinho.find((i) => i.produtoId === produtoId);
    if (!item) {
        console.log(`Erro: o produto ${produtoId} não está no carrinho.`);
        return false;
    }

    carrinho = carrinho.filter((i) => i.produtoId !== produtoId);
    console.log(`Produto ${produtoId} removido do carrinho.`);
    return true;
}

function alterarQuantidade(produtoId: ID, quantidade: number): boolean {
    if (quantidade <= 0) {
        console.log('Erro: a quantidade deve ser maior que zero.');
        return false;
    }

    const item = carrinho.find((i) => i.produtoId === produtoId);
    const produto = buscarProdutoPorId(produtoId);
    if (!item || !produto) {
        console.log(`Erro: o produto ${produtoId} não está no carrinho.`);
        return false;
    }
    if (quantidade > produto.estoque) {
        console.log(`Erro: estoque insuficiente de ${produto.nome}. Disponível: ${produto.estoque}.`);
        return false;
    }

    item.quantidade = quantidade;
    console.log(`Quantidade de ${produto.nome} alterada para ${quantidade}.`);
    return true;
}

function listarCarrinho(): ItemCarrinho[] {
    return carrinho;
}

// Subtotal = preço x quantidade
function calcularSubtotal(item: ItemCarrinho): number {
    const produto = buscarProdutoPorId(item.produtoId);
    if (!produto) {
        return 0;
    }
    return produto.preco * item.quantidade;
}

// Total = soma dos subtotais
function calcularTotal(): number {
    return carrinho.reduce((total, item) => total + calcularSubtotal(item), 0);
}

function limparCarrinho(): void {
    carrinho = [];
}

export {
    adicionarAoCarrinho,
    removerDoCarrinho,
    alterarQuantidade,
    listarCarrinho,
    calcularSubtotal,
    calcularTotal,
    limparCarrinho
};
