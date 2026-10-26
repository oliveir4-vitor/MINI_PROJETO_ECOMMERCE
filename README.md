# Miniprojeto E-commerce

Mini-Projeto Avaliativo – Módulo 1, Semana 07 – Desenvolvedor Back-End Node

- **Estudante:** Vitor Aquino de Oliveira
- **Turma:** T6

## Objetivo

Aplicação back-end em TypeScript que simula a operação de uma pequena loja virtual: catálogo de produtos com controle de estoque, cadastro de clientes, carrinho de compras, finalização de pedidos e relatórios de vendas. Os dados ficam em memória (arrays) durante a execução, e o usuário opera o sistema por um menu interativo no terminal (`main.ts`), usando a biblioteca `prompt-sync` para ler as respostas.

## Funcionalidades implementadas

**Produtos**
- Cadastrar, listar, buscar por id, buscar por parte do nome, filtrar por categoria, atualizar e remover.

**Clientes**
- Cadastrar, listar e buscar por id. O sistema inicia com 3 clientes cadastrados.

**Carrinho**
- Adicionar, remover e alterar a quantidade de produtos; listar itens; calcular o subtotal de cada item e o total da compra.

**Pedidos**
- Finalizar a compra de um cliente, gerando um pedido com id, cliente, itens, total e data.
- Consultar todos os pedidos ou os pedidos de um cliente.

**Relatórios**
- Quantidade de pedidos, faturamento total e valor médio por pedido.
- Lista de pedidos com seus itens.
- Quantidade vendida de cada produto e estoque atual.

## Tecnologias utilizadas

- [TypeScript](https://www.typescriptlang.org/) 7
- [Node.js](https://nodejs.org/) 22
- npm
- [prompt-sync](https://www.npmjs.com/package/prompt-sync) (leitura de dados digitados no terminal)

## Estrutura dos arquivos

```
miniprojeto-ecommerce/
├── src/
│   ├── types.ts       # Tipos: Produto, Cliente, ItemCarrinho, ItemPedido, Pedido
│   ├── produtos.ts    # Catálogo inicial e CRUD de produtos com validações
│   ├── clientes.ts    # Clientes iniciais, cadastro e consulta
│   ├── carrinho.ts    # Operações do carrinho, subtotais e total
│   ├── pedidos.ts     # Finalização e consulta de pedidos, baixa de estoque
│   ├── relatorios.ts  # Relatórios de vendas e de estoque
│   ├── main.ts        # Menu interativo (ponto de entrada da aplicação)
│   └── demo.ts        # Demonstração automática, incluindo testes com dados inválidos
├── dist/              # JavaScript gerado pela compilação (não versionado)
├── package.json
├── tsconfig.json
└── README.md
```

## Como compilar e executar

Pré-requisito: Node.js instalado.

```bash
# 1. Instalar as dependências
npm install

# 2. Compilar o TypeScript para JavaScript (gera a pasta dist/)
npm run build      # equivale a: npx tsc

# 3. Executar a aplicação compilada
npm start          # equivale a: node dist/main.js
```

Para compilar e executar de uma vez: `npm run dev`.

Ao iniciar, aparece o menu principal. Digite o número da opção e pressione Enter:

```
===== LOJA VIRTUAL =====
1 - Produtos
2 - Clientes
3 - Carrinho
4 - Pedidos
5 - Relatórios
0 - Sair
```

Cada opção abre um submenu com as operações daquela área. A finalização do pedido fica no menu **Carrinho**. Na atualização de produto, deixar o campo em branco mantém o valor atual. Os ids de produtos e clientes novos são gerados automaticamente.

Para ver a demonstração automática com todas as funcionalidades e os testes com dados inválidos: `npm run demo`.

## Exemplos das principais operações

As funções mostram uma mensagem no terminal e retornam `true` (deu certo) ou `false` (alguma regra não foi cumprida).

```ts
// Cadastrar produto
cadastrarProduto({ id: 7, nome: 'Monitor', categoria: 'Informática', preco: 900, estoque: 4 });
// Produto Monitor cadastrado.

// Buscar por parte do nome
buscarProdutosPorNome('mo'); // Mouse e Monitor

// Atualizar produto (id, nome, categoria, preço, estoque)
atualizarProduto(2, 'Mouse', 'Informática', 75, 30);

// Carrinho
adicionarAoCarrinho(2, 2);   // 2 mouses
adicionarAoCarrinho(2, 1);   // soma na mesma linha: 3 mouses
alterarQuantidade(4, 2);
calcularTotal();

// Finalizar pedido para o cliente 2
finalizarPedido(2);
// Pedido 1 registrado para Maria Oliveira. Total: R$ 625.00

// Situação inválida
cadastrarProduto({ id: 9, nome: 'Pendrive', categoria: 'Informática', preco: -10, estoque: 5 });
// Erro: o preço deve ser maior que zero.
```

Trecho da saída do `npm run demo`:

```
Alterando a quantidade do fone e removendo o notebook:
Quantidade de Fone de Ouvido alterada para 2.
Produto 1 removido do carrinho.
3x Mouse - subtotal: R$ 225.00
2x Fone de Ouvido - subtotal: R$ 400.00
Total: R$ 625.00
```

## Regras de negócio implementadas

**Produtos**
- O id deve ser único; não é possível cadastrar um produto com id já utilizado.
- O nome não pode estar vazio.
- O preço deve ser maior que zero e o estoque não pode ser negativo (vale para cadastro e atualização).
- Na atualização, os dados são validados antes de alterar o produto; se algum for inválido, nada é modificado.
- Só é possível remover produtos com estoque zerado, para evitar apagar por engano um item ainda à venda.

**Clientes**
- Nome e e-mail são obrigatórios.
- Não é permitido repetir id nem e-mail.

**Carrinho**
- A quantidade deve ser maior que zero.
- Não é possível adicionar produtos inexistentes.
- A quantidade no carrinho não pode ultrapassar o estoque disponível.
- Adicionar um produto que já está no carrinho soma a quantidade na mesma linha.
- Subtotal = preço unitário × quantidade; total = soma dos subtotais.

**Pedidos**
- Não é possível finalizar um pedido sem itens ou para um cliente inexistente.
- A finalização valida todos os itens antes de alterar qualquer dado. Se algum item não tiver estoque suficiente, o pedido não é registrado e nenhum estoque é descontado.
- O estoque é reduzido somente depois que todas as validações passam.
- Cada pedido recebe um id único e sequencial.
- O pedido guarda o nome e o preço de cada produto no momento da compra. Alterar o catálogo depois não muda pedidos antigos.
- Após a finalização, o carrinho é esvaziado.

## Limitações conhecidas

- Os dados ficam apenas em memória e se perdem ao encerrar a aplicação (não há banco de dados nem arquivos de persistência).
- Existe um único carrinho por vez, que é associado ao cliente apenas na finalização do pedido.
- O formato do e-mail não é validado, apenas se foi informado. E-mails iguais com letras maiúsculas diferentes são tratados como diferentes.
- O estoque não é reservado ao adicionar no carrinho; por isso ele é conferido novamente na finalização.
- Não há pagamento, frete, descontos, impostos ou autenticação (fora do escopo do projeto).
