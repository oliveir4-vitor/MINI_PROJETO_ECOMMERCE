import PromptSync from 'prompt-sync';
import type { Pedido, Produto } from './types.js';

import {
    cadastrarProduto,
    listarProdutos,
    buscarProdutoPorId,
    buscarProdutosPorNome,
    filtrarPorCategoria,
    atualizarProduto,
    removerProduto
} from './produtos.js';

import { cadastrarCliente, listarClientes, buscarClientePorId } from './clientes.js';
import {
    adicionarAoCarrinho,
    removerDoCarrinho,
    alterarQuantidade,
    listarCarrinho,
    calcularSubtotal,
    calcularTotal
} from './carrinho.js';
import { finalizarPedido, listarPedidos, listarPedidosPorCliente } from './pedidos.js';
import { exibirRelatorioVendas, exibirProdutosVendidos, exibirEstoque } from './relatorios.js';

// sigint: true permite sair com Ctrl+C
const prompt = PromptSync({ sigint: true });

// ===== Funções de leitura =====

function lerTexto(pergunta: string): string {
    const resposta = prompt(pergunta);
    // prompt devolve null quando a entrada termina (Ctrl+D): responde '0' para voltar até sair
    if (resposta === null) {
        return '0';
    }
    return resposta.trim();
}

// Repete a pergunta até o usuário digitar um número válido
function lerNumero(pergunta: string): number {
    while (true) {
        const texto = lerTexto(pergunta).replace(',', '.');
        const numero = Number(texto);
        if (texto !== '' && !isNaN(numero)) {
            return numero;
        }
        console.log('Valor inválido. Digite um número.');
    }
}

// Se o usuário deixar em branco, mantém o valor atual (usado na atualização)
function lerTextoOuManter(pergunta: string, atual: string): string {
    const texto = lerTexto(`${pergunta} [${atual}]: `);
    return texto === '' ? atual : texto;
}

function lerNumeroOuManter(pergunta: string, atual: number): number {
    while (true) {
        const texto = lerTexto(`${pergunta} [${atual}]: `).replace(',', '.');
        if (texto === '') {
            return atual;
        }
        const numero = Number(texto);
        if (!isNaN(numero)) {
            return numero;
        }
        console.log('Valor inválido. Digite um número.');
    }
}

function pausar(): void {
    lerTexto('\nPressione Enter para continuar...');
}

// Próximo id = maior id da lista + 1
function proximoId(lista: { id: number }[]): number {
    return lista.reduce((maior, item) => (item.id > maior ? item.id : maior), 0) + 1;
}

// ===== Funções de exibição =====

function mostrarProdutos(lista: Produto[]): void {
    if (lista.length === 0) {
        console.log('Nenhum produto encontrado.');
        return;
    }
    for (const p of lista) {
        console.log(`${p.id} - ${p.nome} - ${p.categoria} - R$ ${p.preco.toFixed(2)} - estoque: ${p.estoque}`);
    }
}

function mostrarClientes(): void {
    for (const c of listarClientes()) {
        console.log(`${c.id} - ${c.nome} - ${c.email}`);
    }
}

function mostrarCarrinho(): void {
    const itens = listarCarrinho();
    if (itens.length === 0) {
        console.log('O carrinho está vazio.');
        return;
    }
    for (const item of itens) {
        const produto = buscarProdutoPorId(item.produtoId);
        if (produto) {
            console.log(`${produto.id} - ${item.quantidade}x ${produto.nome} - subtotal: R$ ${calcularSubtotal(item).toFixed(2)}`);
        }
    }
    console.log(`Total: R$ ${calcularTotal().toFixed(2)}`);
}

// ===== Menu de produtos =====

function menuProdutos(): void {
    let opcao: string;
    do {
        console.log('\n===== PRODUTOS =====');
        console.log('1 - Listar produtos');
        console.log('2 - Cadastrar produto');
        console.log('3 - Buscar por id');
        console.log('4 - Buscar por nome');
        console.log('5 - Filtrar por categoria');
        console.log('6 - Atualizar produto');
        console.log('7 - Remover produto');
        console.log('0 - Voltar');
        opcao = lerTexto('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                mostrarProdutos(listarProdutos());
                pausar();
                break;
            case '2': {
                const nome = lerTexto('Nome: ');
                const categoria = lerTexto('Categoria: ');
                const preco = lerNumero('Preço: R$ ');
                const estoque = lerNumero('Estoque: ');
                cadastrarProduto({ id: proximoId(listarProdutos()), nome, categoria, preco, estoque });
                pausar();
                break;
            }
            case '3': {
                const produto = buscarProdutoPorId(lerNumero('Id do produto: '));
                mostrarProdutos(produto ? [produto] : []);
                pausar();
                break;
            }
            case '4':
                mostrarProdutos(buscarProdutosPorNome(lerTexto('Parte do nome: ')));
                pausar();
                break;
            case '5':
                mostrarProdutos(filtrarPorCategoria(lerTexto('Categoria: ')));
                pausar();
                break;
            case '6': {
                const id = lerNumero('Id do produto: ');
                const produto = buscarProdutoPorId(id);
                if (!produto) {
                    console.log(`Erro: produto ${id} não encontrado.`);
                } else {
                    console.log('Deixe em branco para manter o valor atual.');
                    const nome = lerTextoOuManter('Nome', produto.nome);
                    const categoria = lerTextoOuManter('Categoria', produto.categoria);
                    const preco = lerNumeroOuManter('Preço', produto.preco);
                    const estoque = lerNumeroOuManter('Estoque', produto.estoque);
                    atualizarProduto(id, nome, categoria, preco, estoque);
                }
                pausar();
                break;
            }
            case '7':
                removerProduto(lerNumero('Id do produto: '));
                pausar();
                break;
            case '0':
                break;
            default:
                console.log('Opção inválida.');
        }
    } while (opcao !== '0');
}

