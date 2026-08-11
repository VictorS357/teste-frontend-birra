const db = require('../models');

async function listarClientes() {
    const clientes = await db.Clientes.findAll({
        order: [
            ['nome', 'ASC']
        ] 
    });

    return clientes;
}

module.exports = {
    listarClientes
};