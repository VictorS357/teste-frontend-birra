const db = require('../models');

async function listarHistoricoMovimentacoes() {
    const historicoMovimentacoes = await db.HistoricoMovimentacao.findAll({
        order: [
            ['data', 'DESC']
        ]
    });

    return historicoMovimentacoes;
}

module.exports = {
    listarHistoricoMovimentacoes
};