// ===== Menu de clientes =====

function menuClientes(): void {
    let opcao: string;
    do {
        console.log('\n===== CLIENTES =====');
        console.log('1 - Listar clientes');
        console.log('2 - Cadastrar cliente');
        console.log('3 - Buscar por id');
        console.log('0 - Voltar');
        opcao = lerTexto('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                mostrarClientes();
                pausar();
                break;
            case '2': {
                const nome = lerTexto('Nome: ');
                const email = lerTexto('E-mail: ');
                cadastrarCliente({ id: proximoId(listarClientes()), nome, email });
                pausar();
                break;
            }
            case '3': {
                const id = lerNumero('Id do cliente: ');
                const cliente = buscarClientePorId(id);
                if (cliente) {
                    console.log(`${cliente.id} - ${cliente.nome} - ${cliente.email}`);
                } else {
                    console.log(`Cliente ${id} não encontrado.`);
                }
                pausar();
                break;
            }
            case '0':
                break;
            default:
                console.log('Opção inválida.');
        }
    } while (opcao !== '0');
}

// ===== Menu do carrinho =====

function menuCarrinho(): void {
    let opcao: string;
    do {
        console.log('\n===== CARRINHO =====');
        console.log('1 - Ver carrinho');
        console.log('2 - Adicionar produto');
        console.log('3 - Alterar quantidade');
        console.log('4 - Remover produto');
        console.log('5 - Finalizar pedido');
        console.log('0 - Voltar');
        opcao = lerTexto('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                mostrarCarrinho();
                pausar();
                break;
            case '2': {
                mostrarProdutos(listarProdutos());
                const produtoId = lerNumero('Id do produto: ');
                const quantidade = lerNumero('Quantidade: ');
                adicionarAoCarrinho(produtoId, quantidade);
                pausar();
                break;
            }
            case '3': {
                mostrarCarrinho();
                const produtoId = lerNumero('Id do produto: ');
                const quantidade = lerNumero('Nova quantidade: ');
                alterarQuantidade(produtoId, quantidade);
                pausar();
                break;
            }
            case '4':
                mostrarCarrinho();
                removerDoCarrinho(lerNumero('Id do produto: '));
                pausar();
                break;
            case '5':
                mostrarCarrinho();
                mostrarClientes();
                finalizarPedido(lerNumero('Id do cliente: '));
                pausar();
                break;
            case '0':
                break;
            default:
                console.log('Opção inválida.');
        }
    } while (opcao !== '0');
}

// ===== Menu de pedidos =====

function menuPedidos(): void {
    let opcao: string;
    do {
        console.log('\n===== PEDIDOS =====');
        console.log('1 - Listar todos os pedidos');
        console.log('2 - Pedidos de um cliente');
        console.log('0 - Voltar');
        opcao = lerTexto('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                mostrarPedidos(listarPedidos());
                pausar();
                break;
            case '2':
                mostrarPedidos(listarPedidosPorCliente(lerNumero('Id do cliente: ')));
                pausar();
                break;
            case '0':
                break;
            default:
                console.log('Opção inválida.');
        }
    } while (opcao !== '0');
}

function mostrarPedidos(pedidos: Pedido[]): void {
    if (pedidos.length === 0) {
        console.log('Nenhum pedido encontrado.');
        return;
    }
    for (const pedido of pedidos) {
        const cliente = buscarClientePorId(pedido.clienteId);
        const nome = cliente ? cliente.nome : 'Cliente não encontrado';
        console.log(`Pedido ${pedido.id} - ${nome} - R$ ${pedido.total.toFixed(2)} - ${pedido.data.toLocaleString('pt-BR')}`);
        for (const item of pedido.itens) {
            console.log(`   ${item.quantidade}x ${item.nomeProduto} (R$ ${item.precoUnitario.toFixed(2)})`);
        }
    }
}

// ===== Menu de relatórios =====

function menuRelatorios(): void {
    let opcao: string;
    do {
        console.log('\n===== RELATÓRIOS =====');
        console.log('1 - Relatório de vendas');
        console.log('2 - Produtos vendidos');
        console.log('3 - Estoque atual');
        console.log('0 - Voltar');
        opcao = lerTexto('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                exibirRelatorioVendas();
                pausar();
                break;
            case '2':
                exibirProdutosVendidos();
                pausar();
                break;
            case '3':
                exibirEstoque();
                pausar();
                break;
            case '0':
                break;
            default:
                console.log('Opção inválida.');
        }
    } while (opcao !== '0');
}

// ===== Menu principal =====

let opcao: string;
do {
    console.log('\n===== LOJA VIRTUAL =====');
    console.log('1 - Produtos');
    console.log('2 - Clientes');
    console.log('3 - Carrinho');
    console.log('4 - Pedidos');
    console.log('5 - Relatórios');
    console.log('0 - Sair');
    opcao = lerTexto('Escolha uma opção: ');

    switch (opcao) {
        case '1':
            menuProdutos();
            break;
        case '2':
            menuClientes();
            break;
        case '3':
            menuCarrinho();
            break;
        case '4':
            menuPedidos();
            break;
        case '5':
            menuRelatorios();
            break;
        case '0':
            console.log('Até logo!');
            break;
        default:
            console.log('Opção inválida.');
    }
} while (opcao !== '0');
