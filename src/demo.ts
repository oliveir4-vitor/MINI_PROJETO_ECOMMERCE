import type { Produto } from './types.js';

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

function mostrarProdutos(lista: Produto[]): void {
    for (const p of lista) {
        console.log(`${p.id} - ${p.nome} - ${p.categoria} - R$ ${p.preco.toFixed(2)} - estoque: ${p.estoque}`);
    }
}

function mostrarCarrinho(): void {
    for (const item of listarCarrinho()) {
        const produto = buscarProdutoPorId(item.produtoId);
        if (produto) {
            console.log(`${item.quantidade}x ${produto.nome} - subtotal: R$ ${calcularSubtotal(item).toFixed(2)}`);
        }
    }
    console.log(`Total: R$ ${calcularTotal().toFixed(2)}`);
}

console.log('===== PRODUTOS =====');
mostrarProdutos(listarProdutos());

console.log('\nCadastrando produtos:');
cadastrarProduto({ id: 7, nome: 'Monitor', categoria: 'Informática', preco: 900, estoque: 4 });
cadastrarProduto({ id: 8, nome: 'Webcam', categoria: 'Informática', preco: 180, estoque: 0 });

console.log('\nBuscar produto com id 3:');
const produto = buscarProdutoPorId(3);
if (produto) {
    console.log(produto.nome);
}

console.log('\nBuscar produtos com "mo" no nome:');
mostrarProdutos(buscarProdutosPorNome('mo'));

console.log('\nProdutos da categoria Áudio:');
mostrarProdutos(filtrarPorCategoria('Áudio'));

console.log('\nAtualizando o preço do mouse para R$ 75:');
atualizarProduto(2, 'Mouse', 'Informática', 75, 30);

console.log('\nRemovendo a webcam (estoque zerado):');
removerProduto(8);
mostrarProdutos(listarProdutos());

console.log('\n===== CLIENTES =====');
cadastrarCliente({ id: 4, nome: 'Ana Pereira', email: 'ana@email.com' });
for (const c of listarClientes()) {
    console.log(`${c.id} - ${c.nome} - ${c.email}`);
}
const cliente = buscarClientePorId(2);
if (cliente) {
    console.log(`Cliente com id 2: ${cliente.nome}`);
}

console.log('\n===== CARRINHO =====');
adicionarAoCarrinho(1, 1); // notebook
adicionarAoCarrinho(2, 2); // mouse
adicionarAoCarrinho(4, 1); // fone
adicionarAoCarrinho(2, 1); // mouse de novo: vira 3, não cria outra linha
mostrarCarrinho();

console.log('\nAlterando a quantidade do fone e removendo o notebook:');
alterarQuantidade(4, 2);
removerDoCarrinho(1);
mostrarCarrinho();

console.log('\n===== PEDIDOS =====');
console.log('Estoque antes da compra:');
exibirEstoque();
finalizarPedido(2);
console.log('\nEstoque depois da compra:');
exibirEstoque();

console.log('\nSegundo pedido (cliente 1):');
adicionarAoCarrinho(6, 2); // cadeira
adicionarAoCarrinho(5, 1); // caixa de som
mostrarCarrinho();
finalizarPedido(1);

console.log('\nMudando o preço da cadeira para R$ 1500. O pedido antigo continua com o preço antigo:');
atualizarProduto(6, 'Cadeira Gamer', 'Móveis', 1500, 1);
for (const pedido of listarPedidosPorCliente(1)) {
    for (const item of pedido.itens) {
        console.log(`Pedido ${pedido.id}: ${item.nomeProduto} comprado por R$ ${item.precoUnitario.toFixed(2)}`);
    }
}

console.log(`\nTotal de pedidos: ${listarPedidos().length}`);
console.log(`Pedidos da Maria: ${listarPedidosPorCliente(2).length}`);
console.log(`Pedidos do Carlos: ${listarPedidosPorCliente(3).length}`);

console.log('\n===== TESTES COM DADOS INVÁLIDOS =====');
console.log('1. Produto com preço negativo:');
cadastrarProduto({ id: 9, nome: 'Pendrive', categoria: 'Informática', preco: -10, estoque: 5 });

console.log('2. Produto com id repetido:');
cadastrarProduto({ id: 1, nome: 'Tablet', categoria: 'Informática', preco: 2000, estoque: 1 });

console.log('3. Produto sem nome:');
cadastrarProduto({ id: 10, nome: '', categoria: 'Informática', preco: 10, estoque: 1 });

console.log('4. Remover produto que ainda tem estoque:');
removerProduto(3);

console.log('5. Cliente com e-mail repetido:');
cadastrarCliente({ id: 5, nome: 'Pedro', email: 'joao@email.com' });

console.log('6. Cliente sem e-mail:');
cadastrarCliente({ id: 6, nome: 'Paula', email: '' });

console.log('7. Quantidade maior que o estoque:');
adicionarAoCarrinho(6, 10);

console.log('8. Quantidade zero:');
adicionarAoCarrinho(3, 0);

console.log('9. Produto que não existe:');
adicionarAoCarrinho(99, 1);

console.log('10. Finalizar com o carrinho vazio:');
finalizarPedido(1);

console.log('11. Finalizar para cliente que não existe:');
adicionarAoCarrinho(3, 1);
finalizarPedido(99);

// O carrinho tem teclado e cadeira. Antes de finalizar, a cadeira fica sem estoque.
// O pedido deve ser recusado e o estoque do teclado não pode mudar.
console.log('12. Item sem estoque na hora de finalizar:');
adicionarAoCarrinho(6, 1);
atualizarProduto(6, 'Cadeira Gamer', 'Móveis', 1500, 0);
finalizarPedido(3);
console.log(`Total de pedidos continua: ${listarPedidos().length}`);
const teclado = buscarProdutoPorId(3);
if (teclado) {
    console.log(`Estoque do teclado continua: ${teclado.estoque}`);
}

console.log('\n===== RELATÓRIOS =====');
exibirRelatorioVendas();
console.log('\nProdutos vendidos:');
exibirProdutosVendidos();
console.log('\nEstoque final:');
exibirEstoque();
