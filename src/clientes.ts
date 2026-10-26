import type { Cliente, ID } from './types.js';

// O sistema começa com 3 clientes
const clientes: Cliente[] = [
    { id: 1, nome: 'João da Silva', email: 'joao@email.com' },
    { id: 2, nome: 'Maria Oliveira', email: 'maria@email.com' },
    { id: 3, nome: 'Carlos Souza', email: 'carlos@email.com' }
];

function cadastrarCliente(cliente: Cliente): boolean {
    if (cliente.nome.trim() === '' || cliente.email.trim() === '') {
        console.log('Erro: nome e e-mail devem ser informados.');
        return false;
    }
    if (buscarClientePorId(cliente.id)) {
        console.log(`Erro: já existe um cliente com o id ${cliente.id}.`);
        return false;
    }
    const emailRepetido = clientes.find((c) => c.email === cliente.email);
    if (emailRepetido) {
        console.log(`Erro: o e-mail ${cliente.email} já está cadastrado.`);
        return false;
    }

    clientes.push(cliente);
    console.log(`Cliente ${cliente.nome} cadastrado.`);
    return true;
}

function listarClientes(): Cliente[] {
    return clientes;
}

function buscarClientePorId(id: ID): Cliente | undefined {
    return clientes.find((cliente) => cliente.id === id);
}

export {
    cadastrarCliente,
    listarClientes,
    buscarClientePorId
};
