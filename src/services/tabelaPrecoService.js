const db = require('../models');

async function listarTabelaPreco() {
    const tabelaPreco = await db.TabelaPreco.findAll({
        order: [
            ['id', 'ASC']
        ]
    });

    return tabelaPreco;
}

module.exports = {
    listarTabelaPreco
};