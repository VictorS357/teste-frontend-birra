const db = require('../models');

async function listarEquipClientes() {
    const equipClientes = await db.EquipCliente.findAll({
        order: [
            ['id', 'ASC']
        ]
    });

    return equipClientes;
}

module.exports = {
    listarEquipClientes
};