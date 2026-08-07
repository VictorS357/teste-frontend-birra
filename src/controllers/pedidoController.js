const pedidoService = require('../services/pedidoService');

async function listarPedidos(req, res) {
    try {
        const pedidos =
            await pedidoService.listarPedidos();

        return res.status(200).json({
            total: pedidos.length,
            data: pedidos
        });
    } catch (error) {
        console.error(
            'Erro ao listar pedidos:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar pedidos.'
        });
    }
}

module.exports = {
    listarPedidos
};