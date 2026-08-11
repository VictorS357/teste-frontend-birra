const db = require('../models');

async function listarClientes() {
    const clientes = await db.Cliente.findAll({
        order: [
            ['nome', 'ASC']
        ] 
    });

    return clientes;
}

module.exports = {
    listarClientes
};