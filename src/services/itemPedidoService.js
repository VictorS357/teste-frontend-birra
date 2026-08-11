const db = require('../models');

async function listarItensPedido() {
    const itensPedido = await db.ItemPedido.findAll({
        order: [
            ['id', 'ASC']
        ]
    });

    return itensPedido;
}

module.exports = {
    listarItensPedido
};