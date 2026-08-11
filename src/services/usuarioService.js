const db = require('../models');

async function listarUsuarios() {
    const usuarios = await db.Usuario.findAll({
        order: [
            ['id', 'ASC']
        ]
    });

    return usuarios;
}

module.exports = {
    listarUsuarios
};