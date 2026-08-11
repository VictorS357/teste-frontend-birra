const clienteService = require('../services/clienteService');

async function listarClientes(req, res) {
    try {
        const clientes =
            await clienteService.listarClientes();

        return res.status(200).json({
            total: clientes.length,
            data: clientes
        });
    } catch (error) {
        console.error(
            'Erro ao listar clientes:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar clientes'
        });
    }
}

module.exports = {
    listarClientes
};