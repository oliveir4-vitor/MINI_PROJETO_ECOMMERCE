export type ID = number;

export type Produto = {
    id: ID;
    nome: string;
    categoria: string;
    preco: number;
    estoque: number;
};

export type Cliente = {
    id: ID;
    nome: string;
    email: string;
};

// O carrinho guarda só o id do produto e a quantidade
export type ItemCarrinho = {
    produtoId: ID;
    quantidade: number;
};

// No pedido guardamos também o nome e o preço do momento da compra,
// assim se o preço mudar depois, o pedido antigo não muda
export type ItemPedido = {
    produtoId: ID;
    nomeProduto: string;
    categoria: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
};

export type Pedido = {
    id: ID;
    clienteId: ID;
    itens: ItemPedido[];
    total: number;
    data: Date;
};
