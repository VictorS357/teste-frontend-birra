const db = require('../models');

console.log(Object.keys(db));

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