const db = require('../models');

async function listarPedidos() {
    const pedidos = await db.Pedido.findAll({
        order: [
            ['data', 'DESC'],
            ['hora', 'DESC']
        ]
    });

    return pedidos;
}

module.exports = {
    listarPedidos
};