const itemPedidoService = require('../services/itemPedidoService');

async function listarItensPedido(req, res) {
    try {
        const itens =
            await itemPedidoService.listarItensPedido();

        return res.status(200).json({
            total: itens.length,
            data: itens
        });
    } catch (error) {
        console.error(
            'Erro ao listar itens de pedido:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar itens de pedido'
        });
    }
}

module.exports = {
    listarItensPedido
};