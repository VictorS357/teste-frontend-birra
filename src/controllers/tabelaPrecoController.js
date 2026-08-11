const tabelaPrecoService = require('../services/tabelaPrecoService');

async function listarTabelaPreco(req, res) {
    try {
        const registros =
            await tabelaPrecoService.listarTabelaPreco();

        return res.status(200).json({
            total: registros.length,
            data: registros
        });
    } catch (error) {
        console.error(
            'Erro ao listar tabela de preços:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar tabela de preços'
        });
    }
}

module.exports = {
    listarTabelaPreco
};