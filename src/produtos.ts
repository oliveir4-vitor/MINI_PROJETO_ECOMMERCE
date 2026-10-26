import type { ID, Produto } from './types.js';

// Produtos
let produtos: Produto[] = [
    { id: 1, nome: 'Notebook', categoria: 'Informática', preco: 3500, estoque: 5 },
    { id: 2, nome: 'Mouse', categoria: 'Informática', preco: 80, estoque: 30 },
    { id: 3, nome: 'Teclado', categoria: 'Informática', preco: 250, estoque: 10 },
    { id: 4, nome: 'Fone de Ouvido', categoria: 'Áudio', preco: 200, estoque: 15 },
    { id: 5, nome: 'Caixa de Som', categoria: 'Áudio', preco: 150, estoque: 8 },
    { id: 6, nome: 'Cadeira Gamer', categoria: 'Móveis', preco: 1200, estoque: 3 }
];

// Confere as regras do produto usada no cadastro e na atualização
function validarProduto(nome: string, preco: number, estoque: number): boolean {
    if (nome.trim() === '') {
        console.log('Erro: o nome do produto não pode estar vazio.');
        return false;
    }
    if (preco <= 0) {
        console.log('Erro: o preço deve ser maior que zero.');
        return false;
    }
    if (estoque < 0) {
        console.log('Erro: o estoque não pode ser negativo.');
        return false;
    }
    return true;
}

function cadastrarProduto(produto: Produto): boolean {
    if (buscarProdutoPorId(produto.id)) {
        console.log(`Erro: já existe um produto com o id ${produto.id}.`);
        return false;
    }
    if (!validarProduto(produto.nome, produto.preco, produto.estoque)) {
        return false;
    }

    produtos.push(produto);
    console.log(`Produto ${produto.nome} cadastrado.`);
    return true;
}

function listarProdutos(): Produto[] {
    return produtos;
}

function buscarProdutoPorId(id: ID): Produto | undefined {
    return produtos.find((produto) => produto.id === id);
}

// Procura parte do nome, sem diferenciar maiúsculas e minúsculas
function buscarProdutosPorNome(nome: string): Produto[] {
    return produtos.filter((produto) => produto.nome.toLowerCase().includes(nome.toLowerCase()));
}

function filtrarPorCategoria(categoria: string): Produto[] {
    return produtos.filter((produto) => produto.categoria.toLowerCase() === categoria.toLowerCase());
}

function atualizarProduto(id: ID, nome: string, categoria: string, preco: number, estoque: number): boolean {
    const produto = buscarProdutoPorId(id);
    if (!produto) {
        console.log(`Erro: produto ${id} não encontrado.`);
        return false;
    }
    // Valida antes de alterar, para não deixar o produto com dados errados
    if (!validarProduto(nome, preco, estoque)) {
        return false;
    }

    produto.nome = nome;
    produto.categoria = categoria;
    produto.preco = preco;
    produto.estoque = estoque;
    console.log(`Produto ${id} atualizado.`);
    return true;
}

// Regra do sistema: só pode remover produto com estoque zerado,
// para não apagar por engano um produto que ainda está à venda
function removerProduto(id: ID): boolean {
    const produto = buscarProdutoPorId(id);
    if (!produto) {
        console.log(`Erro: produto ${id} não encontrado.`);
        return false;
    }
    if (produto.estoque > 0) {
        console.log(`Erro: o produto ${produto.nome} ainda tem ${produto.estoque} em estoque.`);
        return false;
    }

    produtos = produtos.filter((p) => p.id !== id);
    console.log(`Produto ${produto.nome} removido.`);
    return true;
}

export {
    cadastrarProduto,
    listarProdutos,
    buscarProdutoPorId,
    buscarProdutosPorNome,
    filtrarPorCategoria,
    atualizarProduto,
    removerProduto
};
