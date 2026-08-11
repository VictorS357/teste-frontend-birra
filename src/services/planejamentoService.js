const db = require('../models');

async function listarPlanejamentos() {
    const planejamentos = await db.Planejamento.findAll({
        order: [
            ['dataSolicitacao', 'DESC']
        ]
    });

    return planejamentos;
}

module.exports = {
    listarPlanejamentos
